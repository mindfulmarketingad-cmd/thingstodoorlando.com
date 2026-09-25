"use client";

import { useEffect } from "react";
import { orlandoTodayIso, setTravelDate } from "@/lib/travel-date";

/** On the "today" page, booking links should always carry today's date. */
export default function UseTodayDate() {
  useEffect(() => {
    setTravelDate(orlandoTodayIso());
  }, []);
  return null;
}
