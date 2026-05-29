import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy — GetMeFound" },
  description:
    "Plain-English privacy policy for GetMeFound forms, payments, analytics, and data storage.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageBody>
      <PageSection className="border-b border-[var(--color-border)] bg-[var(--color-bg-page)]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Legal
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text-body)] md:text-6xl">
              Privacy Policy
            </h1>
            <div className="space-y-1 text-sm text-[var(--color-text-muted)]">
              {/* CONFIRM: verify "June 1, 2026" is the correct effective date */}
              <p>Last updated: June 1, 2026</p>
              <p>Effective date: June 1, 2026</p>
            </div>
          </div>

          <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            GetMeFound keeps privacy simple. We collect only what we need to deliver the service,
            run the free visibility check, and communicate with you. We do not sell your data.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 md:p-10">

          <PolicySection title="What we collect">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Contact and business information</strong> you submit through a form: business
                name, your name, email address, phone number (if provided), city, and website or
                Google Business Profile link.
              </li>
              <li>
                <strong>Publicly available Google Business Profile data</strong> about your business
                — such as listing details, reviews, and profile completeness — collected as part of
                running the free visibility check.
              </li>
              <li>
                <strong>Service delivery information</strong> once you become a client: business
                access details needed to perform the work described in your plan.
              </li>
              <li>
                <strong>Payment information</strong> processed by Stripe. GetMeFound never sees or
                stores your card number or full payment details. Stripe handles all payment data
                under its own privacy policy.
              </li>
              <li>
                <strong>IP address</strong>, stored temporarily for rate limiting to prevent abuse.
                Not used for tracking or profiling.
              </li>
              <li>
                <strong>Anonymous page-view data</strong> via Vercel Analytics and Google Analytics
                4. No personal information is linked to these analytics. See
                Google&apos;s privacy policy at policies.google.com/privacy for details.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="How we use it">
            <ul className="list-disc space-y-2 pl-6">
              <li>To deliver the free visibility check or audit you requested.</li>
              <li>To provide and operate the services you purchased.</li>
              <li>
                To send service-related emails (reports, onboarding, billing, and support).
              </li>
              <li>
                To send marketing and follow-up emails about GetMeFound services. You can
                unsubscribe at any time — see &ldquo;Email marketing&rdquo; below.
              </li>
              <li>We never sell your data to anyone.</li>
              <li>We never share your data with advertisers.</li>
            </ul>
          </PolicySection>

          <PolicySection title="How we store it">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Form submissions and service records are stored in Supabase, our database provider.
                This can include business name, city, email, audit results, and service status.
              </li>
              <li>Stripe stores payment records under Stripe&apos;s own privacy policy.</li>
              <li>
                Cloudflare Turnstile is used on forms for bot protection. It collects minimal
                browser signals. GetMeFound does not store personal data from Turnstile.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Third-party processors (subprocessors)">
            {/*
              CONFIRM: review this list and confirm vendor names before considering it final.
              Add or remove vendors as needed to match actual tools in use.
            */}
            <p>
              We may share data with the following service providers to operate the business.
              Each is bound by its own privacy policy and processes data only as needed to
              perform services for us:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Stripe</strong> — payment processing.
              </li>
              <li>
                <strong>Supabase</strong> — database and data storage.
              </li>
              <li>
                <strong>Vercel</strong> — website hosting and edge delivery.
              </li>
              <li>
                <strong>Cloudflare</strong> — bot protection (Turnstile) on forms.
              </li>
              <li>
                {/* CONFIRM: email sending/marketing platform name — e.g. Resend, SendGrid, Mailchimp */}
                <strong>[CONFIRM: email platform]</strong> — transactional and marketing email
                delivery.
              </li>
              <li>
                {/* CONFIRM: business-data provider name — e.g. Outscraper, DataForSEO, or similar */}
                <strong>[CONFIRM: business-data provider]</strong> — publicly available business
                data used for the free visibility check.
              </li>
              <li>
                {/* CONFIRM: email-verification provider name — e.g. NeverBounce, ZeroBounce */}
                <strong>[CONFIRM: email-verification provider]</strong> — email address
                verification to reduce bounces.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Email marketing">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                By submitting the free visibility check form or purchasing a plan, you may receive
                follow-up emails about GetMeFound services.
              </li>
              <li>
                Every marketing email includes an unsubscribe link. Click it to opt out at any
                time. We honor all opt-outs promptly.
              </li>
              <li>
                GetMeFound follows CAN-SPAM requirements for all commercial email sent to US
                recipients.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Cookies and analytics">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                We use Google Analytics 4 for anonymous page-view analytics. GA4 may set cookies.
                You can opt out via your browser settings or the Google Analytics opt-out browser
                add-on.
              </li>
              <li>
                Vercel Analytics collects anonymous performance data with no personal information.
              </li>
              <li>We do not use advertising cookies or run retargeting campaigns.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Data retention">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Active client records are retained while your account is active and for a reasonable
                period after cancellation for billing and support purposes.
              </li>
              <li>
                Free visibility check leads are retained unless you request deletion.
              </li>
              <li>
                To request deletion of your data, email{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                .
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Your rights">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                You can request access to, correction of, or deletion of your personal data by
                emailing{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                .
              </li>
              <li>
                Unsubscribe from marketing email at any time using the link in any email we send.
              </li>
              <li>
                EU visitors: GDPR rights apply. Contact{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                .
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Children, updates, and contact">
            <ul className="list-disc space-y-2 pl-6">
              <li>This site is not directed at children under 13.</li>
              <li>
                Policy updates will be posted here with a new effective date. Material changes will
                be communicated to active clients.
              </li>
              {/* CONFIRM: legal entity — confirm "AI Outsource Hub LLC" is correct registered name */}
              <li>Company: AI Outsource Hub LLC d/b/a GetMeFound, Connecticut, United States.</li>
              <li>
                Questions:{" "}
                <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@getmefound.ai">
                  support@getmefound.ai
                </a>
                .
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Related policies">
            <p className="text-sm">
              <Link href="/terms" className="text-[var(--color-accent)] hover:underline">Terms of Service</Link>
              {" · "}
              <Link href="/guarantee" className="text-[var(--color-accent)] hover:underline">Refund &amp; Guarantee Policy</Link>
            </p>
          </PolicySection>

        </div>
      </PageSection>
    </PageBody>
  );
}

function PolicySection({
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
