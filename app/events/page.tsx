import Link from "next/link";
import EventCalendar from "@/components/EventCalendar";
import EventCard from "@/components/EventCard";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { events, weeklyEvents } from "@/data/events";
import { eventsForMonths, MONTHS, monthSlug, orlandoToday } from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";
import { parkCalendars } from "@/content/park-calendars";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Orlando Events Calendar: Festivals, Holidays & Events by Month",
  description:
    "The Orlando events calendar: theme park festivals, Halloween and Christmas events, sports, markets and rocket launches, month by month, with planning tips.",
  path: "/events",
});

export default function EventsPage() {
  const { year, month, day } = orlandoToday();
  const todayIso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <>
      <PageHero
        title="Orlando Events Calendar"
        intro="Festivals, holiday celebrations, game days, markets and rocket launches in Orlando, month by month. Exact dates change every year, so confirm with the organizer before you go."
        crumbs={[{ name: "Events", href: "/events" }]}
      />

      <section className="section" style={{ paddingTop: 40 }} aria-labelledby="cal-title">
        <div className="container">
          <nav aria-label="Seasonal guides" style={{ marginBottom: 28 }}>
            <ul className="pill-links">
              <li>
                <Link href="/book-now/today">Events today</Link>
              </li>
              <li>
                <Link href="/events/this-weekend">This weekend in Orlando</Link>
              </li>
              <li>
                <Link href="/events/halloween-in-orlando">Halloween in Orlando</Link>
              </li>
              <li>
                <Link href="/events/christmas-in-orlando">Christmas in Orlando</Link>
              </li>
              <li>
                <Link href={`/events/${monthSlug(month)}`}>Things to do in {MONTHS[month - 1]}</Link>
              </li>
            </ul>
          </nav>
          <h2 id="cal-title" className="sr-only">
            Interactive Orlando events calendar
          </h2>
          <EventCalendar events={events} initialYear={year} initialMonth={month} todayIso={todayIso} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="weekly-title">
        <div className="container">
          <div className="section-head">
            <h2 id="weekly-title">Every week in Orlando</h2>
            <p>Local favorites you can count on, any time of year.</p>
          </div>
          <div className="event-grid">
            {weeklyEvents.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="months-title">
        <div className="container">
          <div className="section-head">
            <h2 id="months-title">Browse Orlando events by month</h2>
            <p>Weather, crowds, events and the best tours to book for every month of the year.</p>
          </div>
          <ul className="month-cards">
            {MONTHS.map((m, i) => {
              const list = eventsForMonths([i + 1]);
              return (
                <li key={m} className={i + 1 === month ? "is-now" : undefined}>
                  <Link href={`/events/${monthSlug(i + 1)}`}>
                    <strong>{m}</strong>
                    <span>
                      {list.length} events
                      {i + 1 === month ? " · This month" : ""}
                    </span>
                    <em>{list.slice(0, 2).map((e) => e.name).join(", ")}</em>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="parks-cal-title">
        <div className="container">
          <div className="section-head">
            <h2 id="parks-cal-title">Theme park calendars and the best days to go</h2>
            <p>Month-by-month crowds, seasonal events and the best days for every Orlando theme park and water park.</p>
          </div>
          <ul className="pill-links">
            {parkCalendars.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`}>{p.title.replace(" & Best Days to Go", "")}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <h2 id="faq-title">Orlando events FAQs</h2>
          </div>
          <Faq
            items={[
              {
                q: "What is the best month for events in Orlando?",
                a: "October and November are hard to beat: the EPCOT International Food & Wine Festival, Halloween Horror Nights and Mickey's Not-So-Scary Halloween Party overlap in October, and holiday events begin in November, all with milder weather than summer.",
              },
              {
                q: "Are there free events in Orlando?",
                a: "Yes. The Lake Eola Farmers Market on Sundays, the Winter Park Farmers' Market on Saturdays, the Fourth of July fireworks at Lake Eola and viewing rocket launches from public beaches are all free.",
              },
              {
                q: "Do I need separate tickets for theme park events?",
                a: "Festivals such as EPCOT's are included with park admission, while after-hours parties like Mickey's Not-So-Scary Halloween Party, Mickey's Very Merry Christmas Party and Halloween Horror Nights require a separate event ticket.",
              },
              {
                q: "How do I find the exact dates for an event?",
                a: "Dates change every year, so check the organizer's official website before you book travel. Our calendar shows each event's usual timing so you can plan the right month.",
              },
            ]}
          />
        </div>
      </section>

      <JsonLd data={itemListSchema("Orlando events calendar", events.map((e) => ({ name: e.name, href: `/events/${monthSlug(e.months[0])}#${e.slug}` })))} />
    </>
  );
}
