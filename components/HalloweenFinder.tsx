"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HALLOWEEN_CATEGORIES, type HalloweenCategory, type HalloweenEvent } from "@/data/halloween-2026";
import { orlandoTodayIso } from "@/lib/travel-date";

type Who = "all" | "kids" | "teens" | "adults";

const WHO: { key: Who; label: string }[] = [
  { key: "all", label: "Everyone" },
  { key: "kids", label: "Good for kids" },
  { key: "teens", label: "Teens" },
  { key: "adults", label: "Adults only" },
];

function fitsWho(e: HalloweenEvent, who: Who) {
  if (who === "all") return true;
  if (who === "kids") return e.audience === "All ages" || e.audience === "Little kids";
  if (who === "teens") return e.audience === "All ages" || e.audience === "Teens and up";
  return e.audience === "Adults 18+" || e.audience === "Adults 21+" || e.audience === "Teens and up";
}

function Scare({ level }: { level: number }) {
  return (
    <span className="hw-scare" aria-label={`Scare level ${level} out of 5`}>
      <span className="hw-scare-bar" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= level ? "on" : undefined} />
        ))}
      </span>
      {level === 0 ? "Not scary" : `Scare ${level}/5`}
    </span>
  );
}

/** Filterable list of every Halloween event in the guide. */
export default function HalloweenFinder({ events }: { events: HalloweenEvent[] }) {
  const [cat, setCat] = useState<HalloweenCategory | "all">("all");
  const [who, setWho] = useState<Who>("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [maxScare, setMaxScare] = useState(5);
  const [nowOnly, setNowOnly] = useState(false);
  const [shown, setShown] = useState({ key: "", n: 15 });
  const today = orlandoTodayIso();

  const isOn = (e: HalloweenEvent) => !e.start || !e.end || (e.start <= today && today <= e.end);

  const list = useMemo(
    () =>
      events
        .filter(
          (e) =>
            (cat === "all" || e.category === cat) &&
            fitsWho(e, who) &&
            (!freeOnly || e.cost === "Free" || e.cost === "Included with admission") &&
            e.scare <= maxScare &&
            (!nowOnly || isOn(e)),
        )
        .sort((a, b) => (a.start ?? "9999").localeCompare(b.start ?? "9999")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, cat, who, freeOnly, maxScare, nowOnly, today],
  );

  const filterKey = `${cat}|${who}|${freeOnly}|${maxScare}|${nowOnly}`;
  const visible = shown.key === filterKey ? shown.n : 15;

  return (
    <div className="hw-finder">
      <div className="hw-filters">
        <div className="hw-tabs" role="tablist" aria-label="Event type">
          <button type="button" role="tab" aria-selected={cat === "all"} onClick={() => setCat("all")}>
            All events
          </button>
          {HALLOWEEN_CATEGORIES.map((c) => (
            <button key={c.key} type="button" role="tab" aria-selected={cat === c.key} onClick={() => setCat(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="hw-row">
          <div className="hw-chips" aria-label="Who is going">
            {WHO.map((w) => (
              <button key={w.key} type="button" aria-pressed={who === w.key} onClick={() => setWho(w.key)}>
                {w.label}
              </button>
            ))}
          </div>
          <label className="hw-range">
            Max scare level: <strong>{maxScare === 0 ? "Not scary" : `${maxScare}/5`}</strong>
            <input type="range" min={0} max={5} value={maxScare} onChange={(e) => setMaxScare(Number(e.target.value))} />
          </label>
          <label className="hw-check">
            <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} />
            Free or included with admission
          </label>
          <label className="hw-check">
            <input type="checkbox" checked={nowOnly} onChange={(e) => setNowOnly(e.target.checked)} />
            Happening now
          </label>
        </div>
      </div>

      <p className="hw-count" aria-live="polite">
        {list.length} {list.length === 1 ? "event" : "events"}
      </p>

      <ul className="hw-list">
        {list.slice(0, visible).map((e) => (
          <li key={e.name} className="hw-card">
            <div className="hw-card-head">
              <h4>{e.href ? <Link href={e.href}>{e.name}</Link> : e.name}</h4>
              {e.start && isOn(e) && <span className="hw-now">On now</span>}
            </div>
            <p className="hw-meta">
              <strong>{e.dates}</strong> · {e.where}
            </p>
            <p className="hw-blurb">{e.blurb}</p>
            <div className="hw-tags">
              <span className="hw-tag">{e.audience}</span>
              <span className={`hw-tag${e.cost === "Free" ? " is-free" : ""}`}>{e.cost}</span>
              <Scare level={e.scare} />
            </div>
          </li>
        ))}
      </ul>
      {list.length > visible && (
        <button type="button" className="btn btn-outline btn-block" style={{ marginTop: 14 }} onClick={() => setShown({ key: filterKey, n: visible + 20 })}>
          Show more ({list.length - visible} left)
        </button>
      )}
      {list.length === 0 && <p className="hw-count">No events match those filters. Try widening them.</p>}
      <p className="hw-note">
        Dates are as announced by organizers and can change. Scare levels are our own rating. Always confirm details and
        buy tickets from the official source.
      </p>
    </div>
  );
}
