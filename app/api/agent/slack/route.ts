import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { after, NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const JOBS_PATH = "docs/client-ops-ledger/agent-jobs.csv";
const DOMAINS_PATH = "docs/client-ops-ledger/sending-domain-readiness.csv";
const WARMUP_CONFIG_PATH = "docs/client-ops-ledger/reach-warmup-autopilot.json";
const DAILY_BRIEF_PATH = "docs/client-ops-ledger/daily-brief-current.md";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const DEFAULT_AGENT_CHANNEL_ID = "C0ATTA4NBR8";
const OWNER_SLACK_USER_ID = process.env.AOH_OWNER_SLACK_USER_ID?.trim() || "U0ATPQYFA85";
const OWNER_FIRST_NAME = process.env.AOH_OWNER_FIRST_NAME?.trim() || "Mike";
const OWNER_FORMAL_NAME = process.env.AOH_OWNER_FORMAL_NAME?.trim() || "Mr. Egidio";
const configuredGhlCacheTtlMs = Number(process.env.GHL_READINESS_CACHE_TTL_MS ?? 5 * 60 * 1000);
const GHL_READINESS_CACHE_TTL_MS = Number.isFinite(configuredGhlCacheTtlMs) ? configuredGhlCacheTtlMs : 5 * 60 * 1000;

type CsvRow = Record<string, string>;
type GhlResult = { ok: boolean; lines: string[]; cacheAgeSeconds?: number };
type SlackMessage = {
  user?: string;
  bot_id?: string;
  subtype?: string;
  text?: string;
  ts?: string;
  thread_ts?: string;
};

type WarmupQuota = {
  name?: string;
  from_day?: number | string;
  to_day?: number | string;
  min?: number;
  target?: number;
  max?: number;
};

type WarmupConfig = {
  enabled?: boolean;
  planned_start_date?: string;
  daily_quota_ladder?: WarmupQuota[];
  guardrails?: {
    require_outscraper_spend_approval?: boolean;
    max_total_scraped_per_run?: number | string;
  };
  mode?: string;
  autopilot_start_enabled?: boolean;
};

type LaneKey = "reviews" | "ai" | "relay";
type LaneInput = LaneKey | "all" | string;
type AgentKey =
  | "general-manager"
  | "scheduler"
  | "systems-director"
  | "ghl-expert"
  | "sales-manager"
  | "scout"
  | "sender"
  | "sorter"
  | "booker"
  | "engagement-scout"
  | "client-success-manager"
  | "hub"
  | "reporter"
  | "local-visibility-manager"
  | "reviews-manager"
  | "relay-manager"
  | "coach"
  | "editor"
  | "press";

type UserContext = {
  userId: string;
  name: string;
  isMike: boolean;
  tone: "first-name" | "formal";
};

type AgentResponseContext = {
  channel?: string;
  threadTs?: string;
  responseUrl?: string;
};

let ghlReadinessCache: { fetchedAt: number; result: GhlResult } | null = null;
let slackBotUserIdCache: string | null = null;

const LANES: Record<
  LaneKey,
  {
    label: string;
    aliases: string[];
    pipeline: string;
    coldWorkflow: string;
    replyWorkflow: string;
  }
> = {
  reviews: {
    label: "Reviews",
    aliases: ["reviews", "review"],
    pipeline: "Reach - Reviews",
    coldWorkflow: "Reviews Special - Pilot Drip",
    replyWorkflow: "Campaign Reply - Reviews Send",
  },
  ai: {
    label: "AI Visibility",
    aliases: ["ai", "ai visibility", "visibility"],
    pipeline: "Reach - AI",
    coldWorkflow: "AI Visibility - Pilot Drip",
    replyWorkflow: "Campaign Reply - AI Visibility Send",
  },
  relay: {
    label: "Relay",
    aliases: ["relay"],
    pipeline: "Reach - Relay",
    coldWorkflow: "Relay - Pilot Drip",
    replyWorkflow: "Campaign Reply - Relay Send",
  },
};

const AGENTS: Record<
  AgentKey,
  {
    title: string;
    persona: string;
    aliases: string[];
    reportsTo: string;
    job: string;
    canDo: string[];
    nextStep: string;
    safety?: string;
  }
> = {
  "general-manager": {
    title: "General Manager",
    persona: "Elon Musk",
    aliases: ["general manager", "manager", "gm", "elon"],
    reportsTo: "President",
    job: "Runs the agent company day to day, prepares the brief, filters noise, owns the approval queue, assigns owners, tracks blockers, and escalates to Mike.",
    canDo: ["prepare the daily brief", "run Reach Cold Email Campaign", "explain warmup autopilot", "route work to agents", "show status", "explain blockers"],
    nextStep: "Ask: `Manager, run Reach Cold Email Campaign` or `Manager, status`.",
  },
  scheduler: {
    title: "Scheduler",
    persona: "Stephen Covey",
    aliases: ["scheduler", "stephen covey", "stephen", "covey"],
    reportsTo: "General Manager",
    job: "Protects calendars, booking availability, reminders, and meeting context.",
    canDo: ["check calendar readiness", "prepare meeting context", "watch booking handoffs"],
    nextStep: "Ask: `Scheduler, what meetings or booking issues need attention`.",
  },
  "systems-director": {
    title: "Systems Director",
    persona: "Bill Gates",
    aliases: ["systems director", "system director", "systems", "bill gates", "bill"],
    reportsTo: "General Manager",
    job: "Owns IT, security, access, backups, costs, and cross-agent risk.",
    canDo: ["check tool/access risk", "explain model cost routing", "review live-action safety"],
    nextStep: "Ask: `Systems Director, check risks before this campaign`.",
    safety: "Will not approve billing/tool changes without Mike approval.",
  },
  "ghl-expert": {
    title: "GHL Expert",
    persona: "Paul Allen",
    aliases: ["ghl expert", "ghl", "paul allen", "paul"],
    reportsTo: "Systems Director",
    job: "Owns hub360ai/GHL workflows, pipelines, tags, callbacks, reports, and automation health.",
    canDo: ["run read-only Reach readiness", "verify pipelines/workflows", "explain GHL blockers"],
    nextStep: "Ask: `GHL Expert, check Reach readiness`.",
    safety: "Will not change GHL workflows, import contacts, start drips, or enable HighLevel AI without approval.",
  },
  "sales-manager": {
    title: "Sales Manager",
    persona: "Zig Ziglar",
    aliases: ["sales manager", "sales", "zig ziglar", "zig"],
    reportsTo: "General Manager",
    job: "Owns campaign strategy, pipeline quality, reply follow-up, and booked-call handoffs.",
    canDo: ["review Reach QA", "recommend lane priority", "call out list quality risk"],
    nextStep: "Ask: `Sales Manager, review Reach QA`.",
  },
  scout: {
    title: "Scout",
    persona: "TBD",
    aliases: ["scout"],
    reportsTo: "Sales Manager",
    job: "Finds prospects, weak profiles, review gaps, niche signals, and cheap prefilter evidence.",
    canDo: ["suggest prospect niches", "explain fit signals", "flag list quality issues"],
    nextStep: "Ask: `Scout, what prospect lane should we test next`.",
  },
  sender: {
    title: "Sender",
    persona: "TBD",
    aliases: ["sender"],
    reportsTo: "Sales Manager",
    job: "Prepares outreach, watches deliverability, validates merge fields, and keeps campaigns reply-first.",
    canDo: ["explain import/start commands", "check send-lane guardrails", "prepare campaign send plan"],
    nextStep: "Ask: `Sender, prepare the next import-only plan`.",
    safety: "Will not import or start drip from Slack by default.",
  },
  sorter: {
    title: "Sorter",
    persona: "TBD",
    aliases: ["sorter"],
    reportsTo: "Sales Manager",
    job: "Classifies replies, catches hot leads, handles opt-outs, and routes unclear messages.",
    canDo: ["explain reply categories", "route interested/opt-out/unclear replies", "summarize reply risk"],
    nextStep: "Ask: `Sorter, how should we classify this reply: ...`.",
  },
  booker: {
    title: "Booker",
    persona: "TBD",
    aliases: ["booker"],
    reportsTo: "Sales Manager",
    job: "Turns buying intent into booked calls and clean meeting handoffs.",
    canDo: ["recommend booking handoff", "prepare call context", "route book-intent replies"],
    nextStep: "Ask: `Booker, prepare a handoff for this interested lead`.",
  },
  "engagement-scout": {
    title: "Engagement Scout",
    persona: "Gary Vaynerchuk",
    aliases: ["engagement scout", "engagement", "gary vaynerchuk", "gary v", "gary"],
    reportsTo: "Sales Manager",
    job: "Finds social conversations worth entering and drafts comments or DM suggestions.",
    canDo: ["suggest engagement opportunities", "draft comment ideas", "flag social follow-ups"],
    nextStep: "Ask: `Engagement Scout, what social conversations are worth entering`.",
    safety: "Will draft only; no public posting or DMs without approval.",
  },
  "client-success-manager": {
    title: "Client Success Manager",
    persona: "TBD",
    aliases: ["client success manager", "client success", "csm"],
    reportsTo: "General Manager",
    job: "Owns onboarding health, client check-ins, renewals, retention risk, and reporting cadence.",
    canDo: ["summarize client health", "flag retention risks", "prepare client check-in priorities"],
    nextStep: "Ask: `Client Success, what client risks need attention`.",
  },
  hub: {
    title: "Hub",
    persona: "Jarvis",
    aliases: ["hub", "jarvis"],
    reportsTo: "Client Success Manager",
    job: "Answers account questions from the ledger, GHL, Drive, client notes, and delivery history.",
    canDo: ["look up account status", "explain where records live", "summarize known client facts"],
    nextStep: "Ask: `Hub, what do we know about this account`.",
  },
  reporter: {
    title: "Reporter",
    persona: "TBD",
    aliases: ["reporter"],
    reportsTo: "Client Success Manager",
    job: "Confirms report links open, match the right contact, and tell a useful story.",
    canDo: ["QA report delivery", "summarize report proof", "flag missing report links"],
    nextStep: "Ask: `Reporter, verify report delivery status`.",
  },
  "local-visibility-manager": {
    title: "Local Visibility Manager",
    persona: "TBD",
    aliases: ["local visibility manager", "local visibility", "local vis", "visibility manager"],
    reportsTo: "Client Success Manager",
    job: "Owns Google Business Profile access, profile health, citations, review links, and AI visibility signals.",
    canDo: ["check visibility gaps", "summarize GBP readiness", "recommend local profile work"],
    nextStep: "Ask: `Local Visibility Manager, what visibility gaps matter today`.",
  },
  "reviews-manager": {
    title: "Reviews Manager",
    persona: "TBD",
    aliases: ["reviews manager", "review manager", "reviews"],
    reportsTo: "Client Success Manager",
    job: "Owns review automation delivery, review request health, replies, and review-volume warnings.",
    canDo: ["summarize review health", "flag review automation risk", "recommend review next actions"],
    nextStep: "Ask: `Reviews Manager, check review automation health`.",
  },
  "relay-manager": {
    title: "Relay Manager",
    persona: "Oprah",
    aliases: ["relay manager", "relay"],
    reportsTo: "Client Success Manager",
    job: "Owns voice-agent delivery, missed-call recovery, call summaries, routing quality, and escalation issues.",
    canDo: ["summarize call/voice-agent readiness", "flag missed-call risks", "recommend Relay follow-ups"],
    nextStep: "Ask: `Relay Manager, check Relay readiness`.",
  },
  coach: {
    title: "Coach",
    persona: "Dale Carnegie",
    aliases: ["coach", "dale carnegie", "dale"],
    reportsTo: "General Manager",
    job: "Keeps product truth, SOPs, sales language, client instructions, and response drafts aligned.",
    canDo: ["review wording", "draft client-safe responses", "explain product truth"],
    nextStep: "Ask: `Coach, review this copy: ...`.",
  },
  editor: {
    title: "Editor",
    persona: "James Patterson",
    aliases: ["editor", "james patterson", "james"],
    reportsTo: "General Manager",
    job: "Chooses angles, priorities, brand voice, and what content is worth making.",
    canDo: ["choose content angles", "review messaging", "prioritize ideas"],
    nextStep: "Ask: `Editor, what angle should this content take`.",
  },
  press: {
    title: "Press",
    persona: "Ted Turner",
    aliases: ["press", "ted turner", "ted"],
    reportsTo: "General Manager",
    job: "Publishes approved content and records proof that it went out correctly.",
    canDo: ["prepare publish checklist", "summarize publish proof", "flag content scheduling needs"],
    nextStep: "Ask: `Press, what is ready to publish`.",
    safety: "Will not publish public content without approval.",
  },
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const auth = verifySlackRequest(req, rawBody);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return handleJsonEvent(req, rawBody);
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return handleSlashLikeCommand(rawBody);
  }

  return NextResponse.json({ ok: false, error: "Unsupported Slack payload." }, { status: 415 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (url.searchParams.get("poll") !== "1") {
    return NextResponse.json({ ok: true, endpoint: "slack-agent" });
  }

  const auth = verifyCronRequest(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const result = await pollSlackCommands();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

async function handleJsonEvent(req: NextRequest, rawBody: string) {
  const payload = safeJson(rawBody);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (payload.type === "url_verification" && typeof payload.challenge === "string") {
    return new Response(payload.challenge, {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }

  if (payload.type !== "event_callback") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const event = asRecord(payload.event);
  if (event.subtype || event.bot_id) return NextResponse.json({ ok: true, ignored: "bot_or_subtype" });

  const text = typeof event.text === "string" ? event.text.trim() : "";
  const channel = typeof event.channel === "string" ? event.channel : "";
  const threadTs = typeof event.thread_ts === "string" ? event.thread_ts : undefined;
  const actor = buildUserContext({
    userId: typeof event.user === "string" ? event.user : "",
    commandText: text,
  });

  if (!text || !channel || !isSupportedCommand(text)) {
    return NextResponse.json({ ok: true, ignored: "not_agent_command" });
  }
  if (!isAllowedChannel(channel)) {
    return NextResponse.json({ ok: true, ignored: "not_allowed_channel" });
  }

  scheduleSlackEventResponse({ channel, command: text, actor, threadTs });

  return NextResponse.json({ ok: true, queued: true });
}

async function handleSlashLikeCommand(rawBody: string) {
  const params = new URLSearchParams(rawBody);
  const commandText = params.get("text")?.trim() || "Manager, status";
  const text = startsWithKnownAgent(commandText) || commandText.match(/^(approve|pause)\b/i)
    ? commandText
    : `Manager, ${commandText}`;

  const actor = buildUserContext({
    userId: params.get("user_id") ?? "",
    fallbackName: params.get("user_name") ?? "",
    commandText: text,
  });
  const responseUrl = params.get("response_url") ?? "";
  const channel = params.get("channel_id") ?? "";

  if (shouldRunAsync(text)) {
    scheduleSlackFollowup({ responseUrl, channel, command: text, actor });
    return NextResponse.json({
      response_type: "in_channel",
      text: buildAsyncAcknowledgement(text, actor),
    });
  }

  const response = await buildAgentResponse(text, actor, { channel, responseUrl });
  return NextResponse.json({
    response_type: "in_channel",
    text: response,
  });
}

async function buildAgentResponse(command: string, actor = buildUserContext(), context: AgentResponseContext = {}): Promise<string> {
  const normalized = normalizeCommand(command);

  if (normalized.includes("pause all campaign live actions")) {
    return `*Manager pause acknowledged - ${today()}*

${address(actor)}, all campaign live actions are blocked.

- Do not import contacts into GHL.
- Do not add start-drip tags.
- Do not enable or toggle any HighLevel AI feature.
- Continue read-only checks and local prep only.`;
  }

  const approval = parseApproval(normalized);
  if (approval) return buildApprovalResponse(approval, actor);

  if (mentionsTeamTraining(normalized)) return buildReachTeamTrainingResponse(actor);

  if (mentionsOwnerPeek(normalized)) return buildOwnerPeekResponse(actor);

  if (mentionsReachRunStatusQuestion(normalized)) return buildReachRunTodayResponse(actor);

  if (mentionsColdReachStart(normalized)) return buildColdReachStartResponse(actor, normalized, context);

  if (mentionsGenericCampaignDeploy(normalized)) return buildCampaignClarificationResponse(actor);

  if (mentionsWarmupAutopilot(normalized)) return buildWarmupAutopilotResponse(actor, normalized);

  if (mentionsReachCampaignStatus(normalized)) return buildReachCampaignStatusResponse(actor);

  if (mentionsReachDecisionQuestion(normalized)) return buildReachDecisionResponse(actor);

  if (mentionsReachColdEmailCampaign(normalized)) {
    return buildReachColdEmailCampaignResponse(actor, { forceFreshGhl: wantsFreshCheck(normalized) });
  }
  if (mentionsAgentList(normalized)) return buildAgentListResponse(actor);

  if (mentionsGhlVisualReadiness(normalized)) {
    return buildGhlVisualChecklistResponse(actor, findLaneKey(normalized));
  }

  if (mentionsGhlReadiness(normalized)) {
    const result = await runGhlReadinessCheck({ forceFresh: wantsFreshCheck(normalized) });
    return `${renderGhlResult(result, actor)}

${buildManagerStatus(actor)}`;
  }

  if (mentionsQaReview(normalized)) return buildQaResponse(actor, normalized);

  const addressedAgent = findAddressedAgent(normalized);
  if (addressedAgent) {
    if (addressedAgent === "general-manager" && mentionsBrief(normalized)) return buildManagerStatus(actor);
    return buildAgentRoleResponse(addressedAgent, actor);
  }

  if (mentionsBrief(normalized)) return buildManagerStatus(actor);

  return `*Manager command not recognized - ${today()}*

Supported examples:

\`\`\`text
Manager, status
Manager, is Reach set to run today, and do I need anything?
Manager, start cold reach campaign
Manager, train Reach team
Manager, owner peek
Manager, run Reach Cold Email Campaign
Manager, show Reach warmup autopilot
Manager, explain the Reach result
Manager, are we ready to send?
Manager, list agents
Coach, review this copy: ...
Scheduler, what needs attention
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
approve relay import only
pause all campaign live actions
\`\`\``;
}

async function buildReachColdEmailCampaignResponse(actor: UserContext, { forceFreshGhl = false } = {}) {
  const summaries = laneSummaries();
  const recommendation = readRecommendation();
  const ghlResult = await runGhlReadinessCheck({ forceFresh: forceFreshGhl });
  const cacheNote = typeof ghlResult.cacheAgeSeconds === "number" ? ` (cached ${ghlResult.cacheAgeSeconds}s ago)` : "";
  const relayImportCompleted = summaries.some(
    (summary) => summary.laneKey === "relay" && summary.status.includes("import_only_completed"),
  );
  const nextApprovalText = relayImportCompleted
    ? "No import approval is needed for Relay right now. Auto is waiting for enough clean contacts and `ready_for_drip=yes`."
    : "Recommended next approval, if Mike wants to move today:\n\n```text\napprove relay import only\n```";

  return `*Reach Cold Email Campaign - ${today()}*

${address(actor)}, I ran today's active Reach Cold Email Campaign routine.

What ran:

- Sales Manager QA summary from the current prepared lanes.
- GHL Expert read-only readiness check.
- Manager approval gate review.

GHL Expert result: ${ghlResult.ok ? "read-only API check passed" : "read-only API check needs attention"}${cacheNote}

Current lanes:

${summaries.map(renderLaneBullet).join("\n")}

What still needs work:

- Auto warmup is on for lanes that pass guardrails.
- Relay needs enough clean contacts and \`ready_for_drip=yes\`.
- HighLevel AI toggles must stay OFF.

${nextApprovalText}

Do not manually override auto.

Safety:

- ${relayImportCompleted ? "Relay import-only already imported/tagged the 2 QA OK contacts. This check imported no new contacts." : "No contacts were imported."}
- No drip was started.
- No GHL workflows or settings were changed.
- No HighLevel AI features were enabled or toggled.

Plain-English recommendation:

${recommendation}`;
}

function buildManagerStatus(actor = buildUserContext()) {
  const summaries = laneSummaries();
  const waiting = reachJobs().filter((job) => String(job.status ?? "").includes("waiting")).length;
  const relayImportCompleted = summaries.some(
    (summary) => summary.laneKey === "relay" && summary.status.includes("import_only_completed"),
  );
  const nextCommands = [
    "Manager, list agents",
    "Manager, is Reach set to run today, and do I need anything?",
    "Manager, run Reach Cold Email Campaign",
    "GHL Expert, check Reach readiness",
    "Sales Manager, review Reach QA",
    ...(relayImportCompleted ? [] : ["approve relay import only"]),
    "pause all campaign live actions",
  ];

  return `*Manager status - ${today()}*

${address(actor)}, here is the current operating picture.

Current position:

- ${summaries.length} Reach prep jobs are in the queue; ${waiting} are waiting on agent review.
- The scheduled auto runner owns normal import/start work inside guardrails; this listener explains and routes blockers.
- Default Slack command channel is \`#04-aoh-ops\`.

Reach queue:

${summaries.map(renderLaneBullet).join("\n")}

Mike can say:

\`\`\`text
${nextCommands.join("\n")}
\`\`\``;
}

function buildReachCampaignStatusResponse(actor: UserContext) {
  const summaries = laneSummaries();
  const waiting = reachJobs().filter((job) => String(job.status ?? "").includes("waiting")).length;

  return `*Reach Cold Email Campaign status - ${today()}*

${address(actor)}, here is the current Reach status.

Current position:

- ${summaries.length} Reach lanes are staged.
- ${waiting} lanes are still waiting on Sales Manager QA and visual GHL review.
- The scheduled auto runner owns normal import/start work inside guardrails.
- This status command did not take live action or run a fresh GHL API check.

Reach queue:

${summaries.map(renderLaneBullet).join("\n")}

Next useful commands:

\`\`\`text
Sales Manager, review Reach QA
GHL Expert, check Reach readiness
Manager, run Reach Cold Email Campaign
\`\`\``;
}

function buildReachRunTodayResponse(actor: UserContext) {
  const summaries = laneSummaries();
  const config = warmupConfig();
  const autoOn = config?.autopilot_start_enabled === true || config?.enabled === true || String(config?.mode ?? "").includes("autopilot");
  const started = summaries.filter((summary) => summary.status.includes("auto_warmup_started"));
  const waiting = summaries.filter((summary) => !summary.status.includes("auto_warmup_started"));
  const startedText = started.length ? started.map((summary) => summary.label).join(" and ") : "none yet";
  const waitingText = waiting.length ? waiting.map(renderOwnerLaneStatus).join("\n") : "- Nothing is waiting right now.";

  return `*Reach today - ${today()}*

${address(actor)}, short answer: ${autoOn ? "yes, auto is set." : "no, auto is not turned on in the ledger."}

- Already moving: ${startedText}.
- Runs: discovery/refill around 7:30 AM ET on weekdays; send check around 9:00 AM ET daily.
- Your action: none right now.
- Safety: emails are checked by NeverBounce before GHL, and HighLevel AI stays OFF.

Relay plan:

${waitingText}`;
}

function renderOwnerLaneStatus(summary: ReturnType<typeof laneSummaries>[number]) {
  if (summary.status.includes("auto_waiting")) {
    return `- ${summary.label}: keeps pulling from the approved search list, drops risky contacts, and sends only after the list is clean enough.`;
  }
  return `- ${summary.label}: ${summary.status.replaceAll("_", " ")}.`;
}

function buildReachDecisionResponse(actor: UserContext) {
  const summaries = laneSummaries();
  const waiting = reachJobs().filter((job) => String(job.status ?? "").includes("waiting")).length;
  const dripReady = summaries.filter((summary) => String(summary.dripReady).toLowerCase() === "yes").length;
  const importReady = summaries.filter((summary) => String(summary.importReady).toLowerCase() === "yes").length;
  const recommendation = readRecommendation();
  const relayImportCompleted = summaries.some(
    (summary) => summary.laneKey === "relay" && summary.status.includes("import_only_completed"),
  );
  const nextCommands = relayImportCompleted
    ? ["/manager status", "/manager GHL Expert, check Reach readiness fresh"]
    : [
        "/manager Sales Manager, review Reach QA",
        "/manager GHL Expert, check Reach readiness fresh",
        "/manager approve relay import only",
      ];
  const statusLine = relayImportCompleted
    ? "- Auto warmup is active. Reviews and AI Visibility started today; Relay is still waiting."
    : "- The team preflight ran. No live action ran.";
  const bestMove = relayImportCompleted
    ? "1. Keep auto mode on.\n2. Refill Relay to at least 10 OK contacts.\n3. Mark Relay `ready_for_drip=yes` only after checks pass; auto will start it."
    : "1. Have Sales Manager review the QA flags.\n2. Have GHL Expert run/confirm fresh readiness.\n3. If those clear, approve the smallest clean lane for import-only first.";

  return `*Manager plain-English readout - ${today()}*

${address(actor)}, short version: auto is on. Ready lanes can start; unready lanes wait.

What this means:

${statusLine}
- ${summaries.length} Reach lanes are staged; ${waiting} still need Sales Manager QA and visual GHL review.
- ${importReady} lanes are marked import-ready, but import-only does not send emails.
- ${dripReady} lanes are marked drip-ready; auto can start those lanes when guardrails pass.
- The read-only GHL API check can pass while visual checks are still open.

Current best move:

${bestMove}

Recommended next commands:

\`\`\`text
${nextCommands.join("\n")}
\`\`\`

Do not manually override auto unless there is a reason.

Safety:

- ${relayImportCompleted ? "Relay import-only already imported/tagged the 2 QA OK contacts. This check imported no new contacts." : "No contacts were imported."}
- No drip was started.
- No GHL workflows or settings were changed.
- No HighLevel AI features were enabled or toggled.

Recommendation:

${recommendation}`;
}

function buildWarmupAutopilotResponse(actor: UserContext, normalized: string) {
  const config = warmupConfig();
  const domains = domainRows();
  const requestedLanes = findLaneKeys(normalized);
  const lanes = requestedLanes.length ? requestedLanes : (Object.keys(LANES) as LaneKey[]);
  const laneInput = requestedLanes.length ? requestedLanes.join(",") : "all";
  const dayNumber = warmupDay(config?.planned_start_date, today());
  const quota = quotaForWarmupDay(config, dayNumber);
  const quotaText = quota ? `${quota.min}-${quota.max} emails/day, target ${quota.target}` : "hold for deliverability review";

  return `*Reach Warmup Autopilot - ${today()}*

${address(actor)}, yes. The warmup should run as an agent-guarded autopilot, not as a row-by-row Mike decision.

Current warmup day: ${dayNumber}
Current quota: ${quotaText}
Mode: ${config?.mode || "not configured"}

Lane readiness:

${lanes
  .map((laneKey) => {
    const lane = LANES[laneKey];
    const domain = domains.find((row) => row.lane?.toLowerCase() === laneKey) ?? {};
    return `- ${lane.label}: domain \`${domain.dedicated_subdomain || "TBD"}\`; import ${domain.ready_for_import || "unknown"}; drip ${domain.ready_for_drip || "unknown"}; allowed ${domain.allowed_daily_send_volume || "TBD"}`;
  })
  .join("\n")}

What autopilot does:

- Follows the 10-20 / 40-50 / 80-100 warmup ladder.
- Reuses already-paid scrape inventory before making a new Outscraper call.
- If a bad or risky email is found, it removes it and keeps searching.
- If the first niche/area is too small, it expands to the next configured search.
- It stops at max refill attempts and scrape caps, so it cannot run forever.
- It will not reuse contacts already imported or started.

Commands wired in the repo:

\`\`\`bash
npm run reach:warmup -- --lane ${laneInput} --execute auto
\`\`\`

Important:

- Auto will not start a lane unless \`ready_for_drip=yes\`.
- HighLevel AI features stay OFF.
- The Slack listener reports the plan; the long scrape/verify/refill runner is the repo command above.`;
}

async function buildColdReachStartResponse(actor: UserContext, normalized: string, context: AgentResponseContext = {}) {
  const config = warmupConfig();
  const domains = domainRows();
  const requestedLanes = findLaneKeys(normalized);
  const lanes = requestedLanes.length ? requestedLanes : (Object.keys(LANES) as LaneKey[]);
  const laneInput = requestedLanes.length ? requestedLanes.join(",") : "all";
  const dayNumber = warmupDay(config?.planned_start_date, today());
  const quota = quotaForWarmupDay(config, dayNumber);
  const quotaText = quota ? `${quota.min}-${quota.max} emails/day, target ${quota.target}` : "hold for deliverability review";
  const allowScrapeSpend = hasOutscraperSpendApproval(normalized);
  const spendApprovalRequired = config?.guardrails?.require_outscraper_spend_approval === true;
  const scrapeRunCap = config?.guardrails?.max_total_scraped_per_run ?? "not set";
  const queued = await queueReachWarmupWorkflow({
    lane: laneInput,
    actor,
    channel: context.channel,
    threadTs: context.threadTs,
    responseUrl: context.responseUrl,
    allowScrapeSpend,
  });

  return `*Manager accepted: Reach Cold Email Campaign - ${today()}*

${address(actor)}, I know "cold reach campaign" as *Internal Job: Reach Cold Email Campaign*.

Default mode: *Warmup Autopilot*
Current warmup day: ${dayNumber}
Current quota: ${quotaText}
Runner: ${queued.ok ? `queued in GitHub Actions (\`${queued.runLabel}\`)` : `not queued yet (${queued.error})`}
Outscraper spend guard: ${spendApprovalRequired ? (allowScrapeSpend ? "approved for this run" : "ON - new Outscraper calls are paused by config") : "standard caps only"}
Outscraper run cap: ${scrapeRunCap} scraped records total across all lanes

What I will own:

- Work toward today's warmup amount without asking you to decide each row.
- Reuse already-paid scrape inventory before making a new Outscraper call.
- Replace bad, risky, duplicate, personal-domain, unknown, or catchall emails.
- Expand the search if the first niche or area is too small.
- Import only QA OK contacts when the lane is import-ready.
- Start drip only when the lane is marked \`ready_for_drip=yes\`.
- If a lane is short, refill it with capped discovery before trying to start drip.
- Stop at the configured attempt and scrape caps so this cannot loop forever.
- New Outscraper calls can run inside the caps because Mike approved auto.

Current lanes:

${lanes
  .map((laneKey) => {
    const lane = LANES[laneKey];
    const domain = domains.find((row) => row.lane?.toLowerCase() === laneKey) ?? {};
    return `- ${lane.label}: domain \`${domain.dedicated_subdomain || "TBD"}\`; import ${domain.ready_for_import || "unknown"}; drip ${domain.ready_for_drip || "unknown"}; allowed ${domain.allowed_daily_send_volume || "TBD"}`;
  })
  .join("\n")}

Worker action:

${queued.ok ? "- The worker will choose import vs start from the lane readiness ledger." : "- The command is recognized, but the worker trigger needs configuration before it can run unattended."}
${queued.ok ? "- It will post the final result back here when it finishes." : "- The repo runner remains `npm run reach:warmup -- --lane all --execute auto`."}

If you only say \`/manager start campaign\`, I will ask which campaign first.

Safety:

- HighLevel AI features stay OFF.
- Auto can start lanes after \`ready_for_drip=yes\` and guardrails pass.
- I do not need row-by-row decisions from Mike for warmup cleanup.`;
}

