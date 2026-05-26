import type { Metadata } from "next";
import Link from "next/link";
import { LogoOnlyNav } from "@/components/LogoOnlyNav";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";

export const metadata: Metadata = {
  title: "Stay Found — Monthly Google Visibility & Review Management",
  description:
    "Monthly review requests, Google profile upkeep, AI reply drafts, and a monthly report. $99/mo. No contract.",
  alternates: { canonical: "/stay-found" },
};

const WHAT_YOU_GET = [
  "Everything in Get Found — included free",
  "Weekly client list upload for review request campaigns",
  "Text and email review request campaigns",
  "AI response drafts in your brand voice",
  "Negative review alert + suggested response within 4 business hours",
  "One Google Business Profile post per week",
  "Review monitoring across platforms",
  "Monthly report showing your reviews, directory listings, and visibility progress",
];

const USE_THIS_IF = [
  "You want reviews coming in every month without lifting a finger.",
  "You need someone watching your Google presence so it doesn't go stale.",
  "You want AI search tools to have accurate, up-to-date facts about your business.",
];

export default function StayFoundPage() {
  return (
    <div className="min-h-screen bg-(--color-hero-bg) text-hero-text">
      <LogoOnlyNav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
        <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
          Most popular plan
        </p>
        <h1 className="text-[clamp(2.4rem,7vw,4rem)] font-bold leading-[1.05] tracking-tight">
          Your visibility,{" "}
          <span className="text-accent">on autopilot every month.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-hero-subtext/80 md:text-xl max-w-xl mx-auto">
          Reviews, Google profile, and AI search facts — all kept current automatically. You run your business. We keep it visible.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="text-4xl font-bold">$99<span className="text-2xl text-hero-subtext/60">/mo</span></div>
          <div className="text-hero-subtext/70 text-sm leading-snug text-left">
            cancel anytime<br />
            <span className="text-hero-subtext/50">$49 one-time setup fee</span>
          </div>
        </div>

        <div className="mt-8 max-w-sm mx-auto">
          <CheckoutButton slug="stay-found" label="Start Stay Found →" />
        </div>
        <p className="mt-3 text-xs text-hero-subtext/50">
          Secure checkout via Stripe · No contract · Cancel anytime
        </p>
      </section>

      {/* What you get */}
      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-accent">
            What&apos;s included every month
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
              <strong className="text-hero-text">Need more?</strong>{" "}
              <Link href="/checkout/always-ready" className="text-accent underline underline-offset-2 hover:no-underline">
                Always Ready ($299/mo)
              </Link>{" "}
              adds an AI voice agent, full content management, and a monthly strategy call —
              for businesses that want the complete picture.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 bg-(--color-hero-bg) py-14">
        <div className="mx-auto max-w-sm px-6 text-center">
          <CheckoutButton slug="stay-found" label="Start Stay Found →" />
          <p className="mt-4 text-xs text-hero-subtext/50">
            $99/mo · $49 one-time setup fee · cancel anytime
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
