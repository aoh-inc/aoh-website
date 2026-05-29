import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service — GetMeFound" },
  description:
    "Plain-English terms of service for GetMeFound plans, billing, access, ownership, and cancellation.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageBody>
      <PageSection className="border-b border-[var(--color-border)] bg-[var(--color-bg-page)]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Legal
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text-body)] md:text-6xl">
              Terms of Service
            </h1>
            <div className="space-y-1 text-sm text-[var(--color-text-muted)]">
              {/* CONFIRM: verify "June 1, 2026" is the correct effective date */}
              <p>Last updated: June 1, 2026</p>
              <p>Effective date: June 1, 2026</p>
              {/* CONFIRM: state — currently set to Connecticut. Verify this is correct governing law. */}
              <p>Governing law: State of Connecticut</p>
            </div>
          </div>

          <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            These terms explain what GetMeFound provides, what we need from clients, how billing
            works, and what we do not promise. They are written in plain English.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 md:p-10">

          <TermsSection title="Who we are">
            {/* CONFIRM: legal entity name — currently "AI Outsource Hub LLC." Verify the exact registered name and confirm "doing business as GetMeFound" is accurate. */}
            <p>
              GetMeFound is operated by AI Outsource Hub LLC, doing business as GetMeFound. Contact:{" "}
              <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                support@getmefound.ai
              </a>
              .
            </p>
          </TermsSection>

          <TermsSection title="The services">
            <p>GetMeFound offers three AI-visibility services for local businesses:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Get Found ($149, one-time):</strong> A complete AI-visibility setup, run
                through the Visibility Engine and delivered within 48 hours of receiving the access
                and information we need. Covers your Google listing, business facts across the web,
                and your first review path.
              </li>
              <li>
                <strong>Stay Found ($99/month + $49 one-time setup fee):</strong> Monthly
                AI-visibility upkeep. Month-to-month. Cancel anytime, no notice required, no
                cancellation fee. Cancellation takes effect at the end of the current billing period.
              </li>
              <li>
                <strong>Always Ready ($299/month):</strong> Full AI-visibility management plus voice
                readiness. Month-to-month. Cancel anytime, no notice required, no cancellation fee.
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="What the client provides">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Access to the client&apos;s Google Business Profile as a <strong>manager</strong>.
                The client remains the owner at all times and can revoke access whenever they choose.
              </li>
              <li>
                Access to the website backend during setup work when needed, using revocable user
                access where available.
              </li>
              <li>
                Accurate business information — name, address, hours, services, and contact details.
                Providing inaccurate information may affect what we can deliver.
              </li>
              <li>
                GetMeFound does not need client passwords for the client hub; client hubs use magic
                links.
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="Access and security">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                We never share client access credentials, login information, or account access
                outside our team.
              </li>
              <li>
                The client can revoke our access at any time without affecting their accounts or
                data.
              </li>
              <li>
                We use manager-level access only and do not take ownership of any client asset.
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="What GetMeFound delivers">
            <ul className="list-disc space-y-2 pl-6">
              <li>All fixes described on the service page for the purchased plan.</li>
              <li>
                Before/after visibility report within 48 hours for Get Found (once access and
                information are received).
              </li>
              <li>Monthly deliverables as described for Stay Found and Always Ready.</li>
              <li>
                If anything listed in your report is not done correctly, GetMeFound will fix it at
                no charge. See the{" "}
                <Link href="/guarantee" className="text-[var(--color-accent)] hover:underline">
                  Refund &amp; Guarantee Policy
                </Link>
                {" "}for the full policy.
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="What GetMeFound does not guarantee">
            <p>
              AI systems and search results are controlled by third parties — Google, ChatGPT,
              Claude, Gemini, and others — that make their own decisions independently of
              GetMeFound. We cannot control, predict, or guarantee:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Specific search positions or AI recommendations.</li>
              <li>A specific number of reviews.</li>
              <li>Specific revenue or lead outcomes.</li>
              <li>How quickly AI systems update their answers after changes are made.</li>
            </ul>
            <p className="mt-3">
              What we guarantee is the work itself. See the{" "}
              <Link href="/guarantee" className="text-[var(--color-accent)] hover:underline">
                Refund &amp; Guarantee Policy
              </Link>
              .
            </p>
          </TermsSection>

          <TermsSection title="Billing and payments">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Payments are processed by Stripe. GetMeFound does not see or store your card number
                or full payment details. Stripe&apos;s own terms and privacy policy apply to payment
                processing.
              </li>
              <li>
                Monthly plans bill on the same day each month. Cancellation takes effect at the end
                of the current paid period — you keep access through the period you paid for.
              </li>
              <li>
                Refunds are governed by the{" "}
                <Link href="/guarantee" className="text-[var(--color-accent)] hover:underline">
                  Refund &amp; Guarantee Policy
                </Link>
                .
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="Ownership">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                The client owns their Google listing, website, reviews, and all business data.
                GetMeFound claims no ownership of any client asset.
              </li>
              <li>
                Upon cancellation, the client retains everything. Nothing is held back.
              </li>
              <li>
                GetMeFound owns its own materials, method, and branding (including the Visibility
                Engine and Signal Stack frameworks). These may not be reproduced or resold.
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="Acceptable use">
            <ul className="list-disc space-y-2 pl-6">
              <li>The service may not be used for illegal businesses or illegal purposes.</li>
              <li>GetMeFound reserves the right to refuse or cancel service at its discretion.</li>
            </ul>
          </TermsSection>

          <TermsSection title="Disclaimer of warranties">
            <p>
              The service is provided &ldquo;as is.&rdquo; To the extent permitted by law,
              GetMeFound makes no warranty that AI systems will respond in any particular way to the
              work performed, and is not liable for outcomes that depend on third-party platform
              decisions.
            </p>
          </TermsSection>

          <TermsSection title="Limitation of liability">
            <p>
              GetMeFound&apos;s maximum liability for any claim arising from the service is limited
              to the total amount you paid for the service in the 30 days before the claim arose.
              GetMeFound is not liable for indirect, incidental, or consequential damages.
            </p>
          </TermsSection>

          <TermsSection title="Changes to these terms">
            <p>
              We may update these terms. Active clients will receive 30 days&apos; email notice of
              material changes. Continuing to use the service after the effective date means you
              accept the updated terms.
            </p>
          </TermsSection>

          <TermsSection title="Disputes and governing law">
            {/* CONFIRM: governing law — currently set to State of Connecticut. Verify this is correct. */}
            <p>
              Disputes should be raised by email first at{" "}
              <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                support@getmefound.ai
              </a>
              . These terms are governed by the laws of the State of Connecticut.
            </p>
          </TermsSection>

          <TermsSection title="Related policies">
            <p className="text-sm">
              <Link href="/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>
              {" · "}
              <Link href="/guarantee" className="text-[var(--color-accent)] hover:underline">Refund &amp; Guarantee Policy</Link>
            </p>
          </TermsSection>

        </div>
      </PageSection>
    </PageBody>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-[var(--color-text-body)]">{title}</h2>
      <div className="leading-relaxed text-[var(--color-text-muted)]">{children}</div>
    </section>
  );
}
