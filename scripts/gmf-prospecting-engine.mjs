#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

const DEFAULT_CONFIG_PATH = "config/gmf-prospecting.config.json";
const OUTSCRAPER_API_BASE = "https://api.outscraper.com";
const NEVERBOUNCE_API_BASE = "https://api.neverbounce.com";

main().catch((error) => {
  console.error(error instanceof Error ? sanitize(error.message) : error);
  process.exitCode = 1;
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const config = readJson(String(args.config ?? DEFAULT_CONFIG_PATH));
  const date = String(args.date ?? todayEastern());
  const outbox = String(config.reporting?.outbox ?? "docs/client-ops-ledger/outbox");
  mkdirSync(outbox, { recursive: true });

  const allowSpend = hasSpendApproval(args, config);
  const verifyEmails = Boolean(args.verify);
  const useFixture = Boolean(args.fixture);
  const rows = await sourceRows({ args, config, allowSpend, useFixture });
  const normalized = dedupeLeads(rows.map((row) => normalizeLead(row, config)));
  const withCompetitors = assignCompetitors(normalized);
  const verified = verifyEmails ? await verifyLeadEmails(withCompetitors, config) : withCompetitors;
  const warmup = readSmartleadWarmup(config);
  const capacity = computeSmartleadCapacity(warmup, config);
  const evaluated = verified.map((lead) => evaluateLead(lead, config));
  const sendable = assignSenders(evaluated.filter((lead) => lead.status === "ready"), capacity, config);
  const sequence = buildSequencePacket(config, capacity);
  const nurture = buildNurturePacket(config);
  const paths = writeOutputs({ date, outbox, config, rows: evaluated, sendable, sequence, nurture });
  const report = renderReport({ date, config, allowSpend, verifyEmails, useFixture, sourceCount: rows.length, evaluated, sendable, capacity, paths });

  writeText(config.reporting?.currentReport ?? "docs/client-ops-ledger/gmf-prospecting-engine-current.md", report);
  const datedReport = resolve(outbox, `gmf-prospecting-engine-${date}.md`);
  writeText(datedReport, report);

  console.log(JSON.stringify(
    {
      ok: true,
      mode: allowSpend ? "spend-enabled" : useFixture ? "fixture" : "plan-only",
      sourceRows: rows.length,
      evaluated: evaluated.length,
      readyToUpload: sendable.length,
      smartleadSendCapacity: capacity.totalDailyNewProspects,
      currentReport: resolve(config.reporting?.currentReport ?? "docs/client-ops-ledger/gmf-prospecting-engine-current.md"),
      datedReport,
      outputs: paths,
    },
    null,
    2,
  ));
}

async function sourceRows({ args, config, allowSpend, useFixture }) {
  const input = String(args.input ?? "").trim();
  if (input) return readCsv(input);
  if (useFixture) return fixtureRows(config);
  if (!allowSpend) return [];
  return scrapeOutscraperBaseMaps({ args, config });
}

async function scrapeOutscraperBaseMaps({ args, config }) {
  const apiKey = requiredEnv("OUTSCRAPER_API_KEY");
  const maxRecords = boundedNumber(args["max-records"], 1, 1000, config.outscraper?.maxRecordsPerRun ?? 120);
  const limitPerQuery = boundedNumber(args.limit, 1, 100, config.outscraper?.limitPerQuery ?? 20);
  const maxSpend = number(config.outscraper?.maxSpendPerRunUsd ?? 3);
  const costPerRecord = number(config.outscraper?.costPerThousandUsd ?? 3) / 1000;
  const queries = buildOutscraperQueries(config);
  const rows = [];

  for (const query of queries) {
    if (rows.length >= maxRecords) break;
    const remaining = maxRecords - rows.length;
    const limit = Math.min(limitPerQuery, remaining);
    const projectedSpend = (rows.length + limit) * costPerRecord;
    if (projectedSpend > maxSpend) break;

    const url = new URL("/google-maps-search", OUTSCRAPER_API_BASE);
    url.searchParams.set("query", query.query);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("async", "false");
    url.searchParams.set("dropDuplicates", "true");
    url.searchParams.set("region", "US");

    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey },
      signal: AbortSignal.timeout(boundedNumber(args.timeoutMs ?? args["timeout-ms"], 30_000, 240_000, 120_000)),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`Outscraper failed ${response.status}: ${text.slice(0, 300)}`);
    const body = parseJson(text);
    for (const row of flattenOutscraperData(body?.data)) {
      rows.push({
        ...row,
        source_query: query.query,
        source_geo: query.geo.label,
        source_geo_id: query.geo.id,
        source_tier: query.tier.tier,
        source_tier_label: query.tier.label,
        source_category: query.category,
      });
    }
  }

  return rows.slice(0, maxRecords);
}

function buildOutscraperQueries(config) {
  const queries = [];
  for (const geo of asArray(config.geos)) {
    for (const tier of asArray(config.targeting)) {
      for (const category of asArray(tier.categories)) {
        queries.push({
          query: `${category}, ${geo.query ?? geo.label}, USA`,
          geo,
          tier,
          category,
        });
      }
    }
  }
  return queries;
}

async function verifyLeadEmails(rows, config) {
  const apiKey = firstEnv(config.verification?.envKeys ?? ["NOBOUNCE_API_KEY", "NEVERBOUNCE_API_KEY"]);
  if (!apiKey) throw new Error("No email verification key found. Set NOBOUNCE_API_KEY or NEVERBOUNCE_API_KEY.");

  const verified = [];
  for (const row of rows) {
    if (!row.email || row.emailVerificationStatus) {
      verified.push(row);
      continue;
    }
    const result = await verifyWithNeverBounce(row.email, apiKey);
    verified.push({
      ...row,
      emailVerificationProvider: "neverbounce",
      emailVerificationStatus: result.status,
      emailVerificationFlags: result.flags.join(";"),
    });
  }
  return verified;
}

async function verifyWithNeverBounce(email, apiKey) {
  const url = new URL("/v4/single/check", NEVERBOUNCE_API_BASE);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("email", email);
  const response = await fetch(url, { method: "POST", signal: AbortSignal.timeout(30_000) });
  const text = await response.text();
  const body = parseJson(text) ?? {};
  if (!response.ok || body.status !== "success") {
    return { status: "api_error", flags: [text.slice(0, 100)] };
  }
  return {
    status: String(body.result ?? "unknown").toLowerCase(),
    flags: Array.isArray(body.flags) ? body.flags.map(String) : [],
  };
}

