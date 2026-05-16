import type { Metadata } from "next";
import Link from "next/link";
import { PageBody } from "@/components/PageBody";
import {
  CATEGORY_COLORS,
  getAllPosts,
  getCategoryGradient,
  type Post,
} from "@/lib/blog";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Hub",
  description:
    "How customers find local businesses today. Practical guides, honest pricing math, and the moves we run for clients.",
  alternates: { canonical: "/blog" },
};

const breadcrumb = pageBreadcrumbs("Blog", "/blog");

const serif = "[font-family:var(--font-fraunces)]";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function EyebrowLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="h-px w-10 bg-[var(--color-accent)]" />
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
        {children}
      </span>
    </div>
  );
}

function CategoryPill({
  category,
  variant = "light",
}: {
  category: string;
  variant?: "light" | "dark";
}) {
  const styles =
    variant === "dark"
      ? "bg-white/10 text-white border-white/20"
      : "bg-white text-[var(--color-text-body)] border-[var(--color-border)] shadow-sm";
  return (
    <span
      className={`inline-flex items-center text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border ${styles}`}
    >
      {category}
    </span>
  );
}

function MetaRow({
  date,
  readingMinutes,
  variant = "light",
}: {
  date: string;
  readingMinutes: number;
  variant?: "light" | "dark";
}) {
  const color =
    variant === "dark" ? "text-white/60" : "text-[var(--color-text-muted)]";
  return (
    <div className={`flex items-center gap-3 text-sm ${color}`}>
      <span className="inline-flex items-center gap-1.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {formatDate(date)}
      </span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {readingMinutes} min read
      </span>
    </div>
  );
}

function CoverImage({
  post,
  className,
  showFeaturedPill = false,
}: {
  post: Post;
  className: string;
  showFeaturedPill?: boolean;
}) {
  const gradient = getCategoryGradient(post.category);
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      {showFeaturedPill && (
        <span className="absolute top-5 left-5 inline-flex items-center text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-[var(--color-accent)] text-white">
          Featured
        </span>
      )}
    </div>
  );
}

function AuthorRow({
  post,
  variant = "light",
}: {
  post: Post;
  variant?: "light" | "dark";
}) {
  const nameColor =
    variant === "dark" ? "text-white" : "text-[var(--color-text-body)]";
  const roleColor =
    variant === "dark" ? "text-white/50" : "text-[var(--color-text-muted)]";
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.author.avatar}
        alt=""
        aria-hidden="true"
        className="h-10 w-10 rounded-full object-cover bg-[var(--color-accent-soft)]"
      />
      <div className="leading-tight">
        <p className={`text-sm font-semibold ${nameColor}`}>
          {post.author.name}
        </p>
        <p className={`text-xs ${roleColor}`}>{post.author.role}</p>
      </div>
    </div>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <section aria-label="Featured article" className="mx-auto max-w-7xl px-6">
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-2xl overflow-hidden bg-[var(--color-bg-dark-card)] text-white shadow-xl shadow-black/15 transition-transform hover:-translate-y-0.5"
      >
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <CoverImage
            post={post}
            className="h-56 md:h-auto md:min-h-[20rem]"
            showFeaturedPill
          />
          <div className="p-7 md:p-9 flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <CategoryPill category={post.category} variant="dark" />
              <MetaRow
                date={post.date}
                readingMinutes={post.readingMinutes}
                variant="dark"
              />
            </div>
            <h2
              className={`${serif} text-2xl md:text-3xl lg:text-[2.25rem] font-semibold leading-[1.15] tracking-tight line-clamp-3 group-hover:text-[var(--color-accent-soft)] transition-colors`}
            >
              {post.title}
            </h2>
            <p className="text-white/65 text-sm md:text-base leading-relaxed line-clamp-3">
              {post.description}
            </p>
            <AuthorRow post={post} variant="dark" />
            <div className="border-t border-white/10 pt-4 mt-auto flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[var(--color-accent)] text-white group-hover:bg-[var(--color-accent-hover)] transition-colors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white">
                Read article
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <div className="relative">
        <CoverImage post={post} className="h-56" />
        <span className="absolute top-4 left-4">
          <CategoryPill category={post.category} variant="light" />
        </span>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-7 flex-1">
        <MetaRow date={post.date} readingMinutes={post.readingMinutes} />
        <h3
          className={`${serif} text-2xl md:text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[var(--color-text-body)] group-hover:text-[var(--color-accent)] transition-colors`}
        >
          {post.title}
        </h3>
        <p className="text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
          {post.description}
        </p>
        <div className="border-t border-[var(--color-border)] pt-5 mt-auto flex items-center justify-between">
          <AuthorRow post={post} />
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  // Suppress unused-warning for CATEGORY_COLORS re-export integrity
  void CATEGORY_COLORS;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section
        aria-label="Blog hero"
        className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
      >
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-14 md:pt-12 md:pb-16">
          <EyebrowLabel>Latest thinking</EyebrowLabel>
          <h1
            className={`${serif} text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tight`}
          >
            The Hub<span className="text-[var(--color-accent)]">.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-[var(--color-hero-subtext)] leading-relaxed">
            Practical notes on getting found, finding customers, and running a business in 2026 — what we&rsquo;re seeing, learning, and shipping for local owners.
          </p>
        </div>
      </section>

      <PageBody>
        {featured && (
          <div className="pt-12 md:pt-16 pb-14 md:pb-20">
            <FeaturedCard post={featured} />
          </div>
        )}

        {rest.length > 0 && (
          <section
            aria-label="More articles"
            className="pb-20 md:pb-28"
          >
            <div className="mx-auto max-w-7xl px-6">
              <EyebrowLabel>More articles</EyebrowLabel>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {rest.map((p) => (
                  <li key={p.slug}>
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <p className="text-[var(--color-text-muted)]">No posts yet.</p>
            </div>
          </section>
        )}
      </PageBody>
    </>
  );
}
