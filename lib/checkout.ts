export type CheckoutProduct = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  setup: string;
  summary: string;
  whatYouGet: string[];
  stripePriceId: string;
  setupPriceId?: string;
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
    price: "$99",
    cadence: "/month",
    setup: "$199 setup",
    summary:
      "Monthly visibility upkeep with review requests, AI reply drafts, and free website hosting so the business does not go stale after the first setup.",
    whatYouGet: [
      "Everything in Get Found - free",
      "Weekly client list upload path for review requests",
      "SMS and email review request campaigns after A2P readiness",
      "A2P setup handled by GMF when SMS is approved",
      "AI response drafts in the client's brand voice",
      "Negative review alert and suggested response target within 4 business hours",
      "One weekly Google Business Profile post",
      "Free website hosting for your GMF-managed site",
      "Review monitoring across platforms where available",
      "Monthly sentiment, citation, and visibility report",
    ],
    stripePriceId: "price_1Tb0VDLyThSzGsL4BAWAI6sD",
    setupPriceId: "price_1Tb109LyThSzGsL4V9x9Iy0E",
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
      "Everything in Stay Found",
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
