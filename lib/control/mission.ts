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
    slug: "review-automation",
    name: "Review Automation",
    job: "Get found",
    outcome: "Self-serve onboarding collects access, then agents configure GHL, GBP, review flows, QA, and monitoring.",
    agents: ["Manager", "Local Visibility Manager", "GHL Expert", "Sorter", "Systems Director", "Coach", "Scout"],
    skills: ["client-onboarding-intake", "gbp-manager-access", "ghl-review-setup", "list-readiness", "launch-qa"],
    activeClients: 0,
    openTasks: 3,
    blocked: 0,
  },
  {
    slug: "ai-visibility",
    name: "AI Visibility",
    job: "Get found",
    outcome: "Improves GBP, citations, reviews, and trust signals so AI/search can recommend the client.",
    agents: ["Local Visibility Manager", "GHL Expert", "Coach", "Systems Director"],
    skills: ["gbp-optimization", "citation-check", "review-health", "ai-search-tests"],
    activeClients: 0,
    openTasks: 4,
    blocked: 0,
  },
  {
    slug: "reach",
    name: "Reach",
    job: "Find customers",
    outcome: "Finds prospects, enriches contacts, sends outreach, sorts replies, and books qualified calls.",
    agents: ["Scout", "Enricher", "Sender", "Sorter", "Coach", "Booker"],
    skills: ["prospect-research", "contact-enrichment", "cold-email", "reply-triage", "calendar-booking"],
    activeClients: 0,
    openTasks: 5,
    blocked: 1,
  },
  {
    slug: "relay",
    name: "Relay",
    job: "Run business",
    outcome: "Answers calls, qualifies leads, books appointments, and hands off edge cases.",
    agents: ["Relay", "Scheduler", "Booker", "GHL Expert", "Systems Director"],
    skills: ["voice-agent", "call-routing", "booking-handoff", "qa-review", "overage-monitoring"],
    activeClients: 0,
    openTasks: 4,
    blocked: 0,
  },
  {
    slug: "publishing",
    name: "Publishing",
    job: "Stay visible",
    outcome: "Publishes approved content to social channels, newsletter, and Google Business Profile posts.",
    agents: ["Press", "Coach", "Local Visibility Manager"],
    skills: ["content-scheduling", "brand-voice-check", "gbp-post-handoff", "publish-proof"],
    activeClients: 0,
    openTasks: 2,
    blocked: 0,
  },
  {
    slug: "reporter",
    name: "Reporter",
    job: "Measure and report",
    outcome: "Builds, delivers, and QAs reports after website requests or warm campaign replies, then tracks marketing health, AI visibility, and lead outcomes.",
    agents: ["GHL Expert", "Editor", "Press", "Local Visibility Manager", "Systems Director"],
    skills: ["report-design", "data-assembly", "reply-triggered-delivery", "report-qa", "map-visibility-interpretation"],
    activeClients: 0,
    openTasks: 3,
    blocked: 0,
  },
];

