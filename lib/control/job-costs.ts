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
    title: "Choose who to target",
    description:
      "Pick the type of business, the area, and the simple offer we want to lead with.",
  },
  {
    title: "Find businesses",
    description:
      "Agents build a list of local businesses that look like they may need help.",
  },
  {
    title: "Check contact info",
    description:
      "Agents look for usable business emails and remove risky or low-quality contacts.",
  },
  {
    title: "Send the first message",
    description:
      "The message is short, specific, and built to get a reply instead of sounding like a blast.",
  },
  {
    title: "Sort replies",
    description:
      "Agents separate real interest from no, bad fit, unsubscribe, or needs-follow-up replies.",
  },
  {
    title: "Book calls",
    description:
      "Interested people get moved toward the calendar. The agents use results to improve the next run.",
  },
];

export const REACH_INTERNAL_FLOW: ReachInternalStep[] = [
  {
    title: "Choose the target",
    owner: "Coach + Manager",
    status: "manual",
    description:
      "Decide which businesses we are going after, where they are, and how much we are allowed to spend per day.",
    verification: "Defined in runbooks and Mission Control, but not yet enforced through a required campaign setup form.",
  },
  {
    title: "Find businesses first",
    owner: "Scout",
    status: "partial",
    description:
      "Scout builds the first list before we spend more money checking emails.",
    verification: "scripts/reach-discovery-first.mjs and docs/client-ops-ledger/reach-business-discovery-first.md exist; production scheduling/state still needs live telemetry.",
  },
  {
    title: "Pick the best fits",
    owner: "Scout",
    status: "partial",
    description:
      "Agents keep the businesses that look most likely to need the offer and remove weak fits.",
    verification: "Scoring rules are documented and partially scripted; live scoring still needs more automated evidence before scale.",
  },
  {
    title: "Check emails",
    owner: "Enricher + Sender",
    status: "partial",
    description:
      "Agents look for real business emails and remove risky personal or duplicate emails.",
    verification: "The Relay batch proved risky rows can be held out. Live NoBounce/NeverBounce/GHL validation telemetry is not yet shown directly in Mission Control.",
  },
  {
    title: "Add clean leads",
    owner: "GHL Expert",
    status: "partial",
    description:
      "Clean leads are added to the right list. Adding leads does not mean emails are sending yet.",
    verification: "Reviews and AI Visibility have clean warmup batches started. Relay is still waiting for more clean contacts.",
  },
  {
    title: "Send outreach",
    owner: "Sender + Coach",
    status: "partial",
    description:
      "Sender sends a useful first note and asks for a simple next step.",
    verification: "Auto warmup can start lanes after readiness checks pass. Relay is waiting because it has 5 OK contacts and needs 10.",
  },
  {
    title: "Sort replies",
    owner: "Sorter",
    status: "partial",
    description:
      "Sorter turns replies into clear next steps: interested, book call, send info, bad fit, or stop.",
    verification: "Website report delivery workflows are live. Campaign reply router blueprint exists but still needs live UI build and QA.",
  },
  {
    title: "Book calls",
    owner: "Booker + Scheduler",
    status: "verified",
    description:
      "Warm replies get moved to the calendar so you are talking to people with interest.",
    verification: "AOH Talk booking URL loads and production custom value aoh_discovery_calendar_link is set.",
  },
  {
    title: "Review spend and results",
    owner: "Manager",
    status: "partial",
    description:
      "Manager checks spend, replies, booked calls, and whether the list or message needs to change.",
    verification: "The ledger shows cost estimates and blockers; live vendor billing, bounce, and booked-call telemetry still need deeper wiring.",
  },
];

export const REACH_OPTIONAL_AGENT_FLOW: ReachInternalStep[] = [
  {
    title: "Confirm they need a custom agent",
    owner: "Coach + Manager",
    status: "manual",
    description:
      "Use this only when the business wants agents connected to its CRM or daily software. Not every client needs it.",
    verification: "Must be scoped during sales/onboarding before any client system is connected.",
  },
  {
    title: "Collect access",
    owner: "Manager + GHL Expert",
    status: "manual",
    description:
      "The client gives the business info, software access path, message preferences, and approval contact.",
    verification: "Client-facing intake and access proof must exist before build work starts.",
  },
  {
    title: "Connect their software",
    owner: "GHL Expert + Systems Director",
    status: "manual",
    description:
      "Agents connect the CRM or business system that should start follow-ups.",
    verification: "No custom client CRM/POS connector should go live without a test contact, rollback path, and written scope.",
  },
  {
    title: "Teach the agent the business",
    owner: "Systems Director + Coach",
    status: "manual",
    description:
      "Define what the agent can do, what it should never do, when it asks a human, and how it should sound.",
    verification: "Instructions must be reviewed before any automated client communication or data write.",
  },
  {
    title: "Start jobs from real events",
    owner: "GHL Expert + Custom Agent",
    status: "manual",
    description:
      "Closed jobs, missed calls, new leads, or completed appointments can start the right follow-up.",
    verification: "Each event trigger needs sample data, a dry run, and a visible Mission Control status before launch.",
  },
  {
    title: "Watch the agent",
    owner: "Auditor + Manager",
    status: "manual",
    description:
      "Auditor watches for mistakes, wrong links, wrong business info, or messages that need a human.",
    verification: "Launch requires written QA and ongoing monitoring because custom agents touch client systems.",
  },
];

