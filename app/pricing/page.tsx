import type { Metadata } from "next";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { Reveal } from "@/components/Reveal";
import { ProductDetail, type ProductDetailData } from "@/components/sections/ProductDetail";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ICON_PATHS } from "@/lib/icon-paths";
import { MockReviewPanel } from "@/components/ui/MockReviewPanel";
import { MockAIVisibilityPanel } from "@/components/ui/MockAIVisibilityPanel";
import { MockReachPanel } from "@/components/ui/MockReachPanel";
import { MockRelayPanel } from "@/components/ui/MockRelayPanel";
import { pageBreadcrumbs } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Done-for-you growth for local businesses. Reviews, AI Visibility, Reach, Relay. Cancel anytime.",
  alternates: { canonical: "/pricing" },
};

const breadcrumb = pageBreadcrumbs("Pricing", "/pricing");
const BOOKING_HREF = "https://app.gohighlevel.com/widget/booking/talk";

const products: ProductDetailData[] = [
  {
    slug: "review-automation",
    number: "01",
    name: "Review Automation",
    outcome: "Stop chasing reviews. They come in on autopilot.",
    story:
      "Every customer gets an email review request within minutes of the job — written for your business, sent from your domain. You reply yourself. We handle the audit on your Google Business Profile so the reviews you earn actually show up where customers look.",
    stats: [
      { label: "Live in", value: "48h" },
      { label: "Setup fee", value: "$0" },
      { label: "Contract", value: "None" },
    ],
    whatYouGet: [
      "Automated email review requests after every job",
      "One-time Google Business Profile audit + fix",
      "You reply yourself (upgrade to AI Visibility for replies in your voice + SMS)",
      "Monthly digest — what was sent, what came in",
      "Cancel anytime · no contract",
    ],
    useThisIf: [
      "Your last review was months ago and you can feel the slowdown.",
      "You're doing great work but customers can't tell from your profile.",
      "Competitors with worse service outrank you because they have fresher reviews.",
    ],
    setupSteps: [
      { title: "Connect your Google Business Profile", sub: "We audit it and fix what's broken." },
      { title: "Map your customer flow", sub: "We connect your CRM/POS, or keep it simple with a form." },
      { title: "First requests go out", sub: "Within 48 hours of kickoff." },
    ],
    cadence: "1 email per completed job, sent within 60 minutes.",
    crossSell: { label: "AI Visibility — adds SMS + replies in your voice", href: "#ai-visibility" },
    price: "$49",
    cadenceLabel: "/mo",
    setup: "No setup fee",
    promoNote: "Launch rate — $49 forever as long as you stay.",
    ctaLabel: "Start collecting reviews — $49/mo →",
    ctaHref: "https://pay.aioutsourcehub.com/review-automation-plan",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.star,
    mock: <MockReviewPanel />,
  },
  {
    slug: "ai-visibility",
    number: "02",
    name: "AI Visibility",
    outcome: "Be the answer when customers ask ChatGPT or Google AI.",
    story:
      "A quarter of searches have already moved to ChatGPT, Claude, and Google's AI answers. Most local businesses are invisible there. We get your business named in those answers — and we run review replies in your voice + SMS review requests so your reputation feeds the answer.",
    stats: [
      { label: "Search engines", value: "4+" },
      { label: "SMS lift", value: "3×" },
      { label: "Review", value: "Monthly" },
    ],
    whatYouGet: [
      "Everything in Review Automation",
      "Replies drafted in your voice (you approve)",
      "SMS review requests (3× higher response than email)",
      "Monthly 15-min review call + ongoing Google profile improvements",
      "Show up when people ask ChatGPT, Claude, or Google who to hire nearby",
      "Website trust signals set up so search engines can confidently recommend your business",
      "Your reviews tracked across platforms so nothing important gets missed",
    ],
    useThisIf: [
      "You asked ChatGPT for the best [your category] in your town and your name didn't come up.",
      "Customers are searching new ways and you're invisible across half of them.",
      "Reviews are coming in but replies pile up and you don't have time to write each one.",
    ],
    setupSteps: [
      { title: "Google profile tune-up", sub: "We tighten your profile foundation beyond the Review Automation baseline." },
      { title: "Site visibility setup", sub: "We structure your site so ChatGPT, Claude, and Google can recommend your business." },
      { title: "Citation setup", sub: "We place your business in trusted web sources so search engines are more likely to recommend you." },
      { title: "First monthly review call", sub: "We show what changed, what moved, and what’s next." },
    ],
    cadence: "Monthly 15-min review call. Ongoing Google profile + search visibility work.",
    crossSell: { label: "Reach — to add new outbound leads", href: "#reach" },
    price: "$199",
    cadenceLabel: "/mo",
    setup: "$199 setup",
    promoNote: "First month $99 (save $100) — then $199/mo.",
    coupon: {
      code: "FOUND100",
      headline: "$100 off your first month",
      sub: "Apply at checkout. New customers only.",
    },
    ctaLabel: "Get named in ChatGPT — $99 first month →",
    ctaHref: "https://pay.aioutsourcehub.com/ai-visibility-page",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.search,
    mock: <MockAIVisibilityPanel />,
    variant: "dark",
  },
  {
    slug: "reach",
    number: "03",
    name: "Reach",
    outcome: "Done-for-you outreach. Real calls on your calendar.",
    story:
      "We build you a curated prospect list, write outreach in your voice (never a template — if it sounds like one, it didn't go out), and run the campaigns until qualified appointments land on your calendar. You show up to the call. That's it.",
    stats: [
      { label: "Voice", value: "Yours" },
      { label: "Channels", value: "Email + LinkedIn" },
      { label: "Report", value: "Weekly" },
    ],
    whatYouGet: [
      "Curated prospect list built for your niche (we source it, or use yours)",
      "Outreach written in your voice — if it sounds like a template, it didn't go out",
      "Qualified appointments booked into your calendar",
      "Weekly campaign performance report",
      "Reply handling — we keep the conversation going until they book",
      "Fully managed — we write, send, reply, book",
      "Boundary: Reach does not include guaranteed marketing-report/heatmap generation workflows.",
    ],
    useThisIf: [
      "You have room to grow and could handle 3–5 new customer calls a week.",
      "You know who buys from you, but you don't have time to chase them.",
      "You've tried cold outreach yourself and it never got done.",
    ],
    setupSteps: [
      { title: "Ideal customer intake call", sub: "We define who to target, who to skip, and why they buy." },
      { title: "Messaging + list build", sub: "We align on how your outreach should sound and build your prospect list." },
      { title: "First campaign live", sub: "Live within 3 business days after we receive everything from you." },
    ],
    cadence: "Campaign launches within 3 business days after we receive your intake details and approvals, then runs continuously with weekly reporting and optimization.",
    crossSell: { label: "Relay — add 24/7 call answering", href: "#relay" },
    price: "$299",
    cadenceLabel: "/mo",
    setup: "$299 setup",
    promoNote: "First month $149 (save $150) — then $299/mo.",
    coupon: {
      code: "REACH150",
      headline: "$150 off your first month",
      sub: "Apply at checkout. New customers only.",
    },
    ctaLabel: "Start booking calls — $149 first month →",
    ctaHref: "https://pay.aioutsourcehub.com/reach-plan",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.target,
    mock: <MockReachPanel />,
  },
  {
    slug: "relay",
    number: "04",
    name: "Relay — Phone Answering",
    outcome: "24/7 receptionist. Never miss another call.",
    story:
      "Multilingual phone answering in your company voice. Every call answered, every lead qualified, every appointment booked directly into your calendar. Works in 27+ languages so you don't lose calls from customers who don't speak yours. After-hours, lunch breaks, you're with a customer — Relay picks up.",
    stats: [
      { label: "Languages", value: "27+" },
      { label: "Coverage", value: "24/7" },
      { label: "Minutes", value: "750/mo" },
    ],
    whatYouGet: [
      "24/7 call answering — no missed leads",
      "27+ languages supported",
      "Appointment booking directly into your calendar",
      "Lead qualification + handoff to your team",
      "750 minutes/month included (overage at fair rate)",
      "Fully managed — we build it, run it, tune it",
    ],
    useThisIf: [
      "Your phone goes to voicemail every time you're with a customer.",
      "You're losing after-hours calls you don't even know about.",
      "Hiring a real receptionist costs $40K+/year and you're not there yet.",
    ],
    setupSteps: [
      { title: "Discovery call", sub: "We learn your service, hours, FAQs." },
      { title: "Voice + script tuned", sub: "Sounds like your business, not a robot." },
      { title: "Test calls + go live", sub: "Roughly 1 week from kickoff." },
    ],
    cadence: "Always-on. 750 included minutes per month.",
    crossSell: { label: "Reach — pair inbound with outbound", href: "#reach" },
    price: "$299",
    cadenceLabel: "/mo",
    setup: "$299 setup",
    promoNote: "First month $199 (save $100) — one extra job covers it. Then $299/mo.",
    coupon: {
      code: "RELAY100",
      headline: "$100 off your first month",
      sub: "Apply at checkout. New customers only.",
    },
    ctaLabel: "Stop losing calls — $199 first month →",
    ctaHref: "https://pay.aioutsourcehub.com/checkout-relay-plan",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.phone,
    mock: <MockRelayPanel />,
    variant: "dark",
    quickMath: {
      label: "Quick napkin math",
      formula: "weekly after-hours calls × your average sale × 4 weeks = monthly revenue walking out",
      note: "Catch one extra job a month and Relay pays for itself. Most clients break even in month one.",
    },
  },
];

