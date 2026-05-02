"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" style={{ padding: "3rem 0", borderTop: "1px solid #27272A" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "1.125rem", fontWeight: 300, color: "rgba(245,245,247,0.7)" }}>AI</span>
            <span style={{ fontSize: "1.125rem", fontWeight: 500, color: "#F5F5F7" }}>Outsource Hub</span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Contact", href: "#contact" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ fontSize: "0.875rem", color: "#71717A", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F7")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <a
            href="mailto:hello@aioutsourcehub.com"
            style={{ fontSize: "0.875rem", color: "#71717A", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F7")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
          >
            hello@aioutsourcehub.com
          </a>
          <p style={{ fontSize: "0.875rem", color: "#71717A", margin: 0 }}>&copy; 2026 AI Outsource Hub</p>
        </div>
      </div>
    </footer>
  );
}
