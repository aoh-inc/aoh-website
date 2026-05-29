"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const services = [
  { href: "/pricing#get-found", label: "Get Found" },
  { href: "/pricing#stay-found", label: "Stay Found" },
  { href: "/pricing#always-ready", label: "Always Ready" },
  { href: "/calculator", label: "Revenue Potential" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const LinkedInIcon = (props: { className?: string }) => (
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
);

export function Footer() {
  const pathname = usePathname();
  if (
    pathname === "/mike-mc" ||
    pathname.startsWith("/mike-mc/") ||
    pathname === "/control" ||
    pathname.startsWith("/control/")
  ) return null;
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const isLegalPage =
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/es/privacy" ||
    pathname === "/es/terms";
  const withLocale = (path: string) => {
    if (path.startsWith("/pricing#")) return path;
    if (!isSpanish) return path;
    if (path === "/") return "/es";
    if (path === "/#faq") return "/es#faq";
    return `/es${path}`;
  };
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[var(--color-hero-bg)] text-[var(--color-hero-subtext)] border-t border-[var(--color-hero-border)]">
      {/* Secondary CTA */}
      {!isLegalPage && (
        <div className="border-b border-[var(--color-hero-border)] px-6 py-12 text-center">
        <p className="mb-5 text-xl font-bold text-[var(--color-hero-text)] md:text-2xl">
          Be the business AI recommends.
        </p>
        <Link
          href="/#free-audit"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5"
        >
          See if AI recommends you →
        </Link>
        </div>
      )}

      {/* Columns */}
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={withLocale("/")} className="inline-block">
              <span className="text-2xl font-black tracking-tight text-[var(--color-hero-text)]">
                GetMeFound
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              Be the business AI recommends.
            </p>
            <p className="mt-3 text-sm">
              <a
                href="mailto:support@getmefound.ai"
                className="hover:text-[var(--color-hero-text)] transition-colors"
              >
                support@getmefound.ai
              </a>
            </p>
            <div className="mt-5">
              <a
                href="https://www.linkedin.com/company/getmefound"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-[var(--color-hero-subtext)] transition-all duration-300 hover:bg-[var(--color-accent)]/15 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-hero-text)] hover:shadow-[0_0_24px_2px_rgba(45,106,79,0.45)]"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2 — Services */}
          <div>
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

          {/* Col 3 — Company */}
          <div>
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
                    {isSpanish && c.label === "About"
                      ? "Nosotros"
                      : isSpanish && c.label === "Contact"
                        ? "Contacto"
                        : c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-hero-text)]">
              Legal
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href={withLocale("/privacy")}
                  className="hover:text-[var(--color-hero-text)] transition-colors"
                >
                  {isSpanish ? "Privacidad" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href={withLocale("/terms")}
                  className="hover:text-[var(--color-hero-text)] transition-colors"
                >
                  {isSpanish ? "Términos" : "Terms"}
                </Link>
              </li>
              <li>
                <Link
                  href="/guarantee"
                  className="hover:text-[var(--color-hero-text)] transition-colors"
                >
                  Guarantee
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-xs text-[var(--color-hero-subtext)]/60">
              © {year} GetMeFound. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
