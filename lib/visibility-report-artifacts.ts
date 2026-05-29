import type { ClientHubProfile, ClientHubStatus } from "@/lib/client-hub";
import type { ClientHubActivitySnapshot } from "@/lib/client-hub-activity";
import type { AIVisibilityReport, ScoredBusiness } from "@/lib/ai-visibility";

export type StatusLabel = "Strong" | "Fair" | "Weak" | "Missing";

export type ProspectVisibilitySignal = {
  signal: string;
  why: string;
  status: StatusLabel;
  competitorClue: string;
  unlock: string;
  points: number;
};

export type ProspectVisibilityArtifact = {
  businessName: string;
  location: string;
  score: number;
  competitorAverageScore: number | null;
  topCompetitorName: string;
  topCompetitorScore: number | null;
  primaryGap: string;
  quickRead: string;
  signals: ProspectVisibilitySignal[];
  lockedNow: string[];
  lockedLater: string[];
};

export type ClientReportSignal = {
  signal: string;
  status: StatusLabel;
  score: number;
  evidence: string;
  nextAction: string;
};

export type ClientReportSectionId = "baseline" | "before-after" | "monthly-recap";

export type ClientReportSummary = {
  id: ClientReportSectionId;
  label: string;
  status: string;
  detail: string;
};

export type ClientVisibilityReportArtifact = {
  clientName: string;
  plan: string;
  periodLabel: string;
  currentScore: number;
  baselineScore: number;
  movement: number;
  statusSummary: string;
  nextClientAction: string;
  stats: Array<{ label: string; value: string; detail: string }>;
  signals: ClientReportSignal[];
  reports: ClientReportSummary[];
  competitorGap: string;
  nextActions: string[];
};

const PROSPECT_UNLOCKS = [
  "Google profile cleanup",
  "Website/profile fact sync",
  "Review link capture",
  "First review request path",
  "Before/after visibility snapshot",
];

const LATER_UNLOCKS = [
  "Monthly visibility checks",
  "Recurring review requests",
  "Monthly report",
  "Deeper AI answer monitoring",
];

export function buildProspectVisibilityArtifact(report: AIVisibilityReport): ProspectVisibilityArtifact {
  const competitor = report.competitor;
  const signals = scoreProspectSignals(report.prospect, competitor);
  const score = totalScore(signals);
  const competitorSignals = competitor ? scoreProspectSignals(competitor, report.prospect) : [];
  const topCompetitorScore = competitor ? totalScore(competitorSignals) : null;
  const lowestSignal = [...signals].sort((a, b) => a.points - b.points)[0];

  return {
    businessName: report.prospect.name,
    location: report.city || report.prospect.city || "your area",
    score,
    competitorAverageScore: topCompetitorScore,
    topCompetitorName: competitor?.name ?? "Top visible competitor",
    topCompetitorScore,
    primaryGap: lowestSignal
      ? `${lowestSignal.signal} is the clearest gap.`
      : "The clearest gap is still being verified.",
    quickRead:
      score >= 70
        ? "Google and AI can understand the basics, but your signals need to stay fresh to stay recommended."
        : "Google and AI can understand part of the business, but not enough to confidently recommend it over cleaner competitors.",
    signals,
    lockedNow: PROSPECT_UNLOCKS,
    lockedLater: LATER_UNLOCKS,
  };
}

export function buildFallbackProspectArtifact(input: {
  businessName: string;
  location?: string;
}): ProspectVisibilityArtifact {
  const signals: ProspectVisibilitySignal[] = [
    {
      signal: "Google profile clarity",
      why: "Google needs complete business facts before it can confidently match you.",
      status: "Weak",
      competitorClue: "Competitors often show clearer categories, services, hours, or photos.",
      unlock: "Profile cleanup",
      points: 8,
    },
    {
      signal: "Website/profile match",
      why: "AI and Search trust you more when your site and Google profile agree.",
      status: "Weak",
      competitorClue: "Cleaner competitors usually keep public facts consistent.",
      unlock: "Fact sync",
      points: 7,
    },
    {
      signal: "Service + location clarity",
      why: "AI Mode handles specific local questions, so services and areas must be obvious.",
      status: "Missing",
      competitorClue: "Top competitors tend to explain services more clearly.",
      unlock: "Baseline site fixes",
      points: 6,
    },
    {
      signal: "Public proof freshness",
      why: "Recent visible activity reduces buyer doubt.",
      status: "Fair",
      competitorClue: "Visible competitors may look more active right now.",
      unlock: "First review path",
      points: 11,
    },
    {
      signal: "AI/search readiness",
      why: "Google AI still depends on crawlable, useful, visible content.",
      status: "Weak",
      competitorClue: "Competitors with clearer service pages are easier for AI to read.",
      unlock: "Before/after snapshot",
      points: 10,
    },
  ];

  return {
    businessName: input.businessName || "Your Business",
    location: input.location || "your area",
    score: totalScore(signals),
    competitorAverageScore: null,
    topCompetitorName: "Top visible competitor",
    topCompetitorScore: null,
    primaryGap: "Service + location clarity is the clearest gap.",
    quickRead:
      "Google and AI can understand part of the business, but not enough to confidently recommend it over cleaner competitors.",
    signals,
    lockedNow: PROSPECT_UNLOCKS,
    lockedLater: LATER_UNLOCKS,
  };
}

