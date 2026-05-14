import { NextRequest, NextResponse } from "next/server";
import { upsertReportRunFromCallback } from "@/lib/report-runs";

type CallbackPayload = {
  runId?: string;
  auditUrl?: string;
  heatmapUrl?: string;
  event?: "report_ready" | "heatmap_ready";
  [key: string]: unknown;
};

type GhlContactResponse = {
  contact?: {
    customFields?: Array<{ id?: string; value?: unknown }>;
  };
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
    pickString(root, ["auditUrl", "auditURL", "audit_report_url", "marketingReportUrl", "marketing_report_url"]) ??
    pickString(customData, ["auditUrl", "auditURL", "audit_report_url", "marketingReportUrl", "marketing_report_url"]);
  const heatmapUrl =
    pickString(root, ["heatmapUrl", "heatmapURL", "pp_heatmap_url", "mapsVisibilityUrl", "maps_visibility_url"]) ??
    pickString(customData, ["heatmapUrl", "heatmapURL", "pp_heatmap_url", "mapsVisibilityUrl", "maps_visibility_url"]);

  return extractRunIdFromUrl(auditUrl || undefined) ?? extractRunIdFromUrl(heatmapUrl || undefined);
}

function extractRunIdFromValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const fromUrl = extractRunIdFromUrl(trimmed);
  if (fromUrl) return fromUrl;
  const uuidMatch = trimmed.match(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i);
  return uuidMatch?.[0] ?? null;
}

function resolveContactId(body: CallbackPayload | null): string | null {
  if (!body) return null;
  const root = asRecord(body);
  const customData = asRecord(root.customData);
  return (
    pickString(root, ["contact_id", "contactId"]) ??
    pickString(customData, ["contact_id", "contactId"])
  );
}

async function resolveRunIdFromGhlContact(contactId: string): Promise<string | null> {
  const token = process.env.GHL_PIT_TOKEN?.trim();
  if (!token) return null;

  try {
    const res = await fetch(`https://services.leadconnectorhq.com/contacts/${encodeURIComponent(contactId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as GhlContactResponse | null;
    const fields = data?.contact?.customFields ?? [];
    for (const field of fields) {
      const runId = extractRunIdFromValue(field.value);
      if (runId) return runId;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.REPORT_CALLBACK_TOKEN;
  const provided = req.headers.get("x-report-callback-token");
  if (secret && provided !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as CallbackPayload | null;
  let resolvedRunId = resolveRunId(body);
  if (!resolvedRunId) {
    const contactId = resolveContactId(body);
    if (contactId) {
      resolvedRunId = await resolveRunIdFromGhlContact(contactId);
    }
  }

  if (!body || !resolvedRunId) {
    const root = asRecord(body);
    const customData = asRecord(root.customData);
    return NextResponse.json(
      {
        ok: false,
        error: "Missing runId",
        debug: {
          rootKeys: Object.keys(root).slice(0, 20),
          customDataKeys: Object.keys(customData).slice(0, 20),
          runCandidates: {
            runId: pickString(root, ["runId", "runID", "runid"]),
            pp_run_id: pickString(root, ["pp_run_id", "audit_report_id"]),
            customDataRunId: pickString(customData, ["runId", "runID", "runid", "pp_run_id", "audit_report_id"]),
          },
          urlCandidates: {
            auditUrl: pickString(root, ["auditUrl", "auditURL", "audit_report_url", "marketingReportUrl", "marketing_report_url"]),
            heatmapUrl: pickString(root, ["heatmapUrl", "heatmapURL", "pp_heatmap_url", "mapsVisibilityUrl", "maps_visibility_url"]),
            customDataAuditUrl: pickString(customData, ["auditUrl", "auditURL", "audit_report_url", "marketingReportUrl", "marketing_report_url"]),
            customDataHeatmapUrl: pickString(customData, ["heatmapUrl", "heatmapURL", "pp_heatmap_url", "mapsVisibilityUrl", "maps_visibility_url"]),
          },
        },
      },
      { status: 400 },
    );
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
