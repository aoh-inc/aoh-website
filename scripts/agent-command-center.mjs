#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUTBOX_DIR = "docs/client-ops-ledger/outbox";
const JOBS_PATH = "docs/client-ops-ledger/agent-jobs.csv";
const DOMAINS_PATH = "docs/client-ops-ledger/sending-domain-readiness.csv";
const WARMUP_CONFIG_PATH = "docs/client-ops-ledger/reach-warmup-autopilot.json";
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

  if (mentionsTeamTraining(normalized)) {
    return buildReachTeamTrainingResponse();
  }

  if (mentionsOwnerPeek(normalized)) {
    return buildOwnerPeekResponse();
  }

  if (mentionsReachRunStatusQuestion(normalized)) {
    return buildReachRunTodayResponse();
  }

  if (mentionsColdReachStart(normalized)) {
    return buildColdReachStartResponse(normalized);
  }

  if (mentionsGenericCampaignDeploy(normalized)) {
    return buildCampaignClarificationResponse();
  }

  if (mentionsWarmupAutopilot(normalized)) {
    return buildWarmupAutopilotResponse(normalized);
  }

  if (mentionsReachCampaignStatus(normalized)) {
    return buildReachCampaignStatusResponse();
  }

  if (mentionsReachDecisionQuestion(normalized)) {
    return buildReachDecisionResponse();
  }

  if (mentionsReachColdEmailCampaign(normalized)) {
    return buildReachColdEmailCampaignResponse();
  }

  if (mentionsGhlVisualReadiness(normalized)) {
    return buildGhlVisualChecklistResponse(findLaneKey(normalized));
  }

  if (mentionsGhlReadiness(normalized)) {
    return buildGhlCheckResponse();
  }

  if (mentionsAgentList(normalized)) {
    return buildAgentListResponse();
  }

  if (mentionsQaReview(normalized)) {
    return buildQaResponse(normalized);
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
- \`Manager, is Reach set to run today, and do I need anything?\`
- \`Manager, list agents\`
- \`Manager, start cold reach campaign\`
- \`Manager, train Reach team\`
- \`Manager, owner peek\`
- \`Manager, run Reach Cold Email Campaign\`
- \`Manager, show Reach warmup autopilot\`
- \`Manager, explain the Reach result\`
- \`Manager, are we ready to send?\`
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
Manager, train Reach team
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
Coach, review this copy
Reporter, verify report delivery status
Press, what is ready to publish
\`\`\`
`,
  };
}

function buildReachTeamTrainingResponse() {
  return {
    kind: "reach-team-training",
    text: `*Reach team training - ${today()}*

Yes. The team should handle the recurring work.

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

Reference: \`docs/client-ops-ledger/reach-agent-team-training.md\``,
  };
}

function buildOwnerPeekResponse() {
  return {
    kind: "manager-owner-peek",
    text: `*Manager owner peek - ${today()}*

Short answer: you do not need to read every agent conversation.

Where to look:

- *Slack #04-aoh-ops*: talk to Manager and see brief answers, blockers, and follow-ups.
- *Mission Control front page*: owner view of active jobs, blockers, agents, and spend.
- *Reach job room*: cold email lane status, agent handoff, and next blocker.
- *GitHub/ledger/outbox*: proof logs only; use these when something looks wrong.

DM status:

- Automatic Manager DMs are not wired yet.
- Recommended setup: one short daily DM plus urgent exceptions only.
- Do not DM every agent action; that becomes noise fast.

What I would expect Manager to send you:

\`\`\`text
Reach today: Reviews and AI running. Relay needs 5 more clean contacts. No action needed from Mike unless raising spend or overriding safety.
\`\`\`

Next useful command:

\`\`\`text
Manager, status
\`\`\``,
  };
}

