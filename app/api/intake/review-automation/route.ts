import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { checkEmailRate } from "@/lib/rate-limit";

type IntakePayload = {
  businessName?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  website?: unknown;
  gbpLink?: unknown;
  accessStatus?: unknown;
  accessRole?: unknown;
  serviceIntent?: unknown;
  customerSystem?: unknown;
  notes?: unknown;
  authorized?: unknown;
  inviteEmail?: unknown;
  websiteTrap?: unknown;
};

type CleanIntake = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  gbpLink: string;
  accessStatus: string;
  accessRole: string;
  serviceIntent: string;
  customerSystem: string;
  notes: string;
  inviteEmail: string;
  source: string;
  timestamp: string;
};

const ACCESS_STATUS = new Set(["added", "need_help", "not_sure"]);
const ACCESS_ROLE = new Set(["manager", "owner", "not_sure"]);
const SERVICE_INTENT = new Set(["review_automation", "gbp_update", "ai_visibility", "not_sure"]);

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as IntakePayload | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (typeof body.websiteTrap === "string" && body.websiteTrap.trim()) {
    return NextResponse.json({ ok: true });
  }

  const businessName = cleanText(body.businessName, 120);
  const contactName = cleanText(body.contactName, 100);
  const phone = cleanText(body.phone, 60);
  const website = cleanText(body.website, 250);
  const gbpLink = cleanText(body.gbpLink, 300);
  const customerSystem = cleanText(body.customerSystem, 160);
  const notes = cleanText(body.notes, 1200);
  const inviteEmail = cleanText(body.inviteEmail, 160) || defaultInviteEmail();
  const accessStatus = cleanEnum(body.accessStatus, ACCESS_STATUS, "not_sure");
  const accessRole = cleanEnum(body.accessRole, ACCESS_ROLE, "not_sure");
  const serviceIntent = cleanEnum(body.serviceIntent, SERVICE_INTENT, "review_automation");

  if (businessName.length < 2) {
    return NextResponse.json({ ok: false, error: "Add the business name." }, { status: 400 });
  }
  if (contactName.length < 2) {
    return NextResponse.json({ ok: false, error: "Add your name." }, { status: 400 });
  }
  if (body.authorized !== true) {
    return NextResponse.json(
      { ok: false, error: "Confirm you are authorized to request setup." },
      { status: 400 },
    );
  }

  const emailCheck = validateEmail(body.email);
  if (!emailCheck.ok) {
    return NextResponse.json({ ok: false, error: emailCheck.error }, { status: 400 });
  }
  const email = String(body.email).trim().toLowerCase();
  const rate = await checkEmailRate(email, 5);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "We received a few submissions already. We will follow up soon." },
      { status: 429, headers: rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : undefined },
    );
  }

  const payload: CleanIntake = {
    businessName,
    contactName,
    email,
    phone,
    website,
    gbpLink,
    accessStatus,
    accessRole,
    serviceIntent,
    customerSystem,
    notes,
    inviteEmail,
    source: "aioutsourcehub.com/intake/review-automation",
    timestamp: new Date().toISOString(),
  };

  const tasks: Promise<void>[] = [forwardToAohIntakeWebhook(payload), forwardToSlack(payload)];
  if (!ghlForwardingDisabled()) {
    tasks.push(forwardToGhl(payload));
  }

  await Promise.allSettled(tasks);

  return NextResponse.json({ ok: true });
}

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function cleanEnum(value: unknown, allowed: Set<string>, fallback: string) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim().toLowerCase();
  return allowed.has(cleaned) ? cleaned : fallback;
}

function defaultInviteEmail() {
  return process.env.AOH_GBP_INVITE_EMAIL?.trim() || "mike@aioutsourcehub.com";
}

async function forwardToGhl(payload: CleanIntake) {
  const url =
    process.env.GHL_CLIENT_INTAKE_WEBHOOK_URL?.trim() ||
    process.env.GHL_CONTACT_WEBHOOK_URL?.trim() ||
    process.env.GHL_WEBHOOK_URL?.trim();
  if (!url) return;

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...payload,
      taskPacket: buildTaskPacket(payload),
    }),
  }).catch((error) => {
    console.error("Client intake GHL webhook failed", error);
    return null;
  });

  if (response && !response.ok) {
    console.error("Client intake GHL webhook responded", response.status, await response.text().catch(() => ""));
  }
}

