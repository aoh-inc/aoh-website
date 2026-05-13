import { NextRequest, NextResponse } from "next/server";
import { upsertReportRunFromCallback } from "@/lib/report-runs";

type CallbackPayload = {
  runId?: string;
  auditUrl?: string;
  heatmapUrl?: string;
  event?: "report_ready" | "heatmap_ready";
  [key: string]: unknown;
};

function extractRunIdFromUrl(urlValue?: string): string | null {
  if (!urlValue) return null;
  try {
    const u = new URL(urlValue);
    const runId = u.searchParams.get("runId");
    return runId?.trim() || null;
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function pickString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) continue;
      if (trimmed.includes("{{") && trimmed.includes("}}")) continue;
      return trimmed;
    }
  }
  return null;
}

function resolveRunId(body: CallbackPayload | null): string | null {
  if (!body) return null;
  const root = asRecord(body);
  const customData = asRecord(root.customData);

  // GHL field-key variants we have observed across actions.
  const runId =
    pickString(root, ["runId", "runID", "runid", "pp_run_id", "audit_report_id"]) ??
    pickString(customData, ["runId", "runID", "runid", "pp_run_id", "audit_report_id"]);
  if (runId) return runId;

  const auditUrl =
    pickString(root, ["auditUrl", "auditURL", "audit_report_url"]) ??
    pickString(customData, ["auditUrl", "auditURL", "audit_report_url"]);
  const heatmapUrl =
    pickString(root, ["heatmapUrl", "heatmapURL", "pp_heatmap_url"]) ??
    pickString(customData, ["heatmapUrl", "heatmapURL", "pp_heatmap_url"]);

  return extractRunIdFromUrl(auditUrl || undefined) ?? extractRunIdFromUrl(heatmapUrl || undefined);
}

export async function POST(req: NextRequest) {
  const secret = process.env.REPORT_CALLBACK_TOKEN;
  const provided = req.headers.get("x-report-callback-token");
  if (secret && provided !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as CallbackPayload | null;
  const resolvedRunId = resolveRunId(body);

  if (!body || !resolvedRunId) {
    return NextResponse.json({ ok: false, error: "Missing runId" }, { status: 400 });
  }

  const now = Date.now();
  const patch: {
    reportReadyAt?: number;
    heatmapReadyAt?: number;
    auditUrl?: string;
    heatmapUrl?: string;
  } = {};

  if (body.auditUrl) patch.auditUrl = body.auditUrl;
  if (body.heatmapUrl) patch.heatmapUrl = body.heatmapUrl;

  if (body.event === "report_ready") patch.reportReadyAt = now;
  if (body.event === "heatmap_ready") patch.heatmapReadyAt = now;

  // If event omitted but auditUrl is present, treat as report-ready.
  if (!body.event && body.auditUrl) patch.reportReadyAt = now;

  const run = upsertReportRunFromCallback({
    runId: resolvedRunId,
    patch,
  });

  return NextResponse.json({ ok: true, runId: run.runId });
}
