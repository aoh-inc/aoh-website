import type { Metadata } from "next";
import Link from "next/link";
import { HeroEmailForm } from "@/components/hero/HeroEmailForm";
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
import { ICON_PATHS } from "@/lib/icon-paths";
import { faqPageSchema } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Growth Services for Small Businesses",
  description:
    "Done-for-you growth for local businesses. Review automation, AI Visibility, and outreach that books calls. Free audit to start.",
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
  jobLabel: "Get Found" | "Find Customers";
};

const teaserCards: TeaserCard[] = [
  {
    name: "Review Automation",
    tagline: "Start collecting reviews on autopilot.",
    price: "$49",
    cadence: "/month",
    bullets: [
      "Automated email review requests",
      "Google Business Profile audit",
      "Cancel anytime · no setup fee",
    ],
    href: "/pricing#review-automation",
    cta: "See how it works",
    iconPaths: ICON_PATHS.star,
    jobLabel: "Get Found",
  },
  {
    name: "AI Visibility",
    tagline: "Be found everywhere — Google, ChatGPT, AI search.",
    price: "$199",
    cadence: "/month",
    bullets: [
      "Reviews fully managed, replies in your voice",
      "Cited in ChatGPT, Google AI, Claude",
      "Monthly call + ongoing optimization",
    ],
    href: "/pricing#ai-visibility",
    cta: "See how it works",
    iconPaths: ICON_PATHS.search,
    highlight: true,
    jobLabel: "Get Found",
  },
  {
    name: "Reach — Lead Engine",
    tagline: "Done-for-you outreach. Real calls on your calendar.",
    price: "$299",
    cadence: "/month",
    bullets: [
      "Curated prospect list built for your business",
      "Outreach written in your voice — never a template",
      "We book the calls. Your only job is to show up.",
    ],
    href: "/pricing#reach",
    cta: "See how it works",
    iconPaths: ICON_PATHS.target,
    jobLabel: "Find Customers",
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
        <HeroEmailForm />

        <section className="py-14 md:py-20 bg-[var(--color-bg-page)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 text-center">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Get found. Find customers. Run your business.
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-body)] mb-4">
                Customers can&apos;t find you when they search. We fix that — three ways.
              </h2>
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                <span className="font-bold text-[var(--color-text-body)]">80% of your future customers find you by searching.</span> We get you found on Google, in ChatGPT, and across AI search. We also bring you the customers who haven&apos;t found you yet. And we run it all — so you stay in your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                See all 6 services
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
