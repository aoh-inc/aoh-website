import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

const SIZE = { width: 1080, height: 1080 } as const;

type StoryMessage = {
  who: "caller" | "ai";
  text: string;
};

type StoryData = {
  eyebrow: string;
  scene: string;
  messages: StoryMessage[];
  punchline: string;
  ctaLine1: string;
  ctaLine2: string;
};

const STORIES: Record<string, StoryData> = {
  "after-hours-payback": {
    eyebrow: "TUESDAY · 7:15 PM",
    scene: "Phone rings. The owner is at dinner. Relay picks up.",
    messages: [
      { who: "caller", text: "My lawn is a mess and I'm hosting Saturday. Can you fit me in this week?" },
      {
        who: "ai",
        text: "I can book you Friday at 8am. Can I get your name and address?",
      },
      { who: "caller", text: "Sarah, 412 Oak Street." },
      { who: "ai", text: "Booked Friday at 8am. You'll get a confirmation text shortly." },
    ],
    punchline: "$200 cut + $1,800 seasonal contract. Booked over dinner.",
    ctaLine1: "9 of 10 after-hours calls go to your competitor",
    ctaLine2: "Relay catches them. $299/mo. getmefound.ai/pricing#always-ready",
  },
};

export function generateStaticParams() {
  return Object.keys(STORIES).map((theme) => ({ theme }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const d = STORIES[theme];

  if (!d) {
    return new Response("Theme not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0A1628 0%, #142a44 100%)",
          color: "#F8F6F1",
          padding: 60,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top brand */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
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
              fontSize: 18,
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
            color: "#7CE7B7",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {d.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#F8F6F1",
            fontWeight: 600,
            letterSpacing: -0.3,
            marginBottom: 22,
            lineHeight: 1.25,
          }}
        >
          {d.scene}
        </div>

        {/* Chat */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            background: "rgba(0,0,0,0.30)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 22,
            padding: 22,
            gap: 12,
          }}
        >
          {d.messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.who === "caller" ? "flex-start" : "flex-end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  maxWidth: "82%",
                  padding: "12px 16px",
                  borderRadius: 18,
                  fontSize: 22,
                  lineHeight: 1.3,
                  color: m.who === "caller" ? "#F8F6F1" : "#0A1628",
                  background: m.who === "caller" ? "#2a3a52" : "#7CE7B7",
                  fontWeight: m.who === "caller" ? 500 : 600,
                  letterSpacing: -0.2,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Punchline */}
        <div
          style={{
            display: "flex",
            marginTop: 22,
            padding: "16px 20px",
            background: "rgba(124,231,183,0.14)",
            border: "1px solid rgba(124,231,183,0.5)",
            borderRadius: 14,
            fontSize: 24,
            fontWeight: 700,
            color: "#F8F6F1",
            letterSpacing: -0.3,
          }}
        >
          {d.punchline}
        </div>

        {/* Footer CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            {d.ctaLine1}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#7CE7B7",
              fontWeight: 600,
              letterSpacing: 0.3,
            }}
          >
            {d.ctaLine2}
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