function normalizeLead(row, config) {
  const email = normalizeEmail(pick(row, ["email", "email_1", "emails", "business_email"]));
  const website = cleanUrl(pick(row, ["website", "site", "domain", "url"]));
  const category = pick(row, ["category", "categories", "type", "main_category", "source_category"]);
  const reviewCount = parseCount(pick(row, ["review_count", "reviews", "reviews_count", "gbp_review_count", "reviewCount"]));
  const photosCount = parseCount(pick(row, ["photos_count", "photo_count", "photos", "gbp_photos_count"]));
  const hours = pick(row, ["hours_present", "working_hours", "hours", "business_hours"]);
  const sourceTier = pick(row, ["source_tier"]) || tierForCategory(category, config);

  return {
    sourceQuery: pick(row, ["source_query", "query"]),
    sourceGeo: pick(row, ["source_geo", "geo", "market"]),
    sourceGeoId: pick(row, ["source_geo_id"]),
    sourceTier,
    sourceTierLabel: pick(row, ["source_tier_label"]) || labelForTier(sourceTier, config),
    sourceCategory: pick(row, ["source_category"]) || category,
    name: pick(row, ["name", "business_name", "company_name", "company", "title"]),
    email,
    phone: pick(row, ["phone", "phone_1", "phone_number"]),
    website,
    address: pick(row, ["address", "full_address", "formatted_address"]),
    city: pick(row, ["city", "locality", "borough"]),
    state: pick(row, ["state", "us_state", "region"]),
    country: pick(row, ["country", "country_code"]),
    category,
    rating: parseRating(pick(row, ["rating", "gbp_rating"])),
    reviewCount,
    photosCount,
    hoursPresent: normalizeHoursPresent(hours),
    latestReviewDate: pick(row, ["latest_review_date", "last_review_date", "gbp_last_review"]),
    businessStatus: pick(row, ["business_status", "status", "place_status"]),
    locationLink: pick(row, ["location_link", "place_link", "google_maps_url"]),
    competitorName: pick(row, ["competitor_name", "nearby_competitor_name"]),
    competitorReviewCount: parseCount(pick(row, ["competitor_review_count", "nearby_competitor_review_count"])),
    emailVerificationProvider: pick(row, ["email_verification_provider", "verification_provider"]),
    emailVerificationStatus: normalizeVerificationStatus(pick(row, ["email_verification_status", "verification_status", "neverbounce_status", "email_status"])),
    emailVerificationFlags: pick(row, ["email_verification_flags", "verification_flags"]),
  };
}

function assignCompetitors(rows) {
  const groups = new Map();
  for (const row of rows) {
    const keys = competitorKeys(row);
    for (const key of keys) {
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    }
  }

  return rows.map((row) => {
    if (Number.isFinite(row.competitorReviewCount) && row.competitorReviewCount > 0) return row;
    const competitor = competitorKeys(row)
      .flatMap((key) => groups.get(key) ?? [])
      .filter((candidate) => leadKey(candidate) !== leadKey(row))
      .filter((candidate) => Number.isFinite(candidate.reviewCount))
      .sort((a, b) => b.reviewCount - a.reviewCount)[0];

    if (!competitor) return row;
    return {
      ...row,
      competitorName: competitor.name,
      competitorReviewCount: competitor.reviewCount,
    };
  });
}

function competitorKeys(row) {
  const category = normalizeToken(row.sourceCategory || row.category);
  const city = normalizeToken(row.city);
  const state = normalizeToken(row.state);
  const geo = normalizeToken(row.sourceGeoId || row.sourceGeo);
  return [
    `${category}|${city}|${state}`,
    `${category}|${geo}`,
    `${category}|${state}`,
  ].filter((key) => !key.includes("||"));
}

function evaluateLead(lead, config) {
  const blockers = validateBaseLead(lead, config);
  const segment = blockers.length ? null : chooseWorstGap(lead, config);

  if (!segment) {
    if (!blockers.length) blockers.push("no_safe_single_worst_gap");
  } else {
    for (const field of segment.requiredFields) {
      if (fieldMissing(lead[field])) blockers.push(`missing_personalization_${field}`);
    }
  }

  const copy = segment ? buildLeadCopy({ lead, segment, config }) : null;
  if (copy) blockers.push(...validateCopy(copy, config));

  const status =
    blockers.length === 0
      ? "ready"
      : blockers.length === 1 && blockers[0] === "email_not_verified"
        ? "needs_verification"
        : "held";

  return {
    ...lead,
    status,
    blockers: blockers.join(";"),
    segment: segment?.id ?? "",
    singleGap: segment?.label ?? "",
    severity: segment?.severity ?? 0,
    observation: segment?.observation ?? "",
    whyLine: segment?.whyLine ?? "",
    email1SubjectA: copy?.subjects.step1[0] ?? "",
    email1SubjectB: copy?.subjects.step1[1] ?? "",
    email1SubjectC: copy?.subjects.step1[2] ?? "",
    email1Body: copy?.bodies.step1 ?? "",
    email2SubjectA: copy?.subjects.step2[0] ?? "",
    email2SubjectB: copy?.subjects.step2[1] ?? "",
    email2SubjectC: copy?.subjects.step2[2] ?? "",
    email2Body: copy?.bodies.step2 ?? "",
    email3SubjectA: copy?.subjects.step3[0] ?? "",
    email3SubjectB: copy?.subjects.step3[1] ?? "",
    email3SubjectC: copy?.subjects.step3[2] ?? "",
    email3Body: copy?.bodies.step3 ?? "",
    email4SubjectA: copy?.subjects.step4[0] ?? "",
    email4SubjectB: copy?.subjects.step4[1] ?? "",
    email4SubjectC: copy?.subjects.step4[2] ?? "",
    email4Body: copy?.bodies.step4 ?? "",
    ctaUrl: ctaUrl(config),
  };
}

