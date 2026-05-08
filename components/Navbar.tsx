"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const services = [
  { href: "/reviews", label: "Reviews" },
  { href: "/rankings", label: "Rankings" },
  { href: "/ai-visibility", label: "AI Visibility" },
  { href: "/relay", label: "Relay" },
  { href: "/studio", label: "Studio" },
];

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 1l5 5 5-5" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-hero-bg)] backdrop-blur-sm border-b border-[var(--color-hero-border)]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0 pl-1 md:pl-2" aria-label="AI Outsource Hub home">
            <Image
              src="/AOH-logo-dark-bg.svg"
              alt="AI Outsource Hub"
              width={200}
              height={44}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-hero-subtext)]">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 py-2 hover:text-[var(--color-hero-text)] transition-colors"
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
              >
                Services
                <ChevronDown className="h-3 w-3" />
              </button>
              {servicesOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                  <div className="w-56 rounded-xl border border-[var(--color-hero-border)] bg-[var(--color-hero-bg)] p-2 shadow-2xl">
                    {services.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                        onClick={() => setServicesOpen(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/pricing" className="hover:text-[var(--color-hero-text)] transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-[var(--color-hero-text)] transition-colors">
              About
            </Link>
          </div>

          <Link
            href="/#calculator"
            className="hidden md:inline-flex bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Get Free Report
          </Link>

          <button
            type="button"
            className="md:hidden text-[var(--color-hero-text)]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 border-t border-[var(--color-hero-border)] pt-4 pb-2 space-y-1 text-sm">
            <p className="px-3 mb-1 text-xs uppercase tracking-wider text-[var(--color-hero-subtext)]/60">
              Services
            </p>
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
              >
                {s.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-[var(--color-hero-border)]" />
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/#calculator"
              onClick={() => setMobileOpen(false)}
              className="mt-3 block bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-4 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Get Free Report
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
