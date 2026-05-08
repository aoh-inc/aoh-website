import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Review Automation",
  description:
    "Automated review request campaigns via SMS and email. AI-written responses posted in your business voice within minutes. Starting at $1/day, no contract.",
  alternates: { canonical: "/reviews" },
};

const reviewsService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Review Automation",
  provider: { "@type": "Organization", name: "AI Outsource Hub", url: "https://aioutsourcehub.com" },
  areaServed: "United States",
  description:
    "Automated review request campaigns via SMS and email. AI-written responses posted in the business owner's voice within minutes of every review. Google Business Profile optimization included.",
  offers: {
    "@type": "Offer",
    price: "1.00",
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "1.00",
      priceCurrency: "USD",
      unitCode: "DAY",
    },
  },
};

const breadcrumb = pageBreadcrumbs("Review Automation", "/reviews");

const features = [
  {
    title: "Automated review requests",
    body: "We send review requests to your customers via SMS and email after every service. Your customers tap a link and leave a review. You don't lift a finger.",
  },
  {
    title: "AI responses in your voice",
    body: "Every review gets a response within minutes — written in your specific business voice using your tone profile. Personalized, specific, and indistinguishable from something your best employee would write.",
  },
  {
    title: "Google Business Profile optimization",
    body: "We tune your profile so the reviews you collect actually move you up in local search rankings.",
  },
  {
    title: "Bad reviews handled professionally",
    body: "Bad reviews happen. A calm, professional response in your voice does more for your reputation than ignoring it. We respond to every review, positive or negative.",
  },
];

export default function ReviewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        eyebrow="Review Automation"
        title="Your competitor just got another 5-star review."
        subtitle="Automated review requests and AI responses, done for you. You never touch it. Starting at $1/day, no contract."
      />
      <PageBody>
        <PageSection>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-12">
            Review requests start going out within 48 hours of setup. Most clients see new reviews
            within the first two weeks. Google ranking improvements typically take 60–90 days —
            we'll be honest about that timeline upfront.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection className="border-t border-[var(--color-border)]">
          <h2 className="text-3xl font-bold mb-4">Pricing</h2>
          <p className="text-lg text-[var(--color-text-muted)] mb-8">
            Review Activation starts at <strong className="text-[var(--color-text-body)]">$1/day ($30/month)</strong>.
            Full Reviews Suite is <strong className="text-[var(--color-text-body)]">$97/month</strong>.
            No contract. Cancel anytime.
          </p>
        </PageSection>

        <CtaBlock
          headline="See your free report first."
          subline="We'll audit your current reviews and ranking — and show you exactly what's leaking revenue. No credit card."
        />
      </PageBody>
    </>
  );
}
