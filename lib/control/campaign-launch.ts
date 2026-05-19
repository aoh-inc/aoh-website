export type CampaignLane = {
  name: string;
  domainRole: string;
  offer: string;
  cta: string;
  positioning: string;
  avoid: string;
  owner: string;
  status: "Draft" | "QA" | "Ready" | "Live" | "Paused";
};

export type RouterBranch = {
  branch: string;
  keywordExamples: string[];
  actions: string[];
  status: "Needs GHL build" | "Needs QA" | "Blocked" | "Ready";
};

export const CAMPAIGN_LANES: CampaignLane[] = [
  {
    name: "Reviews Special",
    domainRole: "Main reviews sender lane",
    offer: "$1 first month. Optional second $1 month only after a happy result and testimonial/case-study fit.",
    cta: "Reply send for details, or book to talk through setup.",
    positioning: "More recent Google reviews without adding work for the team.",
    avoid: "Do not headline $1 for first 2 months.",
    owner: "Sender + Coach",
    status: "QA",
  },
  {
    name: "AI Visibility Snapshot",
    domainRole: "AI Visibility sender lane",
    offer: "Free AI Visibility snapshot/report after warm reply.",
    cta: "Reply send for the snapshot, or book to review it together.",
    positioning: "Checks whether public trust signals make the business easier for AI/search tools to understand and recommend.",
    avoid: "No $1 pricing, no ranking guarantees, no hype around ChatGPT/Gemini outcomes.",
    owner: "Sender + Profile",
    status: "QA",
  },
  {
    name: "Beta / Testimonial",
    domainRole: "Third warmed domain, tiny test only",
    offer: "Small beta group for honest feedback; testimonial requested only if they are happy.",
    cta: "Reply beta if you want me to include you.",
    positioning: "Human, low-pressure feedback invite for a controlled test group.",
    avoid: "Do not use this as a scale channel.",
    owner: "Sender + Auditor",
    status: "Draft",
  },
];

export const ROUTER_BRANCHES: RouterBranch[] = [
  {
    branch: "Opt-out / not interested",
    keywordExamples: ["unsubscribe", "stop", "remove me", "not interested", "no thanks"],
    actions: [
      "Respect DND/unsubscribe",
      "Add aoh_reply_optout",
      "Move opportunity to Nurture / Closed",
      "Do not generate report or send booking link",
    ],
    status: "Needs GHL build",
  },
  {
    branch: "Duplicate guard",
    keywordExamples: ["repeat send", "existing report URL", "already delivered"],
    actions: [
      "Check report-requested/delivered tags",
      "Check Audit Report URL and PP Heatmap URL",
      "Add aoh_campaign_duplicate_blocked",
      "Do not generate duplicate reports",
    ],
    status: "Needs GHL build",
  },
  {
    branch: "Booking intent",
    keywordExamples: ["book", "calendar", "appointment", "send booking link"],
    actions: [
      "Send AOH Talk booking link",
      "Add aoh_reply_book and aoh_campaign_booking_link_sent",
      "Move opportunity to Warm Leads",
      "Do not generate report unless separately approved",
    ],
    status: "Needs GHL build",
  },
  {
    branch: "Beta intent",
    keywordExamples: ["beta", "include me", "test group", "I will try it"],
    actions: [
      "Add aoh_reply_beta and aoh_campaign_beta",
      "Send beta details only after approved copy",
      "Create Sorter task if details are not approved",
      "Do not generate full report by default",
    ],
    status: "Needs GHL build",
  },
  {
    branch: "Report/details intent",
    keywordExamples: ["send", "send it", "report", "please send it"],
    actions: [
      "Add aoh_reply_send and aoh_campaign_report_requested",
      "Move opportunity to Warm Leads",
      "Add correct report generator tag for lane",
      "Let approved delivery workflow send the report",
    ],
    status: "Needs GHL build",
  },
  {
    branch: "Unclear positive",
    keywordExamples: ["what is this?", "tell me more", "how much?", "maybe"],
    actions: [
      "Add aoh_reply_unclear and aoh_campaign_reply_needs_human",
      "Create Sorter task",
      "Do not generate report",
      "Do not send booking link automatically",
    ],
    status: "Needs GHL build",
  },
];

export const LAUNCH_GATES = [
  "Reviews, AI Visibility, and Beta are kept as separate sender lanes.",
  "Vercel has CAMPAIGN_REPLY_ROUTER_TOKEN and GHL workflow sends it as x-campaign-reply-router-token.",
  "GHL Customer Replied action POSTs contactId, replyText, and campaignLane to /api/campaign/reply-router.",
  "GHL Campaign Reply Router is built in production location tRbczwt6oJsXK4tjuzOI.",
  "Reply send generates or queues exactly one correct report path.",
  "Reply book sends AOH Talk and does not accidentally generate a report.",
  "Reply beta enters the beta/testimonial lane without default report generation.",
  "Unclear replies create a human review task.",
  "STOP/unsubscribe/not interested suppress safely.",
  "Duplicate guard blocks repeat report generation and duplicate delivery emails.",
  "Merge fields, footer, unsubscribe, from domain, and test inbox delivery pass.",
  "First-hour watch owner and emergency pause process are assigned.",
];

export const CAMPAIGN_SOURCE_DOCS = [
  "docs/AOH_REACH_CAMPAIGN_OFFERS.md",
  "docs/AOH_REACH_CAMPAIGN_COPY.md",
  "docs/AOH_CAMPAIGN_REPLY_ROUTER.md",
  "docs/AOH_REPORT_FLOW_MAP.md",
];
