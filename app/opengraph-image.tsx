import { ImageResponse } from "next/og";

export const alt = "AI Outsource Hub — AI Services for Local Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0A1628",
          color: "#F8F6F1",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#3D7A65",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#2D6A4F",
            }}
          />
          AI Outsource Hub
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 960,
            }}
          >
            You run your business. We run the AI.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#A8B3C4",
            fontSize: 32,
          }}
        >
          <div style={{ display: "flex", maxWidth: 760 }}>
            Review automation, AI voice agents, and AI visibility for local businesses.
          </div>
          <div style={{ display: "flex", color: "#3D7A65", fontWeight: 600 }}>
            From $1/day
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
