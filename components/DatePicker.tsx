"use client";

import { useId } from "react";
import { CalendarIcon } from "./Icons";
import { orlandoTodayIso, setTravelDate, useTravelDate } from "@/lib/travel-date";

/** Travel date input; defaults to today and cannot go into the past. */
export default function DatePicker({
  label = "Travel date",
  variant = "field",
}: {
  label?: string;
  variant?: "field" | "inline" | "hero";
}) {
  const id = useId();
  const date = useTravelDate();
  const today = date ? orlandoTodayIso() : undefined;
  return (
    <div className={`date-picker is-${variant}`}>
      <label htmlFor={id}>
        <CalendarIcon size={16} />
        <span>{label}</span>
      </label>
      <input
        id={id}
        type="date"
        value={date}
        min={today}
        onChange={(e) => setTravelDate(e.target.value)}
        aria-describedby={`${id}-hint`}
      />
      <span id={`${id}-hint`} className="sr-only">
        Availability for your date is confirmed on the booking page.
      </span>
    </div>
  );
}
