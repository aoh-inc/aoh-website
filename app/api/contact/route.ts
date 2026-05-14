import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate } from "@/lib/rate-limit";

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

  const { name, email, message, website, turnstileToken } = body as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
    website?: unknown;
    turnstileToken?: unknown;
  };

  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json(
      { ok: false, error: "Your message is too short." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Your message is too long." },
      { status: 400 },
    );
  }

  const v = validateEmail(email);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }

  const normalizedEmail = (email as string).trim().toLowerCase();
  const rate = await checkEmailRate(normalizedEmail, 3);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "You've sent us a few messages today already. We'll reply soon." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
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

  await forwardToGHL({
    name: name.trim(),
    email: (email as string).trim().toLowerCase(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    source: "aioutsourcehub.com/contact",
  });

  return NextResponse.json({ ok: true });
}

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  timestamp: string;
  source: string;
};

async function forwardToGHL(payload: ContactPayload): Promise<void> {
  const url = process.env.GHL_CONTACT_WEBHOOK_URL ?? process.env.GHL_WEBHOOK_URL;
  if (!url) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("GHL contact webhook responded", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("GHL contact webhook failed", err);
  }
}
