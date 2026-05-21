import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate } from "@/lib/rate-limit";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";
import {
  buildFeedbackPacket,
  cleanLongText,
  cleanText,
  forwardReviewAutomationEvent,
  postReviewAutomationSlackSummary,
} from "@/lib/review-automation";

type FeedbackBody = {
  clientSlug?: unknown;
  customerName?: unknown;
  customerEmail?: unknown;
  rating?: unknown;
  feedback?: unknown;
  websiteTrap?: unknown;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as FeedbackBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (typeof body.websiteTrap === "string" && body.websiteTrap.trim()) {
    return NextResponse.json({ ok: true });
  }

  const clientSlug = cleanText(body.clientSlug, 80);
  const customerName = cleanText(body.customerName, 100);
  const customerEmailRaw = cleanText(body.customerEmail, 160);
  const feedback = cleanLongText(body.feedback, 2000);
  const rating = Number(body.rating);

  if (!clientSlug) {
    return NextResponse.json({ ok: false, error: "Missing client." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "Choose a rating from 1 to 5." }, { status: 400 });
  }

  let customerEmail = "";
  if (customerEmailRaw) {
    const emailCheck = validateEmail(customerEmailRaw);
    if (!emailCheck.ok) {
      return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 400 });
    }
    customerEmail = customerEmailRaw.toLowerCase();
    const rate = await checkEmailRate(customerEmail, 5);
    if (!rate.ok) {
      return NextResponse.json(
        { ok: false, error: "We received your feedback already. Thank you." },
        { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
      );
    }
  }

  const packet = buildFeedbackPacket({
    clientSlug,
    customerName,
    customerEmail,
    rating,
    feedback,
  });

  const storageResult = await saveReviewAutomationEvent("private_feedback", packet);
  const webhookResult = await forwardReviewAutomationEvent("private_feedback", packet);
  await postReviewAutomationSlackSummary("private_feedback", packet, {
    ok: storageResult.ok || webhookResult.ok,
    configured: storageResult.configured || webhookResult.configured,
    error: storageResult.ok ? webhookResult.error : storageResult.error || webhookResult.error,
  });

  return NextResponse.json({
    ok: true,
    routeToGoogle: packet.shouldRouteToGoogle,
    googleReviewUrl: packet.shouldRouteToGoogle ? packet.googleReviewUrl : "",
    stored: storageResult.ok || webhookResult.ok,
    storageConfigured: storageResult.configured || webhookResult.configured,
    storageId: storageResult.ok || storageResult.configured ? storageResult.id : "",
  });
}
