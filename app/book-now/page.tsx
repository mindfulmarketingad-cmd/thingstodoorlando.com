import Link from "next/link";
import BookNowExplorer from "@/components/BookNowExplorer";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { categories } from "@/lib/categories";
import { getAllListings } from "@/lib/listings";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";
import { recommendedOrder, slimListing } from "@/lib/slim";

export const revalidate = 21600;

export const metadata = pageMetadata({
  title: "Book Orlando Tours, Tickets & Activities",
  description:
    "Compare and book every tour and event in Orlando, Florida. Filter tickets, dinner shows, airboat rides and day trips by category, price, rating and duration.",
  path: "/book-now",
});

export default async function BookNowPage() {
  const all = await getAllListings();
  const ordered = recommendedOrder(all);
  const counts = new Map(categories.map((c) => [c.key, all.filter((l) => l.categories.includes(c.key)).length]));

  return (
    <>
      <PageHero
        title="Book Tours & Events In Orlando Florida"
        intro={`${all.length.toLocaleString("en-US")} tours, tickets and experiences in Orlando, Florida. Filter by category, price, rating and duration, then book securely with Viator.`}
        crumbs={[{ name: "Book Now", href: "/book-now" }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <nav aria-label="Browse by category" style={{ marginBottom: 32 }}>
            <h2 className="sr-only">Browse by category</h2>
            <ul className="pill-links">
              {categories
                .filter((c) => (counts.get(c.key) ?? 0) > 0)
                .map((c) => (
                  <li key={c.key}>
                    <Link href={`/book-now/${c.slug}`}>
                      {c.shortName} ({counts.get(c.key)})
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
          <BookNowExplorer initial={ordered.slice(0, 24).map(slimListing)} total={all.length} />
        </div>
      </section>
      <JsonLd
        data={itemListSchema(
          "Things To Do In Orlando",
          ordered.slice(0, 50).map((l) => ({ name: l.title, href: `/book-now/${l.slug}` })),
        )}
      />
    </>
  );
}
