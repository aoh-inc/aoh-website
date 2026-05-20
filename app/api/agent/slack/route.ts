import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const JOBS_PATH = "docs/client-ops-ledger/agent-jobs.csv";
const DOMAINS_PATH = "docs/client-ops-ledger/sending-domain-readiness.csv";
const DAILY_BRIEF_PATH = "docs/client-ops-ledger/daily-brief-current.md";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

type CsvRow = Record<string, string>;

type LaneKey = "reviews" | "ai" | "relay";
type AgentKey =
  | "chief-of-staff"
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
  "chief-of-staff": {
    title: "Chief of Staff",
    persona: "Indra Nooyi",
    aliases: ["chief of staff", "cos", "indra"],
    reportsTo: "President",
    job: "Turns noisy agent findings into a clean approval queue for Mike.",
    canDo: ["prepare the daily brief", "summarize blockers", "turn recommendations into approval asks"],
    nextStep: "Ask: `Chief of Staff, brief` or `Chief of Staff, what needs Mike today`.",
  },
  "general-manager": {
    title: "General Manager",
    persona: "Elon Musk",
    aliases: ["general manager", "manager", "gm", "elon"],
    reportsTo: "Chief of Staff",
    job: "Runs the agent company day to day, assigns owners, tracks blockers, and escalates to Mike.",
    canDo: ["run Reach Cold Email Campaign", "route work to agents", "show status", "explain blockers"],
    nextStep: "Ask: `Manager, run Reach Cold Email Campaign` or `Manager, status`.",
  },
  scheduler: {
    title: "Scheduler",
    persona: "Tim Ferriss",
    aliases: ["scheduler", "tim ferriss", "tim"],
    reportsTo: "Chief of Staff",
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
    persona: "Gary Vaynerchuk",
    aliases: ["sales manager", "sales", "gary v", "gary"],
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
    persona: "TBD",
    aliases: ["engagement scout", "engagement"],
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
  const threadTs = typeof event.ts === "string" ? event.ts : undefined;

  if (!text || !channel || !isSupportedCommand(text)) {
    return NextResponse.json({ ok: true, ignored: "not_agent_command" });
  }
  if (!isAllowedChannel(channel)) {
    return NextResponse.json({ ok: true, ignored: "not_allowed_channel" });
  }

  const response = await buildAgentResponse(text);
  await postSlackMessage({ channel, text: response, threadTs });

  return NextResponse.json({ ok: true });
}

async function handleSlashLikeCommand(rawBody: string) {
  const params = new URLSearchParams(rawBody);
  const commandText = params.get("text")?.trim() || "Manager, status";
  const text = startsWithKnownAgent(commandText) || commandText.match(/^(approve|pause)\b/i)
    ? commandText
    : `Manager, ${commandText}`;

  const response = await buildAgentResponse(text);
  return NextResponse.json({
    response_type: "in_channel",
    text: response,
  });
}

async function buildAgentResponse(command: string): Promise<string> {
  const normalized = normalizeCommand(command);

  if (normalized.includes("pause all campaign live actions")) {
    return `*Manager pause acknowledged - ${today()}*

All campaign live actions are blocked.

- Do not import contacts into GHL.
- Do not add start-drip tags.
- Do not enable or toggle any HighLevel AI feature.
- Continue read-only checks and local prep only.`;
  }

  const approval = parseApproval(normalized);
  if (approval) return buildApprovalResponse(approval);

  if (mentionsReachColdEmailCampaign(normalized)) return buildReachColdEmailCampaignResponse();
  if (mentionsAgentList(normalized)) return buildAgentListResponse();

  if (mentionsGhlReadiness(normalized)) {
    const result = await runGhlReadinessCheck();
    return `${renderGhlResult(result)}

${buildManagerStatus()}`;
  }

  if (mentionsQaReview(normalized)) return buildQaResponse();

  const addressedAgent = findAddressedAgent(normalized);
  if (addressedAgent) {
    if (addressedAgent === "general-manager" && mentionsBrief(normalized)) return buildManagerStatus();
    if (addressedAgent === "chief-of-staff" && mentionsBrief(normalized)) return buildManagerStatus();
    return buildAgentRoleResponse(addressedAgent);
  }

  if (mentionsBrief(normalized)) return buildManagerStatus();

  return `*Manager command not recognized - ${today()}*

Supported examples:

\`\`\`text
Manager, status
Manager, run Reach Cold Email Campaign
Manager, list agents
Coach, review this copy: ...
Scheduler, what needs attention
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
approve relay import only
pause all campaign live actions
\`\`\``;
}

