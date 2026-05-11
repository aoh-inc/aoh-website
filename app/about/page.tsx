import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Built by Mike Egidio after 15 years explaining technology to non-technical buyers. AI Outsource Hub runs the AI so local businesses don't have to.",
  alternates: { canonical: "/about" },
};

const breadcrumb = pageBreadcrumbs("About", "/about");

// Display serif (Fraunces) applied via inline className. Variable is `--font-fraunces`.
const serif = "[font-family:var(--font-fraunces)]";

type TeamMember = {
  name: string;
  role: string;
  niches: string;
  photo?: string;
  initials: string;
};

const team: TeamMember[] = [
  {
    name: "Mike Egidio",
    role: "Founder",
    niches: "Pet groomers, funeral homes, movers, marketing consultants",
    photo: "/team/mike.jpg",
    initials: "ME",
  },
  {
    name: "Kip Leathers",
    role: "Co-founder · Business Development",
    niches: "Vets, senior living, auto repair, B2B services",
    initials: "KL",
  },
  {
    name: "Teri Egidio",
    role: "Outreach",
    niches: "Nursing homes",
    initials: "TE",
  },
];

const principles = [
  {
    title: "Free report first",
    body: "Every client gets a free audit before paying a dollar. Trust comes before invoices.",
  },
  {
    title: "No contracts",
    body: "Cancel anytime. We keep you by doing good work or not at all.",
  },
  {
    title: "Honest timelines",
    body: "Reviews in 48 hours. Rankings move in 60–90 days. No inflated promises.",
  },
  {
    title: "Less than 10 min of your time",
    body: "Setup once. After that, hands-off. You run your business.",
  },
];

