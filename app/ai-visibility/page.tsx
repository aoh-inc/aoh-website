import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Visibility",
  description:
    "Get your business recommended by name in ChatGPT, Google AI, and Perplexity. Structured data, AI search audit, and ongoing optimization. Starting at $3/day.",
  alternates: { canonical: "/ai-visibility" },
};

const aiVisibilityService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Visibility Optimization",
  provider: { "@type": "Organization", name: "AI Outsource Hub", url: "https://aioutsourcehub.com" },
  areaServed: "United States",
  description:
    "Gets local businesses recommended by name in ChatGPT, Google AI, and Perplexity when customers ask for a recommendation. Includes structured data implementation, AI search presence audit, and ongoing optimization.",
  offers: {
    "@type": "Offer",
    price: "3.00",
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "3.00",
      priceCurrency: "USD",
      unitCode: "DAY",
    },
  },
};

const breadcrumb = pageBreadcrumbs("AI Visibility", "/ai-visibility");

const points = [
  {
    title: "Different mechanism than SEO",
    body: "Traditional SEO gets you a spot on a list of links. AI visibility gets your business recommended by name when someone asks ChatGPT 'who's the best plumber near me?' — that's a recommendation, not a ranking.",
  },
  {
    title: "Structured data that AI models read",
    body: "JSON-LD schema, NAP consistency, and clean site structure so ChatGPT, Claude, Perplexity, and Google AI Overviews can read, understand, and cite your business.",
  },
  {
    title: "AI search presence audit",
    body: "We test where your business currently surfaces across the major AI tools and benchmark you against the businesses that are showing up. Most local businesses score under 20 out of 100.",
  },
  {
    title: "Ongoing optimization",
    body: "AI search constantly retrains. Your monthly fee keeps you active, monitored, and recommended as the landscape keeps evolving. It's insurance, not just maintenance.",
  },
];

export default function AiVisibilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiVisibilityService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        eyebrow="AI Visibility"
        title="Your next customer asked ChatGPT. You weren't there."
        subtitle="We get your business recommended by ChatGPT, Google AI, and Perplexity — before your competitors do. Starting at $3/day."
      />
      <PageBody>
        <PageSection>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Customers have moved on from Google.</h2>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-12">
            25% of searches have already shifted to AI tools. When customers ask for a
            recommendation, your business needs to be the answer. Most local businesses are
            completely invisible in AI search — we fix that.
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
          headline="Find out if you're invisible."
          subline="Free AI Visibility audit shows where you stand across ChatGPT, Google AI, and Perplexity."
          buttonText="Get My Free AI Visibility Score"
        />
      </PageBody>
    </>
  );
}
