import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: { absolute: "Refund & Guarantee Policy — GetMeFound" },
  description:
    "GetMeFound's plain-English work guarantee and refund policy. If any fix in your report isn't right, we fix it.",
  alternates: { canonical: "/guarantee" },
};

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-[var(--color-text-body)]">{title}</h2>
      <div className="space-y-3 text-[var(--color-text-muted)] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function GuaranteePage() {
  return (
    <PageBody>
      <PageSection className="border-b border-[var(--color-border)] bg-[var(--color-bg-page)]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Legal
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text-body)] md:text-6xl">
            Refund &amp; Guarantee Policy
          </h1>
          <div className="space-y-1 text-sm text-[var(--color-text-muted)]">
            <p>Last updated: June 1, 2026</p>
            <p>Effective date: June 1, 2026</p>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            Plain English. No traps.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 md:p-10">

          <PolicySection title="Our work guarantee">
            <p>
              Every fix listed in your visibility report will be completed correctly and delivered
              within 48 hours of receiving the access and information we need. If any fix in your
              report isn&apos;t done right, we&apos;ll correct it at no additional cost — just tell us.
            </p>
            <p>
              This is our core promise. We stand behind the work, not just the sale.
            </p>
          </PolicySection>

          <PolicySection title="What we don't guarantee">
            <p>
              We don&apos;t promise a specific Google ranking, a specific number of reviews, or that AI
              systems will recommend you by a certain date. No honest provider can — AI systems make
              their own decisions and change constantly.
            </p>
            <p>
              What we guarantee is the work: every signal in your report is fixed, fixed correctly,
              and fixed on time. What happens after that is up to Google and AI — and we&apos;ll help you
              track the difference.
            </p>
          </PolicySection>

          <PolicySection title="Get Found ($149, one-time)">
            <p>
              Because Get Found begins as soon as you provide access and information, refunds work
              like this:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Before we begin work:</strong> full refund, no questions asked.
              </li>
              <li>
                <strong>After work has begun or been delivered:</strong> the work guarantee above
                applies — if something isn&apos;t right, we fix it. Refunds after delivery are
                reviewed case by case.
              </li>
            </ul>
            <p>
              To request a refund or correction, email{" "}
              <a
                href="mailto:support@getmefound.ai"
                className="text-[var(--color-accent)] hover:underline"
              >
                support@getmefound.ai
              </a>{" "}
              within 14 days of purchase.
            </p>
          </PolicySection>

          <PolicySection title="Stay Found and Always Ready (monthly plans)">
            <p>
              No contract. Cancel anytime, no cancellation fee, effective at the end of your current
              billing period. Fees already billed are not prorated or refunded, but you keep access
              through the period you paid for.
            </p>
          </PolicySection>

          <PolicySection title="Questions">
            <p>
              Email{" "}
              <a
                href="mailto:support@getmefound.ai"
                className="text-[var(--color-accent)] hover:underline"
              >
                support@getmefound.ai
              </a>{" "}
              and a real person will respond.
            </p>
            <p className="text-sm">
              See also:{" "}
              <Link href="/terms" className="text-[var(--color-accent)] hover:underline">
                Terms of Service
              </Link>
              {" · "}
              <Link href="/privacy" className="text-[var(--color-accent)] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </PolicySection>
        </div>
      </PageSection>
    </PageBody>
  );
}
