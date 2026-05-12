"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookMeetingModal } from "@/components/BookMeetingModal";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const lastY = useRef(0);

  // Scroll-aware behavior: transparent → frosted bg, hide on scroll-down, show on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // hide only when scrolling DOWN past a threshold + not in mobile menu
      if (y > lastY.current && y > 120 && !mobileOpen) {
        setHidden(true);
      } else if (y < lastY.current) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

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

  // Logo + text-color swap based on scroll state
  const logoSrc = scrolled ? "/AOH-logo-light-bg.svg" : "/AOH-logo-dark-bg.svg";
  const linkColor = scrolled
    ? "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
    : "text-[var(--color-hero-subtext)] hover:text-[var(--color-hero-text)]";

  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const normalizedPath = (() => {
    if (pathname === "/es") return "/";
    if (pathname.startsWith("/es/")) return pathname.replace(/^\/es/, "") || "/";
    return pathname;
  })();
  const enHref = normalizedPath;
  const esHref = normalizedPath === "/" ? "/es" : `/es${normalizedPath}`;

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--color-bg-page)]/85 backdrop-blur-xl py-2 border-b border-[var(--color-border)] shadow-sm"
            : "bg-[var(--color-hero-bg)] py-4 border-b border-[var(--color-hero-border)]"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="shrink-0 pl-1 md:pl-2" aria-label="AI Outsource Hub home">
              <Image
                src={logoSrc}
                alt="AI Outsource Hub"
                width={200}
                height={44}
                className="h-10 w-auto transition-opacity duration-300"
                priority
              />
            </Link>

            <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${linkColor} transition-colors duration-500`}>
              <Link href="/pricing" className="transition-colors">
                What We Do
              </Link>
              <Link href="/blog" className="transition-colors">
                Blog
              </Link>
              <Link href="/about" className="transition-colors">
                About
              </Link>
            </div>

            <div className={`hidden md:flex items-center gap-1 rounded-full border px-1 py-0.5 text-xs font-semibold ${scrolled ? "border-[var(--color-border)] bg-white/70" : "border-white/20 bg-white/5"}`}>
              <Link
                href={enHref}
                className={`rounded-full px-2 py-1 transition-colors ${!isSpanish ? "bg-[var(--color-accent)] text-[var(--color-accent-text)]" : linkColor}`}
                aria-label="Switch language to English"
              >
                EN
              </Link>
              <Link
                href={esHref}
                className={`rounded-full px-2 py-1 transition-colors ${isSpanish ? "bg-[var(--color-accent)] text-[var(--color-accent-text)]" : linkColor}`}
                aria-label="Cambiar idioma a Español"
              >
                ES
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setBookOpen(true)}
              className="group hidden md:inline-flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-accent)]/30 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Book a Meeting
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </button>

            <button
              type="button"
              className={`md:hidden -mr-1 p-1 rounded transition-colors ${
                scrolled
                  ? "text-[var(--color-text-body)] hover:bg-black/5"
                  : "text-[var(--color-hero-text)] hover:bg-white/5"
              }`}
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
                  <div className="mb-2 flex items-center gap-2 px-3 py-1">
                    <Link
                      href={enHref}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${!isSpanish ? "bg-[var(--color-accent)] text-[var(--color-accent-text)]" : "bg-white/5 text-[var(--color-hero-subtext)]"}`}
                      aria-label="Switch language to English"
                    >
                      EN
                    </Link>
                    <Link
                      href={esHref}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${isSpanish ? "bg-[var(--color-accent)] text-[var(--color-accent-text)]" : "bg-white/5 text-[var(--color-hero-subtext)]"}`}
                      aria-label="Cambiar idioma a Español"
                    >
                      ES
                    </Link>
                  </div>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    What We Do
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
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setBookOpen(true);
                    }}
                    className="mt-3 block w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                  >
                    Book a Meeting
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <BookMeetingModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
