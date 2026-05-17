import type { Metadata } from "next";
import Link from "next/link";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { pageBreadcrumbs } from "@/lib/seo";

const BOOK_URL = "https://app.gohighlevel.com/widget/booking/talk";

export const metadata: Metadata = {
  title: "Lost-Revenue Calculator",
  description:
    "See exactly how much revenue your current reviews, ranking, and AI search visibility are costing you every month. No card. Takes 30 seconds.",
  alternates: { canonical: "/calculator" },
};

const breadcrumb = pageBreadcrumbs("Calculator", "/calculator");

export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col focus:outline-none"
      >
        <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
          <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Lost-Revenue Calculator
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              See what you&apos;re losing every month.
            </h1>
            <p className="text-base md:text-lg text-[var(--color-hero-subtext)] leading-relaxed max-w-xl mx-auto">
              <span className="font-bold text-white">80% of your future customers find you by searching.</span> If your reviews, ranking, or AI visibility are weak — they pick a competitor. Run the math in 30 seconds.
            </p>
          </div>
        </section>

        <RevenueCalculator />

        {/* Outro CTA — for visitors who skim the calc or want to act */}
        <section className="bg-[var(--color-bg-page)] py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
              Now you've seen the leak
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--color-text-body)] mb-4 leading-tight">
              Let&apos;s fix it for you.
            </h2>
            <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto mb-8">
              Pick your next move. 15 minutes on a call and you&apos;ll know exactly
              what to fix first, in what order, at what cost.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Primary — book a call */}
              <Link
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-6 text-center transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent-text)]/70 mb-2">
                  15 min · free · no pitch
                </p>
                <p className="text-lg md:text-xl font-bold text-[var(--color-accent-text)] mb-1">
                  Book a call →
                </p>
                <p className="text-xs text-[var(--color-accent-text)]/80">
                  We walk you through exactly what to fix first.
                </p>
              </Link>

              {/* Secondary — free AI Visibility report */}
              <Link
                href="/#hero-email"
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-6 text-center transition-all hover:border-[var(--color-accent)] hover:-translate-y-0.5 hover:shadow-lg"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  30 sec · email only
                </p>
                <p className="text-lg md:text-xl font-bold text-[var(--color-text-body)] mb-1">
                  Get free AI Visibility report →
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Live ChatGPT + Claude + Google AI check for your business.
                </p>
              </Link>
            </div>

            <p className="mt-6 text-xs text-[var(--color-text-muted)]">
              Or browse{" "}
              <Link
                href="/pricing"
                className="underline underline-offset-2 hover:text-[var(--color-accent)]"
              >
                services + pricing
              </Link>{" "}
              · all month-to-month, cancel anytime.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
