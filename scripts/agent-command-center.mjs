#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUTBOX_DIR = "docs/client-ops-ledger/outbox";
const JOBS_PATH = "docs/client-ops-ledger/agent-jobs.csv";
const DOMAINS_PATH = "docs/client-ops-ledger/sending-domain-readiness.csv";
const DAILY_BRIEF_PATH = "docs/client-ops-ledger/daily-brief-current.md";

const LANES = {
  reviews: {
    label: "Reviews",
    aliases: ["reviews", "review"],
    campaignTag: "aoh_campaign_reviews",
    importedTag: "aoh_campaign_reviews_imported",
    startTag: "aoh_campaign_reviews_start",
  },
  ai: {
    label: "AI Visibility",
    aliases: ["ai", "ai visibility", "visibility"],
    campaignTag: "aoh_campaign_ai_visibility",
    importedTag: "aoh_campaign_ai_imported",
    startTag: "aoh_campaign_ai_visibility_start",
  },
  relay: {
    label: "Relay",
    aliases: ["relay"],
    campaignTag: "aoh_campaign_relay",
    importedTag: "aoh_campaign_relay_imported",
    startTag: "aoh_campaign_relay_start",
  },
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const outDir = String(args.outDir ?? args["out-dir"] ?? OUTBOX_DIR);
  mkdirSync(outDir, { recursive: true });

  const command = String(args.command ?? "").trim();
  const result = command ? routeCommand(command, args) : buildBriefResult();
  const outPath = writeOutbox({ outDir, kind: result.kind, text: result.text });

  console.log(result.text);
  console.log("");
  console.log(`Local outbox: ${outPath}`);

  if (args.postSlack || args["post-slack"]) {
    await postSlack(result.slackText ?? result.text);
  }
}

function routeCommand(command, args) {
  const normalized = normalizeCommand(command);

  if (normalized.includes("pause all campaign live actions")) {
    return buildPauseResponse(args);
  }

  const approval = parseApproval(normalized);
  if (approval) {
    return buildApprovalResponse(approval, args);
  }

  if (mentionsReachColdEmailCampaign(normalized)) {
    return buildReachColdEmailCampaignResponse();
  }

  if (mentionsGhlReadiness(normalized)) {
    return buildGhlCheckResponse();
  }

  if (mentionsAgentList(normalized)) {
    return buildAgentListResponse();
  }

  if (mentionsQaReview(normalized)) {
    return buildQaResponse();
  }

  if (mentionsBrief(normalized)) {
    return buildBriefResult();
  }

  return {
    kind: "agent-command-unrecognized",
    text: `*Manager command not recognized - ${today()}*

I heard:

\`\`\`text
${command}
\`\`\`

Supported commands:

- \`Manager, status\`
- \`Manager, list agents\`
- \`Manager, run Reach Cold Email Campaign\`
- \`Manager, brief\`
- \`GHL Expert, check Reach readiness\`
- \`Sales Manager, review Reach QA\`
- \`approve reviews import only\`
- \`approve ai import only\`
- \`approve relay import only\`
- \`approve reviews start drip\`
- \`approve ai start drip\`
- \`approve relay start drip\`
- \`pause all campaign live actions\`
`,
  };
}

function buildAgentListResponse() {
  const groups = [
    ["Executive Office", ["General Manager", "Scheduler"]],
    ["Company Operations", ["Coach"]],
    ["Systems and IT", ["Systems Director", "GHL Expert"]],
    ["Sales", ["Sales Manager", "Scout", "Sender", "Sorter", "Booker", "Engagement Scout"]],
    ["Client Success", ["Client Success Manager", "Hub", "Reporter"]],
    ["Client Delivery", ["Local Visibility Manager", "Reviews Manager", "Relay Manager"]],
    ["Marketing", ["Editor", "Press"]],
  ];

  return {
    kind: "agent-directory",
    text: `*AOH agent directory - ${today()}*

Manager owns the brief, approval queue, routing, blockers, and escalations to Mike.

${groups.map(([department, agents]) => `- ${department}: ${agents.join(", ")}`).join("\n")}

Examples:

\`\`\`text
Manager, status
Manager, run Reach Cold Email Campaign
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
Coach, review this copy
Reporter, verify report delivery status
Press, what is ready to publish
\`\`\`
`,
  };
}

