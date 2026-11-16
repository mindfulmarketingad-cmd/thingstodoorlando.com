import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorByline } from "@/components/AuthorBox";
import EventCard from "@/components/EventCard";
import EventDetail from "@/components/EventDetail";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import ListingCard from "@/components/ListingCard";
import PageHero from "@/components/PageHero";
import Prose from "@/components/Prose";
import { EVENTS_UPDATED_LABEL, eventPath, events, monthNotes, weeklyEvents, type OrlandoEvent } from "@/data/events";
import {
  detailEvents,
  eventFilters,
  eventsForFilter,
  eventsForMonthPage,
  eventsOnDate,
  filterMatch,
  monthFromSlug,
  MONTHS,
  monthSlug,
  monthYear,
  orlandoToday,
  specialPages,
  toIso,
  upcomingWeekend,
  type FilterSlug,
  type SpecialSlug,
} from "@/lib/events";
import { getAuthor } from "@/lib/authors";
import { findListings, getTopRated } from "@/lib/listicles";
import { parseMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/metadata";
import { eventSchema, itemListSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import type { Listing } from "@/lib/types";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

const RESERVED = new Set<string>([
  ...MONTHS.map((m) => m.toLowerCase()),
  ...Object.keys(specialPages),
  ...Object.keys(eventFilters),
]);

export function generateStaticParams() {
  const details = detailEvents().map((e) => e.slug);
  for (const slug of details) {
    if (RESERVED.has(slug)) throw new Error(`Event detail slug is reserved: ${slug}`);
  }
  return [
    ...MONTHS.map((_, i) => ({ slug: monthSlug(i + 1) })),
    ...Object.keys(specialPages).map((slug) => ({ slug })),
    ...Object.keys(eventFilters).map((slug) => ({ slug })),
    ...details.map((slug) => ({ slug })),
  ];
}

/** Bookable tours that suit each month, so the 12 month pages are not duplicates. */
const MONTH_PICKS: Record<number, { heading: string; re: RegExp }> = {
  1: { heading: "Tickets and tours for January", re: /marathon|disney|manatee|springs|kayak/i },
  2: { heading: "Mild-weather tours for February", re: /manatee|springs|airboat|kayak|disney/i },
  3: { heading: "Spring break favorites", re: /airboat|kennedy|theme park|legoland|kayak|disney/i },
  4: { heading: "Outdoor adventures for April", re: /airboat|kayak|balloon|horse|bike|eco/i },
  5: { heading: "Morning adventures before the heat", re: /airboat|balloon|kayak|paddle|sunrise/i },
  6: { heading: "Cool-down ideas for June", re: /water|snorkel|swim|tubing|kayak|escape|indoor|dinner show/i },
  7: { heading: "Ways to beat the July heat", re: /water|snorkel|swim|tubing|escape|indoor|dinner show/i },
  8: { heading: "Indoor and water fun for August", re: /water|snorkel|escape|indoor|dinner show|museum/i },
  9: { heading: "Quieter September tours", re: /kennedy|airboat|food tour|ghost|dinner show/i },
  10: { heading: "Fall tours", re: /ghost|kennedy|airboat|food tour|night/i },
  11: { heading: "Tours that fit a November trip", re: /disney|universal|kennedy|airboat|holiday|christmas/i },
  12: { heading: "Holiday tickets and tours", re: /disney|universal|christmas|holiday|kennedy|seaworld/i },
};

const SPECIAL_COPY: Record<Exclude<SpecialSlug, "this-weekend">, { intro: string; body: string; re: RegExp; faqs: { q: string; a: string }[] }> = {
  "halloween-in-orlando": {
    intro:
      "The 2026 Halloween season in Orlando is over. Halloween Horror Nights ran through November 1. Mickey's Not-So-Scary Halloween Party and Howl-O-Scream have ended too. 2027 dates are not posted.",
    body: `
## What already happened in 2026

Universal's own 2026 calendar listed **Halloween Horror Nights** on select nights from **August 28 through November 1**. That event is designed for teens and adults. Our [Halloween events guide](/blog/orlando-halloween-events-guide-2026) covers how the season was set up.

Mickey's Not-So-Scary Halloween Party at Magic Kingdom is the family party. Disney had not left a 2027 date list on the event page when we checked on November 15, 2026. The same is true of SeaWorld's Howl-O-Scream.

## What to do instead, right now

Orlando's calendar has moved to the holidays. [Mickey's Very Merry Christmas Party](/events/mickeys-very-merry-christmas-party) is the family nighttime party that replaced the Halloween one, and [Holidays at Universal](/events/universal-holidays) are included with a park ticket.

## How a typical Halloween season works

- **Young kids:** Mickey's Not-So-Scary Halloween Party, when it returns.
- **Teens and adults:** Halloween Horror Nights. Universal has said it may be too intense for guests under 13.
- **A different scare:** SeaWorld's Howl-O-Scream, on a separate ticket from the daytime Christmas Celebration that is running now.
`,
    re: /ghost|haunt|halloween|disney|universal/i,
    faqs: [
      {
        q: "Is Halloween Horror Nights still open?",
        a: "No. Universal's 2026 dates ran from August 28 through November 1. The 2027 dates are not posted.",
      },
      {
        q: "What is the family Halloween event in Orlando?",
        a: "Mickey's Not-So-Scary Halloween Party at Magic Kingdom. The 2026 season has ended, and Disney has not posted 2027 nights.",
      },
      {
        q: "What seasonal event is on now?",
        a: "The holiday season. Universal's holidays run through January 3, 2027, and Mickey's Very Merry Christmas Party has select nights through December 22, 2026.",
      },
    ],
  },
  "christmas-in-orlando": {
    intro:
      "Christmas in Orlando in 2026 is already underway. Universal's holidays started November 14, Mickey's Very Merry Christmas Party runs select nights through December 22, and the EPCOT Festival of the Holidays opens November 27.",
    body: `
## Dated holiday events

These are the dates organizers had posted on November 15, 2026.

- [Mickey's Very Merry Christmas Party](/events/mickeys-very-merry-christmas-party): select Magic Kingdom nights from November 8 to December 22. Tickets are $189 to $229 plus tax.
- [Disney Jollywood Nights](/events/jollywood-nights): select Hollywood Studios nights from November 7, 2026 to January 5, 2027. Tickets are $169 to $199 plus tax.
- [Holidays at Universal Orlando](/events/universal-holidays): November 14, 2026 to January 3, 2027, included with park admission.
- [EPCOT Festival of the Holidays](/events/epcot-festival-of-the-holidays): November 27 to December 30, with the Candlelight Processional nightly.
- [SeaWorld Christmas Celebration](/events/seaworld-christmas-celebration): select dates November 6, 2026 to January 4, 2027, included with admission.
- [ICE! at Gaylord Palms](/events/gaylord-palms-ice): November 13, 2026 to January 3, 2027. Timed tickets, sold online.
- [Orlando tree lighting](/events/orlando-tree-lighting): December 4 at Lake Eola, then a nightly tree show through January 6.
- [Orlando Ballet's Nutcracker](/events/orlando-ballet-nutcracker): select dates December 4–27 at Dr. Phillips Center.

## New Year's and the bowl games

[New Year's Eve](/events/new-years-eve) is Thursday, December 31. SeaWorld and Universal have confirmed celebrations. Disney had not posted a December 31 schedule. The [Pop-Tarts Bowl](/events/pop-tarts-bowl) is December 29, and the [Citrus Bowl](/events/citrus-bowl) is January 2, 2027.

## Planning notes

1. The last two weeks of December are the busiest. Early December party nights are the easier tickets.
2. A Disney party ticket does not include food beyond the event's treat stations.
3. EPCOT's holiday festival ends December 30, the day before New Year's Eve.
`,
    re: /disney|universal|christmas|holiday|seaworld/i,
    faqs: [
      {
        q: "When do Christmas events start in Orlando in 2026?",
        a: "They already have. Universal's holidays began November 14, SeaWorld's Christmas Celebration on November 6, and Mickey's Very Merry Christmas Party on November 8. The EPCOT Festival of the Holidays starts November 27.",
      },
      {
        q: "What is the difference between the Disney Christmas parties?",
        a: "Mickey's Very Merry Christmas Party is at Magic Kingdom and ends December 22. Jollywood Nights is at Hollywood Studios and includes January 3 and 5, 2027. Both need a separate ticket. EPCOT's Festival of the Holidays is included with park admission.",
      },
      {
        q: "Is Orlando busy at Christmas?",
        a: "Yes, especially from about December 20 through January 2. The Citrus Bowl is January 2, 2027, and Walt Disney World Marathon Weekend is January 6–10.",
      },
    ],
  },
};

function datedMonth(month: number) {
  return month === 11 || month === 12 || month <= 3;
}

function pageInfo(slug: string) {
  const month = monthFromSlug(slug);
  if (month) {
    const year = monthYear(month);
    const withYear = datedMonth(month);
    const title = withYear ? `Things To Do In Orlando In ${MONTHS[month - 1]} ${year}` : `Things To Do In Orlando In ${MONTHS[month - 1]}`;
    return {
      kind: "month" as const,
      month,
      title,
      description: withYear
        ? `${MONTHS[month - 1]} ${year} in Orlando: verified events, weather and crowds, plus tours that fit the month.`
        : `What ${MONTHS[month - 1]} in Orlando is usually like: seasonal events, weather, crowds and tours. Dates for later seasons are not all posted.`,
    };
  }
  if (slug in specialPages) {
    const s = slug as SpecialSlug;
    return {
      kind: s,
      month: undefined,
      title: specialPages[s].title,
      description:
        s === "this-weekend"
          ? "Things to do in Orlando this weekend: the events actually scheduled, weekly markets, and tours you can still book."
          : s === "halloween-in-orlando"
            ? "Halloween 2026 in Orlando has ended. Halloween Horror Nights closed November 1. Here is what replaced it, and what a typical October looks like."
            : "Christmas in Orlando 2026: party dates, EPCOT's holiday festival, Universal, SeaWorld, ICE! and the Lake Eola tree lighting.",
    };
  }
  if (slug in eventFilters) {
    const f = eventFilters[slug as FilterSlug];
    return { kind: "filter" as const, month: undefined, title: f.title, description: f.description, filter: slug as FilterSlug };
  }
  const event = events.find((e) => e.detail && e.slug === slug);
  if (event) {
    return {
      kind: "event" as const,
      month: undefined,
      title: event.seoTitle ?? event.name,
      description: event.seoDescription ?? event.description,
      event,
    };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const info = pageInfo(slug);
  if (!info) return {};
  return pageMetadata({ title: info.title, description: info.description, path: `/events/${slug}` });
}

function DayList({ iso, events: list }: { iso: string; events: OrlandoEvent[] }) {
  if (!list.length) return null;
  const label = new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <div className="month-block">
      <h3>{label}</h3>
      <div className="event-grid">
        {list.map((e) => (
          <EventCard key={e.slug} event={e} />
        ))}
      </div>
    </div>
  );
}

export default async function EventsSlugPage({ params }: Props) {
  const { slug } = await params;
  const info = pageInfo(slug);
  if (!info) notFound();

  if (info.kind === "event" && info.event) {
    const event = info.event;
    return (
      <>
        <PageHero
          title={event.name}
          intro={event.description}
          crumbs={[
            { name: "Events", href: "/events" },
            { name: event.name, href: `/events/${event.slug}` },
          ]}
        >
          <AuthorByline author={getAuthor()}>
            {" "}
            · Updated {EVENTS_UPDATED_LABEL}
          </AuthorByline>
        </PageHero>
        <EventDetail event={event} />
        {event.datesConfirmed && event.startDate && event.endDate && (
          <JsonLd
            data={eventSchema({
              name: event.name,
              description: event.seoDescription ?? event.description,
              startDate: event.startDate,
              endDate: event.endDate,
              url: absoluteUrl(`/events/${event.slug}`),
              officialUrl: event.officialUrl,
              venueName: event.venueName ?? event.where,
              locality: event.locality,
              streetAddress: event.streetAddress,
              organizer: event.organizer,
              offer: event.offer,
            })}
          />
        )}
      </>
    );
  }

  const today = orlandoToday();
  const todayIso = toIso(today);

  if (info.kind === "filter") {
    const filter = info.filter;
    const copy = eventFilters[filter];
    const match = filterMatch(filter);
    const list = match ? eventsForFilter(match, todayIso) : eventsForFilter((e) => e.tags.includes("family") || e.tags.includes("kids"), todayIso);
    const picks = await findListings(/disney|universal|kennedy|family|holiday/i, 4, 20);
    const faqs =
      filter === "summer"
        ? [
            {
              q: "What summer events are on in Orlando right now?",
              a: "None. November 15, 2026 is the holiday season, not summer. Summer 2026 has ended, and summer 2027 dates for water parks and July 4 are not posted.",
            },
            {
              q: "What usually happens in Orlando in summer?",
              a: "Theme parks and water parks run full schedules, afternoons storm, and Lake Eola hosts a July 4 fireworks gathering in a typical year. Halloween events usually begin in August.",
            },
            {
              q: "What should I do in Orlando if I am visiting now?",
              a: "Use the holiday calendar: Universal's holidays, Mickey's Very Merry Christmas Party, SeaWorld's Christmas Celebration and the weekly farmers markets.",
            },
          ]
        : [
            {
              q: `Where do these ${copy.title} dates come from?`,
              a: `Organizer pages and, where noted, Visit Orlando's holiday announcement. The list was checked on ${EVENTS_UPDATED_LABEL}. Anything still unconfirmed is labeled on the card.`,
            },
            {
              q: "Do I need a separate ticket?",
              a: "It depends on the event. EPCOT festivals and Universal's holiday celebration come with park admission. The Disney nighttime parties, ICE!, Dazzling Nights and sports tickets do not.",
            },
          ];
    return (
      <>
        <PageHero
          title={copy.title}
          intro={copy.intro}
          crumbs={[
            { name: "Events", href: "/events" },
            { name: copy.title, href: `/events/${filter}` },
          ]}
        />
        <section className="section" style={{ paddingTop: 32 }}>
          <div className="container">
            {filter === "summer" && (
              <div className="container-narrow" style={{ margin: "0 auto 28px", padding: 0 }}>
                <Prose
                  blocks={parseMarkdown(`
Summer in Orlando is late May through August: hot, humid, and busy once school is out. Water parks do the most work. July 4 at Lake Eola is the city fireworks night in a typical year, and the theme parks start Halloween parties in August.

**None of that is the current calendar.** Today is ${EVENTS_UPDATED_LABEL}. The events people can actually attend are the holiday parties, markets and bowl games on the [Orlando events calendar](/events).

We are not publishing a 2027 summer schedule. Those dates are not on the organizers' pages.
`)}
                />
              </div>
            )}
            <h2>{filter === "summer" ? "What is on instead" : "On the calendar"}</h2>
            <p className="event-updated">Updated {EVENTS_UPDATED_LABEL}</p>
            <div className="event-grid" style={{ marginTop: 16 }}>
              {(filter === "summer" ? list.slice(0, 9) : list).map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
            <nav aria-label="More event guides" style={{ marginTop: 28 }}>
              <Link href="/events" className="link-arrow">
                This week in Orlando
              </Link>
            </nav>
          </div>
        </section>
        {picks.length > 0 && (
          <section className="section section-alt">
            <div className="container">
              <h2>Tickets and tours</h2>
              <div className="card-grid">
                {picks.map((l) => (
                  <ListingCard key={l.slug} listing={l} />
                ))}
              </div>
            </div>
          </section>
        )}
        <section className="section">
          <div className="container">
            <Faq items={faqs} />
          </div>
        </section>
        <JsonLd data={itemListSchema(copy.title, list.slice(0, 12).map((e) => ({ name: e.name, href: eventPath(e) })))} />
      </>
    );
  }

  let intro: string;
  let body: string | undefined;
  let eventList: OrlandoEvent[] = [];
  let weekly = weeklyEvents;
  let picksHeading = "";
  let picks: Listing[] = [];
  let faqs: { q: string; a: string }[] = [];
  let notes: (typeof monthNotes)[number] | undefined;
  let subtitle: string | undefined;
  let weekendDays: { iso: string; events: OrlandoEvent[] }[] | undefined;

  if (info.kind === "month") {
    const m = info.month;
    notes = monthNotes[m];
    eventList = eventsForMonthPage(m);
    const year = monthYear(m);
    intro = datedMonth(m)
      ? `${MONTHS[m - 1]} ${year} in Orlando, with the events that have real dates and the ones that are only typical for the month.`
      : `What ${MONTHS[m - 1]} in Orlando is usually like. Specific dates for this month in a future year are filled in when organizers post them.`;
    picksHeading = MONTH_PICKS[m].heading;
    picks = await findListings(MONTH_PICKS[m].re, 6, 5);
    if (picks.length < 3) picks = await getTopRated(6);
    const names = eventList.slice(0, 4).map((e) => e.name).join(", ");
    faqs = [
      {
        q: `What is there to do in Orlando in ${MONTHS[m - 1]}?`,
        a: names
          ? `Events on this page include ${names}. The Winter Park and Lake Eola farmers markets run every week.`
          : `The weekly farmers markets run all year. Major one-off dates for ${MONTHS[m - 1]} are added when organizers post them.`,
      },
      { q: `What is the weather like in Orlando in ${MONTHS[m - 1]}?`, a: notes.weather },
      { q: `Is ${MONTHS[m - 1]} a good time to visit Orlando?`, a: `${notes.crowds} ${notes.tip}` },
    ];
  } else if (info.kind === "this-weekend") {
    const wk = upcomingWeekend();
    subtitle = wk.label;
    const blocks = [
      ...(wk.isNow ? wk.days : []),
      ...(!wk.isNow ? wk.days : []),
      ...(wk.next?.days ?? []),
    ];
    const unique = [...new Set(blocks)];
    weekendDays = unique
      .filter((iso) => iso >= todayIso)
      .map((iso) => ({ iso, events: eventsOnDate(iso).filter((e) => e.span !== "daily") }));
    eventList = eventsForMonthPage(today.month).slice(0, 6);
    weekly = weeklyEvents.filter((e) => e.weekly === "Saturday" || e.weekly === "Sunday");
    notes = monthNotes[today.month];
    intro = wk.next
      ? `Sunday, ${EVENTS_UPDATED_LABEL}, is the last day of this weekend. Mickey's Very Merry Christmas Party is on tonight. The next full weekend is ${wk.next.label}.`
      : `Events scheduled for ${wk.label}, plus the Saturday and Sunday markets.`;
    picksHeading = "Tours you can still book";
    picks = await findListings(MONTH_PICKS[today.month].re, 6, 5);
    if (picks.length < 3) picks = await getTopRated(6);
    faqs = [
      {
        q: "What is there to do in Orlando this weekend?",
        a: "Sunday, November 15 has Mickey's Very Merry Christmas Party and had the Lake Eola market in the morning. Next weekend, November 20–22, has the Florida Classic on Saturday, Jollywood Nights, Dazzling Nights opening Friday, and both farmers markets.",
      },
      {
        q: "What are free things to do in Orlando this weekend?",
        a: "The Winter Park Farmers' Market is Saturday morning and the Lake Eola Farmers Market is Sunday. Disney Springs and Universal CityWalk do not charge admission.",
      },
      {
        q: "Can I still book tours for this weekend?",
        a: "Often, yes. Many Orlando tours have same-week availability. Check the booking page, and choose free cancellation if the weather may change.",
      },
    ];
  } else {
    const copy = SPECIAL_COPY[info.kind];
    intro = copy.intro;
    body = copy.body;
    eventList = events.filter((e) => (specialPages[info.kind].categories as readonly string[]).includes(e.category) && !e.ended);
    const ended = events.filter((e) => (specialPages[info.kind].categories as readonly string[]).includes(e.category) && e.ended);
    eventList = info.kind === "halloween-in-orlando" ? [...eventList, ...ended] : eventList;
    picksHeading = info.kind === "halloween-in-orlando" ? "Tours if you still want a scare" : "Holiday tickets and tours";
    picks = await findListings(copy.re, 6, 10);
    faqs = copy.faqs;
  }

  return (
    <>
      <PageHero
        title={info.title}
        intro={subtitle ? `${subtitle}. ${intro}` : intro}
        crumbs={[
          { name: "Events", href: "/events" },
          { name: info.title, href: `/events/${slug}` },
        ]}
      />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p className="event-updated">Updated {EVENTS_UPDATED_LABEL}</p>
          {notes && (
            <div className="weather-row">
              <div>
                <strong>Weather</strong>
                <p>{notes.weather}</p>
              </div>
              <div>
                <strong>Crowds</strong>
                <p>{notes.crowds}</p>
              </div>
              <div>
                <strong>Our tip</strong>
                <p>{notes.tip}</p>
              </div>
            </div>
          )}

          {body && (
            <div className="container-narrow" style={{ margin: "0 auto 40px", padding: 0 }}>
              <Prose blocks={parseMarkdown(body)} />
            </div>
          )}

          {weekendDays ? (
            <>
              <h2>Scheduled this weekend</h2>
              {weekendDays.map((d) => (
                <DayList key={d.iso} iso={d.iso} events={d.events} />
              ))}
              <h2>Also running this month</h2>
              <div className="event-grid" style={{ marginBottom: 32 }}>
                {eventList.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </>
          ) : (
            <>
              <h2>{info.kind === "month" ? `Events in ${MONTHS[info.month - 1]}` : "Events"}</h2>
              <div className="event-grid" style={{ marginBottom: 48 }}>
                {eventList.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </>
          )}

          {info.kind !== "halloween-in-orlando" && info.kind !== "christmas-in-orlando" && (
            <>
              <h2>{info.kind === "this-weekend" ? "Weekend markets" : "Every week"}</h2>
              <div className="event-grid" style={{ marginBottom: 48 }}>
                {weekly.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {picks.length > 0 && (
        <section className="section section-alt" aria-labelledby="picks-title">
          <div className="container">
            <div className="cat-head">
              <div>
                <h2 id="picks-title">{picksHeading}</h2>
                <p>Top-rated experiences with live prices. Links out to Viator are sponsored.</p>
              </div>
              <Link href="/book-now" className="link-arrow">
                Browse all tours
              </Link>
            </div>
            <div className="card-grid">
              {picks.map((l) => (
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
          <Faq items={faqs} />
          <nav aria-label="More event guides" style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: "1.3rem" }}>Plan another month</h2>
            <ul className="month-nav">
              {MONTHS.map((m, i) => (
                <li key={m}>
                  <Link href={`/events/${monthSlug(i + 1)}`} aria-current={info.month === i + 1 ? "true" : undefined}>
                    {m}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/events/kids">Kids</Link>
              </li>
              <li>
                <Link href="/events/free">Free</Link>
              </li>
              <li>
                <Link href="/events/christmas-in-orlando">Christmas</Link>
              </li>
              <li>
                <Link href="/events/this-weekend">This weekend</Link>
              </li>
            </ul>
            <Link href="/events" className="link-arrow">
              What is on in Orlando this week
            </Link>
          </nav>
        </div>
      </section>

      {picks.length > 0 && (
        <JsonLd data={itemListSchema(picksHeading, picks.map((l) => ({ name: l.title, href: `/book-now/${l.slug}` })))} />
      )}
    </>
  );
}
