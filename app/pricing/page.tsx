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
    "Done-for-you Google visibility for local businesses. Get Found, Stay Found, Review Power, and AI Ready Bundle.",
  alternates: { canonical: "/pricing" },
};

const breadcrumb = pageBreadcrumbs("Pricing", "/pricing");
const BOOKING_HREF = "/contact";

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
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.search,
    mock: <MockAIVisibilityPanel />,
  },
  {
    slug: "stay-found",
    number: "02",
    name: "Stay Found",
    outcome: "Keep your local visibility from going stale again.",
    story:
      "Stay Found keeps the profile, review path, and local visibility signals moving without making the owner learn another platform. It is email-only at this tier, with SMS saved for Review Power.",
    stats: [
      { label: "Channel", value: "Email" },
      { label: "GBP post", value: "Weekly" },
      { label: "Report", value: "Monthly" },
    ],
    whatYouGet: [
      "Weekly client list upload path for email review requests",
      "Automated email review requests after approval",
      "One weekly Google Business Profile post",
      "Review monitoring across platforms where available",
      "Monthly one-page visibility report",
      "No SMS or A2P setup at this tier",
    ],
    useThisIf: [
      "You do not want your Google profile to decay after the first cleanup.",
      "You want a simple monthly visibility report without logging into a platform.",
      "You need an affordable maintenance plan before adding SMS review requests.",
    ],
    setupSteps: [
      { title: "Baseline", sub: "We start from Get Found or a fresh audit." },
      { title: "Weekly upkeep", sub: "Profile content and email review requests keep moving." },
      { title: "Owner recap", sub: "You get the short monthly update and any recommended fix." },
    ],
    cadence: "Weekly light upkeep with a monthly owner recap. Urgent profile issues escalate to Manager.",
    crossSell: { label: "Review Power - add SMS and AI reply drafts", href: "#review-power" },
    price: "$59",
    cadenceLabel: "/mo",
    setup: "No contract",
    promoNote: "Designed to be easy to keep, even for small local businesses.",
    ctaLabel: "Stay Found monthly",
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.dashboard,
    mock: <MockAIVisibilityPanel />,
    variant: "dark",
  },
  {
    slug: "review-power",
    number: "03",
    name: "Review Power",
    outcome: "Add SMS, email, and AI-drafted review replies without a heavy CRM.",
    story:
      "Review Power is the performance tier. We handle the review request system, SMS readiness, email, approval-first AI replies, negative-review alerts, and monthly review proof.",
    stats: [
      { label: "Channel", value: "SMS + email" },
      { label: "Replies", value: "Drafted" },
      { label: "Contract", value: "None" },
    ],
    whatYouGet: [
      "Everything in Stay Found",
      "SMS and email review request campaigns after A2P readiness",
      "A2P setup handled by GMF when SMS is approved",
      "AI response drafts in the client's brand voice",
      "Negative review alert and suggested response target within 4 business hours",
      "Monthly sentiment and AI citation check",
    ],
    useThisIf: [
      "You have happy customers but do not ask consistently.",
      "You want stronger review conversion than email alone.",
      "You want reply help without risky auto-posting.",
    ],
    setupSteps: [
      { title: "Map the trigger", sub: "We define what counts as review-ready." },
      { title: "Clear compliance", sub: "SMS waits for opt-in, STOP handling, and A2P readiness." },
      { title: "Send and reply", sub: "Requests go out and AI replies are drafted for approval." },
    ],
    cadence: "Requests send after the review-ready event, with monthly proof and sentiment reporting.",
    crossSell: { label: "AI Ready Bundle - add voice readiness", href: "#ai-ready-bundle" },
    price: "$149",
    cadenceLabel: "/mo",
    setup: "No contract",
    promoNote: "SMS starts only after compliance checks are ready.",
    ctaLabel: "Start Review Power",
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.star,
    mock: <MockReviewPanel />,
  },
  {
    slug: "ai-ready-bundle",
    number: "04",
    name: "AI Ready Bundle",
    outcome: "Prepare the business for AI search, AI calls, and deeper local visibility.",
    story:
      "AI Ready Bundle is the full-service tier for owners who want GMF to manage reputation, visibility, content, and voice readiness together. Voice automation stays approval-gated until the workflow is safe.",
    stats: [
      { label: "Includes", value: "Review Power" },
      { label: "Voice", value: "Ready" },
      { label: "Call", value: "Monthly" },
    ],
    whatYouGet: [
      "Everything in Review Power",
      "AI voice agent trained on services, pricing, hours, and FAQs",
      "Voice/phone readiness for AI and customer inquiries",
      "Full GBP content management and local content planning",
      "FAQ schema and location-page recommendations",
      "Monthly 30-minute strategy call and AEO check",
    ],
    useThisIf: [
      "You want the full visibility and reputation lane handled.",
      "Your business gets calls or questions that need consistent answers.",
      "You want AI-readiness without building the system yourself.",
    ],
    setupSteps: [
      { title: "Train", sub: "We capture services, prices, FAQs, hours, voice, and escalation rules." },
      { title: "Build", sub: "Content, schema, GBP, and voice readiness are staged." },
      { title: "Review", sub: "Monthly strategy call reviews what changed and what is next." },
    ],
    cadence: "Monthly full-service management. No voice automation goes live without explicit approval.",
    price: "$299",
    cadenceLabel: "/mo",
    setup: "No contract",
    promoNote: "Best fit after the owner wants more than review requests.",
    ctaLabel: "Start AI Ready",
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.phone,
    mock: <MockRelayPanel />,
    variant: "dark",
  },
];

