#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const OUTSCRAPER_API_BASE = "https://api.outscraper.com";

const LANES = {
  reviews: {
    label: "Reviews",
    source: "Campaign - Review Automation",
    startTag: "aoh_campaign_reviews_start",
    campaignTag: "aoh_campaign_reviews",
    offerLane: "reviews",
  },
  ai: {
    label: "AI Visibility",
    source: "Campaign - AI Visibility",
    startTag: "aoh_campaign_ai_visibility_start",
    campaignTag: "aoh_campaign_ai_visibility",
    offerLane: "ai_visibility",
  },
  relay: {
    label: "Relay",
    source: "Campaign - Relay",
    startTag: "aoh_campaign_relay_start",
    campaignTag: "aoh_campaign_relay",
    offerLane: "relay",
  },
};

const FIELD_IDS = {
  businessName: "98RC4gU1FR9SDpSAs0ho",
  productOrderCompanyName: "Ujpd3zNVGEtmiIR73OZ3",
  websiteMarketingAuditReport: "iE0EbTGkRwLJMHLsr0Yj",
  cityMarketingAuditReport: "i1xZWM6PuWNBDuVqR0Dt",
  stateMarketingAuditReport: "mOpqct6qm8DYJIIIWEl0",
  emailMarketingAuditReport: "4kgAtEFQyKya1hKVWaLo",
  gbpRating: "8QBiI3hdQljVmpHOhEvq",
  gbpReviewCount: "fRZfxk8HQ5Tcj1mJEuod",
  gbpLastReview: "dLdnUmq5fTEqjuvWhDHs",
  gbpCategories: "42OpFsF6PxuLvok5yQTT",
  topCompetitorName: "njpBBdT7kS3grTvaHY9g",
  topCompetitorReviewCount: "CNiQRXxZPY0dzLcKNkjd",
  niche: "6wItCWXqDFECRX67Ki3F",
  prospectLink: "rs6FEOL7ZMItZ3kSBoc7",
  campaignSource: "kBW9m7V0hTehnb9N3WlK",
  offerLane: "xRNb2vJGyf7lXGFscSfh",
  leadSource: "LIILv8zU5JGSYxmRsbsB",
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const laneKey = String(args.lane ?? "").toLowerCase();
  const lane = LANES[laneKey];
  if (!lane) die("Missing or invalid --lane. Use reviews, ai, or relay.");

  const limit = Number(args.limit ?? 10);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    die("--limit must be a number from 1 to 100 for this pilot launcher.");
  }

  const commit = Boolean(args.commit);
  const startDrip = Boolean(args["start-drip"]);
  if (startDrip && !commit) {
    die("--start-drip requires --commit because it adds the live start tag.");
  }
  const onlyOk = Boolean(args["only-ok"] ?? args.onlyOk);

  const prospects = args.csv
    ? readProspectsFromCsv(String(args.csv), laneKey)
    : await scrapeProspects(args, laneKey, limit);
  const qaAware = prospects.some((prospect) => "qa_recommendation" in prospect || "qa_flags" in prospect);
  if (onlyOk && !qaAware) {
    die("--only-ok requires a QA CSV with qa_recommendation or qa_flags columns.");
  }
  const selectedProspects = onlyOk ? prospects.filter(isQaOkProspect) : prospects;
  if (onlyOk) {
    console.log(`QA OK-only filter kept ${selectedProspects.length} of ${prospects.length} rows.`);
  }

  const cleaned = selectedProspects
    .map((prospect) => normalizeProspect(prospect, laneKey))
    .filter((prospect) => prospect.name && prospect.email);

  const unique = dedupeByEmail(cleaned).slice(0, limit);
  if (unique.length === 0) {
    die("No prospects with email addresses were found. Use enrichment or a CSV with email addresses.");
  }

  const outFile = String(args.out ?? `tmp-reach-${laneKey}-${Date.now()}.json`);
  writeFileSync(outFile, JSON.stringify(unique, null, 2));

  console.log(`Prepared ${unique.length} ${lane.label} prospects.`);
  console.log(`Saved normalized prospects to ${outFile}.`);

  if (!commit) {
    console.log("");
    console.log("DRY RUN ONLY. Nothing was added to GHL.");
    console.log("Review the output file, then rerun with --commit.");
    console.log("To also start the drip, add --start-drip.");
    printSample(unique);
    return;
  }

  const token = requiredEnv("GHL_PIT_TOKEN");
  const locationId = requiredEnv("GHL_LOCATION_ID");
  const results = [];

  for (const prospect of unique) {
    const upsert = await upsertContact({ token, locationId, prospect, lane, laneKey });
    const tags = startDrip
      ? [lane.campaignTag, lane.startTag]
      : [lane.campaignTag, `aoh_campaign_${laneKey}_imported`];
    const tagged = upsert.contactId
      ? await addTags({ token, contactId: upsert.contactId, tags })
      : { ok: false, error: "No contact id returned." };

    results.push({
      email: prospect.email,
      name: prospect.name,
      contactId: upsert.contactId ?? null,
      upsert: upsert.ok,
      tagged: tagged.ok,
      tags,
      error: upsert.error ?? tagged.error ?? null,
    });
    console.log(`${upsert.ok && tagged.ok ? "OK" : "ERR"} ${prospect.email} ${prospect.name}`);
  }

  const resultFile = outFile.replace(/\.json$/i, "-ghl-results.json");
  writeFileSync(resultFile, JSON.stringify(results, null, 2));
  console.log("");
  console.log(`GHL results saved to ${resultFile}.`);
  if (startDrip) {
    console.log(`Live start tag added: ${lane.startTag}`);
  } else {
    console.log("Contacts imported/tagged, but drip was not started.");
  }
}

