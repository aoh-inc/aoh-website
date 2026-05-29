"use client";

import { motion } from "framer-motion";

const SIGNALS = [
  { label: "Your business facts matching everywhere AI looks", detail: "Name, address, phone, and services need to say the same thing on Google, Apple Maps, Bing, Yelp, and dozens of other places AI reads. One mismatch creates doubt." },
  { label: "Whether AI can read and understand your site", detail: "We add the code in the background that tells AI exactly who you are, what you do, and where you serve it — without changing how your site looks to customers." },
  { label: "Your Google profile being complete, not just claimed", detail: "Hours, service categories, photos, Q&A, and the right business attributes all tell AI you're a real, active business. A half-filled profile tells it the opposite." },
  { label: "Review freshness and pace", detail: "AI pays attention to how recently and how consistently you get reviews — not just your star rating. Stale reviews tell it the business may not be active." },
  { label: "Your website saying the same thing as your Google listing", detail: "AI cross-checks. If your website says Tuesday–Saturday but your Google listing says Monday–Friday, AI sees a conflict and trusts you less." },
  { label: "Being seen across the web consistently", detail: "The more places AI finds the same accurate information about you — in directories, local sites, and listings — the more confident it is recommending you." },
  { label: "What your reviews actually say", detail: "AI reads the words in reviews, not just the stars. Reviews that mention specific services and outcomes carry more weight than generic five-star praise." },
  { label: "Being ready to show up when AI generates an answer", detail: "When Google AI, ChatGPT, or Gemini write a local recommendation, they pull from businesses with clean, verifiable, consistent facts. We build that readiness." },
  { label: "Staying active, not just set-and-forgotten", detail: "Regular posts, photo updates, and profile activity tell AI your business is running. A profile that hasn't changed in a year looks like it might be closed." },
  { label: "How you respond to reviews", detail: "Consistent, professional responses — especially to negative reviews — show AI (and customers) that a real, engaged person is running the business." },
  { label: "Being listed in the right category", detail: "AI uses your primary business category as one of its first filters. Being in the wrong category — or missing secondary ones — can cut you out before anything else is checked." },
  { label: "Your review path actually working", detail: "Having a clear, frictionless way for happy customers to leave reviews is how you build the velocity AI looks for. Most businesses have this broken." },
  { label: "GEO and AEO readiness (for researchers)", detail: "Generative Engine Optimization and Answer Engine Optimization: the 2026 practice of engineering the signals AI uses when generating local recommendations — rather than optimizing for ten blue links." },
];

export function SignalStack() {
  return (
    <section
      aria-labelledby="ss-title"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-10 max-w-3xl"
        >
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Under the hood
          </p>
          <h2 id="ss-title" className="text-3xl font-bold leading-tight text-[var(--color-text-body)] md:text-4xl">
            Your Signal Stack
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
            These are the signals Google AI, ChatGPT, Claude, and Gemini cross-check before they
            trust — and recommend — your business. Miss the consistency between any of them and AI
            discounts all of it.{" "}
            <span className="font-semibold text-[var(--color-text-body)]">
              Knowing which signals matter, in what order, is the work.
            </span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map((signal, i) => (
            <motion.div
              key={signal.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4), ease: "easeOut" }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-4"
            >
              <div className="mb-1.5 flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                />
                <p className="text-sm font-semibold leading-snug text-[var(--color-text-body)]">
                  {signal.label}
                </p>
              </div>
              <p className="pl-3.5 text-xs leading-relaxed text-[var(--color-text-muted)]">
                {signal.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04] p-5 md:p-6"
        >
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-body)]">
              This is what GetMeFound&apos;s Visibility Engine does in 48 hours
            </span>{" "}
            — map every signal listed above for your specific business, fix the ones that are wrong
            or missing, and start building the ones AI uses to decide who to recommend. No other
            local marketing service runs all of these as a system.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
