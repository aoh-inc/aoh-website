import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/ui/PrintButton";
import { ReportTiming } from "@/components/report/ReportTiming";

export const metadata: Metadata = {
  title: "Marketing Report",
  description: "Your personalized marketing report snapshot.",
  alternates: { canonical: "/report/marketing" },
};

export default async function MarketingReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const runId = typeof params.runId === "string" ? params.runId : "";
  const emailRaw = typeof params.email === "string" ? params.email.trim().toLowerCase() : "";
  const businessRaw = typeof params.business === "string" ? params.business.trim() : "";
  const email = emailRaw || "owner@business.com";
  const business = businessRaw || "Your Business";

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Marketing Report
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            Your marketing report is ready.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-hero-subtext)]">
            Business: <span className="text-[var(--color-hero-text)] font-semibold">{business}</span>
          </p>
          <p className="mt-2 max-w-2xl text-lg text-[var(--color-hero-subtext)]">
            Built for: <span className="text-[var(--color-hero-text)] font-semibold">{email}</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrintButton />
            <Link
              href="https://app.gohighlevel.com/widget/booking/talk"
              className="rounded-xl border border-[var(--color-hero-border)] px-5 py-3 text-sm font-semibold text-[var(--color-hero-subtext)] hover:bg-white/5"
            >
              Book a Call
            </Link>
          </div>
          {runId ? <ReportTiming runId={runId} /> : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <h2 className="text-2xl font-bold mb-3">What happens next</h2>
          <ul className="space-y-2 text-[var(--color-text-muted)]">
            <li>• We assemble your report package and ranking details.</li>
            <li>• We publish links as each artifact is ready.</li>
            <li>• You can review first, then book a setup call if you want us to run it for you.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
