export type MissionTone = "accent" | "warm" | "warn" | "muted" | "danger";

export type ServiceWork = {
  slug: string;
  name: string;
  job: string;
  outcome: string;
  agents: string[];
  skills: string[];
  activeClients: number;
  openTasks: number;
  blocked: number;
};

export type AgentSkillProfile = {
  agent: string;
  role: string;
  skills: string[];
  serviceOwners: string[];
  sourceDocs?: string[];
};

export type BoardStatus =
  | "Inbox"
  | "Assigned"
  | "In Progress"
  | "Waiting on Human"
  | "Review"
  | "Blocked / Later"
  | "Done";

export type BoardTask = {
  title: string;
  client: string;
  service: string;
  agent: string;
  reviewer?: string;
  status: BoardStatus;
  priority: "P0" | "P1" | "P2" | "P3";
  due: string;
  tags: string[];
  reviewChecks?: string[];
};

export type ScheduledWork = {
  cadence: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  title: string;
  owner: string;
  checks: string[];
  reason: string;
};

export const SERVICES: ServiceWork[] = [
  {
    slug: "get-found-refresh",
    name: "Get Found",
    job: "Get found",
    outcome: "$149 one-time setup: GBP audit, schema handoff, AI visibility baseline, and first review request setup.",
    agents: ["Profile Manager", "Coach", "Auditor", "Manager"],
    skills: ["gbp-audit", "review-link", "category-service-check", "client-safe-findings"],
    activeClients: 1,
    openTasks: 2,
    blocked: 0,
  },
  {
    slug: "stay-found",
    name: "Stay Found",
    job: "Stay found",
    outcome: "$99/mo + $199 setup: Get Found included free, SMS/email review requests, AI reply drafts, included website hosting, monitoring, and monthly report.",
    agents: ["Profile Manager", "Client Success", "Reviews Manager", "Auditor"],
    skills: ["monthly-visibility-check", "profile-drift", "review-status", "client-recap"],
    activeClients: 1,
    openTasks: 3,
    blocked: 0,
  },
  {
    slug: "review-replies",
    name: "Review Replies",
    job: "Sound human",
    outcome: "Internal lane inside Stay Found: drafts review replies in the client's voice while keeping risky replies approval-only.",
    agents: ["Reply Writer", "Reviews Manager", "Auditor", "Manager"],
    skills: ["voice-profile", "reply-drafting", "risk-flags", "approval-log"],
    activeClients: 0,
    openTasks: 2,
    blocked: 0,
  },
  {
    slug: "always-ready",
    name: "Always Ready",
    job: "Be AI ready",
    outcome: "$299/mo full-service reputation, content, AI voice readiness, strategy, and AEO checks.",
    agents: ["Manager", "Systems Director", "Auditor"],
    skills: ["call-routing-plan", "pricing-approval", "failover", "billing-safety"],
    activeClients: 0,
    openTasks: 1,
    blocked: 0,
  },
];

