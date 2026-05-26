import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

const SIZE = { width: 1080, height: 1080 } as const;

type CompareData = {
  eyebrow: string;
  leftLabel: string;
  rightLabel: string;
  leftRows: string[];
  rightRows: string[];
  leftBadge: string;
  rightBadge: string;
  caption: string;
};

const COMPARES: Record<string, CompareData> = {
  "after-hours-payback": {
    eyebrow: "AFTER-HOURS CALLS · ONE WEEK",
    leftLabel: "Without 24/7 phone answering",
    rightLabel: "With Relay running",
    leftRows: [
      "Mon 7:43pm — voicemail",
      "Mon 11:02pm — voicemail",
      "Tue 6:55am — voicemail",
      "Tue 8:14pm — voicemail",
      "Wed 11:41pm — voicemail",
      "Thu 5:48am — voicemail",
      "Thu 7:22pm — voicemail",
      "Fri 10:30pm — voicemail",
      "Sat 2:10pm — voicemail",
    ],
    rightRows: [
      "Mon 7:43pm — booked Wed 9am",
      "Mon 11:02pm — quoted, called back",
      "Tue 6:55am — booked same day",
      "Tue 8:14pm — booked Thu 8am",
      "Wed 11:41pm — booked Thu 7am",
      "Thu 5:48am — booked same day",
      "Thu 7:22pm — quoted, called back",
      "Fri 10:30pm — booked Sat 11am",
      "Sat 2:10pm — booked Mon 7am",
    ],
    leftBadge: "9 missed",
    rightBadge: "9 booked",
    caption: "Same shop. Same week. Different phone.",
  },
};

export function generateStaticParams() {
  return Object.keys(COMPARES).map((theme) => ({ theme }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const d = COMPARES[theme];

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
          padding: 48,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#2D6A4F",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 800,
              marginRight: 12,
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
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
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          {d.eyebrow}
        </div>

        {/* Two columns */}
        <div style={{ display: "flex", flexDirection: "row", gap: 22, flex: 1 }}>
          {/* Left — missed */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              background: "rgba(234,67,53,0.08)",
              border: "1px solid rgba(234,67,53,0.35)",
              borderRadius: 18,
              padding: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  color: "#FF8A80",
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {d.leftLabel}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 800,
                  background: "#c62828",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                {d.leftBadge}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {d.leftRows.map((r) => (
                <div
                  key={r}
                  style={{
                    display: "flex",
                    fontSize: 16,
                    color: "#FFD8D5",
                    background: "rgba(0,0,0,0.18)",
                    padding: "9px 12px",
                    borderRadius: 8,
                    letterSpacing: 0.1,
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>

          {/* Right — booked */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              background: "rgba(16,163,127,0.10)",
              border: "1px solid rgba(16,163,127,0.45)",
              borderRadius: 18,
              padding: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  color: "#7CE7B7",
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {d.rightLabel}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 800,
                  background: "#1b5e20",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                {d.rightBadge}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {d.rightRows.map((r) => (
                <div
                  key={r}
                  style={{
                    display: "flex",
                    fontSize: 16,
                    color: "#CFEFD8",
                    background: "rgba(0,0,0,0.18)",
                    padding: "9px 12px",
                    borderRadius: 8,
                    letterSpacing: 0.1,
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 22,
            fontSize: 24,
            fontWeight: 600,
            color: "#F8F6F1",
            letterSpacing: -0.3,
          }}
        >
          {d.caption}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div style={{ display: "flex", fontSize: 18, color: "#A8B3C4", fontWeight: 600 }}>
            getmefound.ai/checkout/always-ready
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              color: "#7CE7B7",
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Relay — $299/mo →
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
