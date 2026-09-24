import Link from "next/link";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import SearchForm from "@/components/SearchForm";
import { categories } from "@/lib/categories";
import { featuredSearches } from "@/lib/featured-searches";
import { posts } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { slugify } from "@/lib/slug";

export const metadata = pageMetadata({
  title: "Search Things To Do In Orlando",
  description:
    "Search every Orlando tour, attraction, event and travel guide on ThingsToDoOrlando.com by attraction name, activity or area.",
  path: "/search",
});

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const raw = (Array.isArray(q) ? q[0] : q)?.slice(0, 80) ?? "";
  if (raw.trim()) {
    const slug = slugify(raw);
    if (slug) redirect(`/search/${slug}`);
  }

  return (
    <>
      <PageHero
        title="Search Things To Do In Orlando"
        intro="Search tours, tickets, shows and guides by attraction, activity or area."
        crumbs={[{ name: "Search", href: "/search" }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container container-narrow">
          <SearchForm compact id="search-page" />

          <h2 style={{ marginTop: 48 }}>Popular searches</h2>
          <ul className="pill-links">
            {featuredSearches.map((f) => (
              <li key={f.slug}>
                <Link href={`/search/${f.slug}`}>{f.title.replace(/ in Orlando$/, "")}</Link>
              </li>
            ))}
          </ul>

          <h2 style={{ marginTop: 48 }}>Browse by category</h2>
          <ul className="result-list">
            {categories.map((c) => (
              <li key={c.key}>
                <Link href={`/book-now/${c.slug}`}>
                  <strong>{c.name}</strong>
                  <span>{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 style={{ marginTop: 48 }}>Popular guides</h2>
          <ul className="result-list">
            {posts.slice(0, 4).map((p) => (
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
    </>
  );
}
