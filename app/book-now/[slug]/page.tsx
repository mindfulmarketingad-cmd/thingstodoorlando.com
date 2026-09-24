import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import BookButton from "@/components/BookButton";
import CategoryPage, { categoryTitle } from "@/components/CategoryPage";
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

  const base = await getListingBySlug(slug);
  if (!base) {
    // Retired editorial guide URLs point to the matching real tour.
    const target = (await getGuideLinkMap()).get(`/book-now/${slug}`);
    if (target) permanentRedirect(target);
    notFound();
  }

  const [listing, related] = await Promise.all([getProductDetail(base), getRelatedListings(base, 6)]);
  const primary = categoryByKey[listing.categories[0]];
  const isGuide = listing.source === "guide";
  const liveMatches = related.filter((r) => r.source === "viator");
  const otherRelated = isGuide ? related.filter((r) => r.source === "guide").slice(0, 3) : related.slice(0, 3);
  const mentionedIn = posts
    .filter((p) => p.featuredListings.includes(listing.slug) || extractLinks(p.body).includes(`/book-now/${listing.slug}`))
    .slice(0, 3);

  const ctaLabel = isGuide ? "Compare live prices on Viator" : "Check availability on Viator";

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
                Secure checkout on Viator
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
            <BookButton href={listing.bookingUrl} label={ctaLabel} item={listing.title} />
            <p className="fine-print">
              You will be taken to Viator to complete your booking. We may earn a commission at no extra cost to you.{" "}
              <Link href="/disclaimer">Disclosure</Link>.
            </p>
          </aside>
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

      <JsonLd data={tripSchema(listing)} />
    </>
  );
}
