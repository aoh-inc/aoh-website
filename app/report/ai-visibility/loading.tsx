export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-body)]">
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="h-4 w-32 rounded bg-white/10 mb-4 animate-pulse" />
          <div className="h-10 w-2/3 rounded bg-white/10 mb-4 animate-pulse" />
          <div className="h-5 w-48 rounded bg-white/10 animate-pulse" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 h-28 animate-pulse" />
          ))}
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 h-64 animate-pulse mb-5" />
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 h-40 animate-pulse" />
      </section>
    </main>
  );
}
