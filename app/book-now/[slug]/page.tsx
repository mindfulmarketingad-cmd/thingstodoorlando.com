import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import BookButton from "@/components/BookButton";
import DatePicker from "@/components/DatePicker";
import CategoryPage, { categoryTitle } from "@/components/CategoryPage";
import CollectionPage from "@/components/CollectionPage";
import { collectionBySlug, collections, getCollection, getIndexableCollections } from "@/lib/collections";
import Faq from "@/components/Faq";
import HotelSection from "@/components/HotelSection";
import { areaForListing } from "@/lib/hotels";
import { stayLinksForBookNow } from "@/lib/cross-links";
import JsonLd from "@/components/JsonLd";
import ListingCard, { formatPrice } from "@/components/ListingCard";
import ListingMedia from "@/components/ListingMedia";
import PageHero from "@/components/PageHero";
import Stars from "@/components/Stars";
import { CheckIcon, ClockIcon, PinIcon, ShieldIcon, TagIcon, XIcon } from "@/components/Icons";
import { posts } from "@/lib/blog";
import { categories, categoryByKey, categoryBySlug } from "@/lib/categories";
import { getGuideLinkMap, getListingBySlug, getLiveListings, getRelatedListings } from "@/lib/listings";
import { extractLinks } from "@/lib/markdown";
import { listingFaqs } from "@/lib/faqs";
import { comparableListings } from "@/lib/listicles";
import { tourInsights } from "@/data/tour-insights";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import type { Listing, ListingDetail } from "@/lib/types";
import { getProductDetail } from "@/lib/viator";

export const revalidate = 21600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const live = await getLiveListings();
  return [
    ...categories.map((c) => ({ slug: c.slug })),
    ...collections.map((c) => ({ slug: c.slug })),
    // Top products are prebuilt; the rest render on first request and are cached.
    ...live.slice(0, 200).map((l) => ({ slug: l.slug })),
  ];
}

function metaDescription(l: Listing) {
  const base = l.summary.replace(/\.\.\.$/, "");
  const text = `${base}${base.endsWith(".") ? "" : "."} Compare prices, reviews and availability.`;
  return text.length > 155 ? `${text.slice(0, 152).replace(/\s+\S*$/, "")}...` : text;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug.get(slug);
  if (category) {
    return pageMetadata({
      title: categoryTitle(category),
      absoluteTitle: true,
      description: `${category.intro.split(". ")[0]}. Compare prices, reviews and availability.`.slice(0, 160),
      path: `/book-now/${category.slug}`,
    });
  }
  if (collectionBySlug.has(slug)) {
    const data = (await getCollection(slug))!;
    const hero = data.items.find((l) => l.imageLarge ?? l.image);
    const img = hero ? (hero.imageLarge ?? hero.image) : undefined;
    return {
      ...pageMetadata({
        title: data.config.title,
        absoluteTitle: true,
        description: data.config.description,
        path: `/book-now/${slug}`,
        image: img ? { url: img.url, width: img.width, height: img.height, alt: img.alt } : undefined,
      }),
      // Thin collections stay reachable but out of the index until they fill up.
      ...(data.indexable ? {} : { robots: { index: false, follow: true } }),
    };
  }
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Experience not found", robots: { index: false } };
  // Full product titles keep every page's <title> unique (search engines truncate display, not indexing).
  return pageMetadata({
    title: listing.title,
    description: metaDescription(listing),
    path: `/book-now/${listing.slug}`,
    image: listing.image
      ? { url: listing.image.url, width: listing.image.width, height: listing.image.height, alt: listing.image.alt }
      : undefined,
  });
}

