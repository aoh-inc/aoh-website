#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const CONFIG_PATH = "docs/client-ops-ledger/reach-warmup-autopilot.json";
const DOMAIN_PATH = "docs/client-ops-ledger/sending-domain-readiness.csv";
const OUTBOX = "docs/client-ops-ledger/outbox";
const LANES = {
  reviews: {
    label: "Reviews",
    importedTag: "aoh_campaign_reviews_imported",
    startTag: "aoh_campaign_reviews_start",
  },
  ai: {
    label: "AI Visibility",
    importedTag: "aoh_campaign_ai_imported",
    startTag: "aoh_campaign_ai_visibility_start",
  },
  relay: {
    label: "Relay",
    importedTag: "aoh_campaign_relay_imported",
    startTag: "aoh_campaign_relay_start",
  },
};

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const config = readJson(String(args.config ?? CONFIG_PATH));
  if (config.enabled !== true) die("Reach warmup autopilot config is not enabled.");

  const date = String(args.date ?? today()).trim();
  const execute = String(args.execute ?? "none").toLowerCase();
  if (!["none", "import", "start", "auto"].includes(execute)) die("--execute must be none, import, start, or auto.");

  const selectedLanes = selectLanes(args, config);
  const domains = existsSync(resolve(DOMAIN_PATH)) ? readCsv(DOMAIN_PATH) : [];
  mkdirSync(OUTBOX, { recursive: true });

  const reports = [];
  for (const laneKey of selectedLanes) {
    reports.push(runLane({ laneKey, config, domains, args, date, execute }));
  }

  const summaryPath = resolve(OUTBOX, `reach-warmup-summary-${date}.md`);
  writeFileSync(summaryPath, renderSummary({ date, execute, reports }));
  console.log("");
  console.log(`Warmup summary: ${summaryPath}`);
  console.log("Done.");
}

