import { NextRequest, NextResponse } from "next/server";
import { getReportRun } from "@/lib/report-runs";

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId")?.trim();
  if (!runId) {
    return NextResponse.json({ ok: false, error: "Missing runId" }, { status: 400 });
  }

  const run = getReportRun(runId);
  if (!run) {
    return NextResponse.json({ ok: false, error: "Run not found" }, { status: 404 });
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
