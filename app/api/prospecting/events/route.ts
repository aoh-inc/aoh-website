import { NextRequest, NextResponse } from "next/server";
import { classifyCampaignReply, normalizeCampaignLane } from "@/lib/campaign-reply-router";
import { createAgentTask, logEmailEvent } from "@/lib/ops-store";
import { updateVisibilityReportsByEmail } from "@/lib/visibility-reports";

type ProspectingEventKind =
  | "reply"
  | "opt_out"
  | "not_interested"
  | "ooo"
  | "hard_bounce"
  | "complaint"
  | "form_fill"
  | "purchase"
  | "sent"
  | "click"
  | "unknown";

type ProspectingEvent = {
  kind: ProspectingEventKind;
  email: string;
  businessName: string;
  replyText: string;
  campaignLane: ReturnType<typeof normalizeCampaignLane>;
  providerId: string;
  rawEventType: string;
  payload: Record<string, unknown>;
};

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const event = normalizeProspectingEvent(body);
  if (!event.email && event.kind !== "unknown") {
    return NextResponse.json({ ok: false, error: "Missing lead email for prospecting event." }, { status: 400 });
  }

  const decision = decideEvent(event);
  const effects = await applyEventEffects(event, decision);

  return NextResponse.json({
    ok: true,
    event: {
      kind: event.kind,
      email: event.email || null,
      businessName: event.businessName || null,
      rawEventType: event.rawEventType || null,
      campaignLane: event.campaignLane,
    },
    decision,
    effects,
  });
}

function decideEvent(event: ProspectingEvent) {
  if (event.kind === "reply") {
    return classifyCampaignReply({
      replyText: event.replyText,
      lane: event.campaignLane,
    });
  }

  if (event.kind === "opt_out") {
    return {
      intent: "optout" as const,
      lane: event.campaignLane,
      tags: ["gmf_reply_optout", "gmf_global_suppression", "gmf_sequence_stop"],
      shouldGenerateReport: false,
      shouldSendBookingLink: false,
      shouldCreateHumanTask: false,
      shouldStopSequence: true,
      shouldSuppressContact: true,
      reason: "Provider event is an opt-out/unsubscribe.",
    };
  }

  if (event.kind === "hard_bounce" || event.kind === "complaint") {
    return {
      intent: "optout" as const,
      lane: event.campaignLane,
      tags: ["gmf_global_suppression", "gmf_sequence_stop", `gmf_${event.kind}`],
      shouldGenerateReport: false,
      shouldSendBookingLink: false,
      shouldCreateHumanTask: event.kind === "complaint",
      shouldStopSequence: true,
      shouldSuppressContact: true,
      reason: event.kind === "hard_bounce" ? "Provider event is a hard bounce." : "Provider event is a spam complaint.",
    };
  }

  if (event.kind === "form_fill" || event.kind === "purchase") {
    return {
      intent: "interested" as const,
      lane: event.campaignLane,
      tags: ["gmf_sequence_stop", `gmf_${event.kind}`],
      shouldGenerateReport: event.kind === "form_fill",
      shouldSendBookingLink: false,
      shouldCreateHumanTask: event.kind === "form_fill",
      shouldStopSequence: true,
      shouldSuppressContact: false,
      reason: event.kind === "form_fill" ? "Lead filled a visibility/report form; stop cold sequence." : "Lead purchased; stop nurture and cold sequence.",
    };
  }

  return {
    intent: "unclear" as const,
    lane: event.campaignLane,
    tags: ["gmf_event_unclear"],
    shouldGenerateReport: false,
    shouldSendBookingLink: false,
    shouldCreateHumanTask: true,
    shouldStopSequence: false,
    shouldSuppressContact: false,
    reason: "Event did not map to a known prospecting action.",
  };
}

async function applyEventEffects(event: ProspectingEvent, decision: ReturnType<typeof decideEvent>) {
  const effects: Array<{ action: string; ok: boolean; detail?: string }> = [];
  const emailEventType = emailEventTypeFor(event, decision);

  const emailLog = await logEmailEvent({
    provider: "smartlead",
    event_type: emailEventType,
    to_email: event.email || "unknown",
    status: event.kind === "hard_bounce" || event.kind === "complaint" ? "failed" : "sent",
    provider_id: event.providerId || undefined,
    payload: {
      kind: event.kind,
      businessName: event.businessName || null,
      rawEventType: event.rawEventType || null,
      campaignLane: event.campaignLane,
      decision,
      payload: event.payload,
    },
  });
  effects.push({ action: `log_email_event:${emailEventType}`, ok: emailLog.ok, detail: emailLog.ok ? undefined : emailLog.error });

  if (event.email && decision.shouldSuppressContact) {
    const reportUpdate = await updateVisibilityReportsByEmail({
      email: event.email,
      reportStatus: event.kind === "hard_bounce" || event.kind === "complaint" ? "blocked" : "closed",
      leadStatus: event.kind === "hard_bounce" ? "hard_bounced" : event.kind === "complaint" ? "complained" : "suppressed",
      nextAction: "Do not contact. Prospecting event triggered suppression.",
      blocker: "",
      metadata: {
        prospectingEvent: event.kind,
        rawEventType: event.rawEventType,
        decision,
        updatedAt: new Date().toISOString(),
      },
    });
    effects.push({ action: "update_visibility_reports_by_email", ok: reportUpdate.ok, detail: reportUpdate.ok ? undefined : reportUpdate.error });
  }

  if (event.email && (event.kind === "form_fill" || event.kind === "purchase")) {
    const reportUpdate = await updateVisibilityReportsByEmail({
      email: event.email,
      reportStatus: event.kind === "purchase" ? "closed" : "sent",
      leadStatus: event.kind === "purchase" ? "purchased_get_found" : "form_fill_stop_cold_sequence",
      nextAction: event.kind === "purchase" ? "Stop nurture and start paid onboarding." : "Stop cold sequence and continue report/nurture workflow.",
      blocker: "",
      metadata: {
        prospectingEvent: event.kind,
        rawEventType: event.rawEventType,
        decision,
        updatedAt: new Date().toISOString(),
      },
    });
    effects.push({ action: "update_visibility_reports_by_email", ok: reportUpdate.ok, detail: reportUpdate.ok ? undefined : reportUpdate.error });
  }

  if (decision.shouldCreateHumanTask) {
    const task = await createAgentTask({
      title: `Prospecting reply/event needs Sales Rep - ${event.businessName || event.email || "unknown"}`,
      kind: "gmf_prospecting_event",
      priority: decision.intent === "interested" || decision.intent === "book" ? "high" : "normal",
      source: "smartlead/prospecting-events",
      payload: {
        email: event.email || null,
        businessName: event.businessName || null,
        eventKind: event.kind,
        replyText: event.replyText || null,
        decision,
        nextAction: "Sales Rep routes interested replies, OOO, unclear replies, and form-fill handoffs. Do not ask Mike unless approval or reputation risk is present.",
      },
    });
    effects.push({ action: "create_agent_task", ok: task.ok, detail: task.ok ? undefined : task.error });
  }

  return effects;
}

