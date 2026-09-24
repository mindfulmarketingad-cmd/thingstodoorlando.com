import Link from "next/link";
import HotelCard from "./HotelCard";
import { areaLabel, getHotels, type HotelArea } from "@/lib/hotels";

/** "Where to stay nearby" block for tour, category and guide pages. Renders nothing until hotel data exists. */
export default function HotelSection({ area, alt = false }: { area: HotelArea; alt?: boolean }) {
  const hotels = getHotels(area, 4);
  if (hotels.length < 2) return null;
  const place = areaLabel[area];
  return (
    <section className={`section${alt ? " section-alt" : ""}`} aria-labelledby="stay-near-title">
      <div className="container">
        <div className="cat-head">
          <div>
            <h2 id="stay-near-title">Where to stay near {place}</h2>
            <p>
              Highly rated places to stay near {place}, an easy base for this trip. Tap Check prices to compare live
              rates for your dates.
            </p>
          </div>
          <Link href="/place-to-stay" className="link-arrow">
            Best hotels in Orlando
          </Link>
        </div>
        <div className="hotel-grid">
          {hotels.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </div>
    </section>
  );
}
