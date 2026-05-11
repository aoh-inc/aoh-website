import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI Outsource Hub runs AI on behalf of local businesses. You run your business. We run the AI. No contracts. Free reports before you pay anything.",
  alternates: { canonical: "/about" },
};

const breadcrumb = pageBreadcrumbs("About", "/about");

const pillars = [
  {
    icon: "📋",
    title: "Free report first",
    body: "Every client gets a free audit before paying a dollar.",
  },
  {
    icon: "🔓",
    title: "No contracts",
    body: "Cancel anytime. We keep you by doing good work or not at all.",
  },
  {
    icon: "⏱",
    title: "Honest timelines",
    body: "Reviews in 48 hours. Rankings move in 60–90 days. No inflated promises.",
  },
  {
    icon: "✋",
    title: "Less than 10 min of your time",
    body: "Setup once. After that, hands-off.",
  },
];

const stats = [
  {
    value: "15+ years",
    label: "automating the work",
    border: "border-t-green-500",
    text: "text-green-500",
  },
  {
    value: "48 hours",
    label: "to first review",
    border: "border-t-amber-500",
    text: "text-amber-500",
  },
  {
    value: "<10 min",
    label: "of your time after setup",
    border: "border-t-blue-500",
    text: "text-blue-500",
  },
  {
    value: "0",
    label: "contracts, ever",
    border: "border-t-gray-900",
    text: "text-gray-900",
  },
];

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

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* HERO with photo */}
      <section
        aria-label="About AOH"
        className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-10 md:gap-14 items-center">
            <div className="relative mx-auto md:mx-0 w-56 md:w-72 aspect-square rounded-2xl overflow-hidden ring-2 ring-[var(--color-accent)]/40 shadow-2xl">
              <Image
                src="/team/mike.jpg"
                alt="Mike Egidio, founder of AI Outsource Hub"
                fill
                sizes="(min-width: 768px) 18rem, 14rem"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                About AOH
              </p>
              <h1 className="font-semibold leading-[1.05] tracking-tight text-4xl md:text-6xl mb-5">
                You run your business. We run the AI.
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-hero-subtext)] leading-relaxed max-w-2xl mb-6">
                A done-for-you AI services agency for local small businesses. We operate the tools so owners never have to learn them.
              </p>
              <Link
                href="/#calculator"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-3 text-sm font-semibold transition-all hover:gap-2.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/30"
              >
                Get your free report
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PageBody>
        {/* WHY AOH EXISTS — story + pull-quote sidebar */}
        <PageSection>
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why AOH exists</h2>
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-5">
                Local business owners are being told they need to &ldquo;use AI&rdquo; — but most don&apos;t have time to learn another tool, configure another dashboard, or babysit another platform. They run businesses. They serve customers. They don&apos;t have evenings to spend training a chatbot.
              </p>
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-5">
                AOH is the layer between local businesses and the AI tools reshaping how customers find them. We operate review automation, AI voice agents, AI visibility, content production, and custom AI agents on behalf of our clients. They get the outcome. We do the work.
              </p>
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
                Most owners stay invisible across the new channels because keeping up is a full-time job. We make that job ours.
              </p>
            </div>

            <aside className="rounded-2xl bg-[var(--color-bg-dark-card)] text-[var(--color-hero-text)] p-7 md:p-8 ring-1 ring-[var(--color-hero-border)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
                The shift
              </p>
              <blockquote className="text-xl md:text-2xl font-semibold leading-snug">
                &ldquo;The way customers find local businesses just changed. Most are completely invisible across the new channels. We fix that.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-[var(--color-hero-subtext)]">
                — Google · Maps · ChatGPT · Perplexity · Google AI Overviews
              </p>
            </aside>
          </div>
        </PageSection>

        {/* HOW WE WORK — 2x2 icon cards */}
        <PageSection className="border-t border-[var(--color-border)]">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">How we work</h2>
          <p className="text-lg text-[var(--color-text-muted)] mb-8">
            Four rules we hold ourselves to.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.08}
                className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-7 hover:shadow-lg transition-shadow"
              >
                <div className="mb-3 text-3xl" aria-hidden="true">
                  {p.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </PageSection>

        {/* STATS ROW — matches pricing page style */}
        <PageSection className="border-t border-[var(--color-border)] !py-12 md:!py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`rounded-2xl border border-[var(--color-border)] border-t-[3px] ${s.border} bg-[var(--color-bg-elevated)] px-5 py-5 text-center`}
              >
                <p
                  className={`font-mono text-xs uppercase tracking-[0.2em] mb-1 ${s.text}`}
                >
                  {s.value}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </PageSection>

        {/* TEAM */}
        <PageSection className="border-t border-[var(--color-border)]">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">The team</h2>
          <p className="text-lg text-[var(--color-text-muted)] mb-8">
            Three people, eight niches. We know our lanes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <Reveal
                key={m.name}
                delay={i * 0.08}
                className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-6 text-center"
              >
                <div className="mx-auto mb-4 relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={`${m.name}, ${m.role}`}
                      fill
                      sizes="7rem"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold text-[var(--color-accent)]"
                    >
                      {m.initials}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-body)]">{m.name}</h3>
                <p className="mt-1 text-sm font-medium text-[var(--color-accent)]">{m.role}</p>
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {m.niches}
                </p>
              </Reveal>
            ))}
          </div>
        </PageSection>

        {/* TALK TO A HUMAN */}
        <PageSection className="border-t border-[var(--color-border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Talk to a human.</h2>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                Response time: usually within a few hours
              </div>

              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-6">
                Questions about pricing, setup, or whether AOH is right for your business? Send us a note. We answer every message.
              </p>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-1.5">
                  Email
                </p>
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-lg font-semibold text-[var(--color-accent)] hover:underline break-all"
                >
                  support@aioutsourcehub.com
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </PageSection>

        <CtaBlock
          headline="Or get your free report."
          subline="No credit card. No contract. We'll show you exactly where you stand and what to fix first."
        />
      </PageBody>
    </>
  );
}
