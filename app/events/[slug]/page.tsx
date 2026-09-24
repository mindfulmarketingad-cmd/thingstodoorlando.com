import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventCard from "@/components/EventCard";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import ListingCard from "@/components/ListingCard";
import PageHero from "@/components/PageHero";
import Prose from "@/components/Prose";
import { events, monthNotes, weeklyEvents } from "@/data/events";
import {
  eventsForMonths,
  monthFromSlug,
  MONTHS,
  monthSlug,
  specialPages,
  upcomingWeekend,
  type SpecialSlug,
} from "@/lib/events";
import { findListings, getTopRated } from "@/lib/listicles";
import { parseMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/metadata";
import { itemListSchema } from "@/lib/schema";
import type { Listing } from "@/lib/types";

export const revalidate = 3600;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...MONTHS.map((_, i) => ({ slug: monthSlug(i + 1) })), ...Object.keys(specialPages).map((slug) => ({ slug }))];
}

/** Bookable tours that suit each month, so the 12 month pages are not duplicates. */
const MONTH_PICKS: Record<number, { heading: string; re: RegExp }> = {
  1: { heading: "Manatee and springs tours for winter", re: /manatee|springs|kayak|snorkel/i },
  2: { heading: "Manatee season tours and mild-weather adventures", re: /manatee|springs|airboat|kayak/i },
  3: { heading: "Spring break favorites", re: /airboat|kennedy|theme park|legoland|kayak|zip/i },
  4: { heading: "Outdoor adventures for perfect April weather", re: /airboat|kayak|balloon|horse|bike|eco/i },
  5: { heading: "Morning adventures before the summer heat", re: /airboat|balloon|kayak|paddle|sunrise/i },
  6: { heading: "Cool-down ideas for June", re: /water|snorkel|swim|tubing|kayak|escape|indoor|dinner show/i },
  7: { heading: "Ways to beat the July heat", re: /water|snorkel|swim|tubing|escape|indoor|dinner show|skydiving/i },
  8: { heading: "Indoor and water fun for August", re: /water|snorkel|escape|indoor|dinner show|skydiving|museum/i },
  9: { heading: "Great-value tours in quieter September", re: /kennedy|airboat|food tour|ghost|dinner show/i },
  10: { heading: "Spooky season tours", re: /ghost|haunt|halloween|boo|paranormal|night/i },
  11: { heading: "Top tours for comfortable fall weather", re: /airboat|kennedy|balloon|kayak|food tour|helicopter/i },
  12: { heading: "Holiday and winter experiences", re: /christmas|holiday|lights|manatee|springs|helicopter|dinner show/i },
};

