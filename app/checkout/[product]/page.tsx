import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody, PageSection } from "@/components/PageBody";
import { CheckoutAutoRedirect } from "@/components/checkout/CheckoutAutoRedirect";
import { CHECKOUT_PRODUCTS, getCheckoutProduct } from "@/lib/checkout";
import { breadcrumbSchema } from "@/lib/seo";

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
    title: `${p.name} - Checkout`,
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
  const label =
    p.stripeMode === "payment"
      ? `${p.name} for ${p.price}`
      : `${p.name} for ${p.price}${p.cadence}${p.setupPriceId ? ` + ${p.setup}` : ""}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageBody>
        <PageSection>
          <CheckoutAutoRedirect slug={p.slug} label={label} />
        </PageSection>
      </PageBody>
    </>
  );
}
