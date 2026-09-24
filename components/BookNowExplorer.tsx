"use client";

import { useEffect, useMemo, useState } from "react";
import ListingCard from "./ListingCard";
import { categories } from "@/lib/categories";
import { score } from "@/lib/score";
import type { CategoryKey, Listing } from "@/lib/types";

type SortKey = "recommended" | "rating" | "reviews" | "price-asc" | "price-desc" | "duration";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest rated" },
  { value: "reviews", label: "Most reviewed" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "duration", label: "Duration: shortest" },
];

const PRICES = [
  { value: "", label: "Any price" },
  { value: "50", label: "Under $50" },
  { value: "100", label: "Under $100" },
  { value: "200", label: "Under $200" },
];

const DURATIONS = [
  { value: "", label: "Any length" },
  { value: "short", label: "Under 2 hours" },
  { value: "half", label: "2 to 5 hours" },
  { value: "full", label: "5 hours or more" },
];

const PAGE = 24;

interface Filters {
  category: CategoryKey | "";
  price: string;
  rating: string;
  duration: string;
  freeCancel: boolean;
  keyword: string;
  sort: SortKey;
}

export default function BookNowExplorer({
  initial,
  total,
  lockedCategory,
}: {
  initial: Listing[];
  total: number;
  lockedCategory?: CategoryKey;
}) {
  const [listings, setListings] = useState<Listing[]>(initial);
  const [loaded, setLoaded] = useState(initial.length >= total);
  const defaults: Filters = {
    category: lockedCategory ?? "",
    price: "",
    rating: "",
    duration: "",
    freeCancel: false,
    keyword: "",
    sort: "recommended",
  };
  const [filters, setFilters] = useState<Filters>(defaults);
  const { category, price, rating, duration, freeCancel, keyword, sort } = filters;
  const update = <K extends keyof Filters>(key: K) => (value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const setCategory = update("category");
  const setPrice = update("price");
  const setRating = update("rating");
  const setDuration = update("duration");
  const setFreeCancel = update("freeCancel");
  const setKeyword = update("keyword");
  const setSort = update("sort");

  // Pagination resets whenever the filters change, without an extra effect.
  const filterKey = JSON.stringify(filters);
  const [page, setPage] = useState({ key: filterKey, n: PAGE });
  const visible = page.key === filterKey ? page.n : PAGE;

  const hasPrices = listings.some((l) => l.priceFrom);
  const hasRatings = listings.some((l) => l.rating);

  // Load the full catalog after first paint; the server already rendered the first page.
  useEffect(() => {
    if (loaded) return;
    let cancelled = false;
    fetch("/api/listings")
      .then((r) => (r.ok ? (r.json() as Promise<Listing[]>) : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        setListings(lockedCategory ? data.filter((l) => l.categories.includes(lockedCategory)) : data);
        setLoaded(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [loaded, lockedCategory]);

  // Restore filters from the URL (shareable links) once on mount.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (![...p.keys()].length) return;
    const c = p.get("category") ?? "";
    const s = p.get("sort") ?? "";
    const pr = p.get("price") ?? "";
    const d = p.get("duration") ?? "";
    const r = p.get("rating") ?? "";
    // Syncing from an external source (the URL) once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters((prev) => ({
      ...prev,
      category: !lockedCategory && categories.some((x) => x.key === c) ? (c as CategoryKey) : prev.category,
      sort: SORTS.some((x) => x.value === s) ? (s as SortKey) : prev.sort,
      price: PRICES.some((x) => x.value === pr) ? pr : prev.price,
      duration: DURATIONS.some((x) => x.value === d) ? d : prev.duration,
      rating: r === "4" || r === "4.5" ? r : prev.rating,
      freeCancel: p.get("free") === "1",
    }));
  }, [lockedCategory]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (category && !lockedCategory) p.set("category", category);
    if (sort !== "recommended") p.set("sort", sort);
    if (price) p.set("price", price);
    if (duration) p.set("duration", duration);
    if (rating) p.set("rating", rating);
    if (freeCancel) p.set("free", "1");
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [category, sort, price, duration, rating, freeCancel, lockedCategory]);

  const results = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const filtered = listings.filter((l) => {
      if (category && !l.categories.includes(category)) return false;
      if (price && !(l.priceFrom && l.priceFrom < Number(price))) return false;
      if (rating && !(l.rating && l.rating >= Number(rating))) return false;
      if (freeCancel && !l.freeCancellation) return false;
      if (duration) {
        const m = l.durationMinutes;
        if (!m) return false;
        if (duration === "short" && m >= 120) return false;
        if (duration === "half" && (m < 120 || m > 300)) return false;
        if (duration === "full" && m < 300) return false;
      }
      if (kw && !`${l.title} ${l.summary} ${l.location}`.toLowerCase().includes(kw)) return false;
      return true;
    });
    const missingLast = (v: number | undefined, dir: 1 | -1) => (v === undefined ? Infinity : v * dir);
    const sorted = [...filtered];
    switch (sort) {
      case "rating":
        sorted.sort((a, b) => missingLast(a.rating, -1) - missingLast(b.rating, -1));
        break;
      case "reviews":
        sorted.sort((a, b) => missingLast(a.reviewCount, -1) - missingLast(b.reviewCount, -1));
        break;
      case "price-asc":
        sorted.sort((a, b) => missingLast(a.priceFrom, 1) - missingLast(b.priceFrom, 1));
        break;
      case "price-desc":
        sorted.sort((a, b) => missingLast(a.priceFrom, -1) - missingLast(b.priceFrom, -1));
        break;
      case "duration":
        sorted.sort((a, b) => missingLast(a.durationMinutes, 1) - missingLast(b.durationMinutes, 1));
        break;
      default:
        // Expert guides first, then live tours by popularity.
        sorted.sort((a, b) => (a.source === b.source ? score(b) - score(a) : a.source === "guide" ? -1 : 1));
    }
    return sorted;
  }, [listings, category, price, rating, duration, freeCancel, keyword, sort]);

  const filtersActive = !!(price || rating || duration || freeCancel || keyword.trim() || (category && !lockedCategory));
  const count = loaded || filtersActive ? results.length : total;

  const reset = () => setFilters(defaults);

  return (
    <div className="explorer">
      <aside className="filters" aria-label="Filter experiences">
        <div className="field">
          <label htmlFor="kw">Keyword</label>
          <input
            id="kw"
            type="search"
            value={keyword}
            maxLength={60}
            placeholder="e.g. gator, sunset, Disney"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        {!lockedCategory && (
        <fieldset>
          <legend>Category</legend>
          <div className="chip-list">
            <button type="button" className="chip" aria-pressed={category === ""} onClick={() => setCategory("")}>
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                className="chip"
                aria-pressed={category === c.key}
                onClick={() => setCategory(c.key)}
              >
                {c.shortName}
              </button>
            ))}
          </div>
        </fieldset>
        )}
        {hasPrices && (
          <div className="field">
            <label htmlFor="price">Price</label>
            <select id="price" value={price} onChange={(e) => setPrice(e.target.value)}>
              {PRICES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )}
        {hasRatings && (
          <div className="field">
            <label htmlFor="rating">Traveler rating</label>
            <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">Any rating</option>
              <option value="4">4.0 and up</option>
              <option value="4.5">4.5 and up</option>
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor="duration">Duration</label>
          <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
            {DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        {hasPrices && (
          <label className="check-row">
            <input type="checkbox" checked={freeCancel} onChange={(e) => setFreeCancel(e.target.checked)} />
            Free cancellation only
          </label>
        )}
        <button type="button" className="btn btn-outline btn-block" style={{ marginTop: 12 }} onClick={reset}>
          Reset filters
        </button>
      </aside>

      <div>
        <div className="toolbar">
          <p className="result-count" aria-live="polite">
            {count.toLocaleString("en-US")} {count === 1 ? "experience" : "experiences"} found
          </p>
          <div className="field">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {SORTS.filter((s) => hasPrices || !s.value.startsWith("price"))
                .filter((s) => hasRatings || (s.value !== "rating" && s.value !== "reviews"))
                .map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {results.length ? (
          <>
            <div className="card-grid">
              {results.slice(0, visible).map((l) => (
                <ListingCard key={l.slug} listing={l} headingLevel={2} />
              ))}
            </div>
            {(visible < results.length || (!loaded && total > results.length)) && (
              <p className="center mt-lg">
                <button type="button" className="btn btn-outline btn-lg" onClick={() => setPage({ key: filterKey, n: visible + PAGE })}>
                  Show more{loaded ? ` (${(results.length - visible).toLocaleString("en-US")} left)` : ""}
                </button>
              </p>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No experiences match those filters.</p>
            <button type="button" className="btn btn-primary" onClick={reset}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
