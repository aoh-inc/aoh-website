export type CheckoutProduct = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  setup: string;
  summary: string;
  whatYouGet: string[];
  stripePriceId: string;
  stripeMode: "payment" | "subscription";
};

export const CHECKOUT_PRODUCTS: CheckoutProduct[] = [
  {
    slug: "get-found-refresh",
    name: "Get Found",
    price: "$149",
    cadence: "one-time",
    setup: "No contract",
    summary:
      "A one-time Google-facing setup for local businesses that need to look current, trustworthy, and easy for AI search to understand.",
    whatYouGet: [
      "Full Google Business Profile audit and optimization plan",
      "Name, address, phone, website, category, hours, and services checked",
      "LocalBusiness schema markup plan or handoff",
      "AI search visibility baseline report",
      "First email review request campaign setup after approval",
    ],
    stripePriceId: "price_1TakBqLyThSzGsL4l30CMrei",
    stripeMode: "payment",
  },
  {
    slug: "stay-found",
    name: "Stay Found",
    price: "$59",
    cadence: "/month",
    setup: "No contract",
    summary:
      "Email-only monthly visibility upkeep so the business does not go stale after the first setup.",
    whatYouGet: [
      "Weekly client list upload path for email review requests",
      "Automated email review requests after approval",
      "One weekly Google Business Profile post",
      "Review monitoring across platforms where available",
      "Monthly one-page visibility report",
    ],
    stripePriceId: "price_1TakBrLyThSzGsL4ff5tDb4A",
    stripeMode: "subscription",
  },
  {
    slug: "get-chosen",
    name: "Get Chosen",
    price: "$149",
    cadence: "/month",
    setup: "No contract",
    summary:
      "SMS plus email review requests, approval-first AI reply drafts, alerts, and monthly review proof.",
    whatYouGet: [
      "Everything in Stay Found",
      "SMS and email review request campaigns after A2P readiness",
      "A2P setup handled by GMF when SMS is approved",
      "AI response drafts in the client's brand voice",
      "Monthly sentiment and AI citation check",
    ],
    stripePriceId: "price_1TakBsLyThSzGsL4OgkjOATQ",
    stripeMode: "subscription",
  },
  {
    slug: "always-ready",
    name: "Always Ready",
    price: "$299",
    cadence: "/month",
    setup: "No contract",
    summary:
      "Full-service reputation, visibility, content, and voice-readiness management.",
    whatYouGet: [
      "Everything in Get Chosen",
      "AI voice agent trained on services, pricing, hours, and FAQs",
      "Voice/phone readiness for AI and customer inquiries",
      "Full GBP content management and local content planning",
      "Monthly 30-minute strategy call and AEO check",
    ],
    stripePriceId: "price_1TakBsLyThSzGsL409oKbEZG",
    stripeMode: "subscription",
  },
];

export function getCheckoutProduct(slug: string): CheckoutProduct | undefined {
  return CHECKOUT_PRODUCTS.find((p) => p.slug === slug);
}
