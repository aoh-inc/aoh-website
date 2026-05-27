#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const API_BASE = "https://server.smartlead.ai/api/v1";
const CURRENT_CSV = "docs/client-ops-ledger/smartlead-warmup-current.csv";
const CURRENT_REPORT = "docs/client-ops-ledger/prospecting-smartlead-preflight-current.md";
const OUTBOX = "docs/client-ops-ledger/outbox";
const MIN_WARMUP_SENT = 10;
const MIN_REPUTATION = 95;
const MAX_SPAM = 0;

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const date = todayEastern();
  mkdirSync(OUTBOX, { recursive: true });

  const apiKey = process.env.SMARTLEAD_API_KEY?.trim();
  const apiCheck = await checkApi(apiKey);
  const warmupRows = readCsv(CURRENT_CSV);
  const warmupCheck = checkWarmupRows(warmupRows, date);
  const ready = apiCheck.ok && warmupCheck.ready;
  const humanNeeded = !apiCheck.ok;

  const report = renderReport({
    date,
    ready,
    humanNeeded,
    apiCheck,
    warmupCheck,
  });

  const datedReport = resolve(OUTBOX, `prospecting-smartlead-preflight-${date}.md`);
  writeFileSync(CURRENT_REPORT, report);
  writeFileSync(datedReport, report);

  console.log(ready ? "READY for tiny Smartlead seed test." : "NOT READY for Smartlead live prospect sends.");
  console.log(`Current report: ${resolve(CURRENT_REPORT)}`);
  console.log(`Dated report: ${datedReport}`);
  if (humanNeeded) {
    console.log("Human needed: refresh Smartlead API access before agents proceed with live Smartlead work.");
  }

  process.exitCode = ready ? 0 : 1;
}

async function checkApi(apiKey) {
  if (!apiKey) {
    return {
      ok: false,
      status: "FAIL",
      detail: "SMARTLEAD_API_KEY is not set locally.",
    };
  }

  const result = await smartleadGet("/email-accounts/", apiKey).catch((error) => ({
    error: error.message,
  }));

  if (result?.error) {
    return {
      ok: false,
      status: "FAIL",
      detail: sanitizeError(result.error),
    };
  }

  return {
    ok: true,
    status: "PASS",
    detail: "Smartlead API accepted the configured key.",
  };
}

async function smartleadGet(path, apiKey) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, { headers: { accept: "application/json" } });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const detail = typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(`${path}: ${response.status} ${detail}`);
  }
  return body;
}

function checkWarmupRows(rows, today) {
  if (!rows.length) {
    return {
      ready: false,
      status: "FAIL",
      detail: "No saved Smartlead warmup snapshot exists.",
      rows: [],
    };
  }

  const latestDate = rows.map((row) => row.date).filter(Boolean).sort().at(-1) ?? "";
  const stale = latestDate !== today;
  const findings = rows.map(checkWarmupRow);
  const rowsReady = findings.every((finding) => finding.ready);

  return {
    ready: rowsReady && !stale,
    status: rowsReady && !stale ? "PASS" : stale ? "WARN" : "FAIL",
    detail: stale
      ? `Warmup snapshot is from ${latestDate || "unknown date"}, not ${today}.`
      : "Warmup snapshot is current.",
    rows: findings,
  };
}

function checkWarmupRow(row) {
  const blockers = [];
  if (row.smtp_ok !== "yes") blockers.push("SMTP is not OK");
  if (row.imap_ok !== "yes") blockers.push("IMAP is not OK");
  if (row.suspended === "yes") blockers.push("account is suspended");
  if (row.warmup_status !== "ACTIVE") blockers.push(`warmup status is ${row.warmup_status || "unknown"}`);
  if (row.warmup_blocked === "yes") blockers.push("warmup is blocked");
  if (number(row.warmup_reputation) < MIN_REPUTATION) blockers.push(`warmup reputation below ${MIN_REPUTATION}`);
  if (number(row.warmup_sent_count) < MIN_WARMUP_SENT) blockers.push(`needs at least ${MIN_WARMUP_SENT} warmup sent`);
  if (number(row.warmup_spam_count) > MAX_SPAM) blockers.push("spam count is above zero");

  return {
    email: row.email,
    ready: blockers.length === 0,
    blockers,
    sent: number(row.warmup_sent_count),
    spam: number(row.warmup_spam_count),
    reputation: number(row.warmup_reputation),
  };
}

function renderReport({ date, ready, humanNeeded, apiCheck, warmupCheck }) {
  const lines = [];
  lines.push("# Prospecting Smartlead Preflight");
  lines.push("");
  lines.push(`Date: ${date}`);
  lines.push("Mode: read-only");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(ready ? "READY for a tiny Smartlead seed test." : "NOT READY for Smartlead live prospect sends.");
  lines.push(humanNeeded ? "Human needed: yes" : "Human needed: no");
  lines.push("");
  lines.push("## Checks");
  lines.push("");
  lines.push(`| Check | Status | Detail |`);
  lines.push(`|---|---|---|`);
  lines.push(`| Smartlead API access | ${apiCheck.status} | ${cell(apiCheck.detail)} |`);
  lines.push(`| Warmup snapshot | ${warmupCheck.status} | ${cell(warmupCheck.detail)} |`);
  lines.push("");
  lines.push("## Mailboxes");
  lines.push("");
  lines.push("| Email | Status | Warmup Sent | Spam | Reputation | Blockers |");
  lines.push("|---|---|---:|---:|---:|---|");
  for (const row of warmupCheck.rows) {
    lines.push(
      `| ${cell(row.email)} | ${row.ready ? "ready" : "hold"} | ${row.sent} | ${row.spam} | ${row.reputation} | ${cell(row.blockers.join("; ") || "none")} |`,
    );
  }
  if (!warmupCheck.rows.length) {
    lines.push("| none | hold | 0 | 0 | 0 | no saved warmup rows |");
  }
  lines.push("");
  lines.push("## Manager Contact Rule");
  lines.push("");
  lines.push("Manager should contact Mike only if human involvement is required. This preflight allows contact when API access is missing or rejected, because agents cannot clear that safely themselves.");
  lines.push("");
  lines.push("## Next Action");
  lines.push("");
  lines.push(
    apiCheck.ok
      ? "Run a fresh warmup report, then re-run this preflight before building or uploading a seed list."
      : "Refresh Smartlead API access, store the key locally and in production, then re-run this preflight.",
  );
  return lines.join("\n");
}

function readCsv(path) {
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf8").trim();
  if (!raw) return [];
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];
    if (quoted && char === '"' && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
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

function sanitizeError(value) {
  return String(value)
    .replace(/api_key=[^&\s]+/gi, "api_key=REDACTED")
    .replace(/SMARTLEAD_API_KEY=[^&\s]+/gi, "SMARTLEAD_API_KEY=REDACTED");
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "/");
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function todayEastern() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
