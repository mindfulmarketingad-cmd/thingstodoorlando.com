import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { formatDate, posts, readingMinutes } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Orlando Travel Blog: Guides, Tips & Itineraries",
  description:
    "Expert Orlando travel guides: things to do with kids, date ideas, Kennedy Space Center tips, airboat tours, budget ideas and the best time to visit.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Orlando Travel Blog"
        intro="Practical guides to help you plan the best things to do in Orlando, written and updated by our editors."
        crumbs={[{ name: "Blog", href: "/blog" }]}
      />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div className="post-grid">
            {posts.map((p, i) => (
              <article key={p.slug} className="card post-card">
                <div className="card-media">
                  <img
                    src={`/illustrations/${p.illustration}.svg`}
                    alt=""
                    width={800}
                    height={600}
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                <div className="card-body">
                  <span className="post-cat">{p.category}</span>
                  <h2 className="card-title">
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </h2>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>{p.excerpt}</p>
                  <div className="post-meta">
                    <time dateTime={p.updated}>{formatDate(p.updated)}</time>
                    <span>{readingMinutes(p)} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={itemListSchema("Orlando Travel Blog", posts.map((p) => ({ name: p.title, href: `/blog/${p.slug}` })))} />
    </>
  );
}
