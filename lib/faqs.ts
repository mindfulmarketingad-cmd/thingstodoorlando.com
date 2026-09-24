import type { Category } from "./categories";
import type { CategoryKey, Listing, ListingDetail } from "./types";

/**
 * FAQ content for /book-now pages. Answers combine hand-written guidance
 * with facts computed from the Viator snapshot, so they stay accurate as
 * prices and ratings change.
 */
export type Faq = { q: string; a: string };

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);

function median(xs: number[]): number | undefined {
  if (!xs.length) return undefined;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/** Prices from reviewed products, so one unreviewed $5 add-on cannot set the "from" price. */
function reviewedPrices(items: Listing[]): number[] {
  const reviewed = items.filter((l) => l.priceFrom && (l.reviewCount ?? 0) > 0).map((l) => l.priceFrom!);
  return reviewed.length >= 3 ? reviewed : items.map((l) => l.priceFrom).filter((p): p is number => !!p);
}

function percentile(xs: number[], p: number): number {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.round((p / 100) * (s.length - 1))))];
}

/** "most options run $X to $Y" phrasing that one outlier cannot skew. */
function priceRange(prices: number[]): string {
  const lo = Math.floor(percentile(prices, 10));
  const hi = Math.ceil(percentile(prices, 90));
  return `most options start between ${usd(lo)} and ${usd(hi)} per person, with a typical starting price of about ${usd(Math.round(median(prices)!))}`;
}

function humanMinutes(m: number): string {
  if (m >= 1440) return `${Math.round(m / 1440)} day${m >= 2880 ? "s" : ""}`;
  if (m < 60) return `${m} minutes`;
  const h = Math.round((m / 60) * 2) / 2;
  return `${h} hour${h === 1 ? "" : "s"}`;
}

function topRated(items: Listing[]): Listing | undefined {
  const score = (l: Listing) => {
    const v = l.reviewCount ?? 0;
    return (v / (v + 25)) * (l.rating ?? 0) + (25 / (v + 25)) * 4.4;
  };
  return [...items].filter((l) => l.rating && (l.reviewCount ?? 0) >= 10).sort((a, b) => score(b) - score(a))[0];
}

/** Booking questions shared by every /book-now page. */
const bookingFaqs: Faq[] = [
  {
    q: "How do I book a tour on ThingsToDoOrlando.com?",
    a: "Choose an experience, then select Check availability. You will be taken to Viator, a Tripadvisor company, where you pick a date, see the final price and pay securely. Your confirmation and tickets come from Viator by email.",
  },
  {
    q: "Is it safe to book through this site?",
    a: "Yes. We never handle payments. Every booking is completed on Viator's secure checkout, which shows verified traveler reviews and the cancellation policy before you pay, and Viator provides customer support for your booking.",
  },
  {
    q: "Do I pay more by booking through ThingsToDoOrlando.com?",
    a: "No. You pay the same price as booking directly with Viator. We may earn a small commission, which helps keep our guides free.",
  },
];

export function hubFaqs(all: Listing[]): Faq[] {
  const prices = reviewedPrices(all);
  const free = all.filter((l) => l.freeCancellation).length;
  const best = topRated(all);
  return [
    {
      q: "How many tours and activities can I book in Orlando?",
      a: `We list ${all.length.toLocaleString("en-US")} bookable tours, tickets and experiences in and around Orlando, Florida, from theme park tickets and airboat rides to dinner shows, kayak trips and day trips. Use the filters to narrow them down by category, price, rating and length.`,
    },
    ...(prices.length
      ? [
          {
            q: "How much do Orlando tours cost?",
            a: `Across Orlando, ${priceRange(prices)}. Short activities like airboat rides and walking tours cost less, while full-day trips, private tours and theme park tickets cost more.`,
          },
        ]
      : []),
    ...(best
      ? [
          {
            q: "What is the highest-rated thing to do in Orlando?",
            a: `Based on traveler ratings and review volume, one of the top-rated experiences right now is ${best.title}, rated ${best.rating!.toFixed(1)} out of 5 from ${best.reviewCount!.toLocaleString("en-US")} reviews. See our ranked list of the top things to do in Orlando for more.`,
          },
        ]
      : []),
    ...(free
      ? [
          {
            q: "Can I cancel my booking?",
            a: `${free.toLocaleString("en-US")} of the experiences we list offer free cancellation, usually up to 24 hours before the start time. The exact policy for each tour is shown on the booking page before you pay.`,
          },
        ]
      : []),
    ...bookingFaqs,
  ];
}