function buildCampaignClarificationResponse(actor: UserContext) {
  return `*Manager campaign check - ${today()}*

${address(actor)}, which campaign should I prepare?

Current campaign I can run through the team gates:

- Reach Cold Email Campaign

Use this exact command:

\`\`\`text
/manager start cold reach campaign
\`\`\`

I will treat that as the Reach Warmup Autopilot: refill bad emails, expand searches when needed, import only QA OK contacts, and start drip only when the lane is marked \`ready_for_drip=yes\`.`;
}

function buildAgentListResponse(actor: UserContext) {
  const groups = [
    ["Executive Office", ["general-manager", "scheduler"]],
    ["Company Operations", ["coach"]],
    ["Systems and IT", ["systems-director", "ghl-expert"]],
    ["Sales", ["sales-manager", "scout", "sender", "sorter", "booker", "engagement-scout"]],
    ["Client Success", ["client-success-manager", "hub", "reporter"]],
    ["Client Delivery", ["local-visibility-manager", "reviews-manager", "relay-manager"]],
    ["Marketing", ["editor", "press"]],
  ] as const;

  return `*AOH agent directory*

${address(actor)}, you can speak to any agent by starting a Slack message with their role name.

${groups
  .map(([department, keys]) => {
    const names = keys.map((key) => AGENTS[key].title).join(", ");
    return `- ${department}: ${names}`;
  })
  .join("\n")}

Examples:

\`\`\`text
General Manager, run Reach Cold Email Campaign
Manager, train Reach team
Manager, brief
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
Coach, review this copy
Reporter, verify report delivery status
Press, what is ready to publish
\`\`\`

Safety remains the same: scheduled auto can run approved warmup lanes; manual risky actions and HighLevel AI still need approval.`;
}

