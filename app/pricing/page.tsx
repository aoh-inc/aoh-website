import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing. Reviews from $1/day for the first 30 days, then $99/month. Bundle with AI Visibility for $149/month. $99 setup. No contracts.",
  alternates: { canonical: "/pricing" },
};

const breadcrumb = pageBreadcrumbs("Pricing", "/pricing");

const tiers = [
  {
    name: "Reviews — Founder Rate",
    price: "$1",
    cadence: "/day",
    monthly: "First 30 days · $99 setup",
    blurb: "Get your first wave of new reviews in two weeks. Automated email review requests, AI-drafted responses, Google profile optimization.",
    features: [
      "Automated email review requests after every job",
      "AI-drafted responses to every review (you approve)",
      "Google Business Profile optimization + weekly Posts",
      "Weekly review summary in your inbox",
      "No contract — cancel anytime",
    ],
    href: "/reviews",
    cta: "Start at $1/day",
    highlight: false,
  },
  {
    name: "Reviews — Standard",
    price: "$99",
    cadence: "/month",
    monthly: "From day 31 · SMS unlocks",
    blurb: "Everything in Founder Rate, plus SMS review requests (3× higher response rate) and POS integration when available.",
    features: [
      "Everything in Founder Rate",
      "SMS review requests (post-A2P registration)",
      "POS auto-sync (Square, Toast, Clover, Lightspeed)",
      "Multi-platform review monitoring",
      "Bad review handling protocol",
    ],
    href: "/reviews",
    cta: "See standard plan",
    highlight: false,
  },
  {
    name: "Reviews + AI Visibility Bundle",
    price: "$149",
    cadence: "/month",
    monthly: "Save $49 · Most popular",
    blurb: "The full stack. Reviews handled AND your business recommended in ChatGPT, Google AI, and Perplexity. $99 setup.",
    features: [
      "Everything in Reviews Standard",
      "AI Visibility audit + structured data + schema",
      "ChatGPT, Google AI, Perplexity presence",
      "Ongoing AI search optimization",
      "Save $49/month vs buying separately",
    ],
    href: "/ai-visibility",
    cta: "Get the bundle",
    highlight: true,
  },
  {
    name: "Relay — Voice AI",
    price: "Custom",
    cadence: "",
    monthly: "Long-term clients only",
    blurb: "Multilingual AI receptionist. Custom-built for established AOH clients.",
    features: [
      "24/7 multilingual call answering",
      "27+ languages supported",
      "Appointment booking + qualification",
      "Fully managed — AOH runs it",
    ],
    href: "/relay",
    cta: "Contact us",
    highlight: false,
  },
  {
    name: "Studio — AI Content",
    price: "Custom",
    cadence: "",
    monthly: "Long-term clients only",
    blurb: "Done-for-you content creation and publishing in your brand voice.",
    features: [
      "Posts, images, carousels, campaigns",
      "Published on autopilot",
      "Brand voice training",
      "Fully managed — AOH runs it",
    ],
    href: "/studio",
    cta: "Contact us",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHeader
        eyebrow="Pricing"
        title="Honest pricing. No contracts."
        subtitle="Start at $1/day for the first 30 days. Standard pricing kicks in after — $99/month for Reviews, $149 for the Bundle. Cancel anytime."
      />
      <PageBody>
        <PageSection className="!max-w-6xl">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={`rounded-2xl p-8 flex flex-col ${
                    t.highlight
                      ? "bg-[var(--color-bg-dark-card)] text-[var(--color-hero-text)] ring-2 ring-[var(--color-accent)]"
                      : "bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
                  }`}
                >
                  <p
                    className={`text-xs uppercase tracking-wider font-bold mb-3 ${
                      t.highlight ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"
                    }`}
                  >
                    {t.monthly}
                  </p>
                  <h3 className="text-xl font-semibold mb-2">{t.name}</h3>
                  <p
                    className={`text-sm mb-6 leading-relaxed ${
                      t.highlight ? "text-[var(--color-hero-subtext)]" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {t.blurb}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{t.price}</span>
                    <span
                      className={`text-base ${
                        t.highlight ? "text-[var(--color-hero-subtext)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {t.cadence}
                    </span>
                  </div>
                  <ul
                    className={`space-y-2 mb-8 text-sm ${
                      t.highlight ? "text-[var(--color-hero-subtext)]" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-[var(--color-accent)] flex-shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={t.href}
                    className={`mt-auto text-center px-5 py-3 rounded-xl font-semibold transition-colors ${
                      t.highlight
                        ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)]"
                        : "bg-[var(--color-bg-page)] hover:bg-[var(--color-accent-soft)] text-[var(--color-text-body)] border border-[var(--color-border)]"
                    }`}
                  >
                    {t.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </PageSection>

        <CtaBlock
          headline="Not sure where to start?"
          subline="Get a free marketing audit. We'll show you exactly what's costing you customers — and what to fix first."
        />
      </PageBody>
    </>
  );
}