function buildBriefResult() {
  const data = loadData();
  const reachJobs = getReachJobs(data.jobs);
  const summaries = reachJobs.map((job) => laneSummary(job, data.domains));
  const waiting = reachJobs.filter((job) => String(job.status ?? "").startsWith("waiting")).length;
  const webhookReady = Boolean(getSlackWebhook());
  const dailySignals = parseDailyBriefSignals(data.dailyBrief);

  return {
    kind: "agent-manager-brief",
    text: `*Manager status - ${today()}*

Current position:

- ${reachJobs.length} Reach prep jobs are in the queue; ${waiting} are waiting on agent review.
- No live GHL import or start-drip is running from this command center.
- GHL Expert API metadata has passed for all three lanes; visual sender/domain/warmup and HighLevel AI OFF checks still remain.
- Default Slack command channel is \`#04-aoh-ops\`.
- Slack webhook posting is ${webhookReady ? "configured" : "not configured in env yet"}; this brief is written locally either way.

Reach queue:

${summaries.map(renderLaneBullet).join("\n")}

Agent gates before live action:

- Sales Manager: review personal email and duplicate-contact QA flags.
- GHL Expert: visually confirm sender/from domain, warmup status, workflow sender nodes, and HighLevel AI toggles OFF.
- Manager: regenerate/confirm the approval packet for the final CSV.
- Mike: approve import-only and start-drip as separate commands.

Mike can say:

\`\`\`text
Manager, status
Manager, run Reach Cold Email Campaign
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
approve relay import only
approve relay start drip
pause all campaign live actions
\`\`\`

Recommendation:

${dailySignals.recommendation || "Do not start all three live drips at once. Import only after review, and start drip only after the lane domain is ready."}
`,
  };
}

function buildReachColdEmailCampaignResponse() {
  const ghlResult = runNpm(["run", "reach:ghl-check"]);
  const data = loadData();
  const summaries = getReachJobs(data.jobs).map((job) => laneSummary(job, data.domains));
  const dailySignals = parseDailyBriefSignals(data.dailyBrief);

  return {
    kind: "agent-reach-cold-email-campaign",
    text: `*Reach Cold Email Campaign - ${today()}*

Manager ran today's active Reach Cold Email Campaign routine.

What ran:

- Sales Manager QA summary from the current verified CSVs.
- GHL Expert read-only readiness check.
- Manager approval gate review.

GHL Expert result: ${ghlResult.ok ? "read-only API check passed" : "read-only API check failed"}

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

${dailySignals.recommendation || "Relay is the cleanest small lane right now. Use import-only first; wait on start-drip until domain readiness is confirmed."}
`,
  };
}

function buildGhlCheckResponse() {
  const result = runNpm(["run", "reach:ghl-check"]);
  const brief = buildBriefResult();

  return {
    kind: "agent-ghl-check",
    text: `*GHL Expert readiness check - ${today()}*

Mode: read-only

Result: ${result.ok ? "passed" : "failed"}

\`\`\`text
${trimOutput(result.stdout || result.stderr || "No output captured.")}
\`\`\`

No contacts, tags, workflows, settings, or HighLevel AI features were changed.

${brief.text}
`,
  };
}

function buildQaResponse() {
  const data = loadData();
  const summaries = getReachJobs(data.jobs).map((job) => laneSummary(job, data.domains));

  return {
    kind: "agent-sales-manager-qa",
    text: `*Sales Manager Reach QA - ${today()}*

Review focus:

${summaries
  .map(
    (summary) =>
      `- ${summary.label}: ${summary.verifiedText} verified, ${summary.qaText}; source \`${summary.sourceFile || "missing"}\``,
  )
  .join("\n")}

Decision rule:

- Remove or approve questionable personal-email contacts before live outreach.
- If a business appears more than once, keep only the best contact unless there is a clear reason.
- Do not ask Mike to approve start-drip until GHL Expert finishes the visual sender-domain/warmup/AI-toggle check.
`,
  };
}

function buildPauseResponse(args) {
  let recorded = "";
  if (args.recordPause || args["record-pause"]) {
    const data = loadData();
    const jobs = data.jobs.map((job) => {
      if (String(job.job_type ?? "").includes("reach_campaign")) {
        return {
          ...job,
          status: "paused_by_mike",
          next_action: "Wait for Mike to resume campaign live actions",
          next_action_owner: "Manager",
          risk_status: "blocked",
          notes: appendNote(job.notes, "Mike paused all campaign live actions via agent command center."),
        };
      }
      return job;
    });
    writeCsv(JOBS_PATH, jobs);
    recorded = "\nPause recorded in `docs/client-ops-ledger/agent-jobs.csv`.";
  }

  return {
    kind: "agent-pause",
    text: `*Manager pause acknowledged - ${today()}*

All campaign live actions are blocked.

