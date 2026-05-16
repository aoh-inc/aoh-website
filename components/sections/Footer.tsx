"use client";

import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { usePathname } from "next/navigation";

const services = [
  { href: "/pricing#review-automation", label: "Review Automation" },
  { href: "/pricing#ai-visibility", label: "AI Visibility" },
  { href: "/pricing#reach", label: "Reach" },
  { href: "/pricing#relay", label: "Relay" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/pricing#review-automation", label: "What We Do" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  {
    label: "Email",
    href: "mailto:support@aioutsourcehub.com",
    Icon: (props: { className?: string }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 5L2 7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/ai-outsource-hub",
    Icon: (props: { className?: string }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/aioutsourcehub",
    Icon: (props: { className?: string }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/aioutsourcehub",
    Icon: (props: { className?: string }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

export function Footer() {
  const pathname = usePathname();
  if (
    pathname === "/mike-mc" ||
    pathname.startsWith("/mike-mc/") ||
    pathname === "/control" ||
    pathname.startsWith("/control/")
  ) return null;
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const withLocale = (path: string) => {
    if (!isSpanish) return path;
    if (path === "/") return "/es";
    if (path === "/#faq") return "/es#faq";
    return `/es${path}`;
  };
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[var(--color-hero-bg)] text-[var(--color-hero-subtext)] border-t border-[var(--color-hero-border)]">
      {/* Decorative blur orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-96 w-96 -mr-32 -mt-32 rounded-full bg-[var(--color-accent)]/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 -ml-24 -mb-24 rounded-full bg-[var(--color-accent)]/5 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-12">
          {/* Brand block — 4 cols on md+ */}
          <div className="col-span-2 md:col-span-4">
            <Link href={withLocale("/")} className="inline-block">
              <Image
                src="/AOH-logo-dark-bg.svg"
                alt="AI Outsource Hub"
                width={140}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              You run the business. We run the rest.
            </p>
            <p className="mt-3 text-sm">
              <a
                href="mailto:support@aioutsourcehub.com"
                className="hover:text-[var(--color-hero-text)] transition-colors"
              >
                support@aioutsourcehub.com
              </a>
            </p>

            {/* Social icons w/ accent glow on hover */}
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group relative flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-[var(--color-hero-subtext)] shadow-[0_0_0_0_rgba(45,106,79,0)] transition-all duration-300 hover:bg-[var(--color-accent)]/15 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-hero-text)] hover:shadow-[0_0_24px_2px_rgba(45,106,79,0.45)]"
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services — 2 cols */}
          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-hero-text)]">
              Services
            </h3>
            <ul className="space-y-1.5 text-sm">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={withLocale(s.href)}
                    className="hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — 2 cols */}
          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-hero-text)]">
              Company
            </h3>
            <ul className="space-y-1.5 text-sm">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={withLocale(c.href)}
                    className="hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {isSpanish && c.label === "What We Do"
                      ? "Qué Hacemos"
                      : isSpanish && c.label === "About"
                        ? "Nosotros"
                        : isSpanish && c.label === "Contact"
                          ? "Contacto"
                          : c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter — 4 cols */}
          <div className="col-span-2 md:col-span-4">
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom row — pulled up, single line w/ legal + Hub360ai credit */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-hero-border)] pt-5 text-xs md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <p>&copy; {year} AI Outsource Hub.</p>
            <Link href={withLocale("/privacy")} className="hover:text-[var(--color-hero-text)] transition-colors">
              {isSpanish ? "Privacidad" : "Privacy"}
            </Link>
            <Link href={withLocale("/terms")} className="hover:text-[var(--color-hero-text)] transition-colors">
              {isSpanish ? "Términos" : "Terms"}
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-hero-subtext)]/70">
            <span>Runs on</span>
            <Image
              src="/hub360ai/hub360ai-icon-mono.svg"
              alt="Hub360ai"
              width={18}
              height={18}
              className="h-4 w-4 opacity-80"
            />
            <span className="font-mono text-[var(--color-hero-text)]">Hub360ai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
