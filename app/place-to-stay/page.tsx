import Link from "next/link";
import Faq from "@/components/Faq";
import HotelCard from "@/components/HotelCard";
import HotelLink from "@/components/HotelLink";
import { getHotels, type HotelArea } from "@/lib/hotels";
import { linkHotels } from "@/components/LinkHotels";
import PageHero from "@/components/PageHero";
import StayMap from "@/components/StayMap";
import { stayGuides } from "@/data/stay-guides";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 21600;

export const metadata = pageMetadata({
  title: "Best Hotels In Orlando Florida: Where To Stay By Area",
  description:
    "The best hotels in Orlando, Florida by area: Disney, Universal, International Drive, Kissimmee, Downtown and Winter Park. Compare prices on a live hotel map.",
  path: "/place-to-stay",
});


interface Area {
  id: HotelArea;
  name: string;
  bestFor: string;
  intro: string;
  hotels: { name: string; note: string }[];
  nearby: { label: string; href: string }[];
}

const areas: Area[] = [
  {
    id: "disney",
    name: "Walt Disney World and Lake Buena Vista",
    bestFor: "Families spending most of the trip at Disney",
    intro:
      "Disney resort hotels come with Early Theme Park Entry and Disney transportation, while Lake Buena Vista and Bonnet Creek offer upscale hotels just outside the gates.",
    hotels: [
      { name: "Disney's Grand Floridian Resort & Spa", note: "Deluxe resort on the monorail loop to Magic Kingdom." },
      { name: "Disney's Contemporary Resort", note: "A short walk to Magic Kingdom, with monorail access." },
      { name: "Disney's Polynesian Village Resort", note: "South Seas theme, monorail access and fireworks views." },
      { name: "Disney's Art of Animation Resort", note: "Value-priced family suites on the Disney Skyliner." },
      { name: "Four Seasons Resort Orlando at Walt Disney World Resort", note: "Luxury resort with a lazy river inside Disney property." },
      { name: "Waldorf Astoria Orlando", note: "Quiet luxury in Bonnet Creek, minutes from Disney Springs." },
    ],
    nearby: [
      { label: "Hotels near Disney World guide", href: "/place-to-stay/hotels-near-disney-world" },
      { label: "Things to do near Disney World", href: "/book-now/things-to-do-near-disney-world" },
      { label: "Best theme parks in Orlando", href: "/blog/best-theme-parks-in-orlando" },
      { label: "Theme park tickets and tours", href: "/book-now/theme-parks" },
      { label: "Best water parks in Orlando", href: "/blog/best-water-parks-in-orlando-florida" },
    ],
  },
  {
    id: "universal",
    name: "Universal Orlando Resort",
    bestFor: "Thrill seekers and Harry Potter fans",
    intro:
      "Universal's on-site hotels are a walk, boat ride or shuttle from the parks and CityWalk, and guests get early park admission to select attractions.",
    hotels: [
      { name: "Hard Rock Hotel at Universal Orlando", note: "Premier hotel with Universal Express Unlimited included; walk to the parks." },
      { name: "Loews Portofino Bay Hotel", note: "Italian seaside theme, Express Unlimited included, boat to CityWalk." },
      { name: "Loews Royal Pacific Resort", note: "Premier tropical resort with Express Unlimited included." },
      { name: "Universal Helios Grand Hotel", note: "Premier hotel with its own entrance to Epic Universe." },
      { name: "Universal's Cabana Bay Beach Resort", note: "Retro, family-friendly and walkable to Volcano Bay." },
    ],
    nearby: [
      { label: "Theme park tickets", href: "/book-now/theme-parks" },
      { label: "Drinks and nightlife in Orlando", href: "/book-now/drinks-and-nightlife" },
      { label: "Best dinner shows in Orlando", href: "/blog/best-dinner-shows-in-orlando-florida" },
    ],
  },
  {
    id: "international-drive",
    name: "International Drive",
    bestFor: "First-time visitors splitting time between parks",
    intro:
      "I-Drive is Orlando's central tourist corridor, close to Universal at its north end and SeaWorld and Disney at its south end, with restaurants and attractions within walking distance.",
    hotels: [
      { name: "Hyatt Regency Orlando", note: "Large resort next to the Orange County Convention Center." },
      { name: "Rosen Shingle Creek", note: "Resort with its own golf course on the south end of I-Drive." },
      { name: "Hilton Orlando", note: "Lazy river and a short drive to SeaWorld." },
    ],
    nearby: [
      { label: "Hotels near the Convention Center", href: "/place-to-stay/hotels-near-orange-county-convention-center" },
      { label: "Things to do near International Drive", href: "/book-now/things-to-do-near-international-drive" },
      { label: "Things to do on International Drive", href: "/search/international-drive" },
      { label: "Sightseeing tours", href: "/book-now/sightseeing" },
      { label: "Food and dining experiences", href: "/book-now/food-and-dining" },
    ],
  },
  {
    id: "kissimmee",
    name: "Kissimmee",
    bestFor: "Budget travelers, big families and groups",
    intro:
      "Kissimmee sits just south of Disney, with lower prices, large resorts and thousands of vacation homes with private pools.",
    hotels: [
      { name: "Gaylord Palms Resort & Convention Center", note: "Huge glass-domed atrium and a water park on site." },
      { name: "Margaritaville Resort Orlando", note: "Resort with a water park and vacation cottages near Disney." },
    ],
    nearby: [
      { label: "Things to do near Kissimmee", href: "/book-now/things-to-do-near-kissimmee" },
      { label: "Best airboat tours in Orlando", href: "/blog/best-airboat-tours-in-orlando" },
      { label: "Nature and wildlife tours", href: "/book-now/airboat-and-wildlife" },
      { label: "Family-friendly tours", href: "/blog/best-family-friendly-tours-in-orlando-florida" },
    ],
  },
  {
    id: "downtown",
    name: "Downtown Orlando",
    bestFor: "Couples, sports fans and repeat visitors",
    intro: "Downtown has Lake Eola Park, the Orlando Magic and Orlando City SC, and the city's best restaurants and bars.",
    hotels: [{ name: "Grand Bohemian Hotel Orlando", note: "Art-filled boutique hotel steps from Lake Eola." }],
    nearby: [
      { label: "Things to do near Downtown Orlando", href: "/book-now/things-to-do-near-downtown-orlando" },
      { label: "Orlando events calendar", href: "/events" },
      { label: "Sports tours and games", href: "/book-now/sports" },
      { label: "Couples tours and events", href: "/blog/romantic-things-to-do-in-orlando-for-couples" },
    ],
  },
  {
    id: "winter-park",
    name: "Winter Park",
    bestFor: "Slower-paced trips and couples",
    intro: "Brick streets, Park Avenue boutiques and the Scenic Boat Tour give Winter Park a small-town feel just north of downtown.",
    hotels: [{ name: "The Alfond Inn", note: "Boutique hotel with a contemporary art collection near Park Avenue." }],
    nearby: [
      { label: "Hotels near downtown Winter Park guide", href: "/place-to-stay/hotels-near-downtown-winter-park" },
      { label: "Things to do near Winter Park", href: "/book-now/things-to-do-near-winter-park" },
      { label: "Kayaking tours in Orlando", href: "/blog/best-kayaking-tours-in-orlando" },
      { label: "Relaxation and spas", href: "/book-now/relaxation-and-spas" },
      { label: "Shopping in Orlando", href: "/book-now/shopping" },
    ],
  },
  {
    id: "airport",
    name: "Orlando International Airport",
    bestFor: "Early flights and cruise travelers",
    intro: "Staying at the airport takes the stress out of early departures and the drive to Port Canaveral and the Space Coast.",
    hotels: [{ name: "Hyatt Regency Orlando International Airport", note: "Inside the main terminal, with runway views." }],
    nearby: [
      { label: "Hotels near Lake Nona guide", href: "/place-to-stay/hotels-near-lake-nona" },
      { label: "Kennedy Space Center trips", href: "/book-now/kennedy-space-center" },
      { label: "Day trips from Orlando", href: "/book-now/day-trips" },
    ],
  },
];

