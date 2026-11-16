/**
 * Orlando event types. Dated fields are filled only when an organizer
 * has published them. `datesConfirmed` is false when we are repeating a
 * typical season or a secondary report.
 */
export type EventCategory =
  | "Festival"
  | "Holiday"
  | "Halloween"
  | "Sports"
  | "Arts"
  | "Market"
  | "Fireworks"
  | "Space"
  | "Nightlife"
  | "District";

export type EventTag = "family" | "kids" | "free" | "holiday" | "nightlife" | "sports" | "festival" | "theme-park";

/** How the calendar should place the event. */
export type EventSpan = "dates" | "daily" | "season" | "annual" | "recurring";

export interface EventSource {
  name: string;
  url: string;
}

export interface OrlandoEvent {
  slug: string;
  name: string;
  /** Months (1-12) used by the annual calendar and month pages. */
  months: number[];
  timing: string;
  where: string;
  /** Neighborhood or destination, shown with the venue. */
  area: string;
  category: EventCategory;
  tags: EventTag[];
  description: string;
  /** Short label for price: "Free", "Included with admission", "$189–$229 plus tax". */
  price: string;
  /** Who it is for, in plain language. */
  audience: string;
  officialUrl: string;
  sources: EventSource[];
  span: EventSpan;
  /** Organizer has published these dates. */
  datesConfirmed: boolean;
  /** The 2026 edition is over. Kept so older seasonal URLs still explain it. */
  ended?: boolean;
  tip?: string;
  /** Extra caveat shown on the card, usually when a DMO announced it and the venue page was not checked. */
  confidenceNote?: string;
  weekly?: "Saturday" | "Sunday" | "Monday";
  /** Open any day, not only the weekly weekday. */
  recurring?: "daily";
  fixedDay?: number;
  related?: { href: string; label: string };
  /** Inclusive ISO dates. */
  startDate?: string;
  endDate?: string;
  /** Select nights or performances. */
  dates?: string[];
  closedDates?: string[];
  /** Gets an /events/[slug] page. */
  detail?: boolean;
  venueName?: string;
  locality?: string;
  streetAddress?: string;
  organizer?: string;
  /** Numeric offer for Event schema. Omit when we do not have an official figure. */
  offer?: { low: string; high?: string };
  /** Title regex for Viator products in the snapshot. */
  tourQuery?: string;
  /** Prefer this title match for the sponsored button. */
  tourPrefer?: string;
  bookHref?: string;
  bookLabel?: string;
  seoTitle?: string;
  seoDescription?: string;
  guide?: string;
  faqs?: { q: string; a: string }[];
  /** Lower sorts first. */
  weight?: number;
  officialLabel?: string;
}

export const EVENTS_UPDATED = "2026-11-15";
export const EVENTS_UPDATED_LABEL = "November 15, 2026";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Month notes for /events/[month]: typical weather and crowds. */
export const monthNotes: Record<number, { weather: string; crowds: string; tip: string }> = {
  1: {
    weather: "Mild and dry, with average highs in the low 70s °F and cool mornings.",
    crowds: "Busy through New Year's, then some of the quietest weeks of the year after the first weekend.",
    tip: "Marathon Weekend and the Citrus Bowl book up the first weekend. The weeks after are easier.",
  },
  2: {
    weather: "Pleasant, with average highs in the mid 70s °F.",
    crowds: "Moderate, with a spike around Presidents' Day weekend and Speedweeks on the coast.",
    tip: "EPCOT Festival of the Arts is in full swing, and Daytona is about an hour east.",
  },
  3: {
    weather: "Warm and sunny, with average highs near 80 °F.",
    crowds: "Very busy with spring break.",
    tip: "The Strawberry Festival in Plant City and the tail of Festival of the Arts overlap early March.",
  },
  4: {
    weather: "Warm and mostly dry, with average highs in the low 80s °F.",
    crowds: "Busy around Easter, calmer later in the month.",
    tip: "One of the best months for airboat rides and outdoor adventures.",
  },
  5: {
    weather: "Hot, with average highs in the upper 80s °F before the rainy season starts.",
    crowds: "Often quieter before summer vacation begins.",
    tip: "Schedule outdoor activities for the morning.",
  },
  6: {
    weather: "Hot and humid, with near-daily afternoon thunderstorms.",
    crowds: "Busy once schools let out.",
    tip: "Plan water parks in the morning and indoor attractions for stormy afternoons.",
  },
  7: {
    weather: "Hot and humid, with average highs in the low 90s °F and afternoon storms.",
    crowds: "Peak summer crowds.",
    tip: "Water parks, springs and dinner shows help beat the heat.",
  },
  8: {
    weather: "Hot and stormy, with average highs in the low 90s °F.",
    crowds: "Busy early in the month, quieter as schools return.",
    tip: "Late August is when Halloween events usually start.",
  },
  9: {
    weather: "Still hot, with afternoon storms and peak hurricane season.",
    crowds: "Among the quietest months of the year.",
    tip: "Book refundable tours and consider travel insurance.",
  },
  10: {
    weather: "Warm, with average highs in the mid 80s °F and less rain.",
    crowds: "Moderate, busier around Halloween weekends.",
    tip: "The 2026 Halloween season has ended. 2027 dates are not posted yet.",
  },
  11: {
    weather: "Comfortable, with average highs near 80 °F.",
    crowds: "Moderate through mid-month, very busy Thanksgiving week.",
    tip: "Holiday parties are already on sale. Thanksgiving is Thursday, November 26.",
  },
  12: {
    weather: "Mild, with average highs in the mid 70s °F.",
    crowds: "Busy all month, and extremely busy from about December 20 through New Year's.",
    tip: "Party nights closest to Christmas cost the most and sell out first.",
  },
};

export const monthSlug = (m: number) => MONTHS[m - 1].toLowerCase();

export function eventPath(event: { slug: string; detail?: boolean; months: number[] }) {
  return event.detail ? `/events/${event.slug}` : `/events/${monthSlug(event.months[0])}#${event.slug}`;
}
