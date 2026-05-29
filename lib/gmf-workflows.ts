import { getClientSetupJob } from "@/lib/client-setup-jobs";
import { getIntegrationHealthRollup } from "@/lib/review-integration-health";
import { getReviewReplyDigest } from "@/lib/review-reply-digest";
import { getSmsReadiness } from "@/lib/review-sms-readiness";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";

export type WorkflowStatus = "ready" | "working" | "blocked" | "manual" | "planned";

export type WorkflowAgentStep = {
  agent: string;
  role: string;
  does: string;
  proof: string;
};

export type WorkflowCounter = {
  label: string;
  value: string;
  tone: "accent" | "warm" | "danger" | "muted";
};

export type GmfWorkflow = {
  slug: string;
  name: string;
  oneLine: string;
  description: string;
  status: WorkflowStatus;
  readyCriteria: string[];
  weeklyCheckAgent: string;
  auditAgent: string;
  stalledProtocol: string;
  mikeEscalation: string;
  clientEmailApproval: string;
  coachTraining: string;
  agents: WorkflowAgentStep[];
  counters: WorkflowCounter[];
  links: Array<{ label: string; href: string }>;
};

export const WORKFLOW_DEFINITIONS: Array<Omit<GmfWorkflow, "counters">> = [
  {
    slug: "get-found-refresh",
    name: "Launch 01: Get Found",
    oneLine: "Runs the one-time visibility cleanup that makes a business easier for Google and customers to understand.",
    description:
      "This is GMF's entry service. Profile Manager checks the public Google-facing footprint, records what is missing, drafts safe fixes, sets the first review-request path, and gives the client a simple baseline.",
    status: "working",
    weeklyCheckAgent: "Profile Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "Auditor names the missing proof, Profile Manager drafts the next fix or client request, and Manager keeps the blocker visible.",
    mikeEscalation:
      "Manager asks Mike only when a public profile edit, client access request, or pricing/offer decision needs approval.",
    clientEmailApproval:
      "Profile Manager drafts any GBP access or profile-update request. Manager asks Mike to approve the exact message before it is sent.",
    coachTraining:
      "Coach keeps the Get Found checklist, client-safe explanation, and sample baseline language current.",
    readyCriteria: [
      "Correct business/profile is confirmed.",
      "Access state or verification blocker is recorded.",
      "Review link is captured or the blocker is visible.",
      "Categories, services, hours, website, description, and photo gaps are checked.",
      "Auditor approves the client-facing findings before delivery.",
    ],
    agents: [
      { agent: "Manager", role: "Job opener", does: "Creates the setup job, confirms the offer, and keeps the next owner visible.", proof: "Setup job exists with current status." },
      { agent: "Profile Manager", role: "Workflow owner", does: "Checks the Google profile, services, categories, review link, and visibility gaps.", proof: "Refresh checklist and profile notes are recorded." },
      { agent: "Coach", role: "Client language", does: "Turns findings into plain business-owner language.", proof: "Client-safe summary is ready." },
      { agent: "Auditor", role: "Quality gate", does: "Checks that fixes are safe, factual, and not overpromised.", proof: "Auditor pass or blocker is recorded." },
      { agent: "Manager", role: "Outcome owner", does: "Marks ready, blocked, or needs Mike/client approval.", proof: "Next action is visible in Mission Control." },
    ],
    links: [
      { label: "Setup Jobs", href: "/mike-mc/setup-jobs?client=getmefound" },
      { label: "Client Profile", href: "/mike-mc/clients" },
      { label: "Client Hub", href: "/client/getmefound" },
    ],
  },
  {
    slug: "stay-found",
    name: "Serve 01: Stay Found",
    oneLine: "Runs the monthly visibility check so the client's Google-facing footprint does not go stale.",
    description:
      "This is the lightweight monthly maintenance plan. Profile Manager checks drift, Client Success turns it into a short recap, and Auditor verifies that claims stay factual.",
    status: "working",
    weeklyCheckAgent: "Profile Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "If no monthly note exists, Client Success drafts it from the latest profile/review activity and Manager flags the missing recap.",
    mikeEscalation:
      "Manager asks Mike only when a recommendation changes the offer, needs client approval, or could affect a public profile.",
    clientEmailApproval:
      "Client Success drafts any client check-in. Manager asks Mike to approve sensitive asks before sending.",
    coachTraining:
      "Coach maintains the monthly recap template and the approved language for Google/Search changes.",
    readyCriteria: [
      "Client has a profile baseline.",
      "Review/link/profile status is visible.",
      "Monthly recap template exists.",
      "Recommendations include source observations, not invented metrics.",
      "Auditor can see what changed and what is next.",
    ],
    agents: [
      { agent: "Profile Manager", role: "Workflow owner", does: "Checks profile completeness, review drift, and local visibility changes.", proof: "Monthly visibility notes exist." },
      { agent: "Reviews Manager", role: "Review signal", does: "Adds review velocity, feedback, and unanswered-review status.", proof: "Review counts or status are included." },
      { agent: "Client Success", role: "Recap owner", does: "Turns the activity into a short owner-readable client note.", proof: "Monthly recap draft or sent note exists." },
      { agent: "Auditor", role: "Truth check", does: "Checks that numbers, claims, and recommendations are supportable.", proof: "Auditor pass or correction is recorded." },
    ],
    links: [
      { label: "Client Hub", href: "/client/getmefound" },
      { label: "Clients", href: "/mike-mc/clients" },
      { label: "Workflows", href: "/mike-mc/workflows" },
      { label: "Ops Docs", href: "/mike-mc/ops" },
    ],
  },
  {
    slug: "stay-found-review-system",
    name: "Serve 02: Stay Found Review System",
    oneLine: "Sends review requests through email and compliant SMS, then keeps feedback, suppressions, reply drafts, and proof visible.",
    description:
      "This is the review system inside Stay Found. It handles uploaded customers, POS-ready events, proof previews, email/SMS sends after compliance, private feedback, follow-ups, AI reply drafts, and monthly reporting.",
    status: "ready",
    weeklyCheckAgent: "Reviews Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "If send candidates stop moving, Auditor checks storage, sender health, review link, suppressions, and held rows before Manager escalates.",
    mikeEscalation:
      "Manager asks Mike only when a live send approval, client list question, SMS compliance issue, or sender-risk decision is needed.",
    clientEmailApproval:
      "Reviews Manager drafts requests for missing customer lists, review links, POS exports, or SMS compliance details. Manager asks Mike to approve the exact email.",
    coachTraining:
      "Coach keeps customer-upload instructions, review request language, A2P/SMS explanation, and AI reply approval language current.",
    readyCriteria: [
      "Verified Google review link exists.",
      "Customer list is checked for duplicates, missing emails, and suppressions.",
      "Proof page preview is reviewed before live send.",
      "Sender, SMS compliance when applicable, and Supabase logging are healthy.",
      "Follow-up and recap paths stay protected by internal approval.",
    ],
    agents: [
      { agent: "Reviews Manager", role: "Workflow owner", does: "Builds send candidates, checks proof, and controls live-send readiness.", proof: "Proof page shows sendable rows and preview." },
      { agent: "Sorter", role: "List readiness", does: "Cleans customer lists and holds duplicates, missing emails, and suppressions.", proof: "Upload summary shows clean/held rows." },
      { agent: "Systems Director", role: "Sender/storage safety", does: "Checks storage, sender, SMS readiness, and protected endpoint health.", proof: "Health endpoints return ok." },
      { agent: "Auditor", role: "Launch QA", does: "Verifies no accidental sends and all live sends are logged.", proof: "Send log and proof checks match." },
      { agent: "Manager", role: "Status owner", does: "Reports ready, blocked, or needs-client-help status.", proof: "Client hub status is updated." },
    ],
    links: [
      { label: "Proof Page", href: "/mike-mc/review-proof/ai-outsource-hub" },
      { label: "Customer Upload", href: "/client/ai-outsource-hub/customers" },
      { label: "Storage Health", href: "/api/review-automation/storage-health" },
    ],
  },
  {
    slug: "review-replies",
    name: "Serve 03: Review Replies",
    oneLine: "Drafts review replies in the client's voice while keeping risky replies human-reviewed.",
    description:
      "This Stay Found lane replaces risky auto-reply behavior with GMF-controlled drafts, safety flags, approval decisions, and audit history.",
    status: "working",
    weeklyCheckAgent: "Reply Writer",
    auditAgent: "Auditor",
    stalledProtocol:
      "If drafts pile up, Reply Writer flags pending replies and Manager decides whether Mike/client approval is needed.",
    mikeEscalation:
      "Manager asks Mike to approve exact replies or client messages when a review is high-risk or the automation level changes.",
    clientEmailApproval:
      "Reply Writer drafts client-facing approval requests. Manager presents the exact wording to Mike before it is sent.",
    coachTraining:
      "Coach maintains voice examples, escalation terms, and safe reply rules.",
    readyCriteria: [
      "Client voice profile exists.",
      "Draft mode starts approval-only.",
      "High-risk topics never auto-post.",
      "Approve/reject/posted decisions are logged.",
      "Auto-posting waits for a future trust level and Mike approval.",
    ],
    agents: [
      { agent: "Reply Writer", role: "Workflow owner", does: "Drafts replies in the client's voice and flags sensitive topics.", proof: "Draft and risk flags are saved." },
      { agent: "Reviews Manager", role: "Queue owner", does: "Keeps review reply decisions moving.", proof: "Pending drafts are visible." },
      { agent: "Auditor", role: "Safety owner", does: "Checks high-risk flags and auto-post eligibility.", proof: "Safety flags match review content." },
      { agent: "Manager", role: "Approval owner", does: "Gets Mike/client approval when needed.", proof: "Decision note is logged." },
    ],
    links: [
      { label: "Review Replies", href: "/mike-mc/review-replies/ai-outsource-hub" },
      { label: "Client Editor", href: "/mike-mc/clients" },
    ],
  },
  {
    slug: "weekly-safety-audit",
    name: "Systems 01: Weekly Safety Audit",
    oneLine: "Checks broken pipes, secrets, stale integrations, and risky live-action paths before clients feel the problem.",
    description:
      "This is the recurring guardrail that lets GMF run more autonomously. Systems Director watches tool health; Auditor blocks unsafe changes; Manager sees only exceptions.",
    status: "ready",
    weeklyCheckAgent: "Systems Director",
    auditAgent: "Auditor",
    stalledProtocol:
      "Systems Director records the failing check, Auditor decides whether it blocks live work, and Manager escalates only exceptions.",
    mikeEscalation:
      "Manager asks Mike when credentials, billing, tool spend, or public/security risk requires owner approval.",
    clientEmailApproval:
      "Systems Director drafts any client access/integration request. Manager asks Mike to approve before sending.",
    coachTraining:
      "Coach keeps the plain-English explanation for why certain live actions stay blocked until safety gates pass.",
    readyCriteria: [
      "Internal pages are protected.",
      "No secret values are printed or exposed.",
      "Sender/storage/integration health can be checked.",
      "Blocked live actions show the reason.",
      "Recovery docs stay current enough for a laptop-loss scenario.",
    ],
    agents: [
      { agent: "Systems Director", role: "Workflow owner", does: "Checks stack health, auth, sender/storage status, and integration drift.", proof: "Health checks pass or blocker is named." },
      { agent: "Auditor", role: "Safety gate", does: "Decides whether a failure blocks live sends, public edits, or deploys.", proof: "Pass/block decision is recorded." },
      { agent: "Manager", role: "Exception owner", does: "Shows Mike only what needs approval or a business decision.", proof: "Owner decision request is short and specific." },
    ],
    links: [
      { label: "Ops Index", href: "/mike-mc/ops" },
      { label: "Setup Jobs", href: "/mike-mc/setup-jobs" },
      { label: "Integration Health", href: "/api/review-automation/integration-health" },
    ],
  },
  {
    slug: "always-ready",
    name: "Growth 01: Always Ready",
    oneLine: "Builds the full reputation, content, AI voice readiness, strategy, and AEO lane for higher-touch clients.",
    description:
      "This workflow is the $299/mo tier. It includes Stay Found, plus voice readiness, business fact training, GBP content management, schema/content recommendations, strategy calls, and AEO checks.",
    status: "working",
    weeklyCheckAgent: "Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "Manager keeps live voice behavior parked until client facts, provider safety, billing, and Auditor approval are ready.",
    mikeEscalation:
      "Manager asks Mike before pricing changes, selling beyond the approved scope, or wiring any live phone/voice workflow.",
    clientEmailApproval:
      "Manager asks Mike to approve any client request for services, pricing, FAQs, voice samples, or phone/voice access.",
    coachTraining:
      "Coach keeps AI Ready framed as the full-service tier, with voice automation approval-gated.",
    readyCriteria: [
      "Client facts, services, pricing, hours, and FAQs are confirmed.",
      "Voice/phone provider and billing safety are approved before live behavior.",
      "Content/schema recommendations are factual and client-safe.",
      "Monthly strategy recap and AEO check exist.",
      "Auditor approves no-surprise billing and failover.",
    ],
    agents: [
      { agent: "Manager", role: "Bundle owner", does: "Confirms fit, scope, and approval gates.", proof: "Scope and next action are recorded." },
      { agent: "Profile Manager", role: "Content owner", does: "Builds GBP content and local visibility recommendations.", proof: "Content plan and AEO notes are saved." },
      { agent: "Reply Writer", role: "Voice owner", does: "Captures voice, FAQs, services, pricing, hours, and escalation language.", proof: "Voice/fact training source is saved." },
      { agent: "Systems Director", role: "Voice safety", does: "Defines provider, billing, failover, and compliance risks.", proof: "Safety checklist exists before launch." },
      { agent: "Auditor", role: "Gate", does: "Blocks live voice behavior until facts, costs, and failover are safe.", proof: "Auditor approval is recorded." },
    ],
    links: [
      { label: "Ops Index", href: "/mike-mc/ops" },
      { label: "Workflows", href: "/mike-mc/workflows" },
    ],
  },
];