function validateBaseLead(lead, config) {
  const blockers = [];
  const acceptedStatuses = new Set(asArray(config.verification?.acceptedStatuses).map(normalizeToken));
  const maxReviewCount = number(config.filters?.maxReviewCount ?? 25);

  if (!lead.name) blockers.push("missing_name");
  if (!lead.website && config.filters?.requireWebsite !== false) blockers.push("missing_website");
  if (!lead.email || !isEmail(lead.email)) blockers.push("missing_or_invalid_email");
  if (config.filters?.requireValidEmail !== false && !acceptedStatuses.has(normalizeToken(lead.emailVerificationStatus))) {
    blockers.push("email_not_verified");
  }
  if (!lead.category) blockers.push("missing_category");
  if (!Number.isFinite(lead.reviewCount)) blockers.push("missing_review_count");
  if (Number.isFinite(lead.reviewCount) && lead.reviewCount >= maxReviewCount) blockers.push("review_count_above_icp_threshold");
  if (isExcludedCategory(`${lead.name} ${lead.category}`, config)) blockers.push("excluded_category");
  if (isClosed(lead.businessStatus) && config.exclusions?.excludePermanentlyClosed !== false) blockers.push("closed_business");
  if (!allowedCountry(lead, config)) blockers.push("excluded_country_or_region");

  return blockers;
}

function chooseWorstGap(lead, config) {
  const candidates = [];
  const reviewCount = lead.reviewCount;
  const competitorCount = lead.competitorReviewCount;
  const minCompetitorGap = number(config.filters?.minCompetitorReviewGap ?? 25);
  const veryFewMax = number(config.filters?.veryFewReviewsMax ?? 9);
  const minPhotos = number(config.filters?.minPhotosBeforeGap ?? 8);

  if (Number.isFinite(competitorCount) && Number.isFinite(reviewCount) && competitorCount - reviewCount >= minCompetitorGap) {
    candidates.push({
      id: "behind_nearby_competitor",
      label: "behind a nearby competitor",
      severity: Math.min(1, (competitorCount - reviewCount) / 100) + 0.15,
      requiredFields: ["name", "category", "reviewCount", "competitorReviewCount"],
      observation: `${lead.name} shows ${reviewCount} Google reviews in the scraped profile data; a nearby competitor from the same market shows ${competitorCount}.`,
      whyLine: "When AI assistants compare local options, that review gap is an easy public signal for Google AI, ChatGPT, Claude, and Gemini to notice.",
    });
  }

  if (Number.isFinite(reviewCount) && reviewCount <= veryFewMax) {
    candidates.push({
      id: "very_few_reviews",
      label: "very few reviews",
      severity: Math.min(1, (veryFewMax + 1 - reviewCount) / (veryFewMax + 1)) + 0.1,
      requiredFields: ["name", "category", "reviewCount"],
      observation: `${lead.name} shows ${reviewCount} Google reviews in the scraped profile data.`,
      whyLine: "That is a thin trust signal when AI now picks one or two local businesses instead of showing every option equally.",
    });
  }

  const missingHours = lead.hoursPresent === false;
  const lowPhotos = Number.isFinite(lead.photosCount) && lead.photosCount <= minPhotos;
  if (missingHours || lowPhotos) {
    const parts = [];
    if (missingHours) parts.push("hours were not found");
    if (lowPhotos) parts.push(`${lead.photosCount} photos were found`);
    candidates.push({
      id: "missing_hours_photos",
      label: "missing hours/photos",
      severity: (missingHours ? 0.45 : 0) + (lowPhotos ? 0.35 : 0),
      requiredFields: lowPhotos ? ["name", "category", "photosCount"] : ["name", "category", "hoursPresent"],
      observation: `${lead.name}'s scraped Google profile data shows ${parts.join(" and ")}.`,
      whyLine: "Incomplete public profile signals make it harder for search and AI tools to confidently recommend a business.",
    });
  }

  if (Number.isFinite(reviewCount) && lead.website && lead.category) {
    candidates.push({
      id: "weak_ai_search_readiness",
      label: "weak AI/search readiness",
      severity: 0.25,
      requiredFields: ["name", "category", "reviewCount", "website"],
      observation: `${lead.name} has a website and Google profile, but only ${reviewCount} reviews are visible in the scraped data.`,
      whyLine: "Getting picked is not one simple fix; it is dozens of public signals that have to line up before Google AI, ChatGPT, Claude, or Gemini can trust the answer.",
    });
  }

  return candidates.sort((a, b) => b.severity - a.severity)[0] ?? null;
}

function buildLeadCopy({ lead, segment, config }) {
  const brand = config.brand ?? {};
  const cta = ctaUrl(config);
  const cityLine = lead.city ? ` in ${lead.city}` : "";
  const category = lead.category || "local business";
  const address = brand.physicalAddress;
  const signature = `${brand.fromName ?? "Casey"}\n${brand.company ?? "GetMeFound"}`;
  const footer = `\n\nIf this is not useful, reply "stop" and I will not follow up.\n${brand.company ?? "GetMeFound"} | ${address}`;
  const noContract = `No contract. ${brand.offer ?? "Get Found for $149"} is built to fix the foundation in 48 hours and includes our ${brand.guarantee ?? "satisfaction guarantee"}.`;

  return {
    subjects: {
      step1: [`Quick visibility note for ${lead.name}`, `${category}${cityLine}`, `Found a Google profile gap`],
      step2: [`Your nearby visibility gap`, `${lead.name} vs nearby options`, `Worth fixing before competitors do`],
      step3: [`AI is picking fewer local options`, `Google AI, ChatGPT, Claude, Gemini`, `The visibility window is early`],
      step4: [`Should I close the loop?`, `Last note on ${lead.name}`, `Useful or not right now?`],
    },
    bodies: {
      step1: `Hi ${lead.name} team,\n\n${segment.observation}\n\n${segment.whyLine}\n\nGetMeFound is The Visibility Engine. We engineer the profile, review, website, and AI-readiness signals that help a real local business get picked.\n\nWant the short version of what I would fix first?\n${cta}\n\n${noContract}\n\n${signature}${footer}`,
      step2: `Hi ${lead.name} team,\n\nOne reason I flagged this: local search is becoming a comparison game. ${competitorLine(lead)}\n\nThat does not mean the competitor is better. It means their public signals may be easier for Google and AI tools to trust right now.\n\nI can show the first few fixes here:\n${cta}\n\n${signature}${footer}`,
      step3: `Hi ${lead.name} team,\n\nThe shift I am watching: Google AI, ChatGPT, Claude, and Gemini increasingly answer with one or two local businesses instead of a long list.\n\nThe window closes once a nearby competitor locks in the obvious signals: reviews, categories, hours, photos, service pages, citations, and answer-ready language.\n\nThis is what The Visibility Engine is built for:\n${cta}\n\n${signature}${footer}`,
      step4: `Hi ${lead.name} team,\n\nI will close the loop after this.\n\nMy note was simple: ${segment.observation}\n\nIf visibility is already handled, no worries. If you want the quick report and the 48-hour Get Found path, it is here:\n${cta}\n\n${signature}${footer}`,
    },
  };
}

