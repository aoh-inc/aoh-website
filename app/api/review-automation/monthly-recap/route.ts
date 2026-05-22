import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import {
  type ReviewCustomerPacket,
  type ReviewFeedbackPacket,
  type ReviewSendLogPacket,
  type ReviewSuppressionPacket,
} from "@/lib/review-automation";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";
import { cleanClientSlug } from "@/lib/review-send-candidates";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const searchParams = req.nextUrl.searchParams;
  const clientSlug = cleanClientSlug(searchParams.get("client"));
  const days = Math.min(90, Math.max(7, Number(searchParams.get("days") ?? 30)));
  const limit = Math.min(1000, Math.max(50, Number(searchParams.get("limit") ?? 500)));

  const result = await listReviewAutomationRecords({ clientSlug, limit });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.configured, error: result.error },
      { status: result.configured ? 502 : 503 },
    );
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const records = result.records.filter((record) => Date.parse(record.createdAt) >= cutoff);
  const customerUploads = records
    .filter((record) => record.eventType === "customer_upload")
    .map((record) => record.payload as ReviewCustomerPacket);
  const feedback = records
    .filter((record) => record.eventType === "private_feedback")
    .map((record) => record.payload as ReviewFeedbackPacket);
  const sendLogs = records
    .filter((record) => record.eventType === "send_log")
    .map((record) => record.payload as ReviewSendLogPacket);
  const suppressions = records
    .filter((record) => record.eventType === "suppression_update")
    .map((record) => record.payload as ReviewSuppressionPacket);

  const sent = sendLogs.filter((log) => log.status === "sent").length;
  const failed = sendLogs.filter((log) => log.status === "failed").length;
  const bounced = sendLogs.filter((log) => log.status === "bounced").length;
  const opened = sendLogs.filter((log) => log.status === "opened").length;
  const clicked = sendLogs.filter((log) => log.status === "clicked").length;
  const followups = sendLogs.filter((log) => log.status === "followup_sent").length;
  const happyFeedback = feedback.filter((item) => item.shouldRouteToGoogle).length;
  const privateFeedback = feedback.filter((item) => !item.shouldRouteToGoogle).length;

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    clientSlug: clientSlug || "all",
    days,
    counts: {
      records: records.length,
      customerUploads: customerUploads.length,
      uploadedRows: customerUploads.reduce((sum, upload) => sum + upload.summary.totalRows, 0),
      sendableRows: customerUploads.reduce((sum, upload) => sum + upload.summary.sendableRows, 0),
      suppressions: suppressions.length,
      sent,
      failed,
      bounced,
      opened,
      clicked,
      followups,
      happyFeedback,
      privateFeedback,
    },
    ownerSummary: buildOwnerSummary({
      sent,
      failed,
      bounced,
      clicked,
      happyFeedback,
      privateFeedback,
      suppressions: suppressions.length,
    }),
  });
}

function buildOwnerSummary(input: {
  sent: number;
  failed: number;
  bounced: number;
  clicked: number;
  happyFeedback: number;
  privateFeedback: number;
  suppressions: number;
}) {
  const notes = [];
  if (input.sent === 0) notes.push("No review requests have been sent in this window.");
  else notes.push(`${input.sent} review request${input.sent === 1 ? "" : "s"} sent.`);

  if (input.clicked > 0 || input.happyFeedback > 0) {
    notes.push("Customers are engaging with the review flow.");
  }
  if (input.privateFeedback > 0) {
    notes.push(`${input.privateFeedback} customer${input.privateFeedback === 1 ? "" : "s"} sent private feedback first.`);
  }
  if (input.failed > 0 || input.bounced > 0) {
    notes.push("Some sends need cleanup before the next batch.");
  }
  if (input.suppressions > 0) {
    notes.push(`${input.suppressions} customer${input.suppressions === 1 ? "" : "s"} held out of future sends.`);
  }

  return notes;
}
