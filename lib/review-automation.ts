import { getClientHub } from "@/lib/client-hub";

export type ReviewCustomerRow = {
  name: string;
  email: string;
  phone: string;
  jobDate: string;
  notes: string;
  suppressed: boolean;
  suppressReason: string;
};

export type ReviewCustomerPacket = {
  clientSlug: string;
  clientName: string;
  submittedBy: string;
  submittedEmail: string;
  source: string;
  timestamp: string;
  rows: ReviewCustomerRow[];
  summary: ReviewCustomerSummary;
};

export type ReviewCustomerSummary = {
  totalRows: number;
  sendableRows: number;
  suppressedRows: number;
  missingEmailRows: number;
  duplicateEmailRows: number;
};

export type ReviewFeedbackPacket = {
  clientSlug: string;
  clientName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  feedback: string;
  timestamp: string;
  shouldRouteToGoogle: boolean;
  googleReviewUrl: string;
};

export function buildCustomerPacket(input: {
  clientSlug: string;
  submittedBy: string;
  submittedEmail: string;
  customerText: string;
  doNotContactText: string;
}) {
  const client = getClientHub(input.clientSlug);
  const rows = parseCustomerRows(input.customerText);
  const suppressed = applySuppression(rows, input.doNotContactText);

  return {
    clientSlug: input.clientSlug,
    clientName: client?.businessName ?? input.clientSlug,
    submittedBy: input.submittedBy,
    submittedEmail: input.submittedEmail,
    source: "aioutsourcehub.com:review-automation-customer-upload",
    timestamp: new Date().toISOString(),
    rows: suppressed,
    summary: summarizeRows(suppressed),
  } satisfies ReviewCustomerPacket;
}

export function buildFeedbackPacket(input: {
  clientSlug: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  feedback: string;
}) {
  const client = getClientHub(input.clientSlug);
  const googleReviewUrl = client?.googleReviewUrl ?? "";
  const shouldRouteToGoogle = input.rating >= 4 && Boolean(googleReviewUrl);

  return {
    clientSlug: input.clientSlug,
    clientName: client?.businessName ?? input.clientSlug,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    rating: input.rating,
    feedback: input.feedback,
    timestamp: new Date().toISOString(),
    shouldRouteToGoogle,
    googleReviewUrl,
  } satisfies ReviewFeedbackPacket;
}

export async function forwardReviewAutomationEvent(
  eventType: "customer_upload" | "private_feedback",
  payload: ReviewCustomerPacket | ReviewFeedbackPacket,
) {
  const url =
    process.env.AOH_REVIEW_AUTOMATION_WEBHOOK_URL?.trim() ||
    process.env.AOH_CLIENT_INTAKE_WEBHOOK_URL?.trim() ||
    process.env.AOH_INTAKE_WEBHOOK_URL?.trim();

  if (!url) return { ok: false, configured: false, error: "AOH review automation webhook is not configured." };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventType, payload }),
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        ok: false,
        configured: true,
        status: response.status,
        error: (await response.text().catch(() => "")).slice(0, 300),
      };
    }
    return { ok: true, configured: true, status: response.status };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Unknown webhook error.",
    };
  }
}

export async function postReviewAutomationSlackSummary(
  eventType: "customer_upload" | "private_feedback",
  payload: ReviewCustomerPacket | ReviewFeedbackPacket,
  webhookResult: { ok: boolean; configured: boolean; error?: string },
) {
  const webhook =
    process.env.SLACK_CLIENT_INTAKE_WEBHOOK_URL?.trim() ||
    process.env.SLACK_MISSION_CONTROL_WEBHOOK_URL?.trim() ||
    process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhook) return;

  const text =
    eventType === "customer_upload"
      ? renderCustomerUploadSlack(payload as ReviewCustomerPacket, webhookResult)
      : renderFeedbackSlack(payload as ReviewFeedbackPacket, webhookResult);

  await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
    cache: "no-store",
  }).catch((error) => {
    console.error("Review Automation Slack summary failed", error);
  });
}

export function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

export function cleanLongText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parseCustomerRows(raw: string) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 500);

  const rows = lines.map(parseCustomerLine);
  const first = rows[0];
  if (first && /name|email|phone|customer/i.test(Object.values(first).join(" "))) {
    return rows.slice(1);
  }
  return rows;
}

