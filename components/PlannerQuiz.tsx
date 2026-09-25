"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HotelLink from "./HotelLink";
import ListingMedia from "./ListingMedia";
import { eventsForMonths, monthSlug } from "@/lib/events";
import type { CategoryKey, Listing } from "@/lib/types";

/* ---------------- Questions ---------------- */

type Answers = Record<string, string | string[]>;

interface Option {
  value: string;
  label: string;
  hint?: string;
}

interface Question {
  id: string;
  title: string;
  help?: string;
  multi?: boolean;
  /** Only ask when this returns true. */
  when?: (a: Answers) => boolean;
  options: Option[];
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const QUESTIONS: Question[] = [
  {
    id: "month",
    title: "When are you planning to visit?",
    help: "We use this for weather, crowds and events happening while you are here.",
    options: [...MONTH_NAMES.map((m, i) => ({ value: String(i + 1), label: m })), { value: "unsure", label: "Not sure yet" }],
  },
  {
    id: "length",
    title: "How long is your trip?",
    options: [
      { value: "short", label: "1 to 2 days" },
      { value: "medium", label: "3 to 4 days" },
      { value: "long", label: "5 to 7 days" },
      { value: "extended", label: "More than a week" },
    ],
  },
  {
    id: "experience",
    title: "Have you been to Orlando before?",
    options: [
      { value: "first", label: "First time", hint: "Show me the must-dos" },
      { value: "returning", label: "Been a few times", hint: "Show me something new" },
      { value: "local", label: "I live in Florida", hint: "Local gems and day trips" },
    ],
  },
  {
    id: "group",
    title: "Who are you traveling with?",
    options: [
      { value: "solo", label: "Just me" },
      { value: "couple", label: "My partner" },
      { value: "young-kids", label: "Family with young kids", hint: "Under 8" },
      { value: "older-kids", label: "Family with older kids or teens" },
      { value: "friends", label: "A group of friends" },
      { value: "multigen", label: "Grandparents and grandkids" },
    ],
  },
  {
    id: "parks",
    title: "Are theme parks on your list?",
    options: [
      { value: "yes", label: "Yes, we are doing the parks" },
      { value: "some", label: "Maybe one park day" },
      { value: "no", label: "No, skip the parks" },
    ],
  },
  {
    id: "interests",
    title: "What do you love to do on vacation?",
    help: "Pick as many as you like.",
    multi: true,
    options: [
      { value: "thrills", label: "Thrill rides and adrenaline" },
      { value: "nature", label: "Nature and wildlife" },
      { value: "water", label: "Water, boats and beaches" },
      { value: "space", label: "Space and science" },
      { value: "food", label: "Food and drink" },
      { value: "nightlife", label: "Nightlife" },
      { value: "shows", label: "Shows and entertainment" },
      { value: "relax", label: "Relaxing and slowing down" },
      { value: "history", label: "History and local culture" },
      { value: "adventure", label: "Outdoor adventure" },
      { value: "shopping", label: "Shopping" },
    ],
  },
  {
    id: "hobbies",
    title: "Any hobbies you want to fit in?",
    help: "Optional. Pick any that apply.",
    multi: true,
    options: [
      { value: "fishing", label: "Fishing" },
      { value: "golf", label: "Golf" },
      { value: "paddling", label: "Kayaking and paddleboarding" },
      { value: "biking", label: "Biking, hiking or horseback riding" },
      { value: "cooking", label: "Cooking and food tours" },
      { value: "art", label: "Art, crafts and museums" },
      { value: "gaming", label: "Games and escape rooms" },
      { value: "animals", label: "Animals" },
      { value: "photography", label: "Photography and views" },
    ],
  },
  {
    id: "pace",
    title: "What pace do you like?",
    options: [
      { value: "packed", label: "Pack it in", hint: "Full days, early starts" },
      { value: "balanced", label: "A good mix" },
      { value: "relaxed", label: "Keep it easy", hint: "Shorter activities, lots of downtime" },
    ],
  },
  {
    id: "budget",
    title: "What do you want to spend per person on an activity?",
    options: [
      { value: "50", label: "Under $50" },
      { value: "100", label: "$50 to $100" },
      { value: "200", label: "$100 to $200" },
      { value: "any", label: "Treat us, budget is flexible" },
    ],
  },
  {
    id: "car",
    title: "Will you have a car?",
    options: [
      { value: "yes", label: "Yes, we are driving or renting" },
      { value: "no", label: "No car", hint: "We will pick tours with pickup" },
    ],
  },
  {
    id: "hotel",
    title: "Do you need a place to stay?",
    options: [
      { value: "yes", label: "Yes, help me pick" },
      { value: "booked", label: "Already booked" },
      { value: "local", label: "No, I live nearby" },
    ],
  },
  {
    id: "area",
    title: "Where would you like to stay?",
    when: (a) => a.hotel === "yes",
    options: [
      { value: "disney", label: "Near Disney World" },
      { value: "universal", label: "Near Universal" },
      { value: "idrive", label: "International Drive", hint: "Central to everything" },
      { value: "kissimmee", label: "Kissimmee", hint: "Space for less money" },
      { value: "winter-park", label: "Winter Park or downtown", hint: "Restaurants and local feel" },
      { value: "beach", label: "At the beach", hint: "Cocoa Beach and the Space Coast" },
      { value: "luxury", label: "Somewhere luxurious" },
      { value: "unsure", label: "Not sure, recommend one" },
    ],
  },
];

/* ---------------- Matching ---------------- */

const NOT_A_TOUR = /transfer|shuttle|airport|private driver|chauffeur|transportation|\bMCO\b|ride in style|limo|discount card|male revue|burlesque|cruise port|to port\b|port to /i;

const INTERESTS: Record<string, { label: string; cats: CategoryKey[]; re: RegExp }> = {
  thrills: { label: "thrill rides", cats: [], re: /coaster|helicopter|zip ?line|skydiv|airboat|atv|dune buggy|tactical|race|jet ski|flight|slingshot/i },
  nature: { label: "nature and wildlife", cats: ["wildlife"], re: /manatee|(?<!disney )springs|eco|wildlife|gator|bird|horse|nature|swamp|everglades/i },
  water: { label: "the water", cats: ["water"], re: /kayak|paddle|snorkel|boat|beach|jet ski|pontoon|cruise|(?<!disney )springs/i },
  space: { label: "space and science", cats: ["space"], re: /kennedy|space|rocket|astronaut|science/i },
  food: { label: "food and drink", cats: ["food-and-dining"], re: /food|tasting|brunch|dinner|culinary|eats|charcuterie/i },
  nightlife: { label: "nightlife", cats: ["drinks-and-nightlife"], re: /pub|bar\b|brew|cocktail|night|crawl/i },
  shows: { label: "shows", cats: ["dinner-shows"], re: /show|theater|theatre|magic|cirque|comedy|blue man/i },
  relax: { label: "slowing down", cats: ["relaxation"], re: /spa|massage|sunset|cruise|garden|scenic/i },
  history: { label: "history and culture", cats: [], re: /histor|ghost|museum|augustine|audio tour|walking tour|heritage/i },
  adventure: { label: "outdoor adventure", cats: [], re: /zip|trek|atv|bike|kayak|paddle|trail|adventure|off-road/i },
  shopping: { label: "shopping", cats: ["shopping"], re: /shop|outlet|market/i },
};

const HOBBIES: Record<string, { label: string; re: RegExp }> = {
  fishing: { label: "fishing", re: /fishing|bass|charter/i },
  golf: { label: "golf", re: /golf/i },
  paddling: { label: "paddling", re: /kayak|paddle|canoe|\bsup\b/i },
  biking: { label: "biking and trails", re: /bike|hike|trail|horse/i },
  cooking: { label: "food tours", re: /cooking|food tour|tasting|culinary|eats/i },
  art: { label: "art and museums", re: /\bart\b|museum|workshop|glass|painting|exhibit/i },
  gaming: { label: "games", re: /escape|arcade|game|laser|tactical/i },
  animals: { label: "animals", re: /gator|dolphin|manatee|horse|wildlife|safari|aquarium|bird|farm/i },
  photography: { label: "great views", re: /photo|sunset|helicopter|balloon|orlando eye|wheel|flight/i },
};

const ADULT = /pub|bar\b|brew|crawl|cocktail|wine|beer|21\+|tactical|gun|shooting|drill/i;
const INTENSE = /tactical|atv|jet ski|dune buggy|skydiv|paintball|slingshot/i;
const FAR = /silver springs|rainbow springs|winter haven|clearwater|augustine|daytona|cocoa|kennedy|tampa|miami|palatka|sebring/i;
const PICKUP = /pickup|pick-up|transport|from orlando|round-?trip/i;
const PARK = /disney|universal|seaworld|legoland|peppa|aquatica|volcano bay|fun spot|water park|island h2o/i;

function activityKey(l: Listing): string {
  const keys: [string, RegExp][] = [
    ["kayak", /kayak|paddle|canoe/i],
    ["airboat", /airboat/i],
    ["air", /helicopter|flight|balloon/i],
    ["space", /kennedy|space/i],
    ["food", /food|tasting|culinary/i],
    ["ghost", /ghost/i],
    ["escape", /escape/i],
    ["fishing", /fishing|bass/i],
    ["tactical", /tactical|drill/i],
    ["ticket", /ticket|admission/i],
  ];
  return keys.find(([, re]) => re.test(l.title))?.[0] ?? l.categories[0] ?? "other";
}

function quality(l: Listing): number {
  const v = l.reviewCount ?? 0;
  const r = l.rating ?? 0;
  const m = 25;
  return (v / (v + m)) * r + (m / (v + m)) * 4.3 + Math.log10(v + 1) * 0.05;
}

interface PlanPick {
  listing: Listing;
  reasons: string[];
}

function recommend(all: Listing[], a: Answers): PlanPick[] {
  const interests = (a.interests as string[]) ?? [];
  const hobbies = (a.hobbies as string[]) ?? [];
  const month = a.month && a.month !== "unsure" ? Number(a.month) : null;
  const cap = a.budget === "any" ? Infinity : Number(a.budget) * 1.1;

  const scored: (PlanPick & { score: number })[] = [];
  for (const l of all) {
    if (l.source !== "viator" || NOT_A_TOUR.test(l.title) || !l.image || !l.priceFrom) continue;
    const t = l.title;
    const reasons: string[] = [];
    let score = quality(l) * 2;

    // Hard filters by group
    const isParkTicket = PARK.test(t) && /ticket|admission/i.test(t);
    if ((a.group === "young-kids" || a.group === "older-kids") && ADULT.test(t)) continue;
    if (a.group === "young-kids" && (INTENSE.test(t) || (!isParkTicket && (l.durationMinutes ?? 0) > 480))) continue;
    if (a.group === "multigen" && INTENSE.test(t)) continue;
    if (a.parks === "no" && isParkTicket) continue;

    // Budget
    if (l.priceFrom > cap) continue;
    if (a.budget !== "any") reasons.push(`Fits your budget, from $${Math.round(l.priceFrom)}`);

    // Interests
    for (const key of interests) {
      const it = INTERESTS[key];
      if (!it) continue;
      // Titles say what an experience is; broad category tags only nudge the score.
      if (it.re.test(t)) {
        score += 3;
        reasons.unshift(`Matches your love of ${it.label}`);
      } else if (l.categories.some((c) => it.cats.includes(c))) {
        score += 1;
      }
    }
    for (const key of hobbies) {
      const h = HOBBIES[key];
      if (h && h.re.test(t)) {
        score += 2.5;
        reasons.unshift(`Great for ${h.label}`);
      }
    }

    // Group
    if (a.group === "couple" && (l.categories.includes("couples") || /sunset|romantic|date|champagne|wine|dinner/i.test(t))) {
      score += 2;
      reasons.push("A favorite with couples");
    }
    if (a.group === "young-kids" && (l.categories.includes("family") || /kid|family|aquarium|legoland|peppa|crayola|science|farm/i.test(t))) {
      score += 2.5;
      reasons.push("Great with young kids");
    }
    if (a.group === "older-kids" && /escape|zip|trek|coaster|airboat|kayak|helicopter|ticket/i.test(t)) {
      score += 1.5;
      reasons.push("A hit with teens");
    }
    if (a.group === "friends" && /escape|pub|crawl|tactical|atv|kayak|glow|night/i.test(t)) {
      score += 1.5;
      reasons.push("Fun with a group");
    }
    if (a.group === "multigen" && /cruise|boat|scenic|show|garden|train|pontoon|historic/i.test(t)) {
      score += 1.5;
      reasons.push("Easy for every generation");
    }

    // Experience
    if (a.experience === "first" && ((l.reviewCount ?? 0) >= 500 || isParkTicket || /kennedy/i.test(t))) {
      score += 1.5;
      reasons.push("An Orlando must-do");
    }
    if (a.experience !== "first" && (l.rating ?? 0) >= 4.8 && (l.reviewCount ?? 0) >= 15 && (l.reviewCount ?? 0) <= 500) {
      score += 1.5;
      reasons.push("A local favorite many visitors miss");
    }
    if (a.experience !== "first" && isParkTicket) score -= 1;
    if (a.parks === "yes" && isParkTicket) score += 1.5;

    // Car
    if (a.car === "no" && FAR.test(t)) {
      if (PICKUP.test(t)) {
        score += 1;
        reasons.push("Includes transportation, no car needed");
      } else score -= 3;
    }

    // Pace and trip length
    const mins = isParkTicket ? 0 : (l.durationMinutes ?? 0);
    if (a.pace === "relaxed" && mins > 300) score -= 1.5;
    if ((a.length === "short" || a.pace === "relaxed") && mins > 480) score -= 2;
    if ((a.length === "long" || a.length === "extended") && mins >= 360) score += 0.5;

    // Season
    if (month && [6, 7, 8, 9].includes(month) && /kayak|paddle|snorkel|springs|boat|water|indoor|escape|aquarium/i.test(t)) score += 0.5;
    if (month && [11, 12, 1, 2, 3].includes(month) && /manatee/i.test(t)) {
      score += 1.5;
      reasons.push("Manatee season while you are here");
    }

    if ((l.rating ?? 0) >= 4.5 && (l.reviewCount ?? 0) >= 50) {
      reasons.push(`Rated ${l.rating!.toFixed(1)} by ${l.reviewCount!.toLocaleString("en-US")} travelers`);
    }
    scored.push({ listing: l, reasons: [...new Set(reasons)].slice(0, 3), score });
  }

  scored.sort((x, y) => y.score - x.score);
  const out: PlanPick[] = [];
  const perKey = new Map<string, number>();
  const perCat = new Map<string, number>();

  // Park-goers always get the best park tickets that fit the budget.
  if (a.parks === "yes") {
    const tickets = scored
      .filter((s) => PARK.test(s.listing.title) && /ticket|admission/i.test(s.listing.title))
      .sort((x, y) => (y.listing.reviewCount ?? 0) - (x.listing.reviewCount ?? 0))
      .slice(0, 2);
    for (const t of tickets) {
      if (!t.reasons.includes("Theme park day you asked for")) t.reasons.unshift("Theme park day you asked for");
      out.push(t);
      perKey.set("ticket", (perKey.get("ticket") ?? 0) + 1);
    }
  }
  const seenWords: Set<string>[] = [];
  const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3));
  for (const s of scored) {
    if (out.includes(s)) continue;
    const k = activityKey(s.listing);
    const cat = s.listing.categories[0] ?? "other";
    if ((perKey.get(k) ?? 0) >= 2 || (perCat.get(cat) ?? 0) >= 3) continue;
    const w = words(s.listing.title);
    if (seenWords.some((o) => [...w].filter((x) => o.has(x)).length / Math.min(w.size, o.size || 1) >= 0.7)) continue;
    perKey.set(k, (perKey.get(k) ?? 0) + 1);
    perCat.set(cat, (perCat.get(cat) ?? 0) + 1);
    seenWords.push(w);
    out.push(s);
    if (out.length >= 10) break;
  }
  return out;
}

