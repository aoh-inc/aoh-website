import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const LEDGER_DIR = "docs/client-ops-ledger";
const OUTBOX_DIR = `${LEDGER_DIR}/outbox`;
const CURRENT_BRIEF_PATH = `${LEDGER_DIR}/morning-brief-current.md`;
const GHL_STATS_PATH = `${LEDGER_DIR}/ghl-email-stats-current.csv`;

export type BriefArchiveItem = {
  date: string;
  file: string;
  title: string;
  summary: string;
};

export type GhlEmailStat = {
  lane: string;
  workflow: string;
  sent: number;
  delivered: number;
  deliveredPct: number;
  opened: number;
  openedPct: number;
  replied: number;
  bounced: number;
  bouncePct: number;
  unsubscribed: number;
};

export type MorningBriefData = {
  date: string;
  commercialBrief: string[];
  customLayer: string[];
  needsMike: string[];
  marketSignals: string[];
  recommendedMove: string;
  sourceStatus: string[];
  proofUsed: string[];
  stats: GhlEmailStat[];
  archive: BriefArchiveItem[];
  currentFile: string;
  statsFile: string;
};

export function getMorningBriefData(): MorningBriefData {
  const current = readText(CURRENT_BRIEF_PATH);
  const stats = readCsv(GHL_STATS_PATH).map(toGhlEmailStat);
  const archive = getBriefArchive();

  return {
    date: firstMatch(current, /^Date:\s*(.+)$/m) || todayEastern(),
    commercialBrief: readBullets(readSection(current, "Commercial Brief")),
    customLayer: readBullets(readSection(current, "Custom Layer")),
    needsMike: readBullets(readSection(current, "Needs Mike Today")),
    marketSignals: readBullets(readSection(current, "Market Signal")),
    recommendedMove: readSection(current, "Recommended Move").trim() || "No recommendation found yet.",
    sourceStatus: readBullets(readSection(current, "Source Status")),
    proofUsed: readBullets(readSection(current, "Proof Used")),
    stats,
    archive,
    currentFile: CURRENT_BRIEF_PATH,
    statsFile: GHL_STATS_PATH,
  };
}

export function statTotals(stats: GhlEmailStat[]) {
  const sent = stats.reduce((sum, item) => sum + item.sent, 0);
  const delivered = stats.reduce((sum, item) => sum + item.delivered, 0);
  const opened = stats.reduce((sum, item) => sum + item.opened, 0);
  const replied = stats.reduce((sum, item) => sum + item.replied, 0);
  const bounced = stats.reduce((sum, item) => sum + item.bounced, 0);
  const unsubscribed = stats.reduce((sum, item) => sum + item.unsubscribed, 0);

  return {
    sent,
    delivered,
    deliveredPct: sent > 0 ? round((delivered / sent) * 100) : 0,
    opened,
    openedPct: delivered > 0 ? round((opened / delivered) * 100) : 0,
    replied,
    bounced,
    bouncePct: sent > 0 ? round((bounced / sent) * 100) : 0,
    unsubscribed,
  };
}

function getBriefArchive(): BriefArchiveItem[] {
  const absolute = resolve(OUTBOX_DIR);
  if (!existsSync(absolute)) return [];

  return readdirSync(absolute)
    .filter((file) => /^morning-brief-\d{4}-\d{2}-\d{2}\.md$/.test(file))
    .sort()
    .reverse()
    .slice(0, 390)
    .map((file) => {
      const text = readText(join(OUTBOX_DIR, file));
      const date = firstMatch(text, /^Date:\s*(.+)$/m) || file.replace("morning-brief-", "").replace(".md", "");
      const ownerLine = readBullets(readSection(text, "Commercial Brief"))[0] || "No owner summary found.";
      return {
        date,
        file: join(OUTBOX_DIR, file).replace(/\\/g, "/"),
        title: basename(file, ".md"),
        summary: ownerLine,
      };
    });
}

function toGhlEmailStat(row: Record<string, string>): GhlEmailStat {
  return {
    lane: row.lane || "unknown",
    workflow: row.workflow || "unknown",
    sent: number(row.sent || row.total),
    delivered: number(row.delivered),
    deliveredPct: number(row.delivered_pct),
    opened: number(row.opened),
    openedPct: number(row.opened_pct),
    replied: number(row.replied),
    bounced: number(row.bounced),
    bouncePct: number(row.bounce_pct),
    unsubscribed: number(row.unsubscribed),
  };
}

function readSection(text: string, title: string): string {
  const pattern = new RegExp(`^## ${escapeRegExp(title)}\\s*$([\\s\\S]*?)(?=^## |\\s*$)`, "m");
  return text.match(pattern)?.[1]?.trim() ?? "";
}

function readBullets(section: string): string[] {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function readCsv(path: string) {
  const raw = readText(path);
  if (!raw) return [];
  return parseCsv(raw);
}

function parseCsv(raw: string) {
  const rows: string[][] = [];
  let row: string[] = [];
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

  const [headers, ...dataRows] = rows.filter((cells) => cells.some((cell) => cell.trim()));
  if (!headers) return [];
  return dataRows.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), String(cells[index] ?? "").trim()])),
  );
}

function readText(path: string): string {
  const absolute = resolve(path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
}

function firstMatch(text: string, pattern: RegExp): string {
  return text.match(pattern)?.[1]?.trim() ?? "";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function number(value: string | number | undefined): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function todayEastern() {
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