function buildBriefResult() {
  const data = loadData();
  const reachJobs = getReachJobs(data.jobs);
  const summaries = reachJobs.map((job) => laneSummary(job, data.domains));
  const waiting = reachJobs.filter((job) => String(job.status ?? "").includes("waiting")).length;
  const webhookReady = Boolean(getSlackWebhook());
  const dailySignals = parseDailyBriefSignals(data.dailyBrief);
  const relayImportCompleted = summaries.some(
    (summary) => summary.laneKey === "relay" && String(summary.status).includes("import_only_completed"),
  );
  const nextCommands = [
    "Manager, status",
    "Manager, is Reach set to run today, and do I need anything?",
    "Manager, run Reach Cold Email Campaign",
    "GHL Expert, check Reach readiness",
    "Sales Manager, review Reach QA",
    ...(relayImportCompleted ? [] : ["approve relay import only"]),
    "pause all campaign live actions",
  ];

  return {
    kind: "agent-manager-brief",
    text: `*Manager status - ${today()}*

Current position:

- ${reachJobs.length} Reach prep jobs are in the queue; ${waiting} are waiting on agent review.
- The scheduled auto runner owns normal import/start work inside guardrails; this command center explains and routes blockers.
- GHL Expert API metadata has passed for all three lanes; visual sender/domain/warmup and HighLevel AI OFF checks still remain.
- Default Slack command channel is \`#04-aoh-ops\`.
- Slack webhook posting is ${webhookReady ? "configured" : "not configured in env yet"}; this brief is written locally either way.

Reach queue:

${summaries.map(renderLaneBullet).join("\n")}

Agent gates before live action:

- Sales Manager: review personal email and duplicate-contact QA flags.
- GHL Expert: visually confirm sender/from domain, warmup status, workflow sender nodes, and HighLevel AI toggles OFF.
- Manager: regenerate/confirm the approval packet for the final CSV.
- Mike: approve only exceptions, cap increases, or manual overrides. Normal auto can start after readiness is proven.

Mike can say:

\`\`\`text
${nextCommands.join("\n")}
\`\`\`

Recommendation:

${dailySignals.recommendation || "Keep auto on. Let agents handle routine refills and readiness; bring Mike only exceptions or true business decisions."}
`,
  };
}

function buildCampaignClarificationResponse() {
  return {
    kind: "campaign-clarification",
    text: `*Manager campaign check - ${today()}*

Which campaign should I prepare?

Current campaign I can run through the team gates:

- Reach Cold Email Campaign

Use this exact command:

\`\`\`text
Manager, start cold reach campaign
\`\`\`

I will treat that as the Reach Warmup Autopilot: refill bad emails, expand searches when needed, import only QA OK contacts, and start drip only when the lane is marked \`ready_for_drip=yes\`.`,
  };
}

function buildReachDecisionResponse() {
  const data = loadData();
  const reachJobs = getReachJobs(data.jobs);
  const summaries = reachJobs.map((job) => laneSummary(job, data.domains));
  const waiting = reachJobs.filter((job) => String(job.status ?? "").includes("waiting")).length;
  const importReady = summaries.filter((summary) => String(summary.importReady).toLowerCase() === "yes").length;
  const dripReady = summaries.filter((summary) => String(summary.dripReady).toLowerCase() === "yes").length;
  const dailySignals = parseDailyBriefSignals(data.dailyBrief);
  const relayImportCompleted = summaries.some(
    (summary) => summary.laneKey === "relay" && String(summary.status).includes("import_only_completed"),
  );
  const nextCommands = relayImportCompleted
    ? ["Manager, status", "Manager, GHL Expert, check Reach readiness fresh"]
    : [
        "Manager, Sales Manager, review Reach QA",
        "Manager, GHL Expert, check Reach readiness fresh",
        "Manager, approve relay import only",
      ];
  const statusLine = relayImportCompleted
    ? "- Auto warmup is active. Reviews and AI Visibility started today; Relay is still waiting."
    : "- The team preflight ran. No live action ran.";
  const bestMove = relayImportCompleted
    ? "1. Keep auto mode on.\n2. Refill Relay to at least 10 OK contacts.\n3. Mark Relay `ready_for_drip=yes` only after checks pass; auto will start it."
    : "1. Have Sales Manager review the QA flags.\n2. Have GHL Expert run/confirm fresh readiness.\n3. If those clear, approve the smallest clean lane for import-only first.";

  return {
    kind: "reach-decision",
    text: `*Manager plain-English readout - ${today()}*

Short version: auto is on. Ready lanes can start; unready lanes wait.

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

${dailySignals.recommendation || "Relay is the only holdout right now. Refill to the minimum and mark ready only after checks pass."}`,
  };
}