function runLane({ laneKey, config, domains, args, date, execute }) {
  const lane = LANES[laneKey];
  const laneConfig = config.lanes?.[laneKey];
  if (!lane || !laneConfig?.enabled) die(`Lane is not enabled: ${laneKey}`);
  const laneExecute = resolveLaneExecute({ laneKey, domains, config, execute });

  const dayNumber = warmupDay(config.planned_start_date, date);
  const quota = quotaForDay(config, dayNumber);
  if (!quota) {
    const reason = config.after_day_9?.reason ?? "No quota configured for this warmup day.";
    return writeLaneReport({
      laneKey,
      lane,
      date,
      execute,
      dayNumber,
      quota: null,
      status: "held",
      selectedRows: [],
      attempts: [],
      blockers: [reason],
      actionResults: [],
    });
  }

  const target = numberArg(args.target, quota.target);
  const min = numberArg(args.min, quota.min);
  const max = numberArg(args.max, quota.max);
  if (target > max) die(`Requested target ${target} exceeds quota max ${max} for ${lane.label}.`);

  const guardrails = config.guardrails ?? {};
  const maxAttempts = numberArg(args["max-attempts"] ?? args.maxAttempts, guardrails.max_refill_attempts_per_lane ?? 5);
  const scrapeLimit = Math.min(
    numberArg(args["scrape-limit"] ?? args.scrapeLimit, Math.min(Math.max(target * 2, 20), 30)),
    guardrails.max_scrape_limit_per_attempt ?? 100,
  );
  const maxTotalScraped = guardrails.max_total_scraped_per_lane_per_day ?? 500;
  const provider = String(args.provider ?? "neverbounce");
  const skipVerify = Boolean(args["skip-verify"]);
  const pool = [];
  const attempts = [];
  const history = readLaneHistory(laneKey, lane);
  const seen = new Set([...history.imported, ...history.started]);
  let totalScraped = 0;

  for (let attempt = 1; attempt <= maxAttempts && pool.length < target; attempt++) {
    if (totalScraped >= maxTotalScraped) break;
    const search = laneConfig.searches[(attempt - 1) % laneConfig.searches.length];
    const remainingScrape = Math.max(1, Math.min(scrapeLimit, maxTotalScraped - totalScraped));
    const prefix = `tmp-reach-warmup-${laneKey}-${date}-a${attempt}`;
    const rawJson = `${prefix}.json`;
    const cleanCsv = `${prefix}-clean.csv`;
    const freshCsv = `${prefix}-fresh.csv`;
    const verifiedCsv = `${prefix}-verified.csv`;
    const verifyReport = `${prefix}-verified-report.json`;
    const qaCsv = `${prefix}-qa.csv`;

    const scrapeResult = runOptional("node", [
      "scripts/launch-reach-campaign.mjs",
      "--lane",
      laneKey,
      "--industry",
      search.industry,
      "--area",
      search.area,
      "--limit",
      String(remainingScrape),
      "--out",
      rawJson,
    ]);
    totalScraped += remainingScrape;
    if (!scrapeResult.ok) {
      attempts.push({
        attempt,
        industry: search.industry,
        area: search.area,
        state: search.state ?? "",
        scrapeLimit: remainingScrape,
        qaRows: 0,
        okRows: 0,
        added: 0,
        poolSize: pool.length,
        qaCsv: "",
        error: `scrape_failed_exit_${scrapeResult.status}`,
      });
      continue;
    }
    run("node", ["scripts/reach-json-to-csv.mjs", "--input", rawJson, "--out", cleanCsv]);
    const freshArgs = ["scripts/reach-filter-fresh-prospects.mjs", "--lane", laneKey, "--csv", cleanCsv, "--out", freshCsv];
    if (search.state) freshArgs.push("--state", search.state);
    run("node", freshArgs);

    if (skipVerify) {
      run("node", ["scripts/reach-quality-review.mjs", "--lane", laneKey, "--csv", freshCsv, "--out", qaCsv]);
    } else {
      run("node", [
        "scripts/verify-reach-emails.mjs",
        "--provider",
        provider,
        "--csv",
        freshCsv,
        "--out",
        verifiedCsv,
        "--report",
        verifyReport,
      ]);
      run("node", ["scripts/reach-quality-review.mjs", "--lane", laneKey, "--csv", verifiedCsv, "--out", qaCsv]);
    }

    const qaRows = readCsv(qaCsv);
    const okRows = qaRows.filter(isQaOk);
    let added = 0;
    for (const row of okRows) {
      const email = String(row.email ?? "").trim().toLowerCase();
      if (!email || seen.has(email)) continue;
      seen.add(email);
      pool.push(row);
      added++;
      if (pool.length >= target) break;
    }
    attempts.push({
      attempt,
      industry: search.industry,
      area: search.area,
      state: search.state ?? "",
      scrapeLimit: remainingScrape,
      qaRows: qaRows.length,
      okRows: okRows.length,
      added,
      poolSize: pool.length,
      qaCsv,
    });
  }

  const selectedRows = pool.slice(0, target);
  const blockers = [];
  if (selectedRows.length < min) blockers.push(`Only ${selectedRows.length} OK rows found; minimum is ${min}.`);
  if (laneExecute !== "none") blockers.push(...liveActionBlockers({ laneKey, lane, domains, selectedRows, min, max, execute: laneExecute, config, date, history }));

  const selectedCsv = `tmp-reach-warmup-${laneKey}-${date}-selected-qa.csv`;
  writeCsv(selectedCsv, selectedRows);

  const actionResults = [];
  if (laneExecute !== "none" && blockers.length === 0) {
    const outFile = `tmp-reach-warmup-${laneKey}-${date}-${laneExecute}.json`;
    const launchArgs = [
      "scripts/launch-reach-campaign.mjs",
      "--lane",
      laneKey,
      "--csv",
      selectedCsv,
      "--limit",
      String(selectedRows.length),
      "--commit",
      "--only-ok",
      "--out",
      outFile,
    ];
    if (laneExecute === "start") launchArgs.push("--start-drip");
    run("node", launchArgs);
    actionResults.push({ action: laneExecute, outFile, resultFile: outFile.replace(/\.json$/i, "-ghl-results.json") });
  }

  return writeLaneReport({
    laneKey,
    lane,
    date,
    execute: laneExecute,
    requestedExecute: execute,
    dayNumber,
    quota: { ...quota, target, min, max },
    status: blockers.length ? "blocked" : laneExecute === "none" ? "prepared" : "executed",
    selectedRows,
    selectedCsv,
    attempts,
    blockers,
    actionResults,
  });
}

function resolveLaneExecute({ laneKey, domains, config, execute }) {
  if (execute !== "auto") return execute;
  const domain = domains.find((row) => String(row.lane ?? "").toLowerCase() === laneKey) ?? {};
  const guardrails = config.guardrails ?? {};
  const importReady = String(domain.ready_for_import ?? "").toLowerCase() === "yes";
  const dripReady = String(domain.ready_for_drip ?? "").toLowerCase() === "yes";
  if (config.autopilot_start_enabled === true && guardrails.require_ready_for_drip_for_start && dripReady) return "start";
  if (config.autopilot_start_enabled === true && !guardrails.require_ready_for_drip_for_start) return "start";
  if (importReady) return "import";
  return "none";
}

