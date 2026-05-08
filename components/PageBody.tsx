import Link from "next/link";

export function PageBody({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
      {children}
    </main>
  );
}

export function PageSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-4xl px-6">{children}</div>
    </section>
  );
}

export function CtaBlock({
  headline = "Ready to start?",
  subline = "Free report. No credit card. No contract.",
  buttonText = "Get My Free Report",
  buttonHref = "/#calculator",
}: {
  headline?: string;
  subline?: string;
  buttonText?: string;
  buttonHref?: string;
}) {
  return (
    <section className="py-16 md:py-20 bg-[var(--color-bg-page)]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl bg-[var(--color-bg-dark-card)] p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-hero-text)] mb-4">
            {headline}
          </h2>
          <p className="text-[var(--color-hero-subtext)] text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {subline}
          </p>
          <Link
            href={buttonHref}
            className="inline-flex bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-8 py-4 rounded-xl font-semibold transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