function tripSchema(l: ListingDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: l.title,
    description: l.summary,
    url: absoluteUrl(`/book-now/${l.slug}`),
    ...(l.image ? { image: [l.image.url, ...(l.gallery ?? []).slice(1, 4).map((g) => g.url)] } : {}),
    touristType: l.bestFor,
    itinerary: { "@type": "Place", name: l.location, address: { "@type": "PostalAddress", addressRegion: "FL", addressCountry: "US" } },
    ...(l.priceFrom
      ? {
          offers: {
            "@type": "Offer",
            price: l.priceFrom.toFixed(2),
            priceCurrency: l.currency,
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/book-now/${l.slug}`),
          },
        }
      : {}),
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const category = categoryBySlug.get(slug);
  if (category) return <CategoryPage category={category} />;
  if (collectionBySlug.has(slug)) {
    const [data, indexable] = await Promise.all([getCollection(slug), getIndexableCollections()]);
    return <CollectionPage data={data!} siblings={indexable.map((c) => c.slug)} />;
  }

  const base = await getListingBySlug(slug);
  if (!base) {
    // Retired editorial guide URLs point to the matching real tour.
    const target = (await getGuideLinkMap()).get(`/book-now/${slug}`);
    if (target) permanentRedirect(target);
    notFound();
  }

  const [listing, related, comparable] = await Promise.all([
    getProductDetail(base),
    getRelatedListings(base, 6),
    comparableListings(base, 3),
  ]);
  const insight = base.productCode ? tourInsights[base.productCode] : undefined;
  const primary = categoryByKey[listing.categories[0]];
  const isGuide = listing.source === "guide";
  const liveMatches = related.filter((r) => r.source === "viator");
  const otherRelated = isGuide ? related.filter((r) => r.source === "guide").slice(0, 3) : related.slice(0, 3);
  const mentionedIn = posts
    .filter((p) => p.featuredListings.includes(listing.slug) || extractLinks(p.body).includes(`/book-now/${listing.slug}`))
    .slice(0, 3);

  const ctaLabel = isGuide ? "Compare live prices" : "Check availability";

  return (
    <>
      <PageHero
        title={listing.title}
        intro={listing.summary}
        crumbs={[
          { name: "Book Now", href: "/book-now" },
          ...(primary ? [{ name: primary.shortName, href: `/book-now/${primary.slug}` }] : []),
          { name: listing.title, href: `/book-now/${listing.slug}` },
        ]}
      />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container detail-grid">
          <article>
            <div className="detail-media">
              <ListingMedia listing={listing} priority sizes="(max-width: 960px) 100vw, 760px" />
            </div>
            {listing.gallery && listing.gallery.length > 1 && (
              <div className="gallery">
                {listing.gallery.slice(1, 5).map((img) => (
                  <img key={img.url} src={img.url} alt={img.alt} loading="lazy" width={240} height={240} />
                ))}
              </div>
            )}

            <ul className="fact-row">
              <li>
                <PinIcon size={16} />
                {listing.location}
              </li>
              {listing.durationLabel && (
                <li>
                  <ClockIcon size={16} />
                  {listing.durationLabel}
                </li>
              )}
              {primary && (
                <li>
                  <TagIcon size={16} />
                  <Link href={`/book-now/${primary.slug}`}>{primary.shortName}</Link>
                </li>
              )}
              {listing.freeCancellation && (
                <li>
                  <ShieldIcon size={16} />
                  Free cancellation
                </li>
              )}
            </ul>
            {listing.rating ? (
              <p>
                <Stars rating={listing.rating} reviews={listing.reviewCount} />
              </p>
            ) : null}

            <div className="prose">
              <h2>About this experience</h2>
              {listing.description
                .split(/(?<=\.)\s+(?=[A-Z])/)
                .reduce<string[][]>((acc, sentence, i) => {
                  if (i % 3 === 0) acc.push([]);
                  acc[acc.length - 1].push(sentence);
                  return acc;
                }, [])
                .map((group, i) => (
                  <p key={i}>{group.join(" ")}</p>
                ))}

              {listing.highlights?.length ? (
                <>
                  <h2>Highlights</h2>
                  <ul className="check-list">
                    {listing.highlights.map((h) => (
                      <li key={h}>
                        <CheckIcon size={18} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {listing.inclusions?.length ? (
                <>
                  <h2>What is included</h2>
                  <ul className="check-list">
                    {listing.inclusions.map((h) => (
                      <li key={h}>
                        <CheckIcon size={18} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {listing.exclusions?.length ? (
                <>
                  <h3>Not included</h3>
                  <ul className="check-list is-x">
                    {listing.exclusions.map((h) => (
                      <li key={h}>
                        <XIcon size={18} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            {insight && (
              <div className="insight-box">
                <h2>Our take</h2>
                <p className="insight-verdict">{insight.verdict}</p>
                <div className="insight-grid">
                  <div>
                    <h3>Best for</h3>
                    <ul className="check-list">
                      {insight.bestFor.map((b) => (
                        <li key={b}>
                          <CheckIcon size={16} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Skip it if</h3>
                    <p>{insight.skipIf.charAt(0).toUpperCase() + insight.skipIf.slice(1)}</p>
                  </div>
                </div>
                <h3>Tips before you book</h3>
                <ol className="insight-tips">
                  {insight.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </div>
            )}

            {comparable.length > 0 && (
              <div className="info-box">
                <h2>How it compares</h2>
                <div className="table-wrap" style={{ marginBottom: 12 }}>
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th scope="col">Experience</th>
                        <th scope="col">Rating</th>
                        <th scope="col">From</th>
                        <th scope="col">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="is-current">
                        <td>
                          <strong>{listing.title}</strong> (this tour)
                        </td>
                        <td>{listing.rating ? `${listing.rating.toFixed(1)} (${(listing.reviewCount ?? 0).toLocaleString("en-US")})` : "New"}</td>
                        <td>{listing.priceFrom ? formatPrice(listing.priceFrom, listing.currency) : "See site"}</td>
                        <td>{listing.durationLabel ?? "Varies"}</td>
                      </tr>
                      {comparable.map((c) => (
                        <tr key={c.slug}>
                          <td>
                            <Link href={`/book-now/${c.slug}`}>{c.title}</Link>
                          </td>
                          <td>{c.rating ? `${c.rating.toFixed(1)} (${(c.reviewCount ?? 0).toLocaleString("en-US")})` : "New"}</td>
                          <td>{c.priceFrom ? formatPrice(c.priceFrom, c.currency) : "See site"}</td>
                          <td>{c.durationLabel ?? "Varies"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
                  Similar experiences in Orlando, compared by traveler rating, starting price and length. Prices update with
                  our latest data.
                </p>
              </div>
            )}

            {listing.bestFor && (
              <div className="info-box">
                <h2>Best for</h2>
                <p style={{ margin: 0 }}>{listing.bestFor}</p>
              </div>
            )}
            {listing.goodToKnow?.length ? (
              <div className="info-box">
                <h2>Good to know before you go</h2>
                <ul className="check-list" style={{ margin: 0 }}>
                  {listing.goodToKnow.map((g) => (
                    <li key={g}>
                      <CheckIcon size={18} />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {listing.meetingPoint && (
              <div className="info-box">
                <h2>Meeting point</h2>
                <p style={{ margin: 0 }}>{listing.meetingPoint}</p>
              </div>
            )}
            {listing.additionalInfo?.length ? (
              <div className="info-box">
                <h2>Additional information</h2>
                <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                  {listing.additionalInfo.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {listing.cancellationPolicy && (
              <div className="info-box">
                <h2>Cancellation policy</h2>
                <p style={{ margin: 0 }}>{listing.cancellationPolicy}</p>
              </div>
            )}

            {mentionedIn.length > 0 && (
              <div className="info-box">
                <h2>Featured in our guides</h2>
                <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                  {mentionedIn.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <aside className="booking-card" aria-label="Booking">
            {listing.priceFrom ? (
              <p className="price" style={{ margin: 0 }}>
                From <strong>{formatPrice(listing.priceFrom, listing.currency)}</strong> per person
              </p>
            ) : (
              <p className="price" style={{ margin: 0 }}>
                Prices vary by date and operator
                <strong style={{ fontSize: "1.25rem" }}>Compare live options</strong>
              </p>
            )}
            <ul>
              <li>
                <CheckIcon size={16} />
                Secure checkout
              </li>
              <li>
                <CheckIcon size={16} />
                {listing.freeCancellation ? "Free cancellation available" : "Cancellation terms shown before you pay"}
              </li>
              <li>
                <CheckIcon size={16} />
                Verified traveler reviews
              </li>
            </ul>
            <DatePicker />
            <BookButton href={listing.bookingUrl} label={ctaLabel} item={listing.title} />
            <p className="fine-print">
              You will be taken to Viator to complete your booking. We may earn a commission at no extra cost to you.{" "}
              <Link href="/disclaimer">Disclosure</Link>.
            </p>
          </aside>
        </div>
      </section>

      <HotelSection area={areaForListing(listing)} alt />

      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <h2 id="faq-title">Frequently Asked Questions</h2>
          </div>
          <Faq items={listingFaqs(listing)} />
          {primary && stayLinksForBookNow(primary.slug).length > 0 && (
            <nav aria-label="Where to stay" style={{ marginTop: 28 }}>
              <h3 style={{ fontSize: "1rem", marginBottom: 10 }}>Where to stay for this trip</h3>
              <ul className="pill-links">
                {stayLinksForBookNow(primary.slug).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>

      {liveMatches.length > 0 && (
        <section className="section section-alt" aria-labelledby="live-title">
          <div className="container">
            <div className="cat-head">
              <div>
                <h2 id="live-title">{isGuide ? `Top rated tours: ${listing.title}` : "Similar tours you may like"}</h2>
                <p>Live availability and traveler ratings from Viator.</p>
              </div>
            </div>
            <div className="card-grid">
              {liveMatches.slice(0, 6).map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {otherRelated.length > 0 && (
        <section className="section" aria-labelledby="related-title">
          <div className="container">
            <div className="cat-head">
              <div>
                <h2 id="related-title">More things to do in Orlando</h2>
                <p>Related experiences our readers book alongside this one.</p>
              </div>
              {primary && (
                <Link href={`/book-now/${primary.slug}`} className="link-arrow">
                  All {primary.shortName.toLowerCase()}
                </Link>
              )}
            </div>
            <div className="card-grid">
              {otherRelated.map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </div>
            <p className="center mt-lg">
              <Link href="/book-now" className="btn btn-outline">
                Back to all experiences
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* Sticky booking bar for phones and tablets; the sidebar card covers desktop. */}
      <div className="mobile-book-bar" role="region" aria-label="Book this experience">
        <div className="mobile-book-price">
          {listing.priceFrom ? (
            <>
              <span>From</span>
              <strong>{formatPrice(listing.priceFrom, listing.currency)}</strong>
            </>
          ) : (
            <strong>Live prices</strong>
          )}
        </div>
        <DatePicker variant="inline" label="Date" />
        <BookButton href={listing.bookingUrl} label="Check availability" item={listing.title} className="btn btn-primary" />
      </div>
      <JsonLd data={tripSchema(listing)} />
    </>
  );
}
