import type { Metadata } from "next";
import Link from "next/link";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { SocialProof } from "@/components/sections/SocialProof";
import { CostCompare } from "@/components/sections/CostCompare";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FinalCta } from "@/components/sections/FinalCta";
import { FAQ } from "@/components/sections/FAQ";
import { ReportTransformation } from "@/components/sections/ReportTransformation";
import { TrustCards } from "@/components/sections/TrustCards";
import { VisibilityCheck } from "@/components/sections/VisibilityCheck";
import { Reveal } from "@/components/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { HeroVisualAI } from "@/components/hero/HeroVisualAI";
import { ICON_PATHS } from "@/lib/icon-paths";
import { faqPageSchema } from "@/lib/faq";

export const metadata: Metadata = {
  title: "GetMeFound - Google Visibility for Local Businesses",
  description:
    "Done-for-you Google visibility, reviews, website hosting, and AI search presence for local businesses. No contracts. Live in 48 hours.",
  alternates: { canonical: "/" },
};

type TeaserCard = {
  name: string;
  tagline: string;
  bullets: string[];
  price: string;
  cadence: string;
  href: string;
  cta: string;
  iconPaths: readonly string[];
  highlight?: boolean;
  jobLabel: "Get Found" | "Stay Found" | "Always Ready";
};

const GOOGLE_AI_CALLING_URL =
  "https://blog.google/products-and-platforms/products/search/deep-search-business-calling-google-search/";

const teaserCards: TeaserCard[] = [
  {
    name: "Get Found",
    tagline: "One-time setup for the new Google search.",
    price: "$149",
    cadence: "one-time",
    bullets: [
      "Google Business Profile audit and cleanup",
      "Profile details, categories, and review path set up",
      "Before-and-after visibility snapshot",
    ],
    href: "/checkout/get-found-refresh",
    cta: "Get Found for $149",
    iconPaths: ICON_PATHS.search,
    jobLabel: "Get Found",
  },
  {
    name: "Stay Found",
    tagline: "Preferred monthly plan with hosting included.",
    price: "$99",
    cadence: "/month",
    bullets: [
      "Everything in Get Found - free",
      "$199 setup, then $99/mo",
      "Text and email review requests with AI reply drafts",
    ],
    href: "/pricing#stay-found",
    cta: "Stay visible",
    iconPaths: ICON_PATHS.dashboard,
    highlight: true,
    jobLabel: "Stay Found",
  },
  {
    name: "Always Ready",
    tagline: "Reviews, content, and AI voice readiness in one plan.",
    price: "$299",
    cadence: "/month",
    bullets: [
      "Everything in Stay Found",
      "AI voice readiness for Google's calling feature",
      "Monthly strategy call and AI answer visibility check",
    ],
    href: "/pricing#always-ready",
    cta: "Always ready",
    iconPaths: ICON_PATHS.phone,
    jobLabel: "Always Ready",
  },
];