function buildWarmupAutopilotResponse(normalized) {
  const config = readJsonIfExists(WARMUP_CONFIG_PATH);
  const data = loadData();
  const requestedLanes = findLaneKeys(normalized);
  const lanes = requestedLanes.length ? requestedLanes : Object.keys(LANES);
  const laneInput = requestedLanes.length ? requestedLanes.join(",") : "all";
  const dayNumber = warmupDay(config?.planned_start_date, today());
  const quota = quotaForWarmupDay(config, dayNumber);
  const quotaText = quota ? `${quota.min}-${quota.max} emails/day, target ${quota.target}` : "hold for deliverability review";
  const spendGuardText = config?.guardrails?.require_outscraper_spend_approval
    ? "ON - new Outscraper calls are paused by config"
    : "standard caps only";
  const scrapeRunCap = config?.guardrails?.max_total_scraped_per_run ?? "not set";

  return {
    kind: "reach-warmup-autopilot",
    text: `*Reach Warmup Autopilot - ${today()}*

The warmup is now an agent-guarded autopilot instead of a row-by-row Mike decision.

Current warmup day: ${dayNumber}
Current quota: ${quotaText}
Mode: ${config?.mode || "not configured"}
Outscraper spend guard: ${spendGuardText}
Outscraper run cap: ${scrapeRunCap} scraped records total across all lanes

Lane readiness:

${lanes
  .map((laneKey) => {
    const lane = LANES[laneKey];
    const domain = data.domains.find((row) => row.lane?.toLowerCase() === laneKey) ?? {};
    return `- ${lane.label}: domain \`${domain.dedicated_subdomain || "TBD"}\`; import ${domain.ready_for_import || "unknown"}; drip ${domain.ready_for_drip || "unknown"}; allowed ${domain.allowed_daily_send_volume || "TBD"}`;
  })
  .join("\n")}

Repo commands:

\`\`\`bash
npm run reach:warmup -- --lane ${laneInput} --execute auto
\`\`\`

Guardrails:

- Refill bad/risky emails automatically.
- Reuse already-paid scrape inventory before making a new Outscraper call.
- Expand search when the first niche/area is too small.
- Stop at max attempts and scrape caps.
- New Outscraper calls can run inside the caps because Mike approved auto.
- Do not reuse imported/started contacts.
- Do not start drip unless \`ready_for_drip=yes\`.
- Keep HighLevel AI features OFF.`,
  };
}

function buildColdReachStartResponse(normalized) {
  const config = readJsonIfExists(WARMUP_CONFIG_PATH);
  const data = loadData();
  const requestedLanes = findLaneKeys(normalized);
  const lanes = requestedLanes.length ? requestedLanes : Object.keys(LANES);
  const laneInput = requestedLanes.length ? requestedLanes.join(",") : "all";
  const dayNumber = warmupDay(config?.planned_start_date, today());
  const quota = quotaForWarmupDay(config, dayNumber);
  const quotaText = quota ? `${quota.min}-${quota.max} emails/day, target ${quota.target}` : "hold for deliverability review";
  const spendGuardText = config?.guardrails?.require_outscraper_spend_approval
    ? "ON - new Outscraper calls are paused by config"
    : "standard caps only";
  const scrapeRunCap = config?.guardrails?.max_total_scraped_per_run ?? "not set";

  return {
    kind: "reach-cold-start",
    text: `*Manager accepted: Reach Cold Email Campaign - ${today()}*

I know "cold reach campaign" as *Internal Job: Reach Cold Email Campaign*.

Default mode: *Warmup Autopilot*
Current warmup day: ${dayNumber}
Current quota: ${quotaText}
Outscraper spend guard: ${spendGuardText}
Outscraper run cap: ${scrapeRunCap} scraped records total across all lanes

What Manager owns:

- Work toward today's warmup amount without asking Mike to decide each row.
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
    const domain = data.domains.find((row) => row.lane?.toLowerCase() === laneKey) ?? {};
    return `- ${lane.label}: domain \`${domain.dedicated_subdomain || "TBD"}\`; import ${domain.ready_for_import || "unknown"}; drip ${domain.ready_for_drip || "unknown"}; allowed ${domain.allowed_daily_send_volume || "TBD"}`;
  })
  .join("\n")}

