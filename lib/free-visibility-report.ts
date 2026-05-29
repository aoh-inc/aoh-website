import { createAgentTask, logEmailEvent } from "@/lib/ops-store";
import { searchOutscraperBusinesses, type OutscraperBusiness } from "@/lib/outscraper";
import { sendGetMeFoundEmail } from "@/lib/getmefound-email";
import { envValueAny } from "@/lib/getmefound-env";
import { hasSupabaseConfig, supabaseRest } from "@/lib/supabase-rest";
import {
  logVisibilityReportEvent,
  updateVisibilityReport,
  updateVisibilityReportsByEmail,
} from "@/lib/visibility-reports";

const POSTAL_ADDRESS = "13727 SW 152nd St. #1236, Miami, FL 33177";
const DEFAULT_REPLY_TO = "casey@getmefound.ai";

export type FreeVisibilityReportJob = {
  runId: string;
  businessName: string;
  email: string;
  origin: string;
  submittedAt: string;
  ip?: string | null;
  emailVerification?: Record<string, unknown>;
};

export type FreeVisibilityEnrichment = {
  status: "complete" | "partial" | "skipped" | "failed";
  error?: string;
  prospect?: OutscraperBusiness;
  competitor?: OutscraperBusiness;
  omitted: string[];
  source: "outscraper" | "fallback";
};

