"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const BOOKING_URL = "https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY";

export function BookMeetingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Book a meeting with AI Outsource Hub"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
          style={{ backgroundColor: "rgba(10, 22, 40, 0.65)" }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-full max-w-4xl h-[85vh] rounded-2xl bg-white shadow-2xl overflow-hidden ring-1 ring-black/5"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close booking"
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-md ring-1 ring-black/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
            <iframe
              src={BOOKING_URL}
              title="Book a meeting with AI Outsource Hub"
              loading="lazy"
              className="w-full h-full border-0"
              allow="camera; microphone; autoplay; encrypted-media; fullscreen"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
