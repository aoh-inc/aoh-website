import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate } from "@/lib/rate-limit";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";
import {
  buildCustomerPacket,
  cleanLongText,
  cleanText,
  forwardReviewAutomationEvent,
  postReviewAutomationSlackSummary,
} from "@/lib/review-automation";

type CustomerUploadBody = {
  clientSlug?: unknown;
  submittedBy?: unknown;
  submittedEmail?: unknown;
  customerText?: unknown;
  doNotContactText?: unknown;
  websiteTrap?: unknown;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as CustomerUploadBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (typeof body.websiteTrap === "string" && body.websiteTrap.trim()) {
    return NextResponse.json({ ok: true });
  }

  const clientSlug = cleanText(body.clientSlug, 80);
  const submittedBy = cleanText(body.submittedBy, 100);
  const customerText = cleanLongText(body.customerText, 40000);
  const doNotContactText = cleanLongText(body.doNotContactText, 8000);

  if (!clientSlug) {
    return NextResponse.json({ ok: false, error: "Missing client." }, { status: 400 });
  }
  if (submittedBy.length < 2) {
    return NextResponse.json({ ok: false, error: "Add your name." }, { status: 400 });
  }
  const emailCheck = validateEmail(body.submittedEmail);
  if (!emailCheck.ok) {
    return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 400 });
  }
  const submittedEmail = String(body.submittedEmail).trim().toLowerCase();
  const rate = await checkEmailRate(submittedEmail, 4);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "We received a few submissions already. We will follow up soon." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }
  if (customerText.length < 5) {
    return NextResponse.json({ ok: false, error: "Paste at least one customer row." }, { status: 400 });
  }

  const packet = buildCustomerPacket({
    clientSlug,
    submittedBy,
    submittedEmail,
    customerText,
    doNotContactText,
  });

  const storageResult = await saveReviewAutomationEvent("customer_upload", packet);
  const webhookResult = await forwardReviewAutomationEvent("customer_upload", packet);
  await postReviewAutomationSlackSummary("customer_upload", packet, {
    ok: storageResult.ok || webhookResult.ok,
    configured: storageResult.configured || webhookResult.configured,
    error: storageResult.ok ? webhookResult.error : storageResult.error || webhookResult.error,
  });

  return NextResponse.json({
    ok: true,
    summary: packet.summary,
    stored: storageResult.ok || webhookResult.ok,
    storageConfigured: storageResult.configured || webhookResult.configured,
    storageId: storageResult.ok || storageResult.configured ? storageResult.id : "",
  });
}