function parseCustomerLine(line: string): ReviewCustomerRow {
  const cells = splitCsvLine(line);
  return {
    name: cells[0] ?? "",
    email: normalizeEmail(cells[1] ?? ""),
    phone: cells[2] ?? "",
    jobDate: cells[3] ?? "",
    notes: cells.slice(4).join(" ").slice(0, 300),
    suppressed: false,
    suppressReason: "",
  };
}

function applySuppression(rows: ReviewCustomerRow[], doNotContactText: string) {
  const suppressTerms = new Set(
    doNotContactText
      .split(/[\n,;]/)
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean),
  );
  const seenEmails = new Set<string>();

  return rows.map((row) => {
    const reasons = [];
    const email = normalizeEmail(row.email);
    if (!email) reasons.push("missing_email");
    if (email && seenEmails.has(email)) reasons.push("duplicate_email");
    if (email) seenEmails.add(email);
    if (isSuppressed(row, suppressTerms)) reasons.push("do_not_contact");
    return {
      ...row,
      email,
      suppressed: reasons.length > 0,
      suppressReason: reasons.join(","),
    };
  });
}

function isSuppressed(row: ReviewCustomerRow, suppressTerms: Set<string>) {
  if (!suppressTerms.size) return false;
  const haystack = `${row.name} ${row.email} ${row.phone} ${row.notes}`.toLowerCase();
  return [...suppressTerms].some((term) => haystack.includes(term));
}

function summarizeRows(rows: ReviewCustomerRow[]) {
  return {
    totalRows: rows.length,
    sendableRows: rows.filter((row) => !row.suppressed).length,
    suppressedRows: rows.filter((row) => row.suppressed).length,
    missingEmailRows: rows.filter((row) => row.suppressReason.includes("missing_email")).length,
    duplicateEmailRows: rows.filter((row) => row.suppressReason.includes("duplicate_email")).length,
  };
}

function splitCsvLine(line: string) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const next = line[index + 1];
    if (quoted && char === '"' && next === '"') {
      cell += '"';
      index++;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && char === ",") {
      cells.push(cell.trim());
      cell = "";
      continue;
    }
    cell += char;
  }
  cells.push(cell.trim());
  return cells;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function renderCustomerUploadSlack(
  packet: ReviewCustomerPacket,
  webhookResult: { ok: boolean; configured: boolean; error?: string },
) {
  return `*Review Automation customer upload*

*Client:* ${packet.clientName}
*Submitted by:* ${packet.submittedBy} - ${packet.submittedEmail}
*Rows:* ${packet.summary.totalRows}
*Sendable:* ${packet.summary.sendableRows}
*Held back:* ${packet.summary.suppressedRows}
*Missing email:* ${packet.summary.missingEmailRows}
*Duplicates:* ${packet.summary.duplicateEmailRows}
*AOH webhook:* ${webhookResult.ok ? "received full packet" : webhookResult.configured ? `failed - ${webhookResult.error || "unknown"}` : "not configured"}
*Storage:* ${webhookResult.ok ? "saved or forwarded" : "not saved yet"}

Manager next: Reviews Manager checks sendable rows, confirms the review link, then Sender sends only after proof checks.`;
}

function renderFeedbackSlack(
  packet: ReviewFeedbackPacket,
  webhookResult: { ok: boolean; configured: boolean; error?: string },
) {
  return `*Review Automation private feedback*

*Client:* ${packet.clientName}
*Rating:* ${packet.rating}/5
*Customer:* ${packet.customerName || "not provided"}${packet.customerEmail ? ` - ${packet.customerEmail}` : ""}
*Route:* ${packet.shouldRouteToGoogle ? "happy customer can continue to Google" : "private owner follow-up"}
*AOH webhook:* ${webhookResult.ok ? "received packet" : webhookResult.configured ? `failed - ${webhookResult.error || "unknown"}` : "not configured"}
*Storage:* ${webhookResult.ok ? "saved or forwarded" : "not saved yet"}

Feedback: ${packet.feedback || "none"}`;
}
