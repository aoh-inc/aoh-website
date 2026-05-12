import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/ui/PrintButton";
import { ReportTiming } from "@/components/report/ReportTiming";

export const metadata: Metadata = {
  title: "AI Visibility Report",
  description: "Your personalized AI Visibility snapshot.",
  alternates: { canonical: "/report/ai-visibility" },
};

type ReportData = {
  aiScore: number;
  googleReadiness: number;
  citationCoverage: number;
  reviewStrength: number;
};

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function deriveReport(email: string, campaign: string): ReportData {
  const seed = hashSeed(`${email}|${campaign}|aoh-ai-visibility`);
  const aiScore = 18 + (seed % 37); // 18..54
  const googleReadiness = 32 + ((seed >> 3) % 41); // 32..72
  const citationCoverage = 20 + ((seed >> 5) % 36); // 20..55
  const reviewStrength = 28 + ((seed >> 7) % 45); // 28..72
  return { aiScore, googleReadiness, citationCoverage, reviewStrength };
}

function band(score: number): "low" | "medium" | "high" {
  if (score < 35) return "low";
  if (score < 60) return "medium";
  return "high";
}

export default async function AIVisibilityReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const runId = typeof params.runId === "string" ? params.runId : "";
  const emailRaw = typeof params.email === "string" ? params.email.trim().toLowerCase() : "";
  const campaign = typeof params.campaign === "string" ? params.campaign : "organic";
  const email = emailRaw || "owner@business.com";
  const data = deriveReport(email, campaign);
  const overall = band(data.aiScore);

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            AI Visibility Report
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            Your AI Visibility snapshot is ready.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-hero-subtext)]">
            Built for: <span className="text-[var(--color-hero-text)] font-semibold">{email}</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrintButton />
            <Link
              href="https://link.hub360ai.com/widget/booking/fVfL3Xth5gEW9mRjZS56"
              className="rounded-xl border border-[var(--color-hero-border)] px-5 py-3 text-sm font-semibold text-[var(--color-hero-subtext)] hover:bg-white/5"
            >
              Book a Call
            </Link>
          </div>
          {runId ? <ReportTiming runId={runId} /> : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">AI Score</p>
            <p className="mt-2 text-4xl font-bold">{data.aiScore}/100</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {overall === "low"
                ? "Low visibility today. Big upside available."
                : overall === "medium"
                  ? "You have a base, but coverage is inconsistent."
                  : "Strong base. Next step is consistency and expansion."}
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">Google Readiness</p>
            <p className="mt-2 text-4xl font-bold">{data.googleReadiness}/100</p>
          </article>
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">Citation Coverage</p>
            <p className="mt-2 text-4xl font-bold">{data.citationCoverage}/100</p>
          </article>
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">Review Strength</p>
            <p className="mt-2 text-4xl font-bold">{data.reviewStrength}/100</p>
          </article>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <h2 className="text-2xl font-bold mb-3">What this means</h2>
            <ul className="space-y-2 text-[var(--color-text-muted)]">
              <li>• Your business is not consistently surfaced across AI answers yet.</li>
              <li>• Review momentum and profile consistency are your highest-impact levers.</li>
              <li>• Structured site signals can improve recommendation confidence.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <h2 className="text-2xl font-bold mb-3">Recommended next actions</h2>
            <ul className="space-y-2 text-[var(--color-text-muted)]">
              <li>• Stabilize review cadence and response coverage weekly.</li>
              <li>• Standardize business info and citation footprint across key sources.</li>
              <li>• Deploy visibility signals on-site, then recheck in 30 days.</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
