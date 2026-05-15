const LOCAL_BUSINESS_TYPES = new Set([
  "LocalBusiness", "Plumber", "Restaurant", "Doctor", "Dentist", "Lawyer",
  "LegalService", "AccountingService", "AutoRepair", "BeautySalon",
  "HomeAndConstructionBusiness", "MedicalBusiness", "ProfessionalService",
  "FoodEstablishment", "HealthAndBeautyBusiness", "LodgingBusiness",
  "SportsActivityLocation", "EntertainmentBusiness", "FinancialService",
  "RealEstateAgent", "Store", "FurnitureStore", "GroceryStore", "ClothingStore",
  "Electrician", "HVACBusiness", "RoofingContractor", "GeneralContractor",
  "Locksmith", "MovingCompany", "PestControlService", "Optician",
  "Veterinary", "AnimalShelter", "DaySpa", "HairSalon", "NailSalon",
  "BodyCare", "Florist", "BowlingAlley", "GolfCourse",
]);

export type SchemaResult = {
  hasLocalBusiness: boolean;
  hasRating: boolean;
  hasHours: boolean;
  hasSameAs: boolean;
  hasFAQ: boolean;
  hasNAP: boolean;
  score: number;
  scanFailed: boolean;
};

export type BusinessData = {
  name: string;
  rating: number;
  reviewCount: number;
  website: string | null;
  phone: string | null;
  googleMapsUrl: string | null;
  city: string;
  category: string;
};

export type Scores = {
  overall: number;
  reviewStrength: number;
  profileComplete: number;
  aiReadable: number;
};

export type ScoredBusiness = BusinessData & { schema: SchemaResult; scores: Scores };

export type Scenario =
  | "competitor_ahead"
  | "nobody_optimized"
  | "prospect_ahead"
  | "no_competitor";

export type AIVisibilityReport = {
  prospect: ScoredBusiness;
  competitor: ScoredBusiness | null;
  scenario: Scenario;
  verdicts: string[];
  city: string;
  category: string;
};

function emptySchema(scanFailed = false): SchemaResult {
  return {
    hasLocalBusiness: false,
    hasRating: false,
    hasHours: false,
    hasSameAs: false,
    hasFAQ: false,
    hasNAP: false,
    score: 0,
    scanFailed,
  };
}

async function scanSchema(websiteUrl: string): Promise<SchemaResult> {
  if (!websiteUrl) return emptySchema(false);
  try {
    const url = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AOHBot/1.0; +https://aioutsourcehub.com)",
      },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!res.ok) return emptySchema(true);

    const html = await res.text();
    const schemas: Record<string, unknown>[] = [];
    const re =
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      try {
        const parsed: unknown = JSON.parse(m[1]);
        if (Array.isArray(parsed))
          schemas.push(...(parsed as Record<string, unknown>[]));
        else if (parsed && typeof parsed === "object")
          schemas.push(parsed as Record<string, unknown>);
      } catch {}
    }

    if (schemas.length === 0) return emptySchema(false);

    const getTypes = (s: Record<string, unknown>): string[] => {
      const t = s["@type"];
      return (Array.isArray(t) ? t : [t]).filter(Boolean).map(String);
    };

    const allTypes = schemas.flatMap(getTypes);

    const hasLocalBusiness = allTypes.some((t) => LOCAL_BUSINESS_TYPES.has(t));
    const hasRating = schemas.some(
      (s) =>
        s["aggregateRating"] != null ||
        allTypes.includes("AggregateRating"),
    );
    const hasHours = schemas.some(
      (s) =>
        s["openingHoursSpecification"] != null || s["openingHours"] != null,
    );
    const hasSameAs = schemas.some((s) => s["sameAs"] != null);
    const hasFAQ = allTypes.includes("FAQPage");
    const hasNAP = schemas.some(
      (s) => s["address"] != null || s["telephone"] != null,
    );

    const score =
      (hasLocalBusiness ? 25 : 0) +
      (hasRating ? 20 : 0) +
      (hasHours ? 15 : 0) +
      (hasSameAs ? 20 : 0) +
      (hasFAQ ? 10 : 0) +
      (hasNAP ? 10 : 0);

    return {
      hasLocalBusiness,
      hasRating,
      hasHours,
      hasSameAs,
      hasFAQ,
      hasNAP,
      score,
      scanFailed: false,
    };
  } catch {
    return emptySchema(true);
  }
}

