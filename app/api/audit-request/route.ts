import { after, NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { envValueAny } from "@/lib/getmefound-env";
import { processFreeVisibilityReport } from "@/lib/free-visibility-report";
import { verifyEmailWithNeverBounce } from "@/lib/neverbounce";
import { checkEmailRate, checkIpRate, checkReportDedupe } from "@/lib/rate-limit";
import {
  createVisibilityReportRequest,
  findRecentVisibilityReportRequest,
  logVisibilityReportEvent,
} from "@/lib/visibility-reports";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

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
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const { businessName, email, website, turnstileToken } = body as {
    businessName?: unknown;
    email?: unknown;
    website?: unknown;
    turnstileToken?: unknown;
  };

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof businessName !== "string" || businessName.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "Enter your business name." }, { status: 400 });
  }

  const v = validateEmail(email);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ipRate = await checkIpRate(ip ?? "unknown", 5, 60 * 60);
  if (!ipRate.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests from your location. Try again later." },
      { status: 429, headers: ipRate.retryAfterSec ? { "Retry-After": String(ipRate.retryAfterSec) } : undefined },
    );
  }

  const turnstileOk = await verifyTurnstile(
    typeof turnstileToken === "string" ? turnstileToken : "",
    ip,
  );
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Refresh and try again." },
      { status: 400 },
    );
  }

  const normalizedEmail = (email as string).trim().toLowerCase();
  const normalizedName = businessName.trim().replace(/\s+/g, " ");

  const emailRate = await checkEmailRate(normalizedEmail, 3);
  if (!emailRate.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests for that email. Try again tomorrow." },
      { status: 429, headers: emailRate.retryAfterSec ? { "Retry-After": String(emailRate.retryAfterSec) } : undefined },
    );
  }

  const dedupe = await checkReportDedupe(normalizedEmail, normalizedName);
  if (!dedupe.ok) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const recentDuplicate = await findRecentVisibilityReportRequest({
    email: normalizedEmail,
    businessName: normalizedName,
    context: "prospect_free_check",
    sinceIso: hoursAgoIso(24),
  });
  if (recentDuplicate.ok && recentDuplicate.report) {
    await logVisibilityReportEvent({
      runId: recentDuplicate.report.run_id,
      eventType: "duplicate_suppressed",
      actorRole: "Automation",
      note: "Duplicate homepage free visibility check request suppressed for the same email and business within 24 hours.",
      payload: {
        email: normalizedEmail,
        businessName: normalizedName,
        existingStatus: recentDuplicate.report.report_status,
      },
    });
    return NextResponse.json({
      ok: true,
      duplicate: true,
      runId: recentDuplicate.report.run_id,
      estimatedEmailMinutes: 5,
    });
  }

  const verification = await verifyEmailWithNeverBounce(normalizedEmail);
  if (!verification.ok) {
    const transient =
      verification.result === "not_configured" || verification.result === "api_error";
    return NextResponse.json(
      {
        ok: false,
        error: transient
          ? "Email verification is temporarily unavailable. Try again in a few minutes."
          : "We could not verify that email address. Use a different business email.",
      },
      { status: transient ? 503 : 400 },
    );
  }

  const runId = crypto.randomUUID();
  const cleanOrigin = resolveReportOrigin(req);
  const submittedAt = new Date().toISOString();
  const checkoutUrl = `${cleanOrigin}/checkout/get-found-refresh?runId=${encodeURIComponent(runId)}&source=free_visibility_report`;

  const saved = await createVisibilityReportRequest({
    runId,
    context: "prospect_free_check",
    businessName: normalizedName,
    contactEmail: normalizedEmail,
    reportType: "ai_visibility",
    source: "homepage-free-visibility-check",
    campaign: "organic",
    auditUrl: checkoutUrl,
    metadata: {
      automation: "free_visibility_report",
      ipHint: ip,
      emailVerification: verification,
      submittedAt,
    },
    deliveryMode: "automated",
  });
  if (!saved.ok) {
    console.error("visibility report save failed", saved.status, saved.error);
  }

  await logVisibilityReportEvent({
    runId,
    eventType: "email_verified",
    actorRole: "Automation",
    note: "NoBounce/NeverBounce verified the address before report automation.",
    payload: verification,
  });

  after(async () => {
    await processFreeVisibilityReport({
      runId,
      businessName: normalizedName,
      email: normalizedEmail,
      origin: cleanOrigin,
      submittedAt,
      ip,
      emailVerification: verification,
    });
  });

  return NextResponse.json({ ok: true, runId, estimatedEmailMinutes: 5 });
}

function resolveReportOrigin(req: NextRequest) {
  const configured =
    envValueAny("GMF_PUBLIC_SITE_URL", "NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const candidate = configured || req.headers.get("origin") || "https://getmefound.ai";

  try {
    const url = new URL(candidate.startsWith("http") ? candidate : `https://${candidate}`);
    const localDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const trustedHost =
      url.hostname === "getmefound.ai" ||
      url.hostname.endsWith(".getmefound.ai") ||
      (process.env.NODE_ENV !== "production" && localDev);
    if (trustedHost) return url.origin.replace(/\/+$/, "");
  } catch {
    // Fall through to the production public origin.
  }

  return "https://getmefound.ai";
}

function hoursAgoIso(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}
