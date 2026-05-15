import Link from "next/link";
import { DownloadButton } from "./DownloadButton";

const CHECKOUT_URL = "https://pay.aioutsourcehub.com/ai-visibility-page";

const BOOK_URL = "https://link.hub360ai.com/widget/booking/fVfL3Xth5gEW9mRjZS56";

const prospect = {
  name: "Joe's Plumbing",
  city: "Austin, TX",
  category: "plumber",
  rating: 4.2,
  reviewCount: 23,
  aiScore: 22,
};

const CHATGPT_RESPONSE = `Based on reviews and availability, here are the top-rated plumbers in Austin, TX right now:

1. Capitol City Plumbing — Consistently rated one of the best in Austin. 4.8 stars across 140+ reviews. Known for same-day service and upfront pricing.

2. Austin Plumbing Co. — Long-established, handles both residential and commercial. Strong reputation for water heater and drain work.

3. Roto-Rooter Austin — 24/7 availability, good for emergencies. Large team with fast response times.`;

const GOOGLE_AI_RESPONSE = `Here are highly-rated plumbers near Austin, TX:

Capitol City Plumbing
⭐ 4.8 · 147 reviews · Plumber
"Fast, professional, and honest pricing"
Open now · Serves Austin area

Austin Plumbing Experts
⭐ 4.6 · 89 reviews · Plumber
"Great for emergencies, responded within the hour"
Open now · Serves Austin area`;

const SIGNALS: { label: string; passes: boolean }[] = [
  { label: "Enough Google reviews", passes: false },
  { label: "Star rating above 4.5", passes: false },
  { label: "ChatGPT can read your website", passes: false },
  { label: "Your site answers questions customers ask ChatGPT", passes: false },
  { label: "Website matches your Google listing", passes: true },
];

export default function AIVisibilityDemoPage() {
  const passingCount = SIGNALS.filter((s) => s.passes).length;

  return (
    <main className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-body)]">

      {/* Header */}
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            AI Visibility Report · {prospect.name}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight mb-4">
            When a customer in {prospect.city} asks ChatGPT
            for a {prospect.category} — whose name comes up?
          </h1>
          <p className="text-base text-[var(--color-hero-subtext)] max-w-xl leading-relaxed">
            We ran it. Here's the answer — and what it's costing you every month.
          </p>
        </div>
      </section>

      {/* Score + revenue loss */}
      <section className="mx-auto max-w-4xl px-6 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 flex flex-col justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400 mb-2">
              AI Visibility Score
            </p>
            <p className="text-6xl font-bold text-red-400 leading-none">
              {prospect.aiScore}
              <span className="text-xl font-normal text-red-400/60">/100</span>
            </p>
            <p className="mt-3 text-xs text-[var(--color-text-muted)] leading-relaxed">
              Below 40 — ChatGPT and Google AI rarely recommend businesses at this level.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 flex flex-col justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">
              Est. calls missed / month
            </p>
            <p className="text-6xl font-bold text-[var(--color-text-body)] leading-none">
              8–15
            </p>
            <p className="mt-3 text-xs text-[var(--color-text-muted)] leading-relaxed">
              Estimated for {prospect.city} at this score. People who find a business through ChatGPT or Google AI are 23× more likely to call than someone from a regular search.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 flex flex-col justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">
              What ChatGPT found about you
            </p>
            <p className="text-6xl font-bold text-[var(--color-text-body)] leading-none">
              {passingCount}
              <span className="text-xl font-normal text-[var(--color-text-muted)]">/{SIGNALS.length}</span>
            </p>
            <p className="mt-3 text-xs text-[var(--color-text-muted)] leading-relaxed">
              These are what ChatGPT and Google AI look at before recommending a local business. Most businesses in {prospect.city} only have 1 or 2 of these.
            </p>
          </div>

        </div>
      </section>

      {/* First-mover context */}
      <section className="mx-auto max-w-4xl px-6 pt-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-5">
          <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
            <strong>This is Google Maps in 2008.</strong> The businesses that got listed early owned local search for a decade.
            That window is open right now for AI — 68% of local searches already show an AI answer
            before any results, and 84% of local businesses aren't in those answers yet.
            ChatGPT launched paid local placements in 2026. Free recommendation spots are filling up.
            The businesses that move now lock in a free spot before it costs what Google Ads cost today.
          </p>
        </div>
      </section>

      {/* What AI actually said */}
      <section className="mx-auto max-w-4xl px-6 pt-6">
        <h2 className="text-lg font-bold text-[var(--color-text-body)] mb-1">
          We asked. Here's what AI said.
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          "Best {prospect.category} in {prospect.city}" — run on ChatGPT and Google AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden">
            <div className="border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <p className="font-mono text-xs font-bold text-[var(--color-text-muted)]">ChatGPT</p>
              </div>
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 font-mono text-[10px] text-red-400">
                {prospect.name} not mentioned
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                {CHATGPT_RESPONSE}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden">
            <div className="border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                <p className="font-mono text-xs font-bold text-[var(--color-text-muted)]">Google AI</p>
              </div>
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 font-mono text-[10px] text-red-400">
                {prospect.name} not mentioned
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                {GOOGLE_AI_RESPONSE}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-center text-[var(--color-text-muted)]">
          Another {prospect.category} in {prospect.city} appeared in both results. We'll walk through exactly who — and why — on the call.
        </p>
      </section>

      {/* Signals */}
      <section className="mx-auto max-w-4xl px-6 pt-6">
        <h2 className="text-lg font-bold text-[var(--color-text-body)] mb-1">
          Why {prospect.name} is AI-invisible
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          These are the things ChatGPT and Google AI check before recommending a local business. Failing more than 2 means they leave you out.
        </p>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] divide-y divide-[var(--color-border)]">
          {SIGNALS.map((s, i) => (
            <div key={i} className={`px-5 py-3.5 flex items-center gap-4 ${!s.passes ? "bg-red-500/5" : ""}`}>
              <span className={`flex-shrink-0 text-base leading-none ${s.passes ? "text-emerald-400" : "text-red-400"}`}>
                {s.passes ? "✓" : "✗"}
              </span>
              <p className="text-sm font-medium text-[var(--color-text-body)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-8 md:py-10">
        <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.06] p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
            The window is open. Most competitors haven't moved yet.
          </p>
          <h2 className="text-2xl font-bold text-[var(--color-text-body)] mb-3">
            We make {prospect.name} AI-found.
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2 max-w-xl">
            Your website needs to be set up the way AI expects — the same way it had
            to be mobile-friendly to show up on phones.
            We handle your reviews, your website, and the ongoing monitoring.
            You stay the owner. We work inside your existing site.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 max-w-xl">
            For owners who want this built right from the start, we also build
            AI-ready websites from the ground up. We can talk through which
            approach makes sense on the call.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5"
            >
              Get Started →
            </Link>
            <Link
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-transparent px-8 py-4 text-sm font-semibold text-[var(--color-text-body)] transition hover:bg-[var(--color-bg-elevated)] hover:-translate-y-0.5"
            >
              Book a free 15-min call
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--color-border)]/50 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-body)]">Mike Egidio</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                AI Outsource Hub ·{" "}
                <a href="tel:+18775212224" className="hover:text-[var(--color-text-body)] transition">+1 877-521-2224</a>
                {" "}·{" "}
                <a href="mailto:support@aioutsourcehub.com" className="hover:text-[var(--color-text-body)] transition">support@aioutsourcehub.com</a>
              </p>
            </div>
            <DownloadButton />
          </div>
        </div>
      </section>

    </main>
  );
}
