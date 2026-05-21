#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const LEDGER_DIR = "docs/client-ops-ledger";
const OUTBOX_DIR = `${LEDGER_DIR}/outbox`;
const CURRENT_PATH = `${LEDGER_DIR}/morning-brief-current.md`;
const SOURCES_PATH = `${LEDGER_DIR}/morning-brief-sources.json`;
const JOBS_PATH = `${LEDGER_DIR}/agent-jobs.csv`;
const DOMAINS_PATH = `${LEDGER_DIR}/sending-domain-readiness.csv`;
const DAILY_BRIEF_PATH = `${LEDGER_DIR}/daily-brief-current.md`;
const GHL_STATS_PATH = `${LEDGER_DIR}/ghl-email-stats-current.csv`;

const LANES = [
  { key: "reviews", label: "Reviews" },
  { key: "ai", label: "AI Visibility" },
  { key: "relay", label: "Relay" },
];

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

  const date = String(args.date ?? today());
  const fetchNews = Boolean(args["fetch-news"]);
  const config = readJsonIfExists(SOURCES_PATH) ?? {};
  const brief = await buildMorningBrief({ date, config, fetchNews });
  const text = renderMorningBrief(brief);

  mkdirSync(OUTBOX_DIR, { recursive: true });
  writeFileSync(resolve(CURRENT_PATH), `${text.trim()}\n`);

  const outPath = resolve(OUTBOX_DIR, `morning-brief-${date}.md`);
  writeFileSync(outPath, `${text.trim()}\n`);

  console.log(text);
  console.log("");
  console.log(`Morning brief current: ${resolve(CURRENT_PATH)}`);
  console.log(`Morning brief outbox: ${outPath}`);

  if (args.postSlack || args["post-slack"]) {
    await postSlack(text);
  }
}

async function buildMorningBrief({ date, config, fetchNews }) {
  const jobs = readCsv(JOBS_PATH);
  const domains = readCsv(DOMAINS_PATH);
  const dailyBrief = readText(DAILY_BRIEF_PATH);
  const managerCheck = readText(`${OUTBOX_DIR}/reach-manager-check-${date}.md`);
  const ghlStats = readCsv(GHL_STATS_PATH).filter((row) => !row.date || row.date === date);
  const lanes = LANES.map((lane) => buildLaneReadout({ lane, date, jobs, domains, ghlStats }));
  const news = fetchNews ? await fetchNewsItems(config) : [];
  const sourceStatus = sourceStatusLines(config);
  const needsMike = buildNeedsMike({ lanes, managerCheck, ghlStats });
  const recommendation = readRecommendation(dailyBrief, lanes);

  return {
    date,
    lanes,
    needsMike,
    recommendation,
    news,
    sourceStatus,
    managerCheck,
    hasGhlStats: ghlStats.length > 0,
  };
}

function buildLaneReadout({ lane, date, jobs, domains, ghlStats }) {
  const job = jobs.find((row) => same(row.campaign_lane, lane.key)) ?? {};
  const domain = domains.find((row) => same(row.lane, lane.key)) ?? {};
  const warmup = readJsonIfExists(`${OUTBOX_DIR}/reach-warmup-${lane.key}-${date}.json`);
  const actions = Array.isArray(warmup?.actionResults)
    ? warmup.actionResults.map((action) => ({
        action: action.action || "check",
        resultFile: action.resultFile || "",
        counts: countGhlResults(action.resultFile),
      }))
    : [];
  const performance = ghlStats.find((row) => same(row.lane, lane.key) || same(row.workflow, lane.label)) ?? null;
  const selectedCount = Number(warmup?.selectedCount ?? 0);
  const verified = warmup?.verification
    ? `${warmup.verification.keptCount ?? 0}/${warmup.verification.inputCount ?? 0} verified`
    : selectedCount
      ? `${selectedCount} selected`
      : "no run data";
  const actionSummary = actions.length
    ? actions.map(renderActionResult).join("; ")
    : job.status
      ? String(job.status)
      : "waiting";

  return {
    key: lane.key,
    label: lane.label,
    niche: job.target_niche || "",
    geography: job.target_geography || "",
    status: warmup?.status || job.status || "unknown",
    execute: warmup?.execute || job.approved_action || "",
    selectedCount,
    verified,
    actionSummary,
    readyForImport: domain.ready_for_import || "unknown",
    readyForDrip: domain.ready_for_drip || "unknown",
    domain: domain.dedicated_subdomain || "TBD",
    performance,
    blockers: Array.isArray(warmup?.blockers) ? warmup.blockers : [],
    proof: [
      warmup ? `${OUTBOX_DIR}/reach-warmup-${lane.key}-${date}.json` : "",
      ...actions.map((action) => action.resultFile),
    ].filter(Boolean),
  };
}

