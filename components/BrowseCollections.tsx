import Link from "next/link";
import { getIndexableCollections, kindLabel, type CollectionKind } from "@/lib/collections";

const ORDER: CollectionKind[] = ["budget", "cheap", "near", "private"];

/** Links to every indexable /book-now collection, grouped by type. */
export default async function BrowseCollections({ title = "More ways to find things to do", alt = false }: { title?: string; alt?: boolean }) {
  const list = await getIndexableCollections();
  if (!list.length) return null;
  return (
    <section className={`section${alt ? " section-alt" : ""}`} aria-labelledby="browse-title">
      <div className="container">
        <div className="section-head">
          <h2 id="browse-title">{title}</h2>
          <p>Ranked lists of real, bookable experiences, refreshed with current prices and traveler reviews.</p>
        </div>
        <div className="browse-groups">
          {ORDER.map((kind) => {
            const group = list.filter((c) => c.kind === kind);
            if (!group.length) return null;
            return (
              <div key={kind} className="browse-group">
                <h3>{kindLabel[kind]}</h3>
                <ul>
                  {group.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/book-now/${c.slug}`}>{c.h1}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