/** Hand-written, category-specific questions. */
const categoryExtras: Record<CategoryKey, Faq[]> = {
  family: [
    {
      q: "What are the best things to do in Orlando with toddlers?",
      a: "Short, shaded activities work best: wildlife parks, boat rides, magic shows and LEGOLAND Florida, which is built for kids ages 2 to 12. Look for tours under two hours with flexible cancellation.",
    },
    {
      q: "Do Orlando tours offer child pricing?",
      a: "Many do. Operators often price children and infants separately, and some let very young kids join free. Select the correct ages when you check availability to see the right price.",
    },
  ],
  couples: [
    {
      q: "What is the most romantic thing to do in Orlando?",
      a: "Sunrise hot air balloon flights, sunset kayak and boat tours, night helicopter rides over the fireworks and dinner shows are the most popular date ideas in Orlando.",
    },
    {
      q: "Are there private tours for couples in Orlando?",
      a: "Yes. Many kayak, boat, helicopter and photography experiences offer private options for just the two of you. Look for Private in the tour name or check the options on the booking page.",
    },
  ],
  "theme-parks": [
    {
      q: "Are theme park tickets cheaper on certain days?",
      a: "Yes. Walt Disney World and Universal use date-based pricing, so weekdays outside school holidays are usually cheaper. Multi-day tickets also lower the cost per day.",
    },
    {
      q: "Is it safe to buy Orlando theme park tickets online?",
      a: "Buy only from authorized sellers and read what each ticket includes, such as park reservations, park-to-park access and parking. Resold or partially used tickets are often invalid.",
    },
  ],
  space: [
    {
      q: "How far is Kennedy Space Center from Orlando?",
      a: "The Kennedy Space Center Visitor Complex is about an hour east of Orlando by car. Tours with round-trip transportation save you the drive, tolls and parking.",
    },
    {
      q: "Can I see a rocket launch on a tour?",
      a: "Some tours include launch viewing when a launch is scheduled. Launch dates change often because of weather and technical checks, so choose options with free cancellation.",
    },
  ],
  wildlife: [
    {
      q: "Will I see alligators on an Orlando airboat tour?",
      a: "Alligator sightings are very common on airboat tours around Kissimmee and Lake Tohopekaliga, especially on sunny days, but wildlife is never guaranteed.",
    },
    {
      q: "When is the best time to see manatees near Orlando?",
      a: "From roughly November through March, when manatees gather in warm spring-fed rivers such as Blue Spring, Silver Springs and Crystal River.",
    },
  ],
  "dinner-shows": [
    {
      q: "What is included with a dinner show ticket?",
      a: "Most tickets include a set menu and soft drinks. Alcohol, seating upgrades, tax and gratuity are often extra, so check the inclusions on the booking page.",
    },
    {
      q: "Are Orlando dinner shows good for kids?",
      a: "Luaus, magic shows and themed dinner theaters are very family friendly. Murder mystery, comedy and cabaret-style shows are better for adults and teens.",
    },
  ],
  water: [
    {
      q: "Do I need experience for a kayak or paddleboard tour?",
      a: "Most guided tours near Orlando are designed for beginners, with calm water and a safety briefing. Check each listing for minimum ages and swimming requirements.",
    },
    {
      q: "What should I bring on an Orlando water tour?",
      a: "Sunscreen, water shoes, a hat, drinking water and a dry bag or waterproof pouch for your phone.",
    },
  ],
  sky: [
    {
      q: "Are hot air balloon and helicopter tours weather dependent?",
      a: "Yes. Operators reschedule or refund flights when wind, rain or storms make flying unsafe, which is why morning flights and free cancellation are popular.",
    },
    {
      q: "When is the best time for an Orlando helicopter tour?",
      a: "Sunset and evening flights are popular for city lights and theme park fireworks. Daytime flights give the clearest views of lakes and landmarks.",
    },
  ],
  "day-trips": [
    {
      q: "Do day trips from Orlando include hotel pickup?",
      a: "Many do, especially from International Drive, Lake Buena Vista and Kissimmee. The pickup details for each tour are listed on the booking page.",
    },
    {
      q: "What are the most popular day trips from Orlando?",
      a: "Kennedy Space Center, St. Augustine, Clearwater Beach, Crystal River for manatees and the Everglades are the most requested day trips.",
    },
  ],
  "food-and-city": [
    {
      q: "Where are the best food tours in Orlando?",
      a: "Downtown Orlando, the Mills 50 and Milk District neighborhoods, Ivanhoe Village and Winter Park are the most popular areas for food and walking tours.",
    },
    {
      q: "Can food tours handle dietary restrictions?",
      a: "Most can with advance notice. Add dietary needs when you book or contact the operator using the details in your confirmation.",
    },
  ],
  sightseeing: [
    {
      q: "What sightseeing is there in Orlando besides theme parks?",
      a: "Downtown history and ghost tours, Winter Park, Lake Eola Park, scenic boat tours, helicopter flights and nearby springs are all great ways to see the area.",
    },
    {
      q: "Are Orlando attraction passes worth it?",
      a: "If you plan to visit several paid attractions in a short time, multi-attraction passes can save money. Compare the included attractions with what you actually want to see.",
    },
  ],
};

