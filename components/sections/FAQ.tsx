const faqs = [
  {
    q: "How is AOH different from other agencies?",
    a: "No contract, cancel anytime. We give you a free report before you pay a single dollar. We have to earn your trust before we ask for anything.",
  },
  {
    q: "Will AI responses sound fake and hurt me with Google?",
    a: "Generic AI responses do hurt rankings. Ours are different — every response is written in your specific business voice using your tone profile. Personalized and indistinguishable from something your best employee would write.",
  },
  {
    q: "How much of my time does this take?",
    a: "Less than 10 minutes of setup, then completely hands-off. We handle everything — requests, responses, optimization. You run your business, we handle your reputation.",
  },
  {
    q: "How long before I see results?",
    a: "Review requests start going out within 48 hours of setup. Most clients see new reviews within the first two weeks. Google ranking improvements typically take 60–90 days.",
  },
  {
    q: "Is AI visibility just regular SEO with a new name?",
    a: "Different mechanism entirely. Traditional SEO gets you a spot on Google's list of links. AI visibility gets your business recommended by name when someone asks ChatGPT who's the best plumber near me — that's a recommendation, not a ranking.",
  },
  {
    q: "Why do I need to keep paying monthly?",
    a: "AI search constantly retrains. Google's algorithm keeps changing. Review velocity matters — a business that stops getting reviews looks inactive to both customers and algorithms. Your monthly fee keeps you active, monitored, and found.",
  },
  {
    q: "What if I get a bad review?",
    a: "A professional, calm response in your voice does more for your reputation than ignoring it. We respond to every review, positive or negative, and we do it well.",
  },
  {
    q: "You're a new company — why should I trust you?",
    a: "We're new and we know it. That's exactly why we don't lock you into contracts, we give you a free audit before you pay anything, and we're transparent about our pricing. We have to earn your business — and we plan to.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-[var(--color-bg-page)] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            FAQ
          </p>
          <h2 className="text-3xl font-bold text-[var(--color-text-body)] md:text-4xl">
            Questions owners actually ask.
          </h2>
        </div>

        <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-[var(--color-text-body)]">
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
