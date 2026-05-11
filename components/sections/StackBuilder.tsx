"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { ICON_PATHS } from "@/lib/icon-paths";

type Service = {
  slug: string;
  name: string;
  oneLiner: string;
  monthly: number;
  setup: number;
  href: string;
  iconPaths: readonly string[];
};

const SERVICES: Service[] = [
  {
    slug: "review-automation",
    name: "Review Automation",
    oneLiner: "Reviews on autopilot after every job.",
    monthly: 49,
    setup: 0,
    href: "/checkout/review-automation",
    iconPaths: ICON_PATHS.star,
  },
  {
    slug: "ai-visibility",
    name: "AI Visibility",
    oneLiner: "Cited in ChatGPT, Google AI, Perplexity.",
    monthly: 179,
    setup: 199,
    href: "/checkout/ai-visibility",
    iconPaths: ICON_PATHS.search,
  },
  {
    slug: "reach",
    name: "Reach — Lead Engine",
    oneLiner: "Done-for-you outreach. Calls on your calendar.",
    monthly: 249,
    setup: 199,
    href: "/checkout/reach",
    iconPaths: ICON_PATHS.target,
  },
  {
    slug: "studio",
    name: "Studio — Content Engine",
    oneLiner: "Branded posts 3–5×/week in your voice.",
    monthly: 349,
    setup: 299,
    href: "/checkout/studio",
    iconPaths: ICON_PATHS.studio,
  },
  {
    slug: "relay",
    name: "Relay — Voice AI",
    oneLiner: "24/7 multilingual receptionist. Books calls.",
    monthly: 499,
    setup: 499,
    href: "/checkout/relay",
    iconPaths: ICON_PATHS.phone,
  },
];

const STACK_MONTHLY = 999;
const STACK_SETUP = 999;
const STACK_HREF = "/checkout/whole-stack";
const BOOKING_HREF = "https://link.hub360ai.com/widget/booking/fVfL3Xth5gEW9mRjZS56";

