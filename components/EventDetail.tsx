import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import BookButton from "@/components/BookButton";
import EventCard from "@/components/EventCard";
import Faq from "@/components/Faq";
import ListingCard from "@/components/ListingCard";
import Prose from "@/components/Prose";
import { EVENTS_UPDATED_LABEL, events, type OrlandoEvent } from "@/data/events";
import { getAuthor } from "@/lib/authors";
import { ticketsForEvent } from "@/lib/event-tickets";
import { parseMarkdown } from "@/lib/markdown";

export default async function EventDetail({ event }: { event: OrlandoEvent }) {
  const author = getAuthor();
  const picks = event.tourQuery ? await ticketsForEvent(event.tourQuery, event.tourPrefer, 4) : [];
  const lead = picks[0];
  const related = events.filter((e) => e.slug !== event.slug && e.category === event.category && !e.ended).slice(0, 3);

  return (
    <>
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="container">
          <dl className="fact-grid">
            <div>
              <dt>Dates</dt>
              <dd>{event.timing}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                {event.where}
                <span>{event.area}</span>
              </dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{event.price}</dd>
            </div>
            <div>
              <dt>Good for</dt>
              <dd>{event.audience}</dd>
            </div>
          </dl>

          {!event.datesConfirmed && (
            <p className="event-banner">
              These dates are not confirmed on the organizer site. {event.confidenceNote}
            </p>
          )}
          {event.datesConfirmed && event.confidenceNote && <p className="event-banner">{event.confidenceNote}</p>}

          {event.guide && (
            <div className="container-narrow" style={{ margin: "0 auto 8px", padding: 0 }}>
              <Prose blocks={parseMarkdown(event.guide)} />
            </div>
          )}

          <div className="event-actions">
            <a className="btn btn-outline" href={event.officialUrl} target="_blank" rel="noopener noreferrer">
              {event.officialLabel ?? "Official site"}
            </a>
            {lead && (
              <BookButton href={lead.bookingUrl} label={`See prices for ${lead.title}`} item={lead.title} className="btn btn-primary" />
            )}
            {!lead && event.bookHref && (
              <Link className="btn btn-primary" href={event.bookHref}>
                {event.bookLabel ?? "Browse tickets"}
              </Link>
            )}
          </div>
          <p className="event-disclosure">
            Buttons that leave for Viator are sponsored. We may earn a commission, which does not change the dates or prices above.
            Updated {EVENTS_UPDATED_LABEL}.
          </p>
        </div>
      </section>

      {picks.length > 0 && (
        <section className="section section-alt" aria-labelledby="tickets-title">
          <div className="container">
            <div className="cat-head">
              <div>
                <h2 id="tickets-title">Tickets that pair with this</h2>
                <p>Live prices from our Viator snapshot. The event itself may only be sold by the organizer.</p>
              </div>
              {event.bookHref && (
                <Link href={event.bookHref} className="link-arrow">
                  {event.bookLabel ?? "Browse tickets"}
                </Link>
              )}
            </div>
            <div className="card-grid">
              {picks.map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {event.faqs && (
        <section className="section" aria-labelledby="faq-title">
          <div className="container">
            <div className="section-head">
              <h2 id="faq-title">Questions about {event.name}</h2>
            </div>
            <Faq items={event.faqs} />
          </div>
        </section>
      )}

      <section className="section section-alt">
        <div className="container">
          <h2>Sources</h2>
          <ul className="source-list">
            {event.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
          <AuthorBox author={author} />
          {related.length > 0 && (
            <>
              <h2 style={{ marginTop: 36 }}>More {event.category.toLowerCase()} events</h2>
              <div className="event-grid">
                {related.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </>
          )}
          <p style={{ marginTop: 28 }}>
            <Link href="/events" className="link-arrow">
              All Orlando events
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