function emailEventTypeFor(event: ProspectingEvent, decision: ReturnType<typeof decideEvent>) {
  if (event.kind === "opt_out" || decision.intent === "optout") return "unsubscribe";
  if (decision.intent === "not_interested") return "do_not_contact";
  if (event.kind === "hard_bounce") return "hard_bounce";
  if (event.kind === "complaint") return "complaint";
  if (event.kind === "form_fill") return "form_fill";
  if (event.kind === "purchase") return "purchase";
  if (event.kind === "reply") return "reply";
  return `gmf_prospecting_${event.kind}`;
}

function normalizeProspectingEvent(body: Record<string, unknown>): ProspectingEvent {
  const rawEventType = pickString(body, ["event_type", "eventType", "type", "event", "webhook_type"]);
  const replyText =
    pickString(body, ["reply_text", "replyText", "message", "body", "text"]) ??
    pickNestedString(body, ["reply", "body"]) ??
    pickNestedString(body, ["email", "body"]) ??
    "";
  const email =
    pickString(body, ["email", "lead_email", "to_email", "from_email"]) ??
    pickNestedString(body, ["lead", "email"]) ??
    pickNestedString(body, ["data", "email"]) ??
    "";
  const businessName =
    pickString(body, ["business_name", "businessName", "company_name", "companyName", "company"]) ??
    pickNestedString(body, ["lead", "company_name"]) ??
    pickNestedString(body, ["lead", "company"]) ??
    "";

  return {
    kind: normalizeEventKind(rawEventType, replyText),
    email: normalizeEmail(email),
    businessName,
    replyText,
    campaignLane: normalizeCampaignLane(
      pickString(body, ["campaign_lane", "campaignLane", "lane", "campaign"]) ??
        pickNestedString(body, ["customData", "campaignLane"]) ??
        "gmf_visibility",
    ),
    providerId:
      pickString(body, ["id", "event_id", "eventId", "lead_id", "leadId", "message_id", "messageId"]) ??
      pickNestedString(body, ["lead", "id"]) ??
      "",
    rawEventType: rawEventType || "",
    payload: safePayload(body),
  };
}

function normalizeEventKind(rawEventType: string, replyText: string): ProspectingEventKind {
  const event = rawEventType.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  if (/unsubscribe|opt_out|optout/.test(event)) return "opt_out";
  if (/bounce|bounced|failed/.test(event)) return "hard_bounce";
  if (/complaint|spam/.test(event)) return "complaint";
  if (/form|form_fill|lead_submitted|report_request/.test(event)) return "form_fill";
  if (/purchase|checkout|paid|stripe/.test(event)) return "purchase";
  if (/click/.test(event)) return "click";
  if (/sent|delivered/.test(event)) return "sent";
  if (/reply|replied|message/.test(event) || replyText.trim()) return "reply";
  return "unknown";
}

function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const expected =
    process.env.GMF_PROSPECTING_EVENTS_TOKEN?.trim() ||
    process.env.CAMPAIGN_REPLY_ROUTER_TOKEN?.trim();
  const testBypass = process.env.REPORT_TEST_BYPASS_TOKEN?.trim();
  const provided =
    req.headers.get("x-gmf-prospecting-events-token")?.trim() ??
    req.headers.get("x-campaign-reply-router-token")?.trim() ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();

  if (expected) {
    return provided === expected
      ? { ok: true }
      : { ok: false, status: 401, error: "Unauthorized" };
  }

  if (process.env.NODE_ENV !== "production" && testBypass && provided === testBypass) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 503,
    error: "GMF_PROSPECTING_EVENTS_TOKEN or CAMPAIGN_REPLY_ROUTER_TOKEN is not configured.",
  };
}

function pickString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function pickNestedString(record: Record<string, unknown>, path: string[]): string {
  let cursor: unknown = record;
  for (const key of path) {
    const next = asRecord(cursor)[key];
    if (next === undefined) return "";
    cursor = next;
  }
  return typeof cursor === "string" && cursor.trim() ? cursor.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeEmail(value: string) {
  const match = value.trim().toLowerCase().match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return match?.[0] ?? "";
}

function safePayload(body: Record<string, unknown>) {
  const copy = { ...body };
  delete copy.api_key;
  delete copy.apiKey;
  delete copy.token;
  delete copy.authorization;
  return copy;
}
