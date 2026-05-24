export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How is GetMeFound different from other agencies?",
    a: "No contract, cancel anytime. We give you a free report before you pay a single dollar. We have to earn your trust before we ask for anything.",
  },
  {
    q: "Will automated replies sound fake and hurt me with Google?",
    a: "Generic, templated responses can make a business look careless. Review Power includes AI-drafted replies in your business voice, but they start approval-first. Sensitive reviews always stay human-reviewed.",
  },
  {
    q: "How much of my time does this take?",
    a: "Get Found needs a short onboarding call and access details. After that, the monthly plans are built to be light: send or upload customer lists, approve anything risky, and read the recap.",
  },
  {
    q: "How long before I see results?",
    a: "Review requests start going out within 48 hours of setup. Most clients see new reviews within the first two weeks. Google ranking improvements typically take 60-90 days.",
  },
  {
    q: "Is AI Visibility just regular SEO with a new name?",
    a: "Different mechanism entirely. Traditional SEO gets you a spot on Google's list of links. AI Visibility gets your business recommended by name when someone asks ChatGPT who's the best plumber near me - that's a recommendation, not a ranking.",
  },
  {
    q: "Why do I need to keep paying monthly?",
    a: "ChatGPT and Claude constantly retrain. Google's algorithm keeps changing. Review velocity matters - a business that stops getting reviews looks inactive to both customers and algorithms. Your monthly fee keeps you active, monitored, and found.",
  },
  {
    q: "What if I get a bad review?",
    a: "A professional, calm reply in your voice does more for your reputation than ignoring it. Review Power drafts suggested responses and flags sensitive issues before anything is posted.",
  },
  {
    q: "You're a new company - why should I trust you?",
    a: "We're new and we know it. That's exactly why we don't lock you into contracts, we give you a free audit before you pay anything, and we're transparent about our pricing. We have to earn your business - and we plan to.",
  },
];

export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};
