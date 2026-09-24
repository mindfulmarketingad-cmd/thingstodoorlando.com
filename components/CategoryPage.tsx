import Link from "next/link";
import BookNowExplorer from "./BookNowExplorer";
import JsonLd from "./JsonLd";
import PageHero from "./PageHero";
import { posts } from "@/lib/blog";
import { categories, type Category } from "@/lib/categories";
import { getAllListings } from "@/lib/listings";
import { listicles } from "@/lib/listicles";
import { extractLinks } from "@/lib/markdown";
import { itemListSchema } from "@/lib/schema";
import { recommendedOrder, slimListing } from "@/lib/slim";

export function categoryTitle(c: Category) {
  return `${c.label} Tours and Events in Orlando Florida`;
}

export default async function CategoryPage({ category }: { category: Category }) {
  const all = await getAllListings();
  const items = recommendedOrder(all.filter((l) => l.categories.includes(category.key)));
  const guides = items.filter((l) => l.source === "guide");
  const related = posts
    .filter((p) => {
      const links = extractLinks(p.body);
      return links.includes(`/book-now/${category.slug}`) || guides.some((g) => links.includes(`/book-now/${g.slug}`));
    })
    .slice(0, 4);
  const others = categories.filter((c) => c.key !== category.key);
  const lists = listicles.filter((l) => l.category === category.key);

  return (
    <>
      <PageHero
        title={categoryTitle(category)}
        intro={`${items.length.toLocaleString("en-US")} ${category.shortName.toLowerCase()} experiences in and around Orlando, Florida. ${category.blurb}`}
        crumbs={[
          { name: "Book Now", href: "/book-now" },
          { name: category.shortName, href: `/book-now/${category.slug}` },
        ]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="prose" style={{ maxWidth: 820, marginBottom: 28 }}>
            <p>{category.intro}</p>
          </div>
          {items.length ? (
            <BookNowExplorer
              initial={items.slice(0, 24).map(slimListing)}
              total={items.length}
              lockedCategory={category.key}
            />
          ) : (
            <div className="empty-state">
              <p>New experiences are on the way. In the meantime, browse everything on Book Now.</p>
              <Link href="/book-now" className="btn btn-primary">
                Browse all tours
              </Link>
            </div>
          )}
        </div>
      </section>

      {lists.length > 0 && (
        <section className="section section-alt" aria-labelledby="cat-lists">
          <div className="container container-narrow">
            <h2 id="cat-lists">Our ranked lists</h2>
            <ul className="result-list">
              {lists.map((l) => (
                <li key={l.slug}>
                  <Link href={`/blog/${l.slug}`}>
                    <strong>{l.title}</strong>
                    <span>{l.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section section-alt" aria-labelledby="cat-guides">
          <div className="container container-narrow">
            <h2 id="cat-guides">Planning guides</h2>
            <ul className="result-list">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`}>
                    <strong>{p.title}</strong>
                    <span>{p.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="cat-more">
        <div className="container">
          <h2 id="cat-more">More Orlando categories</h2>
          <ul className="pill-links">
            {others.map((c) => (
              <li key={c.key}>
                <Link href={`/book-now/${c.slug}`}>{c.shortName}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={itemListSchema(
          categoryTitle(category),
          items.slice(0, 50).map((l) => ({ name: l.title, href: `/book-now/${l.slug}` })),
        )}
      />
    </>
  );
}
