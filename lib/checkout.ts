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
    price: "$99",
    cadence: "/month",
    setup: "No setup fee",
    summary:
      "Start collecting reviews on autopilot. The lowest-friction way to grow your Google presence.",
    whatYouGet: [
      "Automated email review requests after every job",
      "One-time Google Business Profile audit + fix",
      "You reply to reviews yourself (upgrade for replies in your voice)",
      "Monthly digest email — what was sent, what came in",
      "Cancel anytime · no contract",
    ],
    ctaUrl: "https://pay.aioutsourcehub.com/review-automation-plan",
    ctaKind: "subscribe",
  },
  {
    slug: "ai-visibility",
    name: "AI Visibility",
    price: "$299",
    cadence: "/month",
    setup: "$199 setup",
    summary:
      "Be found everywhere — Google reviews, AI search engines, and across the platforms your customers actually use.",
    whatYouGet: [
      "Everything in Review Automation",
      "Replies drafted in your voice (you approve)",
      "SMS review requests (3× higher response than email)",
      "Monthly 15-min review call + ongoing GBP work",
      "Cited in ChatGPT, Google AI Overviews, Claude",
      "Structured data + schema markup on your site",
    ],
    ctaUrl: "https://pay.aioutsourcehub.com/ai-visibility-page",
    ctaKind: "subscribe",
  },
  {
    slug: "relay",
    name: "Relay — Phone Answering",
    price: "$399",
    cadence: "/month",
    setup: "$299 setup",
    summary:
      "24/7 multilingual phone answering in your company voice. Books calls into your calendar. Never miss another lead.",
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
    slug: "reach",
    name: "Reach — Lead Engine",
    price: "$299",
    cadence: "/month",
    setup: "$299 setup",
    summary:
      "Done-for-you outreach. We find your ideal prospects, write the messages, and book qualified appointments.",
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
];

export function getCheckoutProduct(slug: string): CheckoutProduct | undefined {
  return CHECKOUT_PRODUCTS.find((p) => p.slug === slug);
}
