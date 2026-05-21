import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewUnsubscribeForm } from "@/components/ReviewUnsubscribeForm";
import { CLIENT_HUBS, getClientHub } from "@/lib/client-hub";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CLIENT_HUBS.map((client) => ({ slug: client.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientHub(slug);

  return {
    title: client ? `Stop Review Requests From ${client.businessName}` : "Stop Review Requests",
    robots: { index: false, follow: false },
  };
}

export default async function ReviewUnsubscribePage({ params }: PageProps) {
  const { slug } = await params;
  const client = getClientHub(slug);

  if (!client) notFound();

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <ReviewUnsubscribeForm clientSlug={client.slug} clientName={client.businessName} />
        <div className="mt-5 text-center">
          <Link href={`/review/${client.slug}`} className="text-sm font-semibold text-emerald-800 hover:text-emerald-700">
            Leave feedback instead
          </Link>
        </div>
      </div>
    </main>
  );
}
