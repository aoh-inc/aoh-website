import Link from "next/link";

export function GameChanged() {
  return (
    <section
      aria-label="The game changed"
      className="border-y border-border bg-(--color-bg-page) py-20 md:py-30"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">
          The game changed
        </p>

        <h2 className="mt-5 text-[clamp(2.1rem,6vw,3.2rem)] font-semibold leading-[1.05] tracking-tight text-text-body">
          The old game was rigged.{" "}
          <span className="text-accent">The new one isn&apos;t.</span>
        </h2>

        <p className="mt-6 text-lg leading-relaxed text-text-muted md:text-xl">
          Google used to reward the biggest budget. Now it rewards the most complete listing. That&apos;s a game any local business can win.
        </p>

        <Link
          href="/report/ai-visibility"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-accent) px-7 py-3.5 text-base font-semibold text-(--color-accent-text) transition-all hover:-translate-y-0.5 hover:bg-(--color-accent-hover) hover:shadow-2xl hover:shadow-(--color-accent)/30"
        >
          See if AI recommends you
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </section>
  );
}