export async function processFreeVisibilityReport(input: FreeVisibilityReportJob) {
  const startedAt = new Date().toISOString();
  await Promise.allSettled([
    updateVisibilityReport({
      runId: input.runId,
      reportStatus: "building",
      leadStatus: "free_check_processing",
      nextAction: "Automated Visibility Engine enrichment and report email are running. Target delivery is under five minutes.",
      blocker: "",
      metadata: {
        automation: "free_visibility_report",
        businessName: input.businessName,
        emailVerification: input.emailVerification ?? {},
        submittedAt: input.submittedAt,
        processingStartedAt: startedAt,
      },
    }),
    logVisibilityReportEvent({
      runId: input.runId,
      eventType: "automation_started",
      actorRole: "Automation",
      note: "Free visibility report automation started.",
      payload: { startedAt },
    }),
  ]);

  const suppressed = await isProspectSuppressed(input.email);
  if (suppressed) {
    await Promise.allSettled([
      updateVisibilityReport({
        runId: input.runId,
        reportStatus: "closed",
        leadStatus: "unsubscribed",
        nextAction: "Do not email. Prospect is suppressed.",
        blocker: "Prospect has an opt-out/suppression event.",
      }),
      logEmailEvent({
        provider: "resend",
        event_type: "free_visibility_report",
        to_email: input.email,
        status: "skipped",
        error: "suppressed",
        payload: { runId: input.runId },
      }),
    ]);
    return { ok: true as const, skipped: "suppressed" as const };
  }

  const enrichment = await enrichFreeVisibilityReport(input.businessName);
  await logVisibilityReportEvent({
    runId: input.runId,
    eventType: enrichment.status === "complete" || enrichment.status === "partial" ? "enrichment_succeeded" : "enrichment_fallback",
    actorRole: "Automation",
    note: enrichment.error ?? `Enrichment ${enrichment.status}.`,
    payload: enrichmentForStorage(enrichment),
  });

  const reportEmail = buildFreeVisibilityReportEmail({
    runId: input.runId,
    businessName: input.businessName,
    email: input.email,
    origin: input.origin,
    enrichment,
  });

  const sendResult = await sendWithRetry({
    to: input.email,
    subject: reportEmail.subject,
    text: reportEmail.text,
    replyTo: envValueAny("GMF_SALES_REPLY_TO_EMAIL", "RESEND_REPLY_TO_EMAIL") || DEFAULT_REPLY_TO,
  });

  if (!sendResult.ok) {
    await Promise.allSettled([
      updateVisibilityReport({
        runId: input.runId,
        reportStatus: "blocked",
        leadStatus: "report_email_failed",
        nextAction: "Systems Director investigates Resend/config failure and reruns the automated report send.",
        blocker: sendResult.error,
        metadata: {
          automation: "free_visibility_report",
          enrichment: enrichmentForStorage(enrichment),
          email: { subject: reportEmail.subject, status: "failed", error: sendResult.error },
          submittedAt: input.submittedAt,
          processingStartedAt: startedAt,
          processingFinishedAt: new Date().toISOString(),
        },
      }),
      logEmailEvent({
        provider: "resend",
        event_type: "free_visibility_report",
        to_email: input.email,
        subject: reportEmail.subject,
        status: "failed",
        error: sendResult.error,
        payload: { runId: input.runId, attempts: sendResult.attempts },
      }),
      createAgentTask({
        title: `Automated report email failed - ${input.businessName}`,
        kind: "visibility_report_delivery_failure",
        priority: "high",
        source: "website/free-visibility-report",
        payload: {
          runId: input.runId,
          businessName: input.businessName,
          email: input.email,
          error: sendResult.error,
          nextAction: "Systems Director checks Resend, Supabase, and retry path before asking Mike.",
        },
      }),
    ]);
    return { ok: false as const, error: sendResult.error };
  }

  const nextNurtureDueAt = addDaysIso(2);
  await Promise.allSettled([
    updateVisibilityReport({
      runId: input.runId,
      reportStatus: "sent",
      leadStatus: "report_sent_nurture_enrolled",
      nextAction: `Nurture agent sends Day 2 check-in if no purchase, reply, bounce, or opt-out by ${nextNurtureDueAt}.`,
      blocker: "",
      auditUrl: reportEmail.checkoutUrl,
      metadata: {
        automation: "free_visibility_report",
        businessName: input.businessName,
        emailVerification: input.emailVerification ?? {},
        enrichment: enrichmentForStorage(enrichment),
        email: {
          subject: reportEmail.subject,
          status: "sent",
          providerId: sendResult.id,
          checkoutUrl: reportEmail.checkoutUrl,
          clickUrl: reportEmail.clickUrl,
          unsubscribeUrl: reportEmail.unsubscribeUrl,
        },
        nurture: {
          enrolled: true,
          cadence: "post_report_engaged_non_buyer",
          currentStage: "report_sent_nurture_enrolled",
          nextStage: "follow_up_day_2",
          nextDueAt: nextNurtureDueAt,
          stopOn: ["purchase", "reply", "opt_out"],
        },
        submittedAt: input.submittedAt,
        processingStartedAt: startedAt,
        processingFinishedAt: new Date().toISOString(),
      },
    }),
    logEmailEvent({
      provider: "resend",
      event_type: "free_visibility_report",
      to_email: input.email,
      subject: reportEmail.subject,
      status: "sent",
      provider_id: sendResult.id,
      payload: { runId: input.runId, checkoutUrl: reportEmail.checkoutUrl, clickUrl: reportEmail.clickUrl },
    }),
    logVisibilityReportEvent({
      runId: input.runId,
      eventType: "nurture_enrolled",
      actorRole: "Automation",
      note: "Prospect enrolled in post-report nurture until purchase, reply, or opt-out.",
      payload: {
        cadence: "post_report_engaged_non_buyer",
        nextStage: "follow_up_day_2",
        nextDueAt: nextNurtureDueAt,
      },
    }),
  ]);

  return { ok: true as const, emailId: sendResult.id, enrichment };
}

