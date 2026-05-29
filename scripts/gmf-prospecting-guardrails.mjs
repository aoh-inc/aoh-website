#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const CONFIG_PATH = "config/gmf-prospecting.config.json";

main().catch((error) => {
  console.error(error instanceof Error ? sanitize(error.message) : error);
  process.exitCode = 1;
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const config = readJson(String(args.config ?? CONFIG_PATH));
  const date = String(args.date ?? todayEastern());
  const outbox = String(config.reporting?.outbox ?? "docs/client-ops-ledger/outbox");
  mkdirSync(outbox, { recursive: true });
  const metricsCsv = String(args.metrics ?? latestPath(`${outbox.replaceAll("\\", "/")}/gmf-prospecting-metrics-template-*.csv`));
  const rows = readCsv(metricsCsv);
  const summary = summarizeMetrics(rows, config);
  const paths = writeOutputs({ date, outbox, config, summary });
  const report = renderReport({ date, config, metricsCsv, summary, paths });
  writeText(config.reporting?.currentGuardrailReport ?? "docs/client-ops-ledger/gmf-prospecting-guardrails-current.md", report);
  const datedReport = resolve(outbox, `gmf-prospecting-guardrails-${date}.md`);
  writeText(datedReport, report);

  console.log(JSON.stringify(
    {
      ok: summary.status !== "HOLD",
      status: summary.status,
      metricsCsv: resolve(metricsCsv),
      rows: rows.length,
      pauseRecommendations: summary.pauseRecommendations.length,
      currentReport: resolve(config.reporting?.currentGuardrailReport ?? "docs/client-ops-ledger/gmf-prospecting-guardrails-current.md"),
      datedReport,
      outputs: paths,
    },
    null,
    2,
  ));

  if (args["fail-on-hold"] && summary.status === "HOLD") process.exitCode = 1;
}

function summarizeMetrics(rows, config) {
  const thresholds = config.smartlead?.autoPauseThresholds ?? {};
  const bySubdomain = groupRows(rows, "subdomain");
  const byNiche = groupRows(rows, "category");
  const bySegment = groupRows(rows, "segment");
  const subdomainFindings = Object.entries(bySubdomain).map(([key, group]) => evaluateGroup(key || "unassigned", group, thresholds));
  const nicheFindings = Object.entries(byNiche).map(([key, group]) => evaluateGroup(key || "unassigned", group, thresholds));
  const segmentFindings = Object.entries(bySegment).map(([key, group]) => evaluateGroup(key || "unassigned", group, thresholds));
  const pauseRecommendations = subdomainFindings.filter((finding) => finding.status === "HOLD");
  const watchRecommendations = [...subdomainFindings, ...nicheFindings, ...segmentFindings].filter((finding) => finding.status === "WATCH");

  return {
    status: pauseRecommendations.length ? "HOLD" : watchRecommendations.length ? "WATCH" : "PASS",
    totals: sumRows(rows),
    subdomainFindings,
    nicheFindings,
    segmentFindings,
    pauseRecommendations,
    watchRecommendations,
  };
}

function evaluateGroup(name, rows, thresholds) {
  const totals = sumRows(rows);
  const sends = totals.sends;
  const bounceRate = rate(totals.bounces, sends);
  const complaintRate = rate(totals.spam_complaints, sends);
  const optOutRate = rate(totals.opt_outs, sends);
  const replyQualityRate = rate(totals.replies + totals.form_fills + totals.purchases, sends);
  const reasons = [];
  const warnings = [];

  if (sends > 0 && bounceRate > number(thresholds.maxBounceRate ?? 0.03)) reasons.push(`bounce_rate_${pct(bounceRate)}_above_${pct(thresholds.maxBounceRate ?? 0.03)}`);
  if (sends > 0 && complaintRate > number(thresholds.maxSpamComplaintRate ?? 0.001)) reasons.push(`complaint_rate_${pct(complaintRate)}_above_${pct(thresholds.maxSpamComplaintRate ?? 0.001)}`);
  if (sends > 0 && optOutRate > number(thresholds.maxOptOutRate ?? 0.04)) reasons.push(`optout_rate_${pct(optOutRate)}_above_${pct(thresholds.maxOptOutRate ?? 0.04)}`);
  if (sends >= 50 && replyQualityRate < number(thresholds.minReplyQualityRate ?? 0.005)) warnings.push(`reply_quality_${pct(replyQualityRate)}_below_${pct(thresholds.minReplyQualityRate ?? 0.005)}`);

  return {
    name,
    status: reasons.length ? "HOLD" : warnings.length ? "WATCH" : "PASS",
    reasons,
    warnings,
    totals,
    rates: {
      bounceRate,
      complaintRate,
      optOutRate,
      replyQualityRate,
    },
  };
}

function writeOutputs({ date, outbox, summary }) {
  const pauseCsv = resolve(outbox, `gmf-prospecting-pause-recommendations-${date}.csv`);
  const summaryJson = resolve(outbox, `gmf-prospecting-guardrails-${date}.json`);
  writeCsv(pauseCsv, summary.pauseRecommendations.map((finding) => ({
    subdomain: finding.name,
    status: finding.status,
    sends: finding.totals.sends,
    bounces: finding.totals.bounces,
    spam_complaints: finding.totals.spam_complaints,
    opt_outs: finding.totals.opt_outs,
    bounce_rate: pct(finding.rates.bounceRate),
    complaint_rate: pct(finding.rates.complaintRate),
    opt_out_rate: pct(finding.rates.optOutRate),
    reasons: finding.reasons.join(";"),
    action: "pause subdomain in SmartLead before next send window and route to Sender/Auditor",
  })));
  writeText(summaryJson, `${JSON.stringify(summary, null, 2)}\n`);
  return { pauseCsv, summaryJson };
}

function renderReport({ date, config, metricsCsv, summary, paths }) {
  return `# GMF Prospecting Guardrails

Date: ${date}
Mode: read-only metrics review
Status: ${summary.status}

## Inputs

- Metrics CSV: \`${resolve(metricsCsv)}\`
- Bounce pause threshold: ${pct(config.smartlead?.autoPauseThresholds?.maxBounceRate ?? 0.03)}
- Spam complaint pause threshold: ${pct(config.smartlead?.autoPauseThresholds?.maxSpamComplaintRate ?? 0.001)}
- Opt-out pause threshold: ${pct(config.smartlead?.autoPauseThresholds?.maxOptOutRate ?? 0.04)}

## Totals

| Metric | Count |
|---|---:|
| Sends | ${summary.totals.sends} |
| Clicks | ${summary.totals.clicks} |
| Replies | ${summary.totals.replies} |
| Form fills | ${summary.totals.form_fills} |
| Purchases | ${summary.totals.purchases} |
| Bounces | ${summary.totals.bounces} |
| Spam complaints | ${summary.totals.spam_complaints} |
| Opt-outs | ${summary.totals.opt_outs} |

## Subdomain Findings

${renderFindings(summary.subdomainFindings)}

## Niche Findings

${renderFindings(summary.nicheFindings)}

## Segment Findings

${renderFindings(summary.segmentFindings)}

## Auto-Pause Recommendations

${summary.pauseRecommendations.length ? summary.pauseRecommendations.map((finding) => `- ${finding.name}: ${finding.reasons.join("; ")}`).join("\n") : "- None"}

## Outputs

- Pause CSV: \`${paths.pauseCsv}\`
- Summary JSON: \`${paths.summaryJson}\`

## Operating Rule

If any subdomain is HOLD, Sender pauses that subdomain before the next send window, Auditor reviews the cause, and Manager does not ask Mike unless the fix requires spend, legal/reputation judgment, account access, or final live-send approval.
`;
}

function renderFindings(findings) {
  if (!findings.length) return "- None";
  const lines = [
    "| Name | Status | Sends | Bounce | Complaint | Opt-out | Reply quality | Reason |",
    "|---|---|---:|---:|---:|---:|---:|---|",
  ];
  for (const finding of findings) {
    lines.push(
      `| ${cell(finding.name)} | ${finding.status} | ${finding.totals.sends} | ${pct(finding.rates.bounceRate)} | ${pct(finding.rates.complaintRate)} | ${pct(finding.rates.optOutRate)} | ${pct(finding.rates.replyQualityRate)} | ${cell([...finding.reasons, ...finding.warnings].join("; ") || "none")} |`,
    );
  }
  return lines.join("\n");
}

function groupRows(rows, key) {
  return rows.reduce((acc, row) => {
    const value = String(row[key] ?? "").trim() || "unassigned";
    if (!acc[value]) acc[value] = [];
    acc[value].push(row);
    return acc;
  }, {});
}

function sumRows(rows) {
  const fields = ["sends", "clicks", "replies", "form_fills", "purchases", "bounces", "spam_complaints", "opt_outs"];
  return Object.fromEntries(fields.map((field) => [field, rows.reduce((sum, row) => sum + number(row[field]), 0)]));
}

function latestPath(pattern) {
  const normalized = pattern.replaceAll("\\", "/");
  const slash = normalized.lastIndexOf("/");
  const dir = slash >= 0 ? normalized.slice(0, slash) : ".";
  const filePattern = slash >= 0 ? normalized.slice(slash + 1) : normalized;
  const regex = new RegExp(`^${filePattern.split("*").map((part) => part.replace(/[.+^${}()|[\]\\]/g, "\\$&")).join(".*")}$`);
  const absoluteDir = resolve(dir);
  if (!existsSync(absoluteDir)) throw new Error(`No directory for latest file lookup: ${absoluteDir}`);
  const matches = readdirSync(absoluteDir)
    .filter((name) => regex.test(name))
    .map((name) => resolve(absoluteDir, name))
    .sort();
  const latest = matches.at(-1);
  if (!latest) throw new Error(`No file matched ${pattern}`);
  return latest;
}

function readJson(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) throw new Error(`JSON not found: ${absolute}`);
  return JSON.parse(readFileSync(absolute, "utf8"));
}