async function forwardToAohIntakeWebhook(payload: CleanIntake) {
  const url =
    process.env.AOH_CLIENT_INTAKE_WEBHOOK_URL?.trim() ||
    process.env.AOH_INTAKE_WEBHOOK_URL?.trim();
  if (!url) return;

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...payload,
      taskPacket: buildTaskPacket(payload),
      destination: "aoh_owned_intake",
    }),
  }).catch((error) => {
    console.error("Client intake AOH webhook failed", error);
    return null;
  });

  if (response && !response.ok) {
    console.error("Client intake AOH webhook responded", response.status, await response.text().catch(() => ""));
  }
}

async function forwardToSlack(payload: CleanIntake) {
  const webhook =
    process.env.SLACK_CLIENT_INTAKE_WEBHOOK_URL?.trim() ||
    process.env.SLACK_MISSION_CONTROL_WEBHOOK_URL?.trim() ||
    process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhook) return;

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: buildSlackMessage(payload) }),
  }).catch((error) => {
    console.error("Client intake Slack webhook failed", error);
    return null;
  });

  if (response && !response.ok) {
    console.error("Client intake Slack webhook responded", response.status, await response.text().catch(() => ""));
  }
}

function ghlForwardingDisabled() {
  const value = String(process.env.AOH_DISABLE_GHL_FORWARDING ?? process.env.AOH_GHL_FREE_MODE ?? "")
    .trim()
    .toLowerCase();
  return ["1", "true", "yes", "on"].includes(value);
}

function buildTaskPacket(payload: CleanIntake) {
  return {
    job: "Review Automation intake",
    managerSummary: `${payload.businessName} submitted setup intake. GBP access status: ${statusLabel(payload.accessStatus)}. Role selected: ${roleLabel(payload.accessRole)}.`,
    owners: {
      manager: "route and brief",
      localVisibilityManager: "verify Google Business Profile access and profile basics",
      reviewsManager: "prepare review automation setup",
      systemsDirector: "keep setup moving through AOH-owned intake and alert paths",
      ghlExpert: "bridge-only HighLevel setup/export while GHL remains active",
    },
    safety: [
      "No password sharing.",
      "Default GBP role is Manager.",
      "AOH-owned intake path should receive the packet before any GHL bridge handoff.",
      "Do not enable HighLevel AI features without Mike's manual approval.",
      "Public GBP changes need client or Mike approval before publishing.",
    ],
  };
}

function buildSlackMessage(payload: CleanIntake) {
  return `*Client intake received - Review Automation*

*Business:* ${payload.businessName}
*Contact:* ${payload.contactName} - ${payload.email}${payload.phone ? ` - ${payload.phone}` : ""}
*Website:* ${payload.website || "not provided"}
*Google profile:* ${payload.gbpLink || "not provided"}
*GBP access:* ${statusLabel(payload.accessStatus)}
*Role selected:* ${roleLabel(payload.accessRole)}
*Setup requested:* ${serviceLabel(payload.serviceIntent)}
*Customer system:* ${payload.customerSystem || "not provided"}

*Manager routing:*
- Local Visibility Manager: verify GBP access and profile basics.
- Reviews Manager: prepare review automation setup.
- Systems Director: keep AOH-owned intake and alert paths healthy.
- GHL Expert: bridge-only HighLevel setup/export while GHL remains active.

*Safety:*
- No password sharing.
- Default GBP role is Manager.
- HighLevel AI stays OFF unless Mike manually approves it.

*Notes:* ${payload.notes || "none"}`;
}

function statusLabel(status: string) {
  if (status === "added") return "client says access was added";
  if (status === "need_help") return "client needs help adding access";
  return "client is not sure";
}

function roleLabel(role: string) {
  if (role === "manager") return "Manager";
  if (role === "owner") return "Owner - review why owner was selected";
  return "Not sure";
}

function serviceLabel(intent: string) {
  if (intent === "gbp_update") return "Google profile update";
  if (intent === "ai_visibility") return "AI Visibility";
  if (intent === "not_sure") return "Not sure";
  return "Review Automation";
}