async function buildReachColdEmailCampaignResponse() {
  const summaries = laneSummaries();
  const recommendation = readRecommendation();
  const ghlResult = await runGhlReadinessCheck();

  return `*Reach Cold Email Campaign - ${today()}*

Manager ran today's active Reach Cold Email Campaign routine.

What ran:

- Sales Manager QA summary from the current prepared lanes.
- GHL Expert read-only readiness check.
- Manager approval gate review.

GHL Expert result: ${ghlResult.ok ? "read-only API check passed" : "read-only API check needs attention"}

Current lanes:

${summaries.map(renderLaneBullet).join("\n")}

What still needs approval or review:

- Sales Manager must decide what to do with QA-flagged rows before live outreach.
- GHL Expert must visually confirm sender/from domains, domain warmup status, workflow email sender nodes, and HighLevel AI toggles OFF.
- Mike must approve import-only before contacts are imported.
- Mike must approve start-drip separately, and only after the lane is marked \`ready_for_drip=yes\`.

Recommended next approval, if Mike wants to move today:

\`\`\`text
approve relay import only
\`\`\`

Do not start drip yet.

Safety:

- No contacts were imported.
- No drip was started.
- No GHL workflows or settings were changed.
- No HighLevel AI features were enabled or toggled.

Plain-English recommendation:

${recommendation}`;
}

function buildManagerStatus() {
  const summaries = laneSummaries();
  const waiting = reachJobs().filter((job) => String(job.status ?? "").startsWith("waiting")).length;

  return `*Manager status - ${today()}*

Current position:

- ${summaries.length} Reach prep jobs are in the queue; ${waiting} are waiting on agent review.
- No live GHL import or start-drip is running from this listener.
- Default Slack command channel is \`#04-aoh-ops\`.

Reach queue:

${summaries.map(renderLaneBullet).join("\n")}

Mike can say:

\`\`\`text
Manager, list agents
Manager, run Reach Cold Email Campaign
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
approve relay import only
pause all campaign live actions
\`\`\``;
}

function buildAgentListResponse() {
  const groups = [
    ["Executive Office", ["chief-of-staff", "scheduler"]],
    ["Company Operations", ["general-manager", "coach"]],
    ["Systems and IT", ["systems-director", "ghl-expert"]],
    ["Sales", ["sales-manager", "scout", "sender", "sorter", "booker", "engagement-scout"]],
    ["Client Success", ["client-success-manager", "hub", "reporter"]],
    ["Client Delivery", ["local-visibility-manager", "reviews-manager", "relay-manager"]],
    ["Marketing", ["editor", "press"]],
  ] as const;

  return `*AOH agent directory*

You can speak to any agent by starting a Slack message with their role name.

${groups
  .map(([department, keys]) => {
    const names = keys.map((key) => AGENTS[key].title).join(", ");
    return `- ${department}: ${names}`;
  })
  .join("\n")}

Examples:

\`\`\`text
General Manager, run Reach Cold Email Campaign
Chief of Staff, brief
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
Coach, review this copy
Reporter, verify report delivery status
Press, what is ready to publish
\`\`\`

Safety remains the same: agents can recommend and prepare, but they do not import contacts, start drips, publish, DM, or enable HighLevel AI without approval.`;
}

function buildAgentRoleResponse(agentKey: AgentKey) {
  const agent = AGENTS[agentKey];
  return `*${agent.title} - ${agent.persona}*

Reports to: ${agent.reportsTo}

Job:
${agent.job}

I can help with:
${agent.canDo.map((item) => `- ${item}`).join("\n")}

Best next command:
\`\`\`text
${agent.nextStep.replace(/^Ask: `|`\.$/g, "")}
\`\`\`

${agent.safety ? `Safety:\n${agent.safety}` : "Safety:\nI can recommend and prepare. Risky or client-facing action still needs approval."}`;
}

function buildQaResponse() {
  return `*Sales Manager Reach QA - ${today()}*

Review focus:

${laneSummaries()
  .map((summary) => `- ${summary.label}: ${summary.verified} verified, ${summary.qaText}; source \`${summary.sourceFile}\``)
  .join("\n")}

Decision rule:

- Remove or approve questionable personal-email contacts before live outreach.
- If a business appears more than once, keep only the best contact unless there is a clear reason.
- Do not ask Mike to approve start-drip until GHL Expert finishes visual sender-domain/warmup/AI-toggle checks.`;
}

function buildApprovalResponse(approval: { laneKey: LaneKey; action: "import" | "start" }) {
  const lane = LANES[approval.laneKey];
  const job = reachJobs().find((item) => item.campaign_lane?.toLowerCase() === approval.laneKey);
  const sourceFile = job?.source_file?.trim() || "CSV_PATH";
  const limit = extractVerifiedCount(job?.notes) || "N";
  const domain = domainRows().find((item) => item.lane?.toLowerCase() === approval.laneKey) ?? {};
  const blockers = approvalBlockers({ action: approval.action, job, domain });
  const command = `npm run reach:launch -- --lane ${approval.laneKey} --csv ${sourceFile} --limit ${limit} --commit${
    approval.action === "start" ? " --start-drip" : ""
  }`;

  return `*Manager heard approval - ${today()}*