function buildReachTeamTrainingResponse(actor: UserContext) {
  return `*Reach team training - ${today()}*

${address(actor)}, yes. The team should handle the recurring work.

Codex role:

- Train and repair the system.
- Improve guardrails, costs, workflows, and Mission Control.
- Step in when automation breaks or a new job type needs setup.

Agent ownership:

- Manager: daily control, plain-English status, blocker assignment, and Mike-facing decisions.
- Scout: business discovery, better niches, rotating weak searches, and avoiding repeated poor scrape spend.
- Sender + verifier: email verification and clean selected CSVs before GHL action.
- Sales Manager: list quality, offer fit, row-level keep/hold judgment, and lane priority.
- GHL Expert: sender domains, workflow sender nodes, tags, warmup status, and HighLevel AI toggles OFF.
- Systems Director: cron health, GitHub workflows, credentials, caps, costs, and same-day rerun safety.
- Sorter: classify replies when replies arrive.
- Booker: move interested replies toward the calendar.

Training status:

- Reviews and AI Visibility are running under auto.
- Relay is waiting because it has 5 OK contacts and needs 10.
- The next auto run rotates Relay into the next searches instead of repeating the same first searches.
- Same-day reruns preserve executed reports instead of overwriting the ledger.

Next team command:

\`\`\`text
Manager, run Reach Cold Email Campaign
\`\`\`

Reference: \`docs/client-ops-ledger/reach-agent-team-training.md\``;
}

