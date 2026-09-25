import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { featuredImage, formatDate, mapPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Orlando Theme Park Maps: Official Park Maps & Layout Guides",
  description:
    "Official Orlando theme park and water park maps in one place, each with a layout guide covering areas, rides, dining, lockers and tips to get around.",
  path: "/maps",
});

export default function MapsPage() {
  const maps = mapPosts();
  return (
    <>
      <PageHero
        title="Orlando Theme Park Maps"
        intro="Official park maps for Orlando's theme parks and water parks, each paired with a layout guide showing where the rides, food, lockers and restrooms are and how to get around."
        crumbs={[{ name: "Theme Park Maps", href: "/maps" }]}
      />
      <section className="section" style={{ paddingTop: 48 }} aria-labelledby="maps-title">
        <div className="container">
          <div className="cat-head">
            <div>
              <h2 id="maps-title">Park maps and layout guides</h2>
              <p>Save the map to your phone before you go. Park layouts and attractions can change, so check the park&apos;s app on the day.</p>
            </div>
          </div>
          <div className="post-grid">
            {maps.map((p, i) => (
              <article key={p.slug} className="card post-card map-card">
                <div className="card-media is-featured">
                  <img
                    src={featuredImage(p.slug).url}
                    alt=""
                    width={1200}
                    height={630}
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </div>
                <div className="card-body">
                  <span className="post-cat">{p.map!.park}</span>
                  <h3 className="card-title">
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>{p.excerpt}</p>
                  <div className="map-card-actions">
                    <a
                      className="btn btn-primary"
                      href={p.map!.url}
                      target="_blank"
                      rel={p.map!.url.startsWith("/") ? "noopener" : "noopener noreferrer"}
                    >
                      {p.map!.format === "PDF" ? "Download map (PDF)" : "View park map"}
                    </a>
                    <Link className="btn btn-outline" href={`/blog/${p.slug}`}>
                      Layout guide
                    </Link>
                  </div>
                  <div className="post-meta">
                    <time dateTime={p.updated}>Updated {formatDate(p.updated)}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={itemListSchema("Orlando Theme Park Maps", maps.map((p) => ({ name: p.title, href: `/blog/${p.slug}` })))} />
    </>
  );
}