async function scrapeProspects(args, laneKey, limit) {
  const industry = String(args.industry ?? "").trim();
  const area = String(args.area ?? "").trim();
  if (!industry || !area) {
    die("Provide either --csv or both --industry and --area.");
  }

  const query = String(args.query ?? `${industry}, ${area}, USA`);
  const apiKey = requiredEnv("OUTSCRAPER_API_KEY");
  const enrich = args.enrich !== false && args.enrich !== "false";
  const url = new URL("/google-maps-search", OUTSCRAPER_API_BASE);
  url.searchParams.append("query", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("async", "false");
  url.searchParams.set("dropDuplicates", "true");
  url.searchParams.set("region", "US");
  if (enrich) {
    url.searchParams.append("enrichment", "contacts_n_leads");
  }

  console.log(`Scraping Outscraper query: ${query}`);
  console.log(`Limit: ${limit}. Enrichment: ${enrich ? "contacts_n_leads" : "off"}.`);

  const timeoutMs = boundedNumber(args.timeoutMs ?? args["timeout-ms"], 30_000, 240_000, 120_000);
  const res = await fetch(url, {
    headers: { "X-API-KEY": apiKey },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  if (!res.ok) {
    die(`Outscraper failed ${res.status}: ${text.slice(0, 500)}`);
  }
  const data = parseJson(text);
  const rows = flattenOutscraperData(data?.data);
  return rows.map((row) => ({ ...row, campaignLane: laneKey, searchQuery: query }));
}

function boundedNumber(value, min, max, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeProspect(input, laneKey) {
  const name = pick(input, ["name", "business_name", "company_name", "company", "title"]);
  const email = firstEmail(input);
  const city = pick(input, ["city", "borough"]);
  const state = pick(input, ["us_state", "state", "region"]);
  const category = pick(input, ["type", "category", "niche_vertical", "industry"]);

  return {
    name,
    email: email.toLowerCase(),
    phone: pick(input, ["phone", "phone_1", "phone_number"]),
    website: cleanUrl(pick(input, ["site", "website", "domain"])),
    address: pick(input, ["full_address", "address"]),
    city,
    state,
    niche: category,
    rating: pick(input, ["rating", "prospect_rating", "gbp_rating"]),
    reviewCount: pick(input, ["reviews", "review_count", "prospect_review_count", "gbp_review_count"]),
    lastReviewDate: pick(input, ["last_review_date", "gbp_last_review"]),
    reviewsLink: pick(input, ["reviews_link", "location_link", "prospect_link"]),
    competitorName: pick(input, ["competitor_name", "top_competitor_name"]),
    competitorReviewCount: pick(input, ["competitor_review_count", "top_competitor_review_count"]),
    lane: laneKey,
    sourceQuery: pick(input, ["searchQuery", "query"]),
  };
}

function isQaOkProspect(input) {
  const recommendation = String(input.qa_recommendation ?? "").trim().toLowerCase();
  const flags = String(input.qa_flags ?? "").trim();
  if (recommendation) return recommendation === "ok";
  return !flags;
}

async function upsertContact({ token, locationId, prospect, lane, laneKey }) {
  const customFields = [
    cf(FIELD_IDS.businessName, prospect.name),
    cf(FIELD_IDS.productOrderCompanyName, prospect.name),
    cf(FIELD_IDS.emailMarketingAuditReport, prospect.email),
    cf(FIELD_IDS.websiteMarketingAuditReport, prospect.website),
    cf(FIELD_IDS.cityMarketingAuditReport, prospect.city),
    cf(FIELD_IDS.stateMarketingAuditReport, prospect.state),
    cf(FIELD_IDS.gbpRating, prospect.rating),
    cf(FIELD_IDS.gbpReviewCount, prospect.reviewCount),
    cf(FIELD_IDS.gbpLastReview, prospect.lastReviewDate),
    cf(FIELD_IDS.gbpCategories, prospect.niche),
    cf(FIELD_IDS.niche, prospect.niche),
    cf(FIELD_IDS.prospectLink, prospect.reviewsLink),
    cf(FIELD_IDS.topCompetitorName, prospect.competitorName),
    cf(FIELD_IDS.topCompetitorReviewCount, prospect.competitorReviewCount),
    cf(FIELD_IDS.campaignSource, laneKey),
    cf(FIELD_IDS.offerLane, lane.offerLane),
    cf(FIELD_IDS.leadSource, lane.source),
  ].filter(Boolean);

  const body = {
    locationId,
    email: prospect.email,
    name: prospect.name,
    companyName: prospect.name,
    phone: prospect.phone || undefined,
    website: prospect.website || undefined,
    address1: prospect.address || undefined,
    city: prospect.city || undefined,
    state: prospect.state || undefined,
    source: lane.source,
    customFields,
  };

  const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: ghlHeaders(token),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, error: text.slice(0, 500) };
  }
  const data = parseJson(text);
  const contactId = data?.contact?.id ?? data?.id ?? data?.contactId;
  return { ok: Boolean(contactId), status: res.status, contactId, error: contactId ? null : "No contact id returned." };
}

async function addTags({ token, contactId, tags }) {
  const res = await fetch(`${GHL_API_BASE}/contacts/${encodeURIComponent(contactId)}/tags`, {
    method: "POST",
    headers: ghlHeaders(token),
    body: JSON.stringify({ tags }),
  });
  const text = await res.text();
  return res.ok
    ? { ok: true, status: res.status }
    : { ok: false, status: res.status, error: text.slice(0, 500) };
}

function cf(id, value) {
  const normalized = value == null ? "" : String(value).trim();
  return normalized ? { id, field_value: normalized } : null;
}

function firstEmail(input) {
  const direct = pick(input, ["email", "email_1", "email1", "work_email"]);
  if (isEmail(direct)) return direct;
  const candidates = [];
  collectEmails(input, candidates);
  return candidates.find(isEmail) ?? "";
}

function collectEmails(value, out) {
  if (!value) return;
  if (typeof value === "string") {
    for (const match of value.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
      out.push(match[0]);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectEmails(item, out);
    return;
  }
  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      if (/email/i.test(key)) collectEmails(nested, out);
    }
  }
}

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function pick(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function cleanUrl(value) {
  if (!value) return "";
  try {
    return new URL(value).toString();
  } catch {
    try {
      return new URL(`https://${value}`).toString();
    } catch {
      return value;
    }
  }
}

function dedupeByEmail(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    const email = row.email.toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);
    out.push(row);
  }
  return out;
}