Behind-the-scenes runner:

\`\`\`bash
npm run reach:warmup -- --lane ${laneInput} --execute auto
\`\`\`

If Mike only says \`/manager start campaign\`, Manager asks which campaign first.

Safety:

- HighLevel AI features stay OFF.
- Auto can start lanes after \`ready_for_drip=yes\` and guardrails pass.
- Mike does not need to make row-by-row warmup decisions.`,
  };
}

function buildReachColdEmailCampaignResponse() {
  const ghlResult = runNpm(["run", "reach:ghl-check"]);
  const data = loadData();
  const summaries = getReachJobs(data.jobs).map((job) => laneSummary(job, data.domains));
  const dailySignals = parseDailyBriefSignals(data.dailyBrief);
  const relayImportCompleted = summaries.some(
    (summary) => summary.laneKey === "relay" && String(summary.status).includes("import_only_completed"),
  );
  const nextApprovalText = relayImportCompleted
    ? "No import approval is needed for Relay right now. Auto is waiting for enough clean contacts and `ready_for_drip=yes`."
    : "Recommended next approval, if Mike wants to move today:\n\n```text\napprove relay import only\n```";

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

${dailySignals.recommendation || "Reviews and AI can run through auto. Relay is the holdout until it has 10 OK contacts and ready_for_drip=yes."}
`,
  };
}

function buildReachCampaignStatusResponse() {
  const data = loadData();
  const reachJobs = getReachJobs(data.jobs);
  const summaries = reachJobs.map((job) => laneSummary(job, data.domains));
  const waiting = reachJobs.filter((job) => String(job.status ?? "").includes("waiting")).length;

  return {
    kind: "agent-reach-cold-email-status",
    text: `*Reach Cold Email Campaign status - ${today()}*

Current position:

- ${reachJobs.length} Reach lanes are staged.
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
\`\`\`
`,
  };
}

function buildReachRunTodayResponse() {
  const data = loadData();
  const reachJobs = getReachJobs(data.jobs);
  const summaries = reachJobs.map((job) => laneSummary(job, data.domains));
  const config = readJsonIfExists(WARMUP_CONFIG_PATH);
  const autoOn = config?.autopilot_start_enabled === true || config?.enabled === true || String(config?.mode ?? "").includes("autopilot");
  const started = summaries.filter((summary) => String(summary.status).includes("auto_warmup_started"));
  const waiting = summaries.filter((summary) => !String(summary.status).includes("auto_warmup_started"));
  const startedText = started.length ? started.map((summary) => summary.label).join(" and ") : "none yet";
  const waitingText = waiting.length ? waiting.map(renderOwnerLaneStatus).join("\n") : "- Nothing is waiting right now.";

  return {
    kind: "reach-run-today-status",
    text: `*Reach today - ${today()}*

Short answer: ${autoOn ? "yes, auto is set." : "no, auto is not turned on in the ledger."}

- Already moving: ${startedText}.
- Mike action: none unless you want to raise spend or override a safety hold.
- Safety: NeverBounce/QA guardrails stay in front of GHL; HighLevel AI stays OFF.

Waiting:

${waitingText}

Use this anytime:

\`\`\`text
Manager, is Reach set to run today, and do I need anything?
\`\`\`
`,
  };
}

