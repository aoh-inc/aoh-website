#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const LANES = {
  reviews: {
    label: "Reviews",
    campaignTag: "aoh_campaign_reviews",
    importedTag: "aoh_campaign_reviews_imported",
    startTag: "aoh_campaign_reviews_start",
    defaultCsv: "tmp-reach-reviews-verified.csv",
    defaultReport: "tmp-reach-reviews-verify-report.json",
  },
  ai: {
    label: "AI Visibility",
    campaignTag: "aoh_campaign_ai_visibility",
    importedTag: "aoh_campaign_ai_imported",
    startTag: "aoh_campaign_ai_visibility_start",
    defaultCsv: "tmp-reach-ai-verified.csv",
    defaultReport: "tmp-reach-ai-verify-report.json",
  },
  relay: {
    label: "Relay",
    campaignTag: "aoh_campaign_relay",
    importedTag: "aoh_campaign_relay_imported",
    startTag: "aoh_campaign_relay_start",
    defaultCsv: "tmp-reach-relay-verified.csv",
    defaultReport: "tmp-reach-relay-verify-report.json",
  },
};

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const lanes = args.all ? Object.keys(LANES) : [String(args.lane ?? "").toLowerCase()];
  if (!lanes.length || lanes.some((lane) => !LANES[lane])) {
    die("Missing or invalid --lane. Use reviews, ai, relay, or --all.");
  }

  const outDir = String(args.outDir ?? args["out-dir"] ?? "docs/client-ops-ledger/outbox");
  mkdirSync(outDir, { recursive: true });

  const outputs = [];
  for (const laneKey of lanes) {
    outputs.push(buildPacket({ laneKey, args, outDir }));
  }

  console.log("");
  console.log("Generated approval packet(s):");
  for (const output of outputs) console.log(`- ${output}`);
  console.log("");
  console.log("No GHL API calls were made. This is preflight only.");
}

function buildPacket({ laneKey, args, outDir }) {
  const lane = LANES[laneKey];
  const csvPath = String(args.csv ?? lane.defaultCsv);
  const reportPath = String(args.report ?? lane.defaultReport);
  const domainPath = String(args.domains ?? "docs/client-ops-ledger/sending-domain-readiness.csv");
  const action = String(args.action ?? "review").toLowerCase();
  const budgetCap = String(args.budget ?? "2");

  const rows = readCsv(csvPath);
  const report = existsSync(resolve(reportPath)) ? JSON.parse(readFileSync(resolve(reportPath), "utf8")) : [];
  const domains = existsSync(resolve(domainPath)) ? readCsv(domainPath) : [];
  const domain = domains.find((row) => String(row.lane ?? "").toLowerCase() === laneKey) ?? {};
  const history = readLaneHistory(laneKey, lane);
  const csvEmails = new Set(rows.map((row) => String(row.email ?? "").trim().toLowerCase()).filter(Boolean));
  const alreadyImported = [...csvEmails].filter((email) => history.imported.has(email));
  const alreadyStarted = [...csvEmails].filter((email) => history.started.has(email));
  const verifySummary = summarizeVerification(report);
  const sampleRows = rows.slice(0, 5);
  const safeAction = ["review", "import", "start"].includes(action) ? action : "review";
  const requestedAction =
    safeAction === "start" ? "start drip" : safeAction === "import" ? "import only" : "review only";

  const warnings = [];
  if (!rows.length) warnings.push("No verified rows found in CSV.");
  if (!existsSync(resolve(reportPath))) warnings.push(`Verification report not found: ${reportPath}`);
  if (!domain.dedicated_subdomain || domain.dedicated_subdomain === "TBD") {
    warnings.push("Dedicated sending subdomain is not filled in.");
  }
  if (alreadyImported.length) {
    warnings.push(`${alreadyImported.length} contacts in this CSV already appear in prior import result files.`);
  }
  if (alreadyStarted.length) {
    warnings.push(`${alreadyStarted.length} contacts in this CSV already appear in prior start-drip result files. Use a fresh CSV for another warmup batch.`);
  }
  if (safeAction === "start" && String(domain.ready_for_drip ?? "").toLowerCase() !== "yes") {
    warnings.push("Start-drip requested, but ready_for_drip is not yes.");
  }
  if (safeAction !== "review" && String(domain.ready_for_import ?? "").toLowerCase() !== "yes") {
    warnings.push("Import/start requested, but ready_for_import is not yes.");
  }

  const packet = `# Reach Campaign Approval Packet

Date: ${today()}
Prepared by: Manager
Lane: ${lane.label} (${laneKey})
Requested action: ${requestedAction}

## Summary

| Item | Value |
|---|---|
| Verified CSV | \`${csvPath}\` |
| Verification report | \`${reportPath}\` |
| Verified contacts | ${rows.length} |
| Budget cap | $${budgetCap} |
| Model tier | cheap/no-LLM unless escalated |
| Dedicated subdomain | ${domain.dedicated_subdomain || "TBD"} |
| Warmup status | ${domain.warmup_status || "unknown"} |
| Allowed daily send volume | ${domain.allowed_daily_send_volume || "TBD"} |
| Ready for import | ${domain.ready_for_import || "unknown"} |
| Ready for drip | ${domain.ready_for_drip || "unknown"} |
| Prior imported overlap | ${alreadyImported.length} |
| Prior started overlap | ${alreadyStarted.length} |

## Tags

| Action | Tags |
|---|---|
| Import only | \`${lane.campaignTag}\` + \`${lane.importedTag}\` |
| Start drip | \`${lane.campaignTag}\` + \`${lane.startTag}\` |

## Verification Summary

| Decision / status | Count |
|---|---:|
${verifySummary.map((item) => `| ${item.name} | ${item.count} |`).join("\n") || "| No report loaded | 0 |"}

## Sample Prospects

| Business | Email | City | State | Niche |
|---|---|---|---|---|
${sampleRows.map((row) => `| ${cell(row.name)} | ${cell(row.email)} | ${cell(row.city)} | ${cell(row.state)} | ${cell(row.niche)} |`).join("\n") || "| none | | | | |"}

## Preflight Warnings

${warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- None"}

## Prior Run Overlap

Already imported from this CSV:

${alreadyImported.length ? alreadyImported.map((email) => `- ${email}`).join("\n") : "- None"}

Already started from this CSV:

${alreadyStarted.length ? alreadyStarted.map((email) => `- ${email}`).join("\n") : "- None"}

## Required Human Approval

Importing contacts into GHL requires Mike approval.

Starting the drip requires separate Mike approval.

HighLevel AI features must remain OFF unless Mike explicitly authorizes them manually.

## Exact Commands After Approval

Import only:

\`\`\`bash
npm run reach:launch -- --lane ${laneKey} --csv ${csvPath} --limit ${rows.length} --commit
\`\`\`

Start drip:

\`\`\`bash
npm run reach:launch -- --lane ${laneKey} --csv ${csvPath} --limit ${rows.length} --commit --start-drip
\`\`\`

## Recommendation

${recommendation({ safeAction, rows, domain, warnings, alreadyStarted })}
`;

  const outPath = resolve(outDir, `reach-${laneKey}-approval-${today()}.md`);
  writeFileSync(outPath, packet);
  return outPath;
}

