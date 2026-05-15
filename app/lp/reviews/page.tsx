import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroEmailForm } from "@/components/hero/HeroEmailForm";

export const metadata: Metadata = {
  title: "Free Review Audit — AI Outsource Hub",
  description: "See how your reviews stack up. Free audit in 10 minutes.",
  robots: { index: false, follow: false },
};

export default function ReviewsLandingPage() {
  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <Suspense>
        <HeroEmailForm />
      </Suspense>
    </main>
  );
}
