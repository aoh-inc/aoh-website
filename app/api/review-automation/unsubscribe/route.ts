import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate } from "@/lib/rate-limit";
import { buildSuppressionPacket, cleanLongText, cleanText, forwardReviewAutomationEvent, postReviewAutomationSlackSummary } from "@/lib/review-automation";
import { saveReviewSuppression } from "@/lib/review-automation-store";

type UnsubscribeBody = {
  clientSlug?: unknown;
  customerEmail?: unknown;
  reason?: unknown;
  websiteTrap?: unknown;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as UnsubscribeBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (typeof body.websiteTrap === "string" && body.websiteTrap.trim()) {
    return NextResponse.json({ ok: true });
  }

  const clientSlug = cleanText(body.clientSlug, 80);
  const emailCheck = validateEmail(body.customerEmail);
  if (!clientSlug) {
    return NextResponse.json({ ok: false, error: "Missing client." }, { status: 400 });
  }
  if (!emailCheck.ok) {
    return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 400 });
  }

  const customerEmail = String(body.customerEmail).trim().toLowerCase();
  const rate = await checkEmailRate(customerEmail, 4);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "We received this request already." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }

  const packet = buildSuppressionPacket({
    clientSlug,
    customerEmail,
    reason: cleanLongText(body.reason, 500),
  });
  const storageResult = await saveReviewSuppression(packet);
  const webhookResult = await forwardReviewAutomationEvent("suppression_update", packet);
  await postReviewAutomationSlackSummary("suppression_update", packet, {
    ok: storageResult.ok || webhookResult.ok,
    configured: storageResult.configured || webhookResult.configured,
    error: storageResult.ok ? webhookResult.error : storageResult.error || webhookResult.error,
  });

  return NextResponse.json({
    ok: true,
    stored: storageResult.ok || webhookResult.ok,
    storageConfigured: storageResult.configured || webhookResult.configured,
  });
}
