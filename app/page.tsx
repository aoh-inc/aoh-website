import type { Metadata } from "next";
import Link from "next/link";
import { HeroEmailForm } from "@/components/hero/HeroEmailForm";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { SocialProof } from "@/components/sections/SocialProof";
import { CostCompare } from "@/components/sections/CostCompare";
import { WhyLess } from "@/components/sections/WhyLess";
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
  title: "AI Services for Local Businesses",
  description:
    "Done-for-you AI services for local businesses: review automation, AI visibility, voice agents, and content. Start with a free audit.",
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
    href: "/checkout/review-automation",
    cta: "Start at $49/mo",
    iconPaths: ICON_PATHS.star,
  },
  {
    name: "AI Visibility",
    tagline: "Be found everywhere — Google, ChatGPT, AI search.",
    price: "$179",
    cadence: "/month",
    bullets: [
      "Reviews fully managed + AI replies",
      "Cited in ChatGPT, Google AI, Perplexity",
      "Monthly call + ongoing optimization",
    ],
    href: "/pricing#ai-visibility",
    cta: "See plan details",
    iconPaths: ICON_PATHS.search,
    highlight: true,
  },
  {
    name: "Reach — Lead Engine",
    tagline: "Done-for-you outreach. Real calls on your calendar.",
    price: "$249",
    cadence: "/month",
    bullets: [
      "Curated prospect list built for your business",
      "Outreach written in your voice — never a template",
      "We book the calls. Your only job is to show up.",
    ],
    href: "/pricing#reach",
    cta: "See plan details",
    iconPaths: ICON_PATHS.target,
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

        <section className="pb-20 md:pb-28 bg-[var(--color-bg-page)] pt-16 md:pt-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                What we run for you
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-body)] mb-4">
                We grade your online presence. Then we fix it.
              </h2>
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                Reviews. Listings. AI search. Google ranking. And the new customers you&apos;re missing. Most owners only see one piece — we run all of it.
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
                        {p.highlight && (
                          <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent)]/15 px-3 py-1 ring-1 ring-[var(--color-accent)]/40">
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                              Most popular
                            </span>
                          </div>
                        )}

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

        <RevenueCalculator />

        <HowItWorks />

        <WhyLess />

        <CostCompare />

        <SocialProof />

        <FAQ />

        <FinalCta />
      </main>
    </>
  );
}
