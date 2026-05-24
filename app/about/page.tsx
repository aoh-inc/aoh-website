import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "GetMeFound helps local businesses become easier for Google, Maps, AI search, and near-me customers to trust and recommend.",
  alternates: { canonical: "/about" },
};

const breadcrumb = pageBreadcrumbs("About", "/about");

const principles = [
  {
    title: "Search is becoming answers",
    body: "Customers are still searching, but more of the decision now happens inside maps, AI summaries, review snippets, and recommendation-style answers.",
  },
  {
    title: "Local proof compounds",
    body: "Reviews, accurate listings, clear service pages, schema, photos, and consistent business facts give search systems more reasons to trust you.",
  },
  {
    title: "Owners need outcomes",
    body: "Most local operators do not need another dashboard. They need the visibility work handled and explained in plain English.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHeader
        eyebrow="About"
        title="Built for the businesses people search for nearby."
        subtitle="GetMeFound helps local businesses show up, look trustworthy, and become easier for search engines and AI assistants to recommend."
      />
      <PageBody>
        <PageSection>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div className="space-y-5 text-[var(--color-text-muted)] leading-relaxed">
              <p>
                The old search playbook was simple: rank a website and wait for clicks. That is
                changing. Customers now ask Google, Maps, ChatGPT, Perplexity, and voice assistants
                who to call, who is trusted, and who is nearby.
              </p>
              <p>
                GetMeFound is built around that shift. We work on the pieces that help a business
                become recommendable: review velocity, local listings, business facts, service
                pages, schema, citations, and the trust signals that make a customer feel safe
                choosing you.
              </p>
              <p>
                The company is led by Mike Egidio and is intentionally early, practical, and
                hands-on. The promise is not magic rankings. The promise is disciplined visibility
                work that makes your business easier to find and easier to trust.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--color-bg-dark-card)] p-7 text-[var(--color-hero-text)] ring-1 ring-[var(--color-hero-border)]">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Focus
              </p>
              <h2 className="mb-4 text-2xl font-bold">AI search visibility for local businesses.</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-[var(--color-hero-text)]">Primary offer</dt>
                  <dd className="mt-1 text-[var(--color-hero-subtext)]">Get Found, Stay Found, Review Power, and AI Ready</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-hero-text)]">Best fit</dt>
                  <dd className="mt-1 text-[var(--color-hero-subtext)]">Local service businesses that need more qualified customers</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-hero-text)]">Operating style</dt>
                  <dd className="mt-1 text-[var(--color-hero-subtext)]">Done-for-you setup, plain-English reporting, month-to-month</dd>
                </div>
              </dl>
            </div>
          </div>
        </PageSection>

        <PageSection>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {principles.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"
              >
                <h2 className="mb-3 text-xl font-bold text-[var(--color-text-body)]">{item.title}</h2>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{item.body}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <CtaBlock
          headline="Want to know where you stand?"
          subline="Start with a visibility audit. We will show what search and AI systems can trust today, and what needs to be fixed next."
          buttonText="Request an Audit"
          buttonHref="/contact"
        />
      </PageBody>
    </>
  );
}
