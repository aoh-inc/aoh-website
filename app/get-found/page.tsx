import type { Metadata } from "next";
import Link from "next/link";
import { VisibilityReport20 } from "@/components/report/VisibilityReport20";
import { buildDemoSignals } from "@/lib/visibility-report-20";
import { ReportTransformation } from "@/components/sections/ReportTransformation";
import { FounderNote } from "@/components/sections/FounderNote";
import { GetFoundCloseBlock } from "@/components/sections/GetFoundCloseBlock";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Get Found — Your Complete AI-Visibility Setup | GetMeFound",
  description:
    "Your complete AI-visibility setup, run through the Visibility Engine in 48 hours. Google profile, schema, citations, review path — done for you. $149 one-time.",
  alternates: { canonical: "/get-found" },
};

// Demo signals — realistic "before Get Found" picture: mostly red/amber
// Baseline mode shows locked After column ("included with Get Found")
const BEFORE_SIGNALS = buildDemoSignals({
  4:  { beforeStatus: "amber" }, // review sentiment
  7:  { beforeStatus: "amber" }, // content structure
  9:  { beforeStatus: "amber" }, // query-answer match
  11: { beforeStatus: "amber" }, // profile completeness (partial)
  12: { beforeStatus: "amber" }, // category (claimed at least)
  14: { beforeStatus: "green" }, // photos (a few exist)
  18: { beforeStatus: "amber" }, // duplicate cleanup (maybe OK)
});

const DELIVERABLES = [
  {
    label: "Google Business Profile cleanup",
    detail: "Hours, services, photos, primary + secondary categories, business description, and all relevant attributes — reviewed and corrected.",
  },
  {
    label: "Website-to-listing match",
    detail: "Your website's name, address, phone, hours, and service descriptions are aligned exactly with your Google listing so AI sees one consistent story.",
  },
  {
    label: "Directory sync",
    detail: "Your business facts submitted to the top directories (Apple Maps, Bing, Yelp, and others) that feed Google's knowledge graph.",
  },
  {
    label: "Schema + crawlability fixes",
    detail: "We add the code behind your site that tells Google AI, ChatGPT, and Claude exactly who you are — in a format crawlers can parse.",
  },
  {
    label: "First review-velocity path",
    detail: "A clean review-request path set up and your first campaign sent to past customers — so AI sees fresh, real proof of activity.",
  },
  {
    label: "Before/after visibility report",
    detail: "A snapshot of every signal checked — before and after — so you can see exactly what changed and what it means.",
  },
];

const WHO_ITS_FOR = [
  "Your Google profile is stale, thin, or hasn't been updated in over a year.",
  "Your website says different things than your Google listing (hours, services, phone).",
  "People asking Google AI or ChatGPT for your type of business aren't finding you.",
  "You want a clear, proven baseline before investing in monthly upkeep.",
];

const ACCESS_SAFETY = [
  { h: "Your email is safe", b: "We verify your email configuration before touching anything. Your email and website are completely separate — we never touch email hosting." },
  { h: "You stay the owner", b: "You add us as a manager on your Google listing — not an owner. You keep full control and can remove our access any time, for any reason." },
  { h: "Access stays private", b: "We never share your credentials or access outside our team. No outsourcing, no third-party access to your accounts." },
];

const FAQ = [
  {
    q: "What exactly do you do for $149?",
    a: "We fix everything Google AI, ChatGPT, and Claude check before recommending a local business. That means correcting your Google listing — hours, services, photos, service area, and description — making your website match it exactly, submitting your business to the top directories, and sending your first review request campaign to past customers. Everything is done within 48 hours. You get a before/after report showing exactly what changed.",
  },
  {
    q: "How long before I see results?",
    a: "The fixes go live within 48 hours of receiving your access and business information. Google typically takes 1–2 weeks to fully register the changes across its systems. Review activity builds over 30–60 days as your first campaign gets responses. We show you the before/after report from day one so you can see exactly what changed.",
  },
  {
    q: "Do you guarantee results?",
    a: "We don't guarantee a specific Google ranking or a specific number of reviews — nobody honest can. What we guarantee is the work: every fix in your report gets done, done correctly, and done within 48 hours. If something isn't right, we fix it at no charge.",
  },
];