export async function getWorkflowRuntime(workflow: Omit<GmfWorkflow, "counters">): Promise<GmfWorkflow> {
  const counters = await countersForWorkflow(workflow.slug);
  return { ...workflow, counters };
}

export async function listGmfWorkflows() {
  return Promise.all(WORKFLOW_DEFINITIONS.map(getWorkflowRuntime));
}

export async function getGmfWorkflow(slug: string) {
  const workflow = WORKFLOW_DEFINITIONS.find((item) => item.slug === slug);
  return workflow ? getWorkflowRuntime(workflow) : null;
}

async function countersForWorkflow(slug: string): Promise<WorkflowCounter[]> {
  if (slug === "get-found-refresh") {
    const setup = await getClientSetupJob("getmefound");
    if (!setup.ok) return [{ label: "storage", value: "issue", tone: "danger" }];
    return [
      { label: "steps done", value: String(setup.state.counts.done), tone: "accent" },
      { label: "waiting", value: String(setup.state.counts.waiting), tone: setup.state.counts.waiting ? "warm" : "muted" },
      { label: "blocked", value: String(setup.state.counts.blocked), tone: setup.state.counts.blocked ? "danger" : "muted" },
    ];
  }

  if (slug === "stay-found") {
    const rollup = await getIntegrationHealthRollup();
    if (!rollup.ok) return [{ label: "health", value: "issue", tone: "danger" }];
    return [
      { label: "clients", value: String(rollup.totalClients), tone: "accent" },
      { label: "attention", value: String(rollup.needsAttention), tone: rollup.needsAttention ? "danger" : "muted" },
      { label: "active sync", value: String(rollup.clients.filter((client) => client.activeAutoSync).length), tone: "warm" },
    ];
  }

  if (slug === "stay-found-review-system") {
    const records = await listReviewAutomationRecords({ clientSlug: "ai-outsource-hub", limit: 300 });
    if (!records.ok) return [{ label: "storage", value: "issue", tone: "danger" }];
    return [
      { label: "events", value: String(records.records.length), tone: "accent" },
      { label: "uploads", value: String(records.records.filter((record) => record.eventType === "customer_upload").length), tone: "muted" },
      { label: "send logs", value: String(records.records.filter((record) => record.eventType === "send_log").length), tone: "muted" },
    ];
  }

  if (slug === "review-replies") {
    const digest = await getReviewReplyDigest({ clientSlug: "ai-outsource-hub", days: 30 });
    if (!digest.ok) return [{ label: "storage", value: "issue", tone: "danger" }];
    return [
      { label: "drafts", value: String(digest.counts.drafted), tone: digest.counts.drafted ? "warm" : "muted" },
      { label: "posted", value: String(digest.counts.posted), tone: "accent" },
      { label: "high risk", value: String(digest.counts.highRisk), tone: digest.counts.highRisk ? "danger" : "muted" },
    ];
  }

  if (slug === "weekly-safety-audit") {
    const rollup = await getIntegrationHealthRollup();
    const sms = await getSmsReadiness("ai-outsource-hub");
    if (!rollup.ok) return [{ label: "health", value: "issue", tone: "danger" }];
    return [
      { label: "attention", value: String(rollup.needsAttention), tone: rollup.needsAttention ? "danger" : "muted" },
      { label: "sms ready", value: sms.ready ? "yes" : "no", tone: sms.ready ? "accent" : "muted" },
      { label: "clients", value: String(rollup.totalClients), tone: "accent" },
    ];
  }

  if (slug === "always-ready") {
    return [
      { label: "status", value: "building", tone: "warm" },
      { label: "live voice", value: "no", tone: "muted" },
      { label: "price", value: "$299", tone: "accent" },
    ];
  }

  return [{ label: "status", value: "manual", tone: "muted" }];
}
