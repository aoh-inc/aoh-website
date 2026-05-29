import type { Metadata } from "next";
import Link from "next/link";
import { AuditRequestForm } from "@/components/sections/AuditRequestForm";
import { GetFoundCloseBlock } from "@/components/sections/GetFoundCloseBlock";

export const metadata: Metadata = {
  title: "Get Found by Google's AI — GetMeFound",
  description:
    "Google AI now picks one or two local businesses instead of ten results. We engineer the signals that get you picked. Done in 48 hours, no contract.",
  robots: { index: false, follow: false },
};

const GOOGLE_AI_CALLING_URL =
  "https://blog.google/products-and-platforms/products/search/deep-search-business-calling-google-search/";

const SIGNALS = [
  "Entity consistency across 50+ directories",
  "Structured data crawlers can parse",
  "NAP feeding Google's knowledge graph",
  "Review velocity and recency",
  "Website ↔ profile fact alignment",
  "AI-answer citation readiness",
];

const FAQ_ITEMS = [
  {
    q: "How long does it take?",
    a: "Get Found is delivered in 48 hours after intake. We collect your business details, run the Signal Stack audit, fix the conflicts, and send the before/after report.",
  },
  {
    q: "What do you actually change?",
    a: "Your Google Business listing (hours, services, photos, category, attributes), your website's alignment with that listing, your structured data, your cross-web directory citations, and your first review-request path. Nothing is auto-posted without your approval.",
  },
  {
    q: "Will you break my email or website?",
    a: "No. We never touch your email hosting. We update website copy and structured data — not your hosting, domain, or email configuration. Google access is manager-only; you stay the owner and can remove us any time.",
  },
  {
    q: "Is there a contract?",
    a: "Never. Get Found is a one-time payment. Monthly plans (Stay Found, Always Ready) are month-to-month. Cancel any time, no fee, no questions.",
  },
  {
    q: "What if AI still doesn't recommend me after?",
    a: "If any fix in your report isn't done correctly, we fix it — at no charge. AI visibility builds over weeks as signals propagate, but every signal we set up is done right from day one.",
  },
];

