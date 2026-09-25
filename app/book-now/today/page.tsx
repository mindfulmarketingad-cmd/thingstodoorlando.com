import Link from "next/link";
import { connection } from "next/server";
import BookNowExplorer from "@/components/BookNowExplorer";
import EventCard from "@/components/EventCard";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import UseTodayDate from "@/components/UseTodayDate";
import { events } from "@/data/events";
import { orlandoToday } from "@/lib/events";
import { getListingsAvailableOn } from "@/lib/listings";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";
import { recommendedOrder, slimListing } from "@/lib/slim";


export const metadata = pageMetadata({
  title: "Events Today in Orlando: Tours & Things To Do Today",
  absoluteTitle: true,
  description:
    "Tours, attractions and events happening in Orlando today. Every experience listed is bookable for today's date, with live prices and traveler reviews.",
  path: "/book-now/today",
});

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function TodayPage() {
  // Render per request so "today" is always the current day in Orlando. Viator
  // responses are still cached for an hour per date in the data cache.
  await connection();
  const { year, month, day } = orlandoToday();
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = WEEKDAYS[date.getUTCDay()];
  const label = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

  const available = await getListingsAvailableOn(iso);
  const items = available ? recommendedOrder(available.listings) : [];

  const onToday = events.filter((e) => e.weekly === weekday || (e.fixedDay === day && e.months.includes(month)));
  const inSeason = events.filter((e) => !e.weekly && !e.fixedDay && e.months.includes(month) && e.months.length < 12);

  const faqs = [
    {
      q: "What is there to do in Orlando today?",
      a: available
        ? `${items.length.toLocaleString("en-US")} tours, attractions and experiences are bookable in the Orlando area today, from airboat rides and kayak tours to theme park tickets and dinner shows. Use the filters to narrow them by type, price, rating and length.`
        : "Browse theme park tickets, airboat rides, kayak tours and dinner shows on our Book Now page, and check the events calendar for festivals and markets.",
    },
    {
      q: "Can I book a tour in Orlando for today?",
      a: "Yes. Every experience on this page is listed as bookable for today. Same-day slots can sell out, especially in the morning and on weekends, so confirm the time on the booking page and book as early as you can.",
    },
    {
      q: "What can I do in Orlando today for free?",
      a: "Walk Lake Eola Park, explore Disney Springs or Universal CityWalk, stroll ICON Park on International Drive, or visit Old Town in Kissimmee. On Saturdays the Winter Park Farmers' Market runs in the morning, and on Sundays the Lake Eola Farmers Market.",
    },
    {
      q: "What should I do in Orlando if it rains today?",
      a: "Orlando's storms usually pass within an hour or two. Indoor picks include aquariums, escape rooms, museums and exhibitions on International Drive. See our rainy day guide for more ideas.",
    },
  ];

  return (
    <>
      <UseTodayDate />
      <PageHero
        title="Events Today in Orlando"
        intro={`Tours, attractions and events you can book for today, ${label}. Availability comes from Viator and refreshes through the day.`}
        crumbs={[
          { name: "Book Now", href: "/book-now" },
          { name: "Today", href: "/book-now/today" },
        ]}
      />

      {(onToday.length > 0 || inSeason.length > 0) && (
        <section className="section" style={{ paddingTop: 40, paddingBottom: 24 }} aria-labelledby="today-events-title">
          <div className="container">
            <div className="cat-head">
              <div>
                <h2 id="today-events-title">{onToday.length ? "Happening in Orlando today" : "Happening in Orlando right now"}</h2>
                <p>
                  {onToday.length
                    ? `Local events on ${weekday}s${inSeason.length ? ", plus seasonal events running now" : ""}.`
                    : "Seasonal events running right now. Exact dates change each year, so confirm with the organizer."}
                </p>
              </div>
              <Link href="/events" className="link-arrow">
                Events calendar
              </Link>
            </div>
            <div className="event-grid">
              {[...onToday, ...inSeason].slice(0, 6).map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 24 }} aria-labelledby="today-tours-title">
        <div className="container">
          <div className="section-head" style={{ textAlign: "left", marginInline: 0 }}>
            <h2 id="today-tours-title">Tours and activities available today</h2>
            <p>
              Only experiences bookable for {label} are shown. Booking links open with today&apos;s date selected where
              Viator supports it.
            </p>
          </div>
          {available && items.length ? (
            <BookNowExplorer
              initial={items.slice(0, 24).map(slimListing)}
              total={items.length}
              onlySlugs={items.map((l) => l.slug)}
              hideDatePicker
            />
          ) : (
            <div className="empty-state">
              <p>
                We are refreshing today&apos;s availability. In the meantime, browse every experience and pick your date on
                the booking page.
              </p>
              <Link href="/book-now" className="btn btn-primary">
                Browse all tours
              </Link>
            </div>
          )}
          <nav aria-label="More ways to plan" style={{ marginTop: 32 }}>
            <ul className="pill-links">
              <li>
                <Link href="/events/this-weekend">Things to do this weekend</Link>
              </li>
              <li>
                <Link href="/book-now/things-to-do-in-orlando-under-50">Things to do under $50</Link>
              </li>
              <li>
                <Link href="/blog/rainy-day-things-to-do-in-orlando">Rainy day ideas</Link>
              </li>
              <li>
                <Link href="/place-to-stay">Where to stay tonight</Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <h2 id="faq-title">Things to do in Orlando today: FAQs</h2>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      {items.length > 0 && (
        <JsonLd
          data={itemListSchema(
            `Things to do in Orlando today, ${label}`,
            items.slice(0, 10).map((l) => ({ name: l.title, href: `/book-now/${l.slug}` })),
          )}
        />
      )}
    </>
  );
}