function deriveScores(b: BusinessData, schema: SchemaResult): Scores {
  const ratingScore = (b.rating / 5) * 50;
  const reviewScore = Math.min(b.reviewCount / 100, 1) * 50;
  const reviewStrength = Math.round(ratingScore + reviewScore);

  const profileComplete = Math.round(
    (b.website ? 30 : 0) +
      (b.phone ? 25 : 0) +
      (b.rating > 0 ? 25 : 0) +
      (b.reviewCount > 0 ? 20 : 0),
  );

  const aiReadable = schema.score;
  const overall = Math.round(
    reviewStrength * 0.35 + profileComplete * 0.25 + aiReadable * 0.4,
  );

  return { overall, reviewStrength, profileComplete, aiReadable };
}

function deriveScenario(
  prospect: ScoredBusiness,
  competitor: ScoredBusiness | null,
): Scenario {
  if (!competitor) return "no_competitor";

  const bothPoorSchema =
    prospect.schema.score < 35 && competitor.schema.score < 35;
  const bothFewReviews =
    prospect.reviewCount < 50 && competitor.reviewCount < 50;

  if (bothPoorSchema && bothFewReviews) return "nobody_optimized";
  if (competitor.scores.overall > prospect.scores.overall + 8)
    return "competitor_ahead";
  return "prospect_ahead";
}

function generateVerdicts(
  prospect: ScoredBusiness,
  competitor: ScoredBusiness | null,
  scenario: Scenario,
  city: string,
  category: string,
): string[] {
  const verdicts: string[] = [];

  // 1. Review verdict
  if (prospect.reviewCount < 10) {
    verdicts.push(
      `You have ${prospect.reviewCount} reviews. ChatGPT typically recommends businesses with 50 or more.`,
    );
  } else if (prospect.reviewCount < 50) {
    verdicts.push(
      `You have ${prospect.reviewCount} reviews — 50 is a key threshold for appearing in AI recommendations.`,
    );
  } else if (prospect.rating > 0 && prospect.rating < 4.5) {
    verdicts.push(
      `Your ${prospect.rating.toFixed(1)}-star rating is below the 4.5 threshold AI systems prefer when recommending businesses.`,
    );
  } else {
    verdicts.push(
      `Your reviews are solid. The gap is in how your website communicates with AI systems.`,
    );
  }

  // 2. Schema/website verdict
  if (prospect.website === null) {
    verdicts.push(
      `You have no website listed on Google — AI systems can't find or cite you without one.`,
    );
  } else if (!prospect.schema.hasLocalBusiness) {
    verdicts.push(
      `AI systems can't tell what type of business you are from your website. That's the first thing they check.`,
    );
  } else if (!prospect.schema.hasRating) {
    verdicts.push(
      `AI can find you, but can't read your star rating from your site — one of the top signals for recommendations.`,
    );
  } else if (prospect.schema.score < 50) {
    verdicts.push(
      `Your website has some AI signals, but is missing ${100 - prospect.schema.score}% of what search AI looks for.`,
    );
  } else {
    verdicts.push(
      `Your website signals are good. Focus is on review volume and consistency to pull ahead.`,
    );
  }

  // 3. Competitive verdict
  if (scenario === "competitor_ahead" && competitor) {
    verdicts.push(
      `${competitor.name} has ${competitor.reviewCount} reviews and stronger AI signals on their site. They get recommended first.`,
    );
  } else if (scenario === "nobody_optimized") {
    const cat = category || "business";
    const loc = city || "your area";
    verdicts.push(
      `No local ${cat} in ${loc} is fully set up for AI search yet. First one to fix this wins the category.`,
    );
  } else if (scenario === "prospect_ahead" && competitor) {
    verdicts.push(
      `You're ahead of ${competitor.name} on AI visibility right now — but the gap is small. Lock it in.`,
    );
  } else {
    verdicts.push(
      `Most local businesses haven't optimized for AI search yet. Early movers win the category.`,
    );
  }

  return verdicts;
}

