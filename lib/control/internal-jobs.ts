export type ControlTone =
  | "default"
  | "accent"
  | "warm"
  | "hot"
  | "warn"
  | "ok"
  | "muted"
  | "danger";

export type ReachLane = {
  name: string;
  domain: string;
  status: string;
  rows: string;
  qa: string;
  importState: string;
  dripState: string;
  tone: ControlTone;
};

export type ReachStep = {
  order: number;
  agent: string;
  title: string;
  status: string;
  tone: ControlTone;
  whatHappened: string;
  leftToDo: string;
  evidence: string;
};

export type InternalJob = {
  slug: string;
  title: string;
  href: string;
  owner: string;
  status: string;
  statusTone: ControlTone;
  summary: string;
  currentBlocker: string;
  plainEnglish: string;
  metrics: {
    label: string;
    value: string;
    tone: ControlTone;
  }[];
  lanes: ReachLane[];
  steps: ReachStep[];
};

export type ReachWarmupAutopilot = {
  status: string;
  statusTone: ControlTone;
  currentBlocker: string;
  dailyLadder: string[];
  commands: {
    label: string;
    command: string;
    detail: string;
    tone: ControlTone;
  }[];
  guardrails: string[];
  visibility: string[];
};

export const REACH_JOB_HREF = "/mike-mc/jobs/reach-cold-email-campaign";

export const REACH_LANES: ReachLane[] = [
  {
    name: "Reviews",
    domain: "mail.aioutsourcehubs.com",
    status: "Auto warmup start executed today",
    rows: "12 OK contacts",
    qa: "No blockers",
    importState: "Imported",
    dripState: "Auto started",
    tone: "accent",
  },
  {
    name: "AI Visibility",
    domain: "mail.getaioutsourcehub.com",
    status: "Auto warmup start executed today",
    rows: "20 OK contacts",
    qa: "No blockers",
    importState: "Imported",
    dripState: "Auto started",
    tone: "accent",
  },
  {
    name: "Relay",
    domain: "mail.myaioutsourcehub.com",
    status: "Auto waiting for enough clean contacts and ready status",
    rows: "5 OK / 10 min",
    qa: "Needs refill + ready switch",
    importState: "2 OK contacts imported/tagged",
    dripState: "Auto waiting",
    tone: "warm",
  },
];

export const REACH_STEPS: ReachStep[] = [
  {
    order: 1,
    agent: "Manager",
    title: "Open the internal job",
    status: "Done",
    tone: "accent",
    whatHappened:
      "The Reach Cold Email Campaign job is active in the Slack/agent ledger and shows up in Mission Control.",
    leftToDo: "Keep the job visible until the send/no-send decision is clear.",
    evidence: "Slack /manager status can see the three Reach lanes.",
  },
  {
    order: 2,
    agent: "Scout",
    title: "Run discovery-first batches",
    status: "Done for this batch",
    tone: "accent",
    whatHappened:
      "The current small Reviews, AI Visibility, and Relay lists already exist. Future refills should start with business discovery before deeper enrichment spend.",
    leftToDo:
      "Only run paid Outscraper/Google Maps discovery when the daily cap and lane are clear, then suppress already-used contacts.",
    evidence: "Current source files are the tmp-reach CSV batches from 2026-05-20.",
  },
  {
    order: 3,
    agent: "Sender + verifier",
    title: "Verify email quality before import",
    status: "Done for this batch",
    tone: "accent",
    whatHappened:
      "The QA files separated OK rows from review flags such as personal email domains, duplicate contacts, and questionable business ownership.",
    leftToDo:
      "Do not use flagged rows unless Sales Manager explicitly clears them. Pre-send verification must happen before any start-drip approval.",
    evidence: "Relay kept 2 OK contacts and held 2 Cornell personal-email duplicate rows.",
  },
  {
    order: 4,
    agent: "Sales Manager",
    title: "Decide row-level QA",
    status: "Partly done",
    tone: "warm",
    whatHappened:
      "Relay QA is decided. Reviews and AI Visibility still need the same row-level keep/remove judgment.",
    leftToDo:
      "Review the remaining flagged rows before importing those lanes.",
    evidence: "Reviews has 7 flags / 1 OK. AI Visibility has 5 flags / 1 OK.",
  },
  {
    order: 5,
    agent: "GHL Expert",
    title: "Run read-only GHL readiness",
    status: "Passed",
    tone: "accent",
    whatHappened:
      "The API check confirmed the pipelines, cold workflows, and reply workflows exist for all three lanes.",
    leftToDo:
      "Remember this is structure only. It does not prove sender-domain screens or AI toggles are visually safe.",
    evidence: "Read-only GHL check passed without changing contacts, tags, workflows, or settings.",
  },
  {
    order: 6,
    agent: "GHL Expert + Mike",
    title: "Visual safety check",
    status: "Relay confirmed",
    tone: "warm",
    whatHappened:
      "Relay was visually confirmed for sender domain, warmup status, sender nodes, and HighLevel AI toggles OFF.",
    leftToDo:
      "Reviews and AI Visibility still need visual GHL review before import. Drip still needs its own readiness proof.",
    evidence: "Mike included the Relay visual confirmation in the approval command.",
  },
  {
    order: 7,
    agent: "Manager",
    title: "Approval gate",
    status: "Relay import approved",
    tone: "accent",
    whatHappened:
      "Manager accepted import-only approval for Relay after QA and visual confirmation cleared.",
    leftToDo:
      "Do not treat import approval as send approval. Start-drip needs a separate approval later.",
    evidence: "The approved command was import-only, not start-drip.",
  },
  {
    order: 8,
    agent: "GHL Expert",
    title: "Import-only into GHL",
    status: "Done for Relay",
    tone: "accent",
    whatHappened:
      "The 2 Relay OK contacts were imported/tagged in GHL. No emails were sent.",
    leftToDo:
      "Avoid importing Relay again. Continue only with drip readiness or the other lanes.",
    evidence: "Relay is now import_only_completed_waiting_drip_readiness.",
  },
  {
    order: 9,
    agent: "GHL Expert + Systems Director",
    title: "Auto start readiness",
    status: "Waiting",
    tone: "warm",
    whatHappened:
      "Reviews and AI Visibility started warmup automatically. Relay is waiting because it has 5 OK contacts and needs 10, and ready_for_drip is still no.",
    leftToDo:
      "Let the auto runner refill Relay with enough clean contacts and mark the lane ready after the sending checks pass.",
    evidence: "2026-05-21 warmup reports: Reviews 12 started, AI 20 started, Relay blocked at 5 OK rows and ready_for_drip=no.",
  },
  {
    order: 10,
    agent: "Sender",
    title: "Auto start emails",
    status: "Auto mode on",
    tone: "accent",
    whatHappened:
      "The guarded runner can start a lane automatically once it has enough clean contacts and the lane is marked ready.",
    leftToDo:
      "Do not ask Mike for another start approval. Keep the readiness switches accurate so auto can do its job.",
    evidence: "reach-warmup-autopilot.json has autopilot_start_enabled=true and requires ready_for_drip=yes.",
  },
];