function competitorLine(lead) {
  if (Number.isFinite(lead.competitorReviewCount) && Number.isFinite(lead.reviewCount)) {
    const name = lead.competitorName ? `A nearby competitor (${lead.competitorName})` : "A nearby competitor";
    return `${name} shows ${lead.competitorReviewCount} reviews while ${lead.name} shows ${lead.reviewCount}.`;
  }
  return `${lead.name}'s public profile has fixable gaps that are visible before anyone buys from you.`;
}

function validateCopy(copy, config) {
  const blockers = [];
  const badClaims = /\btestimonial\b|\bcase stud(y|ies)\b|\bour customers\b|\bclients see\b|\bguaranteed ranking\b|\brank #?1\b/i;
  const address = String(config.brand?.physicalAddress ?? "");
  const ctaPath = String(config.brand?.ctaPath ?? "/lp/get-found");
  for (const [step, body] of Object.entries(copy.bodies)) {
    if (badClaims.test(body)) blockers.push(`${step}_contains_disallowed_claim`);
    if (!body.includes(address)) blockers.push(`${step}_missing_physical_address`);
    if (!/\breply\s+"?stop"?\b|\bopt[- ]?out\b|\bunsubscribe\b/i.test(body)) blockers.push(`${step}_missing_opt_out`);
    if (!body.includes(ctaPath)) blockers.push(`${step}_missing_cta_path`);
    if (countLinks(body) > 1) blockers.push(`${step}_too_many_links`);
    if (/\{\{[^}]+\}\}/.test(body)) blockers.push(`${step}_unresolved_merge_field`);
  }
  return blockers;
}

function buildSequencePacket(config, capacity) {
  const cta = ctaUrl(config);
  return {
    name: `GMF Visibility Engine Seed - ${config.launch?.targetDate ?? todayEastern()}`,
    ctaUrl: cta,
    brandVoice: config.brand?.voiceRules ?? [],
    smartleadSettings: {
      track_settings: [
        config.smartlead?.disableOpenTracking === false ? "" : "DONT_TRACK_EMAIL_OPEN",
        config.smartlead?.disableClickTracking === false ? "" : "DONT_TRACK_LINK_CLICK",
      ].filter(Boolean),
      stop_lead_settings: "REPLY_TO_AN_EMAIL",
      send_as_plain_text: true,
      force_plain_text: true,
      add_unsubscribe_tag: true,
      max_new_leads_per_day: capacity.totalDailyNewProspects,
      ignore_global_block_list: false,
      ignore_unsubscribe_list: false,
      ignore_duplicate_leads_in_other_campaign: false,
      ignore_community_bounce_list: false,
    },
    steps: [
      {
        step: 1,
        dayOffset: 0,
        purpose: "Observation",
        subjectVariants: ["Quick visibility note for {{company_name}}", "{{category}} visibility in {{city}}", "Found a Google profile gap"],
        bodyTemplate: "Lead with {{observation}}, explain why it matters, one CTA to the Visibility Engine report.",
      },
      {
        step: 2,
        dayOffset: 2,
        purpose: "Competitor comparison",
        subjectVariants: ["Your nearby visibility gap", "{{company_name}} vs nearby options", "Worth fixing before competitors do"],
        bodyTemplate: "Use competitor count only when present; otherwise suppress or use the lead-level generated safe body.",
      },
      {
        step: 3,
        dayOffset: 5,
        purpose: "AI-search angle",
        subjectVariants: ["AI is picking fewer local options", "Google AI, ChatGPT, Claude, Gemini", "The visibility window is early"],
        bodyTemplate: "Explain first-mover urgency and signal engineering without ranking guarantees.",
      },
      {
        step: 4,
        dayOffset: 9,
        purpose: "Breakup",
        subjectVariants: ["Should I close the loop?", "Last note on {{company_name}}", "Useful or not right now?"],
        bodyTemplate: "Short close-the-loop note. Stop on reply, opt-out, form fill, purchase, hard bounce, or complaint.",
      },
    ],
  };
}

function buildNurturePacket(config) {
  const cta = ctaUrl(config);
  const brand = config.brand ?? {};
  return {
    name: "GMF post-report nurture and upsell",
    stopOn: config.nurture?.stopOn ?? ["purchase", "reply", "opt_out", "hard_bounce", "complaint", "no_fit"],
    postFormFill: [
      {
        dayOffset: 0,
        owner: "Sales Rep / Reporter",
        purpose: "Deliver report fast",
        ctaUrl: cta,
        note: "Automated visibility report goes out under 5 minutes when enrichment succeeds; safe fallback copy is allowed if enrichment is slow.",
      },
      {
        dayOffset: 2,
        owner: "Sales Rep",
        purpose: "Authority and specificity",
        note: "Reference Google guidance and the exact safe observations from the report. No testimonials.",
      },
      {
        dayOffset: 5,
        owner: "Sales Rep",
        purpose: "Objection handling",
        note: "Address email safety, access ownership, no contract, and 48-hour foundation fix.",
      },
      {
        dayOffset: 9,
        owner: "Sales Rep",
        purpose: "Urgency",
        note: `${brand.positioning ?? "The Visibility Engine"} angle: AI picks fewer local answers and competitors can lock signals early.`,
      },
    ],
    postPurchaseUpsell: {
      trigger: config.nurture?.upsellAfterGetFound?.trigger ?? "after_48h_before_after_delivered",
      offer: config.nurture?.upsellAfterGetFound?.offer ?? "Stay Found $99/mo",
      note: "Pitch after the Get Found before/after proof is delivered, not before the foundation work is proven.",
    },
  };
}

function readSmartleadWarmup(config) {
  const path = String(config.smartlead?.warmupSnapshot ?? "docs/client-ops-ledger/smartlead-warmup-current.csv");
  return readCsvIfExists(path);
}

