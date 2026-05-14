import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate } from "@/lib/rate-limit";
import { createReportRun, updateReportRun } from "@/lib/report-runs";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

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
  } = body as {
    email?: unknown;
    website?: unknown;
    turnstileToken?: unknown;
    campaign?: unknown;
    visualVariant?: unknown;
    reportType?: unknown;
    secondaryReport?: unknown;
  };

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const v = validateEmail(email);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }

  const normalizedEmail = (email as string).trim().toLowerCase();
  const rate = checkEmailRate(normalizedEmail, 2);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "We already have your request. Check your inbox in 10 minutes." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const bypass = canBypassTurnstileForInternalTest(req);
  const turnstileOk = bypass
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
      : "organic";
  const normalizedVisual =
    visualVariant === "reviews" || visualVariant === "ai"
      ? visualVariant
      : undefined;
  const normalizedReportType =
    reportType === "ai_visibility" || reportType === "marketing"
      ? reportType
      : "marketing";
  const normalizedSecondaryReport = Boolean(secondaryReport);

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "aioutsourcehub.com";
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const reportPath: "/report/marketing" | "/report/ai-visibility" =
    normalizedReportType === "ai_visibility" ? "/report/ai-visibility" : "/report/marketing";
  const reportUrl = new URL(reportPath, `${proto}://${host}`);
  const runId = crypto.randomUUID();
  createReportRun({
    runId,
    email: normalizedEmail,
    campaign: normalizedCampaign,
    reportType: normalizedReportType,
    secondaryReport: normalizedSecondaryReport,
  });
  reportUrl.searchParams.set("runId", runId);

  await forwardToGHL({
    email: (email as string).trim().toLowerCase(),
    timestamp: new Date().toISOString(),
    campaign: normalizedCampaign,
    visualVariant: normalizedVisual,
    reportType: normalizedReportType,
    runId,
    source: "aioutsourcehub.com",
    auditUrl: reportUrl.toString(),
    customField: {
      campaign: normalizedCampaign,
      visualVariant: normalizedVisual ?? "",
      reportType: normalizedReportType,
      secondaryReport: normalizedSecondaryReport,
      source: "aioutsourcehub.com",
      runId,
      auditUrl: reportUrl.toString(),
    },
  });
  maybeSimulateReportLifecycle({
    runId,
    reportPath,
    host,
    proto,
  });

  return NextResponse.json({ ok: true, auditUrl: reportUrl.toString(), runId });
}

type GHLPayload = {
  email: string;
  timestamp: string;
  campaign: "reviews" | "ai" | "organic";
  visualVariant?: "reviews" | "ai";
  reportType: "marketing" | "ai_visibility";
  runId: string;
  source: string;
  auditUrl: string;
  customField: {
    campaign: "reviews" | "ai" | "organic";
    visualVariant: "reviews" | "ai" | "";
    reportType: "marketing" | "ai_visibility";
    secondaryReport: boolean;
    source: string;
    runId: string;
    auditUrl: string;
  };
};

async function forwardToGHL(payload: GHLPayload): Promise<void> {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("GHL webhook responded", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("GHL webhook failed", err);
  }
}

function maybeSimulateReportLifecycle(input: {
  runId: string;
  reportPath: "/report/marketing" | "/report/ai-visibility";
  host: string;
  proto: string;
}): void {
  const hasWebhook = Boolean(process.env.GHL_WEBHOOK_URL?.trim());
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
