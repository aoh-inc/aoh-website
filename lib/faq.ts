export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How is GetMeFound different from other agencies?",
    a: "No contract, cancel anytime. We keep the work practical: clean up the Google profile, improve the review path, keep the website and business facts current, and show owners what changed in plain English.",
  },
  {
    q: "How does Stay Found roll out?",
    a: "First we confirm your business details, access, website path, and customer-list process. Then we clean up the profile, launch the hosted site if needed, start approved email review requests, and turn on text review requests after phone-number approval. After launch, you send or upload customers weekly and get a monthly owner recap.",
  },
  {
    q: "Do I need to buy a separate texting tool?",
    a: "No. Stay Found includes the review-text setup and request workflow, so you do not need another tool just to ask happy customers for reviews. Standalone texting tools often start around $24-$39+/mo before usage, and the text-message setup is included instead of being a separate setup project.",
  },
  {
    q: "Why do you use text messages for review requests?",
    a: "Texts get seen quickly. Twilio reports SMS has a 98% open rate, 90% of messages are read within 3 minutes, and a 45% response rate. We still send carefully: contacts must be appropriate to message, opt-out language is included, and nothing risky goes live without approval.",
  },
  {
    q: "Will automated replies sound fake and hurt me with Google?",
    a: "Generic, templated responses can make a business look careless. Stay Found includes AI-drafted replies in your business voice, but they start approval-first. Sensitive reviews always stay human-reviewed.",
  },
  {
    q: "How much of my time does this take?",
    a: "Get Found needs a short onboarding call and access details. After that, the monthly plans are built to be light: send or upload customer lists, approve anything sensitive, and read the recap.",
  },
  {
    q: "How long before I see results?",
    a: "Email review requests can start quickly once setup is approved. Text review requests go live after phone-number approval. Most owners should judge review momentum over the first few weeks and Google visibility over a 60-90 day window.",
  },
  {
    q: "Is AI Visibility just regular SEO with a new name?",
    a: "Google is still the front door for local search, but AI assistants like ChatGPT and Claude also need clean facts to understand who you are, what you do, where you serve, and why customers trust you. AI Visibility keeps that business story consistent.",
  },
  {
    q: "Why do I need to keep paying monthly?",
    a: "Google changes, AI assistants refresh what they know, and customers trust recent proof. A business that stops getting reviews or updating facts can look inactive. Stay Found keeps the profile, review requests, hosted site, and owner reporting moving each month.",
  },
  {
    q: "What if I get a bad review?",
    a: "A professional, calm reply in your voice does more for your reputation than ignoring it. Stay Found drafts suggested responses and flags sensitive issues before anything is posted.",
  },
  {
    q: "You're a new company - why should I trust you?",
    a: "We're new and we know it. That's exactly why we don't lock you into contracts, we show you what we would fix before you pay anything, and we're transparent about our pricing. We have to earn your business - and we plan to.",
  },
  {
    q: "Will this hurt my existing Google Business Profile?",
    a: "No. We work within Google's guidelines - optimizing what's already there, not replacing it. We never delete reviews, alter your category without approval, or make changes that could trigger a suspension. Everything sensitive gets your sign-off first.",
  },
  {
    q: "How do I cancel?",
    a: "Email us anytime. No cancellation fee, no questions beyond what we need to wrap up your account cleanly. Monthly plans stop at the end of your current billing cycle. We don't make cancellation hard.",
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