export const AGENT_SKILLS: AgentSkillProfile[] = [
  {
    agent: "Manager",
    role: "Fleet orchestration, model routing, and work assignment",
    skills: [
      "task-routing",
      "model-tier-selection",
      "risk-classification",
      "reviewer-assignment",
      "proof-before-done",
      "handoff-planning",
      "client-blocker-triage",
      "launch-readiness",
      "antigravity-vscode-coordination",
      "cost-aware-agent-routing",
      "mike-escalation-rules",
      "ghl-supervision-map",
      "ghl-proof-checklists",
      "snapshot-risk-awareness",
      "workflow-launch-gates",
      "report-heatmap-proof",
      "daily-briefs",
    ],
    serviceOwners: ["All services"],
    sourceDocs: [
      "docs/AGENT_OPERATING_MODEL.md",
      "docs/MANAGER_ROUTING_SKILL_PACK.md",
      "docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md",
      "docs/REVIEW_AUTOMATION_AGENT_SKILLS.md",
      "docs/AOH_REACH_CAMPAIGN_OFFERS.md",
      "docs/AOH_REACH_CAMPAIGN_COPY.md",
    ],
  },
  {
    agent: "Local Visibility Manager",
    role: "Local presence and AI Visibility specialist",
    skills: [
      "gbp-manager-invite",
      "gbp-access-verification",
      "gbp-location-confirmation",
      "gbp-review-link",
      "gbp-verification-blockers",
      "citation-nap-check",
      "review-health",
      "ai-visibility-signals",
      "monthly-visibility-report",
    ],
    serviceOwners: ["Review Automation", "AI Visibility", "Publishing"],
    sourceDocs: [
      "docs/PROFILE_KNOWLEDGE_PACK.md",
      "docs/PROFILE_LOCAL_VISIBILITY_PACK.md",
      "docs/REVIEW_AUTOMATION_AGENT_SKILLS.md",
    ],
  },
  {
    agent: "GHL Expert",
    role: "CRM, automation, pipeline, webhook watchdog, and report delivery spine",
    skills: [
      "subaccount-setup",
      "snapshot-load",
      "custom-values",
      "contacts-import",
      "pipelines-opportunities",
      "workflow-builder",
      "calendar-sync",
      "round-robin-calendar-build",
      "booking-form-fields",
      "appointment-routing-workflows",
      "sms-email-phone-setup",
      "gbp-to-ghl-connection",
      "reputation-sync-check",
      "reviews-ai-setup",
      "review-widget",
      "workflow-health",
      "campaign-orchestration",
      "outscraper-handoff",
      "reply-triggered-reports",
      "lead-to-client-handoff",
      "report-delivery-qa",
      "report-generation-workflow",
    ],
    serviceOwners: ["Review Automation", "AI Visibility", "Relay", "Reporter"],
    sourceDocs: [
      "docs/GHL_CORE_KNOWLEDGE_PACK.md",
      "docs/GHL_WORKFLOWS_KNOWLEDGE_PACK.md",
      "docs/GHL_CALENDARS_CONVERSATIONS_PACK.md",
      "docs/GHL_INTEGRATIONS_TROUBLESHOOTING_PACK.md",
      "docs/GHL_EXPERT_KNOWLEDGE_PACK.md",
      "docs/REVIEW_AUTOMATION_AGENT_SKILLS.md",
    ],
  },
  {
    agent: "Scout",
    role: "Researcher for markets, prospects, and platform knowledge",
    skills: [
      "niche-search",
      "fit-scoring",
      "lead-list-building",
      "platform-doc-research",
      "source-summaries",
      "sop-update-proposals",
      "cheap-prefilter",
    ],
    serviceOwners: ["Reach", "Internal training"],
    sourceDocs: ["docs/AGENT_OPERATING_MODEL.md"],
  },
  {
    agent: "Enricher",
    role: "Contact and company enrichment",
    skills: ["email-finding", "phone-finding", "domain-validation", "dedupe"],
    serviceOwners: ["Reach"],
  },
  {
    agent: "Sender",
    role: "Outbound campaign sending",
    skills: ["cold-email", "sequence-management", "deliverability-watch", "coupon-offer-routing", "dynamic-email-template", "reply-first-report-cta"],
    serviceOwners: ["Reach"],
  },
  {
    agent: "Sorter",
    role: "Inbound reply triage and client list readiness",
    skills: [
      "reply-classification",
      "spam-filtering",
      "hot-lead-routing",
      "customer-list-cleanup",
      "field-mapping",
      "dedupe",
      "exclusion-check",
    ],
    serviceOwners: ["Reach", "Review Automation"],
    sourceDocs: ["docs/REVIEW_AUTOMATION_AGENT_SKILLS.md"],
  },
  {
    agent: "Coach",
    role: "Sales Q&A, product truth, and response drafting",
    skills: [
      "sop-library",
      "agent-training",
      "client-instructions",
      "self-serve-onboarding",
      "pricing-answers",
      "objection-handling",
      "brand-voice",
      "email-draft-approval",
      "template-merge-field-validation",
    ],
    serviceOwners: ["All sales-led services", "Internal training"],
    sourceDocs: [
      "docs/AGENT_OPERATING_MODEL.md",
      "docs/REVIEW_AUTOMATION_AGENT_SKILLS.md",
      "docs/CLIENT_REVIEW_AUTOMATION_ONBOARDING.md",
    ],
  },
  {
    agent: "Booker",
    role: "Appointment booking and handoff",
    skills: ["calendar-booking", "show-rate-followup", "meeting-briefs", "reschedule-handling"],
    serviceOwners: ["Reach", "Relay"],
  },
  {
    agent: "Scheduler",
    role: "Calendar protection and daily agenda",
    skills: ["focus-blocks", "calendar-triage", "meeting-briefs", "deadline-reminders"],
    serviceOwners: ["Internal ops", "Reach", "Relay"],
  },
  {
    agent: "Press",
    role: "Publishing and proof of publish",
    skills: ["social-publishing", "newsletter-publishing", "gbp-post-publishing", "publish-proof"],
    serviceOwners: ["Publishing"],
  },
  {
    agent: "Relay",
    role: "AI phone answering",
    skills: ["call-answering", "lead-qualification", "booking-transfer", "call-summary"],
    serviceOwners: ["Relay"],
  },
  {
    agent: "Systems Director",
    role: "IT, security, tool-stack, and fleet risk oversight",
    skills: [
      "launch-qa",
      "review-sync-check",
      "workflow-test-proof",
      "first-two-week-monitoring",
      "cost-anomaly-detection",
      "tech-stack-review",
      "tool-sprawl-check",
      "token-expiration-watch",
      "backup-readiness",
      "sla-drift",
      "stuck-client-detection",
    ],
    serviceOwners: ["All services"],
    sourceDocs: ["docs/AGENT_OPERATING_MODEL.md", "docs/REVIEW_AUTOMATION_AGENT_SKILLS.md"],
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
    title: "Build Campaign Reply Router for send/book replies",
    client: "AOH",
    service: "Reach",
    agent: "GHL Expert",
    reviewer: "Systems Director",
    status: "In Progress",
    priority: "P0",
    due: "Before scaled campaign send",
    tags: ["ghl", "reach", "reply-routing", "send", "book", "campaign-launch"],
    reviewChecks: [
      "Reply `send` triggers report request and exactly one delivery",
      "Reply `book` sends the AOH Talk booking link without unintended report generation",
      "Relay reply `send` sends missed-call details without default report generation",
      "Unclear replies create a Sorter review task and do not spend on reports",
      "Unsubscribe/STOP replies suppress follow-up and do not generate reports",
      "Duplicate guard blocks repeat report generation for the same contact",
      "Systems Director verifies GHL execution logs before scaled sending",
    ],
  },
  {
    title: "Approve controlled Reach offer lanes",
    client: "AOH",
    service: "Reach",
    agent: "Sender",
    reviewer: "Coach + Systems Director",
    status: "Review",
    priority: "P0",
    due: "Before first campaign send",
    tags: ["reach", "offers", "reviews", "ai-visibility", "relay", "deliverability"],
    reviewChecks: [
      "Reviews lane uses $1 first month, not a broad $1 for 2 months headline",
      "AI Visibility lane offers a free snapshot/report and keeps premium positioning",
      "Third domain is limited to Relay missed-call replies using `send`",
      "Each lane has one clear CTA and daily send cap before launch",
      "Draft copy is taken from docs/AOH_REACH_CAMPAIGN_COPY.md and adapted only after Coach review",
      "Systems Director confirms no scaled send happens before reply router QA",
    ],
  },
  {
    title: "Prepare first-hour campaign watch",
    client: "AOH",
    service: "Reach",
    agent: "Systems Director",
    reviewer: "Manager",
    status: "Assigned",
    priority: "P0",
    due: "Before first campaign send",
    tags: ["reach", "qa", "suppression", "router", "watch"],
    reviewChecks: [
      "Watch owner is assigned",
      "Emergency pause path is known",
      "STOP/unsubscribe/not interested suppression test passes",
      "Duplicate report prevention is verified",
      "Mission Control shows failures, replies, reports, and booked-call handoffs",
    ],
  },
  {
    title: "Build AOH /aoh-talk Discovery Round Robin calendar",
    client: "AOH",
    service: "Internal Sales Intake",
    agent: "GHL Expert",
    reviewer: "Systems Director",
    status: "Done",
    priority: "P0",
    due: "Completed 2026-05-18",
    tags: ["ghl", "calendar", "round-robin", "workflow", "sales-intake"],
    reviewChecks: [
      "Book one test call for each bottleneck answer",
      "Confirm correct tags and pipeline stages",
      "Confirm confirmation email and SMS reminders",
      "Confirm booking URL is /aoh-talk and shows no token/secrets",
    ],
  },
  {
    title: "Load agent-owned operating model into Coach",
    client: "AOH",
    service: "Internal Build",
    agent: "Coach",
    status: "In Progress",
    priority: "P0",
    due: "Next",
    tags: ["sop", "training", "agent-skills"],
  },
  {
    title: "Teach Local Visibility Manager GBP access + handoff rules",
    client: "AOH",
    service: "Review Automation",
    agent: "Local Visibility Manager",
    status: "Assigned",
    priority: "P0",
    due: "Next",
    tags: ["gbp", "manager-access", "reviews"],
  },
  {
    title: "Rotate exposed OpenClaw gateway token",
    client: "AOH",
    service: "Mission Control",
    agent: "Systems Director",
    status: "Done",
    priority: "P0",
    due: "Completed 2026-05-17",
    tags: ["security", "secrets", "openclaw"],
  },
  {
    title: "Teach GHL Expert Review Automation backend setup",
    client: "AOH",
    service: "Review Automation",
    agent: "GHL Expert",
    status: "Assigned",
    priority: "P0",
    due: "After Local Visibility Manager handoff rules",
    tags: ["ghl", "snapshot", "reputation"],
  },
  {
    title: "Create self-serve client onboarding instructions",
    client: "AOH",
    service: "Review Automation",
    agent: "Coach",
    status: "Review",
    priority: "P0",
    due: "Needs Mike review",
    tags: ["client-facing", "screenshots", "video"],
  },
  {
    title: "Record GBP manager invite walkthrough video",
    client: "AOH",
    service: "Review Automation",
    agent: "Local Visibility Manager",
    status: "Inbox",
    priority: "P1",
    due: "After client copy approval",
    tags: ["video", "screenshots", "gbp"],
  },
  {
    title: "Build Review Automation backend SOP from GHL packs",
    client: "AOH",
    service: "Review Automation",
    agent: "GHL Expert",
    status: "Assigned",
    priority: "P1",
    due: "After client onboarding approval",
    tags: ["ghl", "backend-sop", "qa"],
  },
  {
    title: "Scout current GHL + GBP docs monthly",
    client: "AOH",
    service: "Internal Training",
    agent: "Scout",
    status: "Assigned",
    priority: "P1",
    due: "Recurring",
    tags: ["research", "ghl", "gbp"],
  },
  {
    title: "Audit AOH Google Business Profile as first client",
    client: "AOH",
    service: "AI Visibility",
    agent: "Local Visibility Manager",
    status: "Assigned",
    priority: "P1",
    due: "After Local Visibility Manager skill pack",
    tags: ["client-zero", "gbp-audit"],
  },
  {
    title: "Add workflow execution count and webhook latency tracking",
    client: "AOH",
    service: "Review Automation",
    agent: "GHL Expert",
    status: "Inbox",
    priority: "P1",
    due: "Build slot 5c",
    tags: ["ghl", "monitoring"],
  },
  {
    title: "Build Sender for Reviews and AI Visibility campaigns",
    client: "AOH",
    service: "Reach",
    agent: "Sender",
    status: "Assigned",
    priority: "P1",
    due: "After reply router QA",
    tags: ["outreach", "warmup", "reply-first"],
    reviewChecks: [
      "Merge fields render cleanly",
      "Footer and unsubscribe are present",
      "From address uses the warmed dedicated domain",
      "CTA asks for reply `send` or `book`, not direct report click",
    ],
  },
  {
    title: "Define Slack commands for Mission Board",
    client: "AOH",
    service: "Mission Control",
    agent: "Manager",
    reviewer: "Systems Director",
    status: "Review",
    priority: "P2",
    due: "Command router wired 2026-05-20",
    tags: ["slack", "commands"],
    reviewChecks: [
      "Manager status and brief commands generate Slack-ready responses",
      "GHL Expert readiness command runs read-only checks only",
      "Sales Manager QA command summarizes review flags before Mike approval",
      "Approval commands produce exact Reach launch commands without live execution by default",
      "Pause command blocks campaign live actions",
    ],
  },
  {
    title: "Build Systems Director stack digest after pipeline has real volume",
    client: "AOH",
    service: "Internal Build",
    agent: "Systems Director",
    status: "Blocked / Later",
    priority: "P2",
    due: "After first clients",
    tags: ["digest", "risk"],
  },
  {
    title: "Build Reporter orchestration + reach-ghl-report-flow integration",
    client: "AOH",
    service: "Reporter",
    agent: "GHL Expert",
    reviewer: "Systems Director",
    status: "Review",
    priority: "P1",
    due: "Website lane verified; campaign lane depends on reply router",
    tags: ["ghl", "reporting", "outscraper", "campaign-orchestration"],
    reviewChecks: [
      "Outscraper→GHL prospect push working",
      "Marketing report + map visibility trigger waits for website request or warm campaign reply",
      "Reply `send` creates report request and delivery",
      "Reply `book` routes to AOH Talk booking handoff",
      "Report delivery log clean and no secret-bearing URLs are exposed",
    ],
  },
  {
    title: "Build client-facing chatbot",
    client: "AOH",
    service: "Future",
    agent: "Coach",
    status: "Blocked / Later",
    priority: "P3",
    due: "Last - after clients",
    tags: ["chatbot", "defer"],
  },
];

