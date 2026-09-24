"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EventCategory, OrlandoEvent } from "@/data/events";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = MONTHS.map((m) => m.slice(0, 3));
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKLY_DAY: Record<string, number> = { Sunday: 0, Monday: 1, Saturday: 6 };

export const CATEGORY_ORDER: EventCategory[] = ["Festival", "Holiday", "Halloween", "Sports", "Arts", "Market", "Fireworks", "Space"];

type View = "month" | "year";

const slugOf = (m: number) => MONTHS[m - 1].toLowerCase();

/**
 * Interactive Orlando events calendar. Weekly and fixed-date events are
 * placed on real days; seasonal events (whose exact dates change yearly)
 * appear in the "running this month" panel and on the year timeline.
 */
export default function EventCalendar({
  events,
  initialYear,
  initialMonth,
  todayIso,
}: {
  events: OrlandoEvent[];
  initialYear: number;
  initialMonth: number;
  todayIso: string;
}) {
  const [view, setView] = useState<View>("month");
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState<number | null>(null);
  const [cats, setCats] = useState<Set<EventCategory>>(new Set(CATEGORY_ORDER));

  const visible = useMemo(() => events.filter((e) => cats.has(e.category)), [events, cats]);
  const running = visible.filter((e) => !e.weekly && !e.fixedDay && e.months.includes(month));

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const [ty, tm, td] = todayIso.split("-").map(Number);

  const eventsOn = (d: number) => {
    const dow = new Date(Date.UTC(year, month - 1, d)).getUTCDay();
    return visible.filter(
      (e) =>
        (e.weekly && WEEKLY_DAY[e.weekly] === dow) ||
        (e.fixedDay === d && e.months.includes(month)),
    );
  };

  const go = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y--;
    } else if (m > 12) {
      m = 1;
      y++;
    }
    setMonth(m);
    setYear(y);
    setDay(null);
  };

  const toggleCat = (c: EventCategory) =>
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(c) && next.size > 1) next.delete(c);
      else next.add(c);
      return next;
    });

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);

  const selected = day ? eventsOn(day) : [];
  const dayLabel = day
    ? new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <div className="cal">
      <div className="cal-toolbar">
        <div className="cal-views" role="tablist" aria-label="Calendar view">
          <button type="button" role="tab" aria-selected={view === "month"} onClick={() => setView("month")}>
            Month
          </button>
          <button type="button" role="tab" aria-selected={view === "year"} onClick={() => setView("year")}>
            Year
          </button>
        </div>
        <div className="cal-filters" aria-label="Filter by category">
          {CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              type="button"
              className={`cal-chip c-${c.toLowerCase()}`}
              aria-pressed={cats.has(c)}
              onClick={() => toggleCat(c)}
            >
              <span className="cal-dot" aria-hidden />
              {c}
            </button>
          ))}
          {cats.size < CATEGORY_ORDER.length && (
            <button type="button" className="cal-reset" onClick={() => setCats(new Set(CATEGORY_ORDER))}>
              Show all
            </button>
          )}
        </div>
      </div>

      {view === "month" ? (
        <div className="cal-month">
          <div className="cal-grid-wrap">
            <div className="cal-head">
              <button type="button" className="cal-nav" onClick={() => go(-1)} aria-label="Previous month">
                ‹
              </button>
              <h3 aria-live="polite">
                {MONTHS[month - 1]} {year}
              </h3>
              <button type="button" className="cal-nav" onClick={() => go(1)} aria-label="Next month">
                ›
              </button>
              {(year !== initialYear || month !== initialMonth) && (
                <button
                  type="button"
                  className="cal-today-btn"
                  onClick={() => {
                    setYear(initialYear);
                    setMonth(initialMonth);
                    setDay(null);
                  }}
                >
                  Today
                </button>
              )}
            </div>
            <div className="cal-grid" role="grid" aria-label={`${MONTHS[month - 1]} ${year}`}>
              {WEEKDAYS.map((w) => (
                <div key={w} className="cal-dow" role="columnheader">
                  {w}
                </div>
              ))}
              {cells.map((d, i) => {
                if (!d) return <div key={`e${i}`} className="cal-cell is-empty" aria-hidden />;
                const list = eventsOn(d);
                const isToday = year === ty && month === tm && d === td;
                const isPast = year < ty || (year === ty && (month < tm || (month === tm && d < td)));
                return (
                  <button
                    key={d}
                    type="button"
                    role="gridcell"
                    className={`cal-cell${isToday ? " is-today" : ""}${isPast ? " is-past" : ""}${day === d ? " is-selected" : ""}${list.length ? " has-events" : ""}`}
                    onClick={() => setDay(day === d ? null : d)}
                    aria-label={`${MONTHS[month - 1]} ${d}${list.length ? `, ${list.length} event${list.length > 1 ? "s" : ""}` : ""}${isToday ? ", today" : ""}`}
                  >
                    <span className="cal-date">{d}</span>
                    <span className="cal-items">
                      {list.slice(0, 2).map((e) => (
                        <span key={e.slug} className={`cal-pill c-${e.category.toLowerCase()}`}>
                          {e.name.replace(/ Farmers'? Market| Community Market/, " Market")}
                        </span>
                      ))}
                      {list.length > 2 && <span className="cal-more">+{list.length - 2}</span>}
                    </span>
                    <span className="cal-dots" aria-hidden>
                      {list.map((e) => (
                        <span key={e.slug} className={`cal-dot c-${e.category.toLowerCase()}`} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="cal-note">
              Markets and date-certain events appear on their days. Seasonal events change dates every year, so they are
              listed alongside. Confirm with the organizer before you plan.
            </p>
          </div>

          <aside className="cal-panel" aria-live="polite">
            {day && (
              <div className="cal-panel-block">
                <h3>{dayLabel}</h3>
                {selected.length ? (
                  <ul className="cal-list">
                    {selected.map((e) => (
                      <EventRow key={e.slug} e={e} month={month} />
                    ))}
                  </ul>
                ) : (
                  <p className="cal-empty">No date-specific events. See what is running this month below.</p>
                )}
              </div>
            )}
            <div className="cal-panel-block">
              <h3>Running in {MONTHS[month - 1]}</h3>
              {running.length ? (
                <ul className="cal-list">
                  {running.map((e) => (
                    <EventRow key={e.slug} e={e} month={month} />
                  ))}
                </ul>
              ) : (
                <p className="cal-empty">No seasonal events match your filters this month.</p>
              )}
              <Link href={`/events/${slugOf(month)}`} className="link-arrow">
                Things to do in Orlando in {MONTHS[month - 1]}
              </Link>
            </div>
          </aside>
        </div>
      ) : (
        <div className="cal-year">
          <div className="cal-year-scroll">
            <table className="cal-timeline">
              <thead>
                <tr>
                  <th scope="col" className="cal-tl-name">
                    Event
                  </th>
                  {SHORT.map((m, i) => (
                    <th key={m} scope="col" className={i + 1 === initialMonth ? "is-now" : undefined}>
                      <button
                        type="button"
                        onClick={() => {
                          setMonth(i + 1);
                          setYear(i + 1 < initialMonth ? initialYear + 1 : initialYear);
                          setDay(null);
                          setView("month");
                        }}
                        aria-label={`Open ${MONTHS[i]} in month view`}
                      >
                        {m}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible
                  .filter((e) => !e.weekly && e.months.length < 12)
                  .sort((a, b) => a.months[0] - b.months[0] || a.name.localeCompare(b.name))
                  .map((e) => (
                    <tr key={e.slug}>
                      <th scope="row" className="cal-tl-name">
                        <Link href={`/events/${slugOf(e.months[0])}#${e.slug}`}>{e.name}</Link>
                        <span>{e.timing}</span>
                      </th>
                      {SHORT.map((m, i) => {
                        const on = e.months.includes(i + 1);
                        const prev = e.months.includes(i === 0 ? 12 : i);
                        const next = e.months.includes(i === 11 ? 1 : i + 2);
                        return (
                          <td key={m} className={i + 1 === initialMonth ? "is-now" : undefined}>
                            {on && (
                              <span
                                className={`cal-bar c-${e.category.toLowerCase()}${prev && i > 0 ? " join-l" : ""}${next && i < 11 ? " join-r" : ""}`}
                                title={`${e.name}: ${e.timing}`}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="cal-note">
            Year-round events like rocket launches and weekly markets are not shown on the timeline. Click a month to open it.
          </p>
        </div>
      )}
    </div>
  );
}

function EventRow({ e, month }: { e: OrlandoEvent; month: number }) {
  return (
    <li className={`c-${e.category.toLowerCase()}`}>
      <span className="cal-dot" aria-hidden />
      <div>
        <Link href={`/events/${slugOf(month)}#${e.slug}`}>{e.name}</Link>
        <span>
          {e.timing} · {e.where}
        </span>
      </div>
    </li>
  );
}
