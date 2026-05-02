"use client";

import Link from "next/link";

const painPoints = [
  {
    title: "Reviews are slipping",
    consequence: "Customers check before they call. Fewer stars, fewer calls.",
    href: "/reviews",
  },
  {
    title: "Phone rings to voicemail",
    consequence: "Every missed call is a job that went to someone else.",
    href: "/receptionist",
  },
  {
    title: "Need more leads",
    consequence: "You do great work, but the calendar has gaps.",
    href: "/sales-rep",
  },
  {
    title: "Site looks dated",
    consequence: "Customers leave before they learn what you do.",
    href: "/site-refresh",
  },
];

export function Diagnostic() {
  return (
    <section id="diagnostic" style={{ padding: "6rem 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#F5F5F7",
              marginBottom: "1rem",
            }}
          >
            What&apos;s hurting?
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#71717A", maxWidth: "36rem", margin: "0 auto" }}>
            Pick the one that costs you most. We&apos;ll show you what changes.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            maxWidth: "56rem",
            margin: "0 auto",
          }}
        >
          {painPoints.map((point) => (
            <Link
              key={point.href}
              href={point.href}
              style={{
                display: "block",
                backgroundColor: "#141419",
                border: "1px solid #27272A",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                textDecoration: "none",
                transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(14,165,233,0.5)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 0 30px -5px rgba(14,165,233,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272A";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 style={{ fontSize: "1.125rem", fontWeight: 500, color: "#F5F5F7", marginBottom: "0.5rem" }}>
                {point.title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#71717A", lineHeight: 1.6 }}>
                {point.consequence}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
