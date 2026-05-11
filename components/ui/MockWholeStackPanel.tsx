const services = [
  "Review Automation",
  "AI Visibility",
  "Reach — Lead Engine",
  "Studio — Content Engine",
  "Relay — Voice AI",
];

export function MockWholeStackPanel() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-inner backdrop-blur-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
          All 5 services · running
        </p>
        <span className="font-mono text-[9px] text-white/40">today</span>
      </div>

      <ul className="space-y-1.5">
        {services.map((s) => (
          <li
            key={s}
            className="flex items-center justify-between gap-2 rounded-md bg-white/[0.04] px-2 py-1.5"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]"
              />
              <span className="truncate text-[11px] text-white/85">{s}</span>
            </span>
            <span className="flex-shrink-0 font-mono text-[10px] text-[var(--color-accent)]">
              running
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-2 border-t border-white/10 pt-2 text-[9px] text-white/45 text-center">
        One bill · One onboarding · One monthly check-in
      </p>
    </div>
  );
}
