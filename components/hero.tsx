"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "64px",
      }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
        <h1
          className="animate-fade-up"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.75rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#F5F5F7",
            lineHeight: 1.15,
            textWrap: "balance",
            marginBottom: "1.5rem",
          }}
        >
          We run AI for local businesses.{" "}
          <span style={{ color: "rgba(245,245,247,0.55)" }}>You&nbsp;don&apos;t learn it.</span>
        </h1>
        <p
          className="animate-fade-up animation-delay-100"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "#71717A",
            maxWidth: "38rem",
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
            textWrap: "balance",
          }}
        >
          The phone gets answered. Reviews go up. You keep doing the work that pays you.
        </p>
        <div
          className="animate-fade-up animation-delay-200"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem" }}
        >
          <Link
            href="#diagnostic"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem 2rem",
              fontSize: "1rem",
              fontWeight: 500,
              backgroundColor: "#0EA5E9",
              color: "#F5F5F7",
              borderRadius: "0.5rem",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0284C7")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0EA5E9")}
          >
            Run my free diagnostic
          </Link>
          <Link
            href="#services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1rem",
              color: "#71717A",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F7")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
          >
            See what we run <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
