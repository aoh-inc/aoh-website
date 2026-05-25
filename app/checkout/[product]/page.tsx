import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";
import { Reveal } from "@/components/Reveal";
import { breadcrumbSchema } from "@/lib/seo";
import { CHECKOUT_PRODUCTS, getCheckoutProduct } from "@/lib/checkout";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";

export function generateStaticParams() {
  return CHECKOUT_PRODUCTS.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const { product } = await params;
  const p = getCheckoutProduct(product);
  if (!p) return { title: "Plan not found" };

  return {
    title: `${p.name} — Checkout`,
    description: p.summary,
    alternates: { canonical: `/checkout/${p.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product } = await params;
  const p = getCheckoutProduct(product);
  if (!p) notFound();

  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: p.name, path: `/checkout/${p.slug}` },
  ]);

  const buttonLabel =
    p.stripeMode === "payment"
      ? `Pay ${p.price} — Get Started`
      : `Subscribe — ${p.price}${p.cadence}${p.setupPriceId ? ` + ${p.setup}` : ""}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHeader
        eyebrow="Checkout"
        title={p.name}
        subtitle={p.summary}
      />
      <PageBody>
        <PageSection>
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <div className="mb-8 rounded-2xl bg-[var(--color-bg-dark-card)] p-8 md:p-10 text-[var(--color-hero-text)] ring-1 ring-[var(--color-hero-border)]">
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{p.price}</span>
                  <span className="text-lg text-[var(--color-hero-subtext)]">
                    {p.cadence}
                  </span>
                  <span className="ml-auto text-sm text-[var(--color-hero-subtext)]">
                    {p.setup}
                  </span>
                </div>

                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                  What you get
                </h2>
                <ul className="space-y-2 mb-8 text-[var(--color-hero-subtext)]">
                  {p.whatYouGet.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed">
                      <span className="text-[var(--color-accent)] flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <CheckoutButton slug={p.slug} label={buttonLabel} />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-[var(--color-text-muted)]">
                <div className="rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-4 py-3">
                  Cancel anytime
                </div>
                <div className="rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-4 py-3">
                  No hidden fees
                </div>
                <div className="rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-4 py-3">
                  Your data stays yours
                </div>
              </div>
            </Reveal>

            <div className="mt-10 text-center">
              <Link
                href="/pricing"
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                ← Back to pricing
              </Link>
            </div>
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}
