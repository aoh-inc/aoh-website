"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

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
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/pricing" className="hover:text-[var(--color-hero-text)] transition-colors">
              Pricing
            </Link>
            <Link href="/resources" className="hover:text-[var(--color-hero-text)] transition-colors">
              Resources
            </Link>
            <Link href="/about" className="hover:text-[var(--color-hero-text)] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[var(--color-hero-text)] transition-colors">
              Contact
            </Link>
          </div>

          <Link
            href="/#calculator"
            className="group hidden md:inline-flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-accent)]/30 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hero-bg)]"
          >
            Get Free Report
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>

          <button
            type="button"
            className="md:hidden text-[var(--color-hero-text)] -mr-1 p-1 rounded hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              tabIndex={-1}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="md:hidden fixed inset-0 top-[calc(theme(spacing.16)+1px)] z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              className="md:hidden absolute left-0 right-0 top-full z-50 border-b border-[var(--color-hero-border)] bg-[var(--color-hero-bg)] shadow-2xl"
            >
              <div className="mx-auto max-w-6xl px-6 py-4 space-y-1 text-sm">
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
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/#calculator"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 block bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Get Free Report
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
