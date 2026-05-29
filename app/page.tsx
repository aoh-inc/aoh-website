import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FinalCta } from "@/components/sections/FinalCta";
import { HomepageFAQ } from "@/components/sections/HomepageFAQ";
import { ReportTransformation } from "@/components/sections/ReportTransformation";
import { FounderNote } from "@/components/sections/FounderNote";
import { Reveal } from "@/components/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { HeroVisualAI } from "@/components/hero/HeroVisualAI";
import { ICON_PATHS } from "@/lib/icon-paths";
import { faqPageSchema } from "@/lib/faq";

export const metadata: Metadata = {
  title: "GetMeFound — Get Found by Google's AI in 48 Hours",
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
  jobLabel: "Get Found" | "Stay Found" | "Always Ready";
};

const GOOGLE_AI_CALLING_URL =
  "https://blog.google/products-and-platforms/products/search/deep-search-business-calling-google-search/";

const teaserCards: TeaserCard[] = [
  {
    name: "Get Found",
    tagline: "Your complete AI-visibility setup, run through the Visibility Engine in 48 hours.",
    price: "$149",
    cadence: "one-time",
    bullets: [
      "We map every signal Google AI, ChatGPT, and Claude check before recommending a business",
      "Profile, business facts across the web, and first review path — mapped and fixed",
      "Conflicts that make them distrust you: resolved. Done in 48 hours.",
    ],
    href: "/checkout/get-found-refresh",
    cta: "Get Found for $149",
    iconPaths: ICON_PATHS.search,
    jobLabel: "Get Found",
  },
  {
    name: "Stay Found",
    tagline: "AI re-reads your business constantly. We keep your signals fresh every month.",
    price: "$99",
    cadence: "/month",
    bullets: [
      "We monitor how Google AI, ChatGPT, and Gemini describe you — and re-sync the moment facts drift",
      "Review velocity and entity consistency maintained monthly",
      "Monthly report shows exactly where you stand across every AI channel",
    ],
    href: "/checkout/stay-found",
    cta: "Stay Found for $99/mo",
    iconPaths: ICON_PATHS.dashboard,
    highlight: true,
    jobLabel: "Stay Found",
  },
  {
    name: "Always Ready",
    tagline: "Never miss another customer — human or AI. An AI agent answers your calls 24/7, gives real prices and hours, and books the appointment.",
    price: "$299",
    cadence: "/month",
    bullets: [
      "AI agent answers calls 24/7 with your real services, pricing, and hours",
      "Books appointments straight into your calendar — no missed jobs, no voicemail.",
      "Full content + entity management; approval-gated, nothing goes live without your okay",
    ],
    href: "/pricing#always-ready",
    cta: "Join Early Access →",
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
        {/* §1 — HERO (dark) */}
        <section
          aria-label="Hero"
          className="overflow-hidden bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10 md:py-12 lg:py-14">
            <div className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] md:items-center md:gap-10 lg:gap-12">
              <div
                className="flex min-w-0 w-full flex-col"
                style={{ maxWidth: "calc(100vw - 3rem)" }}
              >
                {/* Alert badge */}
                <div className="mb-5 inline-flex max-w-full w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <span className="min-w-0 whitespace-normal font-mono text-[11px] font-semibold leading-snug text-red-400">
                    May 2026 — Google replaced Search with AI
                  </span>
                </div>

                <h1 className="font-semibold leading-[1.05] tracking-tight text-[clamp(1.7rem,7.2vw,2.25rem)] sm:text-[clamp(2.05rem,5vw,3rem)] md:text-[clamp(2.25rem,3.8vw,3.2rem)]">
                  <span className="hero-line-mask">
                    <span
                      className="hero-roll block"
                      style={{ animationDelay: "0ms", display: "block", overflowWrap: "anywhere" }}
                    >
                      Google doesn&apos;t rank you anymore.
                    </span>
                  </span>
                  <span className="hero-line-mask mt-2 block">
                    <span
                      className="hero-roll block text-[var(--color-accent)]"
                      style={{ animationDelay: "400ms", display: "block", overflowWrap: "anywhere" }}
                    >
                      It picks you — or it doesn&apos;t.
                    </span>
                  </span>
                </h1>

                <p className="mt-5 w-full max-w-xl text-base leading-relaxed text-[var(--color-hero-subtext)] md:text-lg">
                  AI now recommends one or two local businesses — not ten pages. We make sure it finds yours. Done in 48 hours.
                </p>

                {/* Trust chips */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Done for you", "No contract", "48 hours"].map((pill) => (
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

                {/* Single primary CTA */}
                <div className="mt-7">
                  <Link
                    href="/#free-audit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-base font-semibold text-[var(--color-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent)]/30 sm:w-auto"
                  >
                    Check if AI can find you
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <p className="mt-3 font-mono text-xs text-[var(--color-hero-subtext)]/60">
                  Free · takes 30 seconds · no account needed
                </p>
              </div>

              <div className="hidden h-full min-w-0 md:block">
                <HeroVisualAI />
              </div>
            </div>
          </div>
        </section>

        {/* §2 + §3 — PROOF BLOCK + FREE-CHECK FORM (dark — one of only two dark sections) */}
        <ReportTransformation />

        {/* §4 — HOW IT WORKS — THE VISIBILITY ENGINE (light) */}
        <HowItWorks />

        {/* §5 — TRUST / FOUNDER STRIP (cream tint) */}
        <div className="bg-[var(--color-bg-elevated)]">
          <FounderNote />
          {/* Guarantee line */}
          <div className="mx-auto max-w-4xl border-t border-[var(--color-border)] px-6 py-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">
                <span className="font-semibold text-[var(--color-text-body)]">Work guarantee:</span>{" "}
                If any fix in your report isn&apos;t done correctly, we fix it — no charge, no questions.{" "}
                <Link href="/guarantee" className="text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity">
                  Full policy →
                </Link>
              </p>
              <p className="text-xs text-[var(--color-text-muted)]/60 sm:text-right sm:shrink-0">
                No contract · Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* §6 — PRICING (light — NOT dark) */}
        <section className="pt-10 pb-8 md:pt-14 md:pb-10 bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 text-center">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Get found. Stay found.
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-body)] mb-4">
                Pick the level that fits where you are.
              </h2>
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                We run the Google profile, review path, and AI visibility basics. You stay focused on your business.
              </p>
            </div>

            {/* Get Found + Stay Found */}
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
                        <h3 className="text-2xl font-bold text-[var(--color-hero-text)] mb-2">{p.name}</h3>
                        <p className="text-base text-[var(--color-accent)] font-medium mb-3">{p.tagline}</p>
                        {p.highlight && (
                          <p className="mb-4 text-[12px] text-[var(--color-hero-subtext)]/60">
                            $49 one-time setup fee
                          </p>
                        )}
                        <ul className="mb-3 space-y-2">
                          {p.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-[var(--color-hero-subtext)]">
                              <span className="text-[var(--color-accent)] shrink-0 mt-0.5">✓</span>
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
                          <p className="mt-2 text-center text-[11px] text-[var(--color-hero-subtext)]/50">
                            {p.highlight ? "No contract · Cancel anytime" : "48-hour delivery · No contract"}
                          </p>
                          <div className="mt-3 text-center">
                            <Link
                              href={p.name === "Get Found" ? "/get-found" : "/pricing#stay-found"}
                              className="text-xs font-semibold text-[var(--color-accent)] opacity-70 hover:opacity-100 transition-opacity"
                            >
                              See what&apos;s included →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Spotlight>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Always Ready — Early Access */}
            <Reveal delay={0.18}>
              <div className="mx-auto mt-7 max-w-261 text-center">
                <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600">
                  Early Access
                </span>
              </div>
              <div className="mx-auto mt-3 max-w-261 rounded-4xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 md:p-8">
                <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-sky-600">
                      {alwaysReadyCard.jobLabel}
                    </p>
                    <h3 className="text-2xl font-bold leading-tight text-[var(--color-text-body)] md:text-3xl">
                      Never miss another customer — human or AI.
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
                      An AI agent answers your calls 24/7, gives real prices and hours, and books the appointment. Google is getting ready to call businesses on customers&apos; behalf — we get yours ready to answer.
                    </p>
                    <a
                      href={GOOGLE_AI_CALLING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold leading-6 text-sky-700 underline decoration-sky-700/45 underline-offset-4 transition hover:text-sky-900"
                    >
                      Google says Search can &quot;call businesses to get pricing and availability information on your behalf.&quot;
                    </a>
                    <ul className="mt-5 grid gap-2 text-sm text-[var(--color-text-muted)] sm:grid-cols-2">
                      {alwaysReadyCard.bullets.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true" className="text-sky-600">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.75rem] border border-sky-400/20 bg-[var(--color-bg-dark-card)] p-5 ring-1 ring-sky-400/10 shadow-lg md:self-start md:-rotate-1">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-2xl font-black text-[var(--color-hero-text)]">{alwaysReadyCard.name}</h4>
                      <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-sky-400/15 px-3 py-1 ring-1 ring-sky-400/40">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
                          Early Access
                        </span>
                      </span>
                    </div>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-5xl font-black text-sky-300">{alwaysReadyCard.price}</span>
                      <span className="pb-1 text-sm font-semibold text-[var(--color-hero-subtext)]/50">{alwaysReadyCard.cadence}</span>
                      <span className="ml-2 pb-1 text-[10px] text-[var(--color-hero-subtext)]/35">indicative</span>
                    </div>
                    <Link
                      href={alwaysReadyCard.href}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)]"
                    >
                      {alwaysReadyCard.cta}
                    </Link>
                    <p className="mt-2 text-center text-[11px] text-[var(--color-hero-subtext)]/40">
                      No buy button yet — join the list to be first.
                    </p>
                  </div>
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
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Not sure what invisibility is costing you?{" "}
                <Link
                  href="/calculator"
                  className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                >
                  Calculate your monthly loss →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* §7 — FAQ (light) */}
        <HomepageFAQ />

        {/* §8 — FINAL CTA (dark — second of only two dark sections) */}
        <FinalCta />
      </main>
    </>
  );
}
