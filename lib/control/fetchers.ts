/**
 * Server-only data fetchers for /control (The Hub).
 * Each fetcher returns `T | null` — null means "credentials missing or upstream errored,
 * fall back to mock". Caller decides how to surface that.
 *
 * Env vars required (set in Vercel project settings):
 *   VERCEL_TOKEN          - api.vercel.com bearer, full account scope
 *   VERCEL_PROJECT_ID     - prj_xxx for aoh-website
 *   GITHUB_PAT            - github.com fine-grained token, repo:read on aoh-inc/aoh-website + aoh-inc/aoh-tooling
 *   GHL_API_KEY           - Hub360ai PIT (Bearer pit-xxx)
 *   GHL_LOCATION_ID       - sub-account id (visible in Hub360 admin URL)
 *
 * All fetchers cache for 60s via Next's `next: { revalidate: 60 }`.
 */

const REVAL = { next: { revalidate: 60 } };

// ─────────────────────────────────────────────────────────────────────────────
// Vercel — latest deploy
// ─────────────────────────────────────────────────────────────────────────────

export type LatestDeploy = {
  sha: string;
  message: string;
  createdAtIso: string;
  url: string;
  state: string;
};

export async function getLatestDeploy(): Promise<LatestDeploy | null> {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return null;

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1&target=production`,
      {
        headers: { Authorization: `Bearer ${token}` },
        ...REVAL,
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      deployments?: Array<{
        meta?: { githubCommitSha?: string; githubCommitMessage?: string };
        createdAt?: number;
        url?: string;
        state?: string;
      }>;
    };
    const d = data.deployments?.[0];
    if (!d) return null;
    return {
      sha: d.meta?.githubCommitSha?.slice(0, 7) ?? "unknown",
      message: d.meta?.githubCommitMessage ?? "",
      createdAtIso: new Date(d.createdAt ?? Date.now()).toISOString(),
      url: d.url ? `https://${d.url}` : "",
      state: d.state ?? "unknown",
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub — recent commits across a repo
// ─────────────────────────────────────────────────────────────────────────────

export type GitCommit = {
  sha: string;
  message: string;
  author: string;
  dateIso: string;
};

export async function getRecentCommits(
  repo: "aoh-website" | "aoh-tooling",
  limit = 5,
): Promise<GitCommit[] | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "aoh-control",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_PAT) {
    headers.Authorization = `Bearer ${process.env.GITHUB_PAT}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/aoh-inc/${repo}/commits?per_page=${limit}`,
      { headers, ...REVAL },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      sha: string;
      commit: { message: string; author: { name: string; date: string } };
    }>;
    return data.map((c) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split("\n")[0],
      author: c.commit.author.name,
      dateIso: c.commit.author.date,
    }));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GHL — pipelines + opportunities + calendar (services.leadconnectorhq.com v2)
// ─────────────────────────────────────────────────────────────────────────────

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

function ghlHeaders(): Record<string, string> | null {
  const key = process.env.GHL_API_KEY;
  if (!key) return null;
  return {
    Authorization: `Bearer ${key}`,
    Version: GHL_VERSION,
    Accept: "application/json",
  };
}

export type Pipeline = {
  id: string;
  name: string;
  stages: { id: string; name: string; position: number }[];
};

export async function getPipelines(): Promise<Pipeline[] | null> {
  const headers = ghlHeaders();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!headers || !locationId) return null;

  try {
    const res = await fetch(
      `${GHL_BASE}/opportunities/pipelines?locationId=${locationId}`,
      { headers, ...REVAL },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { pipelines?: Pipeline[] };
    return data.pipelines ?? [];
  } catch {
    return null;
  }
}

export type Opportunity = {
  id: string;
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  status: string;
  contactId?: string;
  monetaryValue?: number;
  updatedAt?: string;
};

export async function searchOpportunities(
  pipelineId: string,
  limit = 50,
): Promise<Opportunity[] | null> {
  const headers = ghlHeaders();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!headers || !locationId) return null;

  try {
    const url = new URL(`${GHL_BASE}/opportunities/search`);
    url.searchParams.set("location_id", locationId);
    url.searchParams.set("pipeline_id", pipelineId);
    url.searchParams.set("limit", limit.toString());
    const res = await fetch(url, { headers, ...REVAL });
    if (!res.ok) return null;
    const data = (await res.json()) as { opportunities?: Opportunity[] };
    return data.opportunities ?? [];
  } catch {
    return null;
  }
}

