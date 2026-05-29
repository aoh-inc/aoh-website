import Link from "next/link";

const BULLETS = [
  "Google listing corrected — hours, photos, services, description",
  "Website matched to your Google listing exactly",
  "First review requests sent to past customers",
  "Before/after visibility report delivered in 48 hours",
];

interface GetFoundCloseBlockProps {
  variant?: "dark" | "light";
  showCta?: boolean;
}

export function GetFoundCloseBlock({ variant = "dark", showCta = true }: GetFoundCloseBlockProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-2xl border p-6 ${
        isDark
          ? "border-white/10 bg-white/[0.04]"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
      }`}
    >
      <p className={`mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"}`}>
        Get Found — $149 one-time
      </p>

      <ul className="mb-5 space-y-2">
        {BULLETS.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isDark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span className={`text-sm leading-snug ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
              {b}
            </span>
          </li>
        ))}
      </ul>

      <div className={`mb-5 flex flex-wrap gap-2`}>
        {["48 hours", "No contract", "No tech skills needed"].map((pill) => (
          <span
            key={pill}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
              isDark
                ? "border-white/10 text-white/50"
                : "border-[var(--color-border)] text-[var(--color-text-muted)]"
            }`}
          >
            {pill}
          </span>
        ))}
      </div>

      <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
        isDark
          ? "border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.06] text-white/60"
          : "border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04] text-[var(--color-text-muted)]"
      }`}>
        <span className={`font-semibold ${isDark ? "text-white/80" : "text-[var(--color-text-body)]"}`}>Guarantee: </span>
        If any fix in your report isn&apos;t done correctly, we fix it. No questions, no fee.{" "}
        <Link
          href="/guarantee"
          className={`underline underline-offset-2 transition-opacity hover:opacity-80 ${isDark ? "text-white/50" : "text-[var(--color-text-muted)]"}`}
        >
          Full policy →
        </Link>
      </div>

      {showCta && (
        <Link
          href="/checkout/get-found-refresh"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
        >
          Get Found for $149
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
