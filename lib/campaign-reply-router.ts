export type CampaignLane = "reviews" | "ai" | "relay" | "unknown";

export type ReplyIntent =
  | "optout"
  | "duplicate"
  | "book"
  | "send"
  | "unclear";

export type RouterDecision = {
  intent: ReplyIntent;
  lane: CampaignLane;
  tags: string[];
  shouldGenerateReport: boolean;
  shouldSendBookingLink: boolean;
  shouldCreateHumanTask: boolean;
  reason: string;
};

const BASE_TAGS = ["aoh_campaign_reply"];

const COMPLETION_TAGS = [
  "aoh_campaign_report_requested",
  "aoh_campaign_report_delivered",
  "aoh_report_requested",
];

export function normalizeCampaignLane(value: unknown): CampaignLane {
  if (typeof value !== "string") return "unknown";
  const lane = value.trim().toLowerCase();
  if (["reviews", "review", "reach_reviews", "reach - reviews"].includes(lane)) return "reviews";
  if (["ai", "ai_visibility", "visibility", "reach_ai", "reach - ai"].includes(lane)) return "ai";
  if (["relay", "missed_call", "missed calls", "ai receptionist", "voice"].includes(lane)) return "relay";
  return "unknown";
}

export function classifyCampaignReply(input: {
  replyText: string;
  lane: CampaignLane;
  existingTags?: string[];
  hasAuditUrl?: boolean;
  hasHeatmapUrl?: boolean;
}): RouterDecision {
  const text = input.replyText.trim().toLowerCase();
  const existingTags = new Set((input.existingTags ?? []).map((tag) => tag.toLowerCase()));
  const duplicate =
    input.hasAuditUrl ||
    input.hasHeatmapUrl ||
    COMPLETION_TAGS.some((tag) => existingTags.has(tag));

  if (matchesAny(text, OPT_OUT_PATTERNS)) {
    return decision({
      intent: "optout",
      lane: input.lane,
      tags: ["aoh_reply_optout"],
      reason: "Reply matched opt-out or not-interested language.",
    });
  }

  if (duplicate && matchesAny(text, SEND_PATTERNS)) {
    return decision({
      intent: "duplicate",
      lane: input.lane,
      tags: ["aoh_campaign_duplicate_blocked"],
      reason: "Contact already has report/request markers, so duplicate report generation is blocked.",
    });
  }

  if (matchesAny(text, BOOK_PATTERNS)) {
    return decision({
      intent: "book",
      lane: input.lane,
      tags: ["aoh_reply_book", "aoh_campaign_booking_link_sent"],
      shouldSendBookingLink: true,
      reason: "Reply matched booking intent.",
    });
  }

  if (matchesAny(text, SEND_PATTERNS)) {
    const laneTags =
      input.lane === "ai"
        ? ["aoh_campaign_ai_visibility", "aoh_generate_ai_visibility_report"]
        : input.lane === "relay"
          ? ["aoh_campaign_relay", "aoh_campaign_relay_details_sent"]
          : ["aoh_campaign_reviews", "aoh_generate_marketing_report"];
    return decision({
      intent: "send",
      lane: input.lane,
      tags: ["aoh_reply_send", "aoh_campaign_report_requested", "aoh_report_requested", ...laneTags],
      shouldGenerateReport: input.lane !== "relay",
      reason: input.lane === "relay" ? "Reply matched Relay details intent." : "Reply matched report/details intent.",
    });
  }

  return decision({
    intent: "unclear",
    lane: input.lane,
    tags: ["aoh_reply_unclear", "aoh_campaign_reply_needs_human"],
    shouldCreateHumanTask: true,
    reason: "Reply did not clearly match send, book, or opt-out.",
  });
}

function decision(input: {
  intent: ReplyIntent;
  lane: CampaignLane;
  tags: string[];
  reason: string;
  shouldGenerateReport?: boolean;
  shouldSendBookingLink?: boolean;
  shouldCreateHumanTask?: boolean;
}): RouterDecision {
  const laneTag =
    input.lane === "reviews"
      ? "aoh_campaign_reviews"
      : input.lane === "ai"
        ? "aoh_campaign_ai_visibility"
        : input.lane === "relay"
          ? "aoh_campaign_relay"
          : "";
  return {
    intent: input.intent,
    lane: input.lane,
    tags: [...new Set([...BASE_TAGS, laneTag, ...input.tags].filter(Boolean))],
    shouldGenerateReport: Boolean(input.shouldGenerateReport),
    shouldSendBookingLink: Boolean(input.shouldSendBookingLink),
    shouldCreateHumanTask: Boolean(input.shouldCreateHumanTask),
    reason: input.reason,
  };
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

const OPT_OUT_PATTERNS = [
  /\bunsubscribe\b/i,
  /\bstop\b/i,
  /\bremove me\b/i,
  /\btake me off\b/i,
  /\bnot interested\b/i,
  /\bno thanks?\b/i,
  /\bwrong person\b/i,
  /\bdon'?t email\b/i,
];

const BOOK_PATTERNS = [
  /\bbook\b/i,
  /\bcalendar\b/i,
  /\bappointment\b/i,
  /\bcall\b/i,
  /\bschedule\b/i,
  /\bbooking link\b/i,
];

const SEND_PATTERNS = [
  /\bsend\b/i,
  /\bsend it\b/i,
  /\bsend please\b/i,
  /\bplease send\b/i,
  /\breport\b/i,
  /\bdetails\b/i,
  /\bshort version\b/i,
];