const timeline = [
  { year: "2010", label: "Started selling tech to schools" },
  { year: "2016", label: "Built + sold an EdTech business" },
  { year: "2023", label: "Watched AI hit the same gap" },
  { year: "2026", label: "AOH ships to local businesses" },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col bg-[var(--color-bg-page)] text-[var(--color-text-body)] focus:outline-none"
      >
        {/* ════════════════════════════════════════════
            HERO — text-only, company-led, oversized serif
            ════════════════════════════════════════════ */}
        <section aria-label="About AI Outsource Hub" className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-32">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
              About
            </p>
            <h1
              className={`${serif} text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[var(--color-text-body)] mb-8 max-w-4xl`}
              style={{ fontWeight: 600, fontVariationSettings: '"opsz" 144' }}
            >
              We run the AI. You run your business.
            </h1>
            <p className={`${serif} text-xl md:text-2xl italic text-[var(--color-text-muted)] leading-relaxed max-w-2xl`}>
              A done-for-you AI services agency for local small businesses. Built by people who&apos;ve spent fifteen years explaining technology to non-technical buyers.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FOUNDER LETTER — narrow column, drop-cap, signed
            ════════════════════════════════════════════ */}
        <section aria-label="Founder letter" className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-2xl px-6 py-20 md:py-28">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent)]">
              A note from Mike
            </p>

            <div className={`${serif} space-y-7 text-[17px] md:text-[19px] leading-[1.7] text-[var(--color-text-body)]`}>
              <p className="first-letter:font-bold first-letter:text-[5.5rem] first-letter:leading-[0.85] first-letter:float-left first-letter:pr-3 first-letter:mt-1 first-letter:text-[var(--color-accent)]">
                For fifteen years I sold technology to schools — district administrators, principals, IT coordinators, mostly small operations without anyone in the building who spoke engineer. My job was to translate. I&apos;d walk in, listen to what they were actually trying to do, and explain what tools would help and how to make them work day to day. I eventually built and sold an EdTech company doing exactly that.
              </p>
              <p>
                The pattern was always the same: smart, busy people running important operations who didn&apos;t have time to learn a new tool or hire someone to run it. They wanted the outcome — the gradebook that worked, the network that didn&apos;t go down — not a new responsibility.
              </p>
              <p>
                A few years ago I started watching the same shape repeat with AI. Local businesses being told they needed to &ldquo;use AI&rdquo; but with no time to learn another platform, configure another dashboard, or train another chatbot. The tools are getting more useful fast. The gap between what&apos;s possible and what most owners can act on is widening.
              </p>
              <p>
                That&apos;s the gap AOH closes. We operate the AI on your behalf. You run your business. We run the tools — reviews, AI visibility, voice, content, leads. You get the outcome. We do the work. Same job I&apos;ve been doing for fifteen years, different industry, different stack.
              </p>
              <p>
                I don&apos;t pretend to have proven this yet for AOH. We&apos;re early. But I&apos;ve explained tech to non-technical buyers for a long time, and I&apos;ve shipped working software the whole way through. If that sounds like what you&apos;d want behind the AI in your business, talk to me.
              </p>
            </div>

            <p className={`${serif} mt-10 text-2xl italic text-[var(--color-text-body)]`}>— Mike</p>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TIMELINE — thin editorial strip, no cards
            ════════════════════════════════════════════ */}
        <section aria-label="Career timeline" className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {timeline.map((t) => (
                <div key={t.year} className="text-center md:text-left">
                  <p className="font-mono text-2xl md:text-3xl font-bold text-[var(--color-accent)] mb-1">
                    {t.year}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] leading-snug max-w-[16ch] mx-auto md:mx-0">
                    {t.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PULL QUOTE — oversize serif, centered
            ════════════════════════════════════════════ */}
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28 text-center">
            <blockquote
              className={`${serif} text-3xl md:text-5xl italic leading-[1.15] tracking-tight text-[var(--color-text-body)]`}
              style={{ fontWeight: 400, fontVariationSettings: '"opsz" 144' }}
            >
              &ldquo;The way customers find local businesses just changed. Most are completely invisible across the new channels.&rdquo;
            </blockquote>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
              Google · Maps · ChatGPT · Perplexity · Google AI Overviews
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PRINCIPLES — numbered, no cards
            ════════════════════════════════════════════ */}
        <section aria-label="How we work" className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent)]">
              How we work
            </p>
            <h2
              className={`${serif} text-3xl md:text-5xl font-semibold tracking-tight mb-12 text-[var(--color-text-body)]`}
            >
              Four rules. No exceptions.
            </h2>

            <ol className="space-y-10">
              {principles.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[3rem_1fr] md:grid-cols-[5rem_1fr] gap-4 md:gap-8 border-t border-[var(--color-border)] pt-6">
                  <span
                    className={`${serif} text-3xl md:text-5xl text-[var(--color-text-muted)]/40 leading-none`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className={`${serif} text-xl md:text-2xl font-semibold text-[var(--color-text-body)] mb-2`}>
                      {p.title}
                    </h3>
                    <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TEAM — asymmetric grid (Mike 2x, K + T 1x)
            ════════════════════════════════════════════ */}
        <section aria-label="The team" className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent)]">
              The team
            </p>
            <h2 className={`${serif} text-3xl md:text-5xl font-semibold tracking-tight mb-12 text-[var(--color-text-body)]`}>
              Three people. Eight niches.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Mike — 2 cols */}
              <div className="md:col-span-2">
                <div className="relative aspect-square rounded-sm overflow-hidden mb-5 bg-[var(--color-bg-elevated)]">
                  {team[0].photo && (
                    <Image
                      src={team[0].photo}
                      alt={`${team[0].name}, ${team[0].role}`}
                      fill
                      sizes="(min-width: 768px) 24rem, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <h3 className={`${serif} text-2xl md:text-3xl font-semibold text-[var(--color-text-body)]`}>
                  {team[0].name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {team[0].role}
                </p>
                <p className="mt-4 text-base text-[var(--color-text-muted)] leading-relaxed max-w-md">
                  Spent 15 years explaining technology to schools without in-house tech teams. Built and sold the EdTech company that came out of it. Now does the same job for local businesses — operating the AI so owners don&apos;t have to learn it.
                </p>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-body)] mr-1.5">Covers</span>
                  {team[0].niches}
                </p>
              </div>

              {/* Kip + Teri — 1 col each, compact */}
              {team.slice(1).map((m) => (
                <div key={m.name}>
                  <div className="relative aspect-square rounded-sm overflow-hidden mb-4 bg-[var(--color-bg-elevated)] flex items-center justify-center">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={`${m.name}, ${m.role}`}
                        fill
                        sizes="12rem"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={`${serif} text-5xl text-[var(--color-text-muted)]/50`}
                      >
                        {m.initials}
                      </span>
                    )}
                  </div>
                  <h3 className={`${serif} text-xl font-semibold text-[var(--color-text-body)]`}>
                    {m.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    {m.role}
                  </p>
                  <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-snug">
                    {m.niches}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CONTACT — minimal, email-led, form below
            ════════════════════════════════════════════ */}
        <section aria-label="Contact" className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent)]">
                  Talk to a human
                </p>
                <h2 className={`${serif} text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-[var(--color-text-body)]`}>
                  Easiest way to reach us is just to write.
                </h2>

                <a
                  href="mailto:support@aioutsourcehub.com"
                  className={`${serif} block text-2xl md:text-3xl font-semibold text-[var(--color-accent)] hover:underline underline-offset-4 break-all`}
                >
                  support@aioutsourcehub.com
                </a>

                <div className="mt-5 inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  Response time: usually within a few hours
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>

        {/* Bottom — quiet outro, no big CTA block */}
        <section className="bg-[var(--color-bg-page)]">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
            <p className={`${serif} text-xl md:text-2xl italic text-[var(--color-text-muted)] leading-relaxed`}>
              Or if you&apos;d rather see what AOH looks like for your business —
            </p>
            <Link
              href="/#calculator"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-4 transition-colors"
            >
              get your free report →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