export const REACH_TOMORROW_BLOCKERS: ReachInternalStep[] = [
  {
    title: "Final dynamic email template",
    owner: "Sender + Coach",
    status: "partial",
    description:
      "Draft first-touch/follow-up copy exists in docs/AOH_REACH_CAMPAIGN_COPY.md. The approved strategy separates three lanes: Reviews $1 first month, AI Visibility free snapshot/report, and Relay missed-call details. Each lane still needs final GHL merge-field validation, real footer values, unsubscribe proof, daily cap, and Systems Director approval before any scaled send.",
    verification: "Sender, Coach, and Systems Director pressure-tested the offer structure on 2026-05-18; copy is drafted but not approved for scaled live send nodes until reply router QA passes.",
  },
  {
    title: "Live GHL report + heatmap workflow",
    owner: "GHL Expert",
    status: "verified",
    description:
      "Active AOH/Hub360AI production workflows generate/store report URLs, call the website callback, and use a single combined delivery workflow to avoid duplicate customer emails.",
    verification: "Verified 2026-05-18 in active production location: Website Visitor Free Marketing Report Intake, Website Visitor Free AI Visibility Report Intake, and Website Visitor Report Delivery are published; delivery execution completed successfully.",
  },
  {
    title: "Campaign reply-to-report automation",
    owner: "GHL Expert + Website",
    status: "partial",
    description:
      "Need reliable campaign reply automations: Reviews/AI `send` replies trigger the correct report generation/delivery, Relay `send` replies send missed-call details, `book` replies trigger AOH Talk booking handoff, unclear replies become tasks, and unsubscribe/not-interested replies stop safely.",
    verification: "Website/report delivery flow is live. Live MC diagnostics see production GHL location tRbczwt6oJsXK4tjuzOI and the Reach - Reviews / Reach - AI pipelines. docs/AOH_CAMPAIGN_REPLY_ROUTER.md now defines the exact router blueprint. GHL UI build and QA still need to pass before scaled sends.",
  },
  {
    title: "AOH Client Template Lab template check",
    owner: "GHL Expert + Systems Director",
    status: "partial",
    description:
      "Fields, values, tags, and a Draft-only Reach workflow skeleton exist in the template lab. This is reusable setup only, not proof that live AOH campaigns/report workflows are wired.",
    verification: "Template-lab setup was verified manually/visually; keep it separate from the active production workflows that now handle website visitor reports.",
  },
  {
    title: "Prospect list filter before spending",
    owner: "Scout",
    status: "missing",
    description:
      "Need the cheap prefilter so you do not pay to deeply scan every GBP in an area/niche.",
    verification: "Defined above, not automated.",
  },
  {
    title: "Controlled launch caps and first-hour watch",
    owner: "Systems Director + Manager",
    status: "partial",
    description:
      "The dedicated-domain warmup ladder is documented: 10-20 emails/day for 3 days, then 40-50/day for 3 days, then 80-100/day for 3 days, followed by a Day 9 warmup/status check before any increase. Mission Control still needs automated live telemetry for lane status, daily cap, suppression count, duplicate prevention status, failures, and first-hour watch owner.",
    verification: "Launch runbook is documented in docs/AOH_REACH_LAUNCH_RUNBOOK.md; live MC telemetry and first-hour watch are not fully automated yet.",
  },
];

