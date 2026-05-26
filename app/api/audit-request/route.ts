import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkIpRate } from "@/lib/rate-limit";
import { supabaseRest } from "@/lib/supabase-rest";

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

  // Honeypot
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

  const rate = await checkIpRate(ip ?? "unknown", 5, 60 * 60);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests from your location. Try again later." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
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
  const normalizedName = businessName.trim();
  const timestamp = new Date().toISOString();

  // Forward to GHL webhook
  const webhookUrl = process.env.GHL_WEBSITE_REPORT_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        businessName: normalizedName,
        email: normalizedEmail,
        source: "getmefound.ai:audit-request",
        timestamp,
      }),
    }).catch((err) => console.error("GHL audit-request webhook failed", err));
  }

  // Save to Supabase — table: audit_requests (business_name, email, created_at, ip_address, status)
  const saved = await supabaseRest<null>("audit_requests", {
    method: "POST",
    body: {
      business_name: normalizedName,
      email: normalizedEmail,
      ip_address: ip,
      status: "pending",
    },
    prefer: "return=minimal",
  });
  if (!saved.ok) {
    console.error("audit_requests save failed", saved.status, saved.error);
  }

  return NextResponse.json({ ok: true });
}