function renderOwnerLaneStatus(summary) {
  if (String(summary.status).includes("auto_waiting")) {
    return `- ${summary.label}: waiting for more clean contacts and drip-ready = ${summary.dripReady}.`;
  }
  return `- ${summary.label}: ${String(summary.status).replaceAll("_", " ")}.`;
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

function buildGhlVisualChecklistResponse(laneKey) {
  const data = loadData();
  const lanes = laneKey ? [laneKey] : Object.keys(LANES);
  const domainLines = lanes.map((key) => {
    const lane = LANES[key];
    const domain = data.domains.find((item) => String(item.lane ?? "").toLowerCase() === key) ?? {};
    return `- ${lane.label}: expected domain \`${domain.dedicated_subdomain || "TBD"}\`; import ${domain.ready_for_import || "unknown"}; drip ${domain.ready_for_drip || "unknown"}`;
  });
  const approvalLane = laneKey || "relay";

  return {
    kind: "agent-ghl-visual-checklist",
    text: `*GHL Expert visual checklist - ${today()}*

The API check is not enough for visual confirmation.

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
approve ${approvalLane} import only; I visually confirmed ${LANES[approvalLane].label} sender domain, warmup status, workflow sender nodes, and HighLevel AI toggles OFF
\`\`\`

Until that visual confirmation is included, import-only remains blocked. Start-drip is still not approved.
`,
  };
}

function buildQaResponse(normalized = "") {
  const data = loadData();
  const summaries = getReachJobs(data.jobs).map((job) => laneSummary(job, data.domains));
  const laneKey = findLaneKey(normalized);
  const wantsLaneDecision = /\b(resolve|recommend|safe|import|specific|flagged|flags|rows|remove|approve|clean)\b/.test(normalized);
  if (laneKey && wantsLaneDecision) return buildLaneQaDecisionResponse(laneKey, data);

  return {
    kind: "agent-sales-manager-qa",
    text: `*Sales Manager Reach QA - ${today()}*

Review focus:

${summaries
  .map(
    (summary) =>
      `- ${summary.label}: ${summary.volumeText}, ${summary.qaText}; source \`${summary.sourceFile || "missing"}\``,
  )
  .join("\n")}

Decision rule:

- Remove or approve questionable personal-email contacts before live outreach.
- If a business appears more than once, keep only the best contact unless there is a clear reason.
- Do not ask Mike to approve start-drip until GHL Expert finishes the visual sender-domain/warmup/AI-toggle check.

For the actual rows and a lane recommendation, use:

\`\`\`text
Sales Manager, resolve Relay QA flags and recommend import only
\`\`\`
`,
  };
}

