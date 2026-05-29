import { createAgentTask } from "@/lib/ops-store";
import { hasSupabaseConfig, supabaseRest } from "@/lib/supabase-rest";

export type VisibilityReportContext =
  | "prospect_free_check"
  | "prospect_campaign_reply"
  | "client_onboarding_baseline"
  | "client_recurring_check";

export type VisibilityReportAudience = "prospect" | "client";

export type VisibilityReportStatus =
  | "requested"
  | "building"
  | "ready_for_audit"
  | "approved_to_send"
  | "sent"
  | "blocked"
  | "closed";

export type VisibilityReportRow = {
  id: string;
  created_at: string;
  updated_at: string;
  run_id: string;
  report_context: VisibilityReportContext;
  audience: VisibilityReportAudience;
  report_status: VisibilityReportStatus;
  lead_status: string;
  client_lifecycle: string;
  owner_role: string;
  next_action: string;
  blocker: string;
  business_name: string;
  contact_name: string;
  contact_email: string;
  business_website: string;
  business_location: string;
  client_slug: string;
  client_id: string;
  report_type: "marketing" | "ai_visibility";
  source: string;
  campaign: string;
  audit_url: string;
  heatmap_url: string;
  metadata: Record<string, unknown>;
};

export type VisibilityReportEventRow = {
  id: string;
  created_at: string;
  run_id: string;
  event_type: string;
  actor_role: string;
  note: string;
  payload: Record<string, unknown>;
};

type VisibilityReportCreateInput = {
  runId: string;
  context: VisibilityReportContext;
  businessName: string;
  contactEmail: string;
  businessWebsite?: string;
  businessLocation?: string;
  contactName?: string;
  clientSlug?: string;
  clientId?: string;
  reportType: "marketing" | "ai_visibility";
  source: string;
  campaign: "reviews" | "ai" | "organic";
  auditUrl: string;
  heatmapUrl?: string;
  metadata?: Record<string, unknown>;
  deliveryMode?: "manual_agent" | "automated";
};

const REPORTS_TABLE = "visibility_reports";
const EVENTS_TABLE = "visibility_report_events";

export async function createVisibilityReportRequest(input: VisibilityReportCreateInput) {
  const audience = input.context.startsWith("client_") ? "client" : "prospect";
  const status = "requested" satisfies VisibilityReportStatus;
  const automated = input.deliveryMode === "automated";
  const ownerRole = automated ? "Automation" : audience === "client" ? "Account Manager" : "Sales Rep";
  const leadStatus =
    input.context === "prospect_free_check"
      ? automated
        ? "free_check_queued"
        : "free_check_requested"
      : input.context === "prospect_campaign_reply"
        ? "report_building"
        : "";
  const clientLifecycle =
    input.context === "client_onboarding_baseline"
      ? "paid_needs_onboarding"
      : input.context === "client_recurring_check"
        ? "live_recurring"
        : "";
  const nextAction =
    automated
      ? "Automated processor verifies email, enriches public GBP facts, sends the visibility report, and enrolls nurture."
      : audience === "client"
      ? "Reporter builds onboarding baseline, Auditor checks it, Account Manager sends client-safe proof."
      : "Scout runs public scan, Reporter builds free visibility report, Auditor checks it, Sales Rep sends it.";

  const row = {
    run_id: input.runId,
    report_context: input.context,
    audience,
    report_status: status,
    lead_status: leadStatus,
    client_lifecycle: clientLifecycle,
    owner_role: ownerRole,
    next_action: nextAction,
    blocker: "",
    business_name: cleanText(input.businessName, 180),
    contact_name: cleanText(input.contactName ?? "", 140),
    contact_email: cleanText(input.contactEmail, 220).toLowerCase(),
    business_website: cleanText(input.businessWebsite ?? "", 500),
    business_location: cleanText(input.businessLocation ?? "", 180),
    client_slug: cleanText(input.clientSlug ?? "", 100),
    client_id: cleanText(input.clientId ?? "", 80),
    report_type: input.reportType,
    source: cleanText(input.source, 180),
    campaign: input.campaign,
    audit_url: cleanText(input.auditUrl, 500),
    heatmap_url: cleanText(input.heatmapUrl ?? "", 500),
    metadata: input.metadata ?? {},
  };

  const save = hasSupabaseConfig()
    ? await supabaseRest<VisibilityReportRow[]>(REPORTS_TABLE, {
        method: "POST",
        query: "on_conflict=run_id",
        prefer: "resolution=merge-duplicates,return=representation",
        body: row,
      })
    : { ok: false as const, status: 0, error: "Supabase environment variables are missing." };

  if (!save.ok) {
    console.error("Visibility report save failed", save.status, save.error);
  }

  const sideEffects: Array<Promise<unknown>> = [
    logVisibilityReportEvent({
      runId: input.runId,
      eventType: "requested",
      actorRole: "System",
      note: nextAction,
      payload: row,
    }),
  ];

  if (!automated) {
    sideEffects.push(createAgentTask({
      title: `${audience === "client" ? "Build onboarding baseline" : "Build free visibility report"} - ${row.business_name}`,
      kind: "visibility_report",
      priority: audience === "client" ? "high" : "normal",
      source: row.source,
      payload: {
        runId: input.runId,
        context: input.context,
        audience,
        ownerRole,
        reportType: input.reportType,
        businessName: row.business_name,
        contactEmail: row.contact_email,
        auditUrl: row.audit_url,
        nextAction,
      },
    }));
  }

  await Promise.allSettled(sideEffects);

  return save;
}

