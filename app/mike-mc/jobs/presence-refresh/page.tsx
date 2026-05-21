import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { growthProductBySlug } from "@/lib/control/growth-products";
import { GrowthProductPage } from "../_components/GrowthProductPage";

export const metadata: Metadata = {
  title: "Presence Refresh - The Hub",
  description: "One-time AOH Reach add-on for refreshing stale social and website presence.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function PresenceRefreshPage() {
  const product = growthProductBySlug("presence-refresh");
  if (!product) notFound();
  return <GrowthProductPage product={product} />;
}