export default function GetFoundPage() {
  return (
    <>
      {/* ─── §1 HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          {/* eyebrow */}
          <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Get Found · $149 one-time
          </p>

          <h1 className="text-[clamp(2.2rem,6vw,3.6rem)] font-bold leading-[1.05] tracking-tight max-w-3xl">
            Your complete AI-visibility setup,{" "}
            <span className="text-[var(--color-accent)]">run through the Visibility Engine in 48 hours.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-hero-subtext)] md:text-lg">
            Google AI now picks one or two local businesses instead of ten results. For the first time a small business can be the one it picks — but the window closes the moment a competitor locks in the spot. Get Found engineers the signals that get you picked.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/checkout/get-found-refresh"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-7 py-3.5 text-base font-semibold text-[var(--color-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
            >
              Get Found for $149
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/#free-audit"
              className="text-sm font-semibold text-[var(--color-hero-subtext)] underline underline-offset-4 hover:text-[var(--color-hero-text)] transition-colors"
            >
              Not ready? Get your free visibility check →
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {["48-hour delivery", "No contract", "No tech skills needed"].map((pill) => (
              <span key={pill} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--color-hero-subtext)]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-[var(--color-accent)]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── §2 WHO IT'S FOR ─────────────────────────────────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-12">
          <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Who it&apos;s for
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WHO_ITS_FOR.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] px-4 py-3">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                <p className="text-sm leading-snug text-[var(--color-text-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── §3 WHAT'S INCLUDED ──────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg-page)]">
        <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
          <Reveal>
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              What&apos;s included
            </p>
            <h2 className="mb-8 text-2xl font-bold text-[var(--color-text-body)] md:text-3xl">
              Everything we fix in 48 hours.
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {DELIVERABLES.map(({ label, detail }) => (
                <div key={label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                  <p className="font-semibold text-[var(--color-text-body)] mb-1.5">
                    <span className="mr-2 text-[var(--color-accent)]">✓</span>
                    {label}
                  </p>
                  <p className="pl-5 text-sm leading-relaxed text-[var(--color-text-muted)]">{detail}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── §4 WHAT WE CHECK — 20-signal scorecard ──────────────────────── */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <Reveal>
            <div className="mb-8">
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                What we check
              </p>
              <h2 className="text-2xl font-bold text-[var(--color-text-body)] md:text-3xl">
                All 20 AI-visibility signals. One system.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
                Getting picked by AI isn&apos;t one fix — it&apos;s dozens of interdependent signals it cross-checks before it trusts you. Here&apos;s what Get Found covers. The After column shows what turns green when we&apos;re done.
              </p>
            </div>

            <VisibilityReport20
              mode="baseline"
              signals={BEFORE_SIGNALS}
              businessName="Your Business"
              competitorGreens={13}
              competitorName="a well-optimised competitor"
              showCta={false}
            />

            <p className="mt-4 text-xs text-[var(--color-text-muted)]/60 text-center">
              Illustrative example — your actual scores are generated from real Outscraper data during your free visibility check.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── §5 HOW IT WORKS ─────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ─── §6 PROOF — sample before/after report ───────────────────────── */}
      <ReportTransformation />

      {/* ─── §7 TRUST ────────────────────────────────────────────────────── */}
      <div className="bg-[var(--color-bg-elevated)]">
        <FounderNote />

        {/* Guarantee + access safety */}
        <div className="mx-auto max-w-4xl border-t border-[var(--color-border)] px-6 py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Guarantee */}
            <GetFoundCloseBlock variant="light" showCta={false} />

            {/* Access safety */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-6">
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Your access stays safe
              </p>
              <ul className="space-y-3">
                {ACCESS_SAFETY.map(({ h, b }) => (
                  <li key={h}>
                    <p className="text-sm font-semibold text-[var(--color-text-body)]">{h}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-muted)]">{b}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ─── §8 FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg-page)]">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <h2 className="mb-8 text-2xl font-bold text-[var(--color-text-body)] md:text-3xl">Questions</h2>
          <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {FAQ.map((item, i) => (
              <details key={item.q} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[var(--color-text-body)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  <span>{item.q}</span>
                  <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── §9 FINAL CTA (dark) ─────────────────────────────────────────── */}
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-tight">
            One business gets recommended in your area.
            <br />
            <span className="text-[var(--color-accent)]">Make sure it&apos;s yours.</span>
          </h2>
          <p className="mt-4 text-base text-[var(--color-hero-subtext)]/70">
            48 hours · No contract · If any fix isn&apos;t right, we fix it.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/checkout/get-found-refresh"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-[var(--color-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
            >
              Get Found for $149
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-[var(--color-hero-subtext)] underline underline-offset-4 hover:text-[var(--color-hero-text)] transition-colors"
            >
              Compare all plans →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
