import type { Metadata } from "next";
import Link from "next/link";
import { LogoOnlyNav } from "@/components/LogoOnlyNav";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";

export const metadata: Metadata = {
  title: "Always Ready — Full-Service Visibility & AI Voice Management",
  description:
    "Everything in Stay Found plus an AI voice agent, full content management, and a monthly strategy call. $299/mo. No contract.",
  alternates: { canonical: "/always-ready" },
};

const WHAT_YOU_GET = [
  "Everything in Stay Found",
  "AI voice agent trained on your services, pricing, hours, and FAQs",
  "Voice and phone readiness for AI and customer inquiries",
  "Full Google profile content management and local content planning",
  "Monthly 30-minute strategy call",
  "Monthly AI answer visibility check",
];

const USE_THIS_IF = [
  "You want AI assistants to recommend you by name when people ask for your service.",
  "You need someone handling your entire Google and content presence, not just monitoring it.",
  "You want a monthly strategy call to know exactly what's moving and what to fix next.",
];

export default function AlwaysReadyPage() {
  return (
    <div className="min-h-screen bg-(--color-hero-bg) text-hero-text">
      <LogoOnlyNav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
        <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
          Most complete plan
        </p>
        <h1 className="text-[clamp(2.4rem,7vw,4rem)] font-bold leading-[1.05] tracking-tight">
          Always visible.{" "}
          <span className="text-accent">Always recommended.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-hero-subtext/80 md:text-xl max-w-xl mx-auto">
          Full-service visibility management — Google, reviews, AI voice, and content — so your business is the answer every time someone asks.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="text-4xl font-bold">$299<span className="text-2xl text-hero-subtext/60">/mo</span></div>
          <div className="text-hero-subtext/70 text-sm leading-snug text-left">
            cancel anytime<br />
            <span className="text-hero-subtext/50">no contract · no setup fee</span>
          </div>
        </div>

        <div className="mt-8 max-w-sm mx-auto">
          <CheckoutButton slug="always-ready" label="Get Always Ready →" />
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
              <strong className="text-hero-text">Not sure this is the right level?</strong>{" "}
              Start with{" "}
              <Link href="/checkout/get-found-refresh" className="text-accent underline underline-offset-2 hover:no-underline">
                Get Found ($149 one-time)
              </Link>{" "}
              to fix the basics first, then upgrade when you&apos;re ready.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 bg-(--color-hero-bg) py-14">
        <div className="mx-auto max-w-sm px-6 text-center">
          <CheckoutButton slug="always-ready" label="Get Always Ready →" />
          <p className="mt-4 text-xs text-hero-subtext/50">
            $299/mo · no setup fee · cancel anytime
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
