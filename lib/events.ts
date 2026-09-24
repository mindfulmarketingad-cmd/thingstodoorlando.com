import { events, MONTHS, monthSlug, type OrlandoEvent } from "@/data/events";

const TZ = "America/New_York";

/** Today's date parts in Orlando's time zone. */
export function orlandoToday(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "numeric", day: "numeric", weekday: "short" })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { year: +parts.year, month: +parts.month, day: +parts.day, weekday: parts.weekday as string };
}

/** The Friday to Sunday weekend that is current (Fri to Sun) or next (Mon to Thu). */
export function upcomingWeekend(now = new Date()) {
  const t = orlandoToday(now);
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(t.weekday);
  const base = new Date(Date.UTC(t.year, t.month - 1, t.day));
  const toFriday = dow === 0 ? -2 : dow === 6 ? -1 : 5 - dow;
  const fri = new Date(base);
  fri.setUTCDate(base.getUTCDate() + toFriday);
  const sun = new Date(fri);
  sun.setUTCDate(fri.getUTCDate() + 2);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
  const months = [...new Set([fri.getUTCMonth() + 1, sun.getUTCMonth() + 1])];
  return { label: `${fmt(fri)} to ${fmt(sun)}`, months, friday: fri.toISOString().slice(0, 10), isNow: dow === 0 || dow >= 5 };
}

export function eventsForMonths(months: number[]): OrlandoEvent[] {
  return events.filter((e) => !e.weekly && e.months.some((m) => months.includes(m)));
}

export const specialPages = {
  "halloween-in-orlando": { title: "Halloween in Orlando: October Events & Things To Do", categories: ["Halloween"] },
  "christmas-in-orlando": { title: "Christmas in Orlando: Holiday Events & Things To Do", categories: ["Holiday"] },
  "this-weekend": { title: "Things To Do In Orlando This Weekend", categories: [] },
} as const;

export type SpecialSlug = keyof typeof specialPages;

export function monthFromSlug(slug: string): number | undefined {
  const i = MONTHS.findIndex((m) => m.toLowerCase() === slug);
  return i >= 0 ? i + 1 : undefined;
}

export { MONTHS, monthSlug };
