export type ReportStage = "submitted" | "report_ready" | "heatmap_ready";

export type ReportRun = {
  runId: string;
  email: string;
  campaign: "reviews" | "ai" | "organic";
  reportType: "marketing" | "ai_visibility";
  secondaryReport: boolean;
  submittedAt: number;
  reportReadyAt?: number;
  heatmapReadyAt?: number;
  auditUrl?: string;
  heatmapUrl?: string;
};

const runs = new Map<string, ReportRun>();

export function createReportRun(input: {
  runId: string;
  email: string;
  campaign: "reviews" | "ai" | "organic";
  reportType: "marketing" | "ai_visibility";
  secondaryReport: boolean;
}): ReportRun {
  const run: ReportRun = {
    runId: input.runId,
    email: input.email,
    campaign: input.campaign,
    reportType: input.reportType,
    secondaryReport: input.secondaryReport,
    submittedAt: Date.now(),
  };
  runs.set(run.runId, run);
  return run;
}

export function updateReportRun(
  runId: string,
  patch: Partial<Pick<ReportRun, "reportReadyAt" | "heatmapReadyAt" | "auditUrl" | "heatmapUrl">>,
): ReportRun | null {
  const run = runs.get(runId);
  if (!run) return null;
  const next = { ...run, ...patch };
  runs.set(runId, next);
  return next;
}

export function upsertReportRunFromCallback(input: {
  runId: string;
  patch: Partial<Pick<ReportRun, "reportReadyAt" | "heatmapReadyAt" | "auditUrl" | "heatmapUrl">>;
}): ReportRun {
  const existing = runs.get(input.runId);
  if (existing) {
    const next = { ...existing, ...input.patch };
    runs.set(input.runId, next);
    return next;
  }

  // Production callbacks can hit a different instance than submit.
  // Seed a minimal run so callback updates are never dropped.
  const seeded: ReportRun = {
    runId: input.runId,
    email: "unknown@unknown.local",
    campaign: "organic",
    reportType: "marketing",
    secondaryReport: false,
    submittedAt: Date.now(),
    ...input.patch,
  };
  runs.set(input.runId, seeded);
  return seeded;
}

export function getReportRun(runId: string): ReportRun | null {
  return runs.get(runId) ?? null;
}