const faqs = [
  {
    q: "What is the best area to stay in Orlando?",
    a: "International Drive is the most central choice if you plan to visit both Disney and Universal. Stay at or near Walt Disney World for a Disney-focused trip, at a Universal hotel for Universal, and in Kissimmee for the best value on space and pools.",
  },
  {
    q: "Is it worth staying at a Disney or Universal hotel?",
    a: "Often, yes. Disney resort guests get Early Theme Park Entry and free Disney transportation, and Universal hotel guests get early park admission. Universal's premier hotels also include Universal Express Unlimited, which can save hours in line.",
  },
  {
    q: "How can I find the cheapest hotels in Orlando?",
    a: "Compare prices across booking sites on the map above, book early for holidays and spring break, and consider Kissimmee or the south end of International Drive, where hotels are usually cheaper than on Disney or Universal property.",
  },
  {
    q: "Do I need a car if I stay in Orlando?",
    a: "Not always. Disney and Universal hotels have their own transportation, and many International Drive hotels run shuttles. A car is useful if you stay in Kissimmee, Downtown or Winter Park, or plan day trips to the coast.",
  },
  {
    q: "How far are Orlando hotels from the theme parks?",
    a: "Disney and Universal hotels are minutes from their parks. International Drive is about 10 to 20 minutes from both, Kissimmee is 10 to 20 minutes from Disney, and Downtown and Winter Park are about 25 to 40 minutes away depending on traffic.",
  },
];

