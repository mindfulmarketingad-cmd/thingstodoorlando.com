import Link from "next/link";
import AuthorBox, { AuthorByline } from "@/components/AuthorBox";
import BookButton from "@/components/BookButton";
import EventCalendar from "@/components/EventCalendar";
import EventCard from "@/components/EventCard";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import ListingCard from "@/components/ListingCard";
import PageHero from "@/components/PageHero";
import { EVENTS_UPDATED_LABEL, eventPath, events, weeklyEvents, type OrlandoEvent } from "@/data/events";
import { getAuthor } from "@/lib/authors";
import {
  eventFilters,
  eventsForFilter,
  eventsForMonthPage,
  filterMatch,
  MONTHS,
  monthSlug,
  monthYear,
  orlandoToday,
  toIso,
  weekPlan,
  type FilterSlug,
} from "@/lib/events";
import { ticketsForEvent } from "@/lib/event-tickets";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";
import { parkCalendars } from "@/content/park-calendars";

export const metadata = pageMetadata({
  title: "Orlando Events Today & This Week",
  description:
    "What's going on in Orlando today and this week: holiday parties, the Florida Classic, free markets and family events, with dates and prices.",
  path: "/events",
});

const FAQS = [
  {
    q: "What events are happening in Orlando today?",
    a: "On Sunday, November 15, 2026, Mickey's Very Merry Christmas Party is on at Magic Kingdom (7 p.m. to midnight), and the Lake Eola Farmers Market ran from 10 a.m. to 3 p.m. Universal's holiday season and ICE! at Gaylord Palms are open. Jollywood Nights is Monday, November 16.",
  },
  {
    q: "What is there to do in Orlando this week?",
    a: "November 15–22 includes Mickey's Very Merry Christmas Party on the 15th, 17th, 19th and 20th, Jollywood Nights on the 16th and 21st, the Magic at home against the 76ers on the 18th, and the Florida Classic at Camping World Stadium on Saturday the 21st. Dazzling Nights at Leu Gardens opens Friday the 20th.",
  },
  {
    q: "What are free events in Orlando?",
    a: "The Lake Eola Farmers Market is free on Sundays, the Winter Park Farmers' Market is free on Saturdays, and the Audubon Park Community Market is free on Monday evenings. The city tree lighting on December 4 is free. Disney Springs and Universal CityWalk do not charge admission.",
  },
  {
    q: "What Orlando events are good for kids?",
    a: "Universal's holiday season, SeaWorld's Christmas Celebration, daytime Holidays at Leu Gardens, the Gaylord Palms ICE! exhibit, the Lake Eola tree lighting and the weekly farmers markets are the strongest kids' picks this month. Mickey's Very Merry Christmas Party is a separately ticketed family night.",
  },
  {
    q: "What are the holiday events in Orlando in 2026?",
    a: "Posted dates include Holidays at Universal (November 14 to January 3), Mickey's Very Merry Christmas Party (select nights through December 22), Jollywood Nights (select nights through January 5), SeaWorld's Christmas Celebration (select dates through January 4), ICE! at Gaylord Palms (through January 3) and the EPCOT Festival of the Holidays (November 27 to December 30).",
  },
  {
    q: "What summer events happen in Orlando?",
    a: "Summer 2026 is over. A typical Orlando summer is water parks, afternoon storms and, on July 4, fireworks at Lake Eola. Halloween parties usually start in August. Those 2027 dates are not posted. The events on the calendar right now are holiday events.",
  },
  {
    q: "Do theme park festivals need a separate ticket?",
    a: "EPCOT festivals, Universal's holiday celebration and SeaWorld's Christmas Celebration are included with park admission. Mickey's Very Merry Christmas Party and Disney Jollywood Nights need their own tickets, and those tickets do not require a daytime park ticket.",
  },
];

function EventLine({ event }: { event: OrlandoEvent }) {
  return (
    <li>
      <Link href={eventPath(event)}>
        <strong>{event.name}</strong>
      </Link>
      <span>
        {event.timing}
        {!event.datesConfirmed ? " · Dates not confirmed" : ""}
      </span>
      <span>
        {event.where} · {event.price}
      </span>
    </li>
  );
}

