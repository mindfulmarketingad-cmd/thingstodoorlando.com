import Link from "next/link";
import { MONTHS, monthSlug } from "@/data/events";
import { eventsForMonths, orlandoToday } from "@/lib/events";

/** This month's and next month's Orlando events, computed in Orlando's time zone at render time. */
export default function MonthEvents({ exclude }: { exclude?: RegExp }) {
  const { month } = orlandoToday();
  const months = [month, (month % 12) + 1];
  return (
    <div className="month-events">
      {months.map((m) => {
        const list = eventsForMonths([m]).filter((e) => !exclude || !exclude.test(`${e.name} ${e.description}`));
        return (
          <section key={m} className="month-events-col" aria-label={`${MONTHS[m - 1]} events`}>
            <h3 className="month-events-head">{m === month ? "This month" : "Next month"}: {MONTHS[m - 1]}</h3>
            {list.length ? (
              <ul>
                {list.slice(0, 6).map((e) => (
                  <li key={e.slug}>
                    <strong>{e.name}</strong>
                    <span>{e.timing}</span>
                    <span>{e.where}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No major recurring events this month. Check the full calendar for one-off events.</p>
            )}
            <Link href={`/events/${monthSlug(m)}`}>All {MONTHS[m - 1]} events →</Link>
          </section>
        );
      })}
    </div>
  );
}