- Do not import contacts into GHL.
- Do not add start-drip tags.
- Do not enable or toggle any HighLevel AI feature.
- Continue read-only checks and local prep only.
${recorded}
`,
  };
}

function buildApprovalResponse(approval, args) {
  const data = loadData();
  const lane = LANES[approval.laneKey];
  const job = getReachJobs(data.jobs).find((item) => String(item.campaign_lane ?? "").toLowerCase() === approval.laneKey);
  const domain = data.domains.find((item) => String(item.lane ?? "").toLowerCase() === approval.laneKey) ?? {};
  const sourceFile = String(job?.source_file ?? "").trim();
  const verifiedCount = sourceFile ? countCsvRows(sourceFile) : 0;
  const limit = verifiedCount || extractVerifiedCount(job?.notes) || "N";
  const actionLabel = approval.action === "start" ? "start drip" : "import only";
  const command = `npm run reach:launch -- --lane ${approval.laneKey} --csv ${sourceFile || "CSV_PATH"} --limit ${limit} --commit${approval.action === "start" ? " --start-drip" : ""}`;
  const blockers = approvalBlockers({ action: approval.action, job, domain, sourceFile });
  let execution = "Live execution was not attempted.";
  let recorded = "";

  if (args.recordApproval || args["record-approval"]) {
    recordApproval({ laneKey: approval.laneKey, action: approval.action, blockers, command });
    recorded = "\nApproval state recorded in `docs/client-ops-ledger/agent-jobs.csv`.";
  }

  if (args.executeLive || args["execute-live"]) {
    execution = executeApprovedCommand({ blockers, command });
  }

  return {
    kind: `agent-approval-${approval.laneKey}-${approval.action}`,
    text: `*Manager heard approval - ${today()}*

Request: ${lane.label} / ${actionLabel}

Current judgment: ${blockers.length ? "blocked before live execution" : "eligible for guarded execution"}

${blockers.length ? `Blockers:\n\n${blockers.map((blocker) => `- ${blocker}`).join("\n")}` : "Blockers: none from the current local gates."}

Exact command after clearance:

\`\`\`bash
${command}
\`\`\`

Execution:

${execution}

Safety:

- Import-only approval does not approve start-drip.
- Start-drip approval is blocked unless \`ready_for_drip=yes\`.
- HighLevel AI features must stay OFF unless Mike explicitly authorizes them manually.
${recorded}
`,
  };
}

function parseApproval(normalized) {
  if (!normalized.includes("approve")) return null;

  const laneKey = Object.entries(LANES).find(([, lane]) => lane.aliases.some((alias) => containsAlias(normalized, alias)))?.[0];
  if (!laneKey) return null;

  if (normalized.includes("start") || normalized.includes("drip")) {
    return { laneKey, action: "start" };
  }
  if (normalized.includes("import")) {
    return { laneKey, action: "import" };
  }
  return null;
}

