export type JobCostStatus = "worth-it" | "watch" | "too-early" | "paused";

export type ScheduledJobCost = {
  slug: string;
  name: string;
  service: string;
  owner: string;
  overview: string;
  reachPart?: string;
  salesAgentTasks: {
    title: string;
    description: string;
    owner: string;
  }[];
  internalTasks: {
    title: string;
    description: string;
    owner: string;
  }[];
  agentRoles: {
    agent: string;
    role: string;
  }[];
  cadence: string;
  status: JobCostStatus;
  startedOn: string;
  dailyCostUsd: number;
  totalOverrideUsd?: number;
  bookedCalls: number;
  wonRevenueUsd: number;
  estimatedPipelineValueUsd: number;
  lastRun: string;
  nextRun: string;
  notes: string;
  costBreakdown: {
    label: string;
    amountUsd: number;
  }[];
  checks: string[];
};

export type ReachCommercialItem = {
  title: string;
  description: string;
};

export type ReachFlowStatus = "verified" | "partial" | "manual" | "missing";

export type ReachInternalStep = {
  title: string;
  owner: string;
  status: ReachFlowStatus;
  description: string;
  verification: string;
};

export const REACH_COMMERCIAL_DEMO: ReachCommercialItem[] = [
  {
    title: "Target the right local businesses",
    description:
      "Reach can focus by area, niche, service type, review gap, visibility weakness, competitor pressure, and buying fit instead of blasting a generic list.",
  },
  {
    title: "Send a dynamic report-led email",
    description:
      "The email should plug in client data, local competitors, review/visibility signals, and a CTA that sends the prospect to view their own report.",
  },
  {
    title: "Use reports as the reason to click",
    description:
      "Instead of asking for a meeting immediately, Reach can show the prospect what is slipping first: reviews, map visibility, AI visibility, or missed lead flow.",
  },
  {
    title: "Turn replies into booked calls",
    description:
      "Agents sort replies, handle objections, and move interested prospects to the /talk calendar so the business owner only sees real opportunities.",
  },
  {
    title: "Monitor cost and improve weekly",
    description:
      "The system tracks spend, replies, booked calls, and close signals so campaigns are adjusted before money is wasted.",
  },
];