export default async function EventsPage() {
  const plan = weekPlan();
  const { year, month, day } = orlandoToday();
  const todayIso = toIso({ year, month, day });
  const thisMonth = eventsForMonthPage(month);
  const later = [12, 1, 2, 3].map((m) => ({
    month: m,
    year: monthYear(m),
    events: eventsForMonthPage(m),
  }));
  const author = getAuthor();
  const picks = await ticketsForEvent(
    "mickey's very merry|universal orlando park to park|orlando magic nba|kennedy space center with transport|the orlando eye",
    "mickey's very merry|park to park|orlando magic|kennedy space center with transport|orlando eye",
    6,
  );
  const lead = picks[0];
  const sources = [...new Map(events.flatMap((e) => e.sources).map((s) => [s.url, s])).values()];

  return (
    <>
      <PageHero
        title="What's going on in Orlando"
        intro={`Orlando events for ${plan.label}. Holiday parties are on sale, the Florida Classic is this Saturday, and the weekly markets are running. Dates and prices below were checked against organizer pages on ${EVENTS_UPDATED_LABEL}.`}
        crumbs={[{ name: "Events", href: "/events" }]}
      >
        <AuthorByline author={author}>
          {" "}
          · Updated {EVENTS_UPDATED_LABEL}
        </AuthorByline>
      </PageHero>

      <section className="section" style={{ paddingTop: 28 }} aria-labelledby="filters-title">
        <div className="container">
          <h2 id="filters-title" className="sr-only">
            Browse Orlando events
          </h2>
          <nav aria-label="Event types">
            <ul className="pill-links">
              <li>
                <a href="#this-week">This week</a>
              </li>
              <li>
                <a href="#this-month">This month</a>
              </li>
              <li>
                <Link href="/events/this-weekend">This weekend</Link>
              </li>
              {(Object.keys(eventFilters) as FilterSlug[]).map((slug) => (
                <li key={slug}>
                  <Link href={`/events/${slug}`}>{eventFilters[slug].title.replace(" in Orlando", "").replace("Orlando Events for ", "")}</Link>
                </li>
              ))}
              <li>
                <Link href="/events/christmas-in-orlando">Christmas guide</Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }} id="this-week" aria-labelledby="week-title">
        <div className="container">
          <div className="section-head">
            <h2 id="week-title">This week in Orlando</h2>
            <p>
              {plan.label}. Specific nights and games are on the day. Parks and exhibits that are open the whole stretch are listed once underneath.
            </p>
          </div>

          {plan.tonight.length > 0 && (
            <div className="week-callout" id="tonight">
              <h3>Today, {plan.days[0].label}</h3>
              <ul className="month-list">
                {plan.tonight.map((e) => (
                  <EventLine key={e.slug} event={e} />
                ))}
              </ul>
            </div>
          )}

          <div className="week-board">
            {plan.days.map((d) => (
              <section key={d.iso} className={d.isToday ? "week-day is-today" : "week-day"} aria-label={d.label}>
                <h3>{d.label}</h3>
                {d.events.length ? (
                  <ul>
                    {d.events.map((e) => (
                      <li key={e.slug}>
                        <Link href={eventPath(e)}>{e.name}</Link>
                        <span>
                          {e.where} · {e.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No separate ticketed night. See what is open all week.</p>
                )}
              </section>
            ))}
          </div>

          {plan.daily.length > 0 && (
            <>
              <h3 className="week-sub">Open during this stretch</h3>
              <ul className="month-list">
                {plan.daily.map((e) => (
                  <EventLine key={e.slug} event={e} />
                ))}
              </ul>
            </>
          )}
          {plan.season.length > 0 && (
            <>
              <h3 className="week-sub">In season, but not every day</h3>
              <ul className="month-list">
                {plan.season.map((e) => (
                  <EventLine key={e.slug} event={e} />
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="section section-alt" id="this-month" aria-labelledby="month-title">
        <div className="container">
          <div className="section-head">
            <h2 id="month-title">This month: {MONTHS[month - 1]} {year}</h2>
            <p>
              Thanksgiving is Thursday, November 26. The EPCOT Festival of the Holidays starts the next day.{" "}
              <Link href={`/events/${monthSlug(month)}`}>The full {MONTHS[month - 1]} guide</Link> has weather and crowds too.
            </p>
          </div>
          <div className="event-grid">
            {thisMonth.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="coming-title">
        <div className="container">
          <div className="section-head">
            <h2 id="coming-title">The next three months</h2>
            <p>December through March, from organizer dates where we have them. Unconfirmed events are labeled.</p>
          </div>
          {later.map((block) => (
            <div key={block.month} className="month-block" id={monthSlug(block.month)}>
              <h3>
                <Link href={`/events/${monthSlug(block.month)}`}>
                  {MONTHS[block.month - 1]} {block.year}
                </Link>
                {block.month === 12 ? <span className="now-badge">Holiday peak</span> : null}
              </h3>
              {block.events.length ? (
                <ul className="month-list">
                  {block.events.map((e) => (
                    <EventLine key={e.slug} event={e} />
                  ))}
                </ul>
              ) : (
                <p>No dated events posted for this month yet.</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section section-alt" id="every-week" aria-labelledby="weekly-title">
        <div className="container">
          <div className="section-head">
            <h2 id="weekly-title">Every week in Orlando</h2>
            <p>Markets with a standing schedule, plus Disney Springs, CityWalk and ICON Park, which do not charge admission to walk in.</p>
          </div>
          <div className="event-grid">
            {weeklyEvents.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="by-type-title">
        <div className="container">
          <div className="section-head">
            <h2 id="by-type-title">Events by type</h2>
            <p>Each list is a normal link, so you can open it without the calendar.</p>
          </div>
          {(Object.keys(eventFilters) as FilterSlug[]).map((slug) => {
            const match = filterMatch(slug);
            const list = match ? eventsForFilter(match, todayIso).slice(0, 6) : [];
            return (
              <div key={slug} className="month-block" id={slug}>
                <h3>
                  <Link href={`/events/${slug}`}>{eventFilters[slug].title}</Link>
                </h3>
                {slug === "summer" ? (
                  <p>{eventFilters.summer.intro}</p>
                ) : (
                  <ul className="month-list">
                    {list.map((e) => (
                      <EventLine key={e.slug} event={e} />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="cal-title">
        <div className="container">
          <div className="section-head">
            <h2 id="cal-title">Full year calendar</h2>
            <p>Use this for months outside the holiday season. The day grid is a helper. The lists above are the dates we verified.</p>
          </div>
          <EventCalendar events={events} initialYear={year} initialMonth={month} todayIso={todayIso} />
          <ul className="month-cards" style={{ marginTop: 28 }}>
            {MONTHS.map((m, i) => {
              const list = eventsForMonthPage(i + 1);
              return (
                <li key={m} className={i + 1 === month ? "is-now" : undefined}>
                  <Link href={`/events/${monthSlug(i + 1)}`}>
                    <strong>{m}</strong>
                    <span>
                      {list.length} events
                      {i + 1 === month ? " · This month" : ""}
                    </span>
                    <em>{list.slice(0, 2).map((e) => e.name).join(", ") || "Annual guide"}</em>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {picks.length > 0 && (
        <section className="section" aria-labelledby="tickets-title">
          <div className="container">
            <div className="cat-head">
              <div>
                <h2 id="tickets-title">Tickets that pair with this calendar</h2>
                <p>Park tickets, the Wheel and a Magic ticket from our Viator list. Party nights are usually sold by the park, not here.</p>
              </div>
              <Link href="/book-now/theme-parks" className="link-arrow">
                Theme park tickets
              </Link>
            </div>
            {lead && (
              <div className="event-actions" style={{ marginBottom: 20 }}>
                <BookButton href={lead.bookingUrl} label={`Check prices: ${lead.title}`} item={lead.title} className="btn btn-primary" />
              </div>
            )}
            <div className="card-grid">
              {picks.map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-alt" aria-labelledby="parks-cal-title">
        <div className="container">
          <div className="section-head">
            <h2 id="parks-cal-title">Theme park calendars</h2>
            <p>Crowd patterns and the best days for each park. Those guides are separate from the event dates on this page.</p>
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
          <Faq items={FAQS} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="sources-title">
        <div className="container">
          <div className="section-head">
            <h2 id="sources-title">Sources</h2>
            <p>
              The ThingsToDoOrlando.com editorial team checked these pages on {EVENTS_UPDATED_LABEL}. We do not invent dates. If a date is
              missing from an organizer site, the event is marked unconfirmed.
            </p>
          </div>
          <ul className="source-list">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
          <AuthorBox author={author} />
        </div>
      </section>

      <JsonLd
        data={itemListSchema(
          "Orlando events",
          events.filter((e) => e.detail).map((e) => ({ name: e.name, href: `/events/${e.slug}` })),
        )}
      />
    </>
  );
}