function buildOwnerPeekResponse(actor: UserContext) {
  return `*Manager owner peek - ${today()}*

${address(actor)}, you do not need to read every agent conversation.

Where to look:

- *Slack #04-aoh-ops*: talk to Manager and see brief answers, blockers, and follow-ups.
- *Mission Control front page*: owner view of active jobs, blockers, agents, and spend.
- *Reach job room*: cold email lane status, agent handoff, and next blocker.
- *GitHub/ledger/outbox*: proof logs only; use these when something looks wrong.

DM status:

- Automatic Manager DMs are not wired yet.
- Recommended setup: one short daily DM plus urgent exceptions only.
- Do not DM every agent action; that becomes noise fast.

What Manager should send you:

\`\`\`text
Reach today: Reviews and AI running. Relay needs 5 more clean contacts. No action needed from Mike unless raising spend or overriding safety.
\`\`\`

Next useful command:

\`\`\`text
Manager, status
\`\`\``;
}

function buildAgentRoleResponse(agentKey: AgentKey, actor: UserContext) {
  const agent = AGENTS[agentKey];
  if (agentKey === "general-manager") {
    return `*Manager*

${address(actor)}, I'm here.

Try:

\`\`\`text
Manager, is Reach set to run today, and do I need anything?
Manager, status
Manager, owner peek
\`\`\`

I'll keep answers short unless you ask for detail.`;
  }

  return `*${agent.title}*

${address(actor)}, I can help with:

${agent.canDo.slice(0, 3).map((item) => `- ${item}`).join("\n")}

Try:

\`\`\`text
${agent.nextStep.replace(/^Ask: `|`\.$/g, "")}
\`\`\`

Risky or client-facing action still needs approval.`;
}

function buildQaResponse(actor: UserContext, normalized = "") {
  const laneKey = findLaneKey(normalized);
  const wantsLaneDecision = /\b(resolve|recommend|safe|import|specific|flagged|flags|rows|remove|approve|clean)\b/.test(normalized);
  if (laneKey && wantsLaneDecision) return buildLaneQaDecisionResponse(laneKey, actor);

  return `*Sales Manager Reach QA - ${today()}*

${address(actor)}, here is the current list-quality review.

Review focus:

${laneSummaries()
  .map((summary) => `- ${summary.label}: ${summary.volumeText}, ${summary.qaText}; source \`${summary.sourceFile}\``)
  .join("\n")}

Decision rule:

- Remove or approve questionable personal-email contacts before live outreach.
- If a business appears more than once, keep only the best contact unless there is a clear reason.
- Do not ask Mike to approve start-drip until GHL Expert finishes visual sender-domain/warmup/AI-toggle checks.

For the actual rows and a lane recommendation, use:

\`\`\`text
/manager Sales Manager, resolve Relay QA flags and recommend import only
\`\`\``;
}

