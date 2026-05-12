import type { Metadata } from "next";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { Reveal } from "@/components/Reveal";
import { ProductDetail, type ProductDetailData } from "@/components/sections/ProductDetail";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ICON_PATHS } from "@/lib/icon-paths";
import { MockReviewPanel } from "@/components/ui/MockReviewPanel";
import { MockAIVisibilityPanel } from "@/components/ui/MockAIVisibilityPanel";
import { MockReachPanel } from "@/components/ui/MockReachPanel";
import { MockStudioPanel } from "@/components/ui/MockStudioPanel";
import { MockRelayPanel } from "@/components/ui/MockRelayPanel";
import { MockWholeStackPanel } from "@/components/ui/MockWholeStackPanel";
import { pageBreadcrumbs } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Build your AOH stack. Pick the services you want — Review Automation, AI Visibility, Reach, Studio, Relay — and the bundle savings appear live. Cancel anytime.",
  alternates: { canonical: "/pricing" },
};

const breadcrumb = pageBreadcrumbs("Pricing", "/pricing");

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
      "You reply yourself (upgrade to AI Visibility for AI-drafted replies + SMS)",
      "Monthly digest — what was sent, what came in",
      "Cancel anytime · no contract",
    ],
    useThisIf: [
      "You're starting from scratch on reviews and want a low-risk first step.",
      "You're fine replying to reviews yourself for now.",
      "Email is the right channel for your customers (B2B, professional services).",
    ],
    setupSteps: [
      { title: "Connect your Google Business Profile", sub: "We audit it and fix what's broken." },
      { title: "Map your customer triggers", sub: "POS, CRM, or simple webhook." },
      { title: "First requests go out", sub: "Within 48 hours of kickoff." },
    ],
    cadence: "1 email per completed job, sent within 60 minutes.",
    crossSell: { label: "AI Visibility — adds SMS + AI replies", href: "#ai-visibility" },
    price: "$49",
    cadenceLabel: "/mo",
    setup: "No setup fee",
    ctaLabel: "Start at $49/mo",
    ctaHref: "https://pay.aioutsourcehub.com/checkout-review-automation-plan-page",
    iconPaths: ICON_PATHS.star,
    mock: <MockReviewPanel />,
  },
  {
    slug: "ai-visibility",
    number: "02",
    name: "AI Visibility",
    outcome: "Be the answer when customers ask ChatGPT or Google AI.",
    story:
      "A quarter of searches have already moved to AI tools. Most local businesses are invisible there. We get your business named in ChatGPT, Google AI Overviews, and Claude — and we run AI-drafted replies + SMS review requests so your reputation feeds the answer.",
    stats: [
      { label: "Channels", value: "4+ AI" },
      { label: "SMS lift", value: "3×" },
      { label: "Review", value: "Monthly" },
    ],
    whatYouGet: [
      "Everything in Review Automation",
      "AI-drafted replies in your voice (you approve)",
      "SMS review requests (3× higher response than email)",
      "Monthly 15-min review call + ongoing GBP work",
      "Show up when people ask ChatGPT or Google AI who to hire nearby",
      "Website trust signals set up so AI can confidently recommend your business",
      "Your reviews tracked across platforms so nothing important gets missed",
    ],
    useThisIf: [
      "You want reviews AND to be found in AI search.",
      "You're serious about local ranking, not just dabbling.",
      "You'd rather approve AI replies than write them yourself.",
    ],
    setupSteps: [
      { title: "Google profile tune-up", sub: "We tighten your profile foundation beyond the Review Automation baseline." },
      { title: "Site visibility setup", sub: "We structure your site so AI tools like ChatGPT, Google AI, and Claude can recommend your business." },
      { title: "AI citation setup", sub: "We strengthen your business mentions across the web so AI has more confidence recommending you." },
      { title: "First monthly review call", sub: "We show what changed, what moved, and what’s next." },
    ],
    cadence: "Monthly 15-min review call. Ongoing GBP + AI work.",
    crossSell: { label: "Reach — to add new outbound leads", href: "#reach" },
    price: "$179",
    cadenceLabel: "/mo",
    setup: "$199 setup",
    ctaLabel: "Start AI Visibility",
    ctaHref: "https://pay.aioutsourcehub.com/checkout-ai-visibility-plan-page",
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
    ],
    useThisIf: [
      "You have margin to grow and can handle 3–5 new conversations a week.",
      "Your offer is clear and you know who the right customer is.",
      "You've tried doing outreach yourself and it didn't get done.",
    ],
    setupSteps: [
      { title: "ICP intake call", sub: "We map who your best customer is." },
      { title: "Voice training + list build", sub: "We learn your tone and source the prospects." },
      { title: "First campaign live", sub: "Launches in about 14 days from kickoff." },
    ],
    cadence: "Campaign launches in ~14 days, then continuous outreach with weekly optimization and reporting.",
    crossSell: { label: "Studio — for the content side", href: "#studio" },
    price: "$249",
    cadenceLabel: "/mo",
    setup: "$199 setup",
    ctaLabel: "Start Reach",
    ctaHref: "https://link.hub360ai.com/widget/booking/fVfL3Xth5gEW9mRjZS56",
    iconPaths: ICON_PATHS.target,
    mock: <MockReachPanel />,
  },
  {
    slug: "relay",
    number: "04",
    name: "Relay — Voice AI",
    outcome: "24/7 receptionist. Never miss another call.",
    story:
      "Multilingual AI receptionist that answers every call, qualifies the lead, and books appointments directly into your calendar. Works in 27+ languages so you don't lose calls from customers who don't speak yours. After-hours, lunch breaks, you're with a customer — Relay picks up.",
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
      "You're missing calls and don't know how many.",
      "You get after-hours leads or multilingual customers.",
      "Hiring a receptionist isn't worth $40K+/year yet.",
    ],
    setupSteps: [
      { title: "Discovery call", sub: "We learn your service, hours, FAQs." },
      { title: "Voice + script tuned", sub: "Sounds like your business, not a robot." },
      { title: "Test calls + go live", sub: "Roughly 1 week from kickoff." },
    ],
    cadence: "Always-on. 750 included minutes per month.",
    crossSell: { label: "Reach — pair inbound with outbound", href: "#reach" },
    price: "$499",
    cadenceLabel: "/mo",
    setup: "$499 setup",
    ctaLabel: "Start Relay",
    ctaHref: "https://pay.aioutsourcehub.com/checkout-relay-plan-page",
    iconPaths: ICON_PATHS.phone,
    mock: <MockRelayPanel />,
  },
  {
    slug: "studio",
    number: "05",
    name: "Studio — Content Engine",
    outcome: "Branded posts on autopilot. We write, design, post.",
    story:
      "3 to 5 posts a week, in your brand voice, with custom images generated in your style. Themes are built around your offers and seasonality. You don't write captions, design graphics, or schedule anything — we run the whole calendar.",
    stats: [
      { label: "Posts", value: "3–5×/wk" },
      { label: "Images", value: "Custom" },
      { label: "Voice", value: "Yours" },
    ],
    whatYouGet: [
      "Branded posts published 3–5× per week",
      "Custom images generated in your visual style",
      "Monthly campaign themes aligned with your offers",
      "Brand voice training (one-time onboarding)",
      "Multi-platform posting (FB, IG, GBP, LinkedIn)",
      "Fully managed — we write, design, and post",
    ],
    useThisIf: [
      "You want a consistent social presence but don't have time to post.",
      "Your content is sporadic and customers comment on the gaps.",
      "You'd rather review and approve than create from scratch.",
    ],
    setupSteps: [
      { title: "Brand voice intake", sub: "We capture how you sound and look." },
      { title: "Theme calendar built", sub: "First month mapped to your offers." },
      { title: "First wave posted", sub: "Week 1 of month one." },
    ],
    cadence: "3–5 posts/week. Monthly theme refresh.",
    crossSell: { label: "Reach — pair outbound with content", href: "#reach" },
    price: "$349",
    cadenceLabel: "/mo",
    setup: "$299 setup",
    ctaLabel: "Start Studio",
    ctaHref: "https://pay.aioutsourcehub.com/checkout-studio-plan-page",
    iconPaths: ICON_PATHS.studio,
    mock: <MockStudioPanel />,
    variant: "dark",
  },
  {
    slug: "whole-stack",
    number: "06",
    name: "The Whole Stack",
    outcome: "For owners running 5+ marketing channels who want it all handled by one team.",
    story:
      "Reviews, AI visibility, outbound leads, content, voice — all running together. One bill, one onboarding call, one monthly check-in. We sequence the rollout so your team isn't overwhelmed.",
    stats: [
      { label: "Services", value: "All 5" },
      { label: "Bill", value: "1" },
      { label: "Save", value: "$400+/mo" },
    ],
    whatYouGet: [
      "AI Visibility (Reviews + AI search) included",
      "Relay Voice AI (1,000 minutes/month — extra over solo)",
      "Reach Lead Engine — full outbound",
      "Studio Content Engine — full posting calendar",
      "Custom Website Rebuild ($999 build included)",
      "Single bill + priority response queue",
      "Combined monthly call covering all 5",
    ],
    useThisIf: [
      "You want growth + visibility + leads + content + voice all running.",
      "You'd rather have one onboarding than five.",
      "The math on solo bundles already justifies it.",
    ],
    setupSteps: [
      { title: "Discovery + sequencing call", sub: "We map order of rollout to your capacity." },
      { title: "Wave 1 — reviews + visibility", sub: "Foundation goes in first." },
      { title: "Wave 2 — Reach + Studio + Relay", sub: "Outbound, content, and voice come online." },
    ],
    cadence: "Combined monthly call. Priority response queue.",
    price: "$999",
    cadenceLabel: "/mo",
    setup: "$999 setup",
    ctaLabel: "Start Whole Stack",
    ctaHref: "https://link.hub360ai.com/widget/booking/fVfL3Xth5gEW9mRjZS56",
    iconPaths: ICON_PATHS.dashboard,
    mock: <MockWholeStackPanel />,
    variant: "dark",
  },
];

