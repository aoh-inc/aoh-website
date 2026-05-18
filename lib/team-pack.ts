// Final team profile kit â€” picked motto + matching profile copy across 8 surfaces.
// Motto: "Phones answered. Reviews chased. Leads followed up."
// No "local businesses" framing.
// Banners served from /api/team-banner/[slug].

export type SurfaceKey =
  | "linkedin-company"
  | "facebook"
  | "x"
  | "instagram"
  | "gbp"
  | "mike"
  | "kip"
  | "teri";

export type CopyBlock = {
  label: string;
  text: string;
  charLimit?: number;
};

export type LinkField = {
  field: string;
  value: string;
};

export type Surface = {
  key: SurfaceKey;
  label: string;
  type: "company" | "person";
  bannerSlug: string | null; // matches /api/team-banner/[slug] â€” null = no banner (IG)
  bannerWidth: number | null;
  bannerHeight: number | null;
  // Paste-ready copy blocks
  blocks: CopyBlock[];
  // Specific platform fields (URLs, emails, categories, etc.)
  fields: LinkField[];
  // Hashtags to use on POSTS for this surface (not in bio unless noted)
  hashtags?: { label: string; tags: string };
  notes?: string;
};

// Logo assets â€” single uniform set the team uses everywhere.
// Recommend the navy-background icon for circular profile pics across all platforms.
export type LogoAsset = {
  filename: string;
  url: string;
  dimensions: string;
  bestFor: string;
  recommended?: boolean;
};

export const LOGOS: LogoAsset[] = [
  {
    filename: "aoh-icon-2048-navy.png",
    url: "/logos/aoh-icon-2048-navy.png",
    dimensions: "2048Ã—2048",
    bestFor:
      "Profile picture, all platforms (LinkedIn personal + company, Facebook page, Instagram, X, Google Business Profile). Recommended master file â€” platforms downscale cleanly.",
    recommended: true,
  },
  {
    filename: "aoh-icon-1080-navy.png",
    url: "/logos/aoh-icon-1080-navy.png",
    dimensions: "1080Ã—1080",
    bestFor: "Profile picture fallback â€” Instagram, LinkedIn company, smaller upload limits.",
  },
  {
    filename: "aoh-icon-400-navy.png",
    url: "/logos/aoh-icon-400-navy.png",
    dimensions: "400Ã—400",
    bestFor:
      "Profile picture minimum size. Use only if platform refuses larger. Facebook & X both display at 200Ã—200 from this.",
  },
  {
    filename: "aoh-icon-2048.png",
    url: "/logos/aoh-icon-2048.png",
    dimensions: "2048Ã—2048",
    bestFor:
      "Icon on transparent background â€” for embedding in slides, decks, light-colored docs where you want the icon without the navy background.",
  },
  {
    filename: "aoh-icon-1080.png",
    url: "/logos/aoh-icon-1080.png",
    dimensions: "1080Ã—1080",
    bestFor: "Transparent icon, social-card embeds, OG images.",
  },
  {
    filename: "aoh-wordmark-dark-h480.png",
    url: "/logos/aoh-wordmark-dark-h480.png",
    dimensions: "2190Ã—480",
    bestFor:
      "Full wordmark for dark backgrounds. Email signatures, letterheads on dark stock, slide masters.",
  },
  {
    filename: "aoh-wordmark-light-h480.png",
    url: "/logos/aoh-wordmark-light-h480.png",
    dimensions: "2190Ã—480",
    bestFor:
      "Full wordmark for light backgrounds. Letterheads on cream/white, light slide decks.",
  },
];

// LinkedIn About sections use Unicode bold characters for section headers
// since LinkedIn strips real markdown. These render across browsers/devices.
const B_WHAT_I_DO = "ð—ªð—µð—®ð˜ ð—œ ð—±ð—¼";
const B_HOW = "ð—›ð—¼ð˜„";
const B_WHO_FOR = "ð—ªð—µð—¼ ð—¶ð˜'ð˜€ ð—³ð—¼ð—¿";
const B_HEADLINE = "ð—£ð—µð—¼ð—»ð—²ð˜€ ð—®ð—»ð˜€ð˜„ð—²ð—¿ð—²ð—±. ð—¥ð—²ð˜ƒð—¶ð—²ð˜„ð˜€ ð—°ð—µð—®ð˜€ð—²ð—±. ð—Ÿð—²ð—®ð—±ð˜€ ð—³ð—¼ð—¹ð—¹ð—¼ð˜„ð—²ð—± ð˜‚ð—½.";