function flattenOutscraperData(data) {
  if (!Array.isArray(data)) return [];
  if (data.every((item) => Array.isArray(item))) return data.flat();
  return data;
}

function readProspectsFromCsv(path, laneKey) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) die(`CSV not found: ${absolute}`);
  const rows = parseCsv(readFileSync(absolute, "utf8"));
  console.log(`Loaded ${rows.length} rows from ${basename(path)}.`);
  return rows.map((row) => ({ ...row, campaignLane: laneKey }));
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const next = raw[i + 1];
    if (quoted && c === '"' && next === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (!quoted && c === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (c === "\n" || c === "\r")) {
      if (c === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift()?.map((h) => h.trim()) ?? [];
  return rows
    .filter((values) => values.some((value) => value.trim()))
    .map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").trim();
  }
}

function ghlHeaders(token) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Version: GHL_API_VERSION,
  };
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) die(`${name} is not set.`);
  return value;
}

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function printSample(rows) {
  console.log("");
  console.log("Sample:");
  for (const row of rows.slice(0, 3)) {
    console.log(`- ${row.name} <${row.email}> ${row.city || ""} ${row.state || ""}`);
  }
}

function printHelp() {
  console.log(`
Launch Reach campaign contacts into GHL.

Dry run from Outscraper:
  node scripts/launch-reach-campaign.mjs --lane reviews --industry "pet groomer" --area "Madison CT" --limit 10

Import contacts only:
  node scripts/launch-reach-campaign.mjs --lane reviews --csv prospects.csv --limit 10 --commit

Import and start drip:
  node scripts/launch-reach-campaign.mjs --lane reviews --csv prospects.csv --limit 10 --commit --start-drip

Options:
  --lane reviews|ai|relay
  --industry "pet groomer"
  --area "Madison CT"
  --query "pet groomer, Madison CT, USA"
  --csv path/to/file.csv
  --limit 1..100
  --enrich false
  --commit
  --start-drip
  --only-ok
`);
}

function die(message) {
  console.error(message);
  process.exit(1);
}