const SPECIAL_COPY: Record<Exclude<SpecialSlug, "this-weekend">, { intro: string; body: string; re: RegExp; faqs: { q: string; a: string }[] }> = {
  "halloween-in-orlando": {
    intro: "Orlando takes Halloween seriously. From family-friendly trick-or-treating at Magic Kingdom to the legendary scares of Halloween Horror Nights, here is how to plan the perfect spooky season.",
    body: `
## Why Orlando is the Halloween capital

Few places on earth do Halloween like Orlando. The major theme parks run separately ticketed after-dark events for weeks, downtown hosts ghost tours year round, and October weather is finally cooler and drier after summer.

## Choosing the right Halloween event

- **For young kids:** Mickey's Not-So-Scary Halloween Party at Magic Kingdom is built for families, with a parade, fireworks and trick-or-treating.
- **For teens and adults:** Halloween Horror Nights at Universal Studios is the big one, with haunted houses and scare zones. It is intense and not recommended for young children.
- **For thrill seekers on a budget:** SeaWorld's Howl-O-Scream pairs haunted houses with coasters in the dark.
- **For something different:** Guided ghost tours of downtown Orlando and nearby Mount Dora mix local history with spooky stories.

## Tips for Halloween in Orlando

1. **Book early.** Event nights closest to October 31 sell out first.
2. **Go early in the season.** September and early October nights are cheaper and less crowded.
3. **Check costume rules.** Each park has its own guidelines for adult costumes and masks.
4. **Plan your evenings.** Most events start at dusk, so use the day for a pool break or an easy tour.
`,
    re: /ghost|haunt|halloween|boo|paranormal|spooky|horror/i,
    faqs: [
      {
        q: "What is the best Halloween event in Orlando for kids?",
        a: "Mickey's Not-So-Scary Halloween Party at Magic Kingdom is the most family-friendly option, with trick-or-treating, a Halloween parade and fireworks.",
      },
      {
        q: "Is Halloween Horror Nights too scary for kids?",
        a: "It is designed for teens and adults and is not recommended for young children. Universal suggests the event may be too intense for guests under 13.",
      },
      {
        q: "When do Halloween events start in Orlando?",
        a: "Mickey's Not-So-Scary Halloween Party often starts in mid August, and Halloween Horror Nights usually opens in late August or September. Most events run through October 31 or into early November.",
      },
    ],
  },
  "christmas-in-orlando": {
    intro: "From Main Street snowfall to millions of twinkling lights, Christmas in Orlando is a full season of celebrations. Here are the best holiday events and how to plan around the crowds.",
    body: `
## The holiday season in Orlando

The parks begin decorating in early November, and by Thanksgiving the entire city is in holiday mode. Expect huge Christmas trees, special parades, seasonal food and, at a few spots, even snow.

## Best holiday events

- **Mickey's Very Merry Christmas Party:** a separately ticketed evening at Magic Kingdom with a holiday parade, fireworks and snowfall on Main Street.
- **EPCOT International Festival of the Holidays:** holiday kitchens, storytellers and the Candlelight Processional.
- **Universal Holidays:** parades, Grinch-themed fun and a festive Wizarding World.
- **SeaWorld Christmas Celebration:** millions of lights and holiday shows after dark.
- **Christmas at Gaylord Palms and ICE!:** a walk-through exhibit of hand-carved ice sculptures in Kissimmee.

## Tips for Christmas in Orlando

1. **Visit early in December.** The last two weeks of December are among the busiest of the year.
2. **Book holiday parties early.** Ticketed evening events sell out, especially in December.
3. **Pack layers.** Evenings can be surprisingly cool in December.
4. **Plan New Year's Eve carefully.** Theme parks often reach capacity on December 31.
`,
    re: /christmas|holiday|lights|santa|festive|winter/i,
    faqs: [
      {
        q: "When do Christmas events start in Orlando?",
        a: "Most holiday events begin in early to mid November and run through late December or early January.",
      },
      {
        q: "Does it snow in Orlando at Christmas?",
        a: "Real snow is extremely rare, but several parks create snowfall effects, and the ICE! exhibit at Gaylord Palms is kept at freezing temperatures.",
      },
      {
        q: "Is Orlando busy at Christmas?",
        a: "Early December is moderately busy, but the week before Christmas through New Year's is one of the busiest times of the year. Arrive at parks before opening and book dining and tours ahead.",
      },
    ],
  },
};

