import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Relay — AI Voice Agent",
  description:
    "A multilingual AI receptionist that answers calls, books appointments, and handles customer inquiries 24/7 in 27+ languages. Fully managed by AOH.",
  alternates: { canonical: "/relay" },
};

const relayService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Relay — AI Voice Agent",
  provider: { "@type": "Organization", name: "AI Outsource Hub", url: "https://aioutsourcehub.com" },
  areaServed: "United States",
  description:
    "A multilingual AI receptionist that answers calls, books appointments, and handles customer inquiries 24/7 in 27+ languages. Fully managed — AOH handles setup, training, and ongoing operation.",
};

const breadcrumb = pageBreadcrumbs("Relay", "/relay");

const points = [
  {
    title: "Answers every call, 24/7",
    body: "Relay picks up when you can't. No more missed calls during service, after hours, or on weekends.",
  },
  {
    title: "Books appointments",
    body: "Relay qualifies callers, checks your calendar, and books the appointment — then sends the customer a confirmation.",
  },
  {
    title: "27+ languages",
    body: "Relay handles the call in your customer's language. Helpful for service businesses with diverse customer bases.",
  },
  {
    title: "Fully managed",
    body: "AOH handles setup, training, and ongoing operation. You don't configure prompts. You don't manage flows. You answer the calls Relay routes to you.",
  },
];

export default function RelayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(relayService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        eyebrow="Relay"
        title="The AI receptionist that never misses a call."
        subtitle="Multilingual AI voice agent that answers calls, qualifies leads, and books appointments 24/7. Fully managed."
      />
      <PageBody>
        <PageSection>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Relay does</h2>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-12">
            Most local businesses lose customers because they can't pick up the phone fast enough.
            Relay takes that off your plate.
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
          headline="Talk to us about Relay."
          subline="Relay is a long-term trust product — we work with established clients on custom builds. Get in touch."
          buttonText="Contact Us"
          buttonHref="/contact"
        />
      </PageBody>
    </>
  );
}
