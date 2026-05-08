import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { FAQ_ITEMS, faqPageSchema } from "@/lib/faq";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about AI Outsource Hub — pricing, contracts, results timelines, AI visibility vs SEO, and how the service actually works.",
  alternates: { canonical: "/faq" },
};

const breadcrumb = pageBreadcrumbs("FAQ", "/faq");

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered."
        subtitle="Pricing, results, contracts, and how AOH actually works. If your question isn't here, email support@aioutsourcehub.com."
      />
      <PageBody>
        <PageSection>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.q}
                className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8"
              >
                <h2 className="text-xl font-semibold mb-3">{item.q}</h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <CtaBlock
          headline="Still have questions?"
          subline="Email us at support@aioutsourcehub.com — we usually reply the same day."
          buttonText="Contact Us"
          buttonHref="/contact"
        />
      </PageBody>
    </>
  );
}