function buildLaneQaDecisionResponse(laneKey: LaneKey, actor: UserContext) {
  const lane = LANES[laneKey];
  const job = reachJobs().find((item) => item.campaign_lane?.toLowerCase() === laneKey);
  const sourceFile = job?.source_file?.trim() || "";
  const qa = readQaDetails(sourceFile);

  if (!job || !sourceFile) {
    return `*Sales Manager ${lane.label} QA - ${today()}*

${address(actor)}, I cannot resolve ${lane.label} QA because the job or source CSV is missing from the queue.`;
  }

  if (!qa) {
    return `*Sales Manager ${lane.label} QA - ${today()}*

${address(actor)}, I found the ${lane.label} job, but I do not have the QA CSV/report available.

Source file:
\`${sourceFile}\`

Next step:

\`\`\`text
npm run reach:quality -- --lane ${laneKey} --csv ${sourceFile}
\`\`\``;
  }

  const heldRows = qa.reviewRows;
  const okRows = qa.okRows;
  const rowWord = heldRows.length === 1 ? "row" : "rows";
  const okWord = okRows.length === 1 ? "row" : "rows";
  const importCompleted = String(job.status ?? "").includes("import_only_completed");
  const decision = heldRows.length
    ? importCompleted
      ? `Hold/remove the ${heldRows.length} flagged ${rowWord}. The ${okRows.length} OK ${okWord} were already imported/tagged import-only.`
      : `Hold/remove the ${heldRows.length} flagged ${rowWord}. Use the ${okRows.length} OK ${okWord} for import-only after GHL visual checks clear.`
    : `All ${okRows.length} ${okWord} are OK from this QA pass.`;
  const nextStepText = importCompleted
    ? `Relay import-only is already complete. Auto will start Relay after it has enough clean contacts and \`ready_for_drip=yes\`.`
    : `Recommended next command after GHL visual sender-domain/warmup/AI-toggle review clears:

\`\`\`text
/manager approve ${laneKey} import only
\`\`\``;
  const importInstruction = importCompleted
    ? "Import-only already used the QA file with OK rows only."
    : "Import-only should use the QA file with OK rows only, not the original unfiltered verified file.";

  return `*Sales Manager ${lane.label} QA decision - ${today()}*

${address(actor)}, here is the row-level QA decision.

Decision:

- ${decision}
- Do not start drip yet.
- ${importInstruction}

OK to keep for import-only:

${formatQaRows(okRows)}

Hold/remove before live outreach:

${formatQaRows(heldRows)}

${nextStepText}

Safety:

- Personal-email and duplicate-business rows stay out of the import path.
- This does not approve start-drip.
- ${importCompleted ? "The earlier import-only step imported/tagged the OK rows. This QA check changed nothing." : "No contacts, tags, workflows, settings, or HighLevel AI features were changed."}`;
}

function buildApprovalResponse(
  approval: { laneKey: LaneKey; action: "import" | "start"; visualConfirmed: boolean },
  actor: UserContext,
) {
  const lane = LANES[approval.laneKey];
  const job = reachJobs().find((item) => item.campaign_lane?.toLowerCase() === approval.laneKey);
  const sourceFile = job?.source_file?.trim() || "";
  const approvalSource = approvalImportSource({
    action: approval.action,
    sourceFile,
    fallbackLimit: extractVerifiedCount(job?.notes) || "N",
  });
  const domain = domainRows().find((item) => item.lane?.toLowerCase() === approval.laneKey) ?? {};
  const blockers = approvalBlockers({
    action: approval.action,
    job,
    domain,
    approvalSource,
    visualConfirmed: approval.visualConfirmed,
  });
  const command = `npm run reach:launch -- --lane ${approval.laneKey} --csv ${approvalSource.sourceFile || "CSV_PATH"} --limit ${approvalSource.limit} --commit${
    approvalSource.onlyOk ? " --only-ok" : ""
  }${
    approval.action === "start" ? " --start-drip" : ""
  }`;

  return `*Manager heard approval - ${today()}*

${address(actor)}, I heard the approval request and checked the gates.

Request: ${lane.label} / ${approval.action === "start" ? "start drip" : "import only"}

Current judgment: ${blockers.length ? "blocked before live execution" : "eligible for guarded execution"}

${blockers.length ? `Blockers:\n\n${blockers.map((blocker) => `- ${blocker}`).join("\n")}` : "Blockers: none from the current gates."}

Exact command after clearance:

\`\`\`bash
${command}
\`\`\`

${approvalSource.note ? `Source handling:\n\n- ${approvalSource.note}\n` : ""}
${approval.visualConfirmed ? "Visual GHL gate:\n\n- Mike confirmed the visual sender-domain/warmup/workflow/AI-toggle check in this approval command.\n" : ""}

Execution:

Live execution was not attempted by Slack listener.

Safety:

- Import-only approval does not approve start-drip.
- Start-drip approval is blocked unless \`ready_for_drip=yes\`.
- HighLevel AI features must stay OFF unless Mike explicitly authorizes them manually.`;
}

