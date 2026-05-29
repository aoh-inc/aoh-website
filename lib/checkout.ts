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
      "Get Found — complete AI-visibility setup, delivered in 48 hours. We map, align, and amplify every signal Google AI, ChatGPT, and Claude check before recommending a business.",
    whatYouGet: [
      "We fix your Google listing — hours, services, photos, everything",
      "We make your website match your Google listing exactly",
      "Your first review requests go out to past customers automatically",
      "Before/after snapshot showing how Google and AI see your business",
    ],
    stripePriceId: "price_1TakBqLyThSzGsL4l30CMrei",
    stripeMode: "payment",
  },
  {
    slug: "stay-found",
    name: "Stay Found",
    price: "$99",
    cadence: "/month",
    setup: "$49 one-time setup fee",
    summary:
      "Stay Found — monthly Signal Stack maintenance. We keep your AI visibility signals fresh so you don't quietly fall out of Google AI, ChatGPT, and Gemini recommendations.",
    whatYouGet: [
      "Everything in Get Found - free",
      "Weekly client list upload path for review requests",
      "Text and email review request campaigns after phone-number approval",
      "Text-message setup handled by our team — no extra tool needed",
      "AI response drafts in the client's brand voice",
      "Negative review alert and suggested response target within 4 business hours",
      "One weekly Google Business Profile post",
      "Review monitoring across platforms where available",
      "Monthly report showing your reviews, directory listings, and visibility progress",
    ],
    stripePriceId: "price_1Tb0VDLyThSzGsL4BAWAI6sD",
    setupPriceId: "price_1TbSBfLyThSzGsL40nKPg4cB",
    stripeMode: "subscription",
  },
  {
    slug: "always-ready",
    name: "Always Ready",
    price: "$299",
    cadence: "/month",
    setup: "No contract",
    summary:
      "Full-service reputation, visibility, content, and AI voice-readiness management.",
    whatYouGet: [
      "Everything in Stay Found",
      "AI voice agent trained on services, pricing, hours, and FAQs",
      "Voice/phone readiness for AI and customer inquiries",
      "Full Google profile content management and local content planning",
      "Monthly 30-minute strategy call and AI answer visibility check",
    ],
    stripePriceId: "price_1TakBsLyThSzGsL409oKbEZG",
    stripeMode: "subscription",
  },
];

export function getCheckoutProduct(slug: string): CheckoutProduct | undefined {
  return CHECKOUT_PRODUCTS.find((p) => p.slug === slug);
}
