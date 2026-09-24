import Link from "next/link";
import EventCard from "@/components/EventCard";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { events, weeklyEvents } from "@/data/events";
import { eventsForMonths, MONTHS, monthSlug, orlandoToday } from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Orlando Events Calendar: Festivals, Holidays & Things To Do by Month",
  description:
    "The Orlando events calendar: theme park festivals, Halloween and Christmas events, sports, markets and rocket launches, month by month, with planning tips.",
  path: "/events",
});

export default function EventsPage() {
  const { month } = orlandoToday();
  const now = eventsForMonths([month]);

  return (
    <>
      <PageHero
        title="Orlando Events Calendar"
        intro="Festivals, holiday celebrations, game days, markets and rocket launches in Orlando, month by month. Exact dates change every year, so confirm with the organizer before you go."
        crumbs={[{ name: "Events", href: "/events" }]}
      />

      <section className="section" style={{ paddingTop: 40 }} aria-labelledby="now-title">
        <div className="container">
          <nav aria-label="Seasonal guides" style={{ marginBottom: 28 }}>
            <ul className="pill-links">
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
          <div className="cat-head">
            <div>
              <h2 id="now-title">Happening in {MONTHS[month - 1]}</h2>
              <p>Events that usually run this month in and around Orlando.</p>
            </div>
            <Link href={`/events/${monthSlug(month)}`} className="link-arrow">
              Full {MONTHS[month - 1]} guide
            </Link>
          </div>
          <div className="event-grid">
            {now.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
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

      <section className="section" aria-labelledby="cal-title">
        <div className="container">
          <h2 id="cal-title">Month-by-month calendar</h2>
          <ul className="month-nav">
            {MONTHS.map((m, i) => (
              <li key={m}>
                <a href={`#${m.toLowerCase()}`} aria-current={i + 1 === month ? "true" : undefined}>
                  {m}
                </a>
              </li>
            ))}
          </ul>
          {MONTHS.map((m, i) => {
            const list = eventsForMonths([i + 1]);
            return (
              <div key={m} id={m.toLowerCase()} className="month-block">
                <h3 style={{ fontSize: "1.4rem" }}>
                  {m} {i + 1 === month && <small className="now-badge">This month</small>}
                </h3>
                <ul className="month-list">
                  {list.map((e) => (
                    <li key={e.slug}>
                      <Link href={`/events/${monthSlug(i + 1)}#${e.slug}`}>{e.name}</Link>
                      <span>{e.timing}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/events/${monthSlug(i + 1)}`} className="link-arrow">
                  Things to do in Orlando in {m}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="faq-title">
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
