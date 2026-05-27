#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { delimiter, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const EXPECTED = {
  githubOrigin: "https://github.com/mje-gmf/website.git",
  branch: "main",
  vercel: {
    userId: "F1j3I59aUYZmc1Gcbc6pJfEU",
    username: "mike-egidio",
    email: "mike@aioutsourcehub.com",
    teamId: "team_3K7fCmjAF4RxcNGqxfDgoY53",
    teamSlug: "aoh-inc",
    teamName: "AI Outsource Hub",
    projectId: "prj_NyxkjegahECBSR2MYZ4wTGVG0tMb",
    projectName: "getmefound",
    productionDomain: "getmefound.ai",
    legacyProjectName: "aoh-website",
    legacyDomain: "aioutsourcehub.com",
  },
  vps: {
    alias: "atlantis",
    docsPath: "/root/gmf-docs",
    legacyDocsPath: "/root/aoh-docs",
    requiredDocs: [
      "SYSTEMS_DIRECTOR_BACKUP_SECURITY_RUNBOOK.md",
      "BACKUP_READINESS_CHECKLIST.md",
      "LAPTOP_DEATH_RECOVERY.md",
      "getmefound/GETMEFOUND_STACK_STATUS.md",
      "getmefound/GMF_REBRAND_AUDIT.md",
    ],
  },
};

const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");
const softFail = args.has("--soft-fail");
const deep = args.has("--deep");
const checks = [];

function addCheck(area, status, finding, proof = "", next = "") {
  checks.push({ area, status, finding, proof, next });
}

function run(command, commandArgs = [], options = {}) {
  let executable = resolveExecutable(command);
  let args = commandArgs;

  if (process.platform === "win32" && command === "vercel") {
    const vcScript = resolveVercelCliScript(executable);
    if (vcScript) {
      executable = process.execPath;
      args = [vcScript, ...commandArgs];
    }
  }

  if (process.platform === "win32" && command === "npm") {
    const npmScript = resolveNpmCliScript(executable);
    if (npmScript) {
      executable = process.execPath;
      args = [npmScript, ...commandArgs];
    }
  }

  const result = spawnSync(executable, args, {
    encoding: "utf8",
    timeout: options.timeoutMs ?? 15000,
    shell: false,
  });

  return {
    ok: !result.error && result.status === 0,
    status: result.status,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
    error: result.error,
  };
}

function resolveVercelCliScript(executable) {
  const baseDir = dirname(executable);
  const script = join(baseDir, "node_modules", "vercel", "dist", "vc.js");
  return existsSync(script) ? script : null;
}

function resolveNpmCliScript(executable) {
  const baseDir = dirname(executable);
  const script = join(baseDir, "node_modules", "npm", "bin", "npm-cli.js");
  return existsSync(script) ? script : null;
}

