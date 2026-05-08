export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section
      aria-label="Page header"
      className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {eyebrow && (
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="font-semibold leading-[1.05] tracking-tight text-4xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-[var(--color-hero-subtext)] leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
