"use client";

import { useEffect, useMemo, useState } from "react";

type TimingResponse = {
  ok: boolean;
  stage?: "submitted" | "report_ready" | "heatmap_ready";
  run?: {
    auditUrl?: string;
    heatmapUrl?: string;
  };
  timing?: {
    secondsSinceSubmit: number;
    reportSeconds: number | null;
    heatmapSeconds: number | null;
  };
};

export function ReportTiming({ runId, email }: { runId: string; email?: string }) {
  const [state, setState] = useState<TimingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      try {
        const params = new URLSearchParams({ runId });
        if (email) params.set("email", email);
        const res = await fetch(`/api/report/status?${params.toString()}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as TimingResponse;
        if (!active) return;
        setState(json);
        if (json.ok && json.stage !== "heatmap_ready") {
          timer = setTimeout(tick, 3000);
        }
      } catch {
        if (!active) return;
        setError("Could not load timing status.");
      }
    }

    void tick();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [runId, email]);

  const stageLabel = useMemo(() => {
    if (!state?.ok) return "Waiting for status...";
    if (state.stage === "heatmap_ready") return "Heatmap ready";
    if (state.stage === "report_ready") return "Report ready, heatmap pending";
    return "Report generating";
  }, [state]);

  return (
    <div className="mt-6 rounded-xl border border-[var(--color-hero-border)] bg-white/5 p-4 max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
        Generation Status
      </p>
      <p className="mt-2 text-sm text-[var(--color-hero-text)]">{stageLabel}</p>
      {state?.ok && state.timing ? (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[var(--color-hero-subtext)]">
          <div>Elapsed: {state.timing.secondsSinceSubmit}s</div>
          <div>Report: {state.timing.reportSeconds ?? "pending"}</div>
          <div>Heatmap: {state.timing.heatmapSeconds ?? "pending"}</div>
        </div>
      ) : null}
      {state?.ok ? (
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {state.run?.auditUrl ? (
            <a
              href={state.run.auditUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-[var(--color-accent)]"
            >
              Open report
            </a>
          ) : (
            <span className="text-[var(--color-hero-subtext)]">Report link pending</span>
          )}
          {state.run?.heatmapUrl ? (
            <a
              href={state.run.heatmapUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-[var(--color-accent)]"
            >
              Open heatmap
            </a>
          ) : (
            <span className="text-[var(--color-hero-subtext)]">Heatmap link pending</span>
          )}
        </div>
      ) : null}
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