export type CalEvent = {
  id: string;
  title: string;
  startTimeIso: string;
  endTimeIso: string;
  contactId?: string;
};

export async function getCalendarEventsRange(
  startTimeIso: string,
  endTimeIso: string,
): Promise<CalEvent[] | null> {
  const headers = ghlHeaders();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!headers || !locationId) return null;

  try {
    const url = new URL(`${GHL_BASE}/calendars/events`);
    url.searchParams.set("locationId", locationId);
    url.searchParams.set("startTime", startTimeIso);
    url.searchParams.set("endTime", endTimeIso);
    const res = await fetch(url, { headers, ...REVAL });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      events?: Array<{
        id: string;
        title?: string;
        startTime: string;
        endTime: string;
        contactId?: string;
      }>;
    };
    return (
      data.events?.map((e) => ({
        id: e.id,
        title: e.title ?? "untitled",
        startTimeIso: e.startTime,
        endTimeIso: e.endTime,
        contactId: e.contactId,
      })) ?? []
    );
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Aggregated /control payload
// ─────────────────────────────────────────────────────────────────────────────

export type ControlData = {
  deploy: LatestDeploy | null;
  commitsWebsite: GitCommit[] | null;
  commitsTooling: GitCommit[] | null;
  pipelines: Pipeline[] | null;
  todaysEvents: CalEvent[] | null;
  reviewsOutreach: { pipeline: Pipeline | null; opportunities: Opportunity[] | null };
  aiVisOutreach: { pipeline: Pipeline | null; opportunities: Opportunity[] | null };
};

function pickPipelineByName(pipelines: Pipeline[] | null, needle: string) {
  if (!pipelines) return null;
  return (
    pipelines.find((p) => p.name.toLowerCase().includes(needle.toLowerCase())) ??
    null
  );
}

export async function getControlData(): Promise<ControlData> {
  const [deploy, commitsWebsite, commitsTooling, pipelines] = await Promise.all([
    getLatestDeploy(),
    getRecentCommits("aoh-website", 3),
    getRecentCommits("aoh-tooling", 3),
    getPipelines(),
  ]);

  const reviewsPipeline = pickPipelineByName(pipelines, "review");
  const aiVisPipeline = pickPipelineByName(pipelines, "ai visibility");

  // Date range = today (00:00 → 23:59 UTC). For prod we'd use America/New_York.
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const [reviewsOpps, aiVisOpps, todaysEvents] = await Promise.all([
    reviewsPipeline
      ? searchOpportunities(reviewsPipeline.id, 100)
      : Promise.resolve(null),
    aiVisPipeline
      ? searchOpportunities(aiVisPipeline.id, 100)
      : Promise.resolve(null),
    getCalendarEventsRange(startOfDay.toISOString(), endOfDay.toISOString()),
  ]);

  return {
    deploy,
    commitsWebsite,
    commitsTooling,
    pipelines,
    todaysEvents,
    reviewsOutreach: { pipeline: reviewsPipeline, opportunities: reviewsOpps },
    aiVisOutreach: { pipeline: aiVisPipeline, opportunities: aiVisOpps },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers for the page
// ─────────────────────────────────────────────────────────────────────────────

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function timeUntil(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = then - now;
  if (diffMs < 0) return "passed";
  const min = Math.round(diffMs / 60000);
  if (min < 60) return `in ${min}m`;
  const h = Math.floor(min / 60);
  const remMin = min % 60;
  return remMin > 0 ? `in ${h}h ${remMin}m` : `in ${h}h`;
}

export function pipelineFunnel(
  pipeline: Pipeline | null,
  opportunities: Opportunity[] | null,
): {
  enrolled: number;
  engaged: number;
  warm: number;
  booked: number;
} | null {
  if (!pipeline || !opportunities) return null;

  // Heuristic: stage names map to funnel buckets.
  // Adjust the matching as pipeline stages evolve in GHL.
  const enrolled = opportunities.length;
  let engaged = 0;
  let warm = 0;
  let booked = 0;

  const stageById = new Map(pipeline.stages.map((s) => [s.id, s.name.toLowerCase()]));

  for (const opp of opportunities) {
    const stageName = stageById.get(opp.pipelineStageId) ?? "";
    if (/booked|appointment|demo|call.scheduled/.test(stageName)) booked += 1;
    else if (/warm|engaged.*reply|replied|hot/.test(stageName)) warm += 1;
    else if (/engaged|opened|clicked/.test(stageName)) engaged += 1;
  }

  return { enrolled, engaged, warm, booked };
}
