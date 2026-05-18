import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/ui/PrintButton";
import { ReportTiming } from "@/components/report/ReportTiming";
import {
  buildAIVisibilityReport,
  type AIVisibilityReport,
  type ScoredBusiness,
  type SchemaResult,
} from "@/lib/ai-visibility";

export const metadata: Metadata = {
  title: "AI Visibility Report",
  description: "See how AI systems find — and recommend — your business.",
  alternates: { canonical: "/report/ai-visibility" },
  robots: { index: false, follow: false },
};

const BOOK_URL = "https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY";

function buildFallbackReport(businessName: string, city: string): AIVisibilityReport {
  const prospect: ScoredBusiness = {
    name: businessName || "Your Business",
    rating: 0,
    reviewCount: 0,
    website: null,
    phone: null,
    googleMapsUrl: null,
    city: city || "your area",
    category: "local business",
    schema: {
      hasLocalBusiness: false,
      hasRating: false,
      hasHours: false,
      hasSameAs: false,
      hasFAQ: false,
      hasNAP: false,
      score: 15,
      scanFailed: true,
    },
    scores: {
      overall: 28,
      reviewStrength: 20,
      profileComplete: 25,
      aiReadable: 15,
    },
  };

  return {
    prospect,
    competitor: null,
    scenario: "no_competitor",
    verdicts: [
      "We could not fully match this business in public data yet.",
      "This report uses baseline estimates until we complete a direct profile scan.",
      "Book a call and we will verify the business listing and deliver the full scored version.",
    ],
    city: city || "your area",
    category: "local business",
  };
}

function scoreColor(n: number) {
  if (n >= 60) return "text-emerald-400";
  if (n >= 35) return "text-amber-400";
  return "text-red-400";
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
        {label}
      </p>
      <p className={`text-4xl font-bold leading-none ${scoreColor(score)}`}>
        {score}
        <span className="text-base font-normal text-[var(--color-text-muted)]">/100</span>
      </p>
    </article>
  );
}

const CHECK_LABELS: { key: keyof SchemaResult; label: string }[] = [
  { key: "hasLocalBusiness", label: "Knows what type of business you are" },
  { key: "hasRating",        label: "Can find your star rating" },
  { key: "hasHours",         label: "Knows your hours" },
  { key: "hasSameAs",        label: "Can connect your site to your Google listing" },
  { key: "hasFAQ",           label: "Your site answers questions people ask AI" },
  { key: "hasNAP",           label: "Has your phone and address on your site" },
];

function CompareTable({
  prospect,
  competitor,
}: {
  prospect: ScoredBusiness;
  competitor: ScoredBusiness | null;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="py-3 pr-4 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              What AI systems check
            </th>
            <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)] max-w-[120px]">
              {prospect.name.length > 22
                ? prospect.name.slice(0, 20) + "…"
                : prospect.name}
            </th>
            {competitor && (
              <th className="py-3 pl-4 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)] max-w-[120px]">
                {competitor.name.length > 22
                  ? competitor.name.slice(0, 20) + "…"
                  : competitor.name}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {CHECK_LABELS.map(({ key, label }) => {
            const prospectVal = prospect.schema[key] as boolean;
            const competitorVal = competitor
              ? (competitor.schema[key] as boolean)
              : null;
            const isWarning =
              !prospectVal && (competitorVal === true || competitorVal === null);
            return (
              <tr
                key={key}
                className={`border-b border-[var(--color-border)]/40 last:border-0 ${isWarning ? "bg-red-500/5" : ""}`}
              >
                <td className="py-3 pr-4 text-[var(--color-text-body)]">
                  {label}
                </td>
                <td className="py-3 px-4 text-center text-base">
                  {prospectVal ? "✅" : "❌"}
                </td>
                {competitor && (
                  <td className="py-3 pl-4 text-center text-base">
                    {competitorVal ? "✅" : "❌"}
                  </td>
                )}
              </tr>
            );
          })}
          {/* Review row */}
          <tr className="border-t-2 border-[var(--color-border)]">
            <td className="py-3 pr-4 text-[var(--color-text-body)]">
              Google reviews
            </td>
            <td className="py-3 px-4 text-center font-mono text-sm font-bold text-[var(--color-text-body)]">
              {prospect.reviewCount > 0
                ? `${prospect.reviewCount} ★${prospect.rating.toFixed(1)}`
                : "—"}
            </td>
            {competitor && (
              <td className="py-3 pl-4 text-center font-mono text-sm font-bold text-[var(--color-text-body)]">
                {competitor.reviewCount > 0
                  ? `${competitor.reviewCount} ★${competitor.rating.toFixed(1)}`
                  : "—"}
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ScenarioBanner({
  scenario,
  competitor,
  city,
  category,
}: {
  scenario: string;
  competitor: ScoredBusiness | null;
  city: string;
  category: string;
}) {
  if (scenario === "nobody_optimized") {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
        <p className="font-semibold text-amber-300 mb-1">
          No one in {city || "your area"} owns this yet.
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          No local {category || "business"} is fully set up for AI search.
          First one to fix this wins the category.
        </p>
      </div>
    );
  }

  if (scenario === "competitor_ahead" && competitor) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4">
        <p className="font-semibold text-red-300 mb-1">
          {competitor.name} is ahead of you.
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          They have {competitor.reviewCount} reviews and stronger AI signals on
          their site. When someone asks ChatGPT or Google AI for a{" "}
          {category || "business"} in {city || "your area"}, they get
          recommended first.
        </p>
      </div>
    );
  }

  if (scenario === "prospect_ahead" && competitor) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
        <p className="font-semibold text-emerald-300 mb-1">
          You&apos;re ahead of {competitor.name} right now.
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Your AI visibility is stronger — but the gap is small. Lock it in
          before they catch up.
        </p>
      </div>
    );
  }

  return null;
}

