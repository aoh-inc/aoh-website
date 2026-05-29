// Proposed 20-point AI Visibility Report component.
// NEW FILE — does NOT replace components/client/ClientReportCenter.tsx.
// Kept separate for review and comparison.
//
// Usage:
//   <VisibilityReport20 mode="baseline" signals={signals} businessName="..." />
//   <VisibilityReport20 mode="delivery" signals={signals} before={19} after={64} />
//   <VisibilityReport20 mode="monthly"  signals={signals} before={58} after={71} />

import Link from "next/link";
import {
  calcScore,
  countGreen,
  GROUP_META,
  groupGreenCount,
  gradeFromGroupCount,
  overallGrade,
  resolveAfterStatus,
  resolveBeforeStatus,
  resolveStatus,
  SIGNAL_CATALOG,
  STAY_FOUND_MAINTAINED,
  scoreVerdict,
  type LetterGrade,
  type ReportMode,
  type SignalGroup,
  type SignalStatus,
  type VisibilitySignal20,
} from "@/lib/visibility-report-20";

// ─── Public props ─────────────────────────────────────────────────────────────

interface VisibilityReport20Props {
  mode: ReportMode;
  /** 20-signal array. Merge catalog defaults with live data via buildDemoSignals(). */
  signals: VisibilitySignal20[];
  businessName?: string;
  location?: string;
  periodLabel?: string;
  /** Competitor green count (0-20) for the benchmark line. */
  competitorGreens?: number;
  competitorName?: string;
  /** Show the CTA bar at the bottom. Default true for baseline mode. */
  showCta?: boolean;
}

// ─── Color tokens ─────────────────────────────────────────────────────────────

function statusColor(status: SignalStatus) {
  return {
    green: { bg: "bg-emerald-500/15", text: "text-emerald-700", border: "border-emerald-300/50", dot: "bg-emerald-500" },
    amber: { bg: "bg-amber-400/15",   text: "text-amber-700",   border: "border-amber-300/50",   dot: "bg-amber-400" },
    red:   { bg: "bg-red-500/15",     text: "text-red-600",     border: "border-red-300/50",      dot: "bg-red-500" },
  }[status];
}

function gradeColor(grade: LetterGrade) {
  return {
    A: "bg-emerald-500 text-white",
    B: "bg-emerald-400 text-white",
    C: "bg-amber-400 text-white",
    D: "bg-orange-500 text-white",
    F: "bg-red-500 text-white",
  }[grade];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status, label }: { status: SignalStatus; label?: string }) {
  const c = statusColor(status);
  const text = label ?? { green: "Done", amber: "Weak", red: "Missing" }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] ${c.bg} ${c.text} ${c.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} aria-hidden="true" />
      {text}
    </span>
  );
}

function GradeBadge({ grade }: { grade: LetterGrade }) {
  return (
    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-black ${gradeColor(grade)}`}>
      {grade}
    </span>
  );
}

function LockBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      Locked
    </span>
  );
}

// ─── Score gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({
  score,
  grade,
  label = "Visibility Score",
  size = "lg",
}: {
  score: number;
  grade: LetterGrade;
  label?: string;
  size?: "lg" | "sm";
}) {
  const r = size === "lg" ? 44 : 30;
  const cx = size === "lg" ? 56 : 38;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const scoreColor =
    score >= 70 ? "text-emerald-600" : score >= 40 ? "text-amber-500" : "text-red-500";
  const strokeColor =
    score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <div className="relative" style={{ width: cx * 2, height: cx * 2 }}>
        <svg viewBox={`0 0 ${cx * 2} ${cx * 2}`} width={cx * 2} height={cx * 2} aria-hidden="true">
          {/* Track */}
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e5e7eb" strokeWidth={size === "lg" ? 8 : 6} />
          {/* Progress */}
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={size === "lg" ? 8 : 6}
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cx})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black leading-none ${size === "lg" ? "text-3xl" : "text-xl"} ${scoreColor}`}>
            {score}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)]">/100</span>
        </div>
      </div>
      <GradeBadge grade={grade} />
    </div>
  );
}