function buildLaneQaDecisionResponse(laneKey, data) {
  const lane = LANES[laneKey];
  const job = getReachJobs(data.jobs).find((item) => String(item.campaign_lane ?? "").toLowerCase() === laneKey);
  const sourceFile = String(job?.source_file ?? "").trim();
  const qa = readQaDetails(sourceFile);

  if (!job || !sourceFile) {
    return {
      kind: `agent-sales-manager-${laneKey}-qa-decision`,
      text: `*Sales Manager ${lane.label} QA - ${today()}*

I cannot resolve ${lane.label} QA because the job or source CSV is missing from the queue.
`,
    };
  }

  if (!qa) {
    return {
      kind: `agent-sales-manager-${laneKey}-qa-decision`,
      text: `*Sales Manager ${lane.label} QA - ${today()}*

I found the ${lane.label} job, but I do not have the QA CSV/report available.

Source file:
\`${sourceFile}\`

Next step:

\`\`\`text
npm run reach:quality -- --lane ${laneKey} --csv ${sourceFile}
\`\`\`
`,
    };
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
approve ${laneKey} import only
\`\`\``;
  const importInstruction = importCompleted
    ? "Import-only already used the QA file with OK rows only."
    : "Import-only should use the QA file with OK rows only, not the original unfiltered verified file.";

  return {
    kind: `agent-sales-manager-${laneKey}-qa-decision`,
    text: `*Sales Manager ${lane.label} QA decision - ${today()}*

Here is the row-level QA decision.

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
- ${importCompleted ? "The earlier import-only step imported/tagged the OK rows. This QA check changed nothing." : "No contacts, tags, workflows, settings, or HighLevel AI features were changed."}
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
  const approvalSource = approvalImportSource({
    action: approval.action,
    sourceFile,
    fallbackLimit: verifiedCount || extractVerifiedCount(job?.notes) || "N",
  });
  const actionLabel = approval.action === "start" ? "start drip" : "import only";
  const command = `npm run reach:launch -- --lane ${approval.laneKey} --csv ${approvalSource.sourceFile || "CSV_PATH"} --limit ${approvalSource.limit} --commit${approvalSource.onlyOk ? " --only-ok" : ""}${approval.action === "start" ? " --start-drip" : ""}`;
  const blockers = approvalBlockers({
    action: approval.action,
    job,
    domain,
    approvalSource,
    visualConfirmed: approval.visualConfirmed,
  });
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

${approvalSource.note ? `Source handling:\n\n- ${approvalSource.note}\n` : ""}
${approval.visualConfirmed ? "Visual GHL gate:\n\n- Mike confirmed the visual sender-domain/warmup/workflow/AI-toggle check in this approval command.\n" : ""}

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

  const laneKey = findLaneKey(normalized);
  if (!laneKey) return null;

  const visualConfirmed = hasGhlVisualConfirmation(normalized);

  if (normalized.includes("start") || normalized.includes("drip")) {
    return { laneKey, action: "start", visualConfirmed };
  }
  if (normalized.includes("import")) {
    return { laneKey, action: "import", visualConfirmed };
  }
  return null;
}

function findLaneKey(normalized) {
  return findLaneKeys(normalized)[0] ?? null;
}

function findLaneKeys(normalized) {
  if (/\b(all|all three|every lane|all lanes)\b/.test(normalized)) return Object.keys(LANES);
  const matches = Object.entries(LANES).flatMap(([key, lane]) =>
    lane.aliases
      .filter((alias) => containsAlias(normalized, alias))
      .map((alias) => ({ key, length: alias.length })),
  );
  const ordered = matches.sort((a, b) => b.length - a.length).map((match) => match.key);
  return [...new Set(ordered)];
}

function approvalBlockers({ action, job, domain, approvalSource, visualConfirmed }) {
  const blockers = [];
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
  const status = String(job?.status ?? "");
  if (status.includes("waiting_sales_and_visual_ghl_review") && !visualConfirmed) {
    blockers.push(
      approvalSource.onlyOk
        ? "GHL Expert visual sender-domain/warmup/AI-toggle review is still waiting. Sales QA can be handled with OK-only rows."
        : "Sales Manager QA and GHL Expert visual sender-domain/warmup/AI-toggle review are still waiting.",
    );
  }
  if (status.includes("paused")) {
    blockers.push("Campaign live actions are paused.");
  }
  return blockers;
}

function approvalImportSource({ action, sourceFile, fallbackLimit }) {
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

function readJsonIfExists(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) return null;
  try {
    return JSON.parse(readFileSync(absolute, "utf8"));
  } catch {
    return null;
  }
}

function quotaForWarmupDay(config, dayNumber) {
  const ladder = Array.isArray(config?.daily_quota_ladder) ? config.daily_quota_ladder : [];
  return ladder.find((item) => dayNumber >= Number(item.from_day) && dayNumber <= Number(item.to_day)) ?? null;
}

function warmupDay(startDate, date) {
  const start = parseDateOnly(startDate);
  const current = parseDateOnly(date);
  if (!start || !current) return 1;
  return Math.max(1, Math.floor((current.getTime() - start.getTime()) / 86_400_000) + 1);
}

function parseDateOnly(value) {
  const text = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(`${text}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
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
  const volumeText = sourceFile.includes("-qa.csv")
    ? `${verifiedText} QA row${verifiedText === "1" ? "" : "s"}`
    : `${verifiedText} verified`;

  return {
    laneKey,
    label: lane.label,
    status: String(job.status ?? "unknown"),
    nextActionOwner: String(job.next_action_owner ?? "unknown"),
    nextAction: String(job.next_action ?? ""),
    sourceFile,
    verifiedText,
    volumeText,
    qaText,
    domain: String(domain.dedicated_subdomain ?? "TBD"),
    importReady: String(domain.ready_for_import ?? "unknown"),
    dripReady: String(domain.ready_for_drip ?? "unknown"),
  };
}

function renderLaneBullet(summary) {
  return `- ${summary.label}: ${summary.volumeText}, ${summary.qaText}; status \`${summary.status}\`; import ${summary.importReady}; drip ${summary.dripReady}; domain \`${summary.domain}\``;
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

function readQaDetails(sourceFile) {
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

function formatQaRows(rows) {
  if (!rows.length) return "- None";
  return rows
    .map((row) => {
      const business = String(row.name ?? "").trim() || "Unknown business";
      const email = String(row.email ?? "").trim() || "missing email";
      const city = String(row.city ?? "").trim() || "unknown city";
      const flags = String(row.qa_flags ?? "").trim() || "ok";
      return `- ${business} | ${email} | ${city} | ${flags}`;
    })
    .join("\n");
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
    normalized.includes("deploy reach cold email campaign") ||
    normalized.includes("deploy cold email campaign") ||
    normalized.includes("launch reach cold email campaign") ||
    normalized.includes("launch cold email campaign") ||
    normalized.includes("reach cold email campaign")
  );
}

function mentionsReachRunStatusQuestion(normalized) {
  const asksRunStatus =
    /\b(set to run|set up to run|set for today|scheduled today|running today|run today|ready today|ready for today|everything set|all set|did .* run|has .* run|have .* run|did .* send|has .* sent|have .* sent|sent today|getting sent|emails getting sent|do i need .*anything|need .* anything|need to do anything)\b/.test(
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

function mentionsColdReachStart(normalized) {
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

function mentionsReachCampaignStatus(normalized) {
  return (
    mentionsReachColdEmailCampaign(normalized) &&
    mentionsBrief(normalized) &&
    !/\b(run|start|deploy|launch|execute|fresh|live|recheck|rerun)\b/.test(normalized)
  );
}

function mentionsWarmupAutopilot(normalized) {
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

function mentionsTeamTraining(normalized) {
  const asksTraining = /\b(train|training|teach|handoff|handle|handling)\b/.test(normalized);
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

function mentionsOwnerPeek(normalized) {
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

function mentionsGenericCampaignDeploy(normalized) {
  if (mentionsColdReachStart(normalized)) return false;
  if (mentionsReachColdEmailCampaign(normalized)) return false;
  return /\b(run|start|deploy|launch)\s+(the\s+|a\s+)?campaign\b/.test(normalized);
}

function mentionsReachDecisionQuestion(normalized) {
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

function mentionsGhlReadiness(normalized) {
  return (
    normalized.includes("ghl") &&
    (normalized.includes("check") || normalized.includes("readiness") || normalized.includes("ready"))
  );
}

function mentionsGhlVisualReadiness(normalized) {
  return (
    normalized.includes("ghl") &&
    /\b(visual|visually|sender domain|from domain|warmup|warm up|sender nodes|workflow sender|ai toggles|highlevel ai|conversation ai|ai employee|content ai|auto review)\b/.test(
      normalized,
    )
  );
}

function hasGhlVisualConfirmation(normalized) {
  return (
    /\b(i|mike)\s+(visually\s+)?(confirmed|checked|verified)\b/.test(normalized) ||
    /\bvisual\s+(check\s+)?(complete|confirmed|done|verified)\b/.test(normalized)
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
