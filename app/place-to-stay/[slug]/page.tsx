import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Faq from "@/components/Faq";
import HotelLink from "@/components/HotelLink";
import HotelSection from "@/components/HotelSection";
import JsonLd from "@/components/JsonLd";
import { linkHotels } from "@/components/LinkHotels";
import ListingCard from "@/components/ListingCard";
import PageHero from "@/components/PageHero";
import StayMap from "@/components/StayMap";
import { CheckIcon, ClockIcon, XIcon } from "@/components/Icons";
import { stayGuideBySlug, stayGuides } from "@/data/stay-guides";
import { findListings } from "@/lib/listicles";
import { bookNowLinksForStay } from "@/lib/cross-links";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 21600;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

/** Transport and discount products are not things to do. */
const NOT_A_TOUR = /\bMCO\b|ride in style|transportation|chauffeur|self guided disney save|discount card|cruise friendly/i;

export function generateStaticParams() {
  return stayGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = stayGuideBySlug.get(slug);
  if (!g) return {};
  return pageMetadata({ title: g.title, absoluteTitle: true, description: g.description, path: `/place-to-stay/${g.slug}` });
}

export default async function StayGuidePage({ params }: Props) {
  const { slug } = await params;
  const g = stayGuideBySlug.get(slug);
  if (!g) notFound();
  const path = `/place-to-stay/${g.slug}`;
  const tours = (await findListings(g.tours, 12, 0)).filter((l) => !NOT_A_TOUR.test(l.title)).slice(0, 6);
  const others = stayGuides.filter((o) => o.slug !== g.slug);
  const bookLinks = bookNowLinksForStay(g.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: g.h1,
    description: g.description,
    url: absoluteUrl(path),
    numberOfItems: g.hotels.length,
    itemListElement: g.hotels.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Hotel", name: h.name, address: { "@type": "PostalAddress", addressRegion: "FL", addressCountry: "US" } },
    })),
  };

  return (
    <>
      <PageHero
        title={g.h1}
        intro={g.description}
        crumbs={[
          { name: "Hotels", href: "/place-to-stay" },
          { name: g.label, href: path },
        ]}
      />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container container-narrow prose">
          {g.intro.map((p) => (
            <p key={p.slice(0, 24)}>{linkHotels(p)}</p>
          ))}
        </div>
        <div className="container" style={{ marginTop: 24 }}>
          <StayMap title={`Map of hotels for ${g.place} with live prices`} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="where-title">
        <div className="container">
          <div className="section-head">
            <h2 id="where-title">Where to stay for {g.place}</h2>
            <p>Each area has trade-offs. Here is how they compare.</p>
          </div>
          <div className="stay-compare">
            {g.areas.map((a) => (
              <article key={a.name} className="stay-area">
                <h3>{a.name}</h3>
                <p className="stay-best">
                  <ClockIcon size={14} /> {a.drive}
                </p>
                <p>{linkHotels(a.text)}</p>
                <ul className="check-list">
                  {a.pros.map((x) => (
                    <li key={x}>
                      <CheckIcon size={16} />
                      {x}
                    </li>
                  ))}
                </ul>
                <ul className="check-list is-x">
                  {a.cons.map((x) => (
                    <li key={x}>
                      <XIcon size={16} />
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="hotels-title">
        <div className="container">
          <div className="section-head">
            <h2 id="hotels-title">Hotels we recommend</h2>
            <p>Compare live rates for your dates on each hotel before you book.</p>
          </div>
          <ul className="stay-hotels">
            {g.hotels.map((h) => (
              <li key={h.name}>
                <div>
                  <strong>{h.name}</strong>
                  <span>
                    {h.area} · {h.note}
                  </span>
                </div>
                <HotelLink className="btn btn-outline btn-sm">Check prices</HotelLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {g.hotelArea && <HotelSection area={g.hotelArea} alt />}

      <section className="section section-alt" aria-labelledby="drive-title">
        <div className="container container-narrow">
          <h2 id="drive-title">Drive times</h2>
          <div className="table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">To</th>
                  <th scope="col">Approx. drive</th>
                </tr>
              </thead>
              <tbody>
                {g.driveTimes.map((d) => (
                  <tr key={d.to}>
                    <td>{d.to}</td>
                    <td>{d.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="stay-map-note">Times are without traffic. Allow extra time on weekday rush hours and event days.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="tips-title">
        <div className="container container-narrow prose">
          <h2 id="tips-title">Local tips</h2>
          {g.localTips.map((t) => (
            <div key={t.heading}>
              <h3>{t.heading}</h3>
              <p>{linkHotels(t.text)}</p>
            </div>
          ))}
        </div>
      </section>

      {tours.length > 0 && (
        <section className="section section-alt" aria-labelledby="tours-title">
          <div className="container">
            <div className="cat-head">
              <div>
                <h2 id="tours-title">{g.toursHeading}</h2>
                <p>Real, bookable experiences with live prices and traveler reviews.</p>
              </div>
              <Link href="/book-now" className="link-arrow">
                All Orlando tours
              </Link>
            </div>
            <div className="card-grid">
              {tours.map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <h2 id="faq-title">Frequently asked questions</h2>
          </div>
          <Faq items={g.faqs} />
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
                {g.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>{r.label}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/place-to-stay">Best hotels in Orlando by area</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>Book things to do nearby</h3>
              <ul>
                {bookLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>More places to stay</h3>
              <ul>
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/place-to-stay/${o.slug}`}>{o.h1}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={schema} />
    </>
  );
}