export const REACH_PROCESS_FACTS = [
  {
    label: "Not wiring failure",
    detail:
      "Slack, the Manager command, and the read-only GHL check are working. The job is stopping because the safety gates are doing their job.",
  },
  {
    label: "Not rescraping every time",
    detail:
      "Asking for status reads the ledger, CSVs, and GHL readiness. Google Maps/Outscraper should only run again when a new/fresh batch is requested.",
  },
  {
    label: "Bad emails were handled",
    detail:
      "The questionable Relay personal-email rows were held out. Only the 2 QA OK Relay contacts were imported/tagged.",
  },
  {
    label: "Main handoff issue",
    detail:
      "The remaining issue is Relay only: it needs enough clean contacts and the ready switch set to yes. Reviews and AI already started guarded warmup.",
  },
];

export const REACH_WARMUP_AUTOPILOT: ReachWarmupAutopilot = {
  status: "Auto mode on",
  statusTone: "accent",
  currentBlocker:
    "Reviews and AI started today. Relay is waiting for 10 OK contacts and ready_for_drip=yes; then auto can start it without asking Mike again.",
  dailyLadder: [
    "Days 1-3: 10-20 emails/day per dedicated domain",
    "Days 4-6: 40-50 emails/day per dedicated domain",
    "Days 7-9: 80-100 emails/day per dedicated domain",
    "After Day 9: hold for deliverability review before increasing",
  ],
  commands: [
    {
      label: "Prepare only",
      command: "npm run reach:warmup -- --lane all",
      detail: "Finds, verifies, QA-filters, and refills contacts. Does not touch GHL.",
      tone: "muted",
    },
    {
      label: "Import only",
      command: "npm run reach:warmup -- --lane all --execute import",
      detail: "Imports/tags enough QA OK contacts for warmup. Does not send email.",
      tone: "accent",
    },
    {
      label: "Start warmup drip",
      command: "npm run reach:warmup -- --lane all --execute start",
      detail: "Adds start tags only when ready_for_drip=yes, enough clean contacts exist, and guardrails pass.",
      tone: "danger",
    },
  ],
  guardrails: [
    "max 5 refill attempts per lane per day",
    "max 100 scraped rows per attempt",
    "max 500 scraped rows per lane per day",
    "bad/risky emails are removed and replaced",
    "already imported or started contacts are not reused",
    "HighLevel AI features stay OFF",
  ],
  visibility: [
    "Mission Control now shows auto warmup status by lane.",
    "Local runs write reports into docs/client-ops-ledger/outbox.",
    "True live progress in production MC needs the runner connected to shared state or a deployed job trigger.",
  ],
};

export const REACH_INTERNAL_JOB: InternalJob = {
  slug: "reach-cold-email-campaign",
  title: "Internal Job: Reach Cold Email Campaign",
  href: REACH_JOB_HREF,
  owner: "Manager",
  status: "Auto warmup running",
  statusTone: "accent",
  summary:
    "Reviews and AI Visibility started guarded warmup today. Relay is waiting for enough clean contacts and ready status.",
  currentBlocker:
    "Relay has 5 OK contacts but needs 10, and ready_for_drip is still no. Auto will start it once both are fixed.",
  plainEnglish:
    "Auto is on. The system is running lanes that are ready and holding the lane that is not ready.",
  metrics: [
    { label: "Started today", value: "2 lanes", tone: "accent" },
    { label: "Reviews", value: "12 OK", tone: "accent" },
    { label: "AI", value: "20 OK", tone: "accent" },
    { label: "Relay", value: "5/10", tone: "warm" },
  ],
  lanes: REACH_LANES,
  steps: REACH_STEPS,
};

export const INTERNAL_JOBS: InternalJob[] = [REACH_INTERNAL_JOB];
