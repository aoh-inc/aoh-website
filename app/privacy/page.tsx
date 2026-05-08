import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AI Outsource Hub collects, uses, and protects your information. We collect only what we need to deliver our services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How AI Outsource Hub collects, uses, and protects your information. Plain language. No dark patterns."
      />
      <PageBody>
        <PageSection>
          <div className="prose-section space-y-10 text-[var(--color-text-body)]">
            <p className="text-sm text-[var(--color-text-muted)]">Last updated: May 7, 2026</p>

            <div>
              <h2 className="text-2xl font-bold mb-3">What we collect</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                When you request a free report, we collect your business email and the URL of
                your business website. When you become a client, we collect the information
                needed to operate the AI tools on your behalf — business name, address, phone
                number, Google Business Profile URL, social account credentials (via OAuth), and
                a few words describing your brand voice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">How we use it</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We use your information to deliver the services you signed up for — sending review
                requests to your customers, posting AI responses on your behalf, optimizing your
                profiles, and producing content for your accounts. We do not sell your data. We do
                not share it with third parties for advertising.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Customer data</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                When AOH sends a review request to your customer, we transmit the customer's name
                and contact info via SMS or email. We retain these records for the duration of
                the engagement and delete them on request or when you cancel.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Cookies and analytics</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We use minimal first-party analytics to understand which pages perform. We do not
                use third-party advertising trackers on aioutsourcehub.com.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Your rights</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                You can request a copy of your data, correct inaccuracies, or have your data
                deleted by emailing{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
                </a>
                . We respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Questions about this policy? Email{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
                </a>
                .
              </p>
            </div>
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}
