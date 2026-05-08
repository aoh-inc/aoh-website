import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI Outsource Hub runs AI on behalf of local businesses. You run your business. We run the AI. No contracts. Free reports before you pay anything.",
  alternates: { canonical: "/about" },
};

const breadcrumb = pageBreadcrumbs("About", "/about");

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHeader
        eyebrow="About AOH"
        title="You run your business. We run the AI."
        subtitle="AI Outsource Hub is a done-for-you AI services agency for local small businesses. We operate the tools so owners never have to learn them."
      />
      <PageBody>
        <PageSection>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why AOH exists</h2>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-6">
            Local business owners are being told they need to "use AI" — but most don't have time
            to learn another tool, configure another dashboard, or babysit another platform. They
            run businesses. They serve customers. They don't have evenings to spend training a
            chatbot.
          </p>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-6">
            AOH is the layer between local businesses and the AI tools that are reshaping how
            customers find them. We operate review automation, AI voice agents, AI visibility,
            content production, and custom AI agents on behalf of our clients. They get the
            outcome. We do the work.
          </p>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
            The way customers find local businesses just changed. Google, Maps, ChatGPT,
            Perplexity, Google AI Overviews — the surface area is exploding. Most local
            businesses are completely invisible across the new channels. We fix that.
          </p>
        </PageSection>

        <PageSection className="border-t border-[var(--color-border)]">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How we work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-3">Free report first, payment later</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Every client gets a free marketing audit and AI visibility check before they pay
                a single dollar. We have to earn your trust before we ask for anything. That's
                not how most agencies work, and we know it.
              </p>
            </div>
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-3">No contracts</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Cancel anytime. We're a new company. We don't lock anyone in — we keep you by
                doing good work, or we don't keep you at all.
              </p>
            </div>
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-3">Honest timelines</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Reviews start within 48 hours. New reviews land within two weeks. Ranking moves
                take 60–90 days. We tell you upfront — no inflated promises.
              </p>
            </div>
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-3">Less than 10 minutes of your time</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Setup takes less than 10 minutes. After that, completely hands-off. You run your
                business. We handle your reputation, your AI presence, and your visibility.
              </p>
            </div>
          </div>
        </PageSection>

        <CtaBlock
          headline="Get your free report."
          subline="No credit card. No contract. We'll show you exactly where you stand and what to fix first."
        />
      </PageBody>
    </>
  );
}
