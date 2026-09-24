import Link from "next/link";
import CategoryTile from "@/components/CategoryTile";
import Faq from "@/components/Faq";
import ListingCard from "@/components/ListingCard";
import SearchForm from "@/components/SearchForm";
import HeroVideo from "@/components/HeroVideo";
import JsonLd from "@/components/JsonLd";
import { linkHotels } from "@/components/LinkHotels";
import { ArrowIcon, ShieldIcon, SparkIcon, UsersIcon } from "@/components/Icons";
import { categoryByKey } from "@/lib/categories";
import { featuredImage, posts, formatDate } from "@/lib/blog";
import { listicles } from "@/lib/listicles";
import { getGuideLinkMap, getListingsForCategory, getLiveListings } from "@/lib/listings";
import { pageMetadata } from "@/lib/metadata";
import { getTop10, TOP10_SLUG } from "@/lib/top10";
import EventCard from "@/components/EventCard";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { eventsForMonths, MONTHS, monthSlug, orlandoToday } from "@/lib/events";
import { itemListSchema } from "@/lib/schema";
import type { CategoryKey } from "@/lib/types";

export const revalidate = 21600;

export const metadata = pageMetadata({
  title: "Things To Do In Orlando | Tours, Events & More",
  absoluteTitle: true,
  description:
    "Discover the best things to do in Orlando: theme park tickets, Kennedy Space Center trips, airboat tours, dinner shows and date nights. Compare and book top tours.",
  path: "/",
});

const heroSearches = [
  { href: "/book-now/kennedy-space-center", label: "Kennedy Space Center" },
  { href: "/book-now/airboat-and-wildlife", label: "Airboat tours" },
  { href: "/search/disney-world", label: "Disney World" },
  { href: "/book-now/dinner-shows", label: "Dinner shows" },
  { href: "/search/manatees", label: "Manatees" },
];

const resourceTiles: CategoryKey[] = ["theme-parks", "space", "wildlife", "dinner-shows", "water", "sky", "day-trips"];

const moreGrids: { key: CategoryKey; heading: string; intro: string }[] = [
  {
    key: "theme-parks",
    heading: "Theme Park Tickets & Tours in Orlando",
    intro: "Disney, Universal, SeaWorld and LEGOLAND, plus guided days that help you ride more and wait less.",
  },
  {
    key: "space",
    heading: "Kennedy Space Center & Space Coast Trips",
    intro: "Rockets, astronauts and launch viewing about an hour east of Orlando.",
  },
  {
    key: "wildlife",
    heading: "Airboat & Wildlife Tours Near Orlando",
    intro: "Gators, eagles and manatees in the wild, often less than 45 minutes from your hotel.",
  },
  {
    key: "dinner-shows",
    heading: "Dinner Shows & Nightlife in Orlando",
    intro: "Jousting knights, pirate ships and murder mysteries with dinner served.",
  },
];