function approvalBlockers({
  action,
  job,
  domain,
  approvalSource,
  visualConfirmed,
}: {
  action: "import" | "start";
  job: CsvRow | undefined;
  domain: CsvRow;
  approvalSource: ReturnType<typeof approvalImportSource>;
  visualConfirmed: boolean;
}) {
  const blockers: string[] = [];
  if (!job) blockers.push("No matching job is present in the agent job queue.");
  if (!approvalSource.sourceFile) blockers.push("The job has no source CSV.");
  if (approvalSource.sourceFile && !existsSync(resolve(approvalSource.sourceFile))) {
    blockers.push(`Source CSV not found locally: ${approvalSource.sourceFile}`);
  }
  if (action === "import" && approvalSource.onlyOk && approvalSource.limit === 0) {
    blockers.push("No QA-approved OK rows remain for import-only.");
  }
  if (String(domain.ready_for_import ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_import is not yes.");
  }
  if (action === "start" && String(domain.ready_for_drip ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_drip is not yes.");
  }
  if (String(job?.status ?? "").includes("waiting_sales_and_visual_ghl_review") && !visualConfirmed) {
    blockers.push(
      approvalSource.onlyOk
        ? "GHL Expert visual sender-domain/warmup/AI-toggle review is still waiting. Sales QA can be handled with OK-only rows."
        : "Sales Manager QA and GHL Expert visual sender-domain/warmup/AI-toggle review are still waiting.",
    );
  }
  if (String(job?.status ?? "").includes("paused")) blockers.push("Campaign live actions are paused.");
  return blockers;
}

function buildGhlVisualChecklistResponse(actor: UserContext, laneKey: LaneKey | null) {
  const lanes = laneKey ? [laneKey] : (Object.keys(LANES) as LaneKey[]);
  const domains = domainRows();
  const domainLines = lanes.map((key) => {
    const lane = LANES[key];
    const domain = domains.find((item) => item.lane?.toLowerCase() === key) ?? {};
    return `- ${lane.label}: expected domain \`${domain.dedicated_subdomain || "TBD"}\`; import ${domain.ready_for_import || "unknown"}; drip ${domain.ready_for_drip || "unknown"}`;
  });
  const approvalLane = laneKey ?? "relay";

  return `*GHL Expert visual checklist - ${today()}*

${address(actor)}, the API check is not enough for visual confirmation.

What the API already checks:

- Pipelines exist.
- Cold workflows exist.
- Reply workflows exist.

What still needs a real GHL screen check:

- Sender/from domain matches the lane.
- Dedicated sending domain warmup/status looks safe.
- Workflow email sender nodes use the right sender/from domain.
- Conversation AI, AI Employee, Content AI, Auto-Review Replies, and other HighLevel AI toggles are OFF.

Lane/domain target:

${domainLines.join("\n")}

If Mike personally confirms those screens, use the combined approval so Manager has the confirmation in the same command:

\`\`\`text
/manager approve ${approvalLane} import only; I visually confirmed ${LANES[approvalLane].label} sender domain, warmup status, workflow sender nodes, and HighLevel AI toggles OFF
\`\`\`

Until that visual confirmation is included, import-only remains blocked. Start-drip is still not approved.`;
}

function approvalImportSource({
  action,
  sourceFile,
  fallbackLimit,
}: {
  action: "import" | "start";
  sourceFile: string;
  fallbackLimit: number | string;
}) {
  if (action === "import") {
    const qa = readQaDetails(sourceFile);
    if (qa) {
      return {
        sourceFile: qa.qaPath,
        limit: qa.okRows.length,
        onlyOk: true,
        note: `Using \`${qa.qaPath}\` with \`--only-ok\` so flagged rows are excluded from import-only.`,
      };
    }
  }

  return {
    sourceFile,
    limit: fallbackLimit,
    onlyOk: false,
    note: "",
  };
}

async function runGhlReadinessCheck({ forceFresh = false } = {}): Promise<GhlResult> {
  const cached = getCachedGhlReadiness(forceFresh);
  if (cached) return cached;

  const token = process.env.GHL_PIT_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) {
    return { ok: false, lines: ["GHL token/location env vars are not configured for this listener."] };
  }

  try {
    const [pipelines, workflows] = await Promise.all([
      getGhlJson(`/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`, token),
      getGhlJson(`/workflows/?locationId=${encodeURIComponent(locationId)}`, token).catch(() => null),
    ]);
    const pipelineList = asArray(asRecord(pipelines).pipelines);
    const workflowList = asArray(asRecord(workflows).workflows ?? asRecord(workflows).data ?? workflows);
    const lines = (Object.keys(LANES) as LaneKey[]).map((laneKey) => {
      const lane = LANES[laneKey];
      const pipelineFound = pipelineList.some((item) => same(asRecord(item).name, lane.pipeline));
      const coldFound = workflowList.some((item) => same(asRecord(item).name ?? asRecord(item).title, lane.coldWorkflow));
      const replyFound = workflowList.some((item) => same(asRecord(item).name ?? asRecord(item).title, lane.replyWorkflow));
      return `${lane.label}: pipeline ${yesNo(pipelineFound)}, cold workflow ${yesNo(coldFound)}, reply workflow ${yesNo(replyFound)}`;
    });
    return rememberGhlReadiness({ ok: true, lines });
  } catch (error) {
    return { ok: false, lines: [error instanceof Error ? error.message : "Unknown GHL readiness error."] };
  }
}

function renderGhlResult(result: GhlResult, actor: UserContext) {
  const cacheNote = typeof result.cacheAgeSeconds === "number" ? ` (cached ${result.cacheAgeSeconds}s ago; say \`fresh\` for a live check)` : "";

  return `*GHL Expert readiness check - ${today()}*

${address(actor)}, I ran the read-only GHL check.

Mode: read-only${cacheNote}

Result: ${result.ok ? "passed" : "needs attention"}

${result.lines.map((line) => `- ${line}`).join("\n")}

No contacts, tags, workflows, settings, or HighLevel AI features were changed.`;
}

function getCachedGhlReadiness(forceFresh: boolean): GhlResult | null {
  if (forceFresh || !ghlReadinessCache || GHL_READINESS_CACHE_TTL_MS <= 0) return null;
  const age = Date.now() - ghlReadinessCache.fetchedAt;
  if (age > GHL_READINESS_CACHE_TTL_MS) return null;
  return {
    ...ghlReadinessCache.result,
    cacheAgeSeconds: Math.max(0, Math.round(age / 1000)),
  };
}

function rememberGhlReadiness(result: GhlResult) {
  ghlReadinessCache = { fetchedAt: Date.now(), result };
  return result;
}

async function getGhlJson(path: string, token: string) {
  const res = await fetch(`${GHL_API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Version: GHL_API_VERSION,
    },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
  return JSON.parse(text) as unknown;
}

async function postSlackMessage({ channel, text, threadTs }: { channel: string; text: string; threadTs?: string }) {
  const token = process.env.SLACK_BOT_TOKEN?.trim();
  if (!token) throw new Error("SLACK_BOT_TOKEN is not configured.");

  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      text,
      thread_ts: threadTs,
    }),
    cache: "no-store",
  });
  const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(`Slack post failed: ${result?.error ?? response.statusText}`);
  }
}

async function pollSlackCommands() {
  const token = process.env.SLACK_BOT_TOKEN?.trim();
  if (!token) return { ok: false, error: "SLACK_BOT_TOKEN is not configured.", processed: 0 };

  const channel = firstAllowedChannel();
  const lookbackSeconds = boundedNumber(process.env.SLACK_AGENT_POLL_LOOKBACK_SECONDS, 60, 7200, 1800);
  const oldest = String(Math.floor(Date.now() / 1000) - lookbackSeconds);
  const history = await getSlackHistory({ token, channel, oldest, limit: 50 });
  const botUserId = await getSlackBotUserId(token);
  const messages = history.messages ?? [];
  const commands = messages
    .filter((message) => isPollableSlackCommand(message, botUserId))
    .filter((message) => !hasLaterBotReply(messages, message, botUserId))
    .sort((a, b) => Number(a.ts ?? 0) - Number(b.ts ?? 0));

  let processed = 0;
  for (const message of commands) {
    const text = message.text?.trim() ?? "";
    const actor = buildUserContext({ userId: message.user ?? "", commandText: text });
    const response = await buildAgentResponse(text, actor, { channel });
    await postSlackMessage({ channel, text: response });
    processed++;
  }

  return {
    ok: true,
    channel,
    scanned: messages.length,
    processed,
  };
}

async function getSlackHistory({
  token,
  channel,
  oldest,
  limit,
}: {
  token: string;
  channel: string;
  oldest: string;
  limit: number;
}): Promise<{ ok: boolean; messages?: SlackMessage[]; error?: string }> {
  const url = new URL("https://slack.com/api/conversations.history");
  url.searchParams.set("channel", channel);
  url.searchParams.set("oldest", oldest);
  url.searchParams.set("limit", String(limit));
  const result = await getSlackApi<{ ok?: boolean; messages?: SlackMessage[]; error?: string }>(url, token);
  if (!result.ok) throw new Error(`Slack history failed: ${result.error ?? "unknown_error"}`);
  return { ok: true, messages: result.messages ?? [] };
}

async function getSlackBotUserId(token: string) {
  if (process.env.SLACK_BOT_USER_ID?.trim()) return process.env.SLACK_BOT_USER_ID.trim();
  if (slackBotUserIdCache) return slackBotUserIdCache;
  const url = new URL("https://slack.com/api/auth.test");
  const result = await getSlackApi<{ ok?: boolean; user_id?: string; error?: string }>(url, token);
  if (!result.ok || !result.user_id) throw new Error(`Slack auth.test failed: ${result.error ?? "missing_user_id"}`);
  slackBotUserIdCache = result.user_id;
  return result.user_id;
}

async function getSlackApi<T>(url: URL, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return (await response.json()) as T;
}

function isPollableSlackCommand(message: SlackMessage, botUserId: string) {
  const text = message.text?.trim() ?? "";
  if (!text || !message.ts) return false;
  if (text.startsWith("/")) return false;
  if (message.subtype || message.bot_id || message.user === botUserId) return false;
  return isSupportedCommand(text);
}

function hasLaterBotReply(messages: SlackMessage[], command: SlackMessage, botUserId: string) {
  const commandTs = Number(command.ts ?? 0);
  return messages.some((message) => {
    const messageTs = Number(message.ts ?? 0);
    return messageTs > commandTs && (message.user === botUserId || Boolean(message.bot_id));
  });
}

async function postSlackResponseUrl(responseUrl: string, text: string) {
  if (!responseUrl) return false;
  const response = await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "in_channel",
      text,
    }),
    cache: "no-store",
  });
  return response.ok;
}

async function queueReachWarmupWorkflow({
  lane,
  actor,
  channel,
  threadTs,
  responseUrl,
  allowScrapeSpend = false,
}: {
  lane: LaneInput;
  actor: UserContext;
  channel?: string;
  threadTs?: string;
  responseUrl?: string;
  allowScrapeSpend?: boolean;
}): Promise<{ ok: true; runLabel: string } | { ok: false; error: string }> {
  const token = process.env.GITHUB_REACH_RUNNER_TOKEN?.trim();
  if (!token) return { ok: false, error: "GITHUB_REACH_RUNNER_TOKEN is not configured" };

  const repo = process.env.GITHUB_REACH_REPO?.trim() || "aoh-inc/aoh-website";
  const workflow = process.env.GITHUB_REACH_WORKFLOW_ID?.trim() || "reach-warmup-autopilot.yml";
  const ref = process.env.GITHUB_REACH_REF?.trim() || "main";
  const url = `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`;
  const runLabel = `${lane}/auto`;
  const existing = await findOpenReachWarmupRun({ token, repo, workflow, ref });
  if (existing) return { ok: true, runLabel: `already running #${existing}` };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      ref,
      inputs: {
        lane,
        execute: "auto",
        slack_channel: channel || firstAllowedChannel(),
        slack_thread_ts: threadTs || "",
        slack_response_url: responseUrl || "",
        requested_by: actor.name || OWNER_FIRST_NAME,
        allow_scrape_spend: allowScrapeSpend ? "true" : "false",
      },
    }),
    cache: "no-store",
  });

  if (response.status === 204) return { ok: true, runLabel };
  const text = await response.text().catch(() => "");
  return { ok: false, error: `GitHub dispatch failed ${response.status}: ${text.slice(0, 180)}` };
}

async function findOpenReachWarmupRun({
  token,
  repo,
  workflow,
  ref,
}: {
  token: string;
  repo: string;
  workflow: string;
  ref: string;
}) {
  for (const status of ["in_progress", "queued", "waiting"]) {
    const url = new URL(`https://api.github.com/repos/${repo}/actions/workflows/${workflow}/runs`);
    url.searchParams.set("branch", ref);
    url.searchParams.set("status", status);
    url.searchParams.set("per_page", "5");
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });
    if (!response.ok) continue;
    const data = (await response.json().catch(() => null)) as { workflow_runs?: Array<{ run_number?: number }> } | null;
    const runNumber = data?.workflow_runs?.[0]?.run_number;
    if (runNumber) return runNumber;
  }
  return null;
}

function scheduleSlackEventResponse({
  channel,
  command,
  actor,
  threadTs,
}: {
  channel: string;
  command: string;
  actor: UserContext;
  threadTs?: string;
}) {
  const asyncMode = shouldRunAsync(command);

  after(async () => {
    try {
      if (asyncMode) {
        await postSlackMessage({ channel, text: buildAsyncAcknowledgement(command, actor), threadTs });
      }
      const response = await buildAgentResponse(command, actor, { channel, threadTs });
      await postSlackMessage({ channel, text: response, threadTs });
    } catch (error) {
      await postSlackMessage({ channel, text: buildAsyncErrorResponse(error, actor), threadTs });
    }
  });
}

function scheduleSlackFollowup({
  responseUrl,
  channel,
  command,
  actor,
}: {
  responseUrl: string;
  channel: string;
  command: string;
  actor: UserContext;
}) {
  after(async () => {
    try {
      const response = await buildAgentResponse(command, actor, { channel });
      const postedViaResponseUrl = await postSlackResponseUrl(responseUrl, response);
      if (!postedViaResponseUrl && channel) await postSlackMessage({ channel, text: response });
    } catch (error) {
      const response = buildAsyncErrorResponse(error, actor);
      const postedViaResponseUrl = await postSlackResponseUrl(responseUrl, response);
      if (!postedViaResponseUrl && channel) await postSlackMessage({ channel, text: response });
    }
  });
}

function buildAsyncAcknowledgement(command: string, actor: UserContext) {
  const normalized = normalizeCommand(command);
  const owner = mentionsGhlReadiness(normalized) ? "GHL Expert" : mentionsReachColdEmailCampaign(normalized) ? "General Manager" : "Manager";

  return `*${owner} working - ${today()}*

${address(actor)}, I heard you. I am checking the slower parts now and will post the result when it finishes.`;
}

function buildAsyncErrorResponse(error: unknown, actor: UserContext) {
  const detail = error instanceof Error ? error.message : "Unknown error.";
  return `*Agent follow-up failed - ${today()}*

${address(actor)}, the background check did not finish cleanly.

Error: ${detail}`;
}

