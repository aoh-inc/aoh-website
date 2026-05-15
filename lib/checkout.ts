export type CheckoutProduct = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  setup: string;
  summary: string;
  whatYouGet: string[];
  ctaUrl: string;
  ctaKind: "subscribe" | "book";
};

export const CHECKOUT_PRODUCTS: CheckoutProduct[] = [
  {
    slug: "review-automation",
    name: "Review Automation",
    price: "$49",
    cadence: "/month",
    setup: "No setup fee",
    summary:
      "Start collecting reviews on autopilot. The lowest-friction way to grow your Google presence.",
    whatYouGet: [
      "Automated email review requests after every job",
      "One-time Google Business Profile audit + fix",
      "You reply to reviews yourself (upgrade for AI replies)",
      "Monthly digest email — what was sent, what came in",
      "Cancel anytime · no contract",
    ],
    ctaUrl: "https://pay.aioutsourcehub.com/checkout-review-automation-plan-page",
    ctaKind: "subscribe",
  },
  {
    slug: "ai-visibility",
    name: "AI Visibility",
    price: "$179",
    cadence: "/month",
    setup: "$199 setup",
    summary:
      "Be found everywhere — Google reviews, AI search engines, and across the platforms your customers actually use.",
    whatYouGet: [
      "Everything in Review Automation",
      "AI-drafted replies in your voice (you approve)",
      "SMS review requests (3× higher response than email)",
      "Monthly 15-min review call + ongoing GBP work",
      "Cited in ChatGPT, Google AI Overviews, Perplexity, Claude",
      "Structured data + schema markup on your site",
    ],
    ctaUrl: "https://pay.aioutsourcehub.com/ai-visibility-page",
    ctaKind: "subscribe",
  },
  {
    slug: "relay",
    name: "Relay — Voice AI",
    price: "$499",
    cadence: "/month",
    setup: "$499 setup",
    summary:
      "24/7 multilingual AI receptionist that books calls into your calendar. Never miss another lead.",
    whatYouGet: [
      "24/7 call answering — no missed leads",
      "27+ languages supported",
      "Appointment booking directly into your calendar",
      "Lead qualification + handoff to your team",
      "750 minutes/month included",
      "Fully managed — we build it, run it, tune it",
    ],
    ctaUrl: "https://pay.aioutsourcehub.com/checkout-relay-plan",
    ctaKind: "subscribe",
  },
  {
    slug: "studio",
    name: "Studio — AI Content",
    price: "$349",
    cadence: "/month",
    setup: "$299 setup",
    summary:
      "Done-for-you content creation and publishing in your brand voice. Branded posts on autopilot.",
    whatYouGet: [
      "Branded posts published 3-5× per week",
      "Custom images generated in your style",
      "Monthly campaign themes aligned with your offers",
      "Brand voice training (one-time onboarding)",
      "Fully managed — we write, design, and post",
    ],
    ctaUrl: "https://pay.aioutsourcehub.com/checkout-studio-plan-page",
    ctaKind: "subscribe",
  },
  {
    slug: "reach",
    name: "Reach — AI Lead Engine",
    price: "$699",
    cadence: "/month",
    setup: "$299 setup",
    summary:
      "Done-for-you cold outreach. We find your ideal prospects, write the messages, and book qualified appointments.",
    whatYouGet: [
      "Curated prospect list built for your niche",
      "Cold email + LinkedIn outreach in your voice",
      "Qualified appointments booked into your calendar",
      "Weekly campaign performance report",
      "Fully managed — we write, send, reply, book",
    ],
    ctaUrl: "https://pay.aioutsourcehub.com/reach-plan",
    ctaKind: "subscribe",
  },
  {
    slug: "whole-stack",
    name: "The Whole Stack",
    price: "$999",
    cadence: "/month",
    setup: "$999 setup",
    summary:
      "Every AOH service combined. One bill, one onboarding, one monthly call. Save over $700/mo vs buying each piece separately.",
    whatYouGet: [
      "AI Visibility (Reviews + AI search) included",
      "Relay Voice AI (1,000 minutes/month)",
      "Reach AI Lead Engine",
      "Studio AI Content",
      "Custom Website Rebuild ($999 build included)",
      "Single bill + priority response queue",
    ],
    ctaUrl: "https://pay.aioutsourcehub.com/full-service",
    ctaKind: "subscribe",
  },
];

export function getCheckoutProduct(slug: string): CheckoutProduct | undefined {
  return CHECKOUT_PRODUCTS.find((p) => p.slug === slug);
}