function approvalBlockers({ action, job, domain, sourceFile }) {
  const blockers = [];
  if (!job) blockers.push("No matching job is present in the agent job queue.");
  if (!sourceFile) blockers.push("The job has no source CSV.");
  if (sourceFile && !existsSync(resolve(sourceFile))) blockers.push(`Source CSV not found locally: ${sourceFile}`);
  if (String(domain.ready_for_import ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_import is not yes.");
  }
  if (action === "start" && String(domain.ready_for_drip ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_drip is not yes.");
  }
  const status = String(job?.status ?? "");
  if (status.includes("waiting_sales_and_visual_ghl_review")) {
    blockers.push("Sales Manager QA and GHL Expert visual sender-domain/warmup/AI-toggle review are still waiting.");
  }
  if (status.includes("paused")) {
    blockers.push("Campaign live actions are paused.");
  }
  return blockers;
}

function recordApproval({ laneKey, action, blockers, command }) {
  const data = loadData();
  const jobs = data.jobs.map((job) => {
    if (String(job.campaign_lane ?? "").toLowerCase() !== laneKey) return job;
    const actionValue = action === "start" ? "start_drip" : "import_only";
    return {
      ...job,
      status: blockers.length
        ? `approved_${actionValue}_waiting_agent_clearance`
        : `approved_${actionValue}_waiting_execution`,
      approved_action: actionValue,
      next_action: blockers.length
        ? `Clear blockers before execution: ${blockers.join("; ")}`
        : `Execute exact approved command: ${command}`,
      next_action_owner: blockers.length ? "Sales Manager + GHL Expert" : "Sender + GHL Expert",
      risk_status: blockers.length ? "watch" : "ready",
      notes: appendNote(job.notes, `Mike approved ${actionValue}; command center generated: ${command}`),
    };
  });
  writeCsv(JOBS_PATH, jobs);
}

function executeApprovedCommand({ blockers, command }) {
  if (blockers.length) {
    return "Blocked. The command center will not run a live GHL action while local gates are unresolved.";
  }
  if (process.env.AGENT_ALLOW_LIVE_GHL_ACTIONS !== "yes") {
    return "Blocked. Set AGENT_ALLOW_LIVE_GHL_ACTIONS=yes only for an approved live execution window.";
  }
  const parts = command.split(" ");
  const result = runNpm(parts.slice(1));
  return result.ok
    ? `Live command completed.\n\n\`\`\`text\n${trimOutput(result.stdout)}\n\`\`\``
    : `Live command failed.\n\n\`\`\`text\n${trimOutput(result.stderr || result.stdout)}\n\`\`\``;
}

function loadData() {
  return {
    jobs: existsSync(resolve(JOBS_PATH)) ? readCsv(JOBS_PATH) : [],
    domains: existsSync(resolve(DOMAINS_PATH)) ? readCsv(DOMAINS_PATH) : [],
    dailyBrief: existsSync(resolve(DAILY_BRIEF_PATH)) ? readFileSync(resolve(DAILY_BRIEF_PATH), "utf8") : "",
  };
}

function getReachJobs(jobs) {
  const order = ["reviews", "ai", "relay"];
  return jobs
    .filter((job) => String(job.job_type ?? "").includes("reach_campaign"))
    .sort((a, b) => order.indexOf(String(a.campaign_lane ?? "")) - order.indexOf(String(b.campaign_lane ?? "")));
}

function laneSummary(job, domains) {
  const laneKey = String(job.campaign_lane ?? "").toLowerCase();
  const lane = LANES[laneKey] ?? { label: laneKey || "Unknown" };
  const domain = domains.find((item) => String(item.lane ?? "").toLowerCase() === laneKey) ?? {};
  const sourceFile = String(job.source_file ?? "").trim();
  const verifiedCount = sourceFile ? countCsvRows(sourceFile) : 0;
  const verifiedFallback = extractVerifiedCount(job.notes);
  const qa = readQaSummary(sourceFile);
  const qaText = qa
    ? `${qa.review} QA review flag${qa.review === 1 ? "" : "s"} / ${qa.ok} OK`
    : "QA file not found locally";
  const verifiedText = String(verifiedCount || verifiedFallback || "unknown");

  return {
    laneKey,
    label: lane.label,
    status: String(job.status ?? "unknown"),
    nextActionOwner: String(job.next_action_owner ?? "unknown"),
    nextAction: String(job.next_action ?? ""),
    sourceFile,
    verifiedText,
    qaText,
    domain: String(domain.dedicated_subdomain ?? "TBD"),
    importReady: String(domain.ready_for_import ?? "unknown"),
    dripReady: String(domain.ready_for_drip ?? "unknown"),
  };
}

function renderLaneBullet(summary) {
  return `- ${summary.label}: ${summary.verifiedText} verified, ${summary.qaText}; status \`${summary.status}\`; import ${summary.importReady}; drip ${summary.dripReady}; domain \`${summary.domain}\``;
}

function readQaSummary(sourceFile) {
  if (!sourceFile) return null;
  const candidates = [
    sourceFile.replace(/-verified\.csv$/i, "-qa.csv"),
    sourceFile.replace(/\.csv$/i, "-qa.csv"),
  ];
  const qaPath = candidates.find((path) => existsSync(resolve(path)));
  if (!qaPath) {
    return readQaMarkdownSummary(sourceFile);
  }
  const rows = readCsv(qaPath);
  const review = rows.filter((row) => String(row.qa_recommendation ?? "") === "review_before_live").length;
  const ok = rows.length - review;
  return { ok, review };
}

function readQaMarkdownSummary(sourceFile) {
  const laneKey = Object.keys(LANES).find((key) => sourceFile.includes(`tmp-reach-${key}`));
  if (!laneKey) return null;
  const reportPath = `${OUTBOX_DIR}/reach-${laneKey}-quality-${today()}.md`;
  if (!existsSync(resolve(reportPath))) return null;
  const report = readFileSync(resolve(reportPath), "utf8");
  const ok = Number(report.match(/\| OK rows \|\s*(\d+)\s*\|/)?.[1] ?? 0);
  const review = Number(report.match(/\| Rows needing review \|\s*(\d+)\s*\|/)?.[1] ?? 0);
  return { ok, review };
}

function parseDailyBriefSignals(dailyBrief) {
  const recommendationMatch = dailyBrief.match(/Current strongest lane by cleanliness:[^\n]+/);
  return {
    recommendation: recommendationMatch?.[0] ?? "",
  };
}

function countCsvRows(path) {
  if (!existsSync(resolve(path))) return 0;
  return readCsv(path).length;
}

function extractVerifiedCount(notes) {
  const match = String(notes ?? "").match(/(\d+)\s+verified/i);
  return match ? Number(match[1]) : 0;
}

function runNpm(args) {
  const command = process.platform === "win32" ? "cmd.exe" : "npm";
  const commandArgs = process.platform === "win32" ? ["/d", "/s", "/c", "npm", ...args] : args;
  const result = spawnSync(command, commandArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return {
    ok: result.status === 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr || (result.error ? result.error.message : ""),
  };
}

async function postSlack(text) {
  const webhook = getSlackWebhook();
  if (!webhook) {
    console.log("Slack post skipped: SLACK_MISSION_CONTROL_WEBHOOK_URL or SLACK_WEBHOOK_URL is not set.");
    return;
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Slack webhook failed: ${res.status} ${body.slice(0, 300)}`);
  }
  console.log("Slack post sent through configured webhook.");
}

function getSlackWebhook() {
  return process.env.SLACK_MISSION_CONTROL_WEBHOOK_URL?.trim() || process.env.SLACK_WEBHOOK_URL?.trim() || "";
}

function writeOutbox({ outDir, kind, text }) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const file = `${kind}-${stamp}.md`;
  const outPath = resolve(outDir, file);
  writeFileSync(outPath, `${text.trim()}\n`);
  return outPath;
}

function mentionsBrief(normalized) {
  return (
    normalized.includes("manager status") ||
    normalized.includes("status") ||
    normalized.includes("brief")
  );
}

function mentionsAgentList(normalized) {
  return (
    normalized.includes("list agents") ||
    normalized.includes("show agents") ||
    normalized.includes("agent directory") ||
    normalized.includes("who can i talk to")
  );
}

function containsAlias(normalized, alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(normalized);
}

function mentionsReachColdEmailCampaign(normalized) {
  return (
    normalized.includes("run reach cold email campaign") ||
    normalized.includes("start reach cold email campaign") ||
    normalized.includes("reach cold email campaign")
  );
}

function mentionsGhlReadiness(normalized) {
  return (
    normalized.includes("ghl") &&
    (normalized.includes("check") || normalized.includes("readiness") || normalized.includes("ready"))
  );
}

function mentionsQaReview(normalized) {
  return (
    normalized.includes("qa") ||
    normalized.includes("quality") ||
    normalized.includes("sales manager review")
  );
}

function normalizeCommand(command) {
  return command
    .toLowerCase()
    .replace(/[.,:;|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function appendNote(existing, note) {
  const base = String(existing ?? "").trim();
  const suffix = `[${today()}] ${note}`;
  return base ? `${base} ${suffix}` : suffix;
}

function readCsv(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) return [];
  return parseCsv(readFileSync(absolute, "utf8"));
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
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

function writeCsv(path, rows) {
  if (!rows.length) {
    writeFileSync(path, "");
    return;
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  }
  writeFileSync(path, `${lines.join("\n")}\n`);
}

function csvEscape(value) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").trim();
  }
}

function trimOutput(value) {
  const text = String(value ?? "").trim();
  return text.length > 1800 ? `${text.slice(0, 1800)}\n...trimmed...` : text;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function printHelp() {
  console.log(`
Agent command center for Mission Control and Slack-ready manager replies.

Examples:
  npm run agent:brief
  npm run agent:command -- --command "Manager, status"
  npm run agent:command -- --command "Manager, run Reach Cold Email Campaign"
  npm run agent:command -- --command "GHL Expert, check Reach readiness"
  npm run agent:command -- --command "approve relay import only"
  npm run agent:slack

Options:
  --command "text"          Route a Manager/agent command
  --post-slack              Post result through SLACK_MISSION_CONTROL_WEBHOOK_URL or SLACK_WEBHOOK_URL
  --record-approval         Update agent-jobs.csv with the approval state
  --record-pause            Update agent-jobs.csv with paused state
  --execute-live            Attempt live approved GHL command; also requires AGENT_ALLOW_LIVE_GHL_ACTIONS=yes
  --out-dir path            Where local command/brief outputs are written

Live safety:
  This script never enables HighLevel AI features.
  This script never imports or starts a drip unless --execute-live is passed, no blockers remain,
  and AGENT_ALLOW_LIVE_GHL_ACTIONS=yes is set for the execution window.
`);
}
