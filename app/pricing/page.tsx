import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { Reveal } from "@/components/Reveal";
import { ProductDetail, type ProductDetailData } from "@/components/sections/ProductDetail";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ICON_PATHS } from "@/lib/icon-paths";
import { MockReviewPanel } from "@/components/ui/MockReviewPanel";
import { MockAIVisibilityPanel } from "@/components/ui/MockAIVisibilityPanel";
import { MockRelayPanel } from "@/components/ui/MockRelayPanel";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Done-for-you Google visibility for local businesses. Get Found, Stay Found, and Always Ready.",
  alternates: { canonical: "/pricing" },
};

const breadcrumb = pageBreadcrumbs("Pricing", "/pricing");
const BOOKING_HREF = "/contact";
const GOOGLE_AI_CALLING_URL =
  "https://blog.google/products-and-platforms/products/search/deep-search-business-calling-google-search/";

const products: ProductDetailData[] = [
  {
    slug: "get-found-refresh",
    number: "01",
    name: "Get Found",
    outcome: "Fix the Google-facing basics before AI search decides who to recommend.",
    story:
      "A one-time setup for local businesses that need to look current, accurate, and easy for Google, AI answers, and customers to understand. It is the lowest-risk first step before a monthly plan.",
    stats: [
      { label: "Type", value: "One-time" },
      { label: "Typical turn", value: "72h" },
      { label: "Contract", value: "None" },
    ],
    whatYouGet: [
      "Full Google Business Profile audit and optimization plan",
      "Name, address, phone, website, category, hours, and services checked",
      "LocalBusiness schema markup plan or handoff",
      "AI search visibility baseline report",
      "First email review request campaign setup after approval",
      "30-minute onboarding call",
    ],
    useThisIf: [
      "Your Google profile is stale, thin, or inconsistent.",
      "You want a low-cost first step before a monthly plan.",
      "You need a clear visibility baseline before asking for more reviews.",
    ],
    setupSteps: [
      { title: "Intake", sub: "We collect the business basics and current profile link." },
      { title: "Refresh", sub: "Profile, website, review path, and trust signals are reviewed." },
      { title: "Report", sub: "You get the before/after summary and next move." },
    ],
    cadence: "One-time setup, usually completed within 72 hours after access and intake are ready.",
    crossSell: { label: "Stay Found - monthly upkeep", href: "#stay-found" },
    price: "$149",
    cadenceLabel: " one-time",
    setup: "No contract",
    promoNote: "Best first step for a business that wants proof before a monthly plan.",
    ctaLabel: "Start Get Found",
    ctaHref: "/checkout/get-found-refresh",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.search,
    mock: <MockAIVisibilityPanel />,
  },
  {
    slug: "stay-found",
    number: "02",
    name: "Stay Found",
    outcome: "Keep your listing, reviews, hosted site, and AI visibility moving every month.",
    story:
      "Stay Found is the preferred monthly plan. Everything in Get Found is included free, then GMF keeps the review request system, Google profile, website hosting, and visibility signals current without making the owner learn another platform.",
    stats: [
      { label: "Setup", value: "$199" },
      { label: "Channel", value: "SMS + email" },
      { label: "Hosting", value: "Included" },
    ],
    whatYouGet: [
      "Everything in Get Found - free",
      "Weekly client list upload path for review requests",
      "SMS and email review request campaigns after A2P readiness",
      "A2P setup handled by GMF when SMS is approved",
      "AI response drafts in the client's brand voice",
      "Negative review alert and suggested response target within 4 business hours",
      "One weekly Google Business Profile post",
      "Free website hosting for your GMF-managed site",
      "Review monitoring across platforms where available",
      "Monthly sentiment, citation, and visibility report",
    ],
    useThisIf: [
      "You do not want your Google profile to decay after the first cleanup.",
      "You have happy customers but do not ask consistently.",
      "You want stronger review conversion from SMS plus email.",
      "You want AI reply drafts without risky auto-posting.",
      "You want GMF to host the site so public updates do not depend on another vendor.",
    ],
    setupSteps: [
      { title: "Baseline", sub: "We start from Get Found or a fresh audit." },
      { title: "Clear compliance", sub: "SMS waits for opt-in, STOP handling, and A2P readiness." },
      { title: "Keep moving", sub: "Requests, profile content, hosted-site updates, and owner recaps stay active." },
    ],
    cadence: "Weekly upkeep with included website hosting, review request campaigns, and a monthly owner recap. Urgent profile issues escalate to Manager.",
    crossSell: { label: "Always Ready - add AI voice readiness", href: "#always-ready" },
    price: "$99",
    cadenceLabel: "/mo",
    setup: "$199 setup",
    promoNote: "Website hosting included for GMF-managed sites.",
    ctaLabel: "Start Stay Found",
    ctaHref: "/checkout/stay-found",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.dashboard,
    mock: <MockReviewPanel />,
    variant: "dark",
  },
];