const chips = products.map((p) => ({
  href: `#${p.slug}`,
  label: p.name.split(" — ")[0],
}));

type JobKey = "get-found" | "find-customers" | "run-business";

const jobBySlug: Record<string, JobKey> = {
  "review-automation": "get-found",
  "ai-visibility": "get-found",
  "reach": "find-customers",
  "relay": "run-business",
};

const jobGroupCopy: Record<JobKey, { index: string; label: string; intro: string }> = {
  "get-found": {
    index: "Job 1 of 3",
    label: "Get found.",
    intro: "When customers search — Google, ChatGPT, Maps — your name comes up first. 80% of your future customers find you this way.",
  },
  "find-customers": {
    index: "Job 2 of 3",
    label: "Find customers.",
    intro: "When customers don't know you exist yet, we reach out in your voice and book the calls on your calendar.",
  },
  "run-business": {
    index: "Job 3 of 3",
    label: "Run your business.",
    intro: "When your phone rings while you're with a customer, we pick up — so you stay in the work and never lose a lead.",
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
            Launch pricing — first 10 local clients
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Pricing
          </p>
          <h1 className="font-semibold leading-[1.05] tracking-tight text-4xl md:text-6xl">
            You&apos;re already paying for the leak.
          </h1>
          <p className="mt-5 max-w-2xl text-lg md:text-xl text-[var(--color-hero-subtext)] leading-relaxed">
            Missed calls, stale reviews, customers picking your competitor — that costs money every month. Here&apos;s what fixing it costs. Start with one job. Cancel anytime.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              <span aria-hidden="true">→</span>
              See how much you&apos;re losing (30 sec)
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-green-400" />
              30 days fully refundable · no contract
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
                  Not new to the work. New to packaging it like this.
                </h2>
                <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed">
                  You&apos;re not betting on a new business — you&apos;re betting on people who&apos;ve been automating local-business work for years.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    value: "15+ years",
                    label: "automating the work",
                    border: "border-t-green-500",
                    text: "text-green-500",
                  },
                  {
                    value: "48 hours",
                    label: "to first review",
                    border: "border-t-amber-500",
                    text: "text-amber-500",
                  },
                  {
                    value: "No contracts",
                    label: "ever, period",
                    border: "border-t-gray-900",
                    text: "text-gray-900",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-2xl border border-[var(--color-border)] border-t-[3px] ${s.border} bg-[var(--color-bg-elevated)] px-5 py-5 text-center`}
                  >
                    <p
                      className={`font-mono text-xs uppercase tracking-[0.2em] mb-1 ${s.text}`}
                    >
                      {s.value}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-[var(--color-hero-bg)] p-8 md:p-10 ring-1 ring-[var(--color-hero-border)]">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-green-400 mb-3">
                  <span aria-hidden="true" className="mr-1.5 text-amber-400">💡</span>Step 1 — Start here
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-5">
                  Most owners start with Review Automation.
                </h3>

                <div className="mb-6 flex flex-wrap gap-2">
                  {["48h to live", "$49/mo", "Cancel anytime"].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full bg-transparent border border-green-400 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <p className="text-base md:text-lg text-white/80 leading-relaxed mb-7 max-w-2xl">
                  Cheap, fast, no contracts. We&apos;ll suggest more only when it&apos;d actually help.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    href="https://pay.aioutsourcehub.com/review-automation-plan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 text-sm font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-green-600/30"
                  >
                    Lock in $49/mo
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="#review-automation"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    See all 4 services
                    <span aria-hidden="true">↓</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </PageSection>

        {/* Anchor chips strip — jumps to product detail blocks */}
        <div className="sticky top-16 z-40 -mt-4 mb-0 bg-[var(--color-bg-page)]/95 backdrop-blur-md border-y border-[var(--color-border)] shadow-sm">
          <div className="mx-auto max-w-6xl px-6 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scroll-smooth -mx-2 px-2">
              <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mr-2">
                Jump to
              </span>
              {chips.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="flex-shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-body)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 transition-colors whitespace-nowrap"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Product detail blocks, grouped by job */}
        {products.map((p, i) => {
          const nextProduct = products[i + 1];
          const next = nextProduct
            ? {
                label: nextProduct.name.split(" — ")[0],
                href: `#${nextProduct.slug}`,
              }
            : undefined;
          const sectionData: ProductDetailData = {
            ...p,
            variant: i % 2 === 1 ? "dark" : "light",
          };

          const currentJob = jobBySlug[p.slug];
          const prevJob = i > 0 ? jobBySlug[products[i - 1].slug] : null;
          const isFirstInJob = currentJob && currentJob !== prevJob;
          const groupCopy = currentJob ? jobGroupCopy[currentJob] : null;

          return (
            <div key={p.slug}>
              {isFirstInJob && groupCopy && (
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
              )}
              <ProductDetail data={sectionData} next={next} />
            </div>
          );
        })}

        <CtaBlock
          headline="Not sure where to start?"
          subline="Two paths. Get a free marketing audit and we'll show you exactly what's costing you customers — and what to fix first. Or run the math yourself in 30 seconds at /calculator. No card needed either way."
        />
      </PageBody>
      <BackToTopButton />
    </>
  );
}



