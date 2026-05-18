import { NextRequest, NextResponse } from "next/server";
import { getReportRun, type ReportRun } from "@/lib/report-runs";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const GHL_STATUS_FIELDS = {
  auditReportId: "JKPbbyPcfOj7txgfLmf7",
  ppRunId: "geldiMOzEdDWrKq0S4v5",
  auditUrl: "MtlBT8xoZZOWoK58XnpR",
  heatmapUrl: "Gpup0b6SBHYb768NOPuk",
} as const;

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId")?.trim();
  if (!runId) {
    return NextResponse.json({ ok: false, error: "Missing runId" }, { status: 400 });
  }

  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() || "";
  const run = getReportRun(runId) ?? (await getReportRunFromGHL({ runId, email }));
  if (!run) {
    return NextResponse.json({
      ok: true,
      run: {
        runId,
        email: email || "unknown@unknown.local",
        businessName: "Unknown Business",
        campaign: "organic",
        reportType: "marketing",
        secondaryReport: false,
        submittedAt: Date.now(),
      },
      timing: {
        secondsSinceSubmit: 0,
        reportSeconds: null,
        heatmapSeconds: null,
      },
      stage: "submitted",
    });
  }

  const now = Date.now();
  const timing = {
    secondsSinceSubmit: Math.max(0, Math.round((now - run.submittedAt) / 1000)),
    reportSeconds: run.reportReadyAt
      ? Math.max(0, Math.round((run.reportReadyAt - run.submittedAt) / 1000))
      : null,
    heatmapSeconds: run.heatmapReadyAt
      ? Math.max(0, Math.round((run.heatmapReadyAt - run.submittedAt) / 1000))
      : null,
  };

  return NextResponse.json({
    ok: true,
    run,
    timing,
    stage: run.heatmapReadyAt ? "heatmap_ready" : run.reportReadyAt ? "report_ready" : "submitted",
  });
}

async function getReportRunFromGHL(input: {
  runId: string;
  email: string;
}): Promise<ReportRun | null> {
  if (!input.email) return null;
  const token = process.env.GHL_PIT_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) return null;

  try {
    const url = new URL(`${GHL_API_BASE}/contacts/`);
    url.searchParams.set("locationId", locationId);
    url.searchParams.set("query", input.email);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        Version: GHL_API_VERSION,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as {
      contacts?: Array<{
        email?: string;
        contactName?: string;
        companyName?: string;
        customFields?: Array<{ id?: string; value?: unknown }>;
      }>;
    } | null;
    const contact = data?.contacts?.find(
      (candidate) => candidate.email?.trim().toLowerCase() === input.email,
    );
    if (!contact) return null;
    const customFields = contact.customFields ?? [];
    const storedRunId =
      getCustomFieldValue(customFields, GHL_STATUS_FIELDS.auditReportId) ??
      getCustomFieldValue(customFields, GHL_STATUS_FIELDS.ppRunId);
    if (storedRunId !== input.runId) return null;

    const auditUrl = getCustomFieldValue(customFields, GHL_STATUS_FIELDS.auditUrl);
    const heatmapUrl = getCustomFieldValue(customFields, GHL_STATUS_FIELDS.heatmapUrl);
    const now = Date.now();
    return {
      runId: input.runId,
      email: input.email,
      businessName: contact.companyName || contact.contactName || "Unknown Business",
      campaign: "organic",
      reportType: "marketing",
      secondaryReport: Boolean(heatmapUrl),
      submittedAt: now,
      ...(auditUrl ? { auditUrl, reportReadyAt: now } : {}),
      ...(heatmapUrl ? { heatmapUrl, heatmapReadyAt: now } : {}),
    };
  } catch {
    return null;
  }
}

function getCustomFieldValue(
  fields: Array<{ id?: string; value?: unknown }>,
  id: string,
): string | undefined {
  const value = fields.find((field) => field.id === id)?.value;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
