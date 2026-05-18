import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate, checkReportDedupe } from "@/lib/rate-limit";
import { createReportRun, updateReportRun } from "@/lib/report-runs";
import { verifyReportToken } from "@/lib/report-token";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const GHL_REPORT_FIELDS = {
  reportTypeRequested: "GfL56AsuzoA6UECd9OM2",
  auditReportId: "JKPbbyPcfOj7txgfLmf7",
  ppRunId: "geldiMOzEdDWrKq0S4v5",
  leadSource: "LIILv8zU5JGSYxmRsbsB",
  auditUrl: "MtlBT8xoZZOWoK58XnpR",
  websiteSource: "PyUyFjg6Ug24wZQHz58P",
  campaignSource: "kBW9m7V0hTehnb9N3WlK",
  offerLane: "xRNb2vJGyf7lXGFscSfh",
} as const;

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

function canBypassTurnstileForInternalTest(req: NextRequest): boolean {
  const expected = process.env.REPORT_TEST_BYPASS_TOKEN?.trim();
  if (!expected) return false;
  const provided = req.headers.get("x-report-test-bypass-token")?.trim();
  return Boolean(provided && provided === expected);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const {
    email,
    website,
    turnstileToken,
    campaign,
    visualVariant,
    reportType,
    secondaryReport,
    token,
    businessName,
  } = body as {
    email?: unknown;
    website?: unknown;
    turnstileToken?: unknown;
    campaign?: unknown;
    visualVariant?: unknown;
    reportType?: unknown;
    secondaryReport?: unknown;
    token?: unknown;
    businessName?: unknown;
  };

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const tokenPayload =
    typeof token === "string" && token.trim().length > 0
      ? verifyReportToken(token)
      : null;

  const emailFromToken = tokenPayload?.email?.trim().toLowerCase() ?? "";
  const submittedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const effectiveEmail = submittedEmail || emailFromToken;
  const effectiveBusinessName =
    (typeof businessName === "string" && businessName.trim()) ||
    tokenPayload?.businessName?.trim() ||
    "";

  if (!effectiveEmail) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }
  const v = validateEmail(effectiveEmail);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }
  if (!effectiveBusinessName) {
    return NextResponse.json({ ok: false, error: "Enter your business name." }, { status: 400 });
  }

  const normalizedEmail = effectiveEmail;
  const rate = await checkEmailRate(normalizedEmail, 2);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "We already have your request. Check your inbox in 10 minutes." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }

  const dedupe = await checkReportDedupe(normalizedEmail, effectiveBusinessName);
  if (!dedupe.ok) {
    return NextResponse.json(
      { ok: false, error: "We already have your request for this business. Check your inbox in 10 minutes." },
      { status: 429, headers: dedupe.retryAfterSec ? { "Retry-After": String(dedupe.retryAfterSec) } : undefined },
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const bypass = canBypassTurnstileForInternalTest(req);
  const turnstileOk = bypass
    ? true
    : tokenPayload
      ? true
    : await verifyTurnstile(
        typeof turnstileToken === "string" ? turnstileToken : "",
        ip,
      );
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Refresh and try again." },
      { status: 400 },
    );
  }

  const normalizedCampaign =
    campaign === "reviews" || campaign === "ai" || campaign === "organic"
      ? campaign
      : tokenPayload?.campaign === "reviews" ||
          tokenPayload?.campaign === "ai" ||
          tokenPayload?.campaign === "organic"
        ? tokenPayload.campaign
      : "organic";
  const normalizedVisual =
    visualVariant === "reviews" || visualVariant === "ai"
      ? visualVariant
      : undefined;
  const normalizedReportType =
    reportType === "ai_visibility" || reportType === "marketing"
      ? reportType
      : tokenPayload?.reportType === "ai_visibility" || tokenPayload?.reportType === "marketing"
        ? tokenPayload.reportType
      : "marketing";
  const normalizedSecondaryReport = Boolean(secondaryReport);
  const reportLane = tokenPayload ? "campaign_report" : "website_free_report";

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "aioutsourcehub.com";
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const reportPath: "/report/marketing" | "/report/ai-visibility" =
    normalizedReportType === "ai_visibility" ? "/report/ai-visibility" : "/report/marketing";
  const reportUrl = new URL(reportPath, `${proto}://${host}`);
  const runId = crypto.randomUUID();
  createReportRun({
    runId,
    email: normalizedEmail,
    businessName: effectiveBusinessName,
    campaign: normalizedCampaign,
    reportType: normalizedReportType,
    secondaryReport: normalizedSecondaryReport,
  });
  reportUrl.searchParams.set("runId", runId);
  reportUrl.searchParams.set("business", effectiveBusinessName);
  reportUrl.searchParams.set("email", normalizedEmail);

  const ghlForward = await forwardToGHL({
    email: normalizedEmail,
    businessName: effectiveBusinessName,
    timestamp: new Date().toISOString(),
    campaign: normalizedCampaign,
    visualVariant: normalizedVisual,
    reportType: normalizedReportType,
    runId,
    source: reportLane === "website_free_report" ? "aioutsourcehub.com:homepage" : "aioutsourcehub.com:campaign",
    reportLane,
    auditUrl: reportUrl.toString(),
    customField: {
      campaign: normalizedCampaign,
      visualVariant: normalizedVisual ?? "",
      reportType: normalizedReportType,
      secondaryReport: normalizedSecondaryReport,
      source: reportLane === "website_free_report" ? "aioutsourcehub.com:homepage" : "aioutsourcehub.com:campaign",
      reportLane,
      runId,
      auditUrl: reportUrl.toString(),
      businessName: effectiveBusinessName,
    },
  });
  const strictInternalTest =
    bypass && req.headers.get("x-report-test-strict")?.trim() === "1";
  if (strictInternalTest && !ghlForward.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "GHL webhook failed during report smoke test.",
        runId,
        ghlForward,
      },
      { status: 502 },
    );
  }
  maybeSimulateReportLifecycle({
    runId,
    reportPath,
    host,
    proto,
  });

  return NextResponse.json({
    ok: true,
    auditUrl: reportUrl.toString(),
    runId,
    ...(bypass ? { ghlForward } : {}),
  });
}

