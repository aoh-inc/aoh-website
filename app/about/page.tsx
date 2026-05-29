import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About — GetMeFound",
  description:
    "GetMeFound helps local businesses get found by Google and AI search. Built by a founder who's been on your side of the desk for 15 years.",
  alternates: { canonical: "/about" },
};

const breadcrumb = pageBreadcrumbs("About", "/about");

const AUDIT_HREF = "/#free-audit";
const MIKE_LINKEDIN = "https://www.linkedin.com/in/mikeegidio/";

const companyRows = [
  {
    label: "WHAT",
    value:
      "GetMeFound engineers your AI visibility signals — done for you, starting with a one-time setup that runs your business through the Visibility Engine.",
  },
  {
    label: "HOW",
    value: "Our team handles it while you focus on running your business.",
  },
  {
    label: "FOR",
    value: "Local service businesses who want more calls, not more dashboards.",
  },
  {
    label: "MODEL",
    value: "Done-for-you · starts at $149 · monthly from $99 · cancel anytime",
  },
  {
    label: "WON'T",
    value: "Make you manage it. That's our job.",
  },
];

const teamMembers = [
  {
    initials: "KL",
    photo: "/team/kip.jpg",
    name: "Kip Leathers",
    title: "Business Development",
    bio: "Thirty years of closing. Kip has spent his career in commission-only sales — the kind where you either find the right people and open the right conversations, or you don't eat. He brings that same discipline to finding local businesses that are losing ground to competitors who just got recommended more.",
    links: [
      { label: "kip@getmefound.ai", href: "mailto:kip@getmefound.ai" },
      { label: "LinkedIn →", href: "https://www.linkedin.com/in/kip-leathers" },
    ],
  },
  {
    initials: "TE",
    photo: "/team/teri.jpg",
    name: "Teri Blackburn",
    title: "Client Success",
    bio: "When something comes up, a real person answers. Teri comes from staffing — an industry where keeping clients and candidates both happy, at the same time, is the whole job. She manages onboarding and makes sure nothing falls through the cracks after you sign up.",
    links: [
      { label: "support@getmefound.ai", href: "mailto:support@getmefound.ai" },
      { label: "LinkedIn →", href: "https://www.linkedin.com/in/teri-blackburn-078990259" },
    ],
  },
];