export const AGENT_SKILLS: AgentSkillProfile[] = [
  {
    agent: "Manager",
    role: "Runs the GMF operating system",
    skills: [
      "workflow-routing",
      "owner-approval-gates",
      "blocker-triage",
      "proof-before-done",
      "model-tier-selection",
      "mike-escalation-rules",
    ],
    serviceOwners: ["All GMF workflows"],
    sourceDocs: [
      "docs/GMF_COMPANY_OPERATING_SYSTEM.md",
      "docs/GMF_AGENT_TRAINING_PACK.md",
      "docs/AGENT_OPERATING_MODEL.md",
      "docs/MANAGER_ROUTING_SKILL_PACK.md",
    ],
  },
  {
    agent: "Profile Manager",
    role: "Google profile and visibility owner",
    skills: [
      "gbp-manager-access",
      "profile-health",
      "categories-services-hours",
      "review-link-capture",
      "monthly-visibility-drift",
      "get-found-refresh",
    ],
    serviceOwners: ["Get Found", "Stay Found"],
    sourceDocs: ["docs/PROFILE_KNOWLEDGE_PACK.md", "docs/PROFILE_LOCAL_VISIBILITY_PACK.md"],
  },
  {
    agent: "Reviews Manager",
    role: "Stay Found review owner",
    skills: [
      "customer-upload",
      "send-candidate-review",
      "proof-page-approval",
      "private-feedback",
      "follow-up-status",
      "monthly-review-summary",
    ],
    serviceOwners: ["Stay Found"],
    sourceDocs: ["docs/REVIEW_AUTOMATION_AGENT_SKILLS.md", "docs/CLIENT_REVIEW_AUTOMATION_ONBOARDING.md"],
  },
  {
    agent: "Reply Writer",
    role: "Review reply draft owner",
    skills: ["voice-profile", "safe-review-replies", "high-risk-flags", "approval-history"],
    serviceOwners: ["Review Replies", "Stay Found"],
    sourceDocs: ["docs/GMF_AGENT_TRAINING_PACK.md", "docs/REVIEW_AUTOMATION_AGENT_SKILLS.md"],
  },
  {
    agent: "Systems Director",
    role: "Tools, access, and safety owner",
    skills: [
      "supabase-health",
      "vercel-health",
      "resend-health",
      "cron-health",
      "secret-exposure-sweep",
      "integration-health",
      "backup-readiness",
    ],
    serviceOwners: ["All GMF workflows"],
    sourceDocs: ["docs/GMF_AGENT_TRAINING_PACK.md", "docs/BACKUP_READINESS_CHECKLIST.md"],
  },
  {
    agent: "Auditor",
    role: "Quality and safety gate",
    skills: ["proof-check", "claim-check", "live-action-block", "stalled-workflow-review"],
    serviceOwners: ["All GMF workflows"],
    sourceDocs: ["docs/AGENT_OPERATING_MODEL.md", "docs/GMF_AGENT_TRAINING_PACK.md"],
  },
  {
    agent: "Coach",
    role: "Knowledge, SOP, and sales clarity owner",
    skills: ["offer-truth", "agent-training", "client-safe-language", "monthly-recap-template"],
    serviceOwners: ["All GMF workflows"],
    sourceDocs: ["docs/GMF_COMPANY_OPERATING_SYSTEM.md", "docs/STAY_FOUND_MONTHLY_RECAP_TEMPLATE.md", "content/coach/AOH_COACH_KNOWLEDGE_PACK.md"],
  },
  {
    agent: "Scout",
    role: "Research support",
    skills: ["google-search-change-monitoring", "source-summaries", "market-observation", "sop-update-proposals"],
    serviceOwners: ["Internal training", "Stay Found"],
    sourceDocs: ["docs/GMF_AGENT_TRAINING_PACK.md"],
  },
  {
    agent: "Client Success",
    role: "Retention and client communication",
    skills: ["monthly-recap", "client-check-in", "upgrade-signal", "at-risk-client-note"],
    serviceOwners: ["Stay Found", "Always Ready"],
    sourceDocs: ["docs/GMF_COMPANY_OPERATING_SYSTEM.md", "docs/GMF_AGENT_TRAINING_PACK.md", "docs/STAY_FOUND_MONTHLY_RECAP_TEMPLATE.md"],
  },
];

export const BOARD_COLUMNS: BoardStatus[] = [
  "Inbox",
  "Assigned",
  "In Progress",
  "Waiting on Human",
  "Review",
  "Blocked / Later",
  "Done",
];

