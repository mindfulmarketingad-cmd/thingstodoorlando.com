import { events, sortEvents, type OrlandoEvent } from "@/data/events";
import { MONTHS, monthSlug } from "@/data/event-types";

const TZ = "America/New_York";
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** Today's date parts in Orlando's time zone. */
export function orlandoToday(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "long",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const weekday = parts.weekday as (typeof WEEKDAYS)[number];
  return { year: +parts.year, month: +parts.month, day: +parts.day, weekday };
}

export function toIso(t: { year: number; month: number; day: number }) {
  return `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}

export function formatIso(iso: string, options: Intl.DateTimeFormatOptions = {}) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

function addIso(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function weekdayOf(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

function inRange(event: OrlandoEvent, iso: string) {
  return !!event.startDate && !!event.endDate && iso >= event.startDate && iso <= event.endDate;
}

/** "on" = happening that day. "season" = the run includes that day, but not every day is confirmed. */
export function coversDate(event: OrlandoEvent, iso: string): "on" | "season" | null {
  if (event.ended && event.endDate && iso > event.endDate) return null;
  if (event.span === "recurring") {
    if (event.recurring === "daily") return "on";
    if (event.weekly && event.weekly === weekdayOf(iso)) return "on";
    return null;
  }
  if (event.span === "dates") return event.dates?.includes(iso) ? "on" : null;
  if (event.span === "daily") {
    if (!inRange(event, iso) || event.closedDates?.includes(iso)) return null;
    return "on";
  }
  if (event.span === "season") return inRange(event, iso) ? "season" : null;
  if (event.span === "annual" && event.fixedDay) {
    const [, m, d] = iso.split("-").map(Number);
    if (d === event.fixedDay && event.months.includes(m)) return "on";
  }
  return null;
}

export function hasEnded(event: OrlandoEvent, todayIso: string) {
  if (event.ended) return true;
  if (event.endDate && event.endDate < todayIso) return true;
  if (event.span === "dates" && event.dates?.length && event.dates.every((d) => d < todayIso)) return true;
  return false;
}

/**
 * Today through the coming Sunday. On Sunday, extend through the following
 * Sunday so the page is not only about a weekend that is ending.
 */
export function planningWindow(now = new Date()) {
  const today = orlandoToday(now);
  const todayIso = toIso(today);
  const dow = WEEKDAYS.indexOf(today.weekday);
  const extra = dow === 0 ? 7 : 7 - dow;
  const days = Array.from({ length: extra + 1 }, (_, i) => addIso(todayIso, i));
  const end = days[days.length - 1];
  const sameMonth = todayIso.slice(0, 7) === end.slice(0, 7);
  const label = sameMonth
    ? `${formatIso(todayIso, { month: "long" })} ${Number(todayIso.slice(8))}–${Number(end.slice(8))}, ${todayIso.slice(0, 4)}`
    : `${formatIso(todayIso, { month: "long", day: "numeric" })} to ${formatIso(end, { month: "long", day: "numeric", year: "numeric" })}`;
  return {
    today,
    todayIso,
    days,
    end,
    label,
  };
}

export interface WeekDay {
  iso: string;
  label: string;
  isToday: boolean;
  events: OrlandoEvent[];
}

export function weekPlan(now = new Date()) {
  const window = planningWindow(now);
  const days: WeekDay[] = window.days.map((iso) => ({
    iso,
    label: formatIso(iso, { weekday: "long", month: "long", day: "numeric" }),
    isToday: iso === window.todayIso,
    events: sortEvents(
      events.filter((e) => coversDate(e, iso) === "on" && e.recurring !== "daily" && e.span !== "daily" && !e.ended),
    ),
  }));
  const daily = sortEvents(
    events.filter(
      (e) => e.span === "daily" && !e.ended && window.days.some((iso) => coversDate(e, iso) === "on"),
    ),
  );
  const season = sortEvents(
    events.filter(
      (e) => !e.ended && e.span === "season" && window.days.some((iso) => coversDate(e, iso) === "season"),
    ),
  );
  const tonight = sortEvents(
    events.filter((e) => coversDate(e, window.todayIso) === "on" && e.recurring !== "daily" && e.span !== "daily" && !e.ended),
  );
  return { ...window, days, daily, season, tonight };
}

/** The Friday-to-Sunday that is underway (Fri–Sun) or next (Mon–Thu). On Sunday, also useful as "this weekend." */
export function upcomingWeekend(now = new Date()) {
  const t = orlandoToday(now);
  const dow = WEEKDAYS.indexOf(t.weekday);
  const todayIso = toIso(t);
  const toFriday = dow === 0 ? -2 : dow === 6 ? -1 : 5 - dow;
  const friday = addIso(todayIso, toFriday);
  const sunday = addIso(friday, 2);
  const days = [friday, addIso(friday, 1), sunday];
  return {
    label: `${formatIso(friday, { month: "long", day: "numeric" })} to ${formatIso(sunday, { month: "long", day: "numeric" })}`,
    friday,
    sunday,
    days,
    isNow: dow === 0 || dow >= 5,
    next:
      dow === 0
        ? {
            label: `${formatIso(addIso(sunday, 5), { month: "long", day: "numeric" })} to ${formatIso(addIso(sunday, 7), { month: "long", day: "numeric" })}`,
            days: [addIso(sunday, 5), addIso(sunday, 6), addIso(sunday, 7)],
          }
        : undefined,
  };
}

function monthEnd(year: number, month: number) {
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
}

function monthStart(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

/** Year of the next (or current) occurrence of a calendar month. */
export function monthYear(month: number, now = new Date()) {
  const t = orlandoToday(now);
  return month >= t.month ? t.year : t.year + 1;
}

export function eventsForMonthPage(month: number, now = new Date()): OrlandoEvent[] {
  const year = monthYear(month, now);
  const today = orlandoToday(now);
  const todayIso = toIso(today);
  const start = monthStart(year, month);
  const end = monthEnd(year, month);
  const current = year === today.year && month === today.month;
  return sortEvents(
    events.filter((e) => {
      if (e.weekly || e.recurring) return false;
      if (e.startDate && e.endDate) {
        const overlaps = e.startDate <= end && e.endDate >= start;
        if (overlaps) {
          if (current && hasEnded(e, todayIso)) return false;
          return true;
        }
      }
      // A past dated season still belongs on its typical month page for next year.
      if ((e.ended || (e.endDate && e.endDate < start)) && e.months.includes(month)) return !current;
      return !e.startDate && e.months.includes(month) && !(current && e.ended);
    }),
  );
}

export function eventsForMonths(months: number[]): OrlandoEvent[] {
  const seen = new Set<string>();
  const out: OrlandoEvent[] = [];
  for (const m of months) {
    for (const e of eventsForMonthPage(m)) {
      if (seen.has(e.slug)) continue;
      seen.add(e.slug);
      out.push(e);
    }
  }
  return out;
}

export function eventsOnDate(iso: string) {
  return sortEvents(events.filter((e) => coversDate(e, iso) === "on" && !e.ended && e.span !== "recurring"));
}

export function eventsInSeasonOn(iso: string) {
  return sortEvents(
    events.filter((e) => !e.ended && !e.weekly && !e.recurring && coversDate(e, iso) === "season"),
  );
}

export function eventsForFilter(match: (e: OrlandoEvent) => boolean, todayIso: string) {
  return sortEvents(events.filter((e) => match(e) && !hasEnded(e, todayIso)));
}

export const specialPages = {
  "halloween-in-orlando": { title: "Halloween in Orlando: What Is On, and What Ended", categories: ["Halloween"] },
  "christmas-in-orlando": { title: "Christmas in Orlando: 2026 Holiday Events", categories: ["Holiday"] },
  "this-weekend": { title: "Things To Do In Orlando This Weekend", categories: [] },
} as const;

export type SpecialSlug = keyof typeof specialPages;

export const eventFilters = {
  kids: {
    title: "Orlando Events for Kids and Families",
    description:
      "Orlando events for kids and families right now: holiday parties, free markets, lights and daytime gardens, with dates and prices.",
    intro:
      "These are the Orlando events that work for families and kids between now and March, plus the weekly markets. Scare events that have already ended are left off.",
  },
  free: {
    title: "Free Events in Orlando",
    description:
      "Free events in Orlando: the Lake Eola and Winter Park markets, the city tree lighting, and districts you can walk without a ticket.",
    intro:
      "Free means no admission charge. Food, parking and optional attractions can still cost money. Prices below are what the organizer posted.",
  },
  holiday: {
    title: "Holiday Events in Orlando",
    description:
      "Holiday events in Orlando from November through early January: Disney parties, Universal, SeaWorld, ICE!, tree lightings and the Nutcracker.",
    intro: "The holiday season is the main thing on Orlando's calendar right now. Every date below was checked against the organizer or Visit Orlando.",
  },
  nightlife: {
    title: "Nightlife and Evening Events in Orlando",
    description:
      "Evening events in Orlando: separately ticketed park parties, CityWalk, concerts and night markets, with what is actually on this month.",
    intro: "Nightlife here means something that happens after dark, from a theme-park party to CityWalk. It is not a club listing.",
  },
  sports: {
    title: "Sports Events in Orlando",
    description:
      "Sports in Orlando this season: the Florida Classic, Magic home games, the Pop-Tarts Bowl, the Citrus Bowl, Marathon Weekend and the Daytona 500.",
    intro: "Kickoff times and home dates below come from the teams and Florida Citrus Sports. Tip-off times change, so the team site wins.",
  },
  festivals: {
    title: "Festivals in Orlando",
    description:
      "Orlando festivals from the holidays through March: EPCOT's holiday and arts festivals, the Strawberry Festival, and dates that are not confirmed yet.",
    intro: "Confirmed festivals are labeled as such. Mardi Gras and Flower & Garden are listed only as reported, because we could not verify them on the park's own page.",
  },
  "theme-parks": {
    title: "Theme Park Events in Orlando",
    description:
      "Theme park events in Orlando right now: Mickey's Very Merry Christmas Party, Jollywood Nights, Universal holidays, SeaWorld Christmas and EPCOT festivals.",
    intro: "Some of these are included with a park ticket. The Disney nighttime parties are not. The difference is on each event.",
  },
  summer: {
    title: "Summer Events in Orlando",
    description:
      "Summer events in Orlando usually mean water parks, July 4 at Lake Eola and, by August, Halloween nights. Summer 2026 is over. Here is what is on now.",
    intro:
      "If you searched for summer events in Orlando today, the honest answer is that summer 2026 has ended and most summer 2027 dates are not posted. Orlando's calendar right now is the holiday season.",
  },
} as const;

export type FilterSlug = keyof typeof eventFilters;

const FILTER_MATCH: Record<Exclude<FilterSlug, "summer">, (e: OrlandoEvent) => boolean> = {
  kids: (e) => e.tags.includes("kids") || e.tags.includes("family"),
  free: (e) => e.tags.includes("free"),
  holiday: (e) => e.tags.includes("holiday"),
  nightlife: (e) => e.tags.includes("nightlife"),
  sports: (e) => e.tags.includes("sports"),
  festivals: (e) => e.tags.includes("festival"),
  "theme-parks": (e) => e.tags.includes("theme-park"),
};

export function filterMatch(slug: FilterSlug) {
  if (slug === "summer") return null;
  return FILTER_MATCH[slug];
}

export function monthFromSlug(slug: string): number | undefined {
  const i = MONTHS.findIndex((m) => m.toLowerCase() === slug);
  return i >= 0 ? i + 1 : undefined;
}

export function detailEvents() {
  return events.filter((e) => e.detail);
}

export { MONTHS, monthSlug };
