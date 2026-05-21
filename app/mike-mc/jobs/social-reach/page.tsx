import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { growthProductBySlug } from "@/lib/control/growth-products";
import { GrowthProductPage } from "../_components/GrowthProductPage";

export const metadata: Metadata = {
  title: "Social Reach - The Hub",
  description: "AOH guarded pilot for social listening and helpful engagement.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function SocialReachPage() {
  const product = growthProductBySlug("social-reach");
  if (!product) notFound();
  return <GrowthProductPage product={product} />;
}