type GHLPayload = {
  email: string;
  businessName: string;
  timestamp: string;
  campaign: "reviews" | "ai" | "organic";
  visualVariant?: "reviews" | "ai";
  reportType: "marketing" | "ai_visibility";
  runId: string;
  source: string;
  reportLane: "website_free_report" | "campaign_report";
  auditUrl: string;
  customField: {
    campaign: "reviews" | "ai" | "organic";
    visualVariant: "reviews" | "ai" | "";
    reportType: "marketing" | "ai_visibility";
    secondaryReport: boolean;
    source: string;
    reportLane: "website_free_report" | "campaign_report";
    runId: string;
    auditUrl: string;
    businessName: string;
  };
};

type GHLForwardResult = {
  ok: boolean;
  configured: boolean;
  mode?: "webhook" | "api";
  status?: number;
  error?: string;
};

async function forwardToGHL(payload: GHLPayload): Promise<GHLForwardResult> {
  const url =
    payload.reportLane === "website_free_report"
      ? process.env.GHL_WEBSITE_REPORT_WEBHOOK_URL?.trim() || process.env.GHL_WEBHOOK_URL?.trim()
      : process.env.GHL_CAMPAIGN_REPORT_WEBHOOK_URL?.trim() || process.env.GHL_WEBHOOK_URL?.trim();
  if (!url) {
    return forwardToGHLViaApi(payload);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("GHL webhook responded", res.status, await res.text().catch(() => ""));
      return { ok: false, configured: true, mode: "webhook", status: res.status };
    }
    return { ok: true, configured: true, mode: "webhook", status: res.status };
  } catch (err) {
    console.error("GHL webhook failed", err);
    return {
      ok: false,
      configured: true,
      mode: "webhook",
      error: err instanceof Error ? err.message : "Unknown GHL webhook error.",
    };
  }
}