export async function enrichFreeVisibilityReport(businessName: string): Promise<FreeVisibilityEnrichment> {
  const search = await searchOutscraperBusinesses({ query: businessName, limit: 3, timeoutMs: 12_000 });
  if (!search.ok) {
    return {
      status: search.missingKey ? "skipped" : "failed",
      error: search.error,
      omitted: ["review_count", "rating", "photos", "hours", "category", "competitor_review_count"],
      source: "fallback",
    };
  }

  const prospect = chooseBestBusinessMatch(businessName, search.businesses);
  if (!prospect) {
    return {
      status: "partial",
      error: "No confident Google profile match from public lookup.",
      omitted: ["review_count", "rating", "photos", "hours", "category", "competitor_review_count"],
      source: "outscraper",
    };
  }

  let competitor: OutscraperBusiness | undefined;
  if (prospect.primaryCategory && prospect.city) {
    const area = [prospect.city, prospect.state].filter(Boolean).join(", ");
    const competitorSearch = await searchOutscraperBusinesses({
      query: `${prospect.primaryCategory}, ${area || "near me"}`,
      limit: 6,
      timeoutMs: 10_000,
    });
    if (competitorSearch.ok) {
      competitor = competitorSearch.businesses
        .filter((candidate) => candidate.reviewCount != null)
        .filter((candidate) => nameSimilarity(candidate.name, prospect.name) < 0.72)
        .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))[0];
    }
  }

  const omitted = missingFields(prospect, competitor);
  return {
    status: omitted.length ? "partial" : "complete",
    prospect,
    competitor,
    omitted,
    source: "outscraper",
  };
}

export function buildFreeVisibilityReportEmail(input: {
  runId: string;
  businessName: string;
  email: string;
  origin: string;
  enrichment: FreeVisibilityEnrichment;
}) {
  const origin = input.origin.replace(/\/+$/, "") || "https://getmefound.ai";
  const checkoutUrl = `${origin}/checkout/get-found-refresh?runId=${encodeURIComponent(input.runId)}&source=free_visibility_report`;
  const clickUrl = `${origin}/api/report-click?runId=${encodeURIComponent(input.runId)}&target=get_found`;
  const unsubscribeUrl = `${origin}/unsubscribe?runId=${encodeURIComponent(input.runId)}&email=${encodeURIComponent(input.email)}`;
  const subject = `${input.businessName}: your Visibility Engine report`;
  const lines = buildReportLines(input.businessName, input.enrichment);

  const text = [
    `Hi,`,
    ``,
    `I ran ${input.businessName} through the Visibility Engine. It checks the public signals Google AI, ChatGPT, Claude, and Gemini use when deciding which local business looks safest to recommend.`,
    ``,
    `Here is what stood out:`,
    ``,
    ...lines.map((line) => `- ${line}`),
    ``,
    `Why this matters: AI search is starting to pick one or two local businesses instead of showing people a long list. Once a competitor becomes the cleanest, most complete answer, they are harder to displace. Getting picked is not one simple fix; it is dozens of trust signals working together.`,
    ``,
    `GetMeFound can set up your Visibility Engine for $149: Google profile facts, obvious visibility gaps, website trust signals, and the first review path. No contract. Done in 48 hours. Satisfaction guarantee.`,
    ``,
    `Get Found for $149 - your Visibility Engine setup, done in 48 hours: ${clickUrl}`,
    ``,
    `GetMeFound`,
    POSTAL_ADDRESS,
    `No more emails? Opt out here: ${unsubscribeUrl}`,
  ].join("\n");

  return { subject, text, checkoutUrl, clickUrl, unsubscribeUrl };
}

export async function recordFreeVisibilityClick(input: { runId: string; target: string }) {
  await logVisibilityReportEvent({
    runId: input.runId,
    eventType: "email_click",
    actorRole: "Prospect",
    note: `Clicked ${input.target}.`,
    payload: { target: input.target, clickedAt: new Date().toISOString() },
  });
}

