import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorBox, { AuthorByline } from "@/components/AuthorBox";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import ListiclePage from "@/components/ListiclePage";
import ListingCard from "@/components/ListingCard";
import PageHero from "@/components/PageHero";
import RankedList from "@/components/RankedList";
import HotelCta from "@/components/HotelCta";
import Prose from "@/components/Prose";
import { featuredImage, formatDate, getPost, posts, readingMinutes, relatedPosts } from "@/lib/blog";
import { getAllListings, getGuideLinkMap, getLiveListings } from "@/lib/listings";
import { getRankedListicle, getTopRated, listicleBySlug, listicles } from "@/lib/listicles";
import { parseMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/metadata";
import { authorSchema, getAuthor } from "@/lib/authors";
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
  const author = getAuthor(post.author);

  // "[[top-rated]]" in a post body renders the live top-rated Viator list at that spot.
  // Markers embed live data inside a post body:
  //   [[top-rated]]            ten highest-rated Viator experiences
  //   [[products:CODE,CODE]]   specific Viator products by product code
  //   [[hotels]] / [[hotels:Area]]  Stay22 hotel call to action
  const live = await getLiveListings();
  const segments = await Promise.all(
    post.body.split(/(\[\[[^\]]+\]\])/).map(async (part) => {
      const m = part.match(/^\[\[([a-z-]+)(?::(.*))?\]\]$/);
      if (!m) return { kind: "md" as const, blocks: parseMarkdown(part) };
      if (m[1] === "top-rated") return { kind: "list" as const, id: "top-rated", items: await getTopRated(10) };
      if (m[1] === "products") {
        const codes = (m[2] ?? "").split(",").map((c) => c.trim());
        const items = codes.map((c) => live.find((l) => l.productCode === c)).filter((l): l is NonNullable<typeof l> => !!l);
        return { kind: "list" as const, id: `picks-${codes[0]?.toLowerCase()}`, items };
      }
      if (m[1] === "hotels") return { kind: "hotels" as const, area: m[2] };
      return { kind: "md" as const, blocks: [] };
    }),
  );
  const heroListing = post.heroProduct ? live.find((l) => l.productCode === post.heroProduct) : undefined;
  const heroImg = heroListing ? (heroListing.imageLarge ?? heroListing.image) : undefined;
  // "## Frequently asked questions" followed by "### Question" + answer paragraphs becomes FAQPage schema.
  const faqItems = (() => {
    const blocks = segments.flatMap((s) => (s.kind === "md" ? s.blocks : []));
    const start = blocks.findIndex((b) => b.type === "h2" && /frequently asked questions/i.test(b.text));
    if (start < 0) return [];
    const out: { q: string; a: string }[] = [];
    for (let i = start + 1; i < blocks.length && blocks[i].type !== "h2"; i++) {
      const b = blocks[i];
      const next = blocks[i + 1];
      if (b.type === "h3" && next?.type === "p") out.push({ q: b.text, a: next.inline.map((n) => n.value).join("") });
    }
    return out;
  })();
  const topRated = segments.flatMap((s) => (s.kind === "list" && s.id === "top-rated" ? s.items : []));
  const toc = segments
    .flatMap((s) => (s.kind === "md" ? s.blocks : []))
    .filter((b): b is Extract<(typeof b), { type: "h2" }> => b.type === "h2");
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
    author: authorSchema(author),
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
        <AuthorByline author={author}>
          {" "}
          · Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time> · {readingMinutes(post)} min read
        </AuthorByline>
      </PageHero>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container article-layout">
          <article>
            <div className="article-hero-img">
              {heroImg ? (
                <img src={heroImg.url} alt={heroImg.alt} width={heroImg.width} height={heroImg.height} fetchPriority="high" />
              ) : (
                <img src={featuredImage(post.slug).url} alt={post.title} width={1200} height={630} fetchPriority="high" />
              )}
            </div>
            <p style={{ fontSize: "1.15rem", color: "var(--muted)" }}>{post.excerpt}</p>
            {segments.map((s, i) =>
              s.kind === "md" ? (
                s.blocks.length ? <Prose key={i} blocks={s.blocks} links={links} /> : null
              ) : s.kind === "hotels" ? (
                <HotelCta key={i} area={s.area} />
              ) : s.items.length ? (
                <div key={i} style={{ margin: "24px 0 32px" }}>
                  <RankedList items={s.items} anchor={(n) => `${s.id}-${n + 1}`} headingLevel={3} />
                </div>
              ) : null,
            )}
            <AuthorBox author={author} />
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
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}
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