export async function updateVisibilityReport(input: {
  runId: string;
  reportStatus?: VisibilityReportStatus;
  leadStatus?: string;
  nextAction?: string;
  blocker?: string;
  auditUrl?: string;
  heatmapUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!hasSupabaseConfig()) {
    return { ok: false as const, status: 0, error: "Supabase environment variables are missing." };
  }

  const body: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.reportStatus) body.report_status = input.reportStatus;
  if (input.leadStatus !== undefined) body.lead_status = cleanText(input.leadStatus, 180);
  if (input.nextAction !== undefined) body.next_action = cleanText(input.nextAction, 800);
  if (input.blocker !== undefined) body.blocker = cleanText(input.blocker, 800);
  if (input.auditUrl !== undefined) body.audit_url = cleanText(input.auditUrl, 500);
  if (input.heatmapUrl !== undefined) body.heatmap_url = cleanText(input.heatmapUrl, 500);
  if (input.metadata !== undefined) body.metadata = input.metadata;

  const query = new URLSearchParams({ run_id: `eq.${input.runId}` });
  return supabaseRest<VisibilityReportRow[]>(REPORTS_TABLE, {
    method: "PATCH",
    query: query.toString(),
    prefer: "return=representation",
    body,
  });
}

export async function updateVisibilityReportsByEmail(input: {
  email: string;
  reportStatus?: VisibilityReportStatus;
  leadStatus?: string;
  nextAction?: string;
  blocker?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!hasSupabaseConfig()) {
    return { ok: false as const, status: 0, error: "Supabase environment variables are missing." };
  }

  const body: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.reportStatus) body.report_status = input.reportStatus;
  if (input.leadStatus !== undefined) body.lead_status = cleanText(input.leadStatus, 180);
  if (input.nextAction !== undefined) body.next_action = cleanText(input.nextAction, 800);
  if (input.blocker !== undefined) body.blocker = cleanText(input.blocker, 800);
  if (input.metadata !== undefined) body.metadata = input.metadata;

  const query = new URLSearchParams({
    contact_email: `eq.${input.email.trim().toLowerCase()}`,
    report_context: "eq.prospect_free_check",
    order: "created_at.desc",
  });
  return supabaseRest<VisibilityReportRow[]>(REPORTS_TABLE, {
    method: "PATCH",
    query: query.toString(),
    prefer: "return=representation",
    body,
  });
}

export async function findRecentVisibilityReportRequest(input: {
  email: string;
  businessName: string;
  context: VisibilityReportContext;
  sinceIso: string;
}) {
  if (!hasSupabaseConfig()) {
    return {
      ok: false as const,
      configured: false as const,
      error: "Supabase environment variables are missing.",
    };
  }

  const query = new URLSearchParams({
    select: "run_id,created_at,report_status,lead_status,audit_url",
    contact_email: `eq.${input.email.trim().toLowerCase()}`,
    business_name: `eq.${cleanText(input.businessName, 180)}`,
    report_context: `eq.${input.context}`,
    created_at: `gte.${input.sinceIso}`,
    order: "created_at.desc",
    limit: "1",
  });

  const result = await supabaseRest<
    Array<Pick<VisibilityReportRow, "run_id" | "created_at" | "report_status" | "lead_status" | "audit_url">>
  >(REPORTS_TABLE, {
    query: query.toString(),
  });

  if (!result.ok) {
    return {
      ok: false as const,
      configured: true as const,
      status: result.status,
      error: result.error,
    };
  }

  return { ok: true as const, configured: true as const, report: result.data[0] ?? null };
}

export async function logVisibilityReportEvent(input: {
  runId: string;
  eventType: string;
  actorRole: string;
  note: string;
  payload?: Record<string, unknown>;
}) {
  if (!hasSupabaseConfig()) {
    return { ok: false as const, status: 0, error: "Supabase environment variables are missing." };
  }

  return supabaseRest<VisibilityReportEventRow[]>(EVENTS_TABLE, {
    method: "POST",
    prefer: "return=representation",
    body: {
      run_id: cleanText(input.runId, 160),
      event_type: cleanText(input.eventType, 80),
      actor_role: cleanText(input.actorRole, 80),
      note: cleanText(input.note, 800),
      payload: input.payload ?? {},
    },
  });
}

export async function listVisibilityReports(input?: {
  context?: VisibilityReportContext;
  audience?: VisibilityReportAudience;
  limit?: number;
}) {
  if (!hasSupabaseConfig()) {
    return {
      ok: false as const,
      configured: false as const,
      reports: [],
      error: "Supabase environment variables are missing.",
    };
  }

  const query = new URLSearchParams({
    select: "*",
    order: "created_at.desc",
    limit: String(Math.min(500, Math.max(1, Math.floor(input?.limit ?? 100)))),
  });
  if (input?.context) query.set("report_context", `eq.${input.context}`);
  if (input?.audience) query.set("audience", `eq.${input.audience}`);

  const result = await supabaseRest<VisibilityReportRow[]>(REPORTS_TABLE, { query: query.toString() });
  if (!result.ok) {
    return {
      ok: false as const,
      configured: true as const,
      reports: [],
      status: result.status,
      error: result.error,
    };
  }

  return { ok: true as const, configured: true as const, reports: result.data };
}

function cleanText(value: string, max: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}