function resolveExecutable(command) {
  if (command.includes("/") || command.includes("\\")) return command;
  if (process.platform !== "win32") return command;

  const pathEntries = (process.env.PATH ?? "").split(delimiter).filter(Boolean);
  const extensions = (process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD;.PS1")
    .split(";")
    .map((item) => item.toLowerCase());
  const candidates = [];

  for (const entry of pathEntries) {
    for (const ext of extensions) {
      candidates.push(join(entry, `${command}${ext}`));
    }
    candidates.push(join(entry, command));
  }

  return candidates.find((candidate) => existsSync(candidate)) ?? command;
}

function firstLine(value) {
  return String(value ?? "").split(/\r?\n/).find(Boolean) ?? "";
}

function compact(value, max = 180) {
  const clean = String(value ?? "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 3)}...` : clean;
}

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function checkGit() {
  const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  const origin = run("git", ["remote", "get-url", "origin"]);
  const status = run("git", ["status", "--short", "--branch"]);
  const remotes = run("git", ["remote", "-v"]);

  if (!branch.ok || !origin.ok || !status.ok) {
    addCheck(
      "GitHub",
      "FAIL",
      "Could not read local Git status.",
      compact(branch.stderr || origin.stderr || status.stderr || branch.error?.message),
      "Codex should verify the repo is intact before editing or deploying."
    );
    return;
  }

  const branchOk = branch.stdout === EXPECTED.branch;
  const originOk = origin.stdout === EXPECTED.githubOrigin;
  const clean = status.stdout.split(/\r?\n/).length === 1;

  if (branchOk && originOk && clean) {
    addCheck(
      "GitHub",
      "PASS",
      "Local repo is on main, points at the GMF GitHub repo, and has no local-only changes.",
      status.stdout
    );
  } else {
    const problems = [];
    if (!branchOk) problems.push(`branch is ${branch.stdout || "unknown"}`);
    if (!originOk) problems.push(`origin is ${origin.stdout || "unknown"}`);
    if (!clean) problems.push("local working tree has uncommitted changes");
    addCheck(
      "GitHub",
      "WARN",
      `Repo needs attention: ${problems.join("; ")}.`,
      status.stdout,
      "Codex should separate intentional work from scratch files, then commit/push finished changes."
    );
  }

  if (!remotes.stdout.includes("aoh-archive")) {
    addCheck(
      "GitHub archive",
      "WARN",
      "The old archive remote is not visible.",
      "Expected remote name: aoh-archive",
      "Only restore the archive remote if Mike still wants AOH history reachable from this checkout."
    );
  } else {
    addCheck(
      "GitHub archive",
      "PASS",
      "Old AOH repo is still present as an archive remote.",
      "Remote: aoh-archive"
    );
  }
}

function checkLocalVercelLink() {
  const link = readJson(".vercel/project.json");

  if (!link) {
    addCheck(
      "Vercel link",
      "SKIP",
      "No local .vercel/project.json was available in this runtime.",
      ".vercel is intentionally ignored by Git.",
      "Run this check from the linked local workspace when verifying deploy ownership."
    );
    return;
  }

  const projectOk = link.projectId === EXPECTED.vercel.projectId;
  const orgOk = link.orgId === EXPECTED.vercel.teamId;
  const nameOk = link.projectName === EXPECTED.vercel.projectName;

  if (projectOk && orgOk && nameOk) {
    addCheck(
      "Vercel link",
      "PASS",
      "Local project is linked to the active GetMeFound Vercel project.",
      `project=${link.projectName}; projectId=${link.projectId}; orgId=${link.orgId}`
    );
  } else {
    addCheck(
      "Vercel link",
      "FAIL",
      "Local Vercel link does not match the protected GetMeFound project/team.",
      `project=${link.projectName}; projectId=${link.projectId}; orgId=${link.orgId}`,
      "Do not deploy. Codex should relink only after Mike confirms the intended Vercel scope."
    );
  }
}

async function getVercelJson(path) {
  if (process.env.VERCEL_TOKEN) {
    const response = await fetch(`https://api.vercel.com${path}`, {
      headers: { authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
    });
    const body = await response.text();
    if (!response.ok) {
      return { ok: false, error: `${response.status} ${compact(body)}` };
    }
    try {
      return { ok: true, json: JSON.parse(body), source: "Vercel API token" };
    } catch {
      return { ok: false, error: "Vercel API response was not JSON." };
    }
  }

  const cli = run("vercel", ["api", path], { timeoutMs: 30000 });
  if (!cli.ok) {
    return {
      ok: false,
      error: compact(cli.stderr || cli.error?.message || "Vercel CLI unavailable or not logged in."),
    };
  }

  try {
    return { ok: true, json: JSON.parse(cli.stdout), source: "Vercel CLI session" };
  } catch {
    return { ok: false, error: "Vercel CLI response was not JSON." };
  }
}

async function checkVercelIdentity() {
  const userResult = await getVercelJson("/v2/user");
  if (!userResult.ok) {
    addCheck(
      "Vercel owner",
      "WARN",
      "Could not verify Vercel owner identity from this runtime.",
      userResult.error,
      "Use the local CLI session or add VERCEL_TOKEN to the scheduled check. Do not delete Vercel accounts without ID proof."
    );
    return;
  }

  const user = userResult.json.user ?? userResult.json;
  const idOk = user.id === EXPECTED.vercel.userId;
  const usernameOk = user.username === EXPECTED.vercel.username;

  if (idOk && usernameOk) {
    addCheck(
      "Vercel owner",
      "PASS",
      "Active Vercel identity matches the protected owner account.",
      `user=${user.username}; email=${user.email}; id=${user.id}; source=${userResult.source}`
    );
  } else {
    addCheck(
      "Vercel owner",
      "FAIL",
      "Vercel identity does not match the protected owner account.",
      `user=${user.username}; email=${user.email}; id=${user.id}`,
      "Stop Vercel changes until Mike confirms the intended account."
    );
  }

  const teamsResult = await getVercelJson("/v2/teams");
  if (!teamsResult.ok) {
    addCheck(
      "Vercel team",
      "WARN",
      "Could not verify Vercel team membership.",
      teamsResult.error,
      "Verify team ownership before any delete, transfer, or billing change."
    );
    return;
  }

  const teams = teamsResult.json.teams ?? [];
  const team = teams.find((item) => item.id === EXPECTED.vercel.teamId);
  if (!team) {
    addCheck(
      "Vercel team",
      "FAIL",
      "Protected Vercel team was not visible to the active account.",
      `expected=${EXPECTED.vercel.teamId}`,
      "Stop Vercel changes and escalate to Mike/Vercel support."
    );
    return;
  }

  const role = team.membership?.role ?? "unknown";
  if (team.slug === EXPECTED.vercel.teamSlug && role.toUpperCase() === "OWNER") {
    addCheck(
      "Vercel team",
      "PASS",
      "Active account is owner of the protected Vercel team.",
      `team=${team.slug}; name=${team.name}; role=${role}; id=${team.id}`
    );
  } else {
    addCheck(
      "Vercel team",
      "WARN",
      "Vercel team is visible but owner/slug proof is not ideal.",
      `team=${team.slug}; name=${team.name}; role=${role}; id=${team.id}`,
      "Verify dashboard access before making admin changes."
    );
  }
}

function checkVercelCliResources() {
  const project = run("vercel", ["project", "inspect", EXPECTED.vercel.projectName], { timeoutMs: 30000 });
  const projectText = `${project.stdout}\n${project.stderr}`.trim();
  if (!project.ok) {
    addCheck(
      "Vercel project",
      "WARN",
      "Could not inspect the GetMeFound Vercel project by CLI.",
      compact(project.stderr || project.error?.message),
      "Use dashboard/API proof before making project changes."
    );
  } else if (projectText.includes(`ID\t\t\t\t${EXPECTED.vercel.projectId}`) || projectText.includes(EXPECTED.vercel.projectId)) {
    addCheck(
      "Vercel project",
      "PASS",
      "GetMeFound Vercel project is visible from this authenticated runtime.",
      `project=${EXPECTED.vercel.projectName}; id=${EXPECTED.vercel.projectId}`
    );
  } else {
    addCheck(
      "Vercel project",
      "WARN",
      "Vercel project inspect ran, but expected project ID was not found in the output.",
      firstLine(projectText),
      "Manually verify project identity before deploy/admin changes."
    );
  }

  const domains = run("vercel", ["domains", "ls"], { timeoutMs: 30000 });
  const domainsText = `${domains.stdout}\n${domains.stderr}`.trim();
  if (!domains.ok) {
    addCheck(
      "Vercel domains",
      "WARN",
      "Could not list Vercel domains from this runtime.",
      compact(domains.stderr || domains.error?.message),
      "Verify domain ownership before transfer/delete work."
    );
    return;
  }

  const hasProduction = domainsText.includes(EXPECTED.vercel.productionDomain);
  const hasLegacy = domainsText.includes(EXPECTED.vercel.legacyDomain);
  if (hasProduction && hasLegacy) {
    addCheck(
      "Vercel domains",
      "WARN",
      "Production and legacy domains are both still present in the Vercel team.",
      `${EXPECTED.vercel.productionDomain}=present; ${EXPECTED.vercel.legacyDomain}=present`,
      "No emergency. Remove or redirect the legacy domain only after Mike approves."
    );
  } else if (hasProduction) {
    addCheck(
      "Vercel domains",
      "PASS",
      "Production GMF domain is present and legacy AOH domain is not listed.",
      `${EXPECTED.vercel.productionDomain}=present`
    );
  } else {
    addCheck(
      "Vercel domains",
      "FAIL",
      "Production GMF domain was not found in Vercel domain list.",
      compact(domainsText),
      "Stop domain changes and verify Vercel scope immediately."
    );
  }
}

function checkVpsDocs() {
  const remoteCommand = [
    "hostname",
    "date -u +%Y-%m-%dT%H:%M:%SZ",
    `if [ -d ${EXPECTED.vps.docsPath} ]; then echo GMF_DOCS_PRESENT; find ${EXPECTED.vps.docsPath} -maxdepth 3 -type f | sort | head -80; else echo GMF_DOCS_MISSING; fi`,
    `if [ -d ${EXPECTED.vps.legacyDocsPath} ]; then echo LEGACY_DOCS_PRESENT; else echo LEGACY_DOCS_MISSING; fi`,
  ].join("; ");

  const result = run(
    "ssh",
    ["-o", "BatchMode=yes", "-o", "ConnectTimeout=10", EXPECTED.vps.alias, remoteCommand],
    { timeoutMs: 30000 }
  );

  if (!result.ok) {
    addCheck(
      "VPS/OpenClaw",
      "WARN",
      "Could not verify VPS docs copy from this runtime.",
      compact(result.stderr || result.error?.message),
      "Systems Director should verify SSH/provider access before client volume grows."
    );
    return;
  }

  if (result.stdout.includes("GMF_DOCS_PRESENT")) {
    const allFiles = result.stdout
      .split(/\r?\n/)
      .filter((line) => line.startsWith(EXPECTED.vps.docsPath))
      .map((line) => line.replace(`${EXPECTED.vps.docsPath}/`, ""));
    const missingDocs = EXPECTED.vps.requiredDocs.filter((path) => !allFiles.includes(path));
    const proof = allFiles.slice(0, 10).map((path) => `${EXPECTED.vps.docsPath}/${path}`).join("<br>") || EXPECTED.vps.docsPath;

    if (missingDocs.length) {
      addCheck(
        "VPS/OpenClaw",
        "WARN",
        "VPS is reachable, but the GMF docs copy is missing current recovery files.",
        `missing=${missingDocs.join(", ")}`,
        "Codex should sync current recovery docs to /root/gmf-docs after Mike approves server writes."
      );
    } else {
      addCheck(
        "VPS/OpenClaw",
        "PASS",
        "VPS is reachable and the required GMF docs copy exists.",
        proof
      );
    }
  } else {
    addCheck(
      "VPS/OpenClaw",
      "FAIL",
      "VPS is reachable but the GMF docs copy is missing.",
      EXPECTED.vps.docsPath,
      "Codex should sync the current recovery docs to the VPS after Mike approves server writes."
    );
  }

  if (result.stdout.includes("LEGACY_DOCS_MISSING")) {
    addCheck(
      "VPS docs path",
      "PASS",
      "Legacy `/root/aoh-docs` path is no longer treated as the active docs path.",
      `active=${EXPECTED.vps.docsPath}`
    );
  } else {
    addCheck(
      "VPS docs path",
      "WARN",
      "Legacy `/root/aoh-docs` still exists alongside `/root/gmf-docs`.",
      `legacy=${EXPECTED.vps.legacyDocsPath}`,
      "Prefer `/root/gmf-docs` in new docs and routines."
    );
  }
}

function checkRunbooks() {
  const required = [
    "docs/SYSTEMS_DIRECTOR_BACKUP_SECURITY_RUNBOOK.md",
    "docs/BACKUP_READINESS_CHECKLIST.md",
    "docs/LAPTOP_DEATH_RECOVERY.md",
    "docs/GETMEFOUND_STACK_STATUS.md",
  ];

  const missing = required.filter((path) => !existsSync(path));
  if (missing.length) {
    addCheck(
      "Runbooks",
      "FAIL",
      "Required recovery docs are missing.",
      missing.join(", "),
      "Codex should restore missing runbooks from Git history or regenerate them."
    );
    return;
  }

  const backupDoc = readFileSync("docs/BACKUP_READINESS_CHECKLIST.md", "utf8");
  const laptopDoc = readFileSync("docs/LAPTOP_DEATH_RECOVERY.md", "utf8");
  const stillOldRepo = backupDoc.includes("aoh-inc/aoh-website") || laptopDoc.includes("aoh-inc/aoh-website");
  const stillOldDocs = backupDoc.includes("/root/aoh-docs") || laptopDoc.includes("/root/aoh-docs");

  if (!stillOldRepo && !stillOldDocs) {
    addCheck(
      "Runbooks",
      "PASS",
      "Recovery docs are present and point at the current GMF repo/docs path.",
      required.join("<br>")
    );
  } else {
    addCheck(
      "Runbooks",
      "WARN",
      "Recovery docs still contain legacy AOH repo or docs-path references.",
      `oldRepo=${stillOldRepo}; oldDocsPath=${stillOldDocs}`,
      "Codex should update stale recovery references."
    );
  }
}

function checkSecuritySweep() {
  if (!deep) {
    addCheck(
      "Security sweep",
      "SKIP",
      "Deep security sweep was not requested.",
      "Run `npm run systems:readiness -- --deep` for a deeper local check."
    );
    return;
  }

  const result = run("npm", ["run", "audit:security"], { timeoutMs: 60000 });
  if (result.ok) {
    addCheck(
      "Security sweep",
      "PASS",
      "Auditor security sweep passed.",
      compact(result.stdout, 220)
    );
  } else {
    addCheck(
      "Security sweep",
      "WARN",
      "Auditor security sweep returned issues or could not run.",
      compact(result.stdout || result.stderr || result.error?.message, 220),
      "Auditor should review before production-sensitive deploys."
    );
  }
}

function checkManualControls() {
  addCheck(
    "Supabase backups",
    "WARN",
    "Supabase backup/PITR status cannot be proven from this repo alone.",
    "Owner approval needed before enabling paid PITR.",
    "Systems Director should confirm plan/backups in Supabase before onboarding high client volume."
  );

  addCheck(
    "VPS backups",
    "WARN",
    "Hostinger VPS backup/snapshot status cannot be proven from this repo alone.",
    "Provider dashboard proof required.",
    "Systems Director should confirm daily VPS backups and define an encrypted offsite OpenClaw backup."
  );

  addCheck(
    "Password manager",
    "WARN",
    "Password-manager recovery coverage cannot be proven by agents.",
    "Mike-only verification.",
    "Mike should confirm GitHub, Vercel, Supabase, Hostinger, DNS, Google, Stripe, Slack, Resend, and Smartlead recovery entries exist."
  );
}

function markdownCell(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, "<br>")
    .trim();
}

function statusCounts() {
  return checks.reduce(
    (acc, check) => {
      acc[check.status] = (acc[check.status] ?? 0) + 1;
      return acc;
    },
    { PASS: 0, WARN: 0, FAIL: 0, SKIP: 0 }
  );
}

function renderReport() {
  const now = new Date();
  const counts = statusCounts();
  const blockers = checks.filter((check) => check.status === "FAIL");
  const warnings = checks.filter((check) => check.status === "WARN");
  const approvalItems = [
    "Vercel account/team/project/domain deletion, merge, or transfer",
    "Legacy AOH domain removal or redirect",
    "Paid Supabase PITR or backup-plan changes",
    "Paid VPS backup/snapshot changes",
    "Production token rotation",
    "Database or VPS restore/overwrite",
  ];

  const lines = [
    "# Systems Director Readiness Check",
    "",
    `Generated: ${now.toISOString()}`,
    "Owner agent: Systems Director",
    "Reviewer: Auditor",
    "Human approver: Mike",
    "",
    "## Summary",
    "",
    `- Pass: ${counts.PASS}`,
    `- Warn: ${counts.WARN}`,
    `- Fail: ${counts.FAIL}`,
    `- Skipped: ${counts.SKIP}`,
    "",
    "## Checks",
    "",
    "| Area | Status | Finding | Proof | Next action |",
    "|---|---|---|---|---|",
    ...checks.map(
      (check) =>
        `| ${markdownCell(check.area)} | ${markdownCell(check.status)} | ${markdownCell(check.finding)} | ${markdownCell(check.proof)} | ${markdownCell(check.next)} |`
    ),
    "",
    "## Mike Approval Required",
    "",
    ...approvalItems.map((item) => `- ${item}`),
    "",
    "## Agent-Owned Next Actions",
    "",
    "- Systems Director runs this check weekly and summarizes only status/proof, not secrets.",
    "- Auditor reviews warnings before client volume grows or before production-sensitive changes.",
    "- Codex updates scripts, docs, and non-destructive workflows when checks identify drift.",
    "- No agent deletes accounts, projects, domains, databases, or VPS state without Mike's explicit approval.",
  ];

  if (blockers.length) {
    lines.splice(
      14,
      0,
      "",
      "## Immediate Blockers",
      "",
      ...blockers.map((check) => `- ${check.area}: ${check.finding}`)
    );
  } else if (warnings.length) {
    lines.splice(
      14,
      0,
      "",
      "## Watch Items",
      "",
      ...warnings.slice(0, 8).map((check) => `- ${check.area}: ${check.finding}`)
    );
  }

  return `${lines.join("\n")}\n`;
}

function writeReport(report) {
  const date = new Date().toISOString().replace(/[:.]/g, "-");
  const currentPath = "docs/client-ops-ledger/systems-director-readiness-current.md";
  const outboxPath = `docs/client-ops-ledger/outbox/systems-director-readiness-${date}.md`;

  mkdirSync(dirname(currentPath), { recursive: true });
  mkdirSync(dirname(outboxPath), { recursive: true });
  writeFileSync(currentPath, report);
  writeFileSync(outboxPath, report);

  console.log(`Wrote ${currentPath}`);
  console.log(`Wrote ${outboxPath}`);
}

async function main() {
  checkGit();
  checkRunbooks();
  checkLocalVercelLink();
  await checkVercelIdentity();
  checkVercelCliResources();
  checkVpsDocs();
  checkManualControls();
  checkSecuritySweep();

  const report = renderReport();
  writeReport(report);

  const counts = statusCounts();
  console.log(`Systems Director readiness: ${counts.PASS} pass, ${counts.WARN} warn, ${counts.FAIL} fail, ${counts.SKIP} skipped.`);

  if (strict && !softFail && counts.FAIL > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  if (!softFail) process.exit(1);
});
