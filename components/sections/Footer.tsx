"use client";

import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { usePathname } from "next/navigation";

const services = [
  { href: "/pricing#get-found-refresh", label: "Get Found" },
  { href: "/pricing#stay-found", label: "Stay Found" },
  { href: "/pricing#review-power", label: "Review Power" },
  { href: "/pricing#ai-ready-bundle", label: "AI Ready Bundle" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/pricing#get-found-refresh", label: "What We Do" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  {
    label: "Email",
    href: "mailto:support@getmefound.ai",
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
    href: "https://www.linkedin.com/company/getmefound",
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
    href: "#",
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
    href: "#",
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
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-12">
          {/* Brand block - 4 cols on md+ */}
          <div className="col-span-2 md:col-span-4">
            <Link href={withLocale("/")} className="inline-block">
              <span className="text-2xl font-black tracking-tight text-[var(--color-hero-text)]">
                GetMeFound
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              Be the local business AI recommends.
            </p>
            <p className="mt-3 text-sm">
              <a
                href="mailto:support@getmefound.ai"
                className="hover:text-[var(--color-hero-text)] transition-colors"
              >
                support@getmefound.ai
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

          {/* Services - 2 cols */}
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

          {/* Company - 2 cols */}
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

          {/* Newsletter - 4 cols */}
          <div className="col-span-2 md:col-span-4">
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-hero-border)] pt-5 text-xs md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <p>&copy; {year} GetMeFound.</p>
            <Link href={withLocale("/privacy")} className="hover:text-[var(--color-hero-text)] transition-colors">
              {isSpanish ? "Privacidad" : "Privacy"}
            </Link>
            <Link href={withLocale("/terms")} className="hover:text-[var(--color-hero-text)] transition-colors">
              {isSpanish ? "Términos" : "Terms"}
            </Link>
          </div>
          <p className="text-[var(--color-hero-subtext)]/70">Built for local service businesses.</p>
        </div>
      </div>
    </footer>
  );
}
