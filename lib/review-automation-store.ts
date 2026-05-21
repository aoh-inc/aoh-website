import type { ReviewCustomerPacket, ReviewFeedbackPacket } from "@/lib/review-automation";

type ReviewAutomationEventType = "customer_upload" | "private_feedback";

export type ReviewAutomationRecord = {
  id: string;
  eventType: ReviewAutomationEventType;
  clientSlug: string;
  clientName: string;
  createdAt: string;
  summary: Record<string, unknown>;
  payload: ReviewCustomerPacket | ReviewFeedbackPacket;
};

type StorageResult =
  | { ok: true; configured: true; id: string; status?: number }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; id: string; status?: number; error: string };

type ReviewAutomationSummaryResult =
  | {
      ok: true;
      configured: true;
      index: string;
      records: Array<Omit<ReviewAutomationRecord, "payload">>;
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string; status?: number };

const DEFAULT_TTL_DAYS = 90;

export async function saveReviewAutomationEvent(
  eventType: ReviewAutomationEventType,
  payload: ReviewCustomerPacket | ReviewFeedbackPacket,
): Promise<StorageResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const id = `${Date.now()}-${crypto.randomUUID()}`;

  if (!url || !token) {
    return { ok: false, configured: false, error: "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set." };
  }

  const record = buildRecord({ id, eventType, payload });
  const ttlSec = storageTtlDays() * 24 * 60 * 60;
  const key = eventKey(id);
  const clientIndex = clientIndexKey(record.clientSlug);

  const commands = [
    ["SET", key, JSON.stringify(record), "EX", String(ttlSec)],
    ["LPUSH", clientIndex, id],
    ["LTRIM", clientIndex, "0", "499"],
    ["LPUSH", globalIndexKey(), id],
    ["LTRIM", globalIndexKey(), "0", "999"],
  ];

  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  }).catch((error) => {
    return error instanceof Error ? error : new Error("Unknown storage error.");
  });

  if (response instanceof Error) {
    return { ok: false, configured: true, id, error: response.message };
  }
  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      id,
      status: response.status,
      error: (await response.text().catch(() => "")).slice(0, 300),
    };
  }

  return { ok: true, configured: true, id, status: response.status };
}

export async function listReviewAutomationSummaries(input: {
  clientSlug?: string;
  limit?: number;
}): Promise<ReviewAutomationSummaryResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return { ok: false, configured: false, error: "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set." };
  }

  const limit = Math.min(50, Math.max(1, Math.floor(input.limit ?? 20)));
  const index = input.clientSlug ? clientIndexKey(input.clientSlug) : globalIndexKey();
  const idsResult = await runRedisPipeline<string[][]>(url, token, [["LRANGE", index, "0", String(limit - 1)]]);

  if (!idsResult.ok) return { ok: false, configured: true, status: idsResult.status, error: idsResult.error };

  const ids = Array.isArray(idsResult.values[0]) ? idsResult.values[0] : [];
  if (!ids.length) {
    return { ok: true, configured: true, index, records: [] };
  }

  const recordResult = await runRedisPipeline<string[]>(
    url,
    token,
    ids.map((id) => ["GET", eventKey(id)]),
  );
  if (!recordResult.ok) return { ok: false, configured: true, status: recordResult.status, error: recordResult.error };

  const records = recordResult.values
    .map((value) => parseRecord(value))
    .filter((record): record is ReviewAutomationRecord => Boolean(record))
    .map(({ payload: _payload, ...summary }) => summary);

  return { ok: true, configured: true, index, records };
}

async function runRedisPipeline<T>(
  url: string,
  token: string,
  commands: string[][],
): Promise<{ ok: true; values: T; status: number } | { ok: false; error: string; status?: number }> {
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  }).catch((error) => {
    return error instanceof Error ? error : new Error("Unknown storage error.");
  });

  if (response instanceof Error) return { ok: false, error: response.message };
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: (await response.text().catch(() => "")).slice(0, 300),
    };
  }

  const json = (await response.json().catch(() => null)) as Array<{ result?: unknown; error?: string }> | null;
  if (!Array.isArray(json)) {
    return { ok: false, status: response.status, error: "Redis pipeline returned an unexpected response." };
  }

  const failed = json.find((item) => item?.error);
  if (failed?.error) {
    return { ok: false, status: response.status, error: failed.error };
  }

  return { ok: true, status: response.status, values: json.map((item) => item.result) as T };
}

function buildRecord({
  id,
  eventType,
  payload,
}: {
  id: string;
  eventType: ReviewAutomationEventType;
  payload: ReviewCustomerPacket | ReviewFeedbackPacket;
}): ReviewAutomationRecord {
  return {
    id,
    eventType,
    clientSlug: payload.clientSlug,
    clientName: payload.clientName,
    createdAt: "timestamp" in payload ? payload.timestamp : new Date().toISOString(),
    summary: summarizePayload(eventType, payload),
    payload,
  };
}

function summarizePayload(eventType: ReviewAutomationEventType, payload: ReviewCustomerPacket | ReviewFeedbackPacket) {
  if (eventType === "customer_upload") {
    const packet = payload as ReviewCustomerPacket;
    return {
      submittedBy: packet.submittedBy,
      submittedEmail: packet.submittedEmail,
      ...packet.summary,
    };
  }

  const packet = payload as ReviewFeedbackPacket;
  return {
    rating: packet.rating,
    shouldRouteToGoogle: packet.shouldRouteToGoogle,
    hasFeedback: Boolean(packet.feedback.trim()),
    hasCustomerEmail: Boolean(packet.customerEmail.trim()),
  };
}

function parseRecord(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  try {
    const parsed = JSON.parse(value) as ReviewAutomationRecord;
    if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

function storageTtlDays() {
  const value = Number(process.env.AOH_REVIEW_AUTOMATION_STORAGE_TTL_DAYS);
  return Number.isFinite(value) && value > 0 ? Math.min(365, Math.floor(value)) : DEFAULT_TTL_DAYS;
}

function eventKey(id: string) {
  return `review-automation:event:${id}`;
}

function clientIndexKey(clientSlug: string) {
  return `review-automation:index:client:${clientSlug}`;
}

function globalIndexKey() {
  return "review-automation:index:all";
}