const STAY: Record<string, { label: string; href: string }> = {
  disney: { label: "Hotels near Disney World", href: "/place-to-stay/hotels-near-disney-world" },
  universal: { label: "Luxury and premier hotels, including Universal's", href: "/place-to-stay/luxury-resort-hotels-in-orlando" },
  idrive: { label: "Hotels near the Convention Center on International Drive", href: "/place-to-stay/hotels-near-orange-county-convention-center" },
  kissimmee: { label: "Family hotels and vacation homes in Kissimmee", href: "/place-to-stay/family-hotels-in-orlando" },
  "winter-park": { label: "Hotels near downtown Winter Park", href: "/place-to-stay/hotels-near-downtown-winter-park" },
  beach: { label: "Hotels near Cocoa Beach", href: "/place-to-stay/hotels-near-cocoa-beach" },
  luxury: { label: "Luxury resort hotels in Orlando", href: "/place-to-stay/luxury-resort-hotels-in-orlando" },
};

function stayFor(a: Answers) {
  if (a.area && a.area !== "unsure") return STAY[a.area as string];
  if (a.group === "young-kids" || a.group === "older-kids" || a.group === "multigen") return STAY.kissimmee;
  if (a.group === "couple") return a.budget === "any" ? STAY.luxury : STAY["winter-park"];
  if (a.parks === "yes") return STAY.disney;
  return STAY.idrive;
}

