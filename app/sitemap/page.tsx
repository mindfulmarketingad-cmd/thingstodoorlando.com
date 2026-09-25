import Link from "next/link";
import PageHero from "@/components/PageHero";
import { posts } from "@/lib/blog";
import { categories } from "@/lib/categories";
import { featuredSearches } from "@/lib/featured-searches";
import { listicles } from "@/lib/listicles";
import { MONTHS } from "@/data/events";
import { getIndexableCollections } from "@/lib/collections";
import { stayGuides } from "@/data/stay-guides";
import { getLiveListings } from "@/lib/listings";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 21600;

export const metadata = pageMetadata({
  title: "Sitemap",
  description: "A complete list of every page on ThingsToDoOrlando.com: tour categories, every bookable tour, popular searches and blog posts.",
  path: "/sitemap",
});

export default async function SitemapPage() {
  const live = await getLiveListings();
  const browse = await getIndexableCollections();
  return (
    <>
      <PageHero
        title="Sitemap"
        intro="Every page on ThingsToDoOrlando.com in one place."
        crumbs={[{ name: "Sitemap", href: "/sitemap" }]}
      />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container sitemap-cols">
          <section>
            <h2>Main pages</h2>
            <ul>
              <li><Link href="/">Things To Do In Orlando (Home)</Link></li>
              <li><Link href="/book-now">Book Now</Link></li>
              <li><Link href="/book-now/today">Events Today in Orlando</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/place-to-stay">Best Hotels In Orlando Florida</Link></li>
              <li><Link href="/search">Search</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/author">Authors</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Use</Link></li>
            </ul>
          </section>
          <section>
            <h2>Events</h2>
            <ul>
              <li><Link href="/events">Orlando Events Calendar</Link></li>
              <li><Link href="/events/this-weekend">Things To Do In Orlando This Weekend</Link></li>
              <li><Link href="/events/halloween-in-orlando">Halloween in Orlando</Link></li>
              <li><Link href="/events/christmas-in-orlando">Christmas in Orlando</Link></li>
              {MONTHS.map((m) => (
                <li key={m}>
                  <Link href={`/events/${m.toLowerCase()}`}>Things To Do In Orlando In {m}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Tour categories</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.key}>
                  <Link href={`/book-now/${c.slug}`}>{c.label} Tours and Events in Orlando Florida</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Places to stay</h2>
            <ul>
              <li>
                <Link href="/place-to-stay">Best Hotels In Orlando Florida</Link>
              </li>
              {stayGuides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/place-to-stay/${g.slug}`}>{g.h1}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Browse by budget, type and area</h2>
            <ul>
              {browse.map((c) => (
                <li key={c.slug}>
                  <Link href={`/book-now/${c.slug}`}>{c.h1}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Popular searches</h2>
            <ul>
              {featuredSearches.map((f) => (
                <li key={f.slug}>
                  <Link href={`/search/${f.slug}`}>{f.title}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Blog</h2>
            <ul>
              {listicles.map((l) => (
                <li key={l.slug}>
                  <Link href={`/blog/${l.slug}`}>{l.title}</Link>
                </li>
              ))}
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </section>
          {categories.map((c) => {
            const items = live.filter((l) => l.categories[0] === c.key);
            if (!items.length) return null;
            return (
              <section key={c.key}>
                <h2>{c.shortName} tours</h2>
                <ul>
                  {items.map((l) => (
                    <li key={l.slug}>
                      <Link href={`/book-now/${l.slug}`}>{l.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
