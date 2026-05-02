export function StakesBand() {
  return (
    <section
      style={{
        padding: "5rem 0",
        borderTop: "1px solid #27272A",
        borderBottom: "1px solid #27272A",
      }}
    >
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
        <p
          style={{
            fontSize: "clamp(1.25rem, 3vw, 2.25rem)",
            fontWeight: 500,
            color: "#F5F5F7",
            letterSpacing: "-0.02em",
            lineHeight: 1.4,
            textWrap: "balance",
          }}
        >
          No app to download. No dashboard to learn. We send you a daily text.{" "}
          <span style={{ color: "#71717A" }}>That&apos;s it.</span>
        </p>
      </div>
    </section>
  );
}