function renderActionResult(action) {
  const counts = action.counts;
  if (!counts) return `${action.action}: result pending`;
  const issueText = counts.errors ? `, ${counts.errors} error${counts.errors === 1 ? "" : "s"}` : ", no errors";
  return `${action.action}: ${counts.total} contacts${issueText}`;
}

function countGhlResults(path) {
  if (!path) return null;
  const absolute = resolve(path);
  if (!existsSync(absolute)) return null;
  const value = readJsonIfExists(path);
  if (!Array.isArray(value)) return null;
  return {
    total: value.length,
    errors: value.filter((item) => item?.error).length,
    tagged: value.filter((item) => item?.tagged).length,
    upserted: value.filter((item) => item?.upsert).length,
  };
}

function buildNeedsMike({ lanes, managerCheck, ghlStats }) {
  const needs = [];
  const errorLanes = lanes.filter((lane) => /error/.test(lane.actionSummary) && !/no errors/.test(lane.actionSummary));
  const dripBlocked = lanes.filter((lane) => lane.readyForDrip === "no");

  if (errorLanes.length) {
    needs.push(`Review GHL action errors for ${errorLanes.map((lane) => lane.label).join(", ")}.`);
  }

  if (dripBlocked.length) {
    needs.push(`No Mike action: GHL Expert needs to clear ${dripBlocked.map((lane) => lane.label).join(", ")} drip readiness before sending can start.`);
  }

  if (!ghlStats.length) {
    needs.push("No Mike action: Systems/GHL Expert still need to connect GHL Email Statistics export/API for opens, clicks, replies, bounces, and unsubscribes.");
  }

  if (!needs.length) {
    needs.push("No Mike action unless you want to change spend, target industry, or safety rules.");
  }

  const relayClean = managerCheck.match(/Relay clean contacts:\s*([^\n.]+)\./)?.[1];
  if (relayClean) {
    needs.push(`Relay clean contact check: ${relayClean}.`);
  }

  return needs;
}

function readRecommendation(dailyBrief, lanes) {
  const explicit = dailyBrief.match(/Current strongest lane by cleanliness:[^\n]+/)?.[0];
  if (explicit) return explicit;
  const waitingDrip = lanes.find((lane) => lane.readyForDrip === "no");
  if (waitingDrip) return `Keep auto on. Have GHL Expert clear ${waitingDrip.label} drip readiness before any start-drip action.`;
  return "Keep auto on. Let agents handle routine checks; bring Mike only decisions, spend changes, or safety exceptions.";
}

async function fetchNewsItems(config) {
  const sources = Array.isArray(config.newsSources) ? config.newsSources : [];
  const activeFeeds = sources.filter((source) => source.feedUrl && source.status !== "disabled");
  const results = [];
  for (const source of activeFeeds.slice(0, 8)) {
    try {
      const res = await fetch(source.feedUrl, { headers: { "User-Agent": "AOH-Morning-Brief/1.0" } });
      if (!res.ok) throw new Error(`${res.status}`);
      const xml = await res.text();
      results.push(...parseFeedItems(xml, source.name).slice(0, 3));
    } catch (error) {
      results.push({
        source: source.name,
        title: `Could not fetch source (${error instanceof Error ? error.message : "unknown error"})`,
        link: "",
      });
    }
  }
  return results.slice(0, 8);
}

function parseFeedItems(xml, sourceName) {
  const items = [];
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const entryBlocks = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]);
  for (const block of [...itemBlocks, ...entryBlocks]) {
    const title = decodeXml(firstMatch(block, /<title[^>]*>([\s\S]*?)<\/title>/i));
    const link = decodeXml(
      firstMatch(block, /<link[^>]*href=["']([^"']+)["'][^>]*>/i) ||
        firstMatch(block, /<link[^>]*>([\s\S]*?)<\/link>/i),
    );
    if (title) items.push({ source: sourceName, title, link });
  }
  return items;
}

