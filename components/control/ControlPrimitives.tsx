import type { ReactNode } from "react";

export function ControlShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className={`mx-auto px-4 py-8 md:px-8 md:py-12 ${wide ? "w-full max-w-none" : "max-w-7xl"}`}>
        {children}
      </div>
    </main>
  );
}

export function Pill({
  tone = "default",
  children,
}: {
  tone?:
    | "default"
    | "accent"
    | "warm"
    | "hot"
    | "warn"
    | "ok"
    | "muted"
    | "danger";
  children: ReactNode;
}) {
  const toneClass = {
    default: "border-zinc-700/60 bg-zinc-800/40 text-zinc-300",
    accent: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    warm: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    hot: "border-rose-500/40 bg-rose-500/10 text-rose-300",
    warn: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    ok: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
    muted: "border-zinc-800/60 bg-zinc-900/40 text-zinc-500",
    danger: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  }[tone];

  return (
    <span
      className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${toneClass}`}
    >
      {children}
    </span>
  );
}

export type AgentStatus = "live" | "manual" | "building" | "planned";

export function StatusDot({ status }: { status: AgentStatus }) {
  const config = {
    live: { color: "bg-emerald-400", pulse: true, label: "live" },
    manual: { color: "bg-sky-400", pulse: false, label: "manual" },
    building: { color: "bg-amber-400", pulse: true, label: "building" },
    planned: { color: "bg-zinc-600", pulse: false, label: "planned" },
  }[status];

  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
      <span className="relative inline-flex h-2 w-2">
        {config.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.color} opacity-75`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.color}`} />
      </span>
      {config.label}
    </span>
  );
}

export function FleetStrip({
  active,
  total,
  doneToday,
  queued,
}: {
  active: number;
  total: number;
  doneToday: number;
  queued: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5 md:grid-cols-4 md:gap-4 md:p-6">
      <StripCell label="Fleet active" value={`${active}/${total}`} accent />
      <StripCell label="Tasks done today" value={doneToday.toString()} />
      <StripCell label="Tasks queued" value={queued.toString()} />
      <StripCell label="Fleet health" value="100%" accent />
    </div>
  );
}

function StripCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-3xl font-bold leading-none md:text-4xl ${
          accent ? "text-emerald-300" : "text-zinc-50"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export type AgentActivity = {
  lastDone?: string;
  doingNow: string;
  upNext: string;
};

export type OwnedRow = {
  primary: string;
  secondary?: string;
  badge?: {
    tone: "accent" | "warm" | "hot" | "warn" | "ok" | "muted" | "danger" | "default";
    label: string;
  };
};

export function AgentCard({
  name,
  role,
  status,
  cadence,
  activity,
  ownedTitle,
  ownedRows,
  ownedFooter,
}: {
  name: string;
  role: string;
  status: AgentStatus;
  cadence?: string;
  activity: AgentActivity;
  ownedTitle?: string;
  ownedRows?: OwnedRow[];
  ownedFooter?: ReactNode;
}) {
  const isDim = status === "planned";

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 shadow-2xl shadow-black/40 transition hover:border-zinc-700/80 ${
        isDim ? "opacity-60" : ""
      }`}
    >
      {/* Accent stripe top */}
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          status === "live"
            ? "bg-gradient-to-r from-emerald-500/0 via-emerald-500/80 to-emerald-500/0"
            : status === "manual"
              ? "bg-gradient-to-r from-sky-500/0 via-sky-500/80 to-sky-500/0"
              : status === "building"
                ? "bg-gradient-to-r from-amber-500/0 via-amber-500/80 to-amber-500/0"
                : "bg-zinc-800/40"
        }`}
      />

      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-mono text-lg font-bold uppercase tracking-wider text-zinc-50">
              {name}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-400">{role}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusDot status={status} />
            {cadence && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {cadence}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Activity log — 3 lines */}
      <div className="space-y-2.5 px-6 py-4">
        {activity.lastDone && (
          <ActivityLine label="Last done" body={activity.lastDone} dim />
        )}
        <ActivityLine label="Doing now" body={activity.doingNow} accent={status === "live" || status === "building"} />
        <ActivityLine label="Up next" body={activity.upNext} />
      </div>

      {/* Owned data */}
      {ownedRows && ownedRows.length > 0 && (
        <div className="border-t border-zinc-800/60 bg-black/20 px-6 py-4">
          {ownedTitle && (
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {ownedTitle}
            </p>
          )}
          <ul className="space-y-1.5">
            {ownedRows.map((r, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-zinc-200">{r.primary}</p>
                  {r.secondary && (
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {r.secondary}
                    </p>
                  )}
                </div>
                {r.badge && <Pill tone={r.badge.tone}>{r.badge.label}</Pill>}
              </li>
            ))}
          </ul>
          {ownedFooter && (
            <div className="mt-3 border-t border-zinc-800/40 pt-3">
              {ownedFooter}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ActivityLine({
  label,
  body,
  accent,
  dim,
}: {
  label: string;
  body: string;
  accent?: boolean;
  dim?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        className={`w-[5.5rem] flex-shrink-0 font-mono text-[10px] uppercase tracking-wider ${
          accent ? "text-emerald-400" : "text-zinc-500"
        }`}
      >
        {label}
      </span>
      <p
        className={`text-sm leading-snug ${
          dim ? "text-zinc-500" : accent ? "text-zinc-100" : "text-zinc-300"
        }`}
      >
        {body}
      </p>
    </div>
  );
}