/* ---------------- Component ---------------- */

const STORAGE_KEY = "ttdo-planner";

export default function PlannerQuiz() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [catalog, setCatalog] = useState<Listing[] | null>(null);
  const [error, setError] = useState(false);

  const questions = useMemo(() => QUESTIONS.filter((q) => !q.when || q.when(answers)), [answers]);
  const q = questions[Math.min(step, questions.length - 1)];

  // Restore a previous plan.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Answers;
        if (parsed.group) {
          // A saved plan from an earlier visit opens straight to the results.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAnswers(parsed);
          setDone(true);
        }
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Load the catalog in the background while the visitor answers.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/listings")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Listing[]) => !cancelled && setCatalog(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const value = answers[q?.id];
  const answered = q?.multi ? true : !!value;

  const choose = (opt: string) => {
    if (q.multi) {
      const cur = (answers[q.id] as string[]) ?? [];
      setAnswers({ ...answers, [q.id]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] });
    } else {
      setAnswers({ ...answers, [q.id]: opt });
      // Single-choice questions advance automatically.
      window.setTimeout(() => next({ ...answers, [q.id]: opt }), 180);
    }
  };

  const next = (a: Answers = answers) => {
    const qs = QUESTIONS.filter((x) => !x.when || x.when(a));
    if (step >= qs.length - 1) finish(a);
    else setStep(step + 1);
  };

  const finish = (a: Answers) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    } catch {
      /* storage unavailable */
    }
    window.gtag?.("event", "planner_complete", { group: String(a.group ?? ""), month: String(a.month ?? "") });
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  if (done) {
    const picks = catalog ? recommend(catalog, answers) : [];
    const month = answers.month && answers.month !== "unsure" ? Number(answers.month) : null;
    const events = month ? eventsForMonths([month]).slice(0, 4) : [];
    const stay = answers.hotel === "yes" ? stayFor(answers) : null;
    return (
      <div className="planner-results">
        <div className="planner-results-head">
          <h2>Your 10 best things to do in Orlando</h2>
          <p>
            Hand-picked from real, bookable experiences based on your answers
            {month ? `, for a trip in ${MONTH_NAMES[month - 1]}` : ""}. Tap any pick to see details, reviews and live
            prices.
          </p>
          <button type="button" className="btn btn-outline btn-sm" onClick={restart}>
            Start over
          </button>
        </div>

        {!catalog && !error && <p className="planner-loading">Building your list...</p>}
        {error && (
          <p className="planner-loading">
            We could not load experiences right now. <Link href="/book-now">Browse all tours</Link> instead.
          </p>
        )}
        {catalog && picks.length === 0 && (
          <p className="planner-loading">
            Nothing matched every answer. Try a bigger budget or fewer filters, or <Link href="/book-now">browse all tours</Link>.
          </p>
        )}

        <ol className="planner-picks">
          {picks.map((p, i) => (
            <li key={p.listing.slug} className="planner-pick">
              <Link href={`/book-now/${p.listing.slug}`} className="planner-pick-media">
                <span className="rank-num" aria-hidden>
                  {i + 1}
                </span>
                <ListingMedia listing={p.listing} sizes="(max-width: 640px) 100vw, 260px" />
              </Link>
              <div className="planner-pick-body">
                <h3>
                  <Link href={`/book-now/${p.listing.slug}`}>{p.listing.title}</Link>
                </h3>
                <p className="planner-pick-meta">
                  {p.listing.rating ? `${p.listing.rating.toFixed(1)} stars` : "New"}
                  {p.listing.reviewCount ? ` · ${p.listing.reviewCount.toLocaleString("en-US")} reviews` : ""}
                  {p.listing.durationLabel ? ` · ${p.listing.durationLabel}` : ""}
                  {p.listing.priceFrom ? ` · from $${p.listing.priceFrom.toFixed(0)}` : ""}
                </p>
                <ul className="planner-reasons">
                  {p.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <Link href={`/book-now/${p.listing.slug}`} className="btn btn-primary btn-sm">
                  See details and prices
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <div className="planner-extras">
          {stay && (
            <div className="planner-extra">
              <h3>Where to stay</h3>
              <p>Based on your answers, start here:</p>
              <p>
                <Link href={stay.href}>{stay.label}</Link>
              </p>
              <HotelLink className="btn btn-outline btn-sm">Check hotel prices</HotelLink>
            </div>
          )}
          {events.length > 0 && month && (
            <div className="planner-extra">
              <h3>Happening in {MONTH_NAMES[month - 1]}</h3>
              <ul>
                {events.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/events/${monthSlug(month)}#${e.slug}`}>{e.name}</Link>
                  </li>
                ))}
              </ul>
              <Link href={`/events/${monthSlug(month)}`}>Everything on in {MONTH_NAMES[month - 1]}</Link>
            </div>
          )}
          <div className="planner-extra">
            <h3>Keep planning</h3>
            <ul>
              <li>
                <Link href="/blog/top-10-things-to-do-in-orlando-florida">Top 10 things to do in Orlando</Link>
              </li>
              {answers.parks !== "no" && (
                <li>
                  <Link href="/blog/best-theme-parks-in-orlando">Best theme parks in Orlando</Link>
                </li>
              )}
              <li>
                <Link href="/blog/best-time-to-visit-orlando">Best time to visit Orlando</Link>
              </li>
              <li>
                <Link href="/book-now">Browse every tour and event</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round((step / questions.length) * 100);
  return (
    <div className="planner">
      <div className="planner-progress" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="planner-step">
        Question {step + 1} of {questions.length}
      </p>
      <fieldset className="planner-q">
        <legend>{q.title}</legend>
        {q.help && <p className="planner-help">{q.help}</p>}
        <div className={`planner-options${q.options.length > 8 ? " is-dense" : ""}`}>
          {q.options.map((o) => {
            const selected = q.multi ? ((value as string[]) ?? []).includes(o.value) : value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                className="planner-option"
                aria-pressed={selected}
                onClick={() => choose(o.value)}
              >
                <strong>{o.label}</strong>
                {o.hint && <span>{o.hint}</span>}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="planner-nav">
        <button type="button" className="btn btn-outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Back
        </button>
        {q.multi && (
          <button type="button" className="btn btn-primary" onClick={() => next()} disabled={!answered}>
            {step >= questions.length - 1 ? "See my list" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
