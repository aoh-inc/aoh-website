export type CampaignLane = "reviews" | "ai" | "relay" | "gmf_visibility" | "unknown";

export type ReplyIntent =
  | "optout"
  | "not_interested"
  | "ooo"
  | "interested"
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
  shouldStopSequence: boolean;
  shouldSuppressContact: boolean;
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
  if (["gmf", "gmf_visibility", "getmefound", "getmefound_visibility", "visibility_engine"].includes(lane)) return "gmf_visibility";
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
      tags: ["aoh_reply_optout", "gmf_reply_optout", "gmf_global_suppression"],
      shouldStopSequence: true,
      shouldSuppressContact: true,
      reason: "Reply matched explicit opt-out language.",
    });
  }

  if (matchesAny(text, NOT_INTERESTED_PATTERNS)) {
    return decision({
      intent: "not_interested",
      lane: input.lane,
      tags: ["aoh_reply_not_interested", "gmf_reply_not_interested", "gmf_sequence_stop"],
      shouldStopSequence: true,
      shouldSuppressContact: true,
      reason: "Reply matched not-interested or wrong-person language.",
    });
  }

  if (matchesAny(text, OOO_PATTERNS)) {
    return decision({
      intent: "ooo",
      lane: input.lane,
      tags: ["gmf_reply_ooo", "gmf_sequence_stop", "gmf_follow_up_later"],
      shouldStopSequence: true,
      shouldCreateHumanTask: true,
      reason: "Reply looks like an out-of-office or temporary unavailable response.",
    });
  }

  if (duplicate && matchesAny(text, SEND_PATTERNS)) {
    return decision({
      intent: "duplicate",
      lane: input.lane,
      tags: ["aoh_campaign_duplicate_blocked", "gmf_duplicate_report_blocked", "gmf_sequence_stop"],
      shouldStopSequence: true,
      reason: "Contact already has report/request markers, so duplicate report generation is blocked.",
    });
  }

  if (matchesAny(text, BOOK_PATTERNS)) {
    return decision({
      intent: "book",
      lane: input.lane,
      tags: ["aoh_reply_book", "aoh_campaign_booking_link_sent", "gmf_reply_interested", "gmf_sequence_stop"],
      shouldSendBookingLink: true,
      shouldStopSequence: true,
      shouldCreateHumanTask: input.lane === "gmf_visibility",
      reason: "Reply matched booking intent.",
    });
  }

  if (input.lane === "gmf_visibility" && matchesAny(text, INTERESTED_PATTERNS)) {
    return decision({
      intent: "interested",
      lane: input.lane,
      tags: ["gmf_reply_interested", "gmf_visibility_report_requested", "gmf_sequence_stop"],
      shouldGenerateReport: true,
      shouldStopSequence: true,
      shouldCreateHumanTask: true,
      reason: "Reply matched GetMeFound visibility interest or report intent.",
    });
  }

  if (matchesAny(text, SEND_PATTERNS)) {
    const laneTags =
      input.lane === "gmf_visibility"
        ? ["gmf_visibility_engine", "gmf_generate_visibility_report"]
        : input.lane === "ai"
        ? ["aoh_campaign_ai_visibility", "aoh_generate_ai_visibility_report"]
        : input.lane === "relay"
          ? ["aoh_campaign_relay", "aoh_campaign_relay_details_sent"]
          : ["aoh_campaign_reviews", "aoh_generate_marketing_report"];
    return decision({
      intent: "send",
      lane: input.lane,
      tags: ["aoh_reply_send", "aoh_campaign_report_requested", "aoh_report_requested", "gmf_sequence_stop", ...laneTags],
      shouldGenerateReport: input.lane !== "relay",
      shouldStopSequence: true,
      reason: input.lane === "relay" ? "Reply matched Relay details intent." : "Reply matched report/details intent.",
    });
  }

  return decision({
    intent: "unclear",
    lane: input.lane,
    tags: ["aoh_reply_unclear", "aoh_campaign_reply_needs_human", "gmf_reply_unclear", "gmf_sequence_stop"],
    shouldStopSequence: true,
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
  shouldStopSequence?: boolean;
  shouldSuppressContact?: boolean;
}): RouterDecision {
  const laneTag =
    input.lane === "reviews"
      ? "aoh_campaign_reviews"
      : input.lane === "ai"
        ? "aoh_campaign_ai_visibility"
        : input.lane === "relay"
          ? "aoh_campaign_relay"
          : input.lane === "gmf_visibility"
            ? "gmf_campaign_visibility_engine"
          : "";
  return {
    intent: input.intent,
    lane: input.lane,
    tags: [...new Set([...BASE_TAGS, laneTag, ...input.tags].filter(Boolean))],
    shouldGenerateReport: Boolean(input.shouldGenerateReport),
    shouldSendBookingLink: Boolean(input.shouldSendBookingLink),
    shouldCreateHumanTask: Boolean(input.shouldCreateHumanTask),
    shouldStopSequence: Boolean(input.shouldStopSequence ?? input.intent !== "unclear"),
    shouldSuppressContact: Boolean(input.shouldSuppressContact),
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
  /\bdon'?t email\b/i,
  /\bdo not contact\b/i,
  /\bdnc\b/i,
];

const NOT_INTERESTED_PATTERNS = [
  /\bnot interested\b/i,
  /\bno thanks?\b/i,
  /\bwrong person\b/i,
  /\bnot a fit\b/i,
  /\balready handled\b/i,
];

const OOO_PATTERNS = [
  /\bout of office\b/i,
  /\baway from (the )?office\b/i,
  /\bon vacation\b/i,
  /\bparental leave\b/i,
  /\bmaternity leave\b/i,
  /\bback on\b/i,
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

const INTERESTED_PATTERNS = [
  /\byes\b/i,
  /\binterested\b/i,
  /\btell me more\b/i,
  /\bsounds good\b/i,
  /\blet'?s do it\b/i,
  /\bwhat do you need\b/i,
  /\bvisibility report\b/i,
  /\bget found\b/i,
];
