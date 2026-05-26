import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
export const revalidate = false;

const SIZE = { width: 1080, height: 1080 } as const;

type PhotoOverlay = {
  imagePath: string; // relative to /public
  topEyebrow: string;
  hook: string;
  ctaLabel: string;
  ctaUrl: string;
  accent: "green" | "amber" | "red" | "blue";
};

const PHOTOS: Record<string, PhotoOverlay> = {
  "after-hours-payback": {
    imagePath: "/social/ai-gen/after-hours-pilot.jpg",
    topEyebrow: "AFTER-HOURS CALLS",
    hook: "9 of 10 calls go to your competitor.",
    ctaLabel: "Always Ready - $299/mo",
    ctaUrl: "getmefound.ai/checkout/always-ready",
    accent: "green",
  },
  "star-sweet-spot": {
    imagePath: "/social/ai-gen/star-sweet-spot.jpg",
    topEyebrow: "REVIEWS · STAR MATH",
    hook: "Customers don't trust 5.0.",
    ctaLabel: "Stay Found - $99/mo",
    ctaUrl: "getmefound.ai/checkout/stay-found",
    accent: "amber",
  },
  "cost-of-dormant-profile": {
    imagePath: "/social/ai-gen/cost-of-dormant-profile.jpg",
    topEyebrow: "THE COST OF DOING NOTHING",
    hook: "$38,400/year walking out.",
    ctaLabel: "Stay Found - $99/mo",
    ctaUrl: "getmefound.ai/checkout/stay-found",
    accent: "red",
  },
  "review-velocity-90-day": {
    imagePath: "/social/ai-gen/review-velocity-90-day.jpg",
    topEyebrow: "THE 90-DAY RULE",
    hook: "60 fresh reviews beat 200 old ones.",
    ctaLabel: "Stay Found - $99/mo",
    ctaUrl: "getmefound.ai/checkout/stay-found",
    accent: "green",
  },
  "ai-recommendation-vs-rank": {
    imagePath: "/social/ai-gen/ai-recommendation-vs-rank.jpg",
    topEyebrow: "AI VISIBILITY",
    hook: "AI names 1 of 3. Google lists 10.",
    ctaLabel: "Always Ready - $299/mo",
    ctaUrl: "getmefound.ai/checkout/always-ready",
    accent: "blue",
  },
  "diy-vs-dfy": {
    imagePath: "/social/ai-gen/diy-vs-dfy.jpg",
    topEyebrow: "DIY vs DONE-FOR-YOU",
    hook: "$30 software isn't cheaper if no one runs it.",
    ctaLabel: "Stay Found - $99/mo",
    ctaUrl: "getmefound.ai/checkout/stay-found",
    accent: "amber",
  },
  "software-vs-work": {
    imagePath: "/social/ai-gen/software-vs-work.jpg",
    topEyebrow: "DONE-FOR-YOU",
    hook: "Haven't opened the app in 6 months? It's a bill, not a tool.",
    ctaLabel: "See GMF pricing",
    ctaUrl: "getmefound.ai/pricing",
    accent: "amber",
  },
  "reviews-compound": {
    imagePath: "/social/ai-gen/reviews-compound.jpg",
    topEyebrow: "REVIEWS COMPOUND",
    hook: "Ads stop. Reviews still pay you in 2036.",
    ctaLabel: "Stay Found - $99/mo",
    ctaUrl: "getmefound.ai/checkout/stay-found",
    accent: "green",
  },
  "med-spa-math": {
    imagePath: "/social/ai-gen/med-spa-math.jpg",
    topEyebrow: "MED SPA MATH",
    hook: "1 missed review = 4 lost bookings.",
    ctaLabel: "Stay Found - $99/mo",
    ctaUrl: "getmefound.ai/checkout/stay-found",
    accent: "amber",
  },
  "groomer-trust": {
    imagePath: "/social/ai-gen/groomer-trust.jpg",
    topEyebrow: "PET GROOMERS",
    hook: "Pet parents don't book under 20 reviews.",
    ctaLabel: "Stay Found - $99/mo",
    ctaUrl: "getmefound.ai/checkout/stay-found",
    accent: "blue",
  },
};

const ACCENT: Record<PhotoOverlay["accent"], string> = {
  green: "#7CE7B7",
  amber: "#FFC857",
  red: "#FF8A80",
  blue: "#8AB6FF",
};

export function generateStaticParams() {
  return Object.keys(PHOTOS).map((theme) => ({ theme }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const cfg = PHOTOS[theme];

  if (!cfg) {
    return new Response("Theme not found", { status: 404 });
  }

  // Load the AI-gen photo from /public and inline as data URL.
  // Mime is inferred from the file extension so WebP / JPEG / PNG all work.
  const filePath = join(process.cwd(), "public", cfg.imagePath.replace(/^\//, ""));
  const buf = await readFile(filePath);
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "jpeg";
  const mime =
    ext === "webp"
      ? "image/webp"
      : ext === "png"
      ? "image/png"
      : "image/jpeg";
  const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;

  const accentHex = ACCENT[cfg.accent];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background photo */}
        <img
          src={dataUrl}
          alt=""
          width={SIZE.width}
          height={SIZE.height}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Top gradient overlay so wordmark + eyebrow are legible */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 260,
            display: "flex",
            background: "linear-gradient(180deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0) 100%)",
          }}
        />

        {/* Bottom gradient overlay for hook + CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 460,
            display: "flex",
            background: "linear-gradient(0deg, rgba(10,22,40,0.96) 0%, rgba(10,22,40,0.65) 60%, rgba(10,22,40,0) 100%)",
          }}
        />

        {/* Top — wordmark + eyebrow */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 48,
            right: 48,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#2D6A4F",
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 800,
                marginRight: 14,
              }}
            >
              A
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#F8F6F1",
              }}
            >
              AI OUTSOURCE HUB
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: accentHex,
              alignSelf: "flex-start",
              background: "rgba(10,22,40,0.55)",
              border: `1px solid ${accentHex}`,
              borderRadius: 999,
              padding: "6px 14px",
            }}
          >
            {cfg.topEyebrow}
          </div>
        </div>

        {/* Bottom — hook + CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 48,
            right: 48,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: "#F8F6F1",
              marginBottom: 26,
              maxWidth: 900,
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            {cfg.hook}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 22,
              borderTop: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                color: accentHex,
                letterSpacing: -0.3,
              }}
            >
              {cfg.ctaLabel}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#A8B3C4",
                fontWeight: 600,
                letterSpacing: 0.3,
              }}
            >
              {cfg.ctaUrl}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
