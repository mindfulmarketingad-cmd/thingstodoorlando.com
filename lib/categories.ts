import type { CategoryKey, IllustrationKey } from "./types";

export interface Category {
  key: CategoryKey;
  name: string;
  shortName: string;
  /** Free-text term sent to the Viator search API for this category. */
  viatorTerm: string;
  /** URL slug: /book-now/[slug]. */
  slug: string;
  /** Used in the H1: "[label] Tours and Events in Orlando Florida". */
  label: string;
  /** Legacy /search/[slug] landing page, 308-redirected to the category page. */
  legacySearchSlug: string;
  illustration: IllustrationKey;
  blurb: string;
  /** Unique intro copy for the category page. */
  intro: string;
}

export const categories: Category[] = [
  {
    key: "family",
    name: "Family Friendly Tours & Events",
    shortName: "Family Friendly",
    viatorTerm: "family kids",
    slug: "family-friendly",
    label: "Family Friendly",
    legacySearchSlug: "family-friendly",
    intro:
      "Orlando is the family vacation capital of the world, and these are the experiences that keep every age entertained. Think rocket launches, wild alligators, pirate ships and swan boats, alongside the theme parks. Every tour below links to live availability, traveler reviews and cancellation terms on Viator.",
    illustration: "family",
    blurb: "Kid-approved adventures, easy logistics and memories the whole crew will talk about.",
  },
  {
    key: "couples",
    name: "Couples Tours & Events",
    shortName: "Couples & Date Night",
    viatorTerm: "romantic sunset",
    slug: "couples",
    label: "Couples",
    legacySearchSlug: "romantic-things-to-do",
    intro:
      "From sunrise balloon flights to night helicopter rides over the fireworks, Orlando has more date-night magic than most people expect. These are the most romantic things to do in Orlando for couples, honeymooners and anyone planning a special occasion.",
    illustration: "couples",
    blurb: "Sunset cruises, balloon flights and dinner shows made for two.",
  },
  {
    key: "theme-parks",
    name: "Theme Park Tickets & Tours",
    shortName: "Theme Parks",
    viatorTerm: "theme park tickets",
    slug: "theme-parks",
    label: "Theme Park",
    legacySearchSlug: "theme-park-tickets",
    intro:
      "Compare tickets and guided days for Walt Disney World, Universal Orlando Resort, SeaWorld, LEGOLAND Florida and Busch Gardens. Check dates, inclusions and cancellation policies before you buy, and only purchase from authorized sellers.",
    illustration: "theme-parks",
    blurb: "Tickets, transfers and guided days at the parks that made Orlando famous.",
  },
  {
    key: "space",
    name: "Kennedy Space Center & Space Coast",
    shortName: "Space Coast",
    viatorTerm: "Kennedy Space Center",
    slug: "kennedy-space-center",
    label: "Kennedy Space Center",
    legacySearchSlug: "kennedy-space-center",
    intro:
      "Kennedy Space Center is the most popular day trip from Orlando. Compare admission bundles, tours with round-trip transportation and rocket launch viewing packages on Florida's Space Coast.",
    illustration: "space",
    blurb: "Rockets, astronauts and launch viewing an hour east of Orlando.",
  },
  {
    key: "wildlife",
    name: "Airboat & Wildlife Tours",
    shortName: "Airboats & Wildlife",
    viatorTerm: "airboat",
    slug: "airboat-and-wildlife",
    label: "Airboat & Wildlife",
    legacySearchSlug: "airboat-tours",
    intro:
      "Airboat tours on the Everglades headwaters are a quintessential Florida experience, less than an hour from Orlando. Compare group rides, private tours and night tours for the best chance to see alligators, eagles and wading birds.",
    illustration: "wildlife",
    blurb: "Gators, manatees and wide open Florida wetlands.",
  },
  {
    key: "dinner-shows",
    name: "Dinner Shows & Live Entertainment",
    shortName: "Dinner Shows",
    viatorTerm: "dinner show",
    slug: "dinner-shows",
    label: "Dinner Show",
    legacySearchSlug: "dinner-shows",
    intro:
      "Orlando's dinner shows turn an evening meal into a full night of entertainment. Choose between jousting knights, pirate adventures, murder mysteries and comedy shows for families, couples and groups.",
    illustration: "dinner-shows",
    blurb: "Knights, pirates, comedy and a full plate, all in one evening.",
  },
  {
    key: "water",
    name: "Water Adventures",
    shortName: "Water Adventures",
    viatorTerm: "kayak boat tour",
    slug: "water-adventures",
    label: "Water Adventure",
    legacySearchSlug: "water-adventures",
    intro:
      "Crystal clear springs, chains of lakes and gentle rivers make Central Florida a great place to get on the water. Compare kayak and paddleboard tours, scenic cruises, fishing charters and manatee encounters.",
    illustration: "water",
    blurb: "Crystal clear springs, lake cruises and paddles under the oaks.",
  },
  {
    key: "sky",
    name: "Hot Air Balloons & Sky Tours",
    shortName: "Balloons & Sky",
    viatorTerm: "hot air balloon helicopter",
    slug: "hot-air-balloons",
    label: "Hot Air Balloon & Sky",
    legacySearchSlug: "hot-air-balloon-rides",
    intro:
      "See Central Florida from above. Compare sunrise hot air balloon flights, helicopter tours over the theme parks and other sky-high experiences around Orlando.",
    illustration: "sky",
    blurb: "See Central Florida from above at sunrise or after dark.",
  },
  {
    key: "day-trips",
    name: "Day Trips From Orlando",
    shortName: "Day Trips",
    viatorTerm: "day trip from Orlando",
    slug: "day-trips",
    label: "Day Trip",
    legacySearchSlug: "day-trips-from-orlando",
    intro:
      "Orlando's central location puts beaches, historic cities and wild places within easy reach. Compare guided day trips to Kennedy Space Center, Clearwater Beach, St. Augustine, the Everglades and more, most with hotel pickup included.",
    illustration: "day-trips",
    blurb: "Beaches, St. Augustine, Tampa and the Keys without renting a car.",
  },
  {
    key: "food-and-dining",
    name: "Food & Dining Experiences",
    shortName: "Food & Dining",
    viatorTerm: "food tour",
    slug: "food-and-dining",
    label: "Food & Dining",
    legacySearchSlug: "food-and-city-tours",
    intro:
      "Orlando's food scene reaches far beyond theme park snacks. Taste your way through Winter Park, the Milk District and Ivanhoe Village on guided food tours, take a cooking class, cruise the St. Johns River over dinner or tour a chocolate factory. These are the best food and dining experiences in and around Orlando, with live prices and traveler reviews.",
    illustration: "food-and-city",
    blurb: "Food tours, cooking classes and dining cruises.",
  },
  {
    key: "drinks-and-nightlife",
    name: "Drinks & Nightlife",
    shortName: "Drinks & Nightlife",
    viatorTerm: "pub crawl nightlife",
    slug: "drinks-and-nightlife",
    label: "Drinks & Nightlife",
    legacySearchSlug: "nightlife-tours",
    intro:
      "When the parks close, Orlando keeps going. Hop between lakeside pubs on a pontoon pub crawl, sip your way through local breweries and distilleries, learn to mix craft cocktails or join a haunted pub crawl downtown. These are the top drinks and nightlife experiences in Orlando for adults, with current prices and reviews.",
    illustration: "dinner-shows",
    blurb: "Pub crawls, breweries, cocktails and nights out.",
  },
  {
    key: "relaxation",
    name: "Relaxation & Spas",
    shortName: "Relaxation & Spas",
    viatorTerm: "spa massage",
    slug: "relaxation-and-spas",
    label: "Relaxation & Spa",
    legacySearchSlug: "spa-and-wellness",
    intro:
      "Theme park days are fun, but your feet will thank you for a break. Book a massage, a couples spa session or a calming wellness experience near the Disney and Universal areas. These relaxation and spa experiences in Orlando are the perfect reset between big park days.",
    illustration: "couples",
    blurb: "Massages, spa sessions and slow, restful days.",
  },
  {
    key: "sports",
    name: "Sports & Active Adventures",
    shortName: "Sports",
    viatorTerm: "golf sports",
    slug: "sports",
    label: "Sports",
    legacySearchSlug: "sports-tours",
    intro:
      "Orlando is a playground for active travelers and sports fans. Tee off at a local course, try indoor skydiving, learn to waterski or wakeboard on a private lake, play a round of adventure golf or catch big-time racing at Daytona. These are the best sports experiences and tickets in and around Orlando.",
    illustration: "family",
    blurb: "Golf, racing, skydiving, water sports and game days.",
  },
  {
    key: "shopping",
    name: "Shopping Tours & Experiences",
    shortName: "Shopping",
    viatorTerm: "shopping outlets",
    slug: "shopping",
    label: "Shopping",
    legacySearchSlug: "shopping-tours",
    intro:
      "Orlando is one of the best shopping destinations in the country, with huge outlet centers, upscale malls and unique local boutiques. Book a private shopping trip to the premium outlets, a personal styling session or a day trip to a charming shopping town. These are the top shopping experiences in Orlando.",
    illustration: "food-and-city",
    blurb: "Outlet trips, personal styling and shopping days.",
  },
  {
    key: "sightseeing",
    name: "Sightseeing Tours & Attractions",
    shortName: "Sightseeing",
    viatorTerm: "sightseeing tour",
    slug: "sightseeing",
    label: "Sightseeing",
    legacySearchSlug: "sightseeing-tours",
    intro:
      "Attraction passes, guided sightseeing, transfers, classes and one-of-a-kind experiences across Orlando and Central Florida. If it does not fit neatly into another category, you will find it here.",
    illustration: "food-and-city",
    blurb: "Passes, classes, transfers and unique experiences.",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c])) as Record<
  CategoryKey,
  Category
>;
