import { FAQ_ITEMS } from "@/lib/faq";

export function FAQ() {
  return (
    <section id="faq" className="bg-[var(--color-bg-page)] py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            FAQ
          </p>
          <h2 className="text-3xl font-bold text-[var(--color-text-body)] md:text-4xl">
            Questions owners actually ask.
          </h2>
        </div>

        <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-lg font-semibold text-[var(--color-text-body)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-page)]">
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-[var(--color-text-muted)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
