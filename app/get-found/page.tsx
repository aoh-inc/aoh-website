import type { Metadata } from "next";
import Link from "next/link";
import { LogoOnlyNav } from "@/components/LogoOnlyNav";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";

export const metadata: Metadata = {
  title: "Get Found — One-Time Google Presence Setup",
  description:
    "We fix your Google Business Profile, citations, and AI search baseline in 48–72 hours. One-time, $149. No contract.",
  alternates: { canonical: "/get-found" },
};

const WHAT_YOU_GET = [
  "Full Google Business Profile audit and optimization",
  "Name, address, phone, website, category, hours, and services verified",
  "Website trust markup plan (or developer handoff)",
  "AI search visibility baseline report",
  "First email review request campaign setup",
  "30-minute onboarding call",
];

const USE_THIS_IF = [
  "Your Google profile is stale, thin, or hasn't been touched in years.",
  "You want a low-cost first step before committing to a monthly plan.",
  "You need a clear visibility baseline before asking for more reviews.",
];

export default function GetFoundPage() {
  return (
    <div className="min-h-screen bg-(--color-hero-bg) text-hero-text">
      <LogoOnlyNav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
        <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
          One-time setup
        </p>
        <h1 className="text-[clamp(2.4rem,7vw,4rem)] font-bold leading-[1.05] tracking-tight">
          Get your Google presence{" "}
          <span className="text-accent">fixed in 48 hours.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-hero-subtext/80 md:text-xl max-w-xl mx-auto">
          One-time setup. We audit your Google profile, citations, and AI search visibility — then fix everything that&apos;s hurting you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="text-4xl font-bold">$149</div>
          <div className="text-hero-subtext/70 text-sm leading-snug text-left">
            one-time<br />
            <span className="text-hero-subtext/50">no contract · no recurring charge</span>
          </div>
        </div>

        <div className="mt-8 max-w-sm mx-auto">
          <CheckoutButton slug="get-found-refresh" label="Get Found for $149 →" />
        </div>
        <p className="mt-3 text-xs text-hero-subtext/50">
          Secure checkout via Stripe · Results in 48–72 hours
        </p>
      </section>

      {/* What you get */}
      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-accent">
            What&apos;s included
          </h2>
          <ul className="space-y-3">
            {WHAT_YOU_GET.map((item) => (
              <li key={item} className="flex gap-3 text-base text-hero-subtext/90 leading-relaxed">
                <span className="text-accent flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Is this for you */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-accent">
            Use this if
          </h2>
          <ul className="space-y-3">
            {USE_THIS_IF.map((item) => (
              <li key={item} className="flex gap-3 text-base text-hero-subtext/80 leading-relaxed">
                <span className="text-hero-subtext/40 flex-shrink-0 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-hero-subtext/70 leading-relaxed">
              <strong className="text-hero-text">What happens after?</strong>{" "}
              You can stay on Get Found alone, or move to{" "}
              <Link href="/checkout/stay-found" className="text-accent underline underline-offset-2 hover:no-underline">
                Stay Found ($99/mo)
              </Link>{" "}
              to keep your listing, reviews, and AI presence moving every month.
              The setup fee is included free when you upgrade.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 bg-(--color-hero-bg) py-14">
        <div className="mx-auto max-w-sm px-6 text-center">
          <CheckoutButton slug="get-found-refresh" label="Get Found for $149 →" />
          <p className="mt-4 text-xs text-hero-subtext/50">
            No contract · No recurring charge · Cancel not needed — it&apos;s one-time
          </p>
          <Link
            href="/pricing"
            className="mt-6 block text-sm text-hero-subtext/50 hover:text-hero-text transition-colors"
          >
            ← Compare all plans
          </Link>
        </div>
      </section>
    </div>
  );
}
