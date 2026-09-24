import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { featuredImage, formatDate, posts, readingMinutes } from "@/lib/blog";
import { getRankedListicle, listicles } from "@/lib/listicles";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Orlando Travel Blog: Guides, Tips & Itineraries",
  description:
    "Best-of Orlando lists and expert travel guides: top tours, theme parks, airboats, day trips, dinner shows, things to do with kids and the best time to visit.",
  path: "/blog",
});

export const revalidate = 21600;

export default async function BlogPage() {
  const lists = (await Promise.all(listicles.map((l) => getRankedListicle(l.slug)))).filter(
    (l): l is NonNullable<typeof l> => !!l && l.items.length > 0,
  );
  return (
    <>
      <PageHero
        title="Orlando Travel Blog"
        intro="Practical guides to help you plan the best things to do in Orlando, written and updated by our editors."
        crumbs={[{ name: "Blog", href: "/blog" }]}
      />
      <section className="section" style={{ paddingTop: 48 }} aria-labelledby="best-of">
        <div className="container">
          <div className="cat-head">
            <div>
              <h2 id="best-of">Best of Orlando</h2>
              <p>Ranked lists built from current prices and verified traveler reviews.</p>
            </div>
          </div>
          <div className="post-grid">
            {lists.map((l, i) => (
              <article key={l.config.slug} className="card post-card">
                <div className="card-media is-featured">
                  <img
                    src={featuredImage(l.config.slug).url}
                    alt=""
                    width={1200}
                    height={630}
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </div>
                <div className="card-body">
                  <span className="post-cat">Top {l.items.length} list</span>
                  <h3 className="card-title">
                    <Link href={`/blog/${l.config.slug}`}>{l.config.title}</Link>
                  </h3>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>{l.config.description}</p>
                  <div className="post-meta">
                    <span>Updated {formatDate(l.updated)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-alt" aria-labelledby="guides">
        <div className="container">
          <div className="cat-head">
            <div>
              <h2 id="guides">Orlando travel guides</h2>
              <p>Planning advice, itineraries and local tips.</p>
            </div>
          </div>
          <div className="post-grid">
            {posts.map((p) => (
              <article key={p.slug} className="card post-card">
                <div className="card-media is-featured">
                  <img
                    src={featuredImage(p.slug).url}
                    alt=""
                    width={1200}
                    height={630}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="card-body">
                  <span className="post-cat">{p.category}</span>
                  <h3 className="card-title">
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </h3>
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
      <JsonLd data={itemListSchema("Orlando Travel Blog", [
            ...lists.map((l) => ({ name: l.config.title, href: `/blog/${l.config.slug}` })),
            ...posts.map((p) => ({ name: p.title, href: `/blog/${p.slug}` })),
          ])} />
    </>
  );
}
