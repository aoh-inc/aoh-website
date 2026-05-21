import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";
import type { ReviewSendLogPacket } from "@/lib/review-automation";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const searchParams = req.nextUrl.searchParams;
  const clientSlug = cleanParam(searchParams.get("client"));
  const limit = Math.min(500, Math.max(1, Number(searchParams.get("limit") ?? 300)));
  const dueAfterDays = Math.min(14, Math.max(1, Number(searchParams.get("dueAfterDays") ?? 3)));
  const result = await listReviewAutomationRecords({ clientSlug, limit });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.configured, error: result.error },
      { status: result.configured ? 502 : 503 },
    );
  }

  const due = findDueFollowups(
    result.records
      .filter((record) => record.eventType === "send_log")
      .map((record) => record.payload as ReviewSendLogPacket),
    dueAfterDays,
  );

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    clientSlug: clientSlug || "all",
    dueAfterDays,
    count: due.length,
    due,
  });
}

function findDueFollowups(logs: ReviewSendLogPacket[], dueAfterDays: number) {
  const cutoff = Date.now() - dueAfterDays * 24 * 60 * 60 * 1000;
  const byKey = new Map<string, ReviewSendLogPacket[]>();

  for (const log of logs) {
    const key = `${log.clientSlug}:${log.customerEmail}`;
    byKey.set(key, [...(byKey.get(key) ?? []), log]);
  }

  const due = [];
  for (const events of byKey.values()) {
    const sorted = events.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    const latestTerminal = sorted.findLast((event) =>
      ["bounced", "failed", "clicked", "followup_sent"].includes(event.status),
    );
    if (latestTerminal) continue;

    const latestSent = sorted.findLast((event) => event.status === "sent");
    if (!latestSent || Date.parse(latestSent.timestamp) > cutoff) continue;

    due.push({
      clientSlug: latestSent.clientSlug,
      clientName: latestSent.clientName,
      customerEmail: latestSent.customerEmail,
      sentAt: latestSent.timestamp,
      provider: latestSent.provider,
      messageId: latestSent.messageId,
    });
  }

  return due.sort((a, b) => Date.parse(a.sentAt) - Date.parse(b.sentAt));
}

function cleanParam(value: string | null) {
  return (value ?? "").trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}