function recommendation({ safeAction, rows, domain, warnings, alreadyStarted }) {
  if (!rows.length) return "Do not approve. There are no verified contacts.";
  if (alreadyStarted.length) {
    return "Do not approve live action for this CSV. These contacts already appear in prior start-drip results. Build a fresh verified CSV for the next warmup batch.";
  }
  if (warnings.length) {
    return "Prep is usable, but do not approve live action until the warnings are resolved.";
  }
  if (safeAction === "start" && String(domain.ready_for_drip).toLowerCase() === "yes") {
    return "Eligible for Mike to approve a small start-drip batch.";
  }
  if (safeAction === "import") {
    return "Eligible for Mike to approve import-only.";
  }
  return "Ready for review. Choose import-only or start-drip after GHL Expert confirms domain and workflow readiness.";
}

function summarizeVerification(report) {
  const counts = new Map();
  for (const row of Array.isArray(report) ? report : []) {
    const key = `${row.decision ?? "unknown"}, ${row.status ?? "unknown"}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count }));
}

function readLaneHistory(laneKey, lane) {
  const imported = new Set();
  const started = new Set();
  const files = [
    `tmp-reach-${laneKey}-live-import-ghl-results.json`,
    `tmp-reach-${laneKey}-verified-import-ghl-results.json`,
    `tmp-reach-${laneKey}-started-ghl-results.json`,
    `tmp-reach-${laneKey}-retry-started-ghl-results.json`,
  ];

  for (const file of files) {
    const absolute = resolve(file);
    if (!existsSync(absolute)) continue;
    let rows = [];
    try {
      rows = JSON.parse(readFileSync(absolute, "utf8"));
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

function readCsv(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) return [];
  const raw = readFileSync(absolute, "utf8");
  const rows = parseCsv(raw);
  return rows;
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

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
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
Generate Reach campaign approval packets without touching GHL.

Examples:
  npm run reach:preflight -- --all
  npm run reach:preflight -- --lane reviews
  npm run reach:preflight -- --lane relay --action import
  npm run reach:preflight -- --lane ai --action start

Options:
  --all
  --lane reviews|ai|relay
  --csv path/to/verified.csv
  --report path/to/verify-report.json
  --domains docs/client-ops-ledger/sending-domain-readiness.csv
  --action review|import|start
  --budget 2
  --out-dir docs/client-ops-ledger/outbox
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
