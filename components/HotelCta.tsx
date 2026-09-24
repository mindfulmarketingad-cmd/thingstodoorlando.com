import Link from "next/link";
import HotelCard from "./HotelCard";
import HotelLink from "./HotelLink";
import { areaFromName, getHotels } from "@/lib/hotels";

/** Stay22 call to action used inside posts via the [[hotels]] marker. */
export default function HotelCta({ area }: { area?: string }) {
  const hotels = getHotels(areaFromName(area), 3);
  if (hotels.length >= 2) {
    return (
      <aside className="hotel-cta hotel-cta-live" aria-label={area ? `Hotels near ${area}` : "Orlando hotels"}>
        <div className="hotel-cta-head">
          <strong>{area ? `Top rated hotels near ${area}` : "Top rated Orlando hotels"}</strong>
          <Link href="/place-to-stay">See all the best hotels in Orlando</Link>
        </div>
        <div className="hotel-grid hotel-grid-3">
          {hotels.map((h) => (
            <HotelCard key={h.id} hotel={h} headingLevel={4} />
          ))}
        </div>
      </aside>
    );
  }
  return (
    <aside className="hotel-cta" aria-label="Find a hotel">
      <div>
        <strong>{area ? `Staying near ${area}?` : "Find your Orlando hotel"}</strong>
        <p>
          Compare hotel and vacation rental prices across top booking sites on one map, or see our picks for the{" "}
          <Link href="/place-to-stay">best hotels in Orlando</Link>.
        </p>
      </div>
      <HotelLink className="btn btn-primary">Check hotel prices</HotelLink>
    </aside>
  );
}