type OutscraperRow = Record<string, unknown>;

function normalizeRow(r: OutscraperRow): BusinessData {
  const pick = (...keys: string[]): string => {
    for (const k of keys) {
      const v = r[k];
      if (v != null && v !== "") return String(v);
    }
    return "";
  };

  const address = pick("full_address", "address", "formatted_address");
  const parts = address
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const city =
    pick("city") || (parts.length >= 3 ? parts[parts.length - 3] : "");

  return {
    name: pick("name", "business_name"),
    rating: parseFloat(pick("rating") || "0") || 0,
    reviewCount:
      parseInt(
        pick("reviews", "reviews_count", "user_ratings_total") || "0",
      ) || 0,
    website: pick("site", "website") || null,
    phone: pick("phone", "phone_number") || null,
    googleMapsUrl: pick("link", "google_maps_url") || null,
    city,
    category: pick("type", "subtypes", "category"),
  };
}

async function outscraper(query: string, limit: number): Promise<BusinessData[]> {
  const apiKey = process.env.OUTSCRAPER_API_KEY;
  if (!apiKey) return [];

  const url = new URL("https://api.outscraper.cloud/google-maps-search");
  url.searchParams.set("query", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("async", "false");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-API-KEY": apiKey, Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return [];

    const data = (await res.json()) as unknown;
    const rows: OutscraperRow[] = Array.isArray(data)
      ? (data as unknown[]).flatMap((x) => (Array.isArray(x) ? x : [x]))
      : Array.isArray((data as { data?: unknown[] })?.data)
        ? (data as { data: unknown[] }).data.flatMap((x) =>
            Array.isArray(x) ? x : [x],
          )
        : [];

    return rows
      .map(normalizeRow)
      .filter((b) => b.name.length > 0) as BusinessData[];
  } catch {
    return [];
  }
}

export async function buildAIVisibilityReport(
  businessName: string,
  city?: string,
): Promise<AIVisibilityReport | null> {
  const query = city ? `${businessName}, ${city}` : businessName;
  const results = await outscraper(query, 1);
  if (!results.length) return null;

  const prospectData = results[0];
  const prospectCity = city || prospectData.city;

  // Find competitor in same category + city
  let competitorData: BusinessData | null = null;
  if (prospectData.category && prospectCity) {
    const comps = await outscraper(
      `${prospectData.category}, ${prospectCity}`,
      6,
    );
    const filtered = comps.filter(
      (b) =>
        b.name.toLowerCase().trim() !==
        prospectData.name.toLowerCase().trim(),
    );
    if (filtered.length > 0) {
      // Pick highest-rated competitor with a website
      competitorData =
        filtered.find((b) => b.website && b.rating >= 4.0) ||
        filtered.sort((a, b) => b.rating - a.rating)[0];
    }
  }

  // Scan websites in parallel
  const [prospectSchema, competitorSchema] = await Promise.all([
    prospectData.website
      ? scanSchema(prospectData.website)
      : Promise.resolve(emptySchema(false)),
    competitorData?.website
      ? scanSchema(competitorData.website)
      : Promise.resolve(emptySchema(false)),
  ]);

  const prospectScores = deriveScores(prospectData, prospectSchema);
  const competitorScores = competitorData
    ? deriveScores(competitorData, competitorSchema)
    : null;

  const prospect: ScoredBusiness = {
    ...prospectData,
    schema: prospectSchema,
    scores: prospectScores,
  };

  const competitor: ScoredBusiness | null =
    competitorData && competitorScores
      ? { ...competitorData, schema: competitorSchema, scores: competitorScores }
      : null;

  const scenario = deriveScenario(prospect, competitor);
  const verdicts = generateVerdicts(
    prospect,
    competitor,
    scenario,
    prospectCity,
    prospectData.category,
  );

  return { prospect, competitor, scenario, verdicts, city: prospectCity, category: prospectData.category };
}
