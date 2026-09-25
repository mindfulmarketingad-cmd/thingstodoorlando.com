import Link from "next/link";
import Faq from "./Faq";
import HotelSection from "./HotelSection";
import JsonLd from "./JsonLd";
import PageHero from "./PageHero";
import { linkHotels } from "./LinkHotels";
import RankedList from "./RankedList";
import { formatPrice } from "./ListingCard";
import { CheckIcon, ClockIcon, ShieldIcon, TagIcon } from "./Icons";
import { formatDate } from "@/lib/blog";
import { categoryByKey } from "@/lib/categories";
import { collections, kindLabel, type BuiltCollection } from "@/lib/collections";
import { formatDuration } from "@/lib/viator";
import { stayLinksForBookNow } from "@/lib/cross-links";
import { absoluteUrl } from "@/lib/site";

const anchor = (i: number) => `pick-${i + 1}`;

export default function CollectionPage({ data, siblings }: { data: BuiltCollection; siblings: string[] }) {
  const { config, items, stats, picks, updated, totalMatches, mix } = data;
  const path = `/book-now/${config.slug}`;
  const category = config.category ? categoryByKey[config.category] : undefined;
  const typical = formatDuration(stats.medianMinutes);
  const hero = items.find((l) => l.imageLarge ?? l.image);
  const heroImg = hero ? (hero.imageLarge ?? hero.image) : undefined;
  const top = items[0];

  const faqs = [
    ...(stats.minPrice && stats.medianPrice
      ? [
          {
            q:
              config.kind === "budget"
                ? `What is the cheapest thing on this list?`
                : config.kind === "near"
                  ? `How much do tours and attractions near ${config.h1.replace(/^Things To Do Near /, "")} cost?`
                  : `How much do ${config.noun.replace(/ under \$\d+$/, "")} cost?`,
            a:
              config.kind === "budget"
                ? `Prices on this list start from ${formatPrice(stats.minPrice)} per person, and the typical starting price is about ${formatPrice(stats.medianPrice)} across the ${totalMatches} options we compared. Check the booking page for the price on your date.`
                : `The ${totalMatches} options we track start from ${formatPrice(stats.minPrice)} per person, with a typical starting price of about ${formatPrice(stats.medianPrice)}. Prices change by date and group size, so check the booking page for your dates.`,
          },
        ]
      : []),
    ...(top
      ? [
          {
            q: `What is the best-rated option on this list?`,
            a: `Right now it is ${top.title}${
              top.rating && top.reviewCount
                ? `, rated ${top.rating.toFixed(1)} out of 5 by ${top.reviewCount.toLocaleString("en-US")} travelers`
                : ""
            }${top.priceFrom ? `, from ${formatPrice(top.priceFrom, top.currency)}` : ""}.`,
          },
        ]
      : []),
    ...(stats.freeCancellation
      ? [
          {
            q: "Can I cancel if my plans change?",
            a: `${stats.freeCancellation} of the ${totalMatches} options here offer free cancellation, usually up to 24 hours before the start time. The exact policy is shown on each booking page.`,
          },
        ]
      : []),
    ...config.faqs,
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.h1,
    description: config.description,
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: items.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.title,
      url: absoluteUrl(`/book-now/${l.slug}`),
    })),
  };

  const stays = stayLinksForBookNow(config.slug);
  const sameKind = collections.filter((c) => c.kind === config.kind && c.slug !== config.slug && siblings.includes(c.slug));
  const otherKinds = collections.filter((c) => c.kind !== config.kind && siblings.includes(c.slug));

  return (
    <>
      <PageHero
        title={config.h1}
        intro={config.description}
        crumbs={[
          { name: "Book Now", href: "/book-now" },
          ...(category ? [{ name: category.shortName, href: `/book-now/${category.slug}` }] : []),
          { name: config.label, href: path },
        ]}
      />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container container-narrow">
          {heroImg && (
            <figure className="article-hero-img" style={{ margin: "0 0 32px" }}>
              <img src={heroImg.url} alt={heroImg.alt} width={heroImg.width} height={heroImg.height} fetchPriority="high" />
            </figure>
          )}
          <div className="prose">
            {config.intro.map((p) => (
              <p key={p.slice(0, 24)}>{linkHotels(p)}</p>
            ))}
          </div>

          <ul className="fact-row" aria-label="At a glance">
            <li>
              <TagIcon size={16} />
              {totalMatches} options compared
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
            {stats.freeCancellation ? (
              <li>
                <ShieldIcon size={16} />
                {stats.freeCancellation} with free cancellation
              </li>
            ) : null}
          </ul>
          <p className="collection-updated">
            Prices and ratings updated <time dateTime={updated}>{formatDate(updated)}</time>.
          </p>

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

          {items.length > 0 && (
            <>
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

          {mix.length > 1 && (
            <>
              <h2 id="mix">What is on this list</h2>
              <ul className="pill-links collection-mix">
                {mix.slice(0, 6).map((m) => {
                  const c = categoryByKey[m.key];
                  return c ? (
                    <li key={m.key}>
                      <Link href={`/book-now/${c.slug}`}>
                        {c.shortName} ({m.count})
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </>
          )}
        </div>
      </section>

      {items.length > 0 && (
        <section className="section section-alt" aria-label={`Ranked ${config.noun}`} style={{ paddingTop: 48 }}>
          <div className="container container-narrow">
            <RankedList items={items} anchor={anchor} />
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="choose-title">
        <div className="container container-narrow prose">
          {config.local && (
            <>
              <h2 id="local-title">{config.local.heading}</h2>
              <ul>
                {config.local.items.map((it) => (
                  <li key={it.name}>
                    <strong>{it.name}:</strong> {linkHotels(it.text)}
                  </li>
                ))}
              </ul>
            </>
          )}
          <h2 id="choose-title">How to choose</h2>
          {config.howToChoose.map((h) => (
            <div key={h.heading}>
              <h3>{h.heading}</h3>
              <p>{linkHotels(h.text)}</p>
            </div>
          ))}
          <h2>Good to know before you book</h2>
          <ul className="check-list">
            {config.goodToKnow.map((g) => (
              <li key={g}>
                <CheckIcon size={16} />
                {linkHotels(g)}
              </li>
            ))}
          </ul>
          <h2>How we rank</h2>
          <p>
            We compare every matching experience listed on Viator for the Orlando area and rank them with a weighted score
            that balances the average traveler rating with the number of reviews, so a few perfect scores cannot outrank
            thousands of consistent ones. Transport-only services and listings Viator flags as inactive are left out, and
            near-duplicate listings are grouped. Prices and ratings refresh each time we update our data. We may earn a
            commission when you book, which never affects the ranking. See our <Link href="/disclaimer">disclosure</Link>.
          </p>
        </div>
      </section>

      <HotelSection area={config.hotelArea} alt />

      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <h2 id="faq-title">Frequently asked questions</h2>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="more-title">
        <div className="container">
          <div className="section-head">
            <h2 id="more-title">Keep planning</h2>
          </div>
          <div className="collection-links">
            <div>
              <h3>Related guides</h3>
              <ul>
                {config.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>{r.label}</Link>
                  </li>
                ))}
                {category && (
                  <li>
                    <Link href={`/book-now/${category.slug}`}>All {category.shortName.toLowerCase()} experiences</Link>
                  </li>
                )}
              </ul>
            </div>
            {sameKind.length > 0 && (
              <div>
                <h3>{kindLabel[config.kind]}</h3>
                <ul>
                  {sameKind.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/book-now/${c.slug}`}>{c.h1}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {stays.length > 0 && (
              <div>
                <h3>Where to stay</h3>
                <ul>
                  {stays.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/place-to-stay">Best hotels in Orlando</Link>
                  </li>
                </ul>
              </div>
            )}
            <div>
              <h3>More ways to browse</h3>
              <ul>
                {otherKinds
                  .filter((c, i, arr) => arr.findIndex((x) => x.kind === c.kind) === i)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link href={`/book-now/${c.slug}`}>{c.h1}</Link>
                    </li>
                  ))}
                <li>
                  <Link href="/book-now">Book tours and events in Orlando</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={schema} />
    </>
  );
}
