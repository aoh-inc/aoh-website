import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { validateEmail } from "@/lib/email-validation";
import {
  buildSendLogPacket,
  cleanLongText,
  cleanText,
  forwardReviewAutomationEvent,
  postReviewAutomationSlackSummary,
  type ReviewSendLogPacket,
} from "@/lib/review-automation";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";

type SendLogBody = {
  clientSlug?: unknown;
  customerEmail?: unknown;
  status?: unknown;
  provider?: unknown;
  messageId?: unknown;
  detail?: unknown;
  timestamp?: unknown;
};

const STATUSES = new Set(["sent", "failed", "bounced", "opened", "clicked", "followup_sent"]);

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as SendLogBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const clientSlug = cleanText(body.clientSlug, 80);
  const emailCheck = validateEmail(body.customerEmail);
  const status = cleanText(body.status, 40);

  if (!clientSlug) {
    return NextResponse.json({ ok: false, error: "Missing client." }, { status: 400 });
  }
  if (!emailCheck.ok) {
    return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 400 });
  }
  if (!STATUSES.has(status)) {
    return NextResponse.json({ ok: false, error: "Invalid send status." }, { status: 400 });
  }

  const packet = buildSendLogPacket({
    clientSlug,
    customerEmail: String(body.customerEmail).trim().toLowerCase(),
    status: status as ReviewSendLogPacket["status"],
    provider: cleanText(body.provider, 80),
    messageId: cleanText(body.messageId, 160),
    detail: cleanLongText(body.detail, 500),
    timestamp: typeof body.timestamp === "string" && body.timestamp.trim() ? body.timestamp.trim() : undefined,
  });

  const storageResult = await saveReviewAutomationEvent("send_log", packet);
  const webhookResult = await forwardReviewAutomationEvent("send_log", packet);
  const shouldAlert = packet.status === "failed" || packet.status === "bounced";
  if (shouldAlert) {
    await postReviewAutomationSlackSummary("send_log", packet, {
      ok: storageResult.ok || webhookResult.ok,
      configured: storageResult.configured || webhookResult.configured,
      error: storageResult.ok ? webhookResult.error : storageResult.error || webhookResult.error,
    });
  }

  return NextResponse.json({
    ok: true,
    stored: storageResult.ok || webhookResult.ok,
    storageConfigured: storageResult.configured || webhookResult.configured,
  });
}