export function buildClientVisibilityReportArtifact(input: {
  client: ClientHubProfile;
  activity: ClientHubActivitySnapshot;
}): ClientVisibilityReportArtifact {
  const { client, activity } = input;
  const clientNeeds = client.checklist.filter((item) => item.owner === "Client" && item.status !== "done");
  const googleAccess = findChecklist(client, "Google Business Profile access");
  const businessInfo = findChecklist(client, "Business info confirmed");
  const reviewLink = findChecklist(client, "Google review link");
  const customerList = findChecklist(client, "Recent customer/job list");
  const automation = findChecklist(client, "Automation setup");
  const monthly = activity.ok ? activity.monthly : null;
  const weeklyReviews = activity.ok ? activity.weekly.feedback : client.reviews.weeklyReviews;
  const requestsSent = monthly ? monthly.sent : client.reviews.requestsSent;
  const feedback = monthly ? monthly.feedback : client.monthlyRecap.feedbackCaptured;
  const heldBack = monthly ? monthly.heldBack : client.monthlyRecap.heldBack;

  const signals: ClientReportSignal[] = [
    {
      signal: "Google profile clarity",
      status: statusFromChecklist(googleAccess?.status),
      score: pointsFromChecklist(googleAccess?.status),
      evidence: googleAccess?.detail ?? "Google profile access and facts are being verified.",
      nextAction: googleAccess?.status === "done" ? "Keep profile facts current." : "Confirm Google profile access.",
    },
    {
      signal: "Website/profile match",
      status: statusFromChecklist(businessInfo?.status),
      score: pointsFromChecklist(businessInfo?.status),
      evidence: businessInfo?.detail ?? "Business facts are being compared against known website/profile data.",
      nextAction: "Keep website, phone, hours, and services aligned with the profile.",
    },
    {
      signal: "Service + location clarity",
      status: client.website && client.location && client.category ? "Fair" : "Weak",
      score: client.website && client.location && client.category ? 13 : 8,
      evidence: `${client.category || "Service category"} in ${client.location || "service area"} is the current baseline.`,
      nextAction: "Expand service/location proof when the baseline cleanup is complete.",
    },
    {
      signal: "Public proof freshness",
      status: weeklyReviews >= client.reviews.weeklyGoal ? "Strong" : weeklyReviews > 0 ? "Fair" : "Weak",
      score: weeklyReviews >= client.reviews.weeklyGoal ? 17 : weeklyReviews > 0 ? 12 : 7,
      evidence: `${weeklyReviews}/${client.reviews.weeklyGoal} weekly review goal; ${requestsSent} requests sent in the last 30 days.`,
      nextAction: "Keep sending review requests and capture fresh public proof.",
    },
    {
      signal: "AI/search readiness",
      status: client.aiVisibilityPreview.some((item) => item.value !== "Locked") ? "Fair" : "Weak",
      score: client.aiVisibilityPreview.some((item) => item.value !== "Locked") ? 12 : 7,
      evidence: "AI/search readiness is tracked through visibility reports and upgrade-ready checks.",
      nextAction: "Use the next visibility check to identify answer-ready content gaps.",
    },
  ];
  const currentScore = totalClientScore(signals);
  const baselineScore = Math.max(0, currentScore - (requestsSent > 0 || feedback > 0 ? 12 : 5));

  return {
    clientName: client.businessName,
    plan: client.plan,
    periodLabel: client.monthlyRecap.label || "Last 30 days",
    currentScore,
    baselineScore,
    movement: currentScore - baselineScore,
    statusSummary: client.statusSummary,
    nextClientAction: clientNeeds[0]?.detail ?? "Nothing needed from the client right now.",
    stats: [
      { label: "Requests sent", value: String(requestsSent), detail: "Review requests sent in the current report period." },
      { label: "Feedback captured", value: String(feedback), detail: "Customer feedback captured before or after review routing." },
      { label: "Held back", value: String(heldBack), detail: "Rows or events held for safety, suppression, bounce, or missing-data reasons." },
      { label: "Client actions", value: String(clientNeeds.length), detail: "Items still needed from the client." },
    ],
    signals,
    reports: [
      {
        id: "baseline",
        label: "Baseline",
        status: baselineScore > 0 ? "Ready" : "Building",
        detail: "Starting point for visibility, profile clarity, and review path.",
      },
      {
        id: "before-after",
        label: "Before/after proof",
        status: currentScore > baselineScore ? "Updated" : "Pending",
        detail: "Compares the starting point against what has changed.",
      },
      {
        id: "monthly-recap",
        label: "Monthly recap",
        status: requestsSent > 0 || feedback > 0 ? "Ready" : "Pending",
        detail: client.monthlyRecap.ownerNote,
      },
    ],
    competitorGap:
      client.aiVisibilityPreview.find((item) => item.label.toLowerCase().includes("competitor"))?.sub ??
      "Competitor movement is tracked in the next visibility check.",
    nextActions: [
      customerList?.status === "done" ? "Keep the customer/job list current." : "Upload recent completed jobs or customers.",
      reviewLink?.status === "done" ? "Use the saved review link for live requests." : "Confirm or capture the Google review link.",
      automation?.status === "done" ? "Monitor live activity and monthly proof." : "Finish automation setup and send one safe test request.",
    ],
  };
}

