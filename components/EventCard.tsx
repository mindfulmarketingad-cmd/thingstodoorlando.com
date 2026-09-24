import Link from "next/link";
import type { OrlandoEvent } from "@/data/events";
import { CalendarIcon, PinIcon } from "./Icons";

export default function EventCard({ event, headingLevel = 3 }: { event: OrlandoEvent; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="event-card" id={event.slug}>
      <span className={`event-cat cat-${event.category.toLowerCase()}`}>{event.category}</span>
      <H className="event-name">{event.name}</H>
      <ul className="card-meta">
        <li>
          <CalendarIcon size={15} />
          {event.timing}
        </li>
        <li>
          <PinIcon size={15} />
          {event.where}
        </li>
      </ul>
      <p>{event.description}</p>
      {event.tip && (
        <p className="event-tip">
          <strong>Tip:</strong> {event.tip}
        </p>
      )}
      {event.related && (
        <Link href={event.related.href} className="link-arrow">
          {event.related.label}
        </Link>
      )}
    </article>
  );
}
