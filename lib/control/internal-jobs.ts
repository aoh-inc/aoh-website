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
    status: "Waiting on contact review before sending",
    rows: "8 QA rows",
    qa: "7 review flags / 1 OK",
    importState: "Import allowed after gate",
    dripState: "Drip not ready",
    tone: "warn",
  },
  {
    name: "AI Visibility",
    domain: "mail.getaioutsourcehub.com",
    status: "Waiting on contact review before sending",
    rows: "6 QA rows",
    qa: "5 review flags / 1 OK",
    importState: "Import allowed after gate",
    dripState: "Drip not ready",
    tone: "warn",
  },
  {
    name: "Relay",
    domain: "mail.myaioutsourcehub.com",
    status: "Import-only complete; waiting drip readiness",
    rows: "4 QA rows",
    qa: "2 review flags / 2 OK",
    importState: "2 OK contacts imported/tagged",
    dripState: "Drip not ready",
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
    title: "Drip readiness",
    status: "Blocked",
    tone: "danger",
    whatHappened:
      "This is the real stop sign. Relay is imported, but ready_for_drip is still no.",
    leftToDo:
      "Confirm warmup, sender nodes, caps, unsubscribe/reply routing, and final no-AI safety before any drip can start.",
    evidence: "Current ledger says drip no / ready_for_drip=no.",
  },
  {
    order: 10,
    agent: "Sender",
    title: "Start drip / send emails",
    status: "Not started",
    tone: "muted",
    whatHappened:
      "No live drip or cold-email send has started from this process.",
    leftToDo:
      "Start only after ready_for_drip=yes and Mike gives a separate start-drip approval.",
    evidence: "Slack output repeatedly reports no drip started and no workflows/settings changed.",
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
      "The next handoff is not another import. It is drip readiness: warmup, sender nodes, caps, unsubscribe/reply routing, and no HighLevel AI toggles.",
  },
];

export const REACH_WARMUP_AUTOPILOT: ReachWarmupAutopilot = {
  status: "Armed, not running",
  statusTone: "warm",
  currentBlocker:
    "Start-drip remains blocked until each lane is marked ready_for_drip=yes. Import-only can run before that.",
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
      detail: "Adds start tags only when ready_for_drip=yes and guardrails pass.",
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
    "Mission Control now shows the warmup plan and exact commands.",
    "Local runs write reports into docs/client-ops-ledger/outbox.",
    "True live progress in production MC needs the runner connected to shared state or a deployed job trigger.",
  ],
};

export const REACH_INTERNAL_JOB: InternalJob = {
  slug: "reach-cold-email-campaign",
  title: "Internal Job: Reach Cold Email Campaign",
  href: REACH_JOB_HREF,
  owner: "Manager",
  status: "Waiting on drip readiness",
  statusTone: "warm",
  summary:
    "Relay import-only is complete for the 2 clean contacts. Reviews and AI Visibility still need QA/visual review. No drip has started.",
  currentBlocker:
    "ready_for_drip is still no. The system should not send until drip readiness is proven and Mike separately approves start-drip.",
  plainEnglish:
    "The job is not stuck because Slack is broken. It is paused between importing clean contacts and actually sending emails.",
  metrics: [
    { label: "Relay imported", value: "2 OK", tone: "accent" },
    { label: "Emails sent", value: "0", tone: "muted" },
    { label: "Lanes still waiting", value: "2", tone: "warn" },
    { label: "Drip ready", value: "No", tone: "danger" },
  ],
  lanes: REACH_LANES,
  steps: REACH_STEPS,
};

export const INTERNAL_JOBS: InternalJob[] = [REACH_INTERNAL_JOB];