export const SCHEDULED_JOB_COSTS: ScheduledJobCost[] = [
  {
    slug: "reviews-outreach",
    name: "Commercial Reach - find and book leads",
    service: "Reach",
    owner: "Scout + Sender + Sorter + Booker",
    overview:
      "Agents find local businesses, check the contact info, send a useful first message, sort replies, and try to book calls.",
    reachPart:
      "This is the standard Reach offer. Connecting to a client's CRM is optional extra work.",
    salesAgentTasks: [
      {
        title: "Find businesses",
        description: "Scout finds local businesses that look like good fits.",
        owner: "Scout",
      },
      {
        title: "Check contact quality",
        description: "Agents keep usable business emails and remove risky contacts.",
        owner: "Enricher + Sender",
      },
      {
        title: "Send the first message",
        description: "Sender writes a short, specific message that asks for a reply.",
        owner: "Sender",
      },
      {
        title: "Sort replies",
        description: "Sorter separates interested replies from no, bad fit, and unsubscribe replies.",
        owner: "Sorter",
      },
      {
        title: "Book calls",
        description: "Booker moves warm replies toward the calendar.",
        owner: "Booker",
      },
    ],
    internalTasks: [
      {
        title: "Watch spend",
        description: "Manager watches daily spend, reply quality, and booked calls.",
        owner: "Systems Director",
      },
      {
        title: "Keep custom agents separate",
        description: "CRM and custom-agent setup stays as an add-on so Reach stays easy to sell.",
        owner: "Manager",
      },
      {
        title: "Show the next move",
        description: "Manager keeps the job status and next action visible.",
        owner: "Manager",
      },
      {
        title: "Improve the pitch",
        description: "Coach uses reply patterns to improve the next message.",
        owner: "Coach",
      },
    ],
    agentRoles: [
      { agent: "Scout", role: "Finds businesses worth contacting." },
      { agent: "Enricher", role: "Finds usable contact info and removes risky emails." },
      { agent: "Sender", role: "Writes and sends the first message." },
      { agent: "Sorter", role: "Reads replies and finds real interest." },
      { agent: "Booker", role: "Moves interested replies toward a call." },
      { agent: "Manager", role: "Watches spend and decides what to change." },
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
    notes: "Keep this simple when selling: find businesses, send useful outreach, sort replies, book calls. CRM/custom-agent setup is optional.",
    costBreakdown: [
      { label: "Find businesses", amountUsd: 0.42 },
      { label: "Check emails", amountUsd: 0.9 },
      { label: "Write/send messages", amountUsd: 1.8 },
      { label: "Sort replies", amountUsd: 0.35 },
      { label: "Booking checks", amountUsd: 0.25 },
    ],
    checks: [
      "Discovery first",
      "Contacts verified",
      "Send gate passed",
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
        description: "Local Visibility Manager gives the campaign the checklist and findings that make the visibility pitch credible.",
        owner: "Local Visibility Manager",
      },
      {
        title: "Decide whether to keep spending",
        description: "Systems Director compares replies and booked audits against the daily cost before scaling.",
        owner: "Systems Director",
      },
    ],
    agentRoles: [
      { agent: "Scout", role: "Finds prospects with Local Visibility Manager, review, citation, or AI visibility gaps." },
      { agent: "Sender", role: "Sends the visibility-audit angle and keeps the message aligned to AOH's offer." },
      { agent: "Sorter", role: "Classifies replies and sends interested leads toward discovery." },
      { agent: "Local Visibility Manager", role: "Provides the visibility checklist and proof points used in the pitch." },
      { agent: "Systems Director", role: "Watches reply quality and whether booked audits justify the daily spend." },
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
        title: "Run website report smoke test",
        description:
          "Systems Director submits one homepage report request, then confirms GHL tags, both report workflows, Website Leads opportunity creation, callbacks, and usable report links.",
        owner: "Systems Director",
      },
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
        description: "Systems Director watches for repeated breaks so the system gets fixed instead of repeatedly patched.",
        owner: "Systems Director",
      },
    ],
    agentRoles: [
      { agent: "GHL Expert", role: "Checks workflow errors, calendar sync, report tags, Website Leads pipeline movement, and webhook health." },
      { agent: "Manager", role: "Turns any failure into a visible Mission Control task or blocker." },
      { agent: "Systems Director", role: "Runs the homepage report smoke test, reviews recurring failures, and decides whether the system is drifting." },
      { agent: "Reporter", role: "Confirms generated marketing and AI visibility report links are usable." },
      { agent: "Website/Codex", role: "Fixes /api/report, Vercel env, or callback issues when the handoff breaks." },
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
    checks: ["Homepage report smoke test", "Report tags", "Workflow errors", "Website Leads pipeline", "Callbacks", "Report links", "Calendar sync"],
  },
  {
    slug: "secret-exposure-sweep",
    name: "Secret exposure sweep",
    service: "Security",
    owner: "Systems Director",
    overview:
      "Scan for obvious credential leaks, unsafe token exposure, and risky public/client-side configuration before they become incidents.",
    salesAgentTasks: [
      {
        title: "Keep client trust clean",
        description: "Systems Director makes sure sales and demo links are not exposing tokens or sensitive operational details.",
        owner: "Systems Director",
      },
    ],
    internalTasks: [
      {
        title: "Run exposure checks",
        description: "Systems Director scans for secrets in source, screenshots, URLs, and unsafe public configuration.",
        owner: "Systems Director",
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
      { agent: "Systems Director", role: "Runs the sweep, flags exposures, and blocks risky deploys." },
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
    slug: "local-visibility-sweep",
    name: "Local visibility sweep",
    service: "AI Visibility",
    owner: "Local Visibility Manager",
    overview:
      "Check AOH or client profiles for basic visibility decay: profile completeness, reviews, unanswered reviews, and NAP drift.",
    salesAgentTasks: [
      {
        title: "Create client-facing findings",
        description: "Local Visibility Manager turns profile gaps, unanswered reviews, and visibility drift into simple sales talking points.",
        owner: "Local Visibility Manager",
      },
    ],
    internalTasks: [
      {
        title: "Monitor profile health",
        description: "Local Visibility Manager checks GBP completeness, photos, services, categories, reviews, and NAP consistency.",
        owner: "Local Visibility Manager",
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
      { agent: "Local Visibility Manager", role: "Checks GBP completeness, reviews, photos, services, categories, and NAP consistency." },
      { agent: "GHL Expert", role: "Confirms connected HighLevel/GBP pieces still sync where needed." },
      { agent: "Systems Director", role: "Confirms recurring profile issues are not being ignored." },
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
