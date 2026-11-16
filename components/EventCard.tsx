import Link from "next/link";
import { EVENTS_UPDATED_LABEL, eventPath, type OrlandoEvent } from "@/data/events";
import { CalendarIcon, PinIcon } from "./Icons";

export default function EventCard({ event, headingLevel = 3 }: { event: OrlandoEvent; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const details = eventPath(event);
  return (
    <article className="event-card" id={event.slug}>
      <div className="event-card-tags">
        <span className={`event-cat cat-${event.category.toLowerCase()}`}>{event.category}</span>
        {!event.datesConfirmed && <span className="event-flag">Dates not confirmed</span>}
        {event.ended && <span className="event-flag">Season ended</span>}
      </div>
      <H className="event-name">
        {event.detail ? <Link href={details}>{event.name}</Link> : event.name}
      </H>
      <ul className="card-meta">
        <li>
          <CalendarIcon size={15} />
          {event.timing}
        </li>
        <li>
          <PinIcon size={15} />
          {event.where}
          {event.area ? ` · ${event.area}` : ""}
        </li>
      </ul>
      <p>
        <strong>{event.price}</strong>
        {" · "}
        {event.audience}
      </p>
      <p>{event.description}</p>
      {event.confidenceNote && <p className="event-tip">{event.confidenceNote}</p>}
      {event.tip && !event.confidenceNote && (
        <p className="event-tip">
          <strong>Tip:</strong> {event.tip}
        </p>
      )}
      <p className="event-updated">Updated {EVENTS_UPDATED_LABEL}</p>
      <div className="event-links">
        {event.detail && (
          <Link href={details} className="link-arrow">
            Event guide
          </Link>
        )}
        <a href={event.officialUrl} className="link-arrow" target="_blank" rel="noopener noreferrer">
          {event.officialLabel ?? "Official site"}
        </a>
        {event.related && (
          <Link href={event.related.href} className="link-arrow">
            {event.related.label}
          </Link>
        )}
      </div>
    </article>
  );
}