function money(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

export function StackBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const totals = useMemo(() => {
    const picks = SERVICES.filter((s) => selected.has(s.slug));
    const monthly = picks.reduce((acc, s) => acc + s.monthly, 0);
    const setup = picks.reduce((acc, s) => acc + s.setup, 0);
    const count = picks.length;
    const monthlySavings = Math.max(0, monthly - STACK_MONTHLY);
    const showStackSuggestion = monthly > 700;
    return { picks, monthly, setup, count, monthlySavings, showStackSuggestion };
  }, [selected]);

  const cta = (() => {
    if (totals.count === 0) {
      return {
        label: "Pick a service to start",
        href: "#",
        disabled: true,
        hint: "Tap a service on the left.",
      };
    }
    if (totals.count === 1) {
      const only = totals.picks[0];
      return {
        label: `Continue — ${money(only.monthly)}/mo`,
        href: only.href,
        disabled: false,
        hint: only.setup > 0 ? `${money(only.setup)} one-time setup.` : "No setup fee.",
      };
    }
    return {
      label: "Book a 15-min call to wire it up",
      href: BOOKING_HREF,
      disabled: false,
      hint: "We'll combine your picks into one onboarding.",
      external: true,
    };
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-8 items-start pb-28 lg:pb-0">
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-1">
          Step 1 — Build your stack
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-body)] mb-6">
          Tap the services you want. We&apos;ll add up the cost.
        </h2>

        <ul className="space-y-3">
          {SERVICES.map((s) => {
            const on = selected.has(s.slug);
            return (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => toggle(s.slug)}
                  aria-pressed={on}
                  className={`group w-full text-left rounded-2xl px-5 py-5 md:px-6 md:py-6 flex items-start gap-4 transition-all ${
                    on
                      ? "bg-[var(--color-bg-dark-card)] text-[var(--color-hero-text)] ring-2 ring-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/15"
                      : "bg-[var(--color-bg-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-md"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                      on
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-text)]"
                        : "border-[var(--color-border)] bg-transparent text-transparent group-hover:border-[var(--color-accent)]"
                    }`}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L8.5 12.086l6.79-6.793a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>

                  <span
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${
                      on
                        ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-[var(--color-accent)]/30"
                        : "bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-[var(--color-accent)]/20"
                    }`}
                  >
                    <AnimatedIcon paths={s.iconPaths} size={20} />
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-base md:text-lg font-semibold">{s.name}</span>
                      <span
                        className={`text-right font-mono text-sm whitespace-nowrap ${
                          on ? "text-[var(--color-hero-text)]" : "text-[var(--color-text-body)]"
                        }`}
                      >
                        {money(s.monthly)}
                        <span
                          className={`text-xs ${
                            on
                              ? "text-[var(--color-hero-subtext)]"
                              : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          /mo
                        </span>
                      </span>
                    </span>
                    <span
                      className={`mt-1 block text-sm leading-relaxed ${
                        on ? "text-[var(--color-hero-subtext)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {s.oneLiner}
                    </span>
                    <span
                      className={`mt-1 block font-mono text-[11px] uppercase tracking-wider ${
                        on
                          ? "text-[var(--color-hero-subtext)]/80"
                          : "text-[var(--color-text-muted)]/80"
                      }`}
                    >
                      {s.setup > 0 ? `${money(s.setup)} setup` : "No setup fee"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl bg-[var(--color-bg-dark-card)] p-6 md:p-7 text-[var(--color-hero-text)] ring-1 ring-[var(--color-hero-border)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-1">
            Your stack
          </p>
          <h3 className="text-lg font-semibold text-[var(--color-hero-text)] mb-5">
            {totals.count === 0
              ? "Nothing picked yet"
              : totals.count === 1
                ? "1 service"
                : `${totals.count} services`}
          </h3>

          {totals.picks.length > 0 ? (
            <ul className="space-y-2 mb-5 text-sm">
              {totals.picks.map((p) => (
                <li
                  key={p.slug}
                  className="flex items-baseline justify-between gap-3 text-[var(--color-hero-subtext)]"
                >
                  <span className="truncate">{p.name}</span>
                  <span className="font-mono text-[var(--color-hero-text)] whitespace-nowrap">
                    {money(p.monthly)}
                    <span className="text-xs text-[var(--color-hero-subtext)]">/mo</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-hero-subtext)] mb-5 leading-relaxed">
              Tap services on the left. Your monthly total and savings appear here.
            </p>
          )}

          <div className="border-t border-[var(--color-hero-border)] pt-4 mb-4 space-y-2 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[var(--color-hero-subtext)]">Subtotal</span>
              <span className="font-mono">
                {money(totals.monthly)}
                <span className="text-xs text-[var(--color-hero-subtext)]">/mo</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3 text-[var(--color-hero-subtext)]">
              <span>One-time setup</span>
              <span className="font-mono">{money(totals.setup)}</span>
            </div>
          </div>

          {totals.showStackSuggestion && (
            <p className="mb-4 text-xs leading-relaxed text-[var(--color-hero-subtext)]">
              Or get everything for{" "}
              <span className="font-mono text-[var(--color-hero-text)]">{money(STACK_MONTHLY)}/mo</span>
              {totals.monthlySavings > 0 ? (
                <>
                  {" "}— save{" "}
                  <span className="font-semibold text-[var(--color-hero-text)]">
                    {money(totals.monthlySavings)}/mo
                  </span>
                </>
              ) : null}{" "}
              (
              <Link
                href={STACK_HREF}
                className="underline underline-offset-2 text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                switch to Whole Stack
              </Link>
              )
            </p>
          )}

          {cta.disabled ? (
            <button
              type="button"
              disabled
              className="w-full rounded-xl bg-[var(--color-hero-border)] text-[var(--color-hero-subtext)] px-5 py-3.5 text-sm font-semibold cursor-not-allowed"
            >
              {cta.label}
            </button>
          ) : cta.external ? (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-3.5 text-sm font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
            >
              {cta.label}
              <span aria-hidden="true">→</span>
            </a>
          ) : (
            <Link
              href={cta.href}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-3.5 text-sm font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
            >
              {cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          )}

          <p className="mt-3 text-xs text-[var(--color-hero-subtext)] leading-relaxed">{cta.hint}</p>

          <p className="mt-4 text-[11px] text-[var(--color-hero-subtext)]/70 leading-relaxed">
            Cancel anytime. No contracts. Setup is one-time at first month.
          </p>
        </div>
      </aside>

      {/* Mobile sticky bottom bar — total + CTA always thumb-reachable */}
      <div
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-[var(--color-bg-dark-card)] text-[var(--color-hero-text)] border-t border-[var(--color-hero-border)] shadow-[0_-10px_30px_rgba(0,0,0,0.25)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-accent)]">
                {totals.count === 0
                  ? "Your stack"
                  : totals.count === 1
                    ? "1 service"
                    : `${totals.count} services`}
              </p>
              <p className="font-mono text-base font-semibold leading-tight">
                {money(totals.monthly)}
                <span className="text-xs text-[var(--color-hero-subtext)]">/mo</span>
                {totals.setup > 0 && (
                  <span className="ml-2 text-[11px] font-normal text-[var(--color-hero-subtext)]">
                    + {money(totals.setup)} setup
                  </span>
                )}
              </p>
            </div>
          </div>

          {totals.showStackSuggestion && (
            <p className="mb-2 text-[11px] leading-relaxed text-[var(--color-hero-subtext)]">
              Or all of it for{" "}
              <span className="font-mono text-[var(--color-hero-text)]">{money(STACK_MONTHLY)}/mo</span>
              {totals.monthlySavings > 0 ? (
                <>
                  {" "}— save{" "}
                  <span className="font-semibold text-[var(--color-hero-text)]">
                    {money(totals.monthlySavings)}/mo
                  </span>
                </>
              ) : null}{" "}
              (
              <Link
                href={STACK_HREF}
                className="underline underline-offset-2 text-[var(--color-accent)]"
              >
                switch to Whole Stack
              </Link>
              )
            </p>
          )}

          {cta.disabled ? (
            <button
              type="button"
              disabled
              className="w-full rounded-xl bg-[var(--color-hero-border)] text-[var(--color-hero-subtext)] px-5 py-3 text-sm font-semibold cursor-not-allowed"
            >
              {cta.label}
            </button>
          ) : cta.external ? (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-3 text-sm font-semibold"
            >
              {cta.label}
              <span aria-hidden="true">→</span>
            </a>
          ) : (
            <Link
              href={cta.href}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-3 text-sm font-semibold"
            >
              {cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
