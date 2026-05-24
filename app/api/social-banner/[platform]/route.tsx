import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

type Banner = {
  width: number;
  height: number;
  variant: "brand" | "person";
  headline?: string;
  subhead?: string;
  name?: string;
  role?: string;
  focus?: string;
};

const BANNERS: Record<string, Banner> = {
  "linkedin-company": {
    width: 1128,
    height: 191,
    variant: "brand",
    headline: "You run the business. We run the rest.",
    subhead: "Get Found · Stay Found · Get Chosen · Always Ready.",
  },
  "facebook": {
    width: 820,
    height: 312,
    variant: "brand",
    headline: "You run the business.",
    subhead: "We run the rest. Reviews, AI search visibility, and AI readiness for local businesses.",
  },
  "x": {
    width: 1500,
    height: 500,
    variant: "brand",
    headline: "You run the business. We run the rest.",
    subhead: "Done-for-you reviews, AI visibility, and AI readiness for local businesses.",
  },
  "mike": {
    width: 1584,
    height: 396,
    variant: "person",
    name: "Mike Egidio",
    role: "Founder · GetMeFound",
    focus: "I built GMF so local-business owners can run their business while we run the rest.",
  },
  "kip": {
    width: 1584,
    height: 396,
    variant: "person",
    name: "Kip Leathers",
    role: "Business Development · GetMeFound",
    focus: "I find the right local-business owners to talk to — then open the conversation.",
  },
  "teri": {
    width: 1584,
    height: 396,
    variant: "person",
    name: "Teri Egidio",
    role: "Sales Manager · GetMeFound",
    focus: "I run the inbound pipeline and onboard every new client so day one feels handled.",
  },
};

function BrandBanner({ b }: { b: Banner }) {
  // Scale font sizes based on banner height so it fits short LinkedIn / wider X headers
  const scale = b.height / 312;
  const headlineSize = Math.round(56 * scale);
  const subheadSize = Math.round(22 * scale);
  const padding = Math.round(56 * scale);
  const logoBox = Math.round(54 * scale);
  const logoFont = Math.round(28 * scale);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0A1628 0%, #142a44 60%, #1a3450 100%)",
        color: "#F8F6F1",
        padding,
        fontFamily: "sans-serif",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: logoBox,
            height: logoBox,
            borderRadius: Math.round(logoBox * 0.22),
            background: "#2D6A4F",
            color: "#ffffff",
            fontSize: logoFont,
            fontWeight: 800,
            marginRight: Math.round(14 * scale),
          }}
        >
          A
        </div>
        <div
          style={{
            display: "flex",
            fontSize: Math.round(22 * scale),
            fontWeight: 700,
            letterSpacing: 2,
            color: "#F8F6F1",
          }}
        >
          AI OUTSOURCE HUB
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: headlineSize,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            color: "#F8F6F1",
            marginBottom: Math.round(12 * scale),
            maxWidth: "85%",
          }}
        >
          {b.headline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: subheadSize,
            fontWeight: 500,
            color: "#A8B3C4",
            letterSpacing: 0.2,
            lineHeight: 1.4,
            maxWidth: "85%",
          }}
        >
          {b.subhead}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: Math.round(20 * scale),
            color: "#A8B3C4",
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          getmefound.ai
        </div>
        <div
          style={{
            display: "flex",
            fontSize: Math.round(16 * scale),
            color: "#7CE7B7",
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Run the rest →
        </div>
      </div>
    </div>
  );
}

function PersonBanner({ b }: { b: Banner }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: "linear-gradient(135deg, #0A1628 0%, #142a44 60%, #1a3450 100%)",
        color: "#F8F6F1",
        padding: "48px 72px",
        fontFamily: "sans-serif",
        alignItems: "center",
      }}
    >
      {/* Left — name + role */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 48 }}>
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
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#A8B3C4",
            }}
          >
            AI OUTSOURCE HUB
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -2,
            color: "#F8F6F1",
            marginBottom: 12,
          }}
        >
          {b.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            color: "#7CE7B7",
            letterSpacing: 0.5,
            marginBottom: 16,
          }}
        >
          {b.role}
        </div>
      </div>

      {/* Right — focus / pull-quote */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1.1,
          paddingLeft: 48,
          borderLeft: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 14,
            color: "#7CE7B7",
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          What I do
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.3,
            color: "#F8F6F1",
            letterSpacing: -0.3,
          }}
        >
          {b.focus}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(BANNERS).map((platform) => ({ platform }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const b = BANNERS[platform];

  if (!b) {
    return new Response("Banner not found", { status: 404 });
  }

  return new ImageResponse(b.variant === "brand" ? <BrandBanner b={b} /> : <PersonBanner b={b} />, {
    width: b.width,
    height: b.height,
  });
}