export function renderClientVisibilityReportMarkdown(
  report: ClientVisibilityReportArtifact,
  sectionId?: ClientReportSectionId | "full",
): string {
  if (sectionId && sectionId !== "full") {
    return renderClientReportSectionMarkdown(report, sectionId);
  }

  const lines = [
    `# ${report.clientName} Visibility Report`,
    "",
    `Plan: ${report.plan}`,
    `Period: ${report.periodLabel}`,
    `Score: ${report.currentScore}/100`,
    `Baseline: ${report.baselineScore}/100`,
    `Movement: +${report.movement}`,
    "",
    "## Current Status",
    report.statusSummary,
    "",
    "## Stats",
    ...report.stats.map((stat) => `- ${stat.label}: ${stat.value} (${stat.detail})`),
    "",
    "## Visibility Signals",
    "| Signal | Status | Score | Evidence | Next action |",
    "|---|---|---:|---|---|",
    ...report.signals.map((signal) =>
      `| ${signal.signal} | ${signal.status} | ${signal.score}/20 | ${signal.evidence} | ${signal.nextAction} |`,
    ),
    "",
    "## Reports",
    ...report.reports.map((item) => `- ${item.label}: ${item.status} - ${item.detail}`),
    "",
    "## Competitor Gap",
    report.competitorGap,
    "",
    "## Next Actions",
    ...report.nextActions.map((action) => `- ${action}`),
    "",
  ];

  return lines.join("\n");
}

export function getClientReportSectionFilename(sectionId?: ClientReportSectionId | "full"): string {
  if (sectionId === "baseline") return "baseline";
  if (sectionId === "before-after") return "before-after";
  if (sectionId === "monthly-recap") return "monthly-recap";
  return "visibility-report";
}

function renderClientReportSectionMarkdown(
  report: ClientVisibilityReportArtifact,
  sectionId: ClientReportSectionId,
): string {
  const selected = report.reports.find((item) => item.id === sectionId);
  if (!selected) return renderClientVisibilityReportMarkdown(report, "full");

  const lines = [
    `# ${report.clientName} ${selected.label}`,
    "",
    `Plan: ${report.plan}`,
    `Period: ${report.periodLabel}`,
    `Status: ${selected.status}`,
    `Score: ${report.currentScore}/100`,
    `Baseline: ${report.baselineScore}/100`,
    `Movement: +${report.movement}`,
    "",
    "## Summary",
    selected.detail,
    "",
  ];

  if (sectionId === "baseline") {
    lines.push(
      "## Baseline Signals",
      "| Signal | Status | Score | Evidence |",
      "|---|---|---:|---|",
      ...report.signals.map((signal) =>
        `| ${signal.signal} | ${signal.status} | ${signal.score}/20 | ${signal.evidence} |`,
      ),
      "",
    );
  }

  if (sectionId === "before-after") {
    lines.push(
      "## Movement",
      `Current score: ${report.currentScore}/100`,
      `Starting baseline: ${report.baselineScore}/100`,
      `Movement: +${report.movement}`,
      "",
      "## Changed Signals",
      ...report.signals.map((signal) => `- ${signal.signal}: ${signal.status} (${signal.nextAction})`),
      "",
    );
  }

  if (sectionId === "monthly-recap") {
    lines.push(
      "## Activity",
      ...report.stats.map((stat) => `- ${stat.label}: ${stat.value} (${stat.detail})`),
      "",
      "## Competitor Gap",
      report.competitorGap,
      "",
      "## Next Actions",
      ...report.nextActions.map((action) => `- ${action}`),
      "",
    );
  }

  return lines.join("\n");
}

