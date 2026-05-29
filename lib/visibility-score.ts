/**
 * Shared AI-visibility scoring engine.
 * Used by POST /api/visibility-score (server-to-server) and by the
 * free-check report pipeline so cold-email gap and inbound report
 * are scored by the same thresholds — no drift.
 *
 * Reuses SIGNAL_CATALOG, calcScore, gradeFromGroupCount, overallGrade
 * from lib/visibility-report-20.ts.
 */

import type { OutscraperBusiness } from "@/lib/outscraper";
import {
  SIGNAL_CATALOG,
  calcScore,
  gradeFromGroupCount,
  groupGreenCount,
  overallGrade,
  type LetterGrade,
  type SignalStatus,
  type VisibilitySignal20,
} from "@/lib/visibility-report-20";

// ─── Public types ─────────────────────────────────────────────────────────────

export type GapKey =
  | "missing_hours"
  | "no_website"
  | "thin_profile"
  | "stale_reviews"
  | "few_reviews"
  | "few_photos";

export type VisibilityScoreResult = {
  status: "ok" | "insufficient_data";
  visibility_score: number;
  grades: {
    overall: LetterGrade;
    reviews: LetterGrade;
    ai_readability: LetterGrade;
    google_profile: LetterGrade;
    consistency: LetterGrade;
  };
  signals: Array<{ id: number; key: string; label: string; status: SignalStatus; plan: string }>;
  worst_gap: GapKey | null;
  gap_hook: string;
  days_since_last_review: number | null;
};

// ─── Gap priority (configurable order — first red wins, then first amber) ────

const GAP_PRIORITY: GapKey[] = [
  "missing_hours",
  "no_website",
  "thin_profile",
  "stale_reviews",
  "few_reviews",
  "few_photos",
];

// ─── Days-since-review parser ─────────────────────────────────────────────────

export function parseDaysSinceReview(value: string | null): number | null {
  if (!value) return null;
  const text = value.trim();

  // Relative strings: "2 weeks ago", "3 months ago", "1 year ago"
  const relMatch = text.match(/(\d+)\s+(day|week|month|year)s?\s+ago/i);
  if (relMatch) {
    const n = parseInt(relMatch[1], 10);
    const unit = relMatch[2].toLowerCase();
    if (unit === "day") return n;
    if (unit === "week") return n * 7;
    if (unit === "month") return n * 30;
    if (unit === "year") return n * 365;
  }

  // ISO / date string
  try {
    const d = new Date(text);
    if (!Number.isNaN(d.getTime())) {
      return Math.floor((Date.now() - d.getTime()) / 86_400_000);
    }
  } catch {
    // fall through
  }

  return null;
}

// ─── Core signal scoring ──────────────────────────────────────────────────────
// Each signal returns { status, dataBacked }.
// dataBacked=false means the field was unavailable from Outscraper —
// those signals default to amber but do NOT qualify for a gap_hook
// (accuracy rule: never guess).

type ScoredSignal = { status: SignalStatus; dataBacked: boolean };