function computeSmartleadCapacity(rows, config) {
  const forbiddenDomains = new Set(asArray(config.smartlead?.forbiddenSenderDomains).map((item) => String(item).toLowerCase()));
  const minReputation = number(config.smartlead?.minReputation ?? 95);
  const minWarmupSent = number(config.smartlead?.minWarmupSent ?? 10);
  const maxSpam = number(config.smartlead?.maxSpamCount ?? 0);
  const earlyCap = number(config.smartlead?.earlyLaunchMaxNewProspectsPerDay ?? 30);
  const requireStatus = normalizeToken(config.smartlead?.requireWarmupStatus ?? "ACTIVE");
  const ready = [];
  const held = [];

  for (const row of rows) {
    const email = normalizeEmail(row.email);
    const domain = email.split("@")[1] ?? "";
    const blockers = [];
    if (!email) blockers.push("missing_email");
    if (forbiddenDomains.has(domain)) blockers.push("brand_domain_forbidden");
    if (normalizeYes(row.smtp_ok) !== true) blockers.push("smtp_not_ok");
    if (normalizeYes(row.imap_ok) !== true) blockers.push("imap_not_ok");
    if (normalizeYes(row.suspended) === true) blockers.push("suspended");
    if (normalizeToken(row.warmup_status) !== requireStatus) blockers.push("warmup_not_active");
    if (number(row.warmup_reputation) < minReputation) blockers.push("reputation_below_min");
    if (number(row.warmup_sent_count) < minWarmupSent) blockers.push("warmup_sent_below_min");
    if (number(row.warmup_spam_count) > maxSpam) blockers.push("spam_above_max");

    const accountMax = Math.max(0, number(row.max_email_per_day) - number(row.daily_sent_count));
    const warmupMax = number(row.warmup_max_count);
    const dailyCapacity = Math.max(0, Math.min(accountMax || warmupMax || 0, warmupMax || accountMax || 0));
    const item = { email, domain, dailyCapacity, blockers };
    if (blockers.length || dailyCapacity <= 0) {
      held.push({ ...item, blockers: blockers.length ? blockers : ["no_daily_capacity"] });
    } else {
      ready.push(item);
    }
  }

  const rawTotal = ready.reduce((sum, row) => sum + row.dailyCapacity, 0);
  return {
    ready,
    held,
    rawDailyCapacity: rawTotal,
    totalDailyNewProspects: Math.min(rawTotal, earlyCap),
    earlyLaunchCap: earlyCap,
  };
}

function assignSenders(rows, capacity, config) {
  if (!capacity.ready.length || capacity.totalDailyNewProspects <= 0) return [];
  const remainingByEmail = new Map(capacity.ready.map((sender) => [sender.email, sender.dailyCapacity]));
  const assigned = [];
  const sorted = [...rows].sort((a, b) => b.severity - a.severity);
  let senderIndex = 0;

  for (const row of sorted) {
    if (assigned.length >= capacity.totalDailyNewProspects) break;
    let selected = null;
    for (let attempt = 0; attempt < capacity.ready.length; attempt++) {
      const sender = capacity.ready[senderIndex % capacity.ready.length];
      senderIndex++;
      if ((remainingByEmail.get(sender.email) ?? 0) > 0) {
        selected = sender;
        break;
      }
    }
    if (!selected) break;
    remainingByEmail.set(selected.email, (remainingByEmail.get(selected.email) ?? 0) - 1);
    assigned.push({
      ...row,
      assignedSender: selected.email,
      assignedSenderDomain: selected.domain,
      launchSendWindow: `${config.launch?.preferredSendWindow?.start ?? "10:00"}-${config.launch?.preferredSendWindow?.end ?? "12:00"} ${config.launch?.timeZone ?? "America/New_York"}`,
    });
  }

  return assigned;
}

function writeOutputs({ date, outbox, config, rows, sendable, sequence, nurture }) {
  const candidateCsv = `tmp-gmf-prospecting-candidates-${date}.csv`;
  const readyCsv = `tmp-gmf-prospecting-smartlead-ready-${date}.csv`;
  const heldCsv = `tmp-gmf-prospecting-held-${date}.csv`;
  const sequencePath = resolve(outbox, `gmf-prospecting-sequence-${date}.json`);
  const nurturePath = resolve(outbox, `gmf-prospecting-nurture-${date}.json`);
  const metricsPath = resolve(outbox, `gmf-prospecting-metrics-template-${date}.csv`);

  writeCsv(candidateCsv, rows.map(exportCandidateRow));
  writeCsv(readyCsv, sendable.map(exportReadyRow));
  writeCsv(heldCsv, rows.filter((row) => row.status !== "ready").map(exportCandidateRow));
  writeText(sequencePath, `${JSON.stringify(sequence, null, 2)}\n`);
  writeText(nurturePath, `${JSON.stringify(nurture, null, 2)}\n`);
  writeCsv(metricsPath, metricsTemplateRows(config));

  return {
    candidateCsv: resolve(candidateCsv),
    readyCsv: resolve(readyCsv),
    heldCsv: resolve(heldCsv),
    sequenceJson: sequencePath,
    nurtureJson: nurturePath,
    metricsTemplateCsv: metricsPath,
  };
}

function exportCandidateRow(row) {
  return {
    status: row.status,
    blockers: row.blockers,
    source_tier: row.sourceTier,
    source_tier_label: row.sourceTierLabel,
    source_category: row.sourceCategory,
    source_geo: row.sourceGeo,
    source_query: row.sourceQuery,
    name: row.name,
    email: row.email,
    phone: row.phone,
    website: row.website,
    address: row.address,
    city: row.city,
    state: row.state,
    category: row.category,
    rating: numberOrBlank(row.rating),
    review_count: numberOrBlank(row.reviewCount),
    photos_count: numberOrBlank(row.photosCount),
    hours_present: boolOrBlank(row.hoursPresent),
    latest_review_date: row.latestReviewDate,
    business_status: row.businessStatus,
    competitor_name: row.competitorName,
    competitor_review_count: numberOrBlank(row.competitorReviewCount),
    email_verification_status: row.emailVerificationStatus,
    segment: row.segment,
    single_gap: row.singleGap,
    observation: row.observation,
    why_line: row.whyLine,
    cta_url: row.ctaUrl,
  };
}

