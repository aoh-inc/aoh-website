import type { Metadata } from "next";
import { HeroEmailForm } from "@/components/hero/HeroEmailForm";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { SocialProof } from "@/components/sections/SocialProof";
import { FAQ } from "@/components/sections/FAQ";
import { faqPageSchema } from "@/lib/faq";

export const metadata: Metadata = {
  title: "AI Services for Local Businesses",
  description:
    "Done-for-you AI services for local businesses: review automation, AI visibility, voice agents, and content. Start with a free audit.",
  alternates: { canonical: "/" },
};

const products = [
  {
    name: "Review Automation",
    description: "Automated review request campaigns via SMS and email. AI-written responses posted in the business owner's voice within minutes of every review.",
    price: "$1/day",
  },
  {
    name: "AI Visibility",
    description: "Gets local businesses recommended by name in ChatGPT, Google AI, and Perplexity when customers ask for a recommendation.",
    price: "$3/day",
  },
  {
    name: "Relay",
    description: "A multilingual AI receptionist that answers calls, books appointments, and handles customer inquiries 24/7 in 27+ languages.",
    price: "Custom",
  },
  {
    name: "Studio",
    description: "Done-for-you AI content production for local businesses — social media, images, carousels, and campaigns.",
    price: "Custom",
  },
  {
    name: "Hub360ai Dashboard",
    description: "Custom-built AI agents for local business owners. Examples include the Business Owner Briefing — a daily AI digest of business performance.",
    price: "Custom",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <main className="flex flex-1 flex-col">
        <HeroEmailForm />

        <RevenueCalculator />

        <section className="pb-20 md:pb-28 bg-[var(--color-bg-page)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-body)] mb-4">
                What You Get
              </h2>
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                Everything you need to dominate local search and AI recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-[var(--color-text-body)] mb-2">
                      {product.name}
                    </h3>
                    <div className="text-sm font-medium text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-1 rounded-full inline-block">
                      {product.price}
                    </div>
                  </div>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">
                    {product.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SocialProof />

        <FAQ />
      </main>
    </>
  );
}