export const BOARD_TASKS: BoardTask[] = [
  {
    title: "Finish Get Found client-zero",
    client: "GMF",
    service: "Get Found",
    agent: "Profile Manager",
    reviewer: "Auditor",
    status: "In Progress",
    priority: "P0",
    due: "Now",
    tags: ["client-zero", "gbp", "visibility", "refresh"],
    reviewChecks: [
      "Correct GMF profile is confirmed",
      "Review link is captured",
      "Categories, services, hours, website, and description are checked",
      "One safe public update is drafted for Mike approval",
    ],
  },
  {
    title: "Train agents on the GMF plan ladder",
    client: "GMF",
    service: "Internal Training",
    agent: "Coach",
    reviewer: "Manager",
    status: "Review",
    priority: "P0",
    due: "Today",
    tags: ["training", "offers", "gmf-only"],
    reviewChecks: [
      "Get Found, Stay Found, and Always Ready are the active offers",
      "Reach/outbound is marked separate",
      "Review replies and AI voice readiness stay approval-gated",
      "Coach source docs are updated",
    ],
  },
  {
    title: "Run Stay Found proof path",
    client: "GMF",
    service: "Stay Found",
    agent: "Reviews Manager",
    reviewer: "Auditor",
    status: "In Progress",
    priority: "P0",
    due: "Before selling Stay Found",
    tags: ["reviews", "proof", "email", "feedback"],
    reviewChecks: [
      "Verified review link exists",
      "Customer upload dry-run works",
      "Proof page preview is clean",
      "Live send requires explicit approval",
      "Send and feedback logs are visible",
    ],
  },
  {
    title: "Make Stay Found monthly recap template",
    client: "GMF",
    service: "Stay Found",
    agent: "Client Success",
    reviewer: "Auditor",
    status: "Done",
    priority: "P1",
    due: "Template created; test on first paid Stay Found client",
    tags: ["monthly", "recap", "retention"],
    reviewChecks: [
      "What changed",
      "What needs attention",
      "What GMF did",
      "What is next",
      "No invented metrics",
    ],
  },
  {
    title: "Keep Review Replies draft-only",
    client: "GMF",
    service: "Review Replies",
    agent: "Reply Writer",
    reviewer: "Auditor",
    status: "Assigned",
    priority: "P1",
    due: "Before selling add-on",
    tags: ["review-replies", "draft-only", "safety"],
    reviewChecks: [
      "Voice fields are captured",
      "High-risk flags are visible",
      "Approve/reject/posted decisions are logged",
      "No auto-post default is documented",
    ],
  },
  {
    title: "Activate Weekly Safety Audit",
    client: "GMF",
    service: "Systems",
    agent: "Systems Director",
    reviewer: "Auditor",
    status: "Assigned",
    priority: "P1",
    due: "This week",
    tags: ["security", "health", "autonomy"],
    reviewChecks: [
      "Internal pages are protected",
      "Secrets are not exposed",
      "Storage/sender/integration health can be checked",
      "Mike sees exceptions only",
    ],
  },
  {
    title: "Build Always Ready guardrails",
    client: "GMF",
    service: "Always Ready",
    agent: "Manager",
    reviewer: "Auditor",
    status: "Blocked / Later",
    priority: "P3",
    due: "Before selling Always Ready",
    tags: ["voice", "content", "pricing"],
    reviewChecks: [
      "Voice agent setup stays approval-gated",
      "$299/mo plan language is consistent",
      "Phone provider and billing safety required before any live voice behavior",
    ],
  },
];

export const SCHEDULED_WORK: ScheduledWork[] = [
  {
    cadence: "Daily",
    title: "Manager exception scan",
    owner: "Manager",
    checks: ["Blocked workflows", "Mike approvals", "failed health checks", "client-risk items"],
    reason: "Mike should see decisions and exceptions, not every agent note.",
  },
  {
    cadence: "Weekly",
    title: "Visibility drift check",
    owner: "Profile Manager",
    checks: ["GBP access", "profile completeness", "new reviews", "unanswered reviews", "service/category drift"],
    reason: "Get Found and Stay Found depend on public footprint freshness.",
  },
  {
    cadence: "Weekly",
    title: "Stay Found review health",
    owner: "Reviews Manager",
    checks: ["customer uploads", "held rows", "send logs", "private feedback", "follow-up status"],
    reason: "Review requests must keep moving without accidental sends.",
  },
  {
    cadence: "Weekly",
    title: "Safety audit",
    owner: "Systems Director",
    checks: ["protected pages", "secret exposure", "sender health", "storage health", "integration health"],
    reason: "Autonomy only works if broken pipes and unsafe actions are caught early.",
  },
  {
    cadence: "Monthly",
    title: "Client recap",
    owner: "Client Success",
    checks: ["what GMF did", "what changed", "what needs attention", "next recommendation"],
    reason: "The client must see value without logging into a complicated dashboard.",
  },
  {
    cadence: "Monthly",
    title: "Offer and source review",
    owner: "Coach",
    checks: ["Google/Search changes", "offer language", "agent SOPs", "pricing conflicts"],
    reason: "Keeps the company aligned as Google Search changes.",
  },
  {
    cadence: "Quarterly",
    title: "Access and recovery review",
    owner: "Systems Director",
    checks: ["API keys", "Google access", "Vercel/GitHub access", "backup freshness", "restore path"],
    reason: "Keeps GMF recoverable as client count grows.",
  },
];