export default function PlaceToStayPage() {
  return (
    <>
      <PageHero
        title="Best Hotels In Orlando Florida"
        intro="These are the best hotels in Orlando, Florida, sorted by area so you can stay close to the parks, attractions and neighborhoods you came for. Compare live prices from top booking sites on the map, then plan your days with our guides."
        crumbs={[{ name: "Hotels", href: "/place-to-stay" }]}
      />

      <section className="section" style={{ paddingTop: 40 }} aria-labelledby="map-title">
        <div className="container">
          <div className="section-head">
            <h2 id="map-title">Orlando hotel map with live prices</h2>
            <p>Zoom in on any area to compare hotel and vacation rental prices across booking sites.</p>
          </div>
          <StayMap />
        </div>
      </section>

      <section className="section" aria-labelledby="guides-title">
        <div className="container">
          <div className="section-head">
            <h2 id="guides-title">Hotel guides for Orlando&apos;s top spots</h2>
            <p>Where to stay near the attractions, events and neighborhoods travelers ask us about most.</p>
          </div>
          <ul className="stay-guide-grid">
            {stayGuides.map((g) => (
              <li key={g.slug}>
                <Link href={`/place-to-stay/${g.slug}`}>
                  <strong>{g.h1}</strong>
                  <span>{g.description.split(":")[0]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="areas-title">
        <div className="container">
          <div className="section-head">
            <h2 id="areas-title">The best hotels in Orlando by area</h2>
            <p>
              Not sure which area fits your trip? Read our full guide on{" "}
              <Link href="/blog/where-to-stay-in-orlando">where to stay in Orlando</Link>.
            </p>
          </div>
          <nav aria-label="Jump to area">
            <ul className="pill-links" style={{ marginBottom: 28 }}>
              {areas.map((a) => (
                <li key={a.id}>
                  <a href={`#${a.id}`}>{a.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="stay-areas">
            {areas.map((a) => (
              <article key={a.id} id={a.id} className="stay-area">
                <header>
                  <h3>Best hotels near {a.name}</h3>
                  <p className="stay-best">Best for: {a.bestFor}</p>
                  <p>{linkHotels(a.intro)}</p>
                </header>
                {getHotels(a.id, 6).length >= 3 ? (
                  <div className="hotel-grid hotel-grid-3">
                    {getHotels(a.id, 6).map((h) => (
                      <HotelCard key={h.id} hotel={h} headingLevel={4} />
                    ))}
                  </div>
                ) : (
                <ul className="stay-hotels">
                  {a.hotels.map((h) => (
                    <li key={h.name}>
                      <div>
                        <strong>{h.name}</strong>
                        <span>{h.note}</span>
                      </div>
                      <HotelLink className="btn btn-outline btn-sm">Check prices</HotelLink>
                    </li>
                  ))}
                </ul>
                )}
                <div className="stay-nearby">
                  <span>Things to do nearby:</span>
                  {a.nearby.map((n) => (
                    <Link key={n.href} href={n.href}>
                      {n.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tips-title">
        <div className="container prose">
          <h2 id="tips-title">How to choose an Orlando hotel</h2>
          <ul>
            <li>
              <strong>Pick your area first.</strong> Orlando is spread out, and I-4 traffic can turn a short drive into an
              hour. Stay near the attractions you will visit most.
            </li>
            <li>
              <strong>Count the hidden costs.</strong> Resort fees and theme park parking add up. On-site Disney and
              Universal hotels often include transportation that offsets a higher nightly rate.
            </li>
            <li>
              <strong>Book early for peak weeks.</strong> Spring break, summer and the holidays fill up fast. Check our{" "}
              <Link href="/blog/best-time-to-visit-orlando">best time to visit Orlando</Link> guide and the{" "}
              <Link href="/events">events calendar</Link> before you pick dates.
            </li>
            <li>
              <strong>Plan your days, then your nights.</strong> Browse the{" "}
              <Link href="/blog/top-10-things-to-do-in-orlando-florida">top 10 things to do in Orlando</Link> and{" "}
              <Link href="/book-now">book tours and events</Link> near your hotel.
            </li>
          </ul>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <h2 id="faq-title">Orlando hotel FAQs</h2>
          </div>
          <Faq items={faqs} />
        </div>
      </section>
    </>
  );
}