function scoreSignals(biz: OutscraperBusiness): Map<number, ScoredSignal> {
  const days = parseDaysSinceReview(biz.latestReviewDate);
  const reviews = biz.reviewCount;
  const photos = biz.photosCount;
  const hasWebsite = !!biz.website;
  const hasCategory = !!biz.primaryCategory;
  const hours = biz.hoursPresent;
  const rating = biz.rating;

  const m = new Map<number, ScoredSignal>();

  // ── Group A — Reviews & Trust ─────────────────────────────────────────────

  // Signal 1: Review velocity
  m.set(1, reviews !== null
    ? { dataBacked: true, status: reviews >= 25 ? "green" : reviews >= 10 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  // Signal 2: Fresh reviews in last 30 days
  m.set(2, days !== null
    ? { dataBacked: true, status: days <= 30 ? "green" : days <= 60 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  // Signal 3: Review response cadence — not checkable from base Outscraper
  m.set(3, { dataBacked: false, status: "amber" });

  // Signal 4: Review sentiment — approximate from rating
  m.set(4, rating !== null
    ? { dataBacked: true, status: rating >= 4.3 ? "green" : rating >= 3.8 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  // Signal 5: Entity trust — not checkable from base Outscraper
  m.set(5, { dataBacked: false, status: "amber" });

  // ── Group B — AI Readability ──────────────────────────────────────────────

  // Signal 6: AI crawlability — website present is minimum requirement
  m.set(6, { dataBacked: true, status: hasWebsite ? "amber" : "red" });
  // amber not green: can't verify GPTBot isn't blocked without fetching

  // Signal 7-10: Not checkable from base Outscraper
  for (const id of [7, 8, 9, 10]) {
    m.set(id, { dataBacked: false, status: "amber" });
  }

  // ── Group C — Google Profile ──────────────────────────────────────────────

  // Signal 11: Profile completeness — category + address + phone is minimum
  const hasBasics = hasCategory && !!biz.address && !!biz.phone;
  m.set(11, { dataBacked: true, status: hasBasics ? "amber" : "red" });
  // amber not green: description + services unknown from base scrape

  // Signal 12: Primary category + service taxonomy
  m.set(12, { dataBacked: true, status: hasCategory ? "amber" : "red" });

  // Signal 13: Hours/services/service-area clarity
  m.set(13, hours !== null
    ? { dataBacked: true, status: hours ? "amber" : "red" }
    // amber not green: service area + services list not in Outscraper base
    : { dataBacked: false, status: "amber" });

  // Signal 14: Photo & visual completeness
  m.set(14, photos !== null
    ? { dataBacked: true, status: photos >= 10 ? "green" : photos >= 5 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  // Signal 15: Business description & attributes — not in base Outscraper
  m.set(15, { dataBacked: false, status: "amber" });

  // ── Group D — Consistency & Freshness ────────────────────────────────────

  // Signal 16-18: NAP / citation / duplicate — not checkable from base scrape
  for (const id of [16, 17, 18]) {
    m.set(id, { dataBacked: false, status: "amber" });
  }

  // Signal 19: Freshness signals — proxy: recency of last review
  m.set(19, days !== null
    ? { dataBacked: true, status: days <= 30 ? "green" : days <= 60 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  // Signal 20: Fresh photos & activity
  m.set(20, photos !== null
    ? { dataBacked: true, status: photos >= 10 ? "green" : photos >= 5 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  return m;
}

// ─── Gap derivation — must match thresholds above ───────────────────────────
// Signal mapping (for drift consistency with the 20-signal report):
//   missing_hours → Signal 13
//   no_website    → Signal 6
//   thin_profile  → Signals 11, 12
//   stale_reviews → Signal 2
//   few_reviews   → Signal 1
//   few_photos    → Signal 14

function deriveGapScores(
  biz: OutscraperBusiness,
  days: number | null,
): Map<GapKey, { status: SignalStatus; dataBacked: boolean }> {
  const reviews = biz.reviewCount;
  const photos = biz.photosCount;

  const g = new Map<GapKey, { status: SignalStatus; dataBacked: boolean }>();

  g.set("missing_hours", biz.hoursPresent !== null
    ? { dataBacked: true, status: biz.hoursPresent ? "green" : "red" }
    : { dataBacked: false, status: "amber" });

  g.set("no_website", { dataBacked: true, status: biz.website ? "green" : "red" });

  g.set("thin_profile", { dataBacked: true,
    status: (!!biz.primaryCategory && !!biz.address && !!biz.phone) ? "amber" : "red" });

  g.set("stale_reviews", days !== null
    ? { dataBacked: true, status: days <= 30 ? "green" : days <= 60 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  g.set("few_reviews", reviews !== null
    ? { dataBacked: true, status: reviews >= 25 ? "green" : reviews >= 10 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  g.set("few_photos", photos !== null
    ? { dataBacked: true, status: photos >= 10 ? "green" : photos >= 5 ? "amber" : "red" }
    : { dataBacked: false, status: "amber" });

  return g;
}

// ─── Pick worst gap — priority order, data-backed only ───────────────────────

function pickWorstGap(
  gapScores: Map<GapKey, { status: SignalStatus; dataBacked: boolean }>,
): GapKey | null {
  // First pass: reds
  for (const key of GAP_PRIORITY) {
    const g = gapScores.get(key);
    if (g?.dataBacked && g.status === "red") return key;
  }
  // Second pass: ambers
  for (const key of GAP_PRIORITY) {
    const g = gapScores.get(key);
    if (g?.dataBacked && g.status === "amber") return key;
  }
  return null;
}

// ─── Gap hook library ─────────────────────────────────────────────────────────

export function renderGapHook(
  gap: GapKey,
  biz: { name: string; category?: string; reviewCount?: number | null; daysSinceLastReview?: number | null },
): string {
  const name = biz.name || "your business";
  const cat = biz.category || "local business";
  const reviews = biz.reviewCount;
  const days = biz.daysSinceLastReview;

  switch (gap) {
    case "missing_hours":
      return `I noticed your hours aren't showing on ${name}'s Google listing — that quietly drops you out of a lot of searches.`;
    case "no_website":
      return `I noticed ${name}'s Google listing doesn't point to a working website — which makes it hard for AI to trust and recommend you.`;
    case "thin_profile":
      return `I noticed ${name}'s Google profile is missing a lot of basics — services, description, the things AI checks before recommending you.`;
    case "stale_reviews":
      return `I noticed ${name} hasn't had a new review in about ${days ?? "a while"} days — Google now leans on how recent they are, not just how many.`;
    case "few_reviews":
      return reviews !== null && reviews !== undefined
        ? `I noticed ${name} has ${reviews} reviews — and a couple of ${cat}s near you are well ahead.`
        : `I noticed ${name} has very few reviews — and a couple of ${cat}s near you are well ahead.`;
    case "few_photos":
      return `I noticed ${name}'s Google profile has almost no photos — one of the first things AI and customers use to judge you.`;
  }
}

// ─── Main exported scorer ─────────────────────────────────────────────────────

export function scoreOutscraperBusiness(biz: OutscraperBusiness): VisibilityScoreResult {
  const days = parseDaysSinceReview(biz.latestReviewDate);
  const signalMap = scoreSignals(biz);
  const gapScores = deriveGapScores(biz, days);

  // Build VisibilitySignal20 array for the report scoring functions
  const signals: VisibilitySignal20[] = SIGNAL_CATALOG.map((entry) => {
    const scored = signalMap.get(entry.id);
    return {
      ...entry,
      status: scored?.status ?? "amber",
      beforeStatus: scored?.status ?? "amber",
    };
  });

  const greenCount = signals.filter((s) => (s.status ?? "amber") === "green").length;
  const score = calcScore(signals, "baseline");
  const overall = overallGrade(greenCount);

  const grades = {
    overall,
    reviews:       gradeFromGroupCount(groupGreenCount(signals, "A", "baseline")),
    ai_readability: gradeFromGroupCount(groupGreenCount(signals, "B", "baseline")),
    google_profile: gradeFromGroupCount(groupGreenCount(signals, "C", "baseline")),
    consistency:   gradeFromGroupCount(groupGreenCount(signals, "D", "baseline")),
  };

  const worstGap = pickWorstGap(gapScores);

  if (!worstGap) {
    return {
      status: "insufficient_data",
      visibility_score: score,
      grades,
      signals: signals.map((s) => ({ id: s.id, key: s.label.toLowerCase().replace(/\s+/g, "_"), label: s.label, status: s.status ?? "amber", plan: s.plan })),
      worst_gap: null,
      gap_hook: "",
      days_since_last_review: days,
    };
  }

  const hook = renderGapHook(worstGap, {
    name: biz.name,
    category: biz.primaryCategory,
    reviewCount: biz.reviewCount,
    daysSinceLastReview: days,
  });

  return {
    status: "ok",
    visibility_score: score,
    grades,
    signals: signals.map((s) => ({ id: s.id, key: s.label.toLowerCase().replace(/\s+/g, "_"), label: s.label, status: s.status ?? "amber", plan: s.plan })),
    worst_gap: worstGap,
    gap_hook: hook,
    days_since_last_review: days,
  };
}
