#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUTBOX_DIR = "docs/client-ops-ledger/outbox";
const REQUIRED_ENV = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];
const OPTIONAL_ENV = ["AOH_INTERNAL_API_TOKEN", "REPORT_TEST_BYPASS_TOKEN", "AOH_REVIEW_AUTOMATION_WEBHOOK_URL"];

main();

function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const outDir = OUTBOX_DIR;
  mkdirSync(outDir, { recursive: true });

  const local = checkLocalEnv();
  const vercel = checkVercelEnv();
  const report = renderReport({ local, vercel });
  const outPath = resolve(outDir, `review-storage-check-${today()}.md`);
  writeFileSync(outPath, report);

  console.log(`Review storage check report: ${outPath}`);
  console.log(ownerSummary({ local, vercel }));
  process.exit(local.ready && vercel.ready ? 0 : 1);
}

function checkLocalEnv() {
  const required = REQUIRED_ENV.map((name) => ({ name, present: Boolean(process.env[name]?.trim()) }));
  const optional = OPTIONAL_ENV.map((name) => ({ name, present: Boolean(process.env[name]?.trim()) }));
  return {
    ready: required.every((item) => item.present),
    required,
    optional,
  };
}

function checkVercelEnv() {
  const result = spawnSync("vercel", ["env", "ls"], { encoding: "utf8", shell: true });
  if (result.status !== 0) {
    return {
      ready: false,
      available: false,
      error: trim(`${result.stdout || ""}\n${result.stderr || ""}`) || "vercel env ls failed",
      required: REQUIRED_ENV.map((name) => ({ name, present: false })),
      optional: OPTIONAL_ENV.map((name) => ({ name, present: false })),
    };
  }

  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  const required = REQUIRED_ENV.map((name) => ({ name, present: output.includes(name) }));
  const optional = OPTIONAL_ENV.map((name) => ({ name, present: output.includes(name) }));
  return {
    ready: required.every((item) => item.present),
    available: true,
    required,
    optional,
  };
}

function renderReport({ local, vercel }) {
  return `# Review Automation Storage Check

Date: ${today()}
Mode: no secret values printed

## Owner Summary

${ownerSummary({ local, vercel })}

## Local Env

| Env var | Required | Present |
|---|---:|---:|
${[
  ...local.required.map((item) => ({ ...item, required: "yes" })),
  ...local.optional.map((item) => ({ ...item, required: "no" })),
]
  .map((item) => `| ${item.name} | ${item.required} | ${item.present ? "yes" : "no"} |`)
  .join("\n")}

## Vercel Env

${vercel.available === false ? `- Vercel env check failed: ${cell(vercel.error)}` : "- Vercel env list was readable."}

| Env var | Required | Present in Vercel list |
|---|---:|---:|
${[
  ...vercel.required.map((item) => ({ ...item, required: "yes" })),
  ...vercel.optional.map((item) => ({ ...item, required: "no" })),
]
  .map((item) => `| ${item.name} | ${item.required} | ${item.present ? "yes" : "no"} |`)
  .join("\n")}

## What This Means

- Review pages and APIs can exist without Redis.
- Persistent customer upload history, private feedback history, suppression, bounce auto-hold, send logs, and follow-up due checks need Redis.
- Add the two required Upstash env vars to Vercel Production before calling this live-ready.
- Do not print or commit the values.
`;
}

function ownerSummary({ local, vercel }) {
  if (local.ready && vercel.ready) return "Pass: Review Automation storage env is present locally and in Vercel.";
  const missingLocal = local.required.filter((item) => !item.present).map((item) => item.name);
  const missingVercel = vercel.required.filter((item) => !item.present).map((item) => item.name);
  const parts = [];
  if (missingLocal.length) parts.push(`local missing ${missingLocal.join(", ")}`);
  if (missingVercel.length) parts.push(`Vercel missing ${missingVercel.join(", ")}`);
  return `Blocked: ${parts.join("; ")}.`;
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

function trim(value) {
  return String(value ?? "").trim().slice(0, 1000);
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