function exportReadyRow(row) {
  return {
    email: row.email,
    company_name: row.name,
    phone_number: row.phone,
    website: row.website,
    location: [row.city, row.state].filter(Boolean).join(", "),
    city: row.city,
    state: row.state,
    category: row.category,
    review_count: numberOrBlank(row.reviewCount),
    rating: numberOrBlank(row.rating),
    photos_count: numberOrBlank(row.photosCount),
    hours_present: boolOrBlank(row.hoursPresent),
    competitor_name: row.competitorName,
    competitor_review_count: numberOrBlank(row.competitorReviewCount),
    niche_tier: row.sourceTier,
    segment: row.segment,
    single_gap: row.singleGap,
    observation: row.observation,
    why_line: row.whyLine,
    cta_url: row.ctaUrl,
    assigned_sender: row.assignedSender,
    assigned_sender_domain: row.assignedSenderDomain,
    send_window: row.launchSendWindow,
    email1_subject_a: row.email1SubjectA,
    email1_subject_b: row.email1SubjectB,
    email1_subject_c: row.email1SubjectC,
    email1_body: row.email1Body,
    email2_subject_a: row.email2SubjectA,
    email2_subject_b: row.email2SubjectB,
    email2_subject_c: row.email2SubjectC,
    email2_body: row.email2Body,
    email3_subject_a: row.email3SubjectA,
    email3_subject_b: row.email3SubjectB,
    email3_subject_c: row.email3SubjectC,
    email3_body: row.email3Body,
    email4_subject_a: row.email4SubjectA,
    email4_subject_b: row.email4SubjectB,
    email4_subject_c: row.email4SubjectC,
    email4_body: row.email4Body,
  };
}

function metricsTemplateRows(config) {
  const rows = [];
  for (const tier of asArray(config.targeting)) {
    for (const category of asArray(tier.categories)) {
      for (const segment of ["very_few_reviews", "behind_nearby_competitor", "missing_hours_photos", "weak_ai_search_readiness"]) {
        rows.push({
          date: todayEastern(),
          tier: tier.tier,
          category,
          segment,
          subdomain: "",
          sends: 0,
          clicks: 0,
          replies: 0,
          form_fills: 0,
          purchases: 0,
          bounces: 0,
          spam_complaints: 0,
          opt_outs: 0,
          auto_pause_status: "not_started",
          notes: "",
        });
      }
    }
  }
  return rows;
}

function renderReport({ date, config, allowSpend, verifyEmails, useFixture, sourceCount, evaluated, sendable, capacity, paths }) {
  const counts = countBy(evaluated, "status");
  const bySegment = countBy(evaluated.filter((row) => row.status === "ready"), "segment");
  const byTier = countBy(evaluated.filter((row) => row.status === "ready"), "sourceTierLabel");
  const byDomain = countBy(sendable, "assignedSenderDomain");
  const heldReasons = topBlockers(evaluated);
  const estimatedQueries = buildOutscraperQueries(config).length;
  const estimatedRecords = Math.min(number(config.outscraper?.maxRecordsPerRun ?? 120), estimatedQueries * number(config.outscraper?.limitPerQuery ?? 20));
  const estimatedSpend = estimatedRecords * (number(config.outscraper?.costPerThousandUsd ?? 3) / 1000);

  return `# GMF Prospecting Engine

Date: ${date}
Owner: Manager / Elon
Mode: ${allowSpend ? "spend-enabled" : useFixture ? "fixture dry run" : "plan-only"}
Live sends: no

## Exists Vs Missing

Exists in repo: Outscraper base-map discovery, NeverBounce verification, Smartlead warmup/readiness checks, a hardcoded seed campaign script, deliverability audit, reply-router API, free visibility report automation, and SOP guardrails.

Built by this run: GMF-specific config, target niches/geos, single worst-gap segmentation, no-blank personalization suppression, 4-step copy packet, Smartlead-ready CSV, nurture packet, sender-capacity read from warmup data, and reporting templates.

Related event route: \`/api/prospecting/events\` handles SmartLead/prospecting replies, opt-outs, bounces, complaints, form fills, and purchases behind a token.

Still not live-send complete: Smartlead draft setup should remain paused until \`npm run gmf:smartlead-draft\`, suppression proof, and deliverability audit are reviewed by Auditor and Mike approves the exact send.

## Source And Cost Guard

- Config: \`${DEFAULT_CONFIG_PATH}\`
- CTA path: \`${config.brand?.ctaPath ?? "/lp/get-found"}\`
- Full CTA URL: ${ctaUrl(config)}
- Sales Manager first validation: ${config.salesManager?.validationStrategy?.firstNiche ?? "configured ICP"} in ${(config.salesManager?.validationStrategy?.firstGeoIds ?? []).join(", ") || "configured launch geos"}
- Outscraper mode: base Google Maps scrape only
- Bulk reviews scraper: blocked for full-list use
- Estimated plan queries: ${estimatedQueries}
- Estimated max records this run: ${estimatedRecords}
- Estimated max Outscraper spend: $${estimatedSpend.toFixed(2)}
- Spend enabled this run: ${allowSpend ? "yes" : "no"}
- Email verification requested this run: ${verifyEmails ? "yes" : "no"}

## Results

| Item | Count |
|---|---:|
| Source rows read | ${sourceCount} |
| Leads evaluated | ${evaluated.length} |
| Ready for Smartlead upload | ${sendable.length} |
| Needs verification | ${counts.needs_verification ?? 0} |
| Held/suppressed | ${counts.held ?? 0} |

## Smartlead Capacity

| Item | Count |
|---|---:|
| Ready senders | ${capacity.ready.length} |
| Held senders | ${capacity.held.length} |
| Raw daily mailbox capacity | ${capacity.rawDailyCapacity} |
| Early launch cap | ${capacity.earlyLaunchCap} |
| Allowed new prospects/day | ${capacity.totalDailyNewProspects} |

Ready senders:
${capacity.ready.map((sender) => `- ${sender.email}: ${sender.dailyCapacity}/day`).join("\n") || "- None"}

Held senders:
${capacity.held.map((sender) => `- ${sender.email || "unknown"}: ${sender.blockers.join("; ")}`).join("\n") || "- None"}

## Ready Breakdown

By niche tier:
${renderCounts(byTier)}

By segment:
${renderCounts(bySegment)}

By assigned sender domain:
${renderCounts(byDomain)}

## Top Held Reasons

${heldReasons.map((item) => `- ${item.reason}: ${item.count}`).join("\n") || "- None"}

## Outputs

- Candidate CSV: \`${paths.candidateCsv}\`
- Smartlead-ready CSV: \`${paths.readyCsv}\`
- Held CSV: \`${paths.heldCsv}\`
- Sequence packet: \`${paths.sequenceJson}\`
- Nurture packet: \`${paths.nurtureJson}\`
- Metrics template: \`${paths.metricsTemplateCsv}\`

## Guardrails Confirmed

- No live prospect send ran.
- No Smartlead campaign was created, changed, activated, or uploaded.
- LinkedIn outbound is excluded for this ICP.
- No HighLevel AI feature was enabled.
- No per-review Outscraper scraper ran across the full list.
- Records missing safe personalization are held before send.
- Cold emails use outreach domains only; \`getmefound.ai\` is blocked for cold prospecting senders.
- Every generated body has one CTA link, clear opt-out language, and the physical mailing address.
- Volume must stay below 48-hour Get Found fulfillment capacity before scale.

## Credentials/APIs Needed

- Outscraper: \`OUTSCRAPER_API_KEY\` for paid base Google Maps scrape only.
- NoBounce/NeverBounce: \`NOBOUNCE_API_KEY\` or existing \`NEVERBOUNCE_API_KEY\` for email verification.
- SmartLead: \`SMARTLEAD_API_KEY\` for read-only warmup/capacity checks and, after approval, campaign draft/upload.

## Next Agent Actions

1. Sales Manager confirms this batch matches the acquisition playbook: pet-care-first validation, channel fit, and capacity gate.
2. Scout runs this engine with \`--allow-spend --verify\` only after the spend gate is approved or already documented.
3. Sender runs \`npm run gmf:smartlead-draft -- --csv ${basename(paths.readyCsv)}\` to build the paused Smartlead draft packet.
4. Reporter runs \`npm run gmf:guardrails\` after metrics exist.
5. Auditor reviews sequence, footer, one-link rule, suppression, sender capacity, deliverability audit, and fulfillment-capacity risk.
6. Manager asks Mike by Slack DM for final live-send approval only after the approval packet is complete.
`;
}