function sourceStatusLines(config) {
  const newsSources = Array.isArray(config.newsSources) ? config.newsSources : [];
  const activeNews = newsSources.filter((source) => source.feedUrl && source.status !== "disabled").length;
  const waitingNews = newsSources.filter((source) => !source.feedUrl && source.status !== "disabled").length;
  const ghlStats = existsSync(resolve(GHL_STATS_PATH));
  return [
    `News feeds active: ${activeNews}; waiting for URLs: ${waitingNews}.`,
    `GHL email stats: ${ghlStats ? basename(GHL_STATS_PATH) : "not connected yet"}.`,
  ];
}

function renderMorningBrief(brief) {
  const mikeAction =
    brief.needsMike.find((item) => !item.startsWith("No Mike action") && !item.toLowerCase().includes("check:")) ??
    "No action from you.";
  return `# Morning Brief

Date: ${brief.date}
Prepared by: General Manager

## Owner Read

- Reach: ${brief.lanes.map(renderOwnerLane).join(" ")}
- Mike today: ${mikeAction}
- Safety: HighLevel AI stays OFF. GHL Expert owns sender/domain proof before start-drip.

## Campaign Results

| Lane | Current action | Clean/selected | GHL result | Drip ready |
|---|---|---|---|---|
${brief.lanes.map(renderLaneRow).join("\n")}

## Needs Mike Today

${brief.needsMike.map((item) => `- ${item}`).join("\n")}

## Market Signal

${renderNews(brief)}

## Agents Feeding This Brief

- GHL Expert: GHL campaign stats, workflow proof, exports, and readiness checks.
- Local Visibility Manager: Google Business Profile access/update status and local visibility findings.
- Sales Manager: what the campaign numbers mean and what to do next.
- Scout / Market Watcher: industry news, competitor signals, and offer ideas.
- Systems Director: cron reliability, source health, and cost risk.
- Manager: final owner summary.

## Recommended Move

${brief.recommendation}

## Source Status

${brief.sourceStatus.map((item) => `- ${item}`).join("\n")}

## Proof Used

${renderProof(brief)}
`;
}

function renderOwnerLane(lane) {
  const action = lane.execute ? lane.execute : lane.status;
  return `${lane.label} ${action} (${lane.actionSummary}).`;
}

function renderLaneRow(lane) {
  return `| ${lane.label} | ${lane.execute || lane.status} | ${lane.verified} | ${lane.actionSummary} | ${lane.readyForDrip} |`;
}

function renderNews(brief) {
  if (brief.news.length) {
    return brief.news.map((item) => `- ${item.source}: ${item.title}${item.link ? ` (${item.link})` : ""}`).join("\n");
  }
  return "- Waiting for Google Alerts/RSS feed URLs. Until then, Scout should bring one useful industry signal manually.";
}

function renderProof(brief) {
  const paths = [
    JOBS_PATH,
    DOMAINS_PATH,
    DAILY_BRIEF_PATH,
    ...brief.lanes.flatMap((lane) => lane.proof),
  ];
  return [...new Set(paths)].map((path) => `- ${path}`).join("\n");
}

function readCsv(path) {
  const raw = readText(path);
  return raw ? parseCsv(raw) : [];
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
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers, ...dataRows] = rows.filter((cells) => cells.some((cell) => String(cell).trim()));
  if (!headers) return [];
  return dataRows.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [String(header).trim(), String(cells[index] ?? "").trim()])),
  );
}

function readText(path) {
  const absolute = resolve(path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
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

function firstMatch(text, pattern) {
  return text.match(pattern)?.[1]?.trim() ?? "";
}

function decodeXml(value) {
  return String(value ?? "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function same(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

async function postSlack(text) {
  const webhook = process.env.SLACK_MISSION_CONTROL_WEBHOOK_URL?.trim() || process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhook) {
    console.log("Slack post skipped: webhook env var is not set.");
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

function today() {
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

function printHelp() {
  console.log(`
Generate Mike's Morning Brief from the local AOH ledger.

Examples:
  npm run morning:brief
  npm run morning:brief -- --date 2026-05-21
  npm run morning:brief -- --fetch-news
  npm run morning:brief -- --post-slack
`);
}
