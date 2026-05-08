import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about AOH? We answer them. Email support@aioutsourcehub.com or send us a message.",
  alternates: { canonical: "/contact" },
};

const breadcrumb = pageBreadcrumbs("Contact", "/contact");

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHeader
        eyebrow="Contact"
        title="Talk to a human."
        subtitle="Questions about pricing, setup, or whether AOH is right for your business? We answer them — usually within a few hours."
      />
      <PageBody>
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Direct contact</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                Email is the fastest way to reach us. Most messages get a reply the same day.
              </p>
              <ul className="space-y-3 text-[var(--color-text-body)]">
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-1">
                    Email
                  </span>
                  <a
                    href="mailto:support@aioutsourcehub.com"
                    className="text-[var(--color-accent)] hover:underline font-medium"
                  >
                    support@aioutsourcehub.com
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-1">
                    Website
                  </span>
                  <a
                    href="https://aioutsourcehub.com"
                    className="text-[var(--color-accent)] hover:underline font-medium"
                  >
                    aioutsourcehub.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Send a message</h2>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-semibold mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-semibold mb-2"
                  >
                    Business email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold mb-2"
                  >
                    What's on your mind?
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] py-3 px-6 rounded-xl font-semibold transition-colors"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}