export function categoryFaqs(category: Category, items: Listing[]): Faq[] {
  const label = `${category.label.toLowerCase()} tours and events`;
  const prices = reviewedPrices(items);
  const mins = items.map((l) => l.durationMinutes).filter((m): m is number => !!m);
  const free = items.filter((l) => l.freeCancellation).length;
  const best = topRated(items);
  const faqs: Faq[] = [];
  if (prices.length) {
    faqs.push({
      q: `How much do ${label} in Orlando cost?`,
      a: `For ${category.label.toLowerCase()} experiences in Orlando, ${priceRange(prices)}. Prices vary by date, group size and what is included.`,
    });
  }
  if (best) {
    faqs.push({
      q: `What are the best ${label} in Orlando?`,
      a: `One of the highest-rated options right now is ${best.title}, rated ${best.rating!.toFixed(1)} out of 5 from ${best.reviewCount!.toLocaleString("en-US")} traveler reviews. Sort by Highest rated above to compare all ${items.length.toLocaleString("en-US")} options.`,
    });
  }
  if (mins.length) {
    faqs.push({
      q: `How long do ${label} in Orlando last?`,
      a: `Most last about ${humanMinutes(median(mins)!)}, but options range from ${humanMinutes(Math.min(...mins))} to ${humanMinutes(Math.max(...mins))}. Use the Duration filter to find one that fits your schedule.`,
    });
  }
  if (items.length) {
    faqs.push({
      q: `Can I cancel ${label} in Orlando?`,
      a: free
        ? `${free} of the ${items.length} options in this category offer free cancellation, usually up to 24 hours before the start time. Turn on Free cancellation only in the filters to see them.`
        : "Cancellation policies vary by operator. The exact terms are shown on the booking page before you pay.",
    });
  }
  return [...faqs, ...(categoryExtras[category.key] ?? []), ...bookingFaqs.slice(0, 1)];
}

export function listingFaqs(l: ListingDetail): Faq[] {
  const faqs: Faq[] = [];
  if (l.priceFrom) {
    faqs.push({
      q: `How much does ${l.title} cost?`,
      a: `${l.title} starts from ${usd(l.priceFrom)} per person. The final price depends on your date, group size and any options you choose, and is shown before you pay on Viator.`,
    });
  }
  if (l.durationLabel) {
    faqs.push({
      q: `How long is ${l.title}?`,
      a: `This experience takes about ${l.durationLabel}. Allow extra time for check-in and travel to the meeting point.`,
    });
  }
  if (l.rating && l.reviewCount) {
    faqs.push({
      q: `Is ${l.title} worth it?`,
      a: `Travelers rate it ${l.rating.toFixed(1)} out of 5 based on ${l.reviewCount.toLocaleString("en-US")} reviews on Viator. Read recent reviews on the booking page to see what past guests enjoyed most.`,
    });
  }
  faqs.push({
    q: `Can I cancel ${l.title}?`,
    a: l.cancellationPolicy
      ? l.cancellationPolicy
      : l.freeCancellation
        ? "Yes. Viator lists free cancellation for this experience, usually up to 24 hours before the start time. The exact cutoff is shown on the booking page."
        : "Cancellation terms are set by the operator and shown on the booking page before you pay.",
  });
  faqs.push({
    q: `Where does ${l.title} start?`,
    a: l.meetingPoint
      ? l.meetingPoint
      : `This experience is in ${l.location}. The exact meeting point or pickup details are shown on the booking page and in your confirmation.`,
  });
  faqs.push(bookingFaqs[0]);
  return faqs;
}
