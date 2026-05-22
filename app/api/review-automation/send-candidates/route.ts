import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { getClientHub } from "@/lib/client-hub";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";
import type { ReviewCustomerPacket, ReviewSendLogPacket } from "@/lib/review-automation";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const searchParams = req.nextUrl.searchParams;
  const clientSlug = cleanParam(searchParams.get("client"));
  const limit = Math.min(500, Math.max(1, Number(searchParams.get("limit") ?? 300)));
  if (!clientSlug) {
    return NextResponse.json({ ok: false, error: "Missing client." }, { status: 400 });
  }

  const client = getClientHub(clientSlug);
  if (!client) {
    return NextResponse.json({ ok: false, error: "Unknown client." }, { status: 404 });
  }
  if (!client.googleReviewUrl) {
    return NextResponse.json(
      {
        ok: false,
        blocked: true,
        blocker: "google_review_link_missing",
        error: "Add the verified Google review link before building a send batch.",
      },
      { status: 409 },
    );
  }

  const result = await listReviewAutomationRecords({ clientSlug, limit });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.configured, error: result.error },
      { status: result.configured ? 502 : 503 },
    );
  }

  const sentOrTerminalEmails = new Set(
    result.records
      .filter((record) => record.eventType === "send_log")
      .map((record) => record.payload as ReviewSendLogPacket)
      .filter((log) => ["sent", "bounced", "failed", "followup_sent"].includes(log.status))
      .map((log) => log.customerEmail.toLowerCase()),
  );

  const latestUpload = result.records.find((record) => record.eventType === "customer_upload")?.payload as
    | ReviewCustomerPacket
    | undefined;
  const candidates =
    latestUpload?.rows
      .filter((row) => !row.suppressed)
      .filter((row) => row.email && !sentOrTerminalEmails.has(row.email.toLowerCase()))
      .map((row) => ({
        name: row.name,
        email: row.email,
        phone: row.phone,
        jobDate: row.jobDate,
        notes: row.notes,
      })) ?? [];

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    clientSlug,
    clientName: client.businessName,
    sourceUploadAt: latestUpload?.timestamp ?? "",
    totalCandidates: candidates.length,
    candidates,
  });
}

function cleanParam(value: string | null) {
  return (value ?? "").trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}
