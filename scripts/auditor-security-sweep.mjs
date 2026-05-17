import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([
  ".git",
  ".next",
  ".vercel",
  "node_modules",
  "out",
  "public",
]);
const ignoredFiles = new Set(["package-lock.json"]);
const textExtensions = new Set([
  ".css",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ps1",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

const checks = [
  {
    name: "hardcoded secret assignment",
    severity: "high",
    pattern: /\b(?:const|let|var)\s+[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|API_KEY|PRIVATE_KEY)[A-Z0-9_]*\s*=\s*["'`][^"'`\n]{12,}["'`]/g,
  },
  {
    name: "secret-looking URL parameter",
    severity: "high",
    pattern: /[?&#](?:token|api_key|apikey|secret|password|auth)=([A-Za-z0-9._~+/=-]{12,})/gi,
  },
  {
    name: "public env var with secret-like name",
    severity: "high",
    pattern: /\bNEXT_PUBLIC_[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|API_KEY|PRIVATE_KEY)[A-Z0-9_]*\b/g,
  },
  {
    name: "private key block",
    severity: "critical",
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  },
  {
    name: "github token",
    severity: "critical",
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{36,255}\b/g,
  },
  {
    name: "stripe secret key",
    severity: "critical",
    pattern: /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/g,
  },
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const relPath = path.relative(root, fullPath);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignoredDirs.has(entry)) walk(fullPath, files);
      continue;
    }

    if (ignoredFiles.has(entry)) continue;
    if (!textExtensions.has(path.extname(entry))) continue;
    files.push(relPath);
  }

  return files;
}

function lineNumber(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function excerpt(match) {
  return match.replace(/(["'`=])[^"'`\s]{8,}(["'`]?)/g, "$1[redacted]$2");
}

if (!existsSync(root)) {
  console.error("Unable to find repo root.");
  process.exit(1);
}

const findings = [];

for (const file of walk(root)) {
  const fullPath = path.join(root, file);
  const source = readFileSync(fullPath, "utf8");

  for (const check of checks) {
    check.pattern.lastIndex = 0;
    for (const match of source.matchAll(check.pattern)) {
      findings.push({
        file,
        line: lineNumber(source, match.index ?? 0),
        severity: check.severity,
        name: check.name,
        excerpt: excerpt(match[0]),
      });
    }
  }
}

if (findings.length > 0) {
  console.error("Auditor security sweep failed.");
  for (const finding of findings) {
    console.error(
      `- [${finding.severity}] ${finding.name}: ${finding.file}:${finding.line} ${finding.excerpt}`,
    );
  }
  process.exit(1);
}

console.log("Auditor security sweep passed. No obvious secret exposure patterns found.");
