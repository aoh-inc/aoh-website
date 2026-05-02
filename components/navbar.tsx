"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s, border-color 0.3s",
        backgroundColor: isScrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled ? "1px solid #27272A" : "1px solid transparent",
      }}
    >
      <nav style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", height: "64px", alignItems: "center", justifyContent: "space-between" }}>
          {/* Wordmark */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
            <span style={{ fontSize: "1.125rem", fontWeight: 300, color: "rgba(245,245,247,0.7)" }}>AI</span>
            <span style={{ fontSize: "1.125rem", fontWeight: 500, color: "#F5F5F7" }}>Outsource Hub</span>
          </Link>

          {/* Center links — hidden on small screens via inline media would need CSS class; use a simple flex that wraps */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "2rem" }}>
            {["Services", "About", "FAQ", "Contact"].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                style={{ fontSize: "0.875rem", color: "#71717A", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F7")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="#diagnostic"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#F5F5F7",
              border: "1px solid #27272A",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#141419";
              e.currentTarget.style.borderColor = "rgba(14,165,233,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#27272A";
            }}
          >
            Run free diagnostic
          </Link>
        </div>
      </nav>
    </header>
  );
}
