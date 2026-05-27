"use client";

import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "We check what AI sees",
    body: "We review your Google Business listing, your website, and every directory where your business appears. We see exactly what Google, ChatGPT, and Claude see when someone searches for your type of business — and what’s missing or wrong.",
  },
  {
    number: "02",
    title: "We fix what’s keeping you invisible",
    body: "We correct your Google listing — hours, services, photos, description — and make your website match exactly. We submit your business to the directories AI cross-checks so your information is consistent everywhere. We also set up your first review requests to past customers.",
  },
  {
    number: "03",
    title: "You see the difference",
    body: "Within 48 hours you get a before/after report showing how visible you were and how visible you are now. You see how you compare to local competitors and what’s worth improving next.",
  },
] as const;

const PILLS = ["No contract", "No tech skills needed", "We handle everything"] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="hiw-title"
      className="scroll-mt-20 border-y border-border bg-(--color-bg-page) py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_3fr] md:items-start md:gap-16">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">
              Get Found / $149
            </p>
            <h2
              id="hiw-title"
              className="mt-3 text-3xl font-bold leading-tight text-text-body md:text-4xl"
            >
              Done for you.
              <br />
              Done in 48 hours.
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-text-muted">
              We check what Google and AI see when someone searches for your type of business. Then we fix everything that's holding you back.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-(--color-bg-elevated) px-3 py-1 text-xs font-medium text-text-muted"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-3 w-3 shrink-0 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {pill}
                </span>
              ))}
            </div>

            <Link
              href="/checkout/get-found-refresh"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-(--color-accent-text) transition hover:-translate-y-0.5 hover:bg-(--color-accent-hover) hover:shadow-lg hover:shadow-(--color-accent)/25"
            >
              Get Found for $149
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-(--color-border)"
            />

            <div className="space-y-5">
              {STEPS.map((step) => (
                <div key={step.number} className="relative flex gap-5">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-sm font-bold text-accent">
                    {step.number}
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl border border-border bg-(--color-bg-elevated) px-5 py-4 shadow-xl shadow-slate-950/5">
                    <p className="text-base font-bold leading-snug text-text-body">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