function readCsv(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) throw new Error(`CSV not found: ${absolute}`);
  return parseCsv(readFileSync(absolute, "utf8")).filter((row) => Object.values(row).some((value) => String(value).trim()));
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < raw.length; index++) {
    const char = raw[index];
    const next = raw[index + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      index++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift()?.map((item) => item.trim()) ?? [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function writeCsv(path, rows) {
  mkdirSync(dirname(resolve(path)), { recursive: true });
  if (!rows.length) {
    writeFileSync(path, "");
    return;
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  writeFileSync(path, `${lines.join("\n")}\n`);
}

function writeText(path, text) {
  mkdirSync(dirname(resolve(path)), { recursive: true });
  writeFileSync(path, text);
}

function csvEscape(value) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "/").replace(/\r?\n/g, " ");
}

function rate(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : 0;
}

function pct(value) {
  return `${(number(value) * 100).toFixed(2)}%`;
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index++;
    }
  }
  return args;
}

function todayEastern() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function sanitize(value) {
  return String(value).replace(/apikey=[^&\s]+/gi, "apikey=REDACTED").replace(/authorization=[^&\s]+/gi, "authorization=REDACTED");
}

function printHelp() {
  console.log(`
Review GMF prospecting metrics and recommend subdomain pauses.

Dry run from latest metrics template:
  npm run gmf:guardrails

Use explicit metrics CSV:
  npm run gmf:guardrails -- --metrics docs/client-ops-ledger/outbox/gmf-prospecting-metrics-template-2026-05-29.csv

Fail CI/operator run if a pause is required:
  npm run gmf:guardrails -- --fail-on-hold
`);
}