function verifySlackRequest(req: NextRequest, rawBody: string): { ok: true } | { ok: false; status: number; error: string } {
  const signingSecret = process.env.SLACK_SIGNING_SECRET?.trim();
  const localTestToken = process.env.SLACK_LISTENER_TEST_TOKEN?.trim() || process.env.REPORT_TEST_BYPASS_TOKEN?.trim() || "local-dev-only";
  const localBypass = process.env.NODE_ENV !== "production" && req.headers.get("x-agent-test-bypass") === localTestToken;

  if (!signingSecret) {
    return localBypass
      ? { ok: true }
      : { ok: false, status: 503, error: "SLACK_SIGNING_SECRET is not configured." };
  }

  const timestamp = req.headers.get("x-slack-request-timestamp") ?? "";
  const signature = req.headers.get("x-slack-signature") ?? "";
  const timestampSeconds = Number(timestamp);
  if (!timestampSeconds || Math.abs(Date.now() / 1000 - timestampSeconds) > 60 * 5) {
    return { ok: false, status: 401, error: "Invalid Slack timestamp." };
  }

  const base = `v0:${timestamp}:${rawBody}`;
  const expected = `v0=${createHmac("sha256", signingSecret).update(base).digest("hex")}`;
  if (!safeEqual(signature, expected)) {
    return { ok: false, status: 401, error: "Invalid Slack signature." };
  }

  return { ok: true };
}

function verifyCronRequest(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authHeader = req.headers.get("authorization") ?? "";
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return { ok: false, status: 401, error: "Unauthorized." };
  }
  return { ok: true };
}

function isAllowedChannel(channel: string) {
  return allowedChannels().includes(channel);
}

function firstAllowedChannel() {
  return allowedChannels()[0] ?? DEFAULT_AGENT_CHANNEL_ID;
}

function allowedChannels() {
  return (process.env.SLACK_AGENT_ALLOWED_CHANNEL_IDS ?? DEFAULT_AGENT_CHANNEL_ID)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isSupportedCommand(text: string) {
  const normalized = normalizeCommand(text);
  return (
    mentionsColdReachStart(normalized) ||
    mentionsReachRunStatusQuestion(normalized) ||
    mentionsGenericCampaignDeploy(normalized) ||
    mentionsWarmupAutopilot(normalized) ||
    mentionsReachDecisionQuestion(normalized) ||
    mentionsReachColdEmailCampaign(normalized) ||
    mentionsAgentList(normalized) ||
    mentionsBrief(normalized) ||
    mentionsGhlReadiness(normalized) ||
    mentionsGhlVisualReadiness(normalized) ||
    mentionsQaReview(normalized) ||
    Boolean(findAddressedAgent(normalized)) ||
    normalized.includes("approve") ||
    normalized.includes("pause all campaign live actions")
  );
}

function shouldRunAsync(command: string) {
  const normalized = normalizeCommand(command);
  if (mentionsReachRunStatusQuestion(normalized)) return false;
  if (mentionsReachCampaignStatus(normalized)) return false;
  if (mentionsColdReachStart(normalized)) return false;
  if (mentionsGenericCampaignDeploy(normalized)) return false;
  if (mentionsWarmupAutopilot(normalized)) return false;
  return mentionsReachColdEmailCampaign(normalized) || mentionsGhlReadiness(normalized);
}

function parseApproval(normalized: string): { laneKey: LaneKey; action: "import" | "start"; visualConfirmed: boolean } | null {
  if (!normalized.includes("approve")) return null;
  const laneKey = findLaneKey(normalized);
  if (!laneKey) return null;
  const visualConfirmed = hasGhlVisualConfirmation(normalized);
  if (normalized.includes("start") || normalized.includes("drip")) return { laneKey, action: "start", visualConfirmed };
  if (normalized.includes("import")) return { laneKey, action: "import", visualConfirmed };
  return null;
}

function findLaneKey(normalized: string): LaneKey | null {
  return findLaneKeys(normalized)[0] ?? null;
}

function findLaneKeys(normalized: string): LaneKey[] {
  if (/\b(all|all three|every lane|all lanes)\b/.test(normalized)) return Object.keys(LANES) as LaneKey[];
  const matches = (Object.keys(LANES) as LaneKey[]).flatMap((key) =>
    LANES[key].aliases
      .filter((alias) => containsAlias(normalized, alias))
      .map((alias) => ({ key, length: alias.length })),
  );
  const ordered = matches.sort((a, b) => b.length - a.length).map((match) => match.key);
  return [...new Set(ordered)];
}

function hasOutscraperSpendApproval(normalized: string) {
  const hasApprovalWord = /\b(approve|approved|allow|allowed|ok|okay|yes|authorize|authorized)\b/.test(normalized);
  const hasSpendTarget = /\b(outscraper|scraper|scraping|scrape spend|paid scrape|credits?)\b/.test(normalized);
  return hasApprovalWord && hasSpendTarget;
}

function laneSummaries() {
  const domains = domainRows();
  return reachJobs().map((job) => {
    const laneKey = (job.campaign_lane?.toLowerCase() || "reviews") as LaneKey;
    const lane = LANES[laneKey] ?? LANES.reviews;
    const domain = domains.find((item) => item.lane?.toLowerCase() === laneKey) ?? {};
    const sourceFile = job.source_file || "";
    const qa = readQaDetails(sourceFile);
    const rowCount = sourceFile ? readCsv(sourceFile).length : 0;
    const verifiedFallback = extractVerifiedCount(job.notes);
    const volumeText = qa
      ? `${rowCount || qa.rows.length} QA row${rowCount === 1 ? "" : "s"}`
      : rowCount
        ? `${rowCount} verified`
        : verifiedFallback
          ? `${verifiedFallback} verified`
          : "unknown volume";
    const qaText = qa
      ? `${qa.reviewRows.length} QA review flag${qa.reviewRows.length === 1 ? "" : "s"} / ${qa.okRows.length} OK`
      : readQaText(lane.label);
    return {
      laneKey,
      label: lane.label,
      volumeText,
      qaText,
      status: job.status || "unknown",
      importReady: domain.ready_for_import || "unknown",
      dripReady: domain.ready_for_drip || "unknown",
      domain: domain.dedicated_subdomain || "TBD",
      sourceFile: sourceFile || "missing",
    };
  });
}

function renderLaneBullet(summary: ReturnType<typeof laneSummaries>[number]) {
  return `- ${summary.label}: ${summary.volumeText}, ${summary.qaText}; status \`${summary.status}\`; import ${summary.importReady}; drip ${summary.dripReady}; domain \`${summary.domain}\``;
}

function reachJobs() {
  const order: LaneKey[] = ["reviews", "ai", "relay"];
  return readCsv(JOBS_PATH)
    .filter((job) => String(job.job_type ?? "").includes("reach_campaign"))
    .sort((a, b) => order.indexOf((a.campaign_lane?.toLowerCase() || "reviews") as LaneKey) - order.indexOf((b.campaign_lane?.toLowerCase() || "reviews") as LaneKey));
}

function domainRows() {
  return readCsv(DOMAINS_PATH);
}

function warmupConfig(): WarmupConfig | null {
  const raw = readText(WARMUP_CONFIG_PATH);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WarmupConfig;
  } catch {
    return null;
  }
}

function quotaForWarmupDay(config: WarmupConfig | null, dayNumber: number): WarmupQuota | null {
  const ladder = Array.isArray(config?.daily_quota_ladder) ? config.daily_quota_ladder : [];
  return ladder.find((item) => dayNumber >= Number(item.from_day) && dayNumber <= Number(item.to_day)) ?? null;
}

function warmupDay(startDate: string | undefined, date: string) {
  const start = parseDateOnly(startDate);
  const current = parseDateOnly(date);
  if (!start || !current) return 1;
  return Math.max(1, Math.floor((current.getTime() - start.getTime()) / 86_400_000) + 1);
}