async function forwardToGHLViaApi(payload: GHLPayload): Promise<GHLForwardResult> {
  const token = process.env.GHL_PIT_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) {
    const primary =
      payload.reportLane === "website_free_report"
        ? "GHL_WEBSITE_REPORT_WEBHOOK_URL"
        : "GHL_CAMPAIGN_REPORT_WEBHOOK_URL";
    return {
      ok: false,
      configured: false,
      mode: "api",
      error: `${primary} or fallback GHL_WEBHOOK_URL is not set, and GHL_PIT_TOKEN/GHL_LOCATION_ID are not set for API tag handoff.`,
    };
  }

  const reportRequestTag =
    payload.reportLane === "website_free_report"
      ? "aoh_website_report_requested"
      : "aoh_campaign_report_requested";
  const reportTags =
    payload.reportType === "ai_visibility"
      ? [
          "aoh_generate_ai_visibility_report",
          ...(payload.customField.secondaryReport ? ["aoh_generate_marketing_report"] : []),
        ]
      : [
          "aoh_generate_marketing_report",
          ...(payload.customField.secondaryReport ? ["aoh_generate_ai_visibility_report"] : []),
        ];
  const tags = [
    reportRequestTag,
    "aoh_report_requested",
    ...reportTags,
    payload.customField.secondaryReport ? "aoh_secondary_report_requested" : "",
  ].filter(Boolean);

  try {
    const upsertRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: ghlApiHeaders(token),
      body: JSON.stringify({
        locationId,
        email: payload.email,
        name: payload.businessName,
        companyName: payload.businessName,
        source: payload.source,
        customFields: [
          { id: GHL_REPORT_FIELDS.auditReportId, field_value: payload.runId },
          { id: GHL_REPORT_FIELDS.ppRunId, field_value: payload.runId },
          { id: GHL_REPORT_FIELDS.auditUrl, field_value: payload.auditUrl },
          { id: GHL_REPORT_FIELDS.reportTypeRequested, field_value: payload.reportType },
          { id: GHL_REPORT_FIELDS.leadSource, field_value: payload.source },
          { id: GHL_REPORT_FIELDS.websiteSource, field_value: payload.reportLane },
          { id: GHL_REPORT_FIELDS.campaignSource, field_value: payload.campaign },
          { id: GHL_REPORT_FIELDS.offerLane, field_value: payload.visualVariant ?? payload.campaign },
        ],
      }),
    });
    const upsertText = await upsertRes.text();
    if (!upsertRes.ok) {
      console.error("GHL contact upsert responded", upsertRes.status, upsertText);
      return { ok: false, configured: true, mode: "api", status: upsertRes.status };
    }

    const upsertData = parseJsonObject(upsertText);
    const contactId =
      getNestedString(upsertData, ["contact", "id"]) ??
      getNestedString(upsertData, ["id"]) ??
      getNestedString(upsertData, ["contactId"]);
    if (!contactId) {
      console.error("GHL contact upsert missing contact id", upsertText);
      return {
        ok: false,
        configured: true,
        mode: "api",
        status: upsertRes.status,
        error: "GHL contact upsert did not return a contact id.",
      };
    }

    const tagRes = await fetch(`${GHL_API_BASE}/contacts/${encodeURIComponent(contactId)}/tags`, {
      method: "POST",
      headers: ghlApiHeaders(token),
      body: JSON.stringify({ tags }),
    });
    if (!tagRes.ok) {
      console.error("GHL add tags responded", tagRes.status, await tagRes.text().catch(() => ""));
      return { ok: false, configured: true, mode: "api", status: tagRes.status };
    }

    return { ok: true, configured: true, mode: "api", status: tagRes.status };
  } catch (err) {
    console.error("GHL API handoff failed", err);
    return {
      ok: false,
      configured: true,
      mode: "api",
      error: err instanceof Error ? err.message : "Unknown GHL API handoff error.",
    };
  }
}

function ghlApiHeaders(token: string): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Version: GHL_API_VERSION,
  };
}

function parseJsonObject(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getNestedString(value: unknown, path: string[]): string | null {
  let cursor: unknown = value;
  for (const key of path) {
    if (!cursor || typeof cursor !== "object" || !(key in cursor)) return null;
    cursor = (cursor as Record<string, unknown>)[key];
  }
  return typeof cursor === "string" && cursor.trim() ? cursor.trim() : null;
}

function maybeSimulateReportLifecycle(input: {
  runId: string;
  reportPath: "/report/marketing" | "/report/ai-visibility";
  host: string;
  proto: string;
}): void {
  const hasWebhook = Boolean(
    process.env.GHL_WEBSITE_REPORT_WEBHOOK_URL?.trim() ||
      process.env.GHL_CAMPAIGN_REPORT_WEBHOOK_URL?.trim() ||
      process.env.GHL_WEBHOOK_URL?.trim(),
  );
  const isProd = process.env.NODE_ENV === "production";
  if (hasWebhook || isProd) return;

  // Local dev fallback: if GHL webhook is not configured, simulate the
  // downstream report + heatmap readiness so the UI flow can be tested end-to-end.
  const base = `${input.proto}://${input.host}`;
  const auditUrl = `${base}${input.reportPath}?runId=${encodeURIComponent(input.runId)}`;
  const heatmapUrl = `${base}${input.reportPath}?runId=${encodeURIComponent(input.runId)}#heatmap`;

  setTimeout(() => {
    updateReportRun(input.runId, {
      reportReadyAt: Date.now(),
      auditUrl,
    });
  }, 2500);

  setTimeout(() => {
    updateReportRun(input.runId, {
      heatmapReadyAt: Date.now(),
      heatmapUrl,
    });
  }, 5500);
}