export const REACH_INTERNAL_FLOW: ReachInternalStep[] = [
  {
    title: "Choose campaign lane: Reviews, AI Visibility, or general Reach",
    owner: "Coach + Manager",
    status: "manual",
    description:
      "Pick the offer, niche, area, and promise before any list is built. This is where Mike decides whether the campaign sells Review Automation, AI Visibility, or Reach itself.",
    verification: "Operationally defined, but not yet turned into a required campaign setup form.",
  },
  {
    title: "Enter area and niche once, then reuse it",
    owner: "Scout",
    status: "partial",
    description:
      "AI Visibility and review campaigns can use the same core inputs: city/area, niche/category, business name, website, and top competitors when known.",
    verification: "AI Visibility page accepts business/city inputs; full campaign intake storage is not built yet.",
  },
  {
    title: "Build a cheap prefilter list first",
    owner: "Scout",
    status: "missing",
    description:
      "To control cost, Scout should not deeply scan every GBP. First filter by obvious signals: niche, location, review count, stale recent reviews, weak profile, no website, or visible competitor gap.",
    verification: "Not automated yet. This is the cost guardrail that needs to be built before scale.",
  },
  {
    title: "Score likely review opportunities",
    owner: "Profile + Scout",
    status: "manual",
    description:
      "Review prospects should be filtered for pain: low review count, old last review, competitor with fresher reviews, unanswered reviews, or weak GBP completeness.",
    verification: "Profile skill pack defines checks; live automated scoring is not built.",
  },
  {
    title: "Score likely AI Visibility opportunities",
    owner: "Profile + Scout",
    status: "partial",
    description:
      "AI Visibility uses similar area/niche inputs, then looks for citation/NAP gaps, weak content, poor profile completeness, stale reviews, and competitor visibility signals.",
    verification: "AI Visibility report page exists and can build/fallback a report; broad prospect discovery is not automated.",
  },
  {
    title: "Enrich selected prospects",
    owner: "Enricher",
    status: "missing",
    description:
      "Only shortlisted prospects should be enriched with owner/contact email, phone, website, business details, and notes for personalization.",
    verification: "No enrichment provider/tool is wired in this repo yet.",
  },
  {
    title: "Prepare GHL prospect records",
    owner: "GHL Expert",
    status: "verified",
    description:
      "AOH Client Template Lab now has the verified Reach fields, AOH custom values, and routing tags needed before workflow planning can continue.",
    verification: "Live GHL audit verified 9 Reach custom fields, 6 AOH custom values, and 4 Reach tags in hVTckp5FcGL9Ja3GvC3R.",
  },
  {
    title: "Website report handoff endpoints",
    owner: "Website + GHL Expert",
    status: "verified",
    description:
      "The site can accept a report request, create a run ID, send payload to the GHL webhook, expose report status, and receive report/heatmap callbacks.",
    verification: "Verified by code/build: /api/report, /api/report/status, and /api/report/callback exist and compile.",
  },
  {
    title: "Create marketing report and heatmap",
    owner: "GHL Expert",
    status: "partial",
    description:
      "The GHL workflow must generate the marketing audit report, run the heatmap where available, store the URLs, and call the website callback when ready.",
    verification: "Website callback/status endpoints are built. GHL report + heatmap workflow is documented but not verified complete.",
  },
  {
    title: "Create AI Visibility report",
    owner: "Profile + GHL Expert",
    status: "partial",
    description:
      "AI Visibility can use the same area/niche/business information, then show profile/review/competitor visibility issues and a baseline explanation.",
    verification: "The AI Visibility report route exists. Direct live profile scan coverage is limited and can fall back to baseline estimates.",
  },
  {
    title: "Generate prospect report link",
    owner: "GHL Expert + Website",
    status: "partial",
    description:
      "Each email needs a report CTA link that opens the right report for that prospect. Token verification exists, but the full token/link generator for campaigns still needs to be finished.",
    verification: "Report submit/status/callback routes are built; campaign link generation is not complete.",
  },
  {
    title: "Draft workflow skeleton",
    owner: "GHL Expert + Auditor",
    status: "partial",
    description:
      "The Reach Campaign - Draft Skeleton workflow exists in Draft mode with a reach_enrolled tag trigger, safety gate, route branches, waits, and note placeholders. It must stay unpublished.",
    verification: "Mike visually confirmed Draft mode, no Send Email nodes, no enrolled contacts, and Auditor approved the draft structure with blockers.",
  },
  {
    title: "Write/send dynamic outreach email",
    owner: "Sender + Coach",
    status: "missing",
    description:
      "The email must merge prospect name, business, area, niche, competitor/report signals, and a CTA to view the report. It should not read like a generic cold email, and Send Email nodes remain blocked.",
    verification: "Draft copy exists from Sender/Coach, but real GHL email nodes are blocked until address, logo, calendar, unsubscribe, and Auditor QA pass.",
  },
  {
    title: "Track opens, clicks, replies, and booked calls",
    owner: "GHL Expert + Sorter",
    status: "partial",
    description:
      "GHL should track report clicks, replies, opportunity stages, booked calls, and no-response follow-up windows.",
    verification: "Mission Control can read some GHL pipeline data; campaign tracking workflow is not fully verified.",
  },
  {
    title: "Sort replies and route hot leads",
    owner: "Sorter",
    status: "manual",
    description:
      "Sorter separates interested, objection, unsubscribe, bad fit, and needs-human replies so hot leads are not buried.",
    verification: "Role is defined; automated reply triage is not yet connected.",
  },
  {
    title: "Book interested prospects on /talk",
    owner: "Booker + Scheduler",
    status: "partial",
    description:
      "Warm replies should be guided to the Discovery Round Robin calendar and tagged by interest so the right pipeline/stage updates.",
    verification: "/talk calendar spec is documented; actual GHL calendar/workflow QA still needs to pass.",
  },
  {
    title: "If they buy, confirm Stripe-to-GHL handoff",
    owner: "GHL Expert + Auditor",
    status: "manual",
    description:
      "After purchase, confirm the correct GHL subaccount exists, the client is tagged, the service pipeline is created, and onboarding begins.",
    verification: "Not verified in this session against a live purchase/subaccount.",
  },
  {
    title: "Client completes intake form",
    owner: "Manager + GHL Expert",
    status: "manual",
    description:
      "The client supplies the facts that cannot be known at purchase time: business name, website, phone, address or service area, logo, owner contact, preferred wording, and customer/POS path when needed.",
    verification: "Intake package still needs final client-facing screenshots/video and completion tracking.",
  },
  {
    title: "Client grants GBP access",
    owner: "Profile + GHL Expert",
    status: "manual",
    description:
      "The client either connects Google Business Profile inside GHL or invites AOH as manager, depending on the service path. Review Automation cannot launch until the correct GBP is connected or access is confirmed.",
    verification: "GBP access path is defined, but live client-zero verification is still needed.",
  },
  {
    title: "Create client subaccount from template snapshot",
    owner: "GHL Expert",
    status: "manual",
    description:
      "GHL Expert loads the approved snapshot from AOH Client Template Lab into the new client subaccount after the required intake/access gates are clear.",
    verification: "Template lab ID hVTckp5FcGL9Ja3GvC3R is tracked; live snapshot load into a new client subaccount has not been verified here.",
  },
  {
    title: "Populate client custom values",
    owner: "GHL Expert",
    status: "partial",
    description:
      "GHL Expert fills the client subaccount values from intake and GBP access: client business name, review link, logo, phone, physical address/service area, website, owner contact, and any service-specific settings.",
    verification: "Template/lab placeholders are being defined; real client values must come from completed intake and access proof.",
  },
  {
    title: "Auditor client launch QA",
    owner: "Auditor",
    status: "manual",
    description:
      "Auditor confirms custom values are populated, GBP/Reputation is connected correctly, links route to the right business, unsubscribe works, test contact messages render cleanly, and no placeholders remain.",
    verification: "QA checklist exists conceptually; live execution still needed before any real client launch.",
  },
  {
    title: "Launch review requests",
    owner: "GHL Expert + Sorter",
    status: "manual",
    description:
      "Sorter cleans/imports the customer list, GHL Expert maps fields and sends a test, then launches the approved review request workflow.",
    verification: "SOP is defined; no live client launch test was verified in this turn.",
  },
  {
    title: "Auditor launch QA",
    owner: "Auditor",
    status: "manual",
    description:
      "Auditor confirms GBP is correct, reviews sync into Reputation, custom values are populated, messages work, links are correct, and blockers are assigned.",
    verification: "QA checklist exists; live execution still needed.",
  },
  {
    title: "Client upkeep after completion",
    owner: "Manager + Auditor + Profile + GHL Expert",
    status: "manual",
    description:
      "After launch, agents monitor review velocity, workflow errors, unanswered reviews, profile drift, report delivery, and client risk. This becomes the 50+ client upkeep system.",
    verification: "Scheduled work exists in Mission Control; multi-client automated monitoring still needs to be expanded.",
  },
];

