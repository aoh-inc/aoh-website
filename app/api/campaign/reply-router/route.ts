import { NextRequest, NextResponse } from "next/server";
import {
  classifyCampaignReply,
  normalizeCampaignLane,
  type CampaignLane,
} from "@/lib/campaign-reply-router";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

type RouterPayload = {
  contactId?: unknown;
  email?: unknown;
  replyText?: unknown;
  message?: unknown;
  body?: unknown;
  campaignLane?: unknown;
  lane?: unknown;
  tags?: unknown;
  contact?: unknown;
  customData?: unknown;
  dryRun?: unknown;
};

type GhlContact = {
  tags?: string[];
  customFields?: Array<{ id?: string; value?: unknown }>;
};

const URL_FIELD_IDS = {
  auditUrl: "MtlBT8xoZZOWoK58XnpR",
  heatmapUrl: "Gpup0b6SBHYb768NOPuk",
} as const;

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as RouterPayload | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const contactId = pickString(body, ["contactId", "contact_id"]) ?? pickNestedString(body, ["contact", "id"]);
  const replyText =
    pickString(body, ["replyText", "message", "body", "text", "reply_body"]) ??
    pickNestedString(body, ["customData", "replyText"]) ??
    pickNestedString(body, ["customData", "message"]) ??
    "";
  const lane = normalizeCampaignLane(
    pickString(body, ["campaignLane", "lane", "campaign"]) ??
      pickNestedString(body, ["customData", "campaignLane"]) ??
      pickNestedString(body, ["customData", "lane"]),
  );
  const dryRun = body.dryRun === true || req.nextUrl.searchParams.get("dryRun") === "1";

  if (!replyText.trim()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing replyText. Map the Customer Replied message body into replyText.",
      },
      { status: 400 },
    );
  }

  const contact = contactId ? await getGhlContact(contactId) : null;
  const existingTags = contact?.tags ?? readTags(body);
  const decision = classifyCampaignReply({
    replyText,
    lane,
    existingTags,
    hasAuditUrl: hasCustomFieldValue(contact, URL_FIELD_IDS.auditUrl),
    hasHeatmapUrl: hasCustomFieldValue(contact, URL_FIELD_IDS.heatmapUrl),
  });

  let tagResult: { ok: boolean; status?: number; error?: string } | null = null;
  if (!dryRun) {
    if (!contactId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing contactId. Router can classify, but cannot tag the contact without contactId.",
          decision,
        },
        { status: 400 },
      );
    }
    tagResult = await addTags(contactId, decision.tags);
    if (!tagResult.ok) {
      return NextResponse.json(
        { ok: false, error: "Failed to add GHL tags.", decision, tagResult },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    contactId: contactId ?? null,
    lane,
    decision,
    tagResult,
  });
}

function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.CAMPAIGN_REPLY_ROUTER_TOKEN?.trim();
  const testBypass = process.env.REPORT_TEST_BYPASS_TOKEN?.trim();
  const provided =
    req.headers.get("x-campaign-reply-router-token")?.trim() ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();

  if (expected) {
    return provided === expected
      ? { ok: true }
      : { ok: false, status: 401, error: "Unauthorized" };
  }

  if (process.env.NODE_ENV !== "production" && testBypass && provided === testBypass) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 503,
    error: "CAMPAIGN_REPLY_ROUTER_TOKEN is not configured.",
  };
}

async function getGhlContact(contactId: string): Promise<GhlContact | null> {
  const token = process.env.GHL_PIT_TOKEN?.trim();
  if (!token) return null;

  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/${encodeURIComponent(contactId)}`, {
      headers: ghlHeaders(token),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as { contact?: GhlContact } | null;
    return data?.contact ?? null;
  } catch {
    return null;
  }
}

async function addTags(contactId: string, tags: string[]): Promise<{ ok: boolean; status?: number; error?: string }> {
  const token = process.env.GHL_PIT_TOKEN?.trim();
  if (!token) {
    return { ok: false, error: "GHL_PIT_TOKEN is not configured." };
  }

  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/${encodeURIComponent(contactId)}/tags`, {
      method: "POST",
      headers: ghlHeaders(token),
      body: JSON.stringify({ tags }),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: (await res.text().catch(() => "")).slice(0, 300) };
    }
    return { ok: true, status: res.status };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown GHL tag error." };
  }
}

function ghlHeaders(token: string): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Version: GHL_API_VERSION,
  };
}

function hasCustomFieldValue(contact: GhlContact | null, fieldId: string): boolean {
  const field = contact?.customFields?.find((item) => item.id === fieldId);
  return typeof field?.value === "string" && field.value.trim().length > 0;
}

function readTags(body: RouterPayload): string[] {
  if (Array.isArray(body.tags)) {
    return body.tags.filter((tag): tag is string => typeof tag === "string");
  }
  const contact = asRecord(body.contact);
  const tags = contact.tags;
  return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string") : [];
}

function pickString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function pickNestedString(record: Record<string, unknown>, path: string[]): string | null {
  let cursor: unknown = record;
  for (const key of path) {
    const next = asRecord(cursor)[key];
    if (next === undefined) return null;
    cursor = next;
  }
  return typeof cursor === "string" && cursor.trim() ? cursor.trim() : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}