function scoreProspectSignals(
  business: ScoredBusiness,
  competitor: ScoredBusiness | null,
): ProspectVisibilitySignal[] {
  const competitorPrefix = competitor ? `${competitor.name}` : "Visible competitors";
  const profilePoints = clampPoints(Math.round(business.scores.profileComplete / 5));
  const matchPoints = clampPoints((business.schema.hasNAP ? 10 : 0) + (business.schema.hasSameAs ? 10 : 0));
  const clarityPoints = clampPoints(
    (business.category ? 4 : 0) +
      (business.city ? 4 : 0) +
      (business.schema.hasLocalBusiness ? 6 : 0) +
      (business.schema.hasHours ? 3 : 0) +
      (business.schema.hasFAQ ? 3 : 0),
  );
  const proofPoints = clampPoints(Math.round(Math.min(business.reviewCount, 80) / 80 * 12 + Math.min(business.rating, 5) / 5 * 8));
  const readinessPoints = clampPoints(Math.round(business.scores.aiReadable / 5));

  return [
    {
      signal: "Google profile clarity",
      why: "Google needs complete business facts before it can confidently match you.",
      status: labelFromPoints(profilePoints),
      competitorClue: `${competitorPrefix} show clearer public business facts.`,
      unlock: "Profile cleanup",
      points: profilePoints,
    },
    {
      signal: "Website/profile match",
      why: "AI and Search trust you more when your site and Google profile agree.",
      status: labelFromPoints(matchPoints),
      competitorClue: `${competitorPrefix} are easier to verify across public pages.`,
      unlock: "Fact sync",
      points: matchPoints,
    },
    {
      signal: "Service + location clarity",
      why: "AI Mode handles specific local questions, so services and areas must be obvious.",
      status: labelFromPoints(clarityPoints),
      competitorClue: `${competitorPrefix} make services and locations clearer.`,
      unlock: "Baseline site fixes",
      points: clarityPoints,
    },
    {
      signal: "Public proof freshness",
      why: "Recent visible proof reduces buyer doubt.",
      status: labelFromPoints(proofPoints),
      competitorClue: `${competitorPrefix} look more active to new buyers.`,
      unlock: "First review path",
      points: proofPoints,
    },
    {
      signal: "AI/search readiness",
      why: "Google AI still depends on crawlable, useful, visible content.",
      status: labelFromPoints(readinessPoints),
      competitorClue: `${competitorPrefix} give AI clearer answer-ready content.`,
      unlock: "Before/after snapshot",
      points: readinessPoints,
    },
  ];
}

function findChecklist(client: ClientHubProfile, label: string) {
  return client.checklist.find((item) => item.label === label);
}

function pointsFromChecklist(status?: ClientHubStatus) {
  if (status === "done") return 18;
  if (status === "working") return 12;
  if (status === "needed") return 7;
  return 5;
}

function statusFromChecklist(status?: ClientHubStatus): StatusLabel {
  return labelFromPoints(pointsFromChecklist(status));
}

function totalScore(signals: ProspectVisibilitySignal[]) {
  return signals.reduce((sum, signal) => sum + signal.points, 0);
}

function totalClientScore(signals: ClientReportSignal[]) {
  return signals.reduce((sum, signal) => sum + signal.score, 0);
}

function labelFromPoints(points: number): StatusLabel {
  if (points >= 16) return "Strong";
  if (points >= 11) return "Fair";
  if (points >= 6) return "Weak";
  return "Missing";
}

function clampPoints(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(20, Math.max(0, Math.round(value)));
}
