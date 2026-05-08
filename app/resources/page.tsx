import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";
import { getAllPosts } from "@/lib/blog";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Practical playbooks on AI visibility, local search, review growth, and automation for local businesses.",
  alternates: { canonical: "/resources" },
};

const breadcrumb = pageBreadcrumbs("Resources", "/resources");

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ResourcesPage() {
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        eyebrow="Resources"
        title="Tactical guides that drive local growth."
        subtitle="No fluff. Just practical, field-tested content on AI visibility, reviews, and automation."
      />

      <PageBody>
        <PageSection>
          <div className="space-y-8">
            {topTags.length > 0 && (
              <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-6">
                <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-3">
                  Popular Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {topTags.map(([tag, count]) => (
                    <span
                      key={tag}
                      className="text-sm font-medium text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-1.5 rounded-full"
                    >
                      {tag} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="block bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8 hover:shadow-lg transition-shadow group"
              >
                <p className="text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold mb-3">
                  Featured Guide
                </p>
                <h2 className="text-3xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[var(--color-text-muted)] text-base leading-relaxed mb-5">
                  {featured.description}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {formatDate(featured.date)} · {featured.readingMinutes} min read
                </p>
              </Link>
            )}

            {rest.length === 0 ? (
              <div className="text-[var(--color-text-muted)]">No posts yet.</div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rest.map((p) => (
                  <li
                    key={p.slug}
                    className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-md transition-shadow"
                  >
                    <Link href={`/blog/${p.slug}`} className="block group">
                      <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-2">
                        {formatDate(p.date)} · {p.readingMinutes} min read
                      </p>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-[var(--color-text-muted)] leading-relaxed">
                        {p.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}