function liveActionBlockers({ laneKey, lane, domains, selectedRows, min, max, execute, config, date, history }) {
  const guardrails = config.guardrails ?? {};
  const blockers = [];
  const domain = domains.find((row) => String(row.lane ?? "").toLowerCase() === laneKey) ?? {};
  if (selectedRows.length < min) blockers.push(`Selected rows below minimum ${min}.`);
  if (selectedRows.length > max) blockers.push(`Selected rows exceed max ${max}.`);
  if (selectedRows.length > (guardrails.max_daily_start_drip_per_lane ?? 100)) {
    blockers.push("Selected rows exceed max_daily_start_drip_per_lane.");
  }
  if (guardrails.require_ready_for_import && String(domain.ready_for_import ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_import is not yes.");
  }
  if (execute === "import" && guardrails.require_no_prior_import_today && hasImportToday(laneKey, date)) {
    blockers.push("An import-only warmup run already exists for this lane/date.");
  }
  if (execute === "start") {
    if (config.autopilot_start_enabled !== true) blockers.push("autopilot_start_enabled is not true.");
    if (guardrails.require_ready_for_drip_for_start && String(domain.ready_for_drip ?? "").toLowerCase() !== "yes") {
      blockers.push("Domain readiness says ready_for_drip is not yes.");
    }
    if (guardrails.require_no_prior_start_today && hasStartToday(laneKey, date)) {
      blockers.push("A start-drip warmup run already exists for this lane/date.");
    }
  }
  if (execute === "import" && selectedRows.some((row) => history.imported.has(String(row.email ?? "").trim().toLowerCase()))) {
    blockers.push("Selected CSV contains already imported contacts.");
  }
  if (execute === "start" && selectedRows.some((row) => history.started.has(String(row.email ?? "").trim().toLowerCase()))) {
    blockers.push(`Selected CSV contains contacts that already have ${lane.startTag}.`);
  }
  return blockers;
}

function hasImportToday(laneKey, date) {
  if (!existsSync(OUTBOX)) return false;
  return readdirSync(OUTBOX).some((file) => {
    if (file !== `reach-warmup-${laneKey}-${date}.json`) return false;
    try {
      const report = JSON.parse(readFileSync(resolve(OUTBOX, file), "utf8"));
      return report.execute === "import" && report.status === "executed";
    } catch {
      return false;
    }
  });
}

function writeLaneReport({ laneKey, lane, date, execute, dayNumber, quota, status, selectedRows, selectedCsv, attempts, blockers, actionResults }) {
  const jsonPath = resolve(OUTBOX, `reach-warmup-${laneKey}-${date}.json`);
  const mdPath = resolve(OUTBOX, `reach-warmup-${laneKey}-${date}.md`);
  const report = {
    date,
    lane: laneKey,
    label: lane.label,
    execute,
    warmupDay: dayNumber,
    quota,
    status,
    selectedCount: selectedRows.length,
    selectedCsv: selectedCsv ?? "",
    blockers,
    attempts,
    actionResults,
  };
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(mdPath, renderLaneMarkdown(report));
  console.log("");
  console.log(`${lane.label} report: ${mdPath}`);
  return { ...report, jsonPath, mdPath };
}

function renderLaneMarkdown(report) {
  const quotaText = report.quota
    ? `${report.quota.name}: min ${report.quota.min}, target ${report.quota.target}, max ${report.quota.max}`
    : "No active quota";
  return `# Reach Warmup Autopilot - ${report.label}

Date: ${report.date}
Lane: ${report.lane}
Status: ${report.status}
Requested action: ${report.execute}
Warmup day: ${report.warmupDay}
Quota: ${quotaText}
Selected OK rows: ${report.selectedCount}
Selected CSV: ${report.selectedCsv || "none"}

## Blockers

${report.blockers.length ? report.blockers.map((item) => `- ${item}`).join("\n") : "- None"}

## Refill Attempts

| Attempt | Search | Scrape limit | QA rows | OK rows | Added | Pool | Note |
|---:|---|---:|---:|---:|---:|---:|---|
${report.attempts.map((item) => `| ${item.attempt} | ${cell(`${item.industry}, ${item.area}`)} | ${item.scrapeLimit} | ${item.qaRows} | ${item.okRows} | ${item.added} | ${item.poolSize} | ${cell(item.error || "")} |`).join("\n") || "| none | | | | | | | |"}

## Live Action Results

${report.actionResults.length ? report.actionResults.map((item) => `- ${item.action}: ${item.resultFile}`).join("\n") : "- No live action executed."}
`;
}

function renderSummary({ date, execute, reports }) {
  return `# Reach Warmup Autopilot Summary

Date: ${date}
Requested action: ${execute}

| Lane | Status | Warmup day | Quota | Selected | Report |
|---|---|---:|---|---:|---|
${reports
  .map((report) => {
    const quota = report.quota ? `${report.quota.min}-${report.quota.max}` : "hold";
    return `| ${report.label} | ${report.status} | ${report.warmupDay} | ${quota} | ${report.selectedCount} | ${basename(report.mdPath)} |`;
  })
  .join("\n")}

## Guardrail Meaning

- The runner keeps refilling bad or risky emails until it reaches the daily quota or hits max attempts/scrape caps.
- It will not loop forever.
- It will not reuse contacts already imported or started in prior GHL result files.
- It will not start drip unless the lane is marked ready_for_drip=yes.
- HighLevel AI features must stay OFF.
`;
}

function selectLanes(args, config) {
  const laneArg = String(args.lane ?? "all").toLowerCase();
  const lanes = laneArg === "all" ? Object.keys(LANES) : [laneArg];
  for (const lane of lanes) {
    if (!LANES[lane]) die("Missing or invalid --lane. Use reviews, ai, relay, or all.");
    if (config.lanes?.[lane]?.enabled !== true) die(`Lane disabled in config: ${lane}`);
  }
  return lanes;
}

function quotaForDay(config, dayNumber) {
  return (config.daily_quota_ladder ?? []).find((item) => dayNumber >= item.from_day && dayNumber <= item.to_day) ?? null;
}

function warmupDay(startDate, date) {
  const start = parseDate(startDate);
  const current = parseDate(date);
  if (!start || !current) return 1;
  return Math.max(1, Math.floor((current.getTime() - start.getTime()) / 86_400_000) + 1);
}

function hasStartToday(laneKey, date) {
  const files = readdirSync(OUTBOX).filter((file) => file === `reach-warmup-${laneKey}-${date}.json`);
  for (const file of files) {
    try {
      const report = JSON.parse(readFileSync(resolve(OUTBOX, file), "utf8"));
      if (report.execute === "start" && report.status === "executed") return true;
    } catch {
      // Ignore corrupt outbox artifacts; result-file history still protects duplicates.
    }
  }
  return false;
}

function readLaneHistory(laneKey, lane) {
  const imported = new Set();
  const started = new Set();
  const files = readdirSync(".")
    .filter((file) => file.startsWith("tmp-reach-") && file.endsWith("-ghl-results.json"));
  for (const file of files) {
    let rows = [];
    try {
      rows = JSON.parse(readFileSync(resolve(file), "utf8"));
    } catch {
      continue;
    }
    for (const row of Array.isArray(rows) ? rows : []) {
      const email = String(row.email ?? "").trim().toLowerCase();
      if (!email || row.upsert !== true || row.tagged !== true) continue;
      const tags = Array.isArray(row.tags) ? row.tags : [];
      if (tags.includes(lane.importedTag)) imported.add(email);
      if (tags.includes(lane.startTag)) started.add(email);
    }
  }
  return { imported, started };
}

function isQaOk(row) {
  const recommendation = String(row.qa_recommendation ?? "").trim().toLowerCase();
  const flags = String(row.qa_flags ?? "").trim();
  if (recommendation) return recommendation === "ok";
  return !flags;
}

function run(command, args) {
  console.log("");
  console.log(`> ${[command, ...args].join(" ")}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function runOptional(command, args) {
  console.log("");
  console.log(`> ${[command, ...args].join(" ")}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  return { ok: result.status === 0, status: result.status ?? 1 };
}

function readJson(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) die(`JSON not found: ${absolute}`);
  return JSON.parse(readFileSync(absolute, "utf8"));
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
  const headers = rows[0] ? Object.keys(rows[0]) : ["name", "email", "qa_recommendation", "qa_flags"];
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

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
}

function parseDate(value) {
  const text = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(`${text}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
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

function numberArg(value, fallback) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
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
Run Reach warmup autopilot with bounded refill loops.

Default behavior prepares enough QA OK rows but does not touch GHL:
  npm run reach:warmup -- --lane all

Prepare one lane:
  npm run reach:warmup -- --lane relay

Import only after enough OK rows are found:
  npm run reach:warmup -- --lane relay --execute import

Start drip only when ready_for_drip=yes and guardrails pass:
  npm run reach:warmup -- --lane relay --execute start

Choose import vs start from the lane readiness ledger:
  npm run reach:warmup -- --lane all --execute auto

Options:
  --lane all|reviews|ai|relay
  --date YYYY-MM-DD
  --target 20
  --min 10
  --max 20
  --execute none|import|start|auto
  --max-attempts 5
  --scrape-limit 60
  --provider neverbounce|hunter
  --skip-verify
  --config docs/client-ops-ledger/reach-warmup-autopilot.json
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
