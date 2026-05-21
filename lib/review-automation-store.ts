import type { ReviewCustomerPacket, ReviewFeedbackPacket } from "@/lib/review-automation";

type ReviewAutomationEventType = "customer_upload" | "private_feedback";

type ReviewAutomationRecord = {
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
