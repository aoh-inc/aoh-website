import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Google Rankings",
  description:
    "Get found in Google Maps and the local pack — where customers actually search. Reviews, profile optimization, and local SEO done for you.",
  alternates: { canonical: "/rankings" },
};

const rankingsService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Google Rankings — Local Pack Optimization",
  provider: { "@type": "Organization", name: "AI Outsource Hub", url: "https://aioutsourcehub.com" },
  areaServed: "United States",
  description:
    "Local SEO and Google Business Profile optimization to get businesses ranking in the Google Maps local pack. Includes review-velocity strategy, profile tuning (categories, services, hours, photos), and ongoing rank monitoring.",
};

const breadcrumb = pageBreadcrumbs("Google Rankings", "/rankings");

const points = [
  {
    title: "Local pack visibility",
    body: "Position #1 in Google Maps captures roughly 100% of the click traffic in its category. Position #8 captures about 11%. Position #20 captures 1%. Where you rank decides whether customers ever see you.",
  },
  {
    title: "Reviews drive rankings",
    body: "Review velocity, count, and rating are core ranking signals for the local pack. A business that stops getting reviews looks inactive to both customers and to Google.",
  },
  {
    title: "Profile tuning",
    body: "We optimize your Google Business Profile — categories, services, hours, photos, posts, and Q&A — so the reviews you collect actually move you up.",
  },
  {
    title: "Honest timelines",
    body: "Review requests start within 48 hours. Most clients see new reviews in the first two weeks. Ranking improvements typically take 60–90 days. We'll be honest about that upfront.",
  },
];

export default function RankingsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rankingsService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        eyebrow="Google Rankings"
        title="Get found where customers are already searching."
        subtitle="Google Maps and the local pack still drive most local discovery. We get you ranking — and keep you there."
      />
      <PageBody>
        <PageSection>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why your ranking matters</h2>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-12">
            Most customers never scroll past the top three local results. If you're not in the top
            three, you're competing for the leftover traffic.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {points.map((p) => (
              <div
                key={p.title}
                className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <CtaBlock
          headline="See where you rank today."
          subline="Free marketing audit shows your current ranking, review gap, and the exact moves that get you to the top."
        />
      </PageBody>
    </>
  );
}