export const REACH_TOMORROW_BLOCKERS: ReachInternalStep[] = [
  {
    title: "Final dynamic email template",
    owner: "Sender + Coach",
    status: "partial",
    description:
      "Draft first-touch/follow-up copy exists, but it still needs final GHL merge-field validation, real footer values, unsubscribe proof, and Auditor approval before any Send Email node is added.",
    verification: "Sender and Coach drafts reviewed; not approved for live GHL send nodes.",
  },
  {
    title: "Live GHL report + heatmap workflow",
    owner: "GHL Expert",
    status: "partial",
    description:
      "Need to confirm GHL generates the marketing report and heatmap, stores URLs, and calls the website callback with the right runId.",
    verification: "Website side is built; GHL workflow completion is not verified.",
  },
  {
    title: "Campaign report-link generation",
    owner: "GHL Expert + Website",
    status: "partial",
    description:
      "Need a reliable way to create each prospect's report link before the email goes out.",
    verification: "Report request flow exists; outbound campaign link generation still needs finishing.",
  },
  {
    title: "AOH Client Template Lab subaccount check",
    owner: "GHL Expert + Auditor",
    status: "partial",
    description:
      "Fields, values, tags, and a Draft-only Reach workflow skeleton exist in hVTckp5FcGL9Ja3GvC3R. Placeholder values, email nodes, canary testing, and snapshot/reputation QA remain blocked.",
    verification: "Live GHL setup was verified manually/visually; still needs final placeholder replacement and Auditor QA before launch.",
  },
  {
    title: "Prospect list filter before spending",
    owner: "Scout",
    status: "missing",
    description:
      "Need the cheap prefilter so you do not pay to deeply scan every GBP in an area/niche.",
    verification: "Defined above, not automated.",
  },
];