const faqs = [
  {
    q: "What are the top things to do in Orlando?",
    a: "The most popular things to do in Orlando are visiting Walt Disney World and Universal Orlando Resort, taking a day trip to Kennedy Space Center, riding an airboat to see alligators, catching a dinner show, paddling a crystal clear spring and seeing the city from a hot air balloon or The Wheel at ICON Park.",
  },
  {
    q: "What is there to do in Orlando besides theme parks?",
    a: "Plenty. Try an airboat tour near Kissimmee, kayak Wekiwa Springs, see manatees at Blue Spring State Park in winter, take the Winter Park Scenic Boat Tour, visit Kennedy Space Center, join a food tour or take a day trip to Clearwater Beach or St. Augustine.",
  },
  {
    q: "What are the best things to do in Orlando with kids?",
    a: "Families love Kennedy Space Center, Gatorland, airboat rides, pirate and medieval dinner shows, LEGOLAND Florida for younger kids, swan boats at Lake Eola and of course the theme parks. Browse our family friendly category for the full list.",
  },
  {
    q: "What are romantic things to do in Orlando for couples?",
    a: "Couples often book a sunrise hot air balloon ride, a night helicopter tour over the fireworks, the Winter Park boat tour followed by dinner on Park Avenue, a murder mystery dinner show or a sunset ride on The Wheel.",
  },
  {
    q: "Is it safe to book tours through ThingsToDoOrlando.com?",
    a: "Yes. We do not take payments ourselves. Every booking link takes you to Viator, a Tripadvisor company, where you pay securely, see real traveler reviews and view the cancellation policy before you buy. Many tours offer free cancellation up to 24 hours before the start time.",
  },
  {
    q: "Do I pay more by booking through this site?",
    a: "No. Prices are the same as booking directly on Viator. We may earn a small affiliate commission when you book, which helps keep our guides free.",
  },
  {
    q: "When is the best time to visit Orlando?",
    a: "Late January through early March, late April through mid-May and the weeks after Labor Day usually offer the best mix of weather, crowds and prices. Summer brings heat and afternoon storms, and holiday weeks are the busiest of the year.",
  },
];

