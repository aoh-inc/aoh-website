export type CampaignLane = {
  name: string;
  domainRole: string;
  fromEmail: string;
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
    domainRole: "mail.aioutsourcehubs.com",
    fromEmail: "mike@mail.aioutsourcehubs.com",
    offer: "$1 first month, then $49/mo, no setup, cancel anytime. Optional second $1 month only after a happy result and testimonial/case-study fit.",
    cta: "Reply send for details, or book to talk through setup.",
    positioning: "More recent Google reviews without adding work for the team.",
    avoid: "Do not headline $1 for first 2 months.",
    owner: "Sender + Coach",
    status: "QA",
  },
  {
    name: "AI Visibility Snapshot",
    domainRole: "mail.getaioutsourcehub.com",
    fromEmail: "mike@mail.getaioutsourcehub.com",
    offer: "Free AI Visibility snapshot/report after warm reply.",
    cta: "Reply send for the snapshot, or book to review it together.",
    positioning: "Checks whether public trust signals make the business easier for AI/search tools to understand and recommend.",
    avoid: "No $1 pricing, no ranking guarantees, no hype around ChatGPT/Gemini outcomes.",
    owner: "Sender + Profile",
    status: "QA",
  },
  {
    name: "Relay",
    domainRole: "mail.myaioutsourcehub.com",
    fromEmail: "mike@mail.myaioutsourcehub.com",
    offer: "Missed-call estimate/details after warm reply; no per-prospect report URL needed for pilot.",
    cta: "Reply send for the estimate/details.",
    positioning: "Missed calls are hidden revenue leakage for local service businesses.",
    avoid: "Do not imply exact missed-call data unless the prospect supplied it.",
    owner: "Sender + Auditor",
    status: "QA",
  },
];

export const DEDICATED_DOMAIN_WARMUP = [
  "Days 1-3: 10-20 emails/day per dedicated domain.",
  "Days 4-6: 40-50 emails/day per dedicated domain.",
  "Days 7-9: 80-100 emails/day per dedicated domain.",
  "After Day 9: check warmup level, bounces, spam placement, replies, unsubscribes, complaints, and workflow logs before increasing again.",
];

export const MANUAL_LAUNCH_MODEL = [
  "Mike chooses lane, industry, area, and limit.",
  "Assistant runs the dry-run preview and summarizes the prospects.",
  "Mike approves or rejects the list.",
  "Assistant runs the live launcher with --commit --start-drip only after approval.",
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
    branch: "Relay details intent",
    keywordExamples: ["send", "estimate", "missed calls", "calculator"],
    actions: [
      "Add aoh_reply_send and aoh_campaign_relay",
      "Send missed-call calculator/details email",
      "Move opportunity to Warm Leads",
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
  "Reviews, AI Visibility, and Relay are kept as separate sender lanes.",
  "Dedicated domain warmup ladder is followed per domain: 10-20/day for 3 days, 40-50/day for 3 days, 80-100/day for 3 days, then status check after Day 9.",
  "Vercel has CAMPAIGN_REPLY_ROUTER_TOKEN and GHL workflow sends it as x-campaign-reply-router-token.",
  "GHL Customer Replied action POSTs contactId, replyText, and campaignLane to /api/campaign/reply-router.",
  "GHL Campaign Reply Router is built in production location tRbczwt6oJsXK4tjuzOI.",
  "Reply send generates or queues exactly one correct report path.",
  "Reply book sends AOH Talk and does not accidentally generate a report.",
  "Relay reply send sends missed-call details without default report generation.",
  "Unclear replies create a human review task.",
  "STOP/unsubscribe/not interested suppress safely.",
  "Duplicate guard blocks repeat report generation and duplicate delivery emails.",
  "Merge fields, footer, unsubscribe, from domain, and test inbox delivery pass.",
  "First-hour watch owner and emergency pause process are assigned.",
];

export const CAMPAIGN_SOURCE_DOCS = [
  "docs/AOH_REACH_LAUNCH_RUNBOOK.md",
  "docs/AOH_REACH_CAMPAIGN_OFFERS.md",
  "docs/AOH_REACH_CAMPAIGN_COPY.md",
  "docs/AOH_CAMPAIGN_REPLY_ROUTER.md",
  "docs/AOH_REPORT_FLOW_MAP.md",
];