const chips = [
  ...products.map((product) => ({
    href: `#${product.slug}`,
    label: product.name,
  })),
  { href: "#always-ready", label: "Always Ready" },
];

type JobKey = "get-found" | "stay-found";

const jobBySlug: Record<string, JobKey> = {
  "get-found-refresh": "get-found",
  "stay-found": "stay-found",
};

const jobGroupCopy: Record<JobKey, { index: string; label: string; intro: string }> = {
  "get-found": {
    index: "Step 1 of 3",
    label: "Get found.",
    intro:
      "Google Search is changing. We clean up the public footprint first so customers and search systems see the right business.",
  },
  "stay-found": {
    index: "Step 2 of 3",
    label: "Stay found.",
    intro:
      "Monthly upkeep keeps the profile, review path, website hosting, and local trust signals from going stale.",
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <section
        id="top"
        aria-label="Page header"
        className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400 bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Launch pricing for local businesses
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Pricing
          </p>
          <h1 className="max-w-[21.5rem] font-semibold leading-[1.05] tracking-tight text-[clamp(2.1rem,8vw,2.55rem)] sm:max-w-4xl sm:text-5xl md:text-6xl">
            <span className="block sm:hidden">Google Search is changing.</span>
            <span className="block sm:hidden">
              Staying visible should not be complicated.
            </span>
            <span className="hidden sm:block">
              Google Search is changing. Staying visible should not be complicated.
            </span>
          </h1>
          <p className="mt-5 max-w-[21.5rem] text-lg leading-relaxed text-[var(--color-hero-subtext)] sm:max-w-2xl md:text-xl">
            GMF helps local businesses get found, stay current, and turn happy customers into stronger review proof. Start small. Add only what is worth keeping.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              Start with a refresh
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-green-400" />
              No long contract
            </span>
          </div>
        </div>
      </section>

      <PageBody>
        <PageSection className="!max-w-6xl !py-12 md:!py-16 !pb-10 md:!pb-12">
          <div className="mx-auto max-w-[21.5rem] sm:max-w-6xl">
            <Reveal delay={0.05}>
              <div className="mb-6 max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-body)] mb-3">
                  Start with the lowest-risk fix.
                </h2>
                <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed">
                  A local business does not need another complicated platform first. It needs the Google-facing basics right, a review path that runs, and a clear owner recap.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: "$149", label: "Get Found setup", border: "border-t-green-500", text: "text-green-500" },
                  { value: "$99/mo", label: "Stay Found + hosting", border: "border-t-amber-500", text: "text-amber-500" },
                  { value: "$299/mo", label: "Always Ready", border: "border-t-sky-500", text: "text-sky-600" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border border-[var(--color-border)] border-t-[3px] ${stat.border} bg-[var(--color-bg-elevated)] px-5 py-5 text-center`}
                  >
                    <p className={`font-mono text-xs uppercase tracking-[0.2em] mb-1 ${stat.text}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-[var(--color-hero-bg)] p-8 md:p-10 ring-1 ring-[var(--color-hero-border)]">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-green-400 mb-3">
                  Step 1 - Start here
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-5">
                  Most owners start with Get Found.
                </h3>

                <div className="mb-6 flex flex-wrap gap-2">
                  {["$149 one-time", "72h typical turn", "no contract"].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full bg-transparent border border-green-400 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <p className="text-base md:text-lg text-white/80 leading-relaxed mb-7 max-w-2xl">
                  We clean up the obvious visibility issues first. If Stay Found or Always Ready makes sense after that, you will know why.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 text-sm font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-green-600/30"
                  >
                    Start Get Found
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                  <Link
                    href="#get-found-refresh"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    See GMF services
                    <span aria-hidden="true">v</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </PageSection>

        <div className="sticky top-16 z-40 -mt-4 mb-0 bg-[var(--color-bg-page)]/95 backdrop-blur-md border-y border-[var(--color-border)] shadow-sm">
          <div className="mx-auto max-w-6xl px-6 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scroll-smooth -mx-2 px-2">
              <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mr-2">
                Jump to
              </span>
              {chips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="flex-shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-body)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 transition-colors whitespace-nowrap"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {products.map((product, index) => {
          const nextProduct = products[index + 1];
          const next = nextProduct
            ? { label: nextProduct.name, href: `#${nextProduct.slug}` }
            : { label: "Always Ready", href: "#always-ready" };
          const sectionData: ProductDetailData = {
            ...product,
            variant: product.variant ?? (index % 2 === 1 ? "dark" : "light"),
          };

          const currentJob = jobBySlug[product.slug];
          const previousJob = index > 0 ? jobBySlug[products[index - 1].slug] : null;
          const isFirstInJob = currentJob && currentJob !== previousJob;
          const groupCopy = currentJob ? jobGroupCopy[currentJob] : null;

          return (
            <div key={product.slug}>
              {isFirstInJob && groupCopy ? (
                <section
                  id={`job-${currentJob}`}
                  className="bg-[var(--color-hero-bg)] text-white scroll-mt-32"
                >
                  <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 text-center">
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]">
                      {groupCopy.index}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                      {groupCopy.label}
                    </h2>
                    <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
                      {groupCopy.intro}
                    </p>
                  </div>
                </section>
              ) : null}
              <ProductDetail data={sectionData} next={next} />
            </div>
          );
        })}

        <section
          id="job-always-ready"
          className="bg-[var(--color-hero-bg)] text-white scroll-mt-32"
        >
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]">
              Step 3 of 3
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Always ready.
            </h2>
            <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
              Voice readiness, GBP content, schema, and AEO checks keep the business ready for calls, searches, and AI recommendations.
            </p>
          </div>
        </section>

        <section
          id="always-ready"
          className="relative scroll-mt-32 overflow-hidden bg-[#0f2430] py-14 text-white md:py-20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.2),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(245,158,11,0.2),transparent_28%)]" />
          <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Reveal delay={0.05}>
              <div className="max-w-2xl">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-sky-300">
                  03 - Always Ready
                </p>
                <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                  Are you ready?
                </h2>
                <p className="mt-5 text-base leading-relaxed text-white/75 md:text-lg">
                  Google is moving from search results to agentic actions. Always Ready prepares the business facts, content, phone readiness, and escalation rules AI systems need before they recommend or call on behalf of a customer.
                </p>

                <blockquote className="mt-6 rounded-3xl border border-sky-300/25 bg-sky-300/10 p-5 text-sm leading-7 text-white/85">
                  <a
                    href={GOOGLE_AI_CALLING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-sky-200 underline decoration-sky-200/45 underline-offset-4 transition hover:text-white"
                  >
                    Google says Search can &quot;call businesses to get pricing and availability information on your behalf.&quot;
                  </a>
                </blockquote>

                <ul className="mt-7 grid gap-3 text-sm text-white/78 sm:grid-cols-2">
                  {[
                    "Everything in Stay Found",
                    "AI voice agent trained on services, pricing, hours, and FAQs",
                    "Voice and phone readiness for AI and customer inquiries",
                    "Full GBP content management and local content planning",
                    "FAQ schema and location-page recommendations",
                    "Monthly 30-minute strategy call and AEO check",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 leading-relaxed">
                      <span aria-hidden="true" className="mt-1 text-sky-300">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-xs leading-6 text-white/55">
                  AI voice automation stays approval-gated. Nothing goes live without explicit authorization.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="space-y-5 lg:sticky lg:top-32">
                <div className="rounded-[2rem] bg-amber-300 p-6 text-slate-950 shadow-2xl shadow-black/35 ring-1 ring-amber-100/70 lg:-rotate-1">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-700">
                        AI readiness plan
                      </p>
                      <h3 className="mt-2 text-2xl font-black">Always Ready</h3>
                    </div>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                      Advanced
                    </span>
                  </div>

                  <div className="mb-5 flex items-end gap-1">
                    <span className="text-5xl font-black">$299</span>
                    <span className="pb-1 text-base font-semibold text-slate-700">/mo</span>
                    <span className="ml-auto pb-1 text-sm font-semibold text-slate-700">No contract</span>
                  </div>

                  <p className="mb-5 text-sm leading-6 text-slate-700">
                    For owners who want GMF to manage reputation, visibility, content, and AI call readiness together.
                  </p>

                  <div className="grid gap-2 text-sm">
                    {["Everything in Stay Found", "Voice readiness buildout", "Monthly strategy call"].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-2xl bg-white/55 px-3 py-2 font-semibold">
                        <span aria-hidden="true">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-2">
                    <Link
                      href="/checkout/always-ready"
                      className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      Start Always Ready
                    </Link>
                    <Link
                      href={BOOKING_HREF}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-950/20 px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-white/50"
                    >
                      Book a Call
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/[0.05] p-5 ring-1 ring-white/10">
                  <MockRelayPanel />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <CtaBlock
          headline="Not sure where to start?"
          subline="Start with Get Found. It gives the business a clear visibility baseline before you add monthly upkeep, review requests, AI reply drafts, website hosting, or voice readiness."
        />
      </PageBody>
      <BackToTopButton />
    </>
  );
}