export default async function HomePage() {
  const [links, family, couples, live, ...grids] = await Promise.all([
    getGuideLinkMap(),
    getListingsForCategory("family", 6),
    getListingsForCategory("couples", 6),
    getLiveListings(),
    ...moreGrids.map((g) => getListingsForCategory(g.key, 3)),
  ]);
  const trending = live.slice(0, 6);
  const to = (path: string) => links.get(path) ?? path;
  const top10 = getTop10();
  const { month } = orlandoToday();
  const monthEvents = eventsForMonths([month]).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <HeroVideo />
        <div className="hero-inner">
          <h1 id="hero-title">Things To Do In Orlando</h1>
          <p className="hero-sub">
            Tours, tickets, shows and hidden gems in and around Orlando. Search by attraction or destination and book
            top-rated experiences in minutes.
          </p>
          <SearchForm id="hero-search" placeholder="Try Kennedy Space Center, airboat or Kissimmee" />
          <nav className="hero-tags" aria-label="Popular searches">
            {heroSearches.map((s) => (
              <Link key={s.href} href={s.href}>
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {top10.length > 0 && (
        <section className="top10" aria-labelledby="top10-title">
          <div className="container">
            <div className="top10-head">
              <div>
                <p className="eyebrow">Start here</p>
                <h2 id="top10-title">Top 10 Things To Do In Orlando</h2>
                <p>
                  Our editors&apos; definitive shortlist of Orlando&apos;s must-do experiences, with costs, tips and the
                  best way to book each one.
                </p>
              </div>
              <Link href={`/blog/${TOP10_SLUG}`} className="link-arrow">
                Read the complete guide <ArrowIcon size={16} />
              </Link>
            </div>
            <ol className="top10-list">
              {top10.map((t) => (
                <li key={t.rank}>
                  <Link href={t.href}>
                    <span className="top10-num" aria-hidden>
                      {t.rank}
                    </span>
                    <span className="top10-text">
                      <strong>{t.name}</strong>
                      <span>{t.hint}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <div className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item">
            <span className="trust-icon">
              <ShieldIcon size={22} />
            </span>
            <div>
              <strong>Secure booking with Viator</strong>
              <span>Checkout and support from a Tripadvisor company</span>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">
              <SparkIcon size={22} />
            </span>
            <div>
              <strong>Free cancellation on many tours</strong>
              <span>Check each listing for its policy</span>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">
              <UsersIcon size={22} />
            </span>
            <div>
              <strong>Real traveler reviews</strong>
              <span>Ratings from verified Viator bookings</span>
            </div>
          </div>
        </div>
      </div>

      <section className="section" aria-labelledby="resource-title">
        <div className="container">
          <div className="section-head">
            <h2 id="resource-title">The #1 Resource For Tours, Events and Attractions in Orlando</h2>
            <p>
              From rocket launches to gator-spotting airboats, we organize every great Orlando experience in one place so
              you can compare options and book with confidence.
            </p>
          </div>
          <div className="tile-grid">
            {resourceTiles.map((key) => {
              const c = categoryByKey[key];
              return (
                <CategoryTile
                  key={key}
                  href={`/book-now/${c.slug}`}
                  title={c.shortName}
                  subtitle={c.blurb}
                  image={`/illustrations/${c.illustration}.svg`}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="family-title">
        <div className="container">
          <div className="cat-head">
            <div>
              <h2 id="family-title">Family Friendly Tours & Events in Orlando</h2>
              <p>Kid-approved adventures with easy logistics, from gator parks to pirate dinner shows.</p>
            </div>
            <Link href={to("/book-now/family-friendly")} className="link-arrow">
              See all family activities <ArrowIcon size={16} />
            </Link>
          </div>
          <div className="card-grid">
            {family.map((l) => (
              <ListingCard key={l.slug} listing={l} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="couples-title">
        <div className="container">
          <div className="cat-head">
            <div>
              <h2 id="couples-title">Couples Tours & Events in Orlando</h2>
              <p>Sunrise balloons, sunset cruises and date nights worth dressing up for.</p>
            </div>
            <Link href={to("/book-now/couples")} className="link-arrow">
              See all date ideas <ArrowIcon size={16} />
            </Link>
          </div>
          <div className="card-grid">
            {couples.map((l) => (
              <ListingCard key={l.slug} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {moreGrids.map((g, i) => {
        const c = categoryByKey[g.key];
        const items = grids[i];
        if (!items.length) return null;
        return (
          <section
            key={g.key}
            className={`section cat-section${i % 2 === 0 ? " section-alt" : ""}`}
            aria-labelledby={`cat-${g.key}`}
            style={i % 2 === 0 ? { paddingTop: "clamp(48px, 7vw, 88px)" } : undefined}
          >
            <div className="container">
              <div className="cat-head">
                <div>
                  <h2 id={`cat-${g.key}`}>{g.heading}</h2>
                  <p>{linkHotels(g.intro)}</p>
                </div>
                <Link href={`/book-now/${c.slug}`} className="link-arrow">
                  More {c.shortName.toLowerCase()} <ArrowIcon size={16} />
                </Link>
              </div>
              <div className="card-grid">
                {items.map((l) => (
                  <ListingCard key={l.slug} listing={l} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {trending.length >= 3 && (
        <section className="section" aria-labelledby="trending-title">
          <div className="container">
            <div className="section-head">
              <h2 id="trending-title">Trending Orlando Excursions</h2>
              <p>The highest rated tours in Orlando right now, based on verified traveler reviews.</p>
            </div>
            <div className="card-grid">
              {trending.map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </div>
            <p className="center mt-lg">
              <Link href="/book-now" className="btn btn-outline">
                Browse all tours
              </Link>
            </p>
          </div>
        </section>
      )}

      {monthEvents.length > 0 && (
        <section className="section" aria-labelledby="events-title">
          <div className="container">
            <div className="cat-head">
              <div>
                <h2 id="events-title">Happening in Orlando in {MONTHS[month - 1]}</h2>
                <p>Festivals, holiday events and game days worth planning your trip around.</p>
              </div>
              <Link href="/events" className="link-arrow">
                Full events calendar <ArrowIcon size={16} />
              </Link>
            </div>
            <div className="event-grid">
              {monthEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
            <p className="center mt-lg">
              <Link href="/events/this-weekend" className="btn btn-outline">
                Things to do this weekend
              </Link>{" "}
              <Link href={`/events/${monthSlug(month)}`} className="btn btn-outline">
                Orlando in {MONTHS[month - 1]}
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="section section-alt" aria-labelledby="video-title">
        <div className="container video-section">
          <div>
            <p className="eyebrow">Orlando travel guide</p>
            <h2 id="video-title">Watch Our Orlando Travel Guide</h2>
            <p style={{ color: "var(--muted)" }}>
              Get a feel for Orlando before you go, then use our guides to choose the parks, tours and neighborhoods
              that fit your trip.
            </p>
            <p style={{ margin: 0 }}>
              <Link href={`/blog/${TOP10_SLUG}`} className="btn btn-primary">
                Top 10 things to do
              </Link>{" "}
              <Link href="/blog/where-to-stay-in-orlando" className="btn btn-outline">
                Where to stay
              </Link>
            </p>
          </div>
          <YouTubeEmbed id="ffpo8K-I3Xg" title="Orlando travel guide video" />
        </div>
      </section>

      <section className="section" aria-labelledby="guides-title">
        <div className="container">
          <div className="cat-head">
            <div>
              <h2 id="guides-title">Orlando Travel Guides</h2>
              <p>Planning advice from our editors, updated for this season.</p>
            </div>
            <Link href="/blog" className="link-arrow">
              Read the blog <ArrowIcon size={16} />
            </Link>
          </div>
          <div className="post-grid">
            {latestPosts.map((p) => (
              <article key={p.slug} className="card post-card">
                <div className="card-media is-featured">
                  <img
                    src={featuredImage(p.slug).url}
                    alt=""
                    width={1200}
                    height={630}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="card-body">
                  <span className="post-cat">{p.category}</span>
                  <h3 className="card-title">
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>{p.excerpt}</p>
                  <div className="post-meta">
                    <time dateTime={p.updated}>{formatDate(p.updated)}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <h3 style={{ marginTop: 40 }}>Best of Orlando lists</h3>
          <ul className="pill-links">
            {listicles.map((l) => (
              <li key={l.slug}>
                <Link href={`/blog/${l.slug}`}>{l.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="what-title">
        <div className="container">
          <div className="seo-grid">
            <div className="prose">
              <h2 id="what-title">What is ThingsToDoOrlando.com?</h2>
              <p>
                ThingsToDoOrlando.com is an independent guide to the best <strong>things to do in Orlando</strong>,
                Florida. We research tours, attraction tickets, dinner shows, outdoor adventures and day trips across
                Central Florida and organize them into easy categories so you can find the right experience for your
                group in minutes instead of hours.
              </p>
              <p>
                Our editors write practical guides that answer the questions travelers actually ask: how long an
                activity takes, who it is best for, when to go and what to bring. Every experience page connects to live
                availability, current prices and verified reviews from Viator, one of the largest tour marketplaces in
                the world.
              </p>
              <p>
                Whether you are planning your first family vacation, a romantic weekend or a local day off, start with
                our <Link href="/book-now">Book Now</Link> hub or read the latest{" "}
                <Link href="/blog">Orlando travel guides</Link>.
              </p>
            </div>
            <div className="prose">
              <h2 id="how-title">How Does This Website Work?</h2>
              <p>
                We make it simple to go from inspiration to a confirmed booking. There is no account to create and you
                never pay us directly.
              </p>
              <ol className="steps" style={{ gridTemplateColumns: "1fr" }}>
                <li>
                  <h3>Search or browse</h3>
                  <p>Search by attraction or area, or explore categories like family, couples and day trips.</p>
                </li>
                <li>
                  <h3>Compare the details</h3>
                  <p>Review what is included, how long it lasts, ratings and our tips for getting the most out of it.</p>
                </li>
                <li>
                  <h3>Book securely on Viator</h3>
                  <p>Check live availability and complete your booking with Viator, often with free cancellation.</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="guide-title">
        <div className="container container-narrow prose">
          <h2 id="guide-title">Planning the Best Things To Do In Orlando</h2>
          <p>
            Orlando welcomes more than 70 million visitors a year, and most of them arrive with the same challenge:
            there is far more to do than there is time. The city is best known for its theme parks, but Central Florida
            is also home to crystal clear springs, the Everglades headwaters, an active spaceport and a growing food
            scene. The best trips mix big-ticket days with lighter, local experiences.
          </p>
          <h3>Theme parks and attractions</h3>
          <p>
            <Link href={to("/book-now/walt-disney-world-tickets-and-guided-park-days")}>Walt Disney World</Link>,{" "}
            <Link href={to("/book-now/universal-orlando-resort-tickets")}>Universal Orlando Resort</Link> and{" "}
            <Link href={to("/book-now/seaworld-orlando-and-aquatica-tickets")}>SeaWorld Orlando</Link> anchor most itineraries.
            Ticket prices vary by date, so buying early and choosing midweek days can save a meaningful amount. Families
            with younger children should also consider{" "}
            <Link href={to("/book-now/legoland-florida-day-trip")}>LEGOLAND Florida</Link>, about an hour away.
          </p>
          <h3>Nature and wildlife</h3>
          <p>
            An <Link href={to("/book-now/airboat-rides-and-everglades-style-swamp-tours")}>airboat ride</Link> is the classic
            way to see wild alligators. In winter,{" "}
            <Link href={to("/book-now/manatee-encounters-at-blue-spring-and-crystal-river")}>manatees gather in warm springs</Link>{" "}
            north of the city, and spring-fed rivers like Wekiwa are perfect for{" "}
            <Link href={to("/book-now/kayak-and-paddleboard-tours-on-central-florida-springs")}>kayaking</Link> all year.
          </p>
          <h3>Space, sky and day trips</h3>
          <p>
            <Link href={to("/book-now/kennedy-space-center-day-trip-from-orlando")}>Kennedy Space Center</Link> is the most
            popular day trip from Orlando, and seeing a{" "}
            <Link href={to("/book-now/rocket-launch-viewing-tours-on-the-space-coast")}>rocket launch</Link> is unforgettable.
            For views from above, book a{" "}
            <Link href={to("/book-now/sunrise-hot-air-balloon-rides-over-central-florida")}>sunrise balloon flight</Link>. The
            Gulf beaches, historic St. Augustine and the Everglades are all reachable as{" "}
            <Link href={to("/book-now/day-trips")}>day trips from Orlando</Link>.
          </p>
          <h3>Evenings and nightlife</h3>
          <p>
            Orlando&apos;s <Link href={to("/book-now/dinner-shows")}>dinner shows</Link> are an experience you will not find in
            many other cities, and International Drive stays lively late with attractions like{" "}
            <Link href={to("/book-now/icon-park-and-the-wheel-on-international-drive")}>The Wheel at ICON Park</Link>. For a
            more local night out, try a <Link href={to("/book-now/orlando-food-tours-and-downtown-walking-tours")}>food tour</Link>{" "}
            in Winter Park or downtown.
          </p>
          <p>
            Not sure where to start? Read our guides to the{" "}
            <Link href="/blog/best-things-to-do-in-orlando-with-kids">best things to do in Orlando with kids</Link>,{" "}
            <Link href="/blog/things-to-do-in-orlando-besides-theme-parks">things to do besides theme parks</Link> and the{" "}
            <Link href="/blog/best-time-to-visit-orlando">best time to visit Orlando</Link>.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <h2 id="faq-title">Frequently Asked Questions</h2>
            <p>Quick answers about things to do in Orlando and how booking works.</p>
          </div>
          <Faq items={faqs} />
          <div className="cta-band mt-lg">
            <div>
              <h2>Ready to plan your Orlando adventure?</h2>
              <p>Filter every tour and event by category, price and rating.</p>
            </div>
            <Link href="/book-now" className="btn btn-primary btn-lg">
              Browse all experiences
            </Link>
          </div>
        </div>
      </section>

      <JsonLd
        data={itemListSchema(
          "Family Friendly Tours & Events in Orlando",
          family.map((l) => ({ name: l.title, href: `/book-now/${l.slug}` })),
        )}
      />
    </>
  );
}
