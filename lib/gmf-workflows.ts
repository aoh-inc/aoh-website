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
    name: "Launch 01: Get Found Refresh",
    oneLine: "Runs the one-time visibility cleanup that makes a business easier for Google and customers to understand.",
    description:
      "This is GMF's entry service. Profile Manager checks the public Google-facing footprint, records what is missing, drafts safe fixes, and gives the client a simple before/after.",
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
      "Coach keeps the Refresh checklist, client-safe explanation, and sample before/after language current.",
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
    slug: "review-engine",
    name: "Serve 02: Review Engine",
    oneLine: "Sends email review requests to completed customers and keeps feedback, suppressions, and proof visible.",
    description:
      "This is GMF's core recurring review service. It handles uploaded customers, POS-ready events, proof previews, email sends, private feedback, follow-ups, and monthly review reporting.",
    status: "ready",
    weeklyCheckAgent: "Reviews Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "If send candidates stop moving, Auditor checks storage, sender health, review link, suppressions, and held rows before Manager escalates.",
    mikeEscalation:
      "Manager asks Mike only when a live send approval, client list question, or sender-risk decision is needed.",
    clientEmailApproval:
      "Reviews Manager drafts requests for missing customer lists, review links, or POS exports. Manager asks Mike to approve the exact email.",
    coachTraining:
      "Coach keeps customer-upload instructions, review request language, and the client explanation for email-first review requests current.",
    readyCriteria: [
      "Verified Google review link exists.",
      "Customer list is checked for duplicates, missing emails, and suppressions.",
      "Proof page preview is reviewed before live send.",
      "Sender and Supabase logging are healthy.",
      "Follow-up and recap paths stay protected by internal approval.",
    ],
    agents: [
      { agent: "Reviews Manager", role: "Workflow owner", does: "Builds send candidates, checks proof, and controls live-send readiness.", proof: "Proof page shows sendable rows and preview." },
      { agent: "Sorter", role: "List readiness", does: "Cleans customer lists and holds duplicates, missing emails, and suppressions.", proof: "Upload summary shows clean/held rows." },
      { agent: "Systems Director", role: "Sender/storage safety", does: "Checks storage, sender, and protected endpoint health.", proof: "Health endpoints return ok." },
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
    slug: "review-voice",
    name: "Serve 03: Review Voice",
    oneLine: "Drafts review replies in the client's voice while keeping risky replies human-reviewed.",
    description:
      "This add-on replaces risky auto-reply behavior with GMF-controlled drafts, safety flags, approval decisions, and audit history.",
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
      { label: "GHL Exit Ops", href: "/mike-mc/ghl-exit-ops" },
      { label: "Ops Index", href: "/mike-mc/ops" },
      { label: "Integration Health", href: "/api/review-automation/integration-health" },
    ],
  },
  {
    slug: "call-protection",
    name: "Future 01: Call Protection",
    oneLine: "Future add-on for answering or routing calls when Google/customers call and the business cannot pick up.",
    description:
      "This workflow is intentionally planned, not active. It becomes useful when demand proves that missed calls or Google's local calling features are hurting conversion.",
    status: "planned",
    weeklyCheckAgent: "Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "Manager keeps this parked until there is buyer demand, pricing approval, and a safe phone workflow.",
    mikeEscalation:
      "Manager asks Mike before pricing, selling, or wiring any phone/voice workflow.",
    clientEmailApproval:
      "No client email goes out until the add-on is activated and priced.",
    coachTraining:
      "Coach keeps this framed as future/contact-for-pricing, not part of the base GMF promise.",
    readyCriteria: [
      "Pricing is approved.",
      "Phone provider and compliance are approved.",
      "Call scripts and handoff rules are tested.",
      "Auditor approves no-surprise billing and failover.",
    ],
    agents: [
      { agent: "Manager", role: "Future owner", does: "Tracks demand and waits for Mike's go-ahead.", proof: "Demand notes and pricing decision are recorded." },
      { agent: "Systems Director", role: "Future safety", does: "Defines provider, billing, failover, and compliance risks.", proof: "Safety checklist exists before launch." },
      { agent: "Auditor", role: "Future gate", does: "Blocks launch until call behavior and costs are safe.", proof: "Auditor approval is recorded." },
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

  if (slug === "review-engine") {
    const records = await listReviewAutomationRecords({ clientSlug: "ai-outsource-hub", limit: 300 });
    if (!records.ok) return [{ label: "storage", value: "issue", tone: "danger" }];
    return [
      { label: "events", value: String(records.records.length), tone: "accent" },
      { label: "uploads", value: String(records.records.filter((record) => record.eventType === "customer_upload").length), tone: "muted" },
      { label: "send logs", value: String(records.records.filter((record) => record.eventType === "send_log").length), tone: "muted" },
    ];
  }

  if (slug === "review-voice") {
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

  if (slug === "call-protection") {
    return [
      { label: "status", value: "future", tone: "muted" },
      { label: "live", value: "no", tone: "muted" },
      { label: "pricing", value: "TBD", tone: "warm" },
    ];
  }

  return [{ label: "status", value: "manual", tone: "muted" }];
}
