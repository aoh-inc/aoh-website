import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Get Found on Google & AI Search — GetMeFound",
  description: "Get your AI visibility signals right. One-time $149 setup. No subscription, no contract.",
  robots: { index: false },
};

export default async function ReferralLandingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const checkoutUrl = `/checkout/get-found-refresh?ref=${encodeURIComponent(code)}&utm_source=partner&utm_medium=referral&utm_campaign=${encodeURIComponent(code)}`;

  return (
    <div className="min-h-screen bg-[var(--color-hero-bg)] flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-[var(--color-hero-border)] py-4 px-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-[var(--color-hero-text)]">
            GetMeFound
          </Link>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)]"
          >
            Get Found — $149
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Alert */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-red-400">
              Google Search is becoming more AI-driven
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-hero-text)] leading-[1.05] mb-6">
            Google and AI need clear facts<br className="hidden sm:block" /> before they recommend<br className="hidden sm:block" /> a local business.
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-hero-subtext)]/70 max-w-2xl mx-auto leading-relaxed mb-10">
            If your Google profile isn&apos;t complete and current, AI has less confidence in your business. GetMeFound engineers the signals that change that — no subscription required.
          </p>

          {/* What you get */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 mb-10 text-left max-w-xl mx-auto">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)] mb-5">What Get Found includes</p>
            <div className="space-y-2">
              {[
                { text: "Baseline visibility check — see exactly where you stand", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                { text: "Google Business Profile cleanup and fact sync", color: "bg-green-500/10 border-green-500/20 text-green-400" },
                { text: "First review request path — ask real customers safely", color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
                { text: "Before / after proof snapshot — see what changed", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
                { text: "Private client page — track everything in one place", color: "bg-sky-500/10 border-sky-500/20 text-sky-400" },
              ].map(({ text, color }) => (
                <div key={text} className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${color}`}>
                  <span className="flex-shrink-0 mt-0.5 font-bold">✓</span>
                  <span className="text-sm text-white/80 leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-10 py-5 text-lg font-bold text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[var(--color-accent)]/30"
            >
              Get Found — $149
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <Link
              href="/report/ai-visibility"
              className="text-sm text-[var(--color-hero-subtext)]/50 hover:text-[var(--color-hero-subtext)] transition-colors"
            >
              See if AI recommends you first →
            </Link>
          </div>

          <p className="mt-6 text-xs text-[var(--color-hero-subtext)]/35">
            One-time setup · No subscription · No contract
          </p>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-[var(--color-hero-border)] py-5 px-6 text-center">
        <p className="text-xs text-[var(--color-hero-subtext)]/30">
          © {new Date().getFullYear()} GetMeFound · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
