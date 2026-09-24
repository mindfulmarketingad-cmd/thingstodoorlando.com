import Link from "next/link";
import BookButton from "./BookButton";
import Faq from "./Faq";
import JsonLd from "./JsonLd";
import ListingMedia from "./ListingMedia";
import PageHero from "./PageHero";
import Stars from "./Stars";
import { formatPrice } from "./ListingCard";
import { CheckIcon, ClockIcon, PinIcon, TagIcon } from "./Icons";
import { featuredImage, formatDate } from "@/lib/blog";
import { categoryByKey } from "@/lib/categories";
import { itemReasons, itemSummary, listicles, type RankedListicle } from "@/lib/listicles";
import { formatDuration } from "@/lib/viator";
import { absoluteUrl, site } from "@/lib/site";

const anchor = (i: number) => `pick-${i + 1}`;

export default function ListiclePage({ data }: { data: RankedListicle }) {
  const { config, items, stats, picks, updated, totalMatches } = data;
  const category = categoryByKey[config.category];
  const plural = `${config.noun}s`;
  const path = `/blog/${config.slug}`;
  const typical = formatDuration(stats.medianMinutes);

  const faqs = [
    ...(stats.minPrice
      ? [
          {
            q: `How much does a ${config.noun} in Orlando cost?`,
            a: `Bookable ${plural} near Orlando currently start from ${formatPrice(stats.minPrice)} per person${
              stats.medianPrice ? `, and the typical starting price is about ${formatPrice(stats.medianPrice)}` : ""
            }. Prices vary by date, group size and what is included, so check the booking page for your dates.`,
          },
        ]
      : []),
    ...(items[0]
      ? [
          {
            q: `What is the best ${config.noun} in Orlando?`,
            a: `Based on traveler ratings and review volume, our top pick right now is ${items[0].title}${
              items[0].rating && items[0].reviewCount
                ? `, rated ${items[0].rating.toFixed(1)} out of 5 from ${items[0].reviewCount.toLocaleString("en-US")} reviews`
                : ""
            }.`,
          },
        ]
      : []),
    ...config.faqs,
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: config.title,
      description: config.description,
      dateModified: updated,
      datePublished: "2026-09-24",
      mainEntityOfPage: absoluteUrl(path),
      image: absoluteUrl(featuredImage(config.slug).url),
      author: { "@type": "Organization", name: `${site.name} Editorial Team`, url: absoluteUrl("/about") },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: config.title,
      numberOfItems: items.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: items.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.title,
        url: absoluteUrl(`/book-now/${l.slug}`),
      })),
    },
  ];

  return (
    <>
      <PageHero
        title={config.title}
        crumbs={[
          { name: "Blog", href: "/blog" },
          { name: config.title, href: path },
        ]}
      >
        <p style={{ marginTop: 8, fontSize: "0.95rem" }}>
          By the ThingsToDoOrlando.com editorial team. Updated <time dateTime={updated}>{formatDate(updated)}</time>{" "}
          with current prices and reviews.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container container-narrow">
          <figure className="article-hero-img" style={{ margin: "0 0 32px" }}>
            <img
              src={featuredImage(config.slug).url}
              alt={config.title}
              width={1200}
              height={630}
              fetchPriority="high"
            />
          </figure>
          <div className="prose">
            {config.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <ul className="fact-row" aria-label="At a glance">
            <li>
              <TagIcon size={16} />
              {totalMatches} {totalMatches === 1 ? config.noun : plural} compared
            </li>
            {stats.minPrice ? (
              <li>
                <TagIcon size={16} />
                From {formatPrice(stats.minPrice)}
              </li>
            ) : null}
            {stats.avgRating ? (
              <li>
                <CheckIcon size={16} />
                Avg rating {stats.avgRating.toFixed(1)} ({stats.totalReviews.toLocaleString("en-US")} reviews)
              </li>
            ) : null}
            {typical ? (
              <li>
                <ClockIcon size={16} />
                Typical length {typical}
              </li>
            ) : null}
          </ul>

          {items.length === 0 ? (
            <div className="empty-state">
              <p>We are updating this list. Browse every option in the meantime.</p>
              <Link href={`/book-now/${category.slug}`} className="btn btn-primary">
                See {category.shortName}
              </Link>
            </div>
          ) : (
            <>
              {picks.length > 1 && (
                <div className="picks" aria-labelledby="picks-title">
                  <h2 id="picks-title">Our quick picks</h2>
                  <div className="picks-grid">
                    {picks.map((p) => (
                      <a key={p.label} href={`#${anchor(items.indexOf(p.listing))}`} className="pick">
                        <span className="pick-label">{p.label}</span>
                        <strong>{p.listing.title}</strong>
                        <span className="pick-meta">
                          {p.listing.rating ? `${p.listing.rating.toFixed(1)} stars` : "New"}
                          {p.listing.priceFrom ? ` · from ${formatPrice(p.listing.priceFrom, p.listing.currency)}` : ""}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <h2 id="compare">Compare the top {items.length}</h2>
              <div className="table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Experience</th>
                      <th scope="col">Rating</th>
                      <th scope="col">From</th>
                      <th scope="col">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((l, i) => (
                      <tr key={l.slug}>
                        <td>{i + 1}</td>
                        <td>
                          <a href={`#${anchor(i)}`}>{l.title}</a>
                        </td>
                        <td>{l.rating ? `${l.rating.toFixed(1)} (${(l.reviewCount ?? 0).toLocaleString("en-US")})` : "New"}</td>
                        <td>{l.priceFrom ? formatPrice(l.priceFrom, l.currency) : "See site"}</td>
                        <td>{l.durationLabel ?? "Varies"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      {items.length > 0 && (
        <section className="section section-alt" aria-label={`Ranked ${plural}`} style={{ paddingTop: 48 }}>
          <div className="container container-narrow">
            <ol className="rank-list">
              {items.map((l, i) => (
                <li key={l.slug} id={anchor(i)} className="rank-item">
                  <div className="rank-media">
                    <span className="rank-num" aria-hidden>
                      {i + 1}
                    </span>
                    <ListingMedia listing={l} sizes="(max-width: 760px) 100vw, 320px" priority={i === 0} />
                  </div>
                  <div className="rank-body">
                    <h2>
                      <span className="sr-only">{i + 1}. </span>
                      <Link href={`/book-now/${l.slug}`}>{l.title}</Link>
                    </h2>
                    {l.rating ? <Stars rating={l.rating} reviews={l.reviewCount} /> : null}
                    <ul className="card-meta rank-meta">
                      <li>
                        <PinIcon size={15} />
                        {l.location}
                      </li>
                      {l.durationLabel && (
                        <li>
                          <ClockIcon size={15} />
                          {l.durationLabel}
                        </li>
                      )}
                      {l.priceFrom ? (
                        <li>
                          <TagIcon size={15} />
                          From {formatPrice(l.priceFrom, l.currency)} per person
                        </li>
                      ) : null}
                    </ul>
                    <p>{itemSummary(l)}</p>
                    <h3>Why it made our list</h3>
                    <ul className="check-list">
                      {itemReasons(l).map((r) => (
                        <li key={r}>
                          <CheckIcon size={16} />
                          {r}
                        </li>
                      ))}
                    </ul>
                    <div className="rank-actions">
                      <BookButton
                        href={l.bookingUrl}
                        label="Check availability"
                        item={l.title}
                        className="btn btn-primary"
                      />
                      <Link href={`/book-now/${l.slug}`} className="btn btn-outline">
                        Full details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="choose-title">
        <div className="container container-narrow prose">
          <h2 id="choose-title">How to choose the best {plural} in Orlando</h2>
          {config.howToChoose.map((h) => (
            <div key={h.heading}>
              <h3>{h.heading}</h3>
              <p>{h.text}</p>
            </div>
          ))}
          <h2>Good to know before you book</h2>
          <ul className="check-list">
            {config.goodToKnow.map((g) => (
              <li key={g}>
                <CheckIcon size={16} />
                {g}
              </li>
            ))}
          </ul>
          <h2>How we rank</h2>
          <p>
            We compare every {config.noun} near Orlando listed on Viator and rank them with a weighted score that balances
            the average traveler rating with the number of reviews, so a small number of perfect scores cannot outrank
            thousands of consistent ones. Listings Viator flags as low quality or inactive are excluded, and near-duplicate
            listings are grouped. Prices and ratings update each time we refresh our data. We may earn a commission when
            you book, which never affects the ranking. See our <Link href="/disclaimer">disclosure</Link>.
          </p>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <h2 id="faq-title">Frequently asked questions</h2>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      <section className="section" aria-labelledby="more-lists">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>See every {category.shortName.toLowerCase()} option</h2>
              <p>Filter by price, rating and duration on our {category.shortName} page.</p>
            </div>
            <Link href={`/book-now/${category.slug}`} className="btn btn-primary btn-lg">
              Browse {category.shortName}
            </Link>
          </div>
          <h2 id="more-lists" style={{ marginTop: 48 }}>
            More best-of Orlando lists
          </h2>
          <ul className="pill-links">
            {listicles
              .filter((l) => l.slug !== config.slug)
              .map((l) => (
                <li key={l.slug}>
                  <Link href={`/blog/${l.slug}`}>{l.title}</Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <JsonLd data={schema} />
    </>
  );
}