export default function LpGetFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
      {/* Minimal header — logo + secondary link only */}
      <header className="border-b border-[var(--color-hero-border)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-[var(--color-hero-text)]">
            GetMeFound
          </Link>
          <Link
            href="/checkout/get-found-refresh"
            className="text-sm font-semibold text-[var(--color-accent)] hover:underline underline-offset-4 transition-colors"
          >
            Ready now? Get Found for $149 →
          </Link>
        </div>
      </header>

      {/* HERO + FORM */}
      <section aria-label="Hero" className="px-6 py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          {/* Left: headline + urgency */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="font-mono text-[11px] font-semibold text-red-400">
                May 2026 — Google replaced Search with AI
              </span>
            </div>

            <h1 className="text-[clamp(2rem,6vw,3.2rem)] font-bold leading-[1.05] tracking-tight">
              Google&apos;s AI now picks one business.
              <br />
              <span className="text-[var(--color-accent)]">Make yours the one it picks.</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-[var(--color-hero-subtext)]/75 md:text-lg">
              For the first time, a small local business can beat a bigger competitor — not with ad
              spend, but by having cleaner signals. The window closes once a competitor locks in the
              spot. We engineer all 13+ signals AI checks, in 48 hours.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {SIGNALS.map((s) => (
                <div key={s} className="flex items-start gap-2 text-sm text-[var(--color-hero-subtext)]/65">
                  <span className="mt-0.5 text-[var(--color-accent)] shrink-0">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs text-[var(--color-hero-subtext)]/40">
              Everything follows{" "}
              <a
                href="https://support.google.com/business/answer/7091"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] underline underline-offset-2"
              >
                Google&apos;s own published guidance
              </a>
              . We never guarantee rankings — we engineer the signals.
            </p>
          </div>

          {/* Right: form */}
          <div id="free-audit">
            <AuditRequestForm />
            <p className="mt-3 text-center text-xs text-[var(--color-hero-subtext)]/40">
              Already decided?{" "}
              <Link
                href="/checkout/get-found-refresh"
                className="text-[var(--color-accent)] hover:underline underline-offset-2"
              >
                Get Found for $149 →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* THE WINDOW JUST OPENED */}
      <section className="border-y border-[var(--color-hero-border)] bg-[#0a1628] px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            First-mover window
          </p>
          <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl">
            The old system rewarded budget. The new system rewards signals.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
            For years, the top of Google search was locked by SEO spend. The business with the most
            links and the most budget won. Google&apos;s AI flipped that. It picks the businesses
            with the most complete, consistent, trustworthy signal stack — regardless of size.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
            A solo dentist with clean signals can beat a dental group with a six-figure ad budget.
            A salon with 40 recent reviews and perfect entity consistency gets recommended over a
            chain. But only until the chain figures out what they need to fix.
          </p>
          <p className="mt-6 font-semibold text-white">
            The window is open right now. We help you move first.
          </p>
        </div>
      </section>

      {/* VISIBILITY ENGINE */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Our method
          </p>
          <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
            The Visibility Engine: Map → Align → Amplify
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                n: "01", label: "Map", color: "text-amber-400", border: "border-amber-400/30",
                headline: "Every signal AI reads about you.",
                body: "Google AI, ChatGPT, Claude, and Gemini each crawl a different mix of your listing, structured data, directories, website, and reviews. We start by reading exactly what they see.",
              },
              {
                n: "02", label: "Align", color: "text-[var(--color-accent)]", border: "border-[var(--color-accent)]/30",
                headline: "Fix the conflicts that make AI distrust you.",
                body: "Inconsistencies between your listing, website, and directories register as trust signals against you. We resolve every conflict so AI sees one clear, credible story.",
              },
              {
                n: "03", label: "Amplify", color: "text-emerald-400", border: "border-emerald-400/30",
                headline: "Build the signals AI uses to pick you.",
                body: "Verified entity consistency, review velocity, machine-readable structured data, and cross-platform fact alignment — the signals that tip AI from 'found' to 'recommended.'",
              },
            ].map((step) => (
              <div
                key={step.n}
                className={`rounded-2xl border ${step.border} bg-white/[0.03] p-6`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className={`font-mono text-xs font-bold ${step.color}`}>{step.n}</span>
                  <span className={`text-lg font-black ${step.color}`}>{step.label}</span>
                </div>
                <h3 className="mb-2 text-sm font-bold text-white">{step.headline}</h3>
                <p className="text-sm leading-relaxed text-white/55">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNAL STACK (condensed) */}
      <section className="border-t border-[var(--color-hero-border)] px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Under the hood
          </p>
          <h2 className="mb-2 text-2xl font-bold text-white">Your Signal Stack</h2>
          <p className="mb-7 text-sm leading-relaxed text-white/55">
            These are the signals AI cross-checks. Miss consistency between any of them and AI
            discounts all of it.{" "}
            <span className="text-white/75">Knowing which matter, in what order, is the work.</span>
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              "Entity consistency across 50+ directories",
              "NAP data feeding Google's knowledge graph",
              "Structured data AI crawlers can parse",
              "Google Business Profile completeness + attributes",
              "Review velocity, recency, and sentiment signals",
              "Website ↔ profile fact alignment",
              "Cross-web citation authority",
              "Profile activity signals (posts, photos, Q&A)",
              "AI-answer citation readiness",
              "Review response voice consistency",
              "Business category and attribute alignment",
              "GEO / AEO signal readiness",
            ].map((s) => (
              <div key={s} className="flex items-start gap-2.5 rounded-xl bg-white/[0.04] px-3 py-2.5">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                <span className="text-sm text-white/70">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 48h / NO CONTRACT / GUARANTEE */}
      <section className="border-t border-[var(--color-hero-border)] px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <GetFoundCloseBlock variant="dark" showCta={true} />
        </div>
      </section>

      {/* FOUNDER BLOCK */}
      <section className="border-t border-[var(--color-hero-border)] px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team/mike.jpg"
                  alt="Mike Egidio, founder of GetMeFound"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <p className="text-sm font-bold text-white">Mike Egidio</p>
              <p className="text-xs text-white/50">Founder, GetMeFound</p>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Why I built this
              </p>
              <blockquote className="text-base leading-relaxed text-white/75">
                &ldquo;I&apos;ve built and sold companies, and I kept watching great local businesses
                stay invisible while weaker competitors got picked. Getting picked by AI isn&apos;t
                one fix — it&apos;s dozens of signals it cross-checks before it trusts you. I built
                GetMeFound to engineer all of them for you. Done for you, no contracts.&rdquo;
              </blockquote>
              <p className="mt-4 text-xs text-white/40">
                15+ years building businesses · 1 sold EdTech company ·{" "}
                <Link href="/about" className="text-[var(--color-accent)] hover:underline underline-offset-2">
                  Full story →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY REASSURANCE */}
      <section className="border-t border-[var(--color-hero-border)] px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { h: "Your email is safe", b: "We never touch your email or email hosting. Ever." },
              { h: "You stay the owner", b: "Google access is manager-only. You remove us any time." },
              { h: "Nothing auto-posts", b: "Every review response and profile edit gets your approval first." },
            ].map(({ h, b }) => (
              <div key={h} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="mb-1 text-sm font-bold text-white">{h}</p>
                <p className="text-xs leading-relaxed text-white/55">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--color-hero-border)] px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold text-white">Questions</h2>
          <div className="divide-y divide-white/10">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-white">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/50 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* REPEAT FORM */}
      <section className="border-t border-[var(--color-hero-border)] px-6 py-14">
        <div className="mx-auto max-w-xl">
          <p className="mb-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            One decision
          </p>
          <h2 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
            One business gets recommended in your area.
            <br />
            <span className="text-[var(--color-accent)]">Make sure it&apos;s yours.</span>
          </h2>
          <AuditRequestForm />
          <p className="mt-3 text-center text-xs text-[var(--color-hero-subtext)]/40">
            Already decided?{" "}
            <Link
              href="/checkout/get-found-refresh"
              className="text-[var(--color-accent)] hover:underline underline-offset-2"
            >
              Get Found for $149 →
            </Link>
          </p>
        </div>
      </section>

      {/* Google calling citation */}
      <section className="border-t border-[var(--color-hero-border)] px-6 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <a
            href={GOOGLE_AI_CALLING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/35 underline underline-offset-2 hover:text-white/60 transition-colors"
          >
            Google has confirmed its AI will call local businesses to check pricing and availability on a customer&apos;s behalf.
          </a>
          <p className="mt-2 text-xs text-white/25">
            © {new Date().getFullYear()} GetMeFound ·{" "}
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            {" · "}
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
