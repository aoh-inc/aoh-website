import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Studio — AI Content",
  description:
    "Done-for-you AI content production for local businesses. Social posts, images, carousels, and campaigns — created and published in your brand voice.",
  alternates: { canonical: "/studio" },
};

const studioService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Studio — AI Content",
  provider: { "@type": "Organization", name: "AI Outsource Hub", url: "https://aioutsourcehub.com" },
  areaServed: "United States",
  description:
    "Done-for-you AI content production for local businesses — social media, images, carousels, and campaigns. AOH creates and publishes content in the business owner's brand voice.",
};

const breadcrumb = pageBreadcrumbs("Studio", "/studio");

const points = [
  {
    title: "Posts in your brand voice",
    body: "Studio learns your tone, your offers, and your customer base — then writes posts that sound like you, not like a generic AI.",
  },
  {
    title: "Images and carousels",
    body: "Branded images, carousels, and short-form visuals tuned to the platforms your customers actually use.",
  },
  {
    title: "Published on autopilot",
    body: "Studio doesn't just create content. It schedules and publishes on the cadence your category needs to stay top-of-feed.",
  },
  {
    title: "Campaigns, not just posts",
    body: "Studio runs themed campaigns — seasonal promos, customer wins, service explainers — that build an actual narrative for your business.",
  },
];

export default function StudioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        eyebrow="Studio"
        title="AI content that sounds like you, not a robot."
        subtitle="Done-for-you posts, images, carousels, and campaigns — published in your brand voice on autopilot."
      />
      <PageBody>
        <PageSection>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Studio does</h2>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-12">
            Most local businesses know they should post more. Almost none have time to do it well.
            Studio takes content off your plate.
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
          headline="Talk to us about Studio."
          subline="Studio is a long-term trust product — we work with established clients on custom builds. Get in touch."
          buttonText="Contact Us"
          buttonHref="/contact"
        />
      </PageBody>
    </>
  );
}