function pageInfo(slug: string) {
  const month = monthFromSlug(slug);
  if (month) {
    return {
      kind: "month" as const,
      month,
      title: `Things To Do In Orlando In ${MONTHS[month - 1]}`,
      description: `Plan your Orlando trip in ${MONTHS[month - 1]}: events and festivals, weather, crowds and the best tours to book this month.`,
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
          ? "Things to do in Orlando this weekend: events, markets, festivals and top-rated tours you can still book."
          : s === "halloween-in-orlando"
            ? "Halloween in Orlando: Mickey's Not-So-Scary Halloween Party, Halloween Horror Nights, Howl-O-Scream, ghost tours and planning tips."
            : "Christmas in Orlando: holiday parties, festivals, light displays, ICE! at Gaylord Palms and tips for visiting during the holidays.",
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

export default async function EventsSlugPage({ params }: Props) {
  const { slug } = await params;
  const info = pageInfo(slug);
  if (!info) notFound();

  let intro: string;
  let body: string | undefined;
  let eventList = events.filter(() => false);
  let weekly = weeklyEvents;
  let picksHeading = "";
  let picks: Listing[] = [];
  let faqs: { q: string; a: string }[] = [];
  let notes: (typeof monthNotes)[number] | undefined;
  let subtitle: string | undefined;

  if (info.kind === "month") {
    const m = info.month;
    notes = monthNotes[m];
    eventList = eventsForMonths([m]);
    intro = `Your complete guide to ${MONTHS[m - 1]} in Orlando: the events and festivals worth planning around, what the weather and crowds are like, and the best tours to book this month.`;
    picksHeading = MONTH_PICKS[m].heading;
    picks = await findListings(MONTH_PICKS[m].re, 6, 5);
    if (picks.length < 3) picks = await getTopRated(6);
    faqs = [
      {
        q: `What is there to do in Orlando in ${MONTHS[m - 1]}?`,
        a: `Popular ${MONTHS[m - 1]} events include ${eventList
          .slice(0, 4)
          .map((e) => e.name)
          .join(", ")}. Weekly favorites like the Winter Park and Lake Eola farmers markets run all year.`,
      },
      { q: `What is the weather like in Orlando in ${MONTHS[m - 1]}?`, a: notes.weather },
      { q: `Is ${MONTHS[m - 1]} a good time to visit Orlando?`, a: `${notes.crowds} ${notes.tip}` },
    ];
  } else if (info.kind === "this-weekend") {
    const wk = upcomingWeekend();
    subtitle = wk.label;
    eventList = eventsForMonths(wk.months);
    weekly = weeklyEvents.filter((e) => e.weekly === "Saturday" || e.weekly === "Sunday");
    notes = monthNotes[wk.months[0]];
    intro = `Looking for things to do in Orlando this weekend, ${wk.label}? Here are the events usually running now, local markets and the top-rated tours you can still book.`;
    picksHeading = MONTH_PICKS[wk.months[0]].heading;
    picks = await findListings(MONTH_PICKS[wk.months[0]].re, 6, 5);
    if (picks.length < 3) picks = await getTopRated(6);
    faqs = [
      {
        q: "What is there to do in Orlando this weekend?",
        a: `This time of year you can usually catch ${eventList
          .slice(0, 3)
          .map((e) => e.name)
          .join(", ")}, plus the Winter Park Farmers' Market on Saturday and the Lake Eola Farmers Market on Sunday.`,
      },
      {
        q: "What are free things to do in Orlando this weekend?",
        a: "Stroll Lake Eola Park and its Sunday market, browse the Winter Park Farmers' Market on Saturday morning, or visit Disney Springs and Universal CityWalk, which are free to enter.",
      },
      {
        q: "Can I still book tours for this weekend?",
        a: "Often, yes. Many Orlando tours have same-week availability. Check live availability on the booking page, and choose free cancellation in case the weather changes.",
      },
    ];
  } else {
    const copy = SPECIAL_COPY[info.kind];
    intro = copy.intro;
    body = copy.body;
    eventList = events.filter((e) => (specialPages[info.kind].categories as readonly string[]).includes(e.category));
    picksHeading = info.kind === "halloween-in-orlando" ? "Spooky tours to book" : "Holiday tours to book";
    picks = await findListings(copy.re, 6, 1);
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

          <h2>
            {info.kind === "month"
              ? `Events in Orlando in ${MONTHS[info.month - 1]}`
              : info.kind === "this-weekend"
                ? "Events usually running now"
                : `${info.kind === "halloween-in-orlando" ? "Halloween" : "Holiday"} events in Orlando`}
          </h2>
          <p style={{ color: "var(--muted)" }}>
            Dates change every year. Confirm with the organizer before you plan your trip.
          </p>
          <div className="event-grid" style={{ marginBottom: 48 }}>
            {eventList.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>

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
                <p>Top-rated experiences with live prices and availability.</p>
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
                <Link href="/events/halloween-in-orlando">Halloween</Link>
              </li>
              <li>
                <Link href="/events/christmas-in-orlando">Christmas</Link>
              </li>
              <li>
                <Link href="/events/this-weekend">This weekend</Link>
              </li>
            </ul>
            <Link href="/events" className="link-arrow">
              Full Orlando events calendar
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
