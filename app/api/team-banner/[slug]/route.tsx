import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Keep runtime-rendered for stability across Next 16 OG prerender edge cases.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NAVY = "#0A1628";
const NAVY_2 = "#142a44";
const CREAM = "#F8F6F1";
const GREEN = "#7CE7B7";

// Picked by Mike: motto + service list format
const MOTTO_LINES = ["Get found.", "Stay found.", "Build trust."];
const SERVICES = "Get Found · Stay Found · Review Power · AI Ready Bundle";

const SERVICE_LABEL = "Get Found - Stay Found - Review Power - AI Ready Bundle";
const SERVICES_TO_RENDER = SERVICE_LABEL || SERVICES;

type SurfaceConfig = {
  width: number;
  height: number;
  density: "standard" | "tight" | "tall";
};

// Render at 2x the platform-display dimensions so the downscale stays crisp
// on Retina + 4K screens. Platforms accept larger-than-spec uploads and
// downscale them with proper resampling.
const SCALE = 2;

// All surfaces use the same banner template — wordmark + motto + services + URL.
// Personal LinkedIn (mike/kip/teri) keep separate routes for cache/CDN even though
// they render identical output — LinkedIn already shows the name + role above the
// banner, so adding name to the banner itself is redundant noise.
const SURFACES: Record<string, SurfaceConfig> = {
  "linkedin-company": { width: 1128, height: 191, density: "tight" },
  "facebook": { width: 820, height: 312, density: "standard" },
  "x": { width: 1500, height: 500, density: "standard" },
  "gbp-cover": { width: 1080, height: 608, density: "tall" },
  "mike": { width: 1584, height: 396, density: "standard" },
  "kip": { width: 1584, height: 396, density: "standard" },
  "teri": { width: 1584, height: 396, density: "standard" },
};

export function generateStaticParams() {
  return Object.keys(SURFACES).map((slug) => ({ slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cfg = SURFACES[slug];
  if (!cfg) return new Response("Not found", { status: 404 });

  // Load real GMF wordmark PNG — high-res source so embedded version stays sharp
  const wordmarkPath = join(process.cwd(), "public", "logos", "aoh-wordmark-dark-h480.png");
  const wordmarkBuf = await readFile(wordmarkPath);
  const wordmarkDataUrl = `data:image/png;base64,${wordmarkBuf.toString("base64")}`;

  // Scale typography per banner dimensions + density. Layout values are in
  // banner-display units; final pixel output is scaled by SCALE.
  const scaleH = cfg.height / 396;
  const isTight = cfg.density === "tight";
  const isTall = cfg.density === "tall";

  // Scale everything by SCALE so the 2x output renders all sizing proportionally
  const padding = (isTight ? 18 : isTall ? 48 : Math.round(56 * scaleH)) * SCALE;
  const wordmarkH = (isTight ? 28 : isTall ? 56 : Math.round(56 * scaleH)) * SCALE;
  const wordmarkW = Math.round(wordmarkH * (730 / 160));

  // Motto sizing — match line count
  const lineCount = MOTTO_LINES.length;
  let mottoSize: number;
  if (isTight) mottoSize = 22;
  else if (isTall) mottoSize = 64;
  else mottoSize = lineCount === 1 ? 110 * scaleH : lineCount === 2 ? 76 * scaleH : 60 * scaleH;
  mottoSize = Math.round(mottoSize) * SCALE;

  const servicesSize = (isTight ? 10 : isTall ? 16 : Math.round(18 * scaleH)) * SCALE;
  const urlSize = (isTight ? 9 : isTall ? 14 : Math.round(15 * scaleH)) * SCALE;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_2} 100%)`,
          color: CREAM,
          padding,
          fontFamily: "sans-serif",
          justifyContent: "space-between",
          alignItems: isTall ? "center" : "stretch",
          position: "relative",
        }}
      >
        {/* Top — real GMF wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={wordmarkDataUrl}
            alt="GetMeFound"
            width={wordmarkW}
            height={wordmarkH}
            style={{ display: "flex", height: wordmarkH, width: wordmarkW }}
          />
        </div>

        {/* Middle — motto */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: isTall ? "center" : "flex-start" }}>
          {MOTTO_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontSize: mottoSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: isTight ? -0.5 : -2,
                color: i === MOTTO_LINES.length - 1 ? GREEN : CREAM,
                textAlign: isTall ? "center" : "left",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Bottom — services + (optional name/role) + URL */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isTight ? 2 : 8,
            paddingTop: isTight ? 4 : 14,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            width: isTall ? "100%" : undefined,
            alignItems: isTall ? "center" : "stretch",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: servicesSize,
              color: GREEN,
              fontWeight: 600,
              letterSpacing: 0.4,
              fontFamily: "monospace",
              textAlign: isTall ? "center" : "left",
            }}
          >
            {SERVICES_TO_RENDER}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: isTall ? "center" : "space-between",
              alignItems: "center",
              gap: isTall ? 24 : 0,
              fontSize: urlSize,
              color: "#A8B3C4",
              fontWeight: 600,
              letterSpacing: 0.3,
              width: isTall ? "auto" : "100%",
            }}
          >
            <div style={{ display: "flex" }}>getmefound.ai</div>
            <div
              style={{
                display: "flex",
                color: GREEN,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontSize: Math.max(9, urlSize - 2),
              }}
            >
              From $59/mo · No contract
            </div>
          </div>

        </div>
      </div>
    ),
    {
      width: cfg.width * SCALE,
      height: cfg.height * SCALE,
      headers: {
        "Content-Disposition": `inline; filename="aoh-${slug}.png"`,
      },
    }
  );
}
