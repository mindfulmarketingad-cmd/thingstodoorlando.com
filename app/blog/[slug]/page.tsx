import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ListingCard from "@/components/ListingCard";
import PageHero from "@/components/PageHero";
import Prose from "@/components/Prose";
import { formatDate, getPost, posts, readingMinutes, relatedPosts } from "@/lib/blog";
import { getAllListings } from "@/lib/listings";
import { parseMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 21600;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.published,
    modifiedTime: post.updated,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const blocks = parseMarkdown(post.body);
  const toc = blocks.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");
  const all = await getAllListings();
  const featured = post.featuredListings
    .map((s) => all.find((l) => l.slug === s))
    .filter((l): l is NonNullable<typeof l> => !!l);
  const related = relatedPosts(post);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl("/opengraph-image.png"),
    author: { "@type": "Organization", name: `${site.name} Editorial Team`, url: absoluteUrl("/about") },
    publisher: { "@id": `${site.url}/#organization` },
    articleSection: post.category,
    inLanguage: "en-US",
  };

  return (
    <>
      <PageHero
        title={post.title}
        crumbs={[
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      >
        <p style={{ marginTop: 8, fontSize: "0.95rem" }}>
          By the ThingsToDoOrlando.com editorial team. Updated{" "}
          <time dateTime={post.updated}>{formatDate(post.updated)}</time>. {readingMinutes(post)} min read.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container article-layout">
          <article>
            <div className="article-hero-img">
              <img src={`/illustrations/${post.illustration}.svg`} alt="" width={800} height={600} />
            </div>
            <p style={{ fontSize: "1.15rem", color: "var(--muted)" }}>{post.excerpt}</p>
            <Prose blocks={blocks} />
            <div className="author-box">
              <img src="/logo-mark.svg" alt="" width={52} height={52} />
              <p>
                <strong style={{ color: "var(--navy)" }}>ThingsToDoOrlando.com Editorial Team</strong>
                <br />
                We research Orlando tours, attractions and events so you can plan with confidence.{" "}
                <Link href="/about">About us</Link>.
              </p>
            </div>
          </article>
          <aside className="toc" aria-label="Table of contents">
            <strong>In this guide</strong>
            <ol>
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ol>
            <p style={{ marginTop: 24 }}>
              <Link href="/book-now" className="btn btn-primary btn-block">
                Browse tours
              </Link>
            </p>
          </aside>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section section-alt" aria-labelledby="featured-title">
          <div className="container">
            <div className="section-head">
              <h2 id="featured-title">Experiences Mentioned in This Guide</h2>
              <p>Compare prices, reviews and availability.</p>
            </div>
            <div className="card-grid">
              {featured.slice(0, 3).map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="more-title">
        <div className="container">
          <div className="cat-head">
            <h2 id="more-title">Keep Reading</h2>
            <Link href="/blog" className="link-arrow">
              All guides
            </Link>
          </div>
          <div className="post-grid">
            {related.map((p) => (
              <article key={p.slug} className="card post-card">
                <div className="card-media">
                  <img src={`/illustrations/${p.illustration}.svg`} alt="" width={800} height={600} loading="lazy" />
                </div>
                <div className="card-body">
                  <span className="post-cat">{p.category}</span>
                  <h3 className="card-title">
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={articleSchema} />
    </>
  );
}
