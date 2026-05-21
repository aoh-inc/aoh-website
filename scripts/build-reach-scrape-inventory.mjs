#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const LEDGER_DIR = "docs/client-ops-ledger";
const OUTBOX = "docs/client-ops-ledger/outbox";
const LANES = ["reviews", "ai", "relay"];

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  mkdirSync(LEDGER_DIR, { recursive: true });
  mkdirSync(OUTBOX, { recursive: true });

  const lanes = String(args.lane ?? "all").toLowerCase() === "all" ? LANES : [String(args.lane).toLowerCase()];
  const summaries = [];
  for (const lane of lanes) {
    if (!LANES.includes(lane)) die("Missing or invalid --lane. Use reviews, ai, relay, or all.");
    summaries.push(buildLaneInventory(lane));
  }

  const summaryPath = resolve(OUTBOX, `reach-scrape-inventory-${today()}.md`);
  writeFileSync(summaryPath, renderSummary(summaries));
  console.log(`Inventory summary: ${summaryPath}`);
}

function buildLaneInventory(lane) {
  const files = inventoryCandidateFiles(lane);
  const rows = dedupeByEmail(files.flatMap((file) => readCsv(file).map((row) => ({ ...row, inventory_source_file: file }))));
  const okRows = rows.filter(isQaOk);
  const reviewRows = rows.filter((row) => !isQaOk(row));
  const allPath = resolve(LEDGER_DIR, `reach-scrape-inventory-${lane}.csv`);
  const okPath = resolve(LEDGER_DIR, `reach-scrape-inventory-${lane}-ok.csv`);

  writeCsv(allPath, rows);
  writeCsv(okPath, okRows);
  console.log(`${lane}: ${rows.length} inventory rows, ${okRows.length} OK, ${reviewRows.length} review`);
  return {
    lane,
    files,
    allPath,
    okPath,
    rows: rows.length,
    okRows: okRows.length,
    reviewRows: reviewRows.length,
  };
}

function inventoryCandidateFiles(lane) {
  return readdirSync(".")
    .filter((file) => {
      const isQa = file.endsWith("-qa.csv") && !file.includes("selected-qa");
      const isLane = file.startsWith(`tmp-reach-warmup-${lane}-`) || file.startsWith(`tmp-reach-${lane}-`);
      return isQa && isLane;
    })
    .sort();
}

function dedupeByEmail(rows) {
  const byEmail = new Map();
  for (const row of rows) {
    const email = String(row.email ?? "").trim().toLowerCase();
    if (!email) continue;
    const next = { ...row, email };
    const current = byEmail.get(email);
    if (!current || (isQaOk(next) && !isQaOk(current))) byEmail.set(email, next);
  }
  return [...byEmail.values()];
}

function isQaOk(row) {
  const recommendation = String(row.qa_recommendation ?? "").trim().toLowerCase();
  const flags = String(row.qa_flags ?? "").trim();
  if (recommendation) return recommendation === "ok";
  return !flags;
}

function renderSummary(summaries) {
  return `# Reach Paid Scrape Inventory

Date: ${today()}

This inventory reuses rows that were already scraped, verified, and QA reviewed.
It lets the warmup runner consume paid-for data before making new Outscraper calls.

| Lane | Source QA files | Inventory rows | OK rows | Review rows | OK CSV |
|---|---:|---:|---:|---:|---|
${summaries
  .map((item) => `| ${item.lane} | ${item.files.length} | ${item.rows} | ${item.okRows} | ${item.reviewRows} | ${basename(item.okPath)} |`)
  .join("\n")}

## Safety

- OK rows can be reused automatically for import-only warmup.
- Review rows are preserved, but not auto-used.
- New Outscraper calls can run automatically inside the configured caps.
`;
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
  const headers = rows[0] ? Object.keys(rows[0]) : ["name", "email", "qa_flags", "qa_recommendation", "inventory_source_file"];
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
Build Reach inventory CSVs from already-paid scrape QA files.

Examples:
  node scripts/build-reach-scrape-inventory.mjs
  node scripts/build-reach-scrape-inventory.mjs --lane relay

Options:
  --lane all|reviews|ai|relay
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
