import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ListiclePage from "@/components/ListiclePage";
import ListingCard from "@/components/ListingCard";
import PageHero from "@/components/PageHero";
import RankedList from "@/components/RankedList";
import Prose from "@/components/Prose";
import { featuredImage, formatDate, getPost, posts, readingMinutes, relatedPosts } from "@/lib/blog";
import { getAllListings, getGuideLinkMap } from "@/lib/listings";
import { getRankedListicle, getTopRated, listicleBySlug, listicles } from "@/lib/listicles";
import { parseMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 21600;

export function generateStaticParams() {
  return [...listicles.map((l) => ({ slug: l.slug })), ...posts.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listicle = listicleBySlug.get(slug);
  if (listicle) {
    const data = await getRankedListicle(slug);
    const year = (data?.updated ?? "2026").slice(0, 4);
    return pageMetadata({
      title: `${listicle.title} (${year})`,
      absoluteTitle: true,
      description: listicle.description,
      path: `/blog/${slug}`,
      type: "article",
      publishedTime: "2026-09-24",
      modifiedTime: data?.updated,
      image: { ...featuredImage(slug), alt: listicle.title },
    });
  }
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.published,
    modifiedTime: post.updated,
    image: { ...featuredImage(post.slug), alt: post.title },
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  if (listicleBySlug.has(slug)) {
    const data = await getRankedListicle(slug);
    if (!data) notFound();
    return <ListiclePage data={data} />;
  }
  const post = getPost(slug);
  if (!post) notFound();

  // "[[top-rated]]" in a post body renders the live top-rated Viator list at that spot.
  const MARKER = "[[top-rated]]";
  const [before, after = ""] = post.body.split(MARKER);
  const hasTopRated = post.body.includes(MARKER);
  const topRated = hasTopRated ? await getTopRated(10) : [];
  const blocks = parseMarkdown(before);
  const afterBlocks = parseMarkdown(after);
  const toc = [...blocks, ...afterBlocks].filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");
  const [all, links] = await Promise.all([getAllListings(), getGuideLinkMap()]);
  const featured = [
    ...new Set(post.featuredListings.map((s) => (links.get(`/book-now/${s}`) ?? `/book-now/${s}`).replace("/book-now/", ""))),
  ]
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
    image: absoluteUrl(featuredImage(post.slug).url),
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
              <img src={featuredImage(post.slug).url} alt={post.title} width={1200} height={630} fetchPriority="high" />
            </div>
            <p style={{ fontSize: "1.15rem", color: "var(--muted)" }}>{post.excerpt}</p>
            <Prose blocks={blocks} links={links} />
            {topRated.length > 0 && (
              <div style={{ margin: "24px 0 32px" }}>
                <RankedList items={topRated} anchor={(i) => `top-rated-${i + 1}`} headingLevel={3} />
              </div>
            )}
            {afterBlocks.length > 0 && <Prose blocks={afterBlocks} links={links} />}
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
                <div className="card-media is-featured">
                  <img src={featuredImage(p.slug).url} alt="" width={1200} height={630} loading="lazy" />
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
      {topRated.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Highest-rated tours and experiences in Orlando",
            itemListElement: topRated.map((l, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: l.title,
              url: absoluteUrl(`/book-now/${l.slug}`),
            })),
          }}
        />
      )}
    </>
  );
}