function renderCounts(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries.map(([key, value]) => `- ${key || "unknown"}: ${value}`).join("\n") : "- None";
}

function topBlockers(rows) {
  const counts = new Map();
  for (const row of rows) {
    if (!row.blockers) continue;
    for (const reason of row.blockers.split(";").map((item) => item.trim()).filter(Boolean)) {
      counts.set(reason, (counts.get(reason) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function fixtureRows(config) {
  return [
    {
      source_query: "dog grooming, New Haven County CT, USA",
      source_geo: "CT shoreline / Greater New Haven",
      source_geo_id: "ct-shoreline-new-haven",
      source_tier: "tier_1",
      source_tier_label: "Pet care",
      source_category: "dog grooming",
      name: "Shoreline Pup Grooming",
      email: "hello@shorelinepup.example",
      website: "https://shorelinepup.example",
      address: "100 Main St, Madison, CT",
      city: "Madison",
      state: "CT",
      country: "US",
      category: "Dog groomer",
      rating: "4.7",
      review_count: "4",
      photos_count: "5",
      hours_present: "yes",
      business_status: "OPERATIONAL",
      email_verification_status: "valid",
    },
    {
      source_query: "dog grooming, New Haven County CT, USA",
      source_geo: "CT shoreline / Greater New Haven",
      source_geo_id: "ct-shoreline-new-haven",
      source_tier: "tier_1",
      source_tier_label: "Pet care",
      source_category: "dog grooming",
      name: "Elm City Dog Spa",
      email: "info@elmcitydogspa.example",
      website: "https://elmcitydogspa.example",
      address: "25 Chapel St, New Haven, CT",
      city: "Madison",
      state: "CT",
      country: "US",
      category: "Dog groomer",
      rating: "4.9",
      review_count: "88",
      photos_count: "30",
      hours_present: "yes",
      business_status: "OPERATIONAL",
      email_verification_status: "valid",
    },
    {
      source_query: "pilates studio, Fairfield County CT, USA",
      source_geo: "Fairfield County CT",
      source_geo_id: "ct-fairfield-county",
      source_tier: "tier_2",
      source_tier_label: "Specialty fitness and wellness studios",
      source_category: "pilates studio",
      name: "Core Harbor Pilates",
      email: "studio@coreharbor.example",
      website: "https://coreharbor.example",
      address: "44 Harbor Rd, Fairfield, CT",
      city: "Fairfield",
      state: "CT",
      country: "US",
      category: "Pilates studio",
      rating: "4.6",
      review_count: "18",
      photos_count: "2",
      hours_present: "no",
      business_status: "OPERATIONAL",
      email_verification_status: "valid",
    },
    {
      source_query: "lash studio, Hartford County CT, USA",
      source_geo: "Greater Hartford / central CT",
      source_geo_id: "ct-greater-hartford",
      source_tier: "tier_3",
      source_tier_label: "Beauty and personal care",
      source_category: "lash studio",
      name: "Lash Loft Hartford",
      email: "contact@lashlofthartford.example",
      website: "https://lashlofthartford.example",
      address: "77 Center St, Hartford, CT",
      city: "Hartford",
      state: "CT",
      country: "US",
      category: "Lash studio",
      rating: "4.8",
      review_count: "22",
      photos_count: "14",
      hours_present: "yes",
      business_status: "OPERATIONAL",
      email_verification_status: "valid",
    },
  ].filter((row) => row.name !== "Elm City Dog Spa" || config);
}

function dedupeLeads(rows) {
  const byKey = new Map();
  for (const row of rows) {
    const key = leadKey(row);
    if (!key) continue;
    const current = byKey.get(key);
    if (!current || (row.emailVerificationStatus === "valid" && current.emailVerificationStatus !== "valid")) {
      byKey.set(key, row);
    }
  }
  return [...byKey.values()];
}

function leadKey(row) {
  if (row.email) return `email:${row.email}`;
  if (row.website) return `site:${rootDomainFromUrl(row.website)}`;
  return `${normalizeToken(row.name)}|${normalizeToken(row.city)}|${normalizeToken(row.state)}`;
}

function isExcludedCategory(value, config) {
  const text = String(value ?? "").toLowerCase();
  return asArray(config.exclusions?.categoryTerms).some((term) => text.includes(String(term).toLowerCase()));
}

function isClosed(value) {
  return /permanent.*closed|closed_permanently|closed permanently/i.test(String(value ?? ""));
}

function allowedCountry(lead, config) {
  const allowed = new Set(asArray(config.exclusions?.allowedCountries).map((item) => String(item).toUpperCase()));
  const country = String(lead.country ?? "").trim().toUpperCase();
  if (country && allowed.size && !allowed.has(country) && country !== "USA" && country !== "UNITED STATES") return false;
  if (config.exclusions?.excludeCanada && /\b(canada| ontario| quebec| bc\b| british columbia)\b/i.test(`${lead.address} ${lead.country}`)) return false;
  return true;
}

function tierForCategory(category, config) {
  const categoryText = normalizeToken(category);
  for (const tier of asArray(config.targeting)) {
    if (asArray(tier.categories).some((item) => categoryText.includes(normalizeToken(item)))) return tier.tier;
  }
  return "";
}

function labelForTier(tier, config) {
  return asArray(config.targeting).find((item) => item.tier === tier)?.label ?? "";
}

function ctaUrl(config) {
  const base = String(config.brand?.baseUrl ?? "https://getmefound.ai").replace(/\/+$/, "");
  const path = String(config.brand?.ctaPath ?? "/lp/get-found");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function readJson(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) throw new Error(`JSON not found: ${absolute}`);
  return JSON.parse(readFileSync(absolute, "utf8"));
}

function readCsv(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) throw new Error(`CSV not found: ${absolute}`);
  return parseCsv(readFileSync(absolute, "utf8"));
}

function readCsvIfExists(path) {
  if (!existsSync(resolve(path))) return [];
  return readCsv(path);
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < raw.length; index++) {
    const char = raw[index];
    const next = raw[index + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      index++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift()?.map((header) => header.trim()) ?? [];
  return rows
    .filter((values) => values.some((value) => String(value).trim()))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function writeCsv(path, rows) {
  ensureDir(dirname(resolve(path)));
  if (!rows.length) {
    writeFileSync(path, "");
    return;
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  }
  writeFileSync(path, `${lines.join("\n")}\n`);
}

function writeText(path, text) {
  ensureDir(dirname(resolve(path)));
  writeFileSync(path, text);
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function pick(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (Array.isArray(value)) {
      const item = value.find((entry) => String(entry ?? "").trim());
      if (item != null) return String(item).trim();
    }
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function cleanUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  try {
    return new URL(text).toString();
  } catch {
    try {
      return new URL(`https://${text}`).toString();
    } catch {
      return "";
    }
  }
}

function parseCount(value) {
  const text = String(value ?? "").replace(/[^\d.]/g, "");
  if (!text) return NaN;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function parseRating(value) {
  const text = String(value ?? "").replace(/[^\d.]/g, "");
  if (!text) return NaN;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function normalizeHoursPresent(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return "";
  if (["yes", "true", "1", "present", "open"].includes(text)) return true;
  if (["no", "false", "0", "missing", "none"].includes(text)) return false;
  if (/monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}:\d{2}|open/i.test(text)) return true;
  return "";
}

function normalizeVerificationStatus(value) {
  const text = normalizeToken(value);
  if (!text) return "";
  if (["deliverable", "valid_email"].includes(text)) return "valid";
  if (["undeliverable", "invalid_email"].includes(text)) return "invalid";
  return text;
}

function normalizeEmail(value) {
  const text = String(value ?? "").trim().toLowerCase();
  const match = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return match ? match[0].toLowerCase() : "";
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ""));
}

function fieldMissing(value) {
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return !Number.isFinite(value);
  return !String(value ?? "").trim();
}

function countLinks(value) {
  return [...String(value ?? "").matchAll(/https?:\/\/[^\s<>"')]+/g)].length;
}

function normalizeToken(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function rootDomainFromUrl(value) {
  try {
    const host = new URL(cleanUrl(value)).hostname.toLowerCase().replace(/^www\./, "");
    const parts = host.split(".").filter(Boolean);
    return parts.length >= 2 ? parts.slice(-2).join(".") : host;
  } catch {
    return "";
  }
}

function normalizeYes(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (["yes", "true", "1", "active"].includes(text)) return true;
  if (["no", "false", "0"].includes(text)) return false;
  return "";
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function boundedNumber(value, min, max, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function numberOrBlank(value) {
  return Number.isFinite(value) ? value : "";
}

function boolOrBlank(value) {
  return typeof value === "boolean" ? (value ? "yes" : "no") : "";
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = String(row[key] ?? "");
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function csvEscape(value) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function flattenOutscraperData(data) {
  if (!Array.isArray(data)) return [];
  if (data.every((item) => Array.isArray(item))) return data.flat();
  return data;
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function firstEnv(names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not set.`);
  return value;
}

function hasSpendApproval(args, config) {
  if (args["allow-spend"] || args.allowSpend) return true;
  if (config.outscraper?.requireSpendApproval === false) return true;
  return /^(1|true|yes|approved)$/i.test(String(process.env.GMF_OUTSCRAPER_ALLOW_SPEND ?? "").trim());
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const raw = arg.slice(2);
    const eq = raw.indexOf("=");
    if (eq >= 0) {
      args[raw.slice(0, eq)] = raw.slice(eq + 1);
      continue;
    }
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[raw] = true;
    } else {
      args[raw] = next;
      index++;
    }
  }
  return args;
}

function todayEastern() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function sanitize(value) {
  return String(value)
    .replace(/api_key=[^&\s]+/gi, "api_key=REDACTED")
    .replace(/key=[^&\s]+/gi, "key=REDACTED")
    .replace(/OUTSCRAPER_API_KEY=[^&\s]+/gi, "OUTSCRAPER_API_KEY=REDACTED")
    .replace(/NEVERBOUNCE_API_KEY=[^&\s]+/gi, "NEVERBOUNCE_API_KEY=REDACTED")
    .replace(/NOBOUNCE_API_KEY=[^&\s]+/gi, "NOBOUNCE_API_KEY=REDACTED")
    .replace(/SMARTLEAD_API_KEY=[^&\s]+/gi, "SMARTLEAD_API_KEY=REDACTED");
}

function printHelp() {
  console.log(`
Build the GMF cold-email prospecting and nurture prep packet.

No live sends are made by this script.

Dry-run with synthetic leads:
  npm run gmf:prospecting -- --fixture

Prepare from an existing CSV:
  npm run gmf:prospecting -- --input tmp-leads.csv

Verify emails while preparing:
  npm run gmf:prospecting -- --input tmp-leads.csv --verify

Run a capped paid Outscraper base Maps scrape after spend approval:
  npm run gmf:prospecting -- --allow-spend --verify

Outputs:
  docs/client-ops-ledger/gmf-prospecting-engine-current.md
  docs/client-ops-ledger/outbox/gmf-prospecting-engine-YYYY-MM-DD.md
  tmp-gmf-prospecting-smartlead-ready-YYYY-MM-DD.csv
  docs/client-ops-ledger/outbox/gmf-prospecting-sequence-YYYY-MM-DD.json
  docs/client-ops-ledger/outbox/gmf-prospecting-nurture-YYYY-MM-DD.json
`);
}