Request: ${lane.label} / ${approval.action === "start" ? "start drip" : "import only"}

Current judgment: ${blockers.length ? "blocked before live execution" : "eligible for guarded execution"}

${blockers.length ? `Blockers:\n\n${blockers.map((blocker) => `- ${blocker}`).join("\n")}` : "Blockers: none from the current gates."}

Exact command after clearance:

\`\`\`bash
${command}
\`\`\`

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
}: {
  action: "import" | "start";
  job: CsvRow | undefined;
  domain: CsvRow;
}) {
  const blockers: string[] = [];
  if (!job) blockers.push("No matching job is present in the agent job queue.");
  if (String(domain.ready_for_import ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_import is not yes.");
  }
  if (action === "start" && String(domain.ready_for_drip ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_drip is not yes.");
  }
  if (String(job?.status ?? "").includes("waiting_sales_and_visual_ghl_review")) {
    blockers.push("Sales Manager QA and GHL Expert visual sender-domain/warmup/AI-toggle review are still waiting.");
  }
  if (String(job?.status ?? "").includes("paused")) blockers.push("Campaign live actions are paused.");
  return blockers;
}

async function runGhlReadinessCheck() {
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
    return { ok: true, lines };
  } catch (error) {
    return { ok: false, lines: [error instanceof Error ? error.message : "Unknown GHL readiness error."] };
  }
}

function renderGhlResult(result: { ok: boolean; lines: string[] }) {
  return `*GHL Expert readiness check - ${today()}*

Mode: read-only

Result: ${result.ok ? "passed" : "needs attention"}

${result.lines.map((line) => `- ${line}`).join("\n")}

No contacts, tags, workflows, settings, or HighLevel AI features were changed.`;
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
  if (!token) return;

  await fetch("https://slack.com/api/chat.postMessage", {
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

function isAllowedChannel(channel: string) {
  const allowed = (process.env.SLACK_AGENT_ALLOWED_CHANNEL_IDS ?? "C0ATTA4NBR8")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return allowed.includes(channel);
}

function isSupportedCommand(text: string) {
  const normalized = normalizeCommand(text);
  return (
    mentionsReachColdEmailCampaign(normalized) ||
    mentionsAgentList(normalized) ||
    mentionsBrief(normalized) ||
    mentionsGhlReadiness(normalized) ||
    mentionsQaReview(normalized) ||
    Boolean(findAddressedAgent(normalized)) ||
    normalized.includes("approve") ||
    normalized.includes("pause all campaign live actions")
  );
}

function parseApproval(normalized: string): { laneKey: LaneKey; action: "import" | "start" } | null {
  if (!normalized.includes("approve")) return null;
  const laneKey = (Object.keys(LANES) as LaneKey[]).find((key) =>
    LANES[key].aliases.some((alias) => containsAlias(normalized, alias)),
  );
  if (!laneKey) return null;
  if (normalized.includes("start") || normalized.includes("drip")) return { laneKey, action: "start" };
  if (normalized.includes("import")) return { laneKey, action: "import" };
  return null;
}

function laneSummaries() {
  const domains = domainRows();
  return reachJobs().map((job) => {
    const laneKey = (job.campaign_lane?.toLowerCase() || "reviews") as LaneKey;
    const lane = LANES[laneKey] ?? LANES.reviews;
    const domain = domains.find((item) => item.lane?.toLowerCase() === laneKey) ?? {};
    return {
      label: lane.label,
      verified: extractVerifiedCount(job.notes) || "unknown",
      qaText: readQaText(lane.label),
      status: job.status || "unknown",
      importReady: domain.ready_for_import || "unknown",
      dripReady: domain.ready_for_drip || "unknown",
      domain: domain.dedicated_subdomain || "TBD",
      sourceFile: job.source_file || "missing",
    };
  });
}

function renderLaneBullet(summary: ReturnType<typeof laneSummaries>[number]) {
  return `- ${summary.label}: ${summary.verified} verified, ${summary.qaText}; status \`${summary.status}\`; import ${summary.importReady}; drip ${summary.dripReady}; domain \`${summary.domain}\``;
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
  return normalized.includes("manager status") || normalized.includes("status") || normalized.includes("chief of staff brief") || normalized.includes("brief");
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
  return normalized.includes("run reach cold email campaign") || normalized.includes("start reach cold email campaign") || normalized.includes("reach cold email campaign");
}

function mentionsGhlReadiness(normalized: string) {
  return normalized.includes("ghl") && (normalized.includes("check") || normalized.includes("readiness") || normalized.includes("ready"));
}

function mentionsQaReview(normalized: string) {
  return normalized.includes("qa") || normalized.includes("quality") || normalized.includes("sales manager review");
}

function normalizeCommand(command: string) {
  return command.toLowerCase().replace(/[.,:;|]/g, " ").replace(/\s+/g, " ").trim();
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
  return new Date().toISOString().slice(0, 10);
}