const founderStats = [
  { stat: "15+ years", label: "building & running businesses" },
  { stat: "1 sold", label: "EdTech co. before this" },
  { stat: "4 hats", label: "sales, marketing, support, tech" },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* §00 — Hero */}
      <section aria-label="About — hero" className="bg-(--color-hero-bg) text-hero-text">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
          <Reveal>
            <h1 className="text-[clamp(2.8rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
              You want more customers.
            </h1>
            <p className="mt-5 text-xl md:text-2xl font-semibold leading-snug text-hero-subtext/80">
              AI decides who to recommend. We make sure it picks you.
            </p>
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-hero-subtext/60">
              Most local owners don&apos;t lose to better businesses. They lose to ones who showed
              up first when AI decided who to recommend. We fix that.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={AUDIT_HREF}
                className="inline-flex items-center justify-center rounded-xl bg-(--color-accent) px-6 py-3 text-sm font-semibold text-(--color-accent-text) transition-all hover:bg-(--color-accent-hover) hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                See if AI recommends you →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-hero-subtext/25 px-6 py-3 text-sm font-semibold text-hero-text transition-all hover:border-hero-subtext/45 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-hero-text focus-visible:ring-offset-2"
              >
                See our plans →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col bg-(--color-bg-page) text-text-body focus:outline-none"
      >
        {/* §01 — The Founder */}
        <section aria-label="The founder" className="border-b border-border py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <p className="mb-8 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted/50">
                §01
              </p>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr] md:items-start">
                {/* Photo + name */}
                <div className="flex flex-col items-start gap-3">
                  <div className="h-44 w-44 overflow-hidden rounded-2xl ring-1 ring-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/team/mike.jpg"
                      alt="Mike Egidio"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-text-body">Mike Egidio</p>
                    <Link
                      href={MIKE_LINKEDIN}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent transition-colors hover:underline"
                    >
                      LinkedIn →
                    </Link>
                    <a
                      href="https://calendly.com/mike-getmefound/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent transition-colors hover:underline"
                    >
                      Book a call →
                    </a>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h2 className="mb-5 text-2xl font-bold leading-tight text-text-body md:text-3xl">
                    He&apos;s been on your side of the desk for 15 years.
                  </h2>
                  <p className="text-base leading-relaxed text-text-muted md:text-lg">
                    Mike is a serial entrepreneur who&apos;s built and sold companies — including an
                    EdTech company that helped schools without in-house tech teams. He&apos;s run
                    every part of a business himself: sales, marketing, support, tech. Every pain
                    point local owners hit — missed leads, invisible online, lost to competitors who
                    just showed up more — he&apos;s solved himself. GetMeFound is the same playbook,
                    done for you.
                  </p>

                  {/* Stats */}
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {founderStats.map(({ stat, label }) => (
                      <div
                        key={stat}
                        className="rounded-xl border border-border bg-(--color-bg-elevated) p-4 text-center"
                      >
                        <p className="text-xl font-bold text-text-body">{stat}</p>
                        <p className="mt-1 text-xs leading-snug text-text-muted">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Secondary CTA */}
                  <div className="mt-6">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-(--color-accent)/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      See our plans →
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* §02 — The Company */}
        <section aria-label="What GetMeFound is" className="border-b border-border py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted/50">
                §02
              </p>
              <h2 className="mb-10 text-2xl font-bold text-text-body md:text-3xl">
                What GetMeFound is.
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-border divide-y divide-border">
                  {companyRows.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex gap-4 bg-(--color-bg-elevated) px-5 py-4"
                    >
                      <span className="mt-0.5 min-w-[56px] flex-shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                        {label}
                      </span>
                      <span className="text-sm leading-relaxed text-text-muted">{value}</span>
                    </div>
                  ))}
                </div>

                {/* OUR PROMISE card */}
                <div className="flex rounded-2xl bg-(--color-bg-dark-card) p-6 text-hero-text ring-1 ring-(--color-hero-border) md:h-full md:self-stretch">
                  <div>
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                      Our Promise
                    </p>
                    <p className="text-sm leading-relaxed text-hero-subtext/80">
                      You almost never log in. Results show up on your phone, in your inbox, and in
                      more calls coming in.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* §03 — Why Now */}
        <section
          aria-label="Why now"
          className="border-b border-border bg-(--color-bg-elevated) pt-16 pb-10 md:pt-24 md:pb-12"
        >
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <p className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted/50">
                §03
              </p>
              <h2 className="mb-7 max-w-2xl text-[clamp(1.8rem,5vw,2.8rem)] font-bold leading-[1.1] text-text-body">
                In May 2026, Google replaced Search with AI. Most local businesses are invisible
                to it.
              </h2>
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
                Google AI Mode has over a billion monthly users and is now the default experience —
                the search box is gone. AI doesn&apos;t show ten results. It picks one or two
                businesses and recommends them by name. If your profile isn&apos;t ready, it skips
                you entirely. We make sure it doesn&apos;t.
              </p>

              {/* Channel tags */}
              <div className="flex flex-wrap gap-2">
                {["GOOGLE", "MAPS", "CHATGPT", "AI OVERVIEWS"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-(--color-bg-page) px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-text-body"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-text-muted">
                Businesses that act first get picked before competitors adapt.
              </p>
              <div className="mt-4">
                <Link
                  href={AUDIT_HREF}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-(--color-accent)/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  See if AI recommends you →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* §04 — The Team */}
        <section aria-label="The team" className="border-b border-border pt-12 pb-16 md:pt-16 md:pb-24">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted/50">
                §04
              </p>
              <h2 className="mb-10 text-2xl font-bold text-text-body md:text-3xl">
                The rest of the team.
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {teamMembers.map(({ initials, photo, name, title, bio, links }) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-border bg-(--color-bg-elevated) p-6"
                  >
                    <div className="mb-4 h-14 w-14 overflow-hidden rounded-full ring-1 ring-border">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt={name} className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-(--color-bg-dark-card) text-sm font-bold text-hero-text">
                          {initials}
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-text-body">{name}</p>
                    {links && links.length > 0 && (
                      <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1">
                        {links.map(({ label, href }) => (
                          <Link
                            key={href}
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-sm text-accent transition-colors hover:underline"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-accent">
                      {title}
                    </p>
                    <p className="text-sm leading-relaxed text-text-muted">{bio}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* §05 — Contact */}
        <section aria-label="Contact" className="bg-(--color-bg-dark-card) py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Reveal>
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                §05
              </p>
              <h2 className="mb-5 text-3xl font-bold text-hero-text md:text-4xl">
                Questions? Just reach out.
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-hero-subtext/70 md:text-lg">
                Partnerships, curiosity, or want to know if GetMeFound makes sense for your
                business — we answer within a few hours.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={AUDIT_HREF}
                  className="group inline-flex items-center gap-2 rounded-xl bg-(--color-accent) px-8 py-4 text-base font-semibold text-(--color-accent-text) transition-all hover:bg-(--color-accent-hover) hover:-translate-y-0.5 hover:shadow-xl hover:shadow-(--color-accent)/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  Get my free visibility check
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] px-6 py-4 text-base font-semibold text-hero-text ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
                >
                  Send a message →
                </Link>
              </div>
              <p className="mt-4 text-sm text-hero-subtext/40">
                Prefer a call?{" "}
                <a
                  href="https://calendly.com/mike-getmefound/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hero-subtext/60 underline underline-offset-2 hover:text-hero-subtext/80 transition-colors"
                >
                  Book 30 minutes →
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
