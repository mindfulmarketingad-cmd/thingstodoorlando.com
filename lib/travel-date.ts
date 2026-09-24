"use client";

import { useSyncExternalStore } from "react";

/**
 * The visitor's chosen travel date, shared by every date picker and booking
 * button. Defaults to today in Orlando's time zone, persists in
 * localStorage, and never goes into the past.
 */
const KEY = "ttdo-travel-date";
const EVENT = "ttdo-travel-date-change";
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function orlandoTodayIso(): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function read(): string {
  const today = orlandoTodayIso();
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("date");
    const stored = fromUrl && ISO.test(fromUrl) ? fromUrl : localStorage.getItem(KEY);
    return stored && ISO.test(stored) && stored >= today ? stored : today;
  } catch {
    return today;
  }
}

export function setTravelDate(date: string) {
  if (!ISO.test(date)) return;
  try {
    localStorage.setItem(KEY, date);
  } catch {
    /* storage unavailable: the date still applies for this page view */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: date }));
}

let current: string | null = null;
function subscribe(cb: () => void) {
  const handler = (e: Event) => {
    current = (e as CustomEvent<string>).detail ?? read();
    cb();
  };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot() {
  if (current === null) current = read();
  return current;
}

/** "" during server render; the real date after hydration. */
export function useTravelDate(): string {
  return useSyncExternalStore(subscribe, getSnapshot, () => "");
}

export function formatTravelDate(iso: string): string {
  if (!ISO.test(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Adds the travel date to Viator links (start and end on the same day). */
export function withTravelDate(href: string, date: string): string {
  if (!date) return href;
  try {
    const u = new URL(href);
    if (!/(^|\.)viator\.com$/.test(u.hostname)) return href;
    u.searchParams.set("startDate", date);
    u.searchParams.set("endDate", date);
    return u.toString();
  } catch {
    return href;
  }
}