export async function recordFreeVisibilityUnsubscribe(input: { runId?: string; email?: string }) {
  const runId = input.runId?.trim();
  const email = input.email?.trim().toLowerCase();
  const promises: Array<Promise<unknown>> = [
    logEmailEvent({
      provider: "website",
      event_type: "unsubscribe",
      to_email: email || "unknown",
      status: "sent",
      payload: { runId: runId || null, unsubscribedAt: new Date().toISOString() },
    }),
  ];

  if (runId) {
    promises.push(
      updateVisibilityReport({
        runId,
        reportStatus: "closed",
        leadStatus: "unsubscribed",
        nextAction: "Do not contact. Prospect opted out.",
        blocker: "",
      }),
      logVisibilityReportEvent({
        runId,
        eventType: "unsubscribed",
        actorRole: "Prospect",
        note: "Prospect clicked the opt-out link.",
        payload: { email: email || null },
      }),
    );
  } else if (email) {
    promises.push(
      updateVisibilityReportsByEmail({
        email,
        reportStatus: "closed",
        leadStatus: "unsubscribed",
        nextAction: "Do not contact. Prospect opted out.",
        blocker: "",
      }),
    );
  }

  await Promise.allSettled(promises);
}

export async function recordFreeVisibilityPurchase(input: {
  runId?: string | null;
  email?: string | null;
  productSlug: string;
  sessionId: string;
}) {
  const runId = input.runId?.trim();
  const email = input.email?.trim().toLowerCase();
  const leadStatus = input.productSlug === "get-found-refresh" ? "purchased_get_found" : "purchased";
  const promises: Array<Promise<unknown>> = [];

  if (runId) {
    promises.push(
      updateVisibilityReport({
        runId,
        reportStatus: "closed",
        leadStatus,
        nextAction: "Stop nurture, start paid onboarding, and trigger Stay Found upsell only after the 48-hour before/after proof is delivered.",
        blocker: "",
      }),
      logVisibilityReportEvent({
        runId,
        eventType: "purchase",
        actorRole: "Stripe",
        note: `Purchase completed for ${input.productSlug}.`,
        payload: {
          productSlug: input.productSlug,
          stripeSessionId: input.sessionId,
          email: email || null,
        },
      }),
    );
  } else if (email) {
    promises.push(
      updateVisibilityReportsByEmail({
        email,
        reportStatus: "closed",
        leadStatus,
        nextAction: "Stop nurture, start paid onboarding, and trigger Stay Found upsell only after the 48-hour before/after proof is delivered.",
        blocker: "",
      }),
    );
  }

  await Promise.allSettled(promises);
}

async function sendWithRetry(input: {
  to: string;
  subject: string;
  text: string;
  replyTo: string;
}): Promise<{ ok: true; id: string; attempts: number } | { ok: false; error: string; attempts: number }> {
  let lastError = "Unknown send failure.";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const result = await sendGetMeFoundEmail(input);
    if (result.ok) return { ok: true, id: result.id, attempts: attempt };
    lastError = result.error;
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 800 : 2_000));
  }
  return { ok: false, error: lastError, attempts: 3 };
}

async function isProspectSuppressed(email: string) {
  if (!hasSupabaseConfig()) return false;
  const query = new URLSearchParams({
    select: "id",
    to_email: `eq.${email.trim().toLowerCase()}`,
    event_type: "in.(unsubscribe,do_not_contact,hard_bounce,complaint)",
    limit: "1",
  });
  const result = await supabaseRest<Array<{ id: string }>>("email_events", { query: query.toString() });
  return result.ok && result.data.length > 0;
}

function chooseBestBusinessMatch(inputName: string, businesses: OutscraperBusiness[]) {
  const scored = businesses
    .map((business) => ({ business, score: nameSimilarity(inputName, business.name) }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) return null;
  if (best.score >= 0.55) return best.business;

  const inputNorm = normalizeName(inputName);
  const candidateNorm = normalizeName(best.business.name);
  if (inputNorm.length >= 8 && (candidateNorm.includes(inputNorm) || inputNorm.includes(candidateNorm))) {
    return best.business;
  }

  return null;
}

function nameSimilarity(a: string, b: string) {
  const aTokens = tokenSet(a);
  const bTokens = tokenSet(b);
  if (!aTokens.size || !bTokens.size) return 0;
  let intersection = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) intersection += 1;
  }
  return intersection / Math.max(aTokens.size, bTokens.size);
}