export const SCHEDULED_WORK: ScheduledWork[] = [
  {
    cadence: "Daily",
    title: "Fleet source health",
    owner: "Manager",
    checks: ["Vercel deploy", "GitHub latest commit", "GHL API", "Slack bot presence"],
    reason: "Catches broken pipes before client work depends on them.",
  },
  {
    cadence: "Daily",
    title: "Secret exposure sweep",
    owner: "Systems Director",
    checks: ["Tokens in URLs", "Secrets in source code", "Public screenshots", "Unsafe client-side env vars"],
    reason: "Catches leaked credentials before a screenshot, browser history, or repo commit turns them into an incident.",
  },
  {
    cadence: "Daily",
    title: "Inbox and reply SLA sweep",
    owner: "Sorter",
    checks: ["Unanswered emails", "Hot replies", "Oldest waiting thread", "Owner-needed replies"],
    reason: "Keeps sales and client replies from aging silently.",
  },
  {
    cadence: "Daily",
    title: "GHL workflow heartbeat",
    owner: "GHL Expert",
    checks: ["Review request sends", "Webhook errors", "Calendar sync", "Pipeline stage movement"],
    reason: "Review Automation and booking workflows must keep firing.",
  },
  {
    cadence: "Weekly",
    title: "Client risk review",
    owner: "Systems Director",
    checks: ["No-touch clients", "Blocked tasks", "Missed SLA", "Low review velocity"],
    reason: "At 50+ clients, only exceptions should demand your attention.",
  },
  {
    cadence: "Weekly",
    title: "Local visibility sweep",
    owner: "Local Visibility Manager",
    checks: ["GBP completeness", "New reviews", "Unanswered reviews", "Citation/NAP drift"],
    reason: "Local profiles decay unless someone watches the basics.",
  },
  {
    cadence: "Weekly",
    title: "Pipeline and revenue hygiene",
    owner: "Manager",
    checks: ["Stripe failed payments", "GHL opportunities", "Booked demos", "Stale deals"],
    reason: "Connects work status to money, not just activity.",
  },
  {
    cadence: "Weekly",
    title: "Data space and backup check",
    owner: "Manager",
    checks: ["Disk space", "Database/storage growth", "Backup freshness", "Log retention"],
    reason: "Prevents the boring infrastructure failures that become emergencies.",
  },
  {
    cadence: "Monthly",
    title: "Client report assembly",
    owner: "Coach",
    checks: ["Review gains", "Visibility work completed", "Lead outcomes", "Next recommendation"],
    reason: "Turns agent activity into client-visible proof.",
  },
  {
    cadence: "Monthly",
    title: "AI visibility benchmark",
    owner: "Local Visibility Manager",
    checks: ["ChatGPT/Claude prompts", "Google AI/Maps checks", "Competitor mentions", "Citation gaps"],
    reason: "Measures whether the visibility work is actually moving.",
  },
  {
    cadence: "Quarterly",
    title: "Access and disaster review",
    owner: "Systems Director",
    checks: ["API keys", "Slack permissions", "GHL access", "Restore drill", "Runbook freshness"],
    reason: "Keeps the system recoverable and safe as the client count grows.",
  },
];