export const SCHEDULED_JOB_COSTS: ScheduledJobCost[] = [
  {
    slug: "reviews-outreach",
    name: "Reviews Outreach - Reach lead engine",
    service: "Reach",
    owner: "Scout + Sender + Sorter + Booker",
    overview:
      "Reach is the outbound growth machine. It finds likely buyers, enriches their contact details, sends a clean first-touch message, sorts replies, and moves interested people toward a booked call.",
    reachPart:
      "This is the core Reach workflow: find the right businesses, start conversations, separate real buying signals from noise, and hand warm replies to booking.",
    salesAgentTasks: [
      {
        title: "Build the prospect list",
        description: "Scout finds businesses that look like they need review automation or local visibility help.",
        owner: "Scout",
      },
      {
        title: "Prepare usable contact records",
        description: "Enricher turns a business name into a useful lead record with website, phone, email, and context.",
        owner: "Enricher",
      },
      {
        title: "Send the first conversation starter",
        description: "Sender writes and sends outreach in AOH's voice so the message feels specific, not like a blast.",
        owner: "Sender",
      },
      {
        title: "Read and classify every reply",
        description: "Sorter separates interested replies, objections, bad fits, and unsubscribe/no-response noise.",
        owner: "Sorter",
      },
      {
        title: "Turn interest into a call",
        description: "Booker nudges warm replies toward the /talk calendar and makes sure no lead sits unanswered.",
        owner: "Booker",
      },
    ],
    internalTasks: [
      {
        title: "Measure cost against booked calls",
        description: "Auditor watches daily spend, cost per booked call, reply quality, and whether the list or message should change.",
        owner: "Auditor",
      },
      {
        title: "Keep the workflow visible",
        description: "Manager makes sure the job status, blockers, and next actions stay visible in Mission Control.",
        owner: "Manager",
      },
      {
        title: "Improve the offer loop",
        description: "Coach turns reply patterns into better sales language, clearer objections, and future playbook updates.",
        owner: "Coach",
      },
    ],
    agentRoles: [
      { agent: "Scout", role: "Finds the right local businesses and checks whether they look like a fit." },
      { agent: "Enricher", role: "Adds usable email, phone, website, and business details before outreach." },
      { agent: "Sender", role: "Prepares and sends the outreach sequence without making it sound templated." },
      { agent: "Sorter", role: "Reads replies, separates real interest from noise, and flags hot leads." },
      { agent: "Booker", role: "Moves interested replies toward a call on the calendar." },
      { agent: "Auditor", role: "Checks cost, booked-call rate, and whether the list/copy should change." },
    ],
    cadence: "Daily at 7:00am",
    status: "watch",
    startedOn: "2026-05-14",
    dailyCostUsd: 3.72,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 299,
    lastRun: "Today 7:00am",
    nextRun: "Tomorrow 7:00am",
    notes: "First job to watch. If booked calls stay at 0 after a week, change list/source/copy before scaling.",
    costBreakdown: [
      { label: "Scout research", amountUsd: 0.42 },
      { label: "Contact enrichment", amountUsd: 0.9 },
      { label: "Message drafting + send prep", amountUsd: 1.8 },
      { label: "Reply triage", amountUsd: 0.35 },
      { label: "Booking/admin checks", amountUsd: 0.25 },
    ],
    checks: [
      "Prospects found",
      "Contacts enriched",
      "Messages sent",
      "Replies sorted",
      "Booked calls",
    ],
  },
  {
    slug: "ai-visibility-outreach",
    name: "AI Visibility Outreach",
    service: "Reach",
    owner: "Scout + Sender + Sorter",
    overview:
      "A Reach campaign angle focused on local and AI visibility. It finds companies with weak public visibility signals, starts the audit conversation, and watches whether that creates discovery calls.",
    reachPart:
      "This is a Reach campaign variant: the sales angle is visibility/audit instead of review automation.",
    salesAgentTasks: [
      {
        title: "Spot visibility gaps",
        description: "Scout looks for weak profiles, stale reviews, poor category coverage, and unclear local presence.",
        owner: "Scout",
      },
      {
        title: "Lead with the audit angle",
        description: "Sender frames the outreach around what customers and AI systems may not be finding.",
        owner: "Sender",
      },
      {
        title: "Route interested replies",
        description: "Sorter identifies who wants an audit, who needs more context, and who is not a fit.",
        owner: "Sorter",
      },
    ],
    internalTasks: [
      {
        title: "Supply proof points",
        description: "Profile gives the campaign the checklist and findings that make the visibility pitch credible.",
        owner: "Profile",
      },
      {
        title: "Decide whether to keep spending",
        description: "Auditor compares replies and booked audits against the daily cost before scaling.",
        owner: "Auditor",
      },
    ],
    agentRoles: [
      { agent: "Scout", role: "Finds prospects with profile, review, citation, or AI visibility gaps." },
      { agent: "Sender", role: "Sends the visibility-audit angle and keeps the message aligned to AOH's offer." },
      { agent: "Sorter", role: "Classifies replies and sends interested leads toward discovery." },
      { agent: "Profile", role: "Provides the visibility checklist and proof points used in the pitch." },
      { agent: "Auditor", role: "Watches reply quality and whether booked audits justify the daily spend." },
    ],
    cadence: "Daily at 7:15am",
    status: "watch",
    startedOn: "2026-05-14",
    dailyCostUsd: 3.1,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 199,
    lastRun: "Today 7:15am",
    nextRun: "Tomorrow 7:15am",
    notes: "Worth keeping only if it creates booked audits or reply signals that improve the offer.",
    costBreakdown: [
      { label: "Scout research", amountUsd: 0.5 },
      { label: "Contact enrichment", amountUsd: 0.75 },
      { label: "Message drafting + send prep", amountUsd: 1.55 },
      { label: "Reply triage", amountUsd: 0.3 },
    ],
    checks: ["Niche fit", "Prospects found", "Messages sent", "Replies", "Booked audits"],
  },
  {
    slug: "ghl-workflow-heartbeat",
    name: "GHL workflow heartbeat",
    service: "Mission Control",
    owner: "GHL Expert",
    overview:
      "Check the HighLevel systems that make bookings, workflows, and pipeline movement work before failures reach Mike or a client.",
    salesAgentTasks: [
      {
        title: "Protect booked-call flow",
        description: "GHL Expert checks the calendar, workflow, and pipeline pieces that convert interest into a real appointment.",
        owner: "GHL Expert",
      },
    ],
    internalTasks: [
      {
        title: "Catch broken automations",
        description: "GHL Expert checks workflow errors, missed handoffs, calendar sync, and stuck pipeline movement.",
        owner: "GHL Expert",
      },
      {
        title: "Escalate failures",
        description: "Manager turns any failure into a visible Mission Control item with an owner.",
        owner: "Manager",
      },
      {
        title: "Review recurring issues",
        description: "Auditor watches for repeated breaks so the system gets fixed instead of repeatedly patched.",
        owner: "Auditor",
      },
    ],
    agentRoles: [
      { agent: "GHL Expert", role: "Checks workflow errors, calendar sync, pipeline movement, and webhook health." },
      { agent: "Manager", role: "Turns any failure into a visible Mission Control task or blocker." },
      { agent: "Auditor", role: "Reviews recurring failures and decides whether the system is drifting." },
    ],
    cadence: "Daily",
    status: "worth-it",
    startedOn: "2026-05-17",
    dailyCostUsd: 0.18,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 0,
    lastRun: "Today",
    nextRun: "Tomorrow",
    notes: "Cheap insurance. Keep this even before client volume grows.",
    costBreakdown: [
      { label: "GHL API checks", amountUsd: 0.04 },
      { label: "Workflow/status summary", amountUsd: 0.1 },
      { label: "Alert routing", amountUsd: 0.04 },
    ],
    checks: ["Workflow errors", "Calendar sync", "Pipeline movement", "Webhook health"],
  },
  {
    slug: "secret-exposure-sweep",
    name: "Secret exposure sweep",
    service: "Security",
    owner: "Auditor",
    overview:
      "Scan for obvious credential leaks, unsafe token exposure, and risky public/client-side configuration before they become incidents.",
    salesAgentTasks: [
      {
        title: "Keep client trust clean",
        description: "Auditor makes sure sales and demo links are not exposing tokens or sensitive operational details.",
        owner: "Auditor",
      },
    ],
    internalTasks: [
      {
        title: "Run exposure checks",
        description: "Auditor scans for secrets in source, screenshots, URLs, and unsafe public configuration.",
        owner: "Auditor",
      },
      {
        title: "Route fixes",
        description: "Manager sends any risk to the right owner and keeps it visible until closed.",
        owner: "Manager",
      },
      {
        title: "Review connected apps",
        description: "GHL Expert helps if the risk touches HighLevel credentials, webhooks, or connected workflows.",
        owner: "GHL Expert",
      },
    ],
    agentRoles: [
      { agent: "Auditor", role: "Runs the sweep, flags exposures, and blocks risky deploys." },
      { agent: "Manager", role: "Routes any security fix to the right owner and keeps it visible." },
      { agent: "GHL Expert", role: "Helps when leaked or unsafe credentials touch HighLevel integrations." },
    ],
    cadence: "Daily",
    status: "worth-it",
    startedOn: "2026-05-17",
    dailyCostUsd: 0.06,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 0,
    lastRun: "Today",
    nextRun: "Tomorrow",
    notes: "Tiny cost compared with one leaked-token incident.",
    costBreakdown: [
      { label: "Pattern scan", amountUsd: 0.01 },
      { label: "Risk summary", amountUsd: 0.03 },
      { label: "Alert check", amountUsd: 0.02 },
    ],
    checks: ["Tokens in URLs", "Secrets in source", "Unsafe env names", "Public screenshots"],
  },
  {
    slug: "profile-visibility-sweep",
    name: "Profile visibility sweep",
    service: "AI Visibility",
    owner: "Profile",
    overview:
      "Check AOH or client profiles for basic visibility decay: profile completeness, reviews, unanswered reviews, and NAP drift.",
    salesAgentTasks: [
      {
        title: "Create client-facing findings",
        description: "Profile turns profile gaps, unanswered reviews, and visibility drift into simple sales talking points.",
        owner: "Profile",
      },
    ],
    internalTasks: [
      {
        title: "Monitor profile health",
        description: "Profile checks GBP completeness, photos, services, categories, reviews, and NAP consistency.",
        owner: "Profile",
      },
      {
        title: "Confirm GHL connection health",
        description: "GHL Expert verifies connected GBP or reputation pieces still sync where needed.",
        owner: "GHL Expert",
      },
      {
        title: "Turn findings into reporting",
        description: "Coach translates checks into client-friendly explanations and monthly report language.",
        owner: "Coach",
      },
    ],
    agentRoles: [
      { agent: "Profile", role: "Checks GBP completeness, reviews, photos, services, categories, and NAP consistency." },
      { agent: "GHL Expert", role: "Confirms connected HighLevel/GBP pieces still sync where needed." },
      { agent: "Auditor", role: "Confirms recurring profile issues are not being ignored." },
      { agent: "Coach", role: "Turns findings into client-facing explanations or monthly report language." },
    ],
    cadence: "Weekly",
    status: "too-early",
    startedOn: "2026-05-17",
    dailyCostUsd: 0.21,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 0,
    lastRun: "Not started",
    nextRun: "This week",
    notes: "Estimated daily average of a weekly job. Useful once AOH GBP is treated as client zero.",
    costBreakdown: [
      { label: "GBP checks", amountUsd: 0.08 },
      { label: "Review/NAP scan", amountUsd: 0.07 },
      { label: "Summary", amountUsd: 0.06 },
    ],
    checks: ["GBP completeness", "New reviews", "Unanswered reviews", "NAP drift"],
  },
];

export function daysRunning(startedOn: string, now = new Date()): number {
  const start = new Date(`${startedOn}T00:00:00Z`).getTime();
  if (Number.isNaN(start)) return 1;
  const diff = now.getTime() - start;
  return Math.max(1, Math.floor(diff / 86_400_000) + 1);
}

export function totalCost(job: ScheduledJobCost, now = new Date()): number {
  if (typeof job.totalOverrideUsd === "number") return job.totalOverrideUsd;
  return job.dailyCostUsd * daysRunning(job.startedOn, now);
}

export function costPerBookedCall(job: ScheduledJobCost, now = new Date()): number | null {
  if (job.bookedCalls <= 0) return null;
  return totalCost(job, now) / job.bookedCalls;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount >= 100 ? 0 : 2,
  }).format(amount);
}