export default async function AIVisibilityReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const str = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string).trim() : "";

  const runId = str("runId");
  const email = str("email") || "owner@business.com";
  const businessRaw = str("business");
  const cityRaw = str("city");

  let report: AIVisibilityReport | null = null;
  if (businessRaw) {
    report = await buildAIVisibilityReport(businessRaw, cityRaw || undefined);
    if (!report) {
      report = buildFallbackReport(businessRaw, cityRaw || "");
    }
  }

  const business = report?.prospect.name || businessRaw || "Your Business";

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-body)]"
    >
      {/* Header */}
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            AI Visibility Report
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight mb-4">
            {report
              ? `Here's how AI systems see ${business}.`
              : "Your AI Visibility Report"}
          </h1>
          <p className="text-base text-[var(--color-hero-subtext)]">
            Business:{" "}
            <span className="font-semibold text-[var(--color-hero-text)]">
              {business}
            </span>
            {email !== "owner@business.com" && (
              <>
                {" "}
                · Built for:{" "}
                <span className="font-semibold text-[var(--color-hero-text)]">
                  {email}
                </span>
              </>
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrintButton />
            <Link
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[var(--color-hero-border)] px-5 py-3 text-sm font-semibold text-[var(--color-hero-subtext)] hover:bg-white/5 transition"
            >
              Book a Call
            </Link>
          </div>
          {runId && <ReportTiming runId={runId} />}
        </div>
      </section>

      {report ? (
        <>
          {/* Score cards */}
          <section className="mx-auto max-w-6xl px-6 pt-10 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreCard
                label="Overall AI Score"
                score={report.prospect.scores.overall}
              />
              <ScoreCard
                label="Review Strength"
                score={report.prospect.scores.reviewStrength}
              />
              <ScoreCard
                label="Profile Complete"
                score={report.prospect.scores.profileComplete}
              />
              <ScoreCard
                label="AI Can Read Your Site"
                score={report.prospect.scores.aiReadable}
              />
            </div>
          </section>

          {/* Scenario banner */}
          {report.scenario !== "no_competitor" && (
            <section className="mx-auto max-w-6xl px-6 py-4">
              <ScenarioBanner
                scenario={report.scenario}
                competitor={report.competitor}
                city={report.city}
                category={report.category}
              />
            </section>
          )}

          {/* Comparison table */}
          <section className="mx-auto max-w-6xl px-6 py-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 className="text-xl font-bold text-[var(--color-text-body)] mb-1">
                {report.competitor
                  ? `You vs ${report.competitor.name}`
                  : "What AI systems check"}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-5">
                These are the signals AI systems read before recommending a
                local business.
              </p>
              <CompareTable
                prospect={report.prospect}
                competitor={report.competitor}
              />
            </div>
          </section>

          {/* Verdicts */}
          <section className="mx-auto max-w-6xl px-6 py-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 className="text-xl font-bold text-[var(--color-text-body)] mb-4">
                What this means for {business}
              </h2>
              <ul className="space-y-3">
                {report.verdicts.map((v, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex-shrink-0 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      {v}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-6xl px-6 py-8 md:py-10">
            <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.06] p-8 text-center">
              <h2 className="text-2xl font-bold text-[var(--color-text-body)] mb-2">
                We fix this in 48 hours.
              </h2>
              <p className="text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
                We set up every AI signal your site is missing, optimize your
                review presence, and monitor it monthly. Cancel anytime.
              </p>
              <Link
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
              >
                Book a free call
                <span aria-hidden="true">→</span>
              </Link>
              <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                No pressure. 15 minutes. We walk you through exactly what to
                fix.
              </p>
            </div>
          </section>
        </>
      ) : (
        /* No business param — show placeholder */
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center">
            <p className="text-[var(--color-text-muted)] mb-4">
              No business found. Return to the homepage to generate your report.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)]"
            >
              Get my free report
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
