import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { authors, authorUrl } from "@/lib/authors";
import { articlesBy } from "@/lib/author-articles";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Our Authors",
  description:
    "Meet the people behind ThingsToDoOrlando.com, the Orlando travel guides, rankings and planning advice trusted by visitors and locals.",
  path: "/author",
});

export default function AuthorsPage() {
  return (
    <>
      <PageHero
        title="Our Authors"
        intro="The people who research, write and update every Orlando guide on ThingsToDoOrlando.com."
        crumbs={[{ name: "Authors", href: "/author" }]}
      />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div className="author-grid">
            {authors.map((a) => (
              <article key={a.slug} className="author-card">
                <img src={a.photo} alt={a.name} width={96} height={96} />
                <div>
                  <h2>
                    <Link href={authorUrl(a)}>{a.name}</Link>
                  </h2>
                  <p className="author-role">{a.role}</p>
                  <p>{a.shortBio}</p>
                  <p className="author-meta">
                    {articlesBy(a.slug).length} articles · <Link href={authorUrl(a)}>View profile</Link>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={itemListSchema("ThingsToDoOrlando.com authors", authors.map((a) => ({ name: a.name, href: authorUrl(a) })))} />
    </>
  );
}