const primaryTeaserCards = teaserCards.filter(
  (card) => card.name === "Get Found" || card.name === "Stay Found",
);
const alwaysReadyCard = teaserCards.find((card) => card.name === "Always Ready")!;

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col focus:outline-none"
      >
        {/* Hero */}
        <section
          aria-label="Hero"
          className="overflow-hidden bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10 md:py-12 lg:py-14">
            <div className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] md:items-center md:gap-10 lg:gap-12">
              <div className="flex min-w-0 flex-col">
                {/* Alert badge */}
                <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-red-400">
                    Google IO 2026 — biggest search change in 25 years
                  </span>
                </div>

                <h1 className="font-semibold leading-[1.05] tracking-tight text-[clamp(1.85rem,6vw,2.55rem)] sm:text-[clamp(2.05rem,5vw,3rem)] md:text-[clamp(2.25rem,3.8vw,3.2rem)]">
                  <span className="hero-line-mask">
                    <span className="hero-roll block" style={{ animationDelay: "0ms" }}>
                      Your competitor is being recommended by Google&apos;s AI.
                    </span>
                  </span>
                  <span className="hero-line-mask mt-2 block">
                    <span
                      className="hero-roll block text-[var(--color-accent)]"
                      style={{ animationDelay: "400ms" }}
                    >
                      You&apos;re not.
                    </span>
                  </span>
                </h1>

                <p className="mt-5 w-full max-w-xl text-base leading-relaxed text-[var(--color-hero-subtext)] md:text-lg">
                  Google just changed how customers find local businesses — and most haven&apos;t caught up. We fix your listing, reviews, and AI visibility in 48 hours, then keep it working every month.
                </p>

                {/* Pills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Done for you completely",
                    "No contract — cancel anytime",
                    "Results in 48 hours",
                  ].map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.05] px-3 py-1 text-xs font-medium text-[var(--color-hero-subtext)]"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-3 w-3 shrink-0 text-[var(--color-accent)]"
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

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/report/ai-visibility"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-base font-semibold text-[var(--color-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
                  >
                    See my free score
                    <span aria-hidden="true">→</span>
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-6 py-3.5 text-base font-semibold text-[var(--color-hero-text)] ring-1 ring-white/[0.10] transition hover:bg-white/[0.10] hover:ring-white/20"
                  >
                    How it works
                  </a>
                </div>

                <p className="mt-3 font-mono text-xs text-[var(--color-hero-subtext)]/60">
                  Free · takes 30 seconds · no account needed
                </p>
              </div>

              <div className="hidden h-full min-w-0 md:block">
                <HeroVisualAI />
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/[0.07] pt-8 sm:grid-cols-3">
              {[
                { stat: "45%", label: "of customers now use AI to find local businesses" },
                { stat: "650%", label: "increase in AI-driven local searches — one year" },
                { stat: "$149", label: "one-time fix · no contract ever" },
              ].map((item, i) => (
                <div
                  key={item.stat}
                  className={`flex flex-col gap-1 ${i > 0 ? "sm:border-l sm:border-white/[0.07] sm:pl-6" : ""}`}
                >
                  <span className="text-3xl font-bold text-[var(--color-hero-text)]">
                    {item.stat}
                  </span>
                  <span className="text-sm text-[var(--color-hero-subtext)]/70">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ReportTransformation />

        <TrustCards />

        <HowItWorks />

        <VisibilityCheck />

        {/* Service tiers */}
        <section className="py-14 md:py-20 bg-[var(--color-bg-page)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 text-center">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Get found. Stay found. Build trust.
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-body)] mb-4">
                Pick the level that fits where you are.
              </h2>
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                We run the Google profile, review path, website hosting, and AI visibility basics. You stay focused on your business.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
              {primaryTeaserCards.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.08}>
                  <div
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-dark-card)] ring-1 transition-all hover:-translate-y-1 hover:shadow-2xl ${
                      p.highlight
                        ? "md:-translate-y-1 ring-2 ring-[var(--color-accent)] shadow-xl shadow-[var(--color-accent)]/20"
                        : "ring-[var(--color-hero-border)] hover:ring-[var(--color-accent)]"
                    }`}
                  >
                    <Spotlight className="flex h-full flex-col rounded-2xl">
                      <BackgroundBeams />

                      <div className="relative z-10 flex h-full flex-col p-8 md:p-10">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          <span className="inline-flex w-fit items-center rounded-full border border-[var(--color-hero-border)] bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-hero-subtext)]">
                            {p.jobLabel}
                          </span>
                          {p.highlight && (
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent)]/15 px-3 py-1 ring-1 ring-[var(--color-accent)]/40">
                              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                                Best Value
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="mb-6 flex items-start justify-between gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30">
                            <AnimatedIcon paths={p.iconPaths} size={22} />
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-[var(--color-hero-text)]">{p.price}</span>
                            <span className="text-base text-[var(--color-hero-subtext)]">{p.cadence}</span>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-[var(--color-hero-text)] mb-2">
                          {p.name}
                        </h3>
                        <p className="text-base text-[var(--color-accent)] font-medium mb-5">
                          {p.tagline}
                        </p>

                        <ul className="mb-3 space-y-2">
                          {p.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-[var(--color-hero-subtext)]">
                              <span className="text-[var(--color-accent)] flex-shrink-0 mt-0.5">✓</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        {p.highlight && (
                          <div className="my-3 rounded-lg border-l-2 border-accent/60 bg-accent/10 px-3 py-2.5">
                            <p className="text-sm font-bold text-hero-text">Website hosting included</p>
                            <p className="mt-0.5 text-xs text-hero-subtext">
                              Replaces your current $15–$50/mo hosting bill — most clients pay less overall.
                            </p>
                          </div>
                        )}

                        <div className="mt-auto">
                          <Link
                            href={p.href}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)] hover:gap-3 hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
                          >
                            {p.cta}
                            <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    </Spotlight>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.18}>
              <div className="mx-auto mt-7 grid max-w-261 gap-5 rounded-4xl bg-[#0f2430] p-6 text-white ring-1 ring-white/10 md:grid-cols-[1.1fr_0.9fr] md:p-8">
                <div>
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
                    {alwaysReadyCard.jobLabel}
                  </p>
                  <h3 className="text-3xl font-bold leading-tight">Are you ready?</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/72 md:text-base">
                    Google is already turning Search into an AI action layer. Always Ready prepares your facts, content, and phone readiness before Google, ChatGPT, Claude, and other AI systems recommend or call your business.
                  </p>
                  <a
                    href={GOOGLE_AI_CALLING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold leading-6 text-sky-200 underline decoration-sky-200/45 underline-offset-4 transition hover:text-white"
                  >
                    Google says Search can &quot;call businesses to get pricing and availability information on your behalf.&quot;
                  </a>

                  <ul className="mt-5 grid gap-2 text-sm text-white/74 sm:grid-cols-2">
                    {alwaysReadyCard.bullets.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-sky-300">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative overflow-hidden rounded-[1.75rem] bg-(--color-bg-dark-card) p-5 ring-1 ring-white/10 shadow-2xl shadow-black/25 md:self-start md:-rotate-1">
                  {/* Diagonal ADVANCED ribbon */}
                  <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-16 w-16 overflow-hidden rounded-tr-[1.75rem]">
                    <div
                      className="absolute bg-white/10 py-1 text-center font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-hero-subtext/80"
                      style={{ width: "90px", right: "-18px", top: "18px", transform: "rotate(45deg)" }}
                    >
                      Most Complete
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div>
                      <h4 className="text-2xl font-black text-hero-text">{alwaysReadyCard.name}</h4>
                    </div>
                  </div>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-6xl font-black text-accent">{alwaysReadyCard.price}</span>
                    <span className="pb-1 text-base font-semibold text-hero-subtext/60">{alwaysReadyCard.cadence}</span>
                  </div>
                  <Link
                    href={alwaysReadyCard.href}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-(--color-accent-text) transition hover:bg-(--color-accent-hover)"
                  >
                    {alwaysReadyCard.cta}
                  </Link>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:gap-2.5 transition-all"
              >
                See full plan details
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section id="calculator" className="scroll-mt-24">
          <RevenueCalculator />
        </section>


        <CostCompare />

        <SocialProof />

        <FAQ limit={5} showSeeAllLink />

        <FinalCta />
      </main>
    </>
  );
}
