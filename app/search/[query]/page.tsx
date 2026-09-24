import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ListingCard from "@/components/ListingCard";
import PageHero from "@/components/PageHero";
import SearchForm from "@/components/SearchForm";
import { featuredSearchBySlug, featuredSearches } from "@/lib/featured-searches";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";
import { searchSite } from "@/lib/search";
import { isSafeSearchSlug, unslug } from "@/lib/slug";

type Props = { params: Promise<{ query: string }> };

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query } = await params;
  if (!isSafeSearchSlug(query)) return { title: "Search", robots: { index: false, follow: true } };
  const featured = featuredSearchBySlug.get(query);
  if (featured) {
    return pageMetadata({
      title: featured.title,
      description: featured.intro.length > 160 ? `${featured.intro.slice(0, 155).replace(/\s+\S*$/, "")}...` : featured.intro,
      path: `/search/${featured.slug}`,
    });
  }
  const q = titleCase(unslug(query));
  return pageMetadata({
    title: `${q}: Search Results`,
    description: `Tours, tickets, events and guides matching "${q}" on ThingsToDoOrlando.com.`,
    path: `/search/${query}`,
    noindex: true,
  });
}

export default async function SearchResultsPage({ params }: Props) {
  const { query } = await params;
  if (!isSafeSearchSlug(query)) notFound();

  const featured = featuredSearchBySlug.get(query);
  const text = featured?.query ?? unslug(query);
  const label = titleCase(unslug(query));
  const results = await searchSite(text);
  const listings = results.listings.slice(0, 30);
  const suggestions = featuredSearches.filter((f) => f.slug !== query).slice(0, 10);

  return (
    <>
      <PageHero
        title={featured ? featured.title : `Search results for "${label}"`}
        intro={
          featured
            ? undefined
            : `${results.total} ${results.total === 1 ? "result" : "results"} across tours, guides and pages.`
        }
        crumbs={[
          { name: "Search", href: "/search" },
          { name: featured ? featured.title : label, href: `/search/${query}` },
        ]}
      />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {featured && (
            <div className="prose" style={{ maxWidth: 820, marginBottom: 32 }}>
              <p>{featured.intro}</p>
            </div>
          )}
          <div style={{ maxWidth: 640, marginBottom: 40 }}>
            <SearchForm compact defaultValue={featured ? "" : unslug(query)} id="results-search" />
          </div>

          {listings.length > 0 && (
            <>
              <h2>Tours and experiences</h2>
              <div className="card-grid" style={{ marginBottom: 48 }}>
                {listings.map((l) => (
                  <ListingCard key={l.slug} listing={l} />
                ))}
              </div>
            </>
          )}

          {results.posts.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <h2>Travel guides</h2>
              <ul className="result-list">
                {results.posts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`}>
                      <strong>{p.title}</strong>
                      <span>{p.excerpt}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.pages.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <h2>Pages</h2>
              <ul className="result-list">
                {results.pages.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href}>
                      <strong>{p.title}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.total === 0 && (
            <div className="empty-state" style={{ marginBottom: 48 }}>
              <p>
                We could not find anything for &quot;{label}&quot;. Try a broader term like &quot;airboat&quot;,
                &quot;Disney&quot; or &quot;dinner show&quot;, or browse everything on{" "}
                <Link href="/book-now">Book Now</Link>.
              </p>
            </div>
          )}

          <h2>Popular searches</h2>
          <ul className="pill-links">
            {suggestions.map((f) => (
              <li key={f.slug}>
                <Link href={`/search/${f.slug}`}>{f.title.replace(/ in Orlando$/, "")}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {featured && listings.length > 0 && (
        <JsonLd
          data={itemListSchema(
            featured.title,
            listings.map((l) => ({ name: l.title, href: `/book-now/${l.slug}` })),
          )}
        />
      )}
    </>
  );
}
