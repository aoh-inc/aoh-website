import Image from "next/image";
import Link from "next/link";

const services = [
  { href: "/reviews", label: "Review Automation" },
  { href: "/rankings", label: "Google Rankings" },
  { href: "/ai-visibility", label: "AI Visibility" },
  { href: "/relay", label: "Relay" },
  { href: "/studio", label: "Studio" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-hero-bg)] text-[var(--color-hero-subtext)] border-t border-[var(--color-hero-border)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/AOH-logo-dark-bg.svg"
                alt="AI Outsource Hub"
                width={140}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              You run your business. We run the AI.
            </p>
            <p className="mt-4 text-sm">
              <a
                href="mailto:support@aioutsourcehub.com"
                className="hover:text-[var(--color-hero-text)] transition-colors"
              >
                support@aioutsourcehub.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-hero-text)]">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-hero-text)]">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-hero-text)]">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-hero-border)] pt-8 text-xs md:flex-row md:items-center">
          <p>&copy; {year} AI Outsource Hub. All rights reserved.</p>
          <p>Built for local businesses.</p>
        </div>
      </div>
    </footer>
  );
}