const chips = products.map((p) => ({
  href: `#${p.slug}`,
  label: p.name.split(" — ")[0],
}));

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
            8 of 10 local launch spots left
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Pricing
          </p>
          <h1 className="font-semibold leading-[1.05] tracking-tight text-4xl md:text-6xl">
            Pricing without the pressure.
          </h1>
          <p className="mt-5 max-w-2xl text-lg md:text-xl text-[var(--color-hero-subtext)] leading-relaxed">
            Six things we run for you. Start with one. Cancel anytime. We only suggest more when it&apos;d actually help you.
          </p>
          <p className="mt-3 text-sm text-gray-400">
            Reading this because we found you? That&apos;s how we work.
          </p>
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
                    href="https://pay.aioutsourcehub.com/checkout-review-automation-plan-page"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 text-sm font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-green-600/30"
                  >
                    Start at $49/mo
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="#review-automation"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    See all 6 services
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

        {/* Product detail blocks */}
        {products.map((p, i) => {
          const nextProduct = products[i + 1];
          const next = nextProduct
            ? {
                label: nextProduct.name.split(" — ")[0],
                href: `#${nextProduct.slug}`,
              }
            : undefined;
          return <ProductDetail key={p.slug} data={p} next={next} />;
        })}

        <CtaBlock
          headline="Not sure where to start?"
          subline="Get a free marketing audit. We'll show you exactly what's costing you customers — and what to fix first."
        />
      </PageBody>
      <BackToTopButton />
    </>
  );
}



