"use client";

const earlyAccessCard = {
  label: "RIGHT NOW",
  heading: "Accepting first clients",
  body: "We work directly with every client: no support tickets, no queue. You get us, not a bot. No long-term commitment. Cancel after the first month if you do not see movement.",
  ctaText: "Become an early client",
  ctaHref: "/report/ai-visibility",
} as const;

function AwardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M9 12l2 2 4-4" />
      <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
    </svg>
  );
}

export function TrustCards() {
  return (
    <section
      aria-label="Why GetMeFound"
      className="border-y border-white/10 bg-(--color-hero-bg) py-20 text-hero-text"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-(--color-bg-dark-card) p-7 shadow-2xl shadow-black/20">
            <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-hero-subtext/60">
              Industry Data
            </p>
            <p className="font-mono text-6xl font-black leading-none text-accent">
              45%
            </p>
            <p className="mt-3 text-base font-semibold text-hero-text">
              of customers now use AI to find local businesses
            </p>
            <p className="mt-1.5 text-xs italic text-hero-subtext/60">
              BrightLocal Consumer Survey, 2026
            </p>
            <p className="mt-3 text-sm leading-relaxed text-hero-subtext/75">
              If AI does not know your business exists, nearly half your potential customers never find you before anyone clicks anything.
            </p>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/10 bg-(--color-bg-dark-card) p-7 shadow-2xl shadow-black/20">
            <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-hero-subtext/60">
              Our Method
            </p>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/25">
              <AwardIcon />
            </div>
            <p className="text-base font-semibold text-hero-text">
              Built on Google&apos;s own published guidance
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-hero-subtext/75">
              Not our opinion. We implement the exact signals Google says determine which businesses get recommended. No invented frameworks.
            </p>
            <a
              href="https://support.google.com/business/answer/7091"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent underline decoration-[var(--color-accent)]/35 underline-offset-4 transition hover:opacity-80"
            >
              Read Google&apos;s guidance
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/10 bg-(--color-bg-dark-card) p-7 shadow-2xl shadow-black/20">
            <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-hero-subtext/60">
              {earlyAccessCard.label}
            </p>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <p className="text-base font-semibold text-hero-text">
                {earlyAccessCard.heading}
              </p>
            </div>
            <p className="flex-1 text-sm leading-relaxed text-hero-subtext/75">
              {earlyAccessCard.body}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-hero-subtext/60">
              Starting at $149 one-time.
            </p>
            <a
              href={earlyAccessCard.ctaHref}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent transition hover:gap-2"
            >
              {earlyAccessCard.ctaText}
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-hero-subtext/55">
          Data sources: BrightLocal 2026, Harvard Business School, Womply Research
        </p>
      </div>
    </section>
  );
}