const chips = products.map((product) => ({
  href: `#${product.slug}`,
  label: product.name,
}));

type JobKey = "get-found" | "stay-found" | "review-power" | "ai-ready";

const jobBySlug: Record<string, JobKey> = {
  "get-found-refresh": "get-found",
  "stay-found": "stay-found",
  "review-power": "review-power",
  "ai-ready-bundle": "ai-ready",
};

const jobGroupCopy: Record<JobKey, { index: string; label: string; intro: string }> = {
  "get-found": {
    index: "Step 1 of 4",
    label: "Get found.",
    intro:
      "Google Search is changing. We clean up the public footprint first so customers and search systems see the right business.",
  },
  "stay-found": {
    index: "Step 2 of 4",
    label: "Stay found.",
    intro:
      "Monthly upkeep keeps the profile, review path, and local trust signals from going stale.",
  },
  "review-power": {
    index: "Step 3 of 4",
    label: "Build review power.",
    intro:
      "Email, compliant SMS, and approval-first AI replies help turn happy customers into stronger review proof.",
  },
  "ai-ready": {
    index: "Step 4 of 4",
    label: "Be AI ready.",
    intro:
      "Voice readiness, GBP content, schema, and AEO checks prepare the business for where local search is heading next.",
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
          <h1 className="font-semibold leading-[1.05] tracking-tight text-4xl md:text-6xl">
            Google Search is changing. Staying visible should not be complicated.
          </h1>
          <p className="mt-5 max-w-2xl text-lg md:text-xl text-[var(--color-hero-subtext)] leading-relaxed">
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
          <div className="mx-auto max-w-6xl">
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
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { value: "$149", label: "Get Found setup", border: "border-t-green-500", text: "text-green-500" },
                  { value: "$59/mo", label: "Stay Found", border: "border-t-amber-500", text: "text-amber-500" },
                  { value: "$149/mo", label: "Review Power", border: "border-t-gray-900", text: "text-gray-900" },
                  { value: "$299/mo", label: "AI Ready Bundle", border: "border-t-sky-500", text: "text-sky-600" },
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
                  We clean up the obvious visibility issues first. If Stay Found or Review Power makes sense after that, you will know why.
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
            : undefined;
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

        <CtaBlock
          headline="Not sure where to start?"
          subline="Start with Get Found. It gives the business a clear visibility baseline before you add monthly upkeep, review requests, AI reply drafts, or voice readiness."
        />
      </PageBody>
      <BackToTopButton />
    </>
  );
}
