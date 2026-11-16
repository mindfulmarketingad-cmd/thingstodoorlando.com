import { eventCatalog } from "./event-catalog";
import { MONTHS, type OrlandoEvent } from "./event-types";

export type { EventCategory, EventSource, EventSpan, EventTag, OrlandoEvent } from "./event-types";
export { EVENTS_UPDATED, EVENTS_UPDATED_LABEL, MONTHS, eventPath, monthNotes, monthSlug } from "./event-types";

const slugs = new Set<string>();
for (const event of eventCatalog) {
  if (slugs.has(event.slug)) throw new Error(`Duplicate event slug: ${event.slug}`);
  slugs.add(event.slug);
  if (!event.officialUrl.startsWith("https://")) throw new Error(`Event ${event.slug} needs an https official URL`);
  if (event.span === "dates" && !event.dates?.length) throw new Error(`Event ${event.slug} has no dates`);
  if ((event.span === "daily" || event.span === "season") && (!event.startDate || !event.endDate)) {
    throw new Error(`Event ${event.slug} is missing a date range`);
  }
  if (event.detail && !event.faqs?.length) throw new Error(`Detail event ${event.slug} needs FAQs`);
  if (event.detail && MONTHS.some((m) => m.toLowerCase() === event.slug)) {
    throw new Error(`Event slug collides with a month: ${event.slug}`);
  }
}

export const events: OrlandoEvent[] = eventCatalog;

export function eventsInMonth(m: number, { includeWeekly = false } = {}) {
  return events.filter((e) => e.months.includes(m) && (includeWeekly || (!e.weekly && !e.recurring)));
}

/** Weekly markets and districts you can visit any week. */
export const weeklyEvents = events.filter((e) => e.weekly || e.recurring);

export function sortEvents(list: OrlandoEvent[]) {
  return [...list].sort((a, b) => (a.weight ?? 50) - (b.weight ?? 50) || a.name.localeCompare(b.name));
}