function parseDateOnly(value: string | undefined) {
  const text = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(`${text}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readRecommendation() {
  const dailyBrief = readText(DAILY_BRIEF_PATH);
  return (
    dailyBrief.match(/Current strongest lane by cleanliness:[^\n]+/)?.[0] ??
    "Relay is the cleanest small lane right now. Use import-only first; wait on start-drip until domain readiness is confirmed."
  );
}

function readQaText(label: string) {
  const dailyBrief = readText(DAILY_BRIEF_PATH);
  const rows = dailyBrief
    .split(/\r?\n/)
    .filter((line) => line.startsWith(`| ${label} |`) || (label === "AI Visibility" && line.startsWith("| AI Visibility |")));
  const cells =
    rows
      .map((row) => row.split("|").map((cell) => cell.trim()).filter(Boolean))
      .find((rowCells) => /^\d+$/.test(rowCells[4] ?? "")) ?? [];
  const qa = cells[4];
  return qa ? `${qa} QA review flag${qa === "1" ? "" : "s"}` : "QA count unavailable";
}

function readQaDetails(sourceFile: string) {
  if (!sourceFile) return null;
  const candidates = [
    sourceFile.replace(/-verified\.csv$/i, "-qa.csv"),
    sourceFile.replace(/\.csv$/i, "-qa.csv"),
  ];
  const qaPath = candidates.find((path) => existsSync(resolve(path)));
  if (!qaPath) return null;

  const rows = readCsv(qaPath);
  const reviewRows = rows.filter((row) => String(row.qa_recommendation ?? "").toLowerCase() === "review_before_live");
  const okRows = rows.filter((row) => String(row.qa_recommendation ?? "").toLowerCase() !== "review_before_live");
  return { qaPath, rows, okRows, reviewRows };
}

function formatQaRows(rows: CsvRow[]) {
  if (!rows.length) return "- None";
  return rows
    .map((row) => {
      const business = row.name?.trim() || "Unknown business";
      const email = row.email?.trim() || "missing email";
      const city = row.city?.trim() || "unknown city";
      const flags = row.qa_flags?.trim() || "ok";
      return `- ${business} | ${email} | ${city} | ${flags}`;
    })
    .join("\n");
}

function readCsv(path: string): CsvRow[] {
  const raw = readText(path);
  if (!raw) return [];
  return parseCsv(raw);
}

function readText(path: string) {
  const absolute = resolve(path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
}

function parseCsv(raw: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const next = raw[i + 1];
    if (quoted && c === '"' && next === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (!quoted && c === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (c === "\n" || c === "\r")) {
      if (c === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift()?.map((header) => header.trim()) ?? [];
  return rows
    .filter((values) => values.some((value) => value.trim()))
    .map((values) => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""])));
}

function safeJson(raw: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(raw) as unknown;
    return asRecord(value);
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function mentionsBrief(normalized: string) {
  return normalized.includes("manager status") || normalized.includes("status") || normalized.includes("brief");
}

function mentionsAgentList(normalized: string) {
  return (
    normalized.includes("list agents") ||
    normalized.includes("show agents") ||
    normalized.includes("agent directory") ||
    normalized.includes("who can i talk to")
  );
}

function mentionsReachColdEmailCampaign(normalized: string) {
  return (
    normalized.includes("run reach cold email campaign") ||
    normalized.includes("start reach cold email campaign") ||
    normalized.includes("deploy reach cold email campaign") ||
    normalized.includes("deploy cold email campaign") ||
    normalized.includes("launch reach cold email campaign") ||
    normalized.includes("launch cold email campaign") ||
    normalized.includes("reach cold email campaign")
  );
}

function mentionsReachRunStatusQuestion(normalized: string) {
  const asksRunStatus =
    /\b(set to run|set up to run|set for today|scheduled today|running today|run today|ready today|ready for today|everything set|all set|did .* run|has .* run|have .* run|did .* send|has .* sent|have .* sent|sent today|getting sent|emails getting sent|do i need .*anything|need .* anything|need to do anything|how .*relay.*clean|how .*relay.*send|relay .*enough clean|get enough clean)\b/.test(
      normalized,
    );
  if (!asksRunStatus) return false;
  return (
    mentionsReachColdEmailCampaign(normalized) ||
    normalized.includes("cold email") ||
    normalized.includes("reach") ||
    normalized.includes("campaign") ||
    normalized.includes("email")
  );
}

function mentionsColdReachStart(normalized: string) {
  if (!/\b(run|start|deploy|launch|begin|kick off|kickoff)\b/.test(normalized)) return false;
  return (
    normalized.includes("cold reach campaign") ||
    normalized.includes("start cold reach") ||
    normalized.includes("run cold reach") ||
    normalized.includes("launch cold reach") ||
    normalized.includes("deploy cold reach") ||
    normalized.includes("start reach cold email campaign") ||
    normalized.includes("start reach campaign") ||
    normalized.includes("run reach campaign") ||
    normalized.includes("launch reach campaign") ||
    normalized.includes("deploy reach campaign") ||
    normalized.includes("start cold email") ||
    normalized.includes("run cold email") ||
    normalized.includes("launch cold email") ||
    normalized.includes("deploy cold email")
  );
}

function mentionsReachCampaignStatus(normalized: string) {
  return mentionsReachColdEmailCampaign(normalized) && mentionsBrief(normalized) && !/\b(run|start|deploy|launch|execute|fresh|live|recheck|rerun)\b/.test(normalized);
}

function mentionsWarmupAutopilot(normalized: string) {
  return (
    normalized.includes("warmup autopilot") ||
    normalized.includes("warm up autopilot") ||
    normalized.includes("warmup runner") ||
    normalized.includes("warmup guardrail") ||
    normalized.includes("warmup quota") ||
    normalized.includes("run warmup") ||
    normalized.includes("run warm up") ||
    normalized.includes("send warmup") ||
    normalized.includes("send warm up")
  );
}

function mentionsTeamTraining(normalized: string) {
  const asksTraining = /\b(train|training|teach|handoff|hand off|handle|handling)\b/.test(normalized);
  if (!asksTraining) return false;
  return (
    normalized.includes("team") ||
    normalized.includes("agent") ||
    normalized.includes("agents") ||
    normalized.includes("reach") ||
    normalized.includes("campaign") ||
    normalized.includes("cold email")
  );
}

function mentionsOwnerPeek(normalized: string) {
  return (
    normalized.includes("owner peek") ||
    normalized.includes("where can i see") ||
    normalized.includes("where do i see") ||
    normalized.includes("manager dm") ||
    normalized.includes("dm me") ||
    normalized.includes("right hand man") ||
    normalized.includes("right-hand") ||
    (normalized.includes("activity") && (normalized.includes("shown") || normalized.includes("see") || normalized.includes("display")))
  );
}

function mentionsGenericCampaignDeploy(normalized: string) {
  if (mentionsColdReachStart(normalized)) return false;
  if (mentionsReachColdEmailCampaign(normalized)) return false;
  return /\b(run|start|deploy|launch)\s+(the\s+|a\s+)?campaign\b/.test(normalized);
}

function mentionsReachDecisionQuestion(normalized: string) {
  const asksForDecision =
    /\b(what does this mean|what does it mean|explain|plain english|translate|what happened|what ran|what next|what now|what should|what do i do|what has to happen|what needs to happen|happen first|before i send|before we send|i want to send|want to send|next step|next steps|should i|can i|are we ready|ready to send|ready to deploy|ready to launch|can we send|can we start|send emails|send warmup|warmup emails|warm up emails|start drip)\b/.test(
      normalized,
    );
  if (!asksForDecision) return false;
  return (
    mentionsReachColdEmailCampaign(normalized) ||
    normalized.includes("reach") ||
    normalized.includes("campaign") ||
    normalized.includes("email") ||
    normalized.includes("warmup") ||
    normalized.includes("warm up") ||
    normalized.includes("drip") ||
    normalized.includes("what does this mean") ||
    normalized.includes("happen first") ||
    normalized.includes("what next") ||
    normalized.includes("what should") ||
    normalized.includes("what do i do") ||
    normalized.includes("ready to")
  );
}

function mentionsGhlReadiness(normalized: string) {
  return normalized.includes("ghl") && (normalized.includes("check") || normalized.includes("readiness") || normalized.includes("ready"));
}

function mentionsGhlVisualReadiness(normalized: string) {
  return (
    normalized.includes("ghl") &&
    /\b(visual|visually|sender domain|from domain|warmup|warm up|sender nodes|workflow sender|ai toggles|highlevel ai|conversation ai|ai employee|content ai|auto review)\b/.test(
      normalized,
    )
  );
}

function hasGhlVisualConfirmation(normalized: string) {
  return (
    /\b(i|mike)\s+(visually\s+)?(confirmed|checked|verified)\b/.test(normalized) ||
    /\bvisual\s+(check\s+)?(complete|confirmed|done|verified)\b/.test(normalized)
  );
}

function mentionsQaReview(normalized: string) {
  return normalized.includes("qa") || normalized.includes("quality") || normalized.includes("sales manager review");
}

function normalizeCommand(command: string) {
  return command.toLowerCase().replace(/[.,:;|]/g, " ").replace(/\s+/g, " ").trim();
}

function wantsFreshCheck(normalized: string) {
  return /\b(fresh|live|force|rerun|recheck|no cache)\b/.test(normalized);
}

function boundedNumber(raw: string | undefined, min: number, max: number, fallback: number) {
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function buildUserContext({
  userId = "",
  fallbackName = "",
  commandText = "",
}: {
  userId?: string;
  fallbackName?: string;
  commandText?: string;
} = {}): UserContext {
  const cleanUserId = userId.trim();
  const cleanFallbackName = cleanName(fallbackName);
  const isMike =
    Boolean(OWNER_SLACK_USER_ID && cleanUserId === OWNER_SLACK_USER_ID) ||
    ["mike", "michael", "mike egidio"].includes(cleanFallbackName.toLowerCase());
  const tone = wantsFormalTone(commandText) ? "formal" : "first-name";
  const name = isMike ? (tone === "formal" ? OWNER_FORMAL_NAME : OWNER_FIRST_NAME) : cleanFallbackName || "there";

  return {
    userId: cleanUserId,
    name,
    isMike,
    tone,
  };
}

function address(actor: UserContext) {
  return actor.name || "there";
}

function cleanName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "";
  return trimmed
    .replace(/^@+/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function wantsFormalTone(commandText: string) {
  const lowered = commandText.toLowerCase();
  if (/\b(first[-\s]?name|casual|informal)\b/.test(lowered)) return false;
  return /\b(formal|formally|mr\.?\s+egidio|mister\s+egidio)\b/.test(lowered);
}

function startsWithKnownAgent(text: string) {
  const normalized = normalizeCommand(text);
  return Boolean(findAddressedAgent(normalized));
}

function findAddressedAgent(normalized: string): AgentKey | null {
  const entries = Object.entries(AGENTS) as Array<[AgentKey, (typeof AGENTS)[AgentKey]]>;
  const sorted = entries
    .flatMap(([key, agent]) => agent.aliases.map((alias) => ({ key, alias })))
    .sort((a, b) => b.alias.length - a.alias.length);
  return sorted.find(({ alias }) => containsAliasAtStart(normalized, alias))?.key ?? null;
}

function containsAliasAtStart(normalized: string, alias: string) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}(\\s|$)`).test(normalized);
}

function containsAlias(normalized: string, alias: string) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(normalized);
}

function extractVerifiedCount(notes: string | undefined) {
  return notes?.match(/(\d+)\s+verified/i)?.[1] ?? "";
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function same(a: unknown, b: unknown) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

function yesNo(value: boolean) {
  return value ? "yes" : "no";
}

function today() {
  return easternDate();
}

function easternDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}
