const stats = [
  {
    value: "25%",
    label: "of web searches now go through AI tools",
  },
  {
    value: "10×",
    label: "more clicks for #1 vs #5 in AI results",
  },
  {
    value: "$1/day",
    label: "Live in 48 hours. No contract.",
  },
];

export function SocialProof() {
  return (
    <section
      aria-label="Key stats"
      className="bg-[var(--color-bg-dark-card)] py-16 md:py-20 text-[var(--color-hero-text)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {stats.map((s) => (
            <div key={s.value} className="text-center md:text-left">
              <div className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-hero-text)]">
                {s.value}
              </div>
              <p className="mt-3 text-base md:text-lg text-[var(--color-hero-subtext)] leading-relaxed">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
