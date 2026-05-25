import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
export const revalidate = false;

const SIZE = { width: 1584, height: 396 } as const;

const NAVY = "#0A1628";
const NAVY_2 = "#142a44";
const CREAM = "#F8F6F1";
const GREEN = "#7CE7B7";
const GREEN_DEEP = "#2D6A4F";

type Motto = {
  slug: string;
  lines: string[]; // each rendered on its own line
  tone: string; // shown in preview for context, not on banner
};

export const MOTTOS: Motto[] = [
  {
    slug: "we-run",
    lines: ["We run the rest.", "You run the business."],
    tone: "Founder signature line — already on the site",
  },
  {
    slug: "dfy",
    lines: ["Done-for-you growth."],
    tone: "Minimal · 3 words",
  },
  {
    slug: "outcome",
    lines: ["We do the work.", "You keep the customer."],
    tone: "Outcome-first · plain",
  },
  {
    slug: "ai-run",
    lines: ["Hands-off."],
    tone: "Two-word minimalism",
  },
  {
    slug: "no-dashboards",
    lines: ["No dashboards.", "No retainers.", "Just done-for-you growth."],
    tone: "Anti-positioning · three-beat",
  },
  {
    slug: "we-pick-up",
    lines: ["We pick up the phones.", "You pick up the work."],
    tone: "Operator-coded · parallel structure",
  },
  {
    slug: "phones-answered",
    lines: ["Phones answered.", "Reviews chased.", "Leads followed up."],
    tone: "Outcome stack · three specifics",
  },
];

const SERVICES = "Get Found · Stay Found · Always Ready";

const SERVICE_LABEL = "Get Found - Stay Found - Always Ready";
const SERVICES_TO_RENDER = SERVICE_LABEL || SERVICES;

export function generateStaticParams() {
  return MOTTOS.map((m) => ({ slug: m.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const motto = MOTTOS.find((m) => m.slug === slug);
  if (!motto) return new Response("Not found", { status: 404 });

  // Scale headline based on line count
  const lineCount = motto.lines.length;
  const headlineSize = lineCount === 1 ? 110 : lineCount === 2 ? 76 : 60;

  // Load the real GMF wordmark PNG (h160 = scales down cleanly to banner size)
  const wordmarkPath = join(process.cwd(), "public", "logos", "aoh-wordmark-dark-h160.png");
  const wordmarkBuf = await readFile(wordmarkPath);
  const wordmarkDataUrl = `data:image/png;base64,${wordmarkBuf.toString("base64")}`;

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
          padding: 64,
          fontFamily: "sans-serif",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Top — real GMF wordmark PNG */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={wordmarkDataUrl}
            alt="GetMeFound"
            width={256}
            height={56}
            style={{ display: "flex", height: 56, width: 256 }}
          />
        </div>

        {/* Middle — motto */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {motto.lines.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontSize: headlineSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -2,
                color: i === motto.lines.length - 1 && motto.lines.length > 1 ? GREEN : CREAM,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Bottom — services + URL */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingTop: 18,
            borderTop: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 19,
              color: GREEN,
              fontWeight: 600,
              letterSpacing: 0.5,
              fontFamily: "monospace",
            }}
          >
            {SERVICES_TO_RENDER}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 16,
              color: "#A8B3C4",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            <div style={{ display: "flex" }}>getmefound.ai</div>
            <div
              style={{
                display: "flex",
                color: GREEN,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontSize: 13,
              }}
            >
              From $99/mo · No contract
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        "Content-Disposition": `inline; filename="aoh-motto-${slug}.png"`,
      },
    }
  );
}