function tokenSet(value: string) {
  const ignored = new Set(["llc", "inc", "co", "company", "the", "and", "of", "at"]);
  return new Set(
    normalizeName(value)
      .split(" ")
      .filter((token) => token.length > 1 && !ignored.has(token)),
  );
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function missingFields(prospect: OutscraperBusiness, competitor?: OutscraperBusiness) {
  const omitted: string[] = [];
  if (prospect.reviewCount == null) omitted.push("review_count");
  if (prospect.rating == null) omitted.push("rating");
  if (prospect.photosCount == null) omitted.push("photos");
  if (prospect.hoursPresent == null) omitted.push("hours");
  if (!prospect.primaryCategory) omitted.push("category");
  if (competitor?.reviewCount == null) omitted.push("competitor_review_count");
  return omitted;
}

function buildReportLines(businessName: string, enrichment: FreeVisibilityEnrichment) {
  const prospect = enrichment.prospect;
  const competitor = enrichment.competitor;
  const lines: string[] = [];

  if (!prospect) {
    lines.push("I could not safely confirm a live Google Business Profile match from the public lookup, so I am not guessing at review counts or ratings.");
    lines.push("The first fix is making sure AI can connect the business name, category, hours, website, and review path without conflicting signals.");
    return lines;
  }

  if (prospect.reviewCount != null) {
    lines.push(`Review depth: ${formatNumber(prospect.reviewCount)} Google review${prospect.reviewCount === 1 ? "" : "s"} were visible in the public profile data.`);
  }
  if (prospect.rating != null) {
    lines.push(`Rating signal: ${prospect.rating.toFixed(1)} stars were visible in the public profile data.`);
  }
  if (prospect.primaryCategory) {
    lines.push(`Category signal: Google appears to classify the business as ${prospect.primaryCategory}.`);
  }
  if (prospect.photosCount != null) {
    lines.push(prospect.photosCount > 0 ? `Photo signal: ${formatNumber(prospect.photosCount)} public photo signal${prospect.photosCount === 1 ? "" : "s"} were found.` : "Photo signal: no public photo signal was confirmed.");
  }
  if (prospect.hoursPresent != null) {
    lines.push(prospect.hoursPresent ? "Hours signal: public hours were found." : "Hours signal: public hours were not confirmed in the lookup.");
  }
  if (competitor?.reviewCount != null && competitor.name) {
    lines.push(`Nearby comparison: ${competitor.name} shows ${formatNumber(competitor.reviewCount)} Google reviews in the same public data source.`);
  }

  if (!lines.length) {
    lines.push(`I found a likely Google profile for ${businessName}, but the public data was too thin to quote exact stats safely.`);
    lines.push("That thin-data signal is itself worth fixing because AI systems need clear, corroborated facts before they recommend a local business.");
  }

  return lines;
}

function enrichmentForStorage(enrichment: FreeVisibilityEnrichment) {
  return {
    status: enrichment.status,
    source: enrichment.source,
    error: enrichment.error ?? "",
    omitted: enrichment.omitted,
    prospect: enrichment.prospect ? compactBusiness(enrichment.prospect) : null,
    competitor: enrichment.competitor ? compactBusiness(enrichment.competitor) : null,
  };
}

function compactBusiness(business: OutscraperBusiness) {
  return {
    name: business.name,
    rating: business.rating,
    reviewCount: business.reviewCount,
    photosCount: business.photosCount,
    hoursPresent: business.hoursPresent,
    primaryCategory: business.primaryCategory,
    website: business.website,
    city: business.city,
    state: business.state,
    googleMapsUrl: business.googleMapsUrl,
    sourceQuery: business.sourceQuery,
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function addDaysIso(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}
