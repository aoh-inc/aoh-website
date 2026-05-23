import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { getResendDomainStatus, sendGetMeFoundEmail } from "@/lib/getmefound-email";
import { createAgentTask, logEmailEvent, saveContactSubmission } from "@/lib/ops-store";
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

  const submittedAt = new Date().toISOString();
  const contact = {
    name: name.trim(),
    email: normalizedEmail,
    message: message.trim(),
    source: "getmefound.ai/contact",
    user_agent: req.headers.get("user-agent"),
    ip_hint: ip,
  };

  const contactResult = await saveContactSubmission(contact);
  if (!contactResult.ok) {
    console.error("Supabase contact save failed", contactResult.status, contactResult.error);
  }

  const taskResult = await createAgentTask({
    title: `Follow up with ${contact.name}`,
    kind: "contact_follow_up",
    priority: "normal",
    source: "website_contact",
    payload: {
      ...contact,
      submittedAt,
    },
  });
  if (!taskResult.ok) {
    console.error("Supabase agent task save failed", taskResult.status, taskResult.error);
  }

  const subject = `New GetMeFound contact: ${contact.name}`;
  const notificationStatus = await sendContactNotification({
    ...contact,
    subject,
    submittedAt,
  });

  const emailLogResult = await logEmailEvent({
    provider: "resend",
    event_type: "contact_notification",
    to_email: "mike@getmefound.ai",
    subject,
    status: notificationStatus.sent ? "sent" : "skipped",
    provider_id: notificationStatus.id,
    error: notificationStatus.sent ? undefined : notificationStatus.reason,
    payload: {
      resendDomainStatus: notificationStatus.domainStatus,
    },
  });
  if (!emailLogResult.ok) {
    console.error("Supabase email event save failed", emailLogResult.status, emailLogResult.error);
  }

  return NextResponse.json({
    ok: true,
    saved: contactResult.ok,
    taskCreated: taskResult.ok,
    notification: notificationStatus.sent ? "sent" : "pending",
  });
}

async function sendContactNotification(input: {
  name: string;
  email: string;
  message: string;
  source: string;
  user_agent: string | null;
  ip_hint: string | null;
  subject: string;
  submittedAt: string;
}): Promise<{ sent: boolean; id?: string; reason?: string; domainStatus?: string }> {
  const domain = await getResendDomainStatus();
  if (!domain.ok || domain.domainStatus !== "verified") {
    return {
      sent: false,
      reason: domain.ok ? `Resend domain is ${domain.domainStatus}.` : domain.error,
      domainStatus: domain.ok ? domain.domainStatus : "unavailable",
    };
  }

  const lines = [
    "New GetMeFound contact submission",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Source: ${input.source}`,
    `Submitted: ${input.submittedAt}`,
    "",
    input.message,
  ].filter(Boolean);

  const result = await sendGetMeFoundEmail({
    to: "mike@getmefound.ai",
    subject: input.subject,
    text: lines.join("\n"),
    replyTo: input.email,
  });

  if (!result.ok) {
    console.error("Resend contact notification failed", result.status, result.error);
    return {
      sent: false,
      reason: result.error,
      domainStatus: domain.domainStatus,
    };
  }

  return { sent: true, id: result.id, domainStatus: domain.domainStatus };
}