// ─── Signal row ───────────────────────────────────────────────────────────────

function SignalRow({
  signal,
  mode,
  index,
}: {
  signal: VisibilitySignal20;
  mode: ReportMode;
  index: number;
}) {
  const currentStatus = resolveStatus(signal, mode);
  const beforeStatus = resolveBeforeStatus(signal);
  const afterStatus = resolveAfterStatus(signal);

  return (
    <div className={`grid items-start gap-x-4 gap-y-2 py-3 rounded-lg px-2 transition-colors hover:bg-[var(--color-border)]/30 -mx-2 ${
      index > 0 ? "border-t border-[var(--color-border)]" : ""
    } grid-cols-[auto_1fr_auto] md:grid-cols-[24px_1fr_auto_auto]`}>
      {/* Status dot (mobile: leftmost) */}
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
        <span
          className={`h-2.5 w-2.5 rounded-full ${statusColor(currentStatus).dot}`}
          aria-label={currentStatus}
        />
      </div>

      {/* Label + plain text */}
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-snug text-[var(--color-text-body)]">
          {signal.label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-[var(--color-text-muted)]">
          {signal.plainText}
        </p>
        {/* mobile badge row */}
        <div className="mt-2 flex flex-wrap gap-1.5 md:hidden">
          {mode === "baseline" && (
            <>
              <StatusBadge status={beforeStatus} label="Now" />
              <LockBadge />
            </>
          )}
          {mode === "delivery" && (
            <>
              <StatusBadge status={beforeStatus} label="Before" />
              <span className="text-[var(--color-text-muted)] self-center">→</span>
              <StatusBadge status={afterStatus} label="After" />
            </>
          )}
          {mode === "monthly" && (
            <>
              <StatusBadge status={currentStatus} />
              {signal.changedSinceLast && (
                <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Changed
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Desktop: Before badge */}
      <div className="hidden md:flex items-center">
        {mode === "baseline" && <StatusBadge status={beforeStatus} label="Now" />}
        {mode === "delivery" && <StatusBadge status={beforeStatus} label="Before" />}
        {mode === "monthly" && <StatusBadge status={currentStatus} />}
      </div>

      {/* Desktop: After badge (or lock in baseline) */}
      <div className="hidden md:flex items-center">
        {mode === "baseline" && (
          <div className="text-center">
            <LockBadge />
            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Get Found</p>
          </div>
        )}
        {mode === "delivery" && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--color-text-muted)]">→</span>
            <StatusBadge status={afterStatus} label="After" />
          </div>
        )}
        {mode === "monthly" && signal.changedSinceLast && (
          <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            Changed
          </span>
        )}
        {mode === "monthly" && !signal.changedSinceLast && (
          <span className="text-[10px] text-[var(--color-text-muted)]">—</span>
        )}
      </div>
    </div>
  );
}

// ─── Group section ────────────────────────────────────────────────────────────

function GroupSection({
  group,
  signals,
  mode,
}: {
  group: SignalGroup;
  signals: VisibilitySignal20[];
  mode: ReportMode;
}) {
  const groupSignals = SIGNAL_CATALOG
    .filter((c) => c.group === group)
    .map((c) => signals.find((s) => s.id === c.id) ?? { ...c, status: "red" as SignalStatus });
  const meta = GROUP_META[group];
  const greens = groupGreenCount(groupSignals as VisibilitySignal20[], group, mode);
  const grade = gradeFromGroupCount(greens);

  return (
    <section
      aria-labelledby={`group-${group}-heading`}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden"
    >
      {/* Section header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-page)] px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Group {group}
          </span>
          <h3 id={`group-${group}-heading`} className="text-sm font-bold text-[var(--color-text-body)]">
            {meta.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">{greens}/5</span>
          <GradeBadge grade={grade} />
        </div>
      </div>

      {/* Column headers — desktop only */}
      <div className="hidden md:grid grid-cols-[24px_1fr_auto_auto] gap-x-4 border-b border-[var(--color-border)] bg-[var(--color-bg-page)]/50 px-5 py-2">
        <div />
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Signal</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          {mode === "baseline" ? "Now" : mode === "delivery" ? "Before" : "Status"}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          {mode === "baseline" ? "After Get Found" : mode === "delivery" ? "After" : "Changed"}
        </p>
      </div>

      {/* Signal rows */}
      <div className="px-5">
        {groupSignals.map((signal, i) => (
          <SignalRow
            key={signal.id}
            signal={signal as VisibilitySignal20}
            mode={mode}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function VisibilityReport20({
  mode,
  signals,
  businessName = "Your Business",
  location,
  periodLabel,
  competitorGreens,
  competitorName = "a top-visible competitor near you",
  showCta,
}: VisibilityReport20Props) {
  const showCtaBar = showCta ?? mode === "baseline";
  const greens = countGreen(signals, mode);
  const score = calcScore(signals, mode);
  const grade = overallGrade(greens);
  const verdict = scoreVerdict(score, mode);

  // For delivery / monthly: also show before-state score
  const beforeGreens = mode !== "baseline"
    ? signals.filter((s) => (s.beforeStatus ?? "red") === "green").length
    : null;
  const beforeScore = beforeGreens !== null ? Math.round((beforeGreens / 20) * 100) : null;
  const beforeGrade = beforeGreens !== null ? overallGrade(beforeGreens) : null;

  const modeLabel =
    mode === "baseline" ? "Free Visibility Check"
    : mode === "delivery" ? "Get Found — Delivery Proof"
    : "Stay Found — Monthly Report";

  return (
    <div className="space-y-6">

      {/* ── Header / score block ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {modeLabel}
            </p>
            <h2 className="mt-2 text-xl font-bold text-[var(--color-text-body)] md:text-2xl">
              {businessName}
              {location && (
                <span className="ml-2 text-base font-normal text-[var(--color-text-muted)]">
                  · {location}
                </span>
              )}
            </h2>
            {periodLabel && (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{periodLabel}</p>
            )}
          </div>
        </div>

        {/* Score display */}
        <div className="mt-6 flex flex-wrap items-center gap-8">
          {/* Before gauge (delivery/monthly only) */}
          {beforeScore !== null && beforeGrade !== null && (
            <>
              <ScoreGauge score={beforeScore} grade={beforeGrade} label="Before" size="sm" />
              <span className="text-2xl text-[var(--color-text-muted)]">→</span>
            </>
          )}

          {/* Main gauge */}
          <ScoreGauge
            score={score}
            grade={grade}
            label={mode === "baseline" ? "Visibility Score" : mode === "delivery" ? "After" : "Current Score"}
          />

          {/* Verdict + competitor line */}
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-[var(--color-text-body)] md:text-lg">
              {verdict}
            </p>
            {mode === "baseline" && competitorGreens !== undefined && (
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {competitorName} scores approximately{" "}
                <strong>{Math.round((competitorGreens / 20) * 100)}/100</strong>
                {" "}({competitorGreens}/20 green).
              </p>
            )}
            {mode === "delivery" && beforeScore !== null && (
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {score - beforeScore > 0
                  ? `+${score - beforeScore} point improvement from the Visibility Engine.`
                  : "Signals have been aligned — score reflects baseline fixes."}
              </p>
            )}
          </div>
        </div>

        {/* Grade breakdown chips */}
        <div className="mt-6 flex flex-wrap gap-3">
          {(["A", "B", "C", "D"] as SignalGroup[]).map((g) => {
            const greensInGroup = groupGreenCount(signals, g, mode);
            const gGrade = gradeFromGroupCount(greensInGroup);
            return (
              <div key={g} className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] px-3 py-2">
                <GradeBadge grade={gGrade} />
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-body)]">{GROUP_META[g].name}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{greensInGroup}/5 green</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4 Group sections ──────────────────────────────────────────────── */}
      {(["A", "B", "C", "D"] as SignalGroup[]).map((g) => (
        <GroupSection key={g} group={g} signals={signals} mode={mode} />
      ))}

      {/* ── Legend / Rubric ───────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-6">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          How this report works
        </h3>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {/* Color key */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Color key
            </p>
            <div className="space-y-2">
              {(["green", "amber", "red"] as SignalStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${statusColor(s).dot}`} />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {s === "green" ? "Done — signal is healthy" : s === "amber" ? "Weak — partial or inconsistent" : "Missing — signal is absent or broken"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Scoring
            </p>
            <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              Visibility Score = % of 20 signals that are green (done). Each signal is
              equally weighted. Section grades (A–F) reflect how many of the 5 signals
              in that group are green: 5=A, 4=B, 3=C, 2=D, 0–1=F.
            </p>
          </div>

          {/* Stay Found */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Maintained by Stay Found
            </p>
            <p className="mb-2 text-xs text-[var(--color-text-muted)]">
              These signals drift back without ongoing upkeep:
            </p>
            <ul className="space-y-1">
              {STAY_FOUND_MAINTAINED.map((label) => (
                <li key={label} className="flex items-start gap-1.5 text-xs text-[var(--color-text-muted)]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA bar (baseline mode by default) ───────────────────────────── */}
      {showCtaBar && (
        <section className="rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.05] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-[var(--color-text-body)]">
                Get Found turns {20 - greens} red/amber signal{20 - greens !== 1 ? "s" : ""} green in 48 hours.
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                No contract. If any fix isn&apos;t right, we fix it.{" "}
                <Link href="/guarantee" className="text-[var(--color-accent)] underline underline-offset-2">
                  Guarantee →
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Link
                href="/checkout/get-found-refresh"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5"
              >
                Get Found for $149 →
              </Link>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                48 hours · no contract · no tech skills needed
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Demo preview page helper (for /report/ai-visibility/demo or Storybook) ──

export function VisibilityReport20Demo() {
  const { buildDemoSignals } = require("@/lib/visibility-report-20");

  const baselineSignals = buildDemoSignals({
    // Group A — all red by default; override a couple to amber
    2: { beforeStatus: "amber", afterStatus: "green" },
    4: { beforeStatus: "amber", afterStatus: "amber" },
    // Group B — one green
    8: { beforeStatus: "green", afterStatus: "green" },
    // Group C — two greens
    11: { beforeStatus: "green", afterStatus: "green" },
    13: { beforeStatus: "amber", afterStatus: "green" },
    // Group D — all red
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-16">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-text-body)]">Mode: baseline</h2>
        <VisibilityReport20
          mode="baseline"
          signals={baselineSignals}
          businessName="Lakeside Family Dentistry"
          location="Hartford, CT"
          competitorGreens={13}
          competitorName="a top-visible dental practice nearby"
        />
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-text-body)]">Mode: delivery</h2>
        <VisibilityReport20
          mode="delivery"
          signals={baselineSignals}
          businessName="Lakeside Family Dentistry"
          location="Hartford, CT"
          periodLabel="Get Found — delivered June 2026"
        />
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-text-body)]">Mode: monthly</h2>
        <VisibilityReport20
          mode="monthly"
          signals={buildDemoSignals({
            2: { status: "green", beforeStatus: "amber", changedSinceLast: true },
            8: { status: "green", beforeStatus: "green" },
            11: { status: "green", beforeStatus: "green" },
            13: { status: "green", beforeStatus: "green" },
            19: { status: "amber", beforeStatus: "green", changedSinceLast: true },
          })}
          businessName="Lakeside Family Dentistry"
          location="Hartford, CT"
          periodLabel="May 2026 monthly recap"
          showCta={false}
        />
      </div>
    </div>
  );
}
