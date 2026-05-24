import type { Metadata } from "next";
import Link from "next/link";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { SocialProof } from "@/components/sections/SocialProof";
import { CostCompare } from "@/components/sections/CostCompare";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FinalCta } from "@/components/sections/FinalCta";
import { FAQ } from "@/components/sections/FAQ";
import { Reveal } from "@/components/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { HeroVisualAI } from "@/components/hero/HeroVisualAI";
import { ICON_PATHS } from "@/lib/icon-paths";
import { faqPageSchema } from "@/lib/faq";

export const metadata: Metadata = {
  title: "GetMeFound — Google Visibility for Local Businesses",
  description:
    "Done-for-you Google visibility, reviews, and AI search presence for local businesses. No contracts. Live in 48 hours.",
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
  jobLabel: "Get Found" | "Stay Found" | "Review Power" | "AI Ready";
};

const teaserCards: TeaserCard[] = [
  {
    name: "Get Found",
    tagline: "One-time setup for the new Google search.",
    price: "$149",
    cadence: "one-time",
    bullets: [
      "Google Business Profile audit and cleanup",
      "Schema, categories, and review path set up",
      "AI search visibility baseline report",
    ],
    href: "/pricing#get-found-refresh",
    cta: "See what's included",
    iconPaths: ICON_PATHS.search,
    jobLabel: "Get Found",
  },
  {
    name: "Stay Found",
    tagline: "Monthly upkeep so your profile stays current.",
    price: "$59",
    cadence: "/month",
    bullets: [
      "Weekly review request emails to your customers",
      "Weekly Google Business Profile post",
      "Monthly one-page visibility report",
    ],
    href: "/pricing#stay-found",
    cta: "Stay visible",
    iconPaths: ICON_PATHS.dashboard,
    highlight: true,
    jobLabel: "Stay Found",
  },
  {
    name: "Review Power",
    tagline: "SMS and email review requests plus AI-drafted replies.",
    price: "$149",
    cadence: "/month",
    bullets: [
      "SMS review requests — 3–5× the response rate of email",
      "AI reply drafts in your voice, you approve before posting",
      "Monthly review sentiment and citation check",
    ],
    href: "/pricing#review-power",
    cta: "Build review power",
    iconPaths: ICON_PATHS.star,
    jobLabel: "Review Power",
  },
  {
    name: "AI Ready Bundle",
    tagline: "Reviews, content, and AI voice readiness in one plan.",
    price: "$299",
    cadence: "/month",
    bullets: [
      "Everything in Review Power",
      "AI voice agent ready for Google's calling feature",
      "Monthly strategy call and AI search citation check",
    ],
    href: "/pricing#ai-ready-bundle",
    cta: "Get AI ready",
    iconPaths: ICON_PATHS.phone,
    jobLabel: "AI Ready",
  },
];

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
        {/* ── Hero ── */}
        <section
          aria-label="Hero"
          className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 md:items-center">
              <div className="flex flex-col">
                <h1 className="font-semibold leading-[1.05] tracking-tight text-[clamp(2rem,8vw,3.5rem)] md:text-[clamp(2.5rem,5vw,4rem)]">
                  Google now uses AI to pick which local businesses to recommend.{" "}
                  <span className="text-[var(--color-accent)]">Most owners don&apos;t know it changed.</span>
                </h1>

                <p className="mt-6 max-w-xl text-lg text-[var(--color-hero-subtext)] md:text-xl leading-relaxed">
                  When your next customer searches for a business like yours,
                  AI picks the answer — based on your reviews, your Google profile,
                  and your online presence. If you&apos;re not set up for it,
                  your competitor gets the call.
                </p>

                <p className="mt-4 max-w-xl text-base text-[var(--color-hero-subtext)] leading-relaxed">
                  We set you up so AI recommends you. Then we run it every month
                  — reviews, profile, visibility — so you stay found while you
                  stay focused on your business.
                </p>

                <ul className="mt-8 flex flex-wrap gap-3">
                  {[
                    "Set up for AI search",
                    "Done for you — no dashboards",
                    "No contracts",
                  ].map((pill) => (
                    <li
                      key={pill}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hero-border)] bg-white/5 px-4 py-1.5 text-sm text-[var(--color-hero-subtext)]"
                    >
                      <span className="text-[var(--color-accent)]" aria-hidden="true">✓</span>
                      {pill}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-7 py-4 text-base font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
                  >
                    See our plans
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-7 py-4 text-base font-semibold text-[var(--color-hero-text)] ring-1 ring-white/[0.10] transition hover:bg-white/[0.10] hover:ring-white/20"
                  >
                    Talk to us
                  </Link>
                </div>

                <p className="mt-4 font-mono text-xs text-[var(--color-hero-subtext)]/60">
                  Plans from $59/mo · no contract · cancel anytime
                </p>
              </div>

              <div className="h-full">
                <HeroVisualAI />
              </div>
            </div>
          </div>
        </section>

        {/* ── Service tiers ── */}
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
                We run everything. You stay focused on your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {teaserCards.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.08}>
                  <div
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-dark-card)] ring-1 transition-all hover:-translate-y-1 hover:shadow-2xl ${
                      p.highlight
                        ? "ring-2 ring-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/15"
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
                                Most popular
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

                        <ul className="mb-8 space-y-2">
                          {p.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-[var(--color-hero-subtext)]">
                              <span className="text-[var(--color-accent)] flex-shrink-0 mt-0.5">✓</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

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

        <HowItWorks />

        <CostCompare />

        <SocialProof />

        <FAQ limit={3} showSeeAllLink />

        <FinalCta />
      </main>
    </>
  );
}
