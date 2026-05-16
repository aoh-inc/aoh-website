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
  status: BoardStatus;
  priority: "P0" | "P1" | "P2" | "P3";
  due: string;
  tags: string[];
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
    outcome: "Asks every customer for a review, keeps review flow running, and flags profile gaps.",
    agents: ["GHL Expert", "Profile", "Coach"],
    skills: ["review-request-flow", "gbp-baseline-audit", "workflow-health", "monthly-digest"],
    activeClients: 0,
    openTasks: 3,
    blocked: 0,
  },
  {
    slug: "ai-visibility",
    name: "AI Visibility",
    job: "Get found",
    outcome: "Improves GBP, citations, reviews, and trust signals so AI/search can recommend the client.",
    agents: ["Profile", "GHL Expert", "Coach", "Auditor"],
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
    agents: ["Relay", "Scheduler", "Booker", "GHL Expert", "Auditor"],
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
    agents: ["Press", "Coach", "Profile"],
    skills: ["content-scheduling", "brand-voice-check", "gbp-post-handoff", "publish-proof"],
    activeClients: 0,
    openTasks: 2,
    blocked: 0,
  },
];

export const AGENT_SKILLS: AgentSkillProfile[] = [
  {
    agent: "Manager",
    role: "Fleet orchestration and work assignment",
    skills: ["task-routing", "handoff-planning", "sla-prioritization", "daily-briefs"],
    serviceOwners: ["All services"],
  },
  {
    agent: "Profile",
    role: "Local presence and AI Visibility specialist",
    skills: [
      "gbp-audit",
      "gbp-fix-up",
      "citation-nap-check",
      "review-health",
      "ai-visibility-signals",
      "monthly-profile-report",
    ],
    serviceOwners: ["Review Automation", "AI Visibility", "Publishing"],
  },
  {
    agent: "GHL Expert",
    role: "CRM, automation, pipeline, and webhook watchdog",
    skills: ["workflow-health", "pipeline-mapping", "webhook-latency", "calendar-sync", "sms-review-flow"],
    serviceOwners: ["Review Automation", "AI Visibility", "Relay"],
  },
  {
    agent: "Scout",
    role: "Prospect research",
    skills: ["niche-search", "fit-scoring", "lead-list-building", "warm-signal-detection"],
    serviceOwners: ["Reach"],
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
    skills: ["cold-email", "sequence-management", "deliverability-watch", "coupon-offer-routing"],
    serviceOwners: ["Reach"],
  },
  {
    agent: "Sorter",
    role: "Inbound reply triage",
    skills: ["reply-classification", "spam-filtering", "hot-lead-routing", "objection-tagging"],
    serviceOwners: ["Reach"],
  },
  {
    agent: "Coach",
    role: "Sales Q&A, product truth, and response drafting",
    skills: ["pricing-answers", "objection-handling", "brand-voice", "sales-reply-drafts"],
    serviceOwners: ["All sales-led services"],
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
    agent: "Auditor",
    role: "Smart oversight across the fleet",
    skills: ["cost-anomaly-detection", "sla-drift", "stuck-client-detection", "cross-agent-patterns"],
    serviceOwners: ["All services"],
  },
];

export const BOARD_COLUMNS: BoardStatus[] = [
  "Inbox",
  "Assigned",
  "In Progress",
  "Waiting on Human",
  "Review",
  "Blocked / Later",
];

export const BOARD_TASKS: BoardTask[] = [
  {
    title: "Build Coach retrieval over training vault",
    client: "AOH",
    service: "Internal Build",
    agent: "Coach",
    status: "In Progress",
    priority: "P0",
    due: "May 25",
    tags: ["slack", "sales-qa", "vault-index"],
  },
  {
    title: "Create Profile agent identity and skill pack",
    client: "AOH",
    service: "AI Visibility",
    agent: "Profile",
    status: "Assigned",
    priority: "P0",
    due: "Next",
    tags: ["gbp", "citations", "reviews"],
  },
  {
    title: "Audit AOH Google Business Profile as first client",
    client: "AOH",
    service: "AI Visibility",
    agent: "Profile",
    status: "Assigned",
    priority: "P1",
    due: "After Profile identity",
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
    status: "Blocked / Later",
    priority: "P1",
    due: "After Coach",
    tags: ["outreach", "warmup"],
  },
  {
    title: "Define Slack commands for Mission Board",
    client: "AOH",
    service: "Mission Control",
    agent: "Manager",
    status: "Inbox",
    priority: "P2",
    due: "After board data",
    tags: ["slack", "commands"],
  },
  {
    title: "Build Auditor digest after pipeline has real volume",
    client: "AOH",
    service: "Internal Build",
    agent: "Auditor",
    status: "Blocked / Later",
    priority: "P2",
    due: "After first clients",
    tags: ["digest", "risk"],
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
    owner: "Auditor",
    checks: ["No-touch clients", "Blocked tasks", "Missed SLA", "Low review velocity"],
    reason: "At 50+ clients, only exceptions should demand your attention.",
  },
  {
    cadence: "Weekly",
    title: "Profile visibility sweep",
    owner: "Profile",
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
    checks: ["Review gains", "Profile work completed", "Lead outcomes", "Next recommendation"],
    reason: "Turns agent activity into client-visible proof.",
  },
  {
    cadence: "Monthly",
    title: "AI visibility benchmark",
    owner: "Profile",
    checks: ["ChatGPT/Claude prompts", "Google AI/Maps checks", "Competitor mentions", "Citation gaps"],
    reason: "Measures whether the visibility work is actually moving.",
  },
  {
    cadence: "Quarterly",
    title: "Access and disaster review",
    owner: "Auditor",
    checks: ["API keys", "Slack permissions", "GHL access", "Restore drill", "Runbook freshness"],
    reason: "Keeps the system recoverable and safe as the client count grows.",
  },
];
