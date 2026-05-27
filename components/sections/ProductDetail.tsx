import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";

export type ProductDetailData = {
  slug: string;
  number: string;
  name: string;
  outcome: string;
  story: string;
  stats: { label: string; value: string }[];
  whatYouGet: string[];
  useThisIf: string[];
  setupSteps: { title: string; sub: string }[];
  cadence: string;
  crossSell?: { label: string; href: string };
  price: string;
  cadenceLabel: string;
  setup: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  iconPaths: readonly string[];
  mock: ReactNode;
  variant?: "light" | "dark";
  quickMath?: {
    label: string;
    formula: string;
    note?: string;
  };
  promoNote?: string;
  coupon?: {
    code: string;
    headline: string;
    sub?: string;
  };
};

type NextRef = { label: string; href: string };

export function ProductDetail({
  data,
  next,
}: {
  data: ProductDetailData;
  next?: NextRef;
}) {
  const isExternalCta =
    data.ctaHref.startsWith("http://") ||
    data.ctaHref.startsWith("https://") ||
    data.ctaHref.startsWith("/checkout/");
  const dark = data.variant === "dark";

  const sectionBg = dark
    ? "bg-gray-950 text-[var(--color-hero-text)]"
    : "bg-[var(--color-bg-page)] text-[var(--color-text-body)]";

  const subText = dark
    ? "text-[var(--color-hero-subtext)]"
    : "text-[var(--color-text-muted)]";

  const cardBg = dark
    ? "bg-white/[0.04] ring-1 ring-white/10"
    : "bg-[var(--color-bg-elevated)] ring-1 ring-[var(--color-border)]";
  const sectionPadding = dark
    ? "pt-12 pb-8 md:pt-14 md:pb-10"
    : "py-14 md:py-16";
  const visualColumnClass = dark
    ? "space-y-6 flex h-full flex-col lg:order-1 lg:self-stretch"
    : "space-y-6 lg:sticky lg:top-32";

  return (
    <section
      id={data.slug}
      className={`relative scroll-mt-32 overflow-hidden ${sectionPadding} ${sectionBg}`}
    >
      {dark && <BackgroundBeams />}

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Watermark numeral */}
        <p
          aria-hidden="true"
          className={`pointer-events-none absolute right-6 top-10 font-mono text-[6rem] md:text-[9rem] font-bold leading-none tracking-tighter ${
            dark ? "text-white/[0.06]" : "text-[var(--color-accent)]/[0.08]"
          }`}
        >
          {data.number}
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-stretch lg:gap-16">
          {/* Text content (order flips on dark variants → mock-left, text-right) */}
          <div className={dark ? "lg:order-2" : ""}>
            <div className="mb-5 flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  dark
                    ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/40"
                    : "bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20"
                }`}
              >
                <AnimatedIcon paths={data.iconPaths} size={18} />
              </span>
              <p
                className={`font-mono text-xs uppercase tracking-[0.2em] ${
                  dark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"
                }`}
              >
                {data.number} · {data.name}
              </p>
            </div>

            <h2
              className={`text-3xl md:text-4xl font-bold mb-5 leading-tight ${
                dark ? "text-[var(--color-hero-text)]" : "text-[var(--color-text-body)]"
              }`}
            >
              {data.outcome}
            </h2>
            <p className={`text-base md:text-lg leading-relaxed mb-8 ${subText}`}>{data.story}</p>

            {/* Quick napkin math (optional) */}
            {data.quickMath && (
              <div
                className={`mb-8 rounded-2xl p-5 ${
                  dark
                    ? "bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/40"
                    : "bg-[var(--color-accent-soft)] ring-1 ring-[var(--color-accent)]/25"
                }`}
              >
                <p
                  className={`mb-2 font-mono text-[11px] uppercase tracking-[0.2em] ${
                    dark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"
                  }`}
                >
                  {data.quickMath.label}
                </p>
                <p
                  className={`font-mono text-sm md:text-base leading-snug ${
                    dark ? "text-[var(--color-hero-text)]" : "text-[var(--color-text-body)]"
                  }`}
                >
                  {data.quickMath.formula}
                </p>
                {data.quickMath.note && (
                  <p className={`mt-2 text-xs ${subText}`}>{data.quickMath.note}</p>
                )}
              </div>
            )}

            {/* Stat row */}
            <div className="mb-10 grid grid-cols-3 gap-3">
              {data.stats.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl px-3 py-3 text-center ${cardBg}`}
                >
                  <p
                    className={`text-base md:text-lg font-bold ${
                      dark ? "text-[var(--color-hero-text)]" : "text-[var(--color-text-body)]"
                    }`}
                  >
                    {s.value}
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[10px] uppercase tracking-wider ${subText}`}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* What you get */}
            <div className="mb-10">
              <p
                className={`mb-3 font-mono text-[11px] uppercase tracking-[0.2em] ${
                  dark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"
                }`}
              >
                What you get
              </p>
              <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm ${subText}`}>
                {data.whatYouGet.map((f) => (
                  <li key={f} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">✓</span>
                    {data.slug === "review-automation" &&
                    f === "You reply yourself (upgrade to AI Visibility for replies in your voice + SMS)" ? (
                      <span>
                        You reply yourself (upgrade to{" "}
                        <Link
                          href="#ai-visibility"
                          className="underline underline-offset-2 text-[var(--color-accent)] hover:opacity-80"
                        >
                          AI Visibility
                        </Link>{" "}
                        for replies in your voice + SMS)
                      </span>
                    ) : (
                      <span>{f}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Use this if */}
            <div className="mb-10">
              <p
                className={`mb-3 font-mono text-[11px] uppercase tracking-[0.2em] ${
                  dark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"
                }`}
              >
                Use this if
              </p>
              <ul className={`space-y-1.5 text-sm ${subText}`}>
                {data.useThisIf.map((u) => (
                  <li key={u} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">•</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual + setup + price recap (flips to lg:order-1 on dark variants → mock-left) */}
          <div className={visualColumnClass}>
            {/* Visual panel */}
            <div className="relative rounded-2xl bg-[var(--color-bg-dark-card)] p-6 ring-1 ring-[var(--color-hero-border)] overflow-hidden">
              <div className="relative z-10">{data.mock}</div>
            </div>

            {/* Setup timeline */}
            <div className={`rounded-2xl p-5 ${cardBg}`}>
              <p
                className={`mb-3 font-mono text-[11px] uppercase tracking-[0.2em] ${
                  dark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"
                }`}
              >
                How it rolls out
              </p>
              <ol className="space-y-3">
                {data.setupSteps.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                        dark
                          ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/40"
                          : "bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          dark ? "text-[var(--color-hero-text)]" : "text-[var(--color-text-body)]"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className={`text-xs ${subText}`}>{step.sub}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className={`mt-4 border-t pt-3 text-xs ${subText} ${
                dark ? "border-white/10" : "border-[var(--color-border)]"
              }`}>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] mr-1.5">TIMELINE</span>
                {data.cadence}
              </p>
            </div>

            {/* Price recap */}
            <div
              className={`rounded-2xl p-6 pb-8 ${
                dark
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-text)] lg:flex-1"
                  : "bg-[var(--color-bg-dark-card)] text-[var(--color-hero-text)] ring-1 ring-[var(--color-hero-border)]"
              }`}
            >
              <div className="mb-4 flex flex-wrap items-baseline gap-1">
                <span className="text-4xl font-bold">{data.price}</span>
                <span className={`text-base ${dark ? "" : "text-[var(--color-hero-subtext)]"}`}>
                  {data.cadenceLabel}
                </span>
                <span
                  className={`ml-auto whitespace-nowrap text-xs ${
                    dark ? "text-[var(--color-accent-text)]/80" : "text-[var(--color-hero-subtext)]"
                  }`}
                >
                  {data.setup}
                </span>
              </div>
              {data.promoNote && (
                <p className={`-mt-2 mb-4 text-xs font-medium ${
                  dark ? "text-amber-300" : "text-amber-600"
                }`}>
                  🏷 {data.promoNote}
                </p>
              )}
              {data.coupon && (
                <div
                  className={`mb-4 rounded-xl border-2 border-dashed px-4 py-3.5 ${
                    dark
                      ? "border-amber-400/60 bg-amber-400/10"
                      : "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/[0.06]"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold leading-tight ${
                      dark ? "text-[var(--color-hero-text)]" : "text-[var(--color-text-body)]"
                    }`}
                  >
                    {data.coupon.headline}
                  </p>
                  <p
                    className={`mt-1.5 font-mono text-lg font-bold tracking-[0.15em] ${
                      dark ? "text-amber-300" : "text-[var(--color-accent)]"
                    }`}
                  >
                    Code: {data.coupon.code}
                  </p>
                  {data.coupon.sub && (
                    <p
                      className={`mt-1 text-[11px] ${
                        dark ? "text-[var(--color-hero-subtext)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {data.coupon.sub}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Link
                  href={data.ctaHref}
                  target={isExternalCta ? "_blank" : undefined}
                  rel={isExternalCta ? "noopener noreferrer" : undefined}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all hover:gap-3 ${
                    dark
                      ? "bg-[var(--color-accent-text)] text-[var(--color-accent)] hover:bg-white"
                      : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
                  }`}
                >
                  {data.ctaLabel}
                  <span aria-hidden="true">→</span>
                </Link>
                <p className={`text-center text-[11px] ${dark ? "text-[var(--color-accent-text)]/50" : "text-[var(--color-hero-subtext)]/50"}`}>
                  No contract · Cancel anytime
                </p>
                <Link
                  href={data.secondaryCtaHref ?? "/contact"}
                  target={data.secondaryCtaHref?.startsWith("http") ? "_blank" : undefined}
                  rel={data.secondaryCtaHref?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors ${
                    dark
                      ? "border-[var(--color-accent-text)]/35 text-[var(--color-accent-text)] hover:bg-white/10"
                      : "border-[var(--color-hero-border)] text-[var(--color-hero-subtext)] hover:bg-white/5"
                  }`}
                >
                  {data.secondaryCtaLabel ?? "Book a Call"}
                </Link>
              </div>
              {data.crossSell && (
                <p
                  className={`mt-3 text-xs ${
                    dark
                      ? "text-[var(--color-accent-text)]/80"
                      : "text-[var(--color-hero-subtext)]"
                  }`}
                >
                  Pairs with:{" "}
                  <Link
                    href={data.crossSell.href}
                    className="underline underline-offset-2 hover:opacity-80"
                  >
                    {data.crossSell.label}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Inter-section nav: Next link (01-05) or Back to top (06) */}
        <div className="mt-10 flex justify-center">
          {next ? (
            <Link
              href={next.href}
              className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
                dark
                  ? "text-white/60 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Next: {next.label}
              <span aria-hidden="true">↓</span>
            </Link>
          ) : (
            <Link
              href="#top"
              className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
                dark
                  ? "text-white/60 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span aria-hidden="true">↑</span>
              Back to top
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}