export const SURFACES: Surface[] = [
  // ============================================================
  // COMPANY PAGES
  // ============================================================
  {
    key: "linkedin-company",
    label: "LinkedIn â€” Company Page",
    type: "company",
    bannerSlug: "linkedin-company",
    bannerWidth: 1128,
    bannerHeight: 191,
    blocks: [
      {
        label: "Tagline (under company name, ~120 char)",
        text: "Phones answered. Reviews chased. Leads followed up. Done-for-you growth from $49/mo.",
        charLimit: 120,
      },
      {
        label: "About (LinkedIn company About, ~2,000 char limit â€” Unicode bold renders inline)",
        text: `${B_HEADLINE}

That's what AI Outsource Hub runs for you â€” done-for-you growth, no dashboards, no retainer.

${B_WHAT_I_DO}
Four services starting at $49/month:
Â· Review Automation â€” every customer asked, every Google review chased
Â· AI Visibility â€” get cited by ChatGPT, Google AI, Claude
Â· Reach â€” outbound lead generation
Â· Relay â€” 24/7 phone answering for after-hours calls

${B_HOW}
We set it up. We run it. You get daily updates by text and email. No app to download. No dashboard to learn. No 12-month contract.

${B_WHO_FOR}
Service businesses ready to stop losing customers to faster competitors with better follow-up.

Founded by Mike Egidio. US-based. Month-to-month. Cancel anytime.

â†’ aioutsourcehub.com`,
      },
      {
        label: "Specialties (paste into Specialties field, comma-separated)",
        text: "Review Automation, AI Visibility, AI Voice Agents, Content Production, Lead Generation, Google Business Profile Optimization, AI Search Visibility, AI Receptionist, Done-for-you growth, AI Automation, GEO, AEO",
      },
    ],
    fields: [
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "Industry", value: "Marketing Services" },
      { field: "Company size", value: "2â€“10 employees" },
      { field: "Custom button label", value: "Visit website" },
      { field: "Custom button URL", value: "https://aioutsourcehub.com/?utm_source=linkedin&utm_medium=company" },
    ],
    hashtags: {
      label: "Hashtags for posts (not in About)",
      tags: "#DoneForYouAI #AIAutomation #ReviewAutomation #AIReceptionist #AIVisibility #BusinessAutomation #AIforBusiness",
    },
  },
  {
    key: "facebook",
    label: "Facebook â€” Page",
    type: "company",
    bannerSlug: "facebook",
    bannerWidth: 820,
    bannerHeight: 312,
    blocks: [
      {
        label: "Bio / Short description (101 char limit on current Facebook)",
        text: "Phones answered. Reviews chased. Leads followed up. Done-for-you growth from $49/mo. No dashboards.",
        charLimit: 101,
      },
      {
        label: "About (255 char limit on current Facebook â€” hashtags pasted at the end render clickable)",
        text: `AI Outsource Hub runs done-for-you growth services â€” Review Automation, AI Visibility, Reach, and Relay (24/7 phone answering). From $49/mo.

We run it. You don't learn another app.

#DoneForYouAI #AIAutomation #AIReceptionist #AIVisibility`,
        charLimit: 255,
      },
    ],
    fields: [
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "CTA button", value: "Book Now" },
      { field: "CTA button URL", value: "https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY" },
      { field: "Contact email", value: "support@aioutsourcehub.com" },
      { field: "Page category", value: "Marketing Agency" },
    ],
    hashtags: {
      label: "Hashtags for posts",
      tags: "#DoneForYouAI #AIAutomation #ReviewAutomation #AIReceptionist #SmallBusinessAI #AIVisibility",
    },
  },
  {
    key: "x",
    label: "X / Twitter",
    type: "company",
    bannerSlug: "x",
    bannerWidth: 1500,
    bannerHeight: 500,
    blocks: [
      {
        label: "Bio (160 char limit)",
        text: "Phones answered. Reviews chased. Leads followed up. Done-for-you growth from $49/mo. No dashboards. aioutsourcehub.com",
        charLimit: 160,
      },
    ],
    fields: [
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "Location", value: "US â€” service nationwide" },
      { field: "Pinned tweet idea", value: "Lead with the cost-of-dormant-profile post â€” $38,400/year math, runs hot on X" },
    ],
    hashtags: {
      label: "Hashtags for tweets (not in bio â€” X bio hashtags aren't clickable)",
      tags: "#DoneForYouAI #AI #Automation #ReviewAutomation #AIVisibility",
    },
  },
  {
    key: "instagram",
    label: "Instagram (no banner â€” profile pic + bio + native links)",
    type: "company",
    bannerSlug: null,
    bannerWidth: null,
    bannerHeight: null,
    blocks: [
      {
        label: "Bio (150 char limit)",
        text: `ðŸ“ž Phones answered.
â­ Reviews chased.
ðŸ’¬ Leads followed up.
Done-for-you growth Â· from $49/mo`,
        charLimit: 150,
      },
      {
        label: "Profile picture URL (right-click â†’ save)",
        text: "https://aioutsourcehub.com/logos/aoh-icon-400-navy.png",
      },
      {
        label: "Native bio links (Instagram supports 5 since 2023 â€” Edit profile â†’ Links â†’ Add external link)",
        text: `1. Review Automation pricing  â†’  https://aioutsourcehub.com/pricing#review-automation
2. AI Visibility pricing      â†’  https://aioutsourcehub.com/pricing#ai-visibility
3. Reach pricing              â†’  https://aioutsourcehub.com/pricing#reach
4. Relay pricing              â†’  https://aioutsourcehub.com/pricing#relay
5. Lost-Revenue Calculator    â†’  https://aioutsourcehub.com/#calculator`,
      },
    ],
    fields: [
      { field: "Category", value: "Marketing Agency" },
      { field: "Contact email", value: "support@aioutsourcehub.com" },
    ],
    hashtags: {
      label: "Hashtags for IG posts (NOT in bio â€” bio hashtags eat character budget)",
      tags: "#DoneForYouAI #AIAutomation #ReviewAutomation #AIReceptionist #AIVisibility #BusinessAutomation #SmallBusinessOwner #ServiceBusiness #LeadGeneration #AIforBusiness",
    },
  },
  {
    key: "gbp",
    label: "Google Business Profile",
    type: "company",
    bannerSlug: "gbp-cover",
    bannerWidth: 1408,
    bannerHeight: 768,
    blocks: [
      {
        label: "Business description (750 char)",
        text: `Phones answered. Reviews chased. Leads followed up.

AI Outsource Hub runs done-for-you growth services â€” Review Automation, AI Visibility, phone answering services, and outbound lead generation. Four services from $49/month. No dashboards to log into. No retainer. We set it up, we run it, you get daily updates by text and email. Built for service businesses that want hands-off growth automation without becoming experts in it. Free presence audit on our site. Founded by Mike Egidio. US-based. Month-to-month, cancel anytime.`,
        charLimit: 750,
      },
      {
        label: "Logo URL",
        text: "https://aioutsourcehub.com/logos/aoh-icon-1080.png",
      },
    ],
    fields: [
      { field: "Primary category", value: "Marketing Agency" },
      { field: "Additional categories", value: "Internet Marketing Service, Software Company, Business Management Consultant, Telephone Answering Service" },
      { field: "Services to list", value: "Review Automation ($49/mo) Â· AI Visibility ($199/mo) Â· Reach Lead Engine ($299/mo) Â· Relay Phone Answering ($299/mo)" },
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "Appointment URL", value: "https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY" },
    ],
  },

  // ============================================================
  // PERSONAL LINKEDIN â€” MIKE, KIP, TERI
  // ============================================================
  {
    key: "mike",
    label: "Mike Egidio â€” LinkedIn (personal)",
    type: "person",
    bannerSlug: "mike",
    bannerWidth: 1584,
    bannerHeight: 396,
    blocks: [
      {
        label: "Headline (220 char limit)",
        text: "Founder, AI Outsource Hub Â· Phones answered. Reviews chased. Leads followed up. Done-for-you growth from $49/mo Â· We run it, you don't learn it Â· aioutsourcehub.com",
        charLimit: 220,
      },
      {
        label: "About (LinkedIn personal About â€” Unicode bold renders inline)",
        text: `${B_HEADLINE}

That's the whole pitch. I built AI Outsource Hub to run those three things for service-business owners who don't have time to babysit another marketing tool.

${B_WHAT_I_DO}
I run AOH. Four done-for-you growth services from $49/month:
Â· Review Automation
Â· AI Visibility (get cited in ChatGPT, Google AI, Claude)
Â· Reach (outbound lead generation)
Â· Relay (24/7 phone answering)

${B_HOW}
We set it up. We run it. You get daily updates by text and email. No app to download. No dashboard to learn. No retainer. No 12-month contract.

${B_WHO_FOR}
Operators who'd rather be in the truck, the chair, or the operatory than in a marketing dashboard.

Three-person US-based team. Month-to-month. Cancel anytime.

â†’ aioutsourcehub.com`,
      },
      {
        label: "Featured links (pin 3 in the Featured section)",
        text: "1. Free audit â€” https://aioutsourcehub.com\n2. Pricing â€” https://aioutsourcehub.com/pricing\n3. Latest blog post â€” https://aioutsourcehub.com/blog",
      },
    ],
    fields: [
      { field: "Contact email", value: "mike@aioutsourcehub.com" },
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "Open to", value: "Business inquiries Â· Speaking Â· Consulting" },
    ],
    hashtags: {
      label: "Hashtags for posts (LinkedIn personal â€” 3-5 max per post)",
      tags: "#DoneForYouAI #Founder #AIAutomation #AIforBusiness #BusinessAutomation",
    },
  },
  {
    key: "kip",
    label: "Kip Leathers â€” LinkedIn (personal)",
    type: "person",
    bannerSlug: "kip",
    bannerWidth: 1584,
    bannerHeight: 396,
    blocks: [
      {
        label: "Headline (220 char limit)",
        text: "Business Development @ AI Outsource Hub Â· I open the door for service-business owners who want done-for-you growth without the agency BS Â· From $49/mo Â· aioutsourcehub.com",
        charLimit: 220,
      },
      {
        label: "About",
        text: `${B_HEADLINE}

That's what we run at AI Outsource Hub. My job is to find the operators who'd actually benefit â€” and start the conversation in a way that doesn't waste their time.

${B_WHAT_I_DO}
I run business development at AOH. Four done-for-you growth services from $49/month, set up and run by us. No demos. No decks. I walk through your phone log, your reviews, and your lead-response time, then show you the leak.

${B_WHO_FOR}
Service-business owners who've been ignoring "the automation thing" because it felt like too much to figure out. We figure it out for you.

If that's a conversation you want to have, message me.

â†’ aioutsourcehub.com`,
      },
      {
        label: "Featured links (pin 3)",
        text: "1. Free audit â€” https://aioutsourcehub.com\n2. Reviews service â€” https://aioutsourcehub.com/pricing#review-automation\n3. About AOH â€” https://aioutsourcehub.com/about",
      },
    ],
    fields: [
      { field: "Contact email", value: "kip@aioutsourcehub.com" },
      { field: "Website", value: "https://aioutsourcehub.com" },
    ],
    hashtags: {
      label: "Hashtags for posts",
      tags: "#BusinessDevelopment #DoneForYouAI #AIforBusiness #SalesLeadership",
    },
  },
  {
    key: "teri",
    label: "Teri Egidio â€” LinkedIn (personal)",
    type: "person",
    bannerSlug: "teri",
    bannerWidth: 1584,
    bannerHeight: 396,
    blocks: [
      {
        label: "Headline (220 char limit)",
        text: "Sales Manager & Onboarding @ AI Outsource Hub Â· I make sure your first 30 days feel handled, not figured out Â· Done-for-you growth from $49/mo Â· aioutsourcehub.com",
        charLimit: 220,
      },
      {
        label: "About",
        text: `${B_HEADLINE}

That's the promise at AI Outsource Hub. My job is making sure your first 30 days actually feel that way â€” handled, not figured out.

${B_WHAT_I_DO}
I run sales and onboarding at AOH. When you sign with us, I'm the one you talk to. I gather what we need, set up your services, and get your services live â€” usually inside a week. You won't chase me. I'll already have messaged you.

${B_HOW}
Four done-for-you services from $49/month. No 40-page onboarding doc. No "log into our portal and click through these 12 steps." We do the setup. You see the results.

${B_WHO_FOR}
Owners who are tired of being sold tools they never use. We're the opposite of that.

â†’ aioutsourcehub.com`,
      },
      {
        label: "Featured links (pin 3)",
        text: "1. Free audit â€” https://aioutsourcehub.com\n2. Pricing â€” https://aioutsourcehub.com/pricing\n3. How onboarding works â€” https://aioutsourcehub.com/about",
      },
    ],
    fields: [
      { field: "Contact email", value: "teri@aioutsourcehub.com" },
      { field: "Website", value: "https://aioutsourcehub.com" },
    ],
    hashtags: {
      label: "Hashtags for posts",
      tags: "#SalesManager #ClientOnboarding #DoneForYouAI #AIforBusiness #CustomerSuccess",
    },
  },
];
