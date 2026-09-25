import "server-only";
import { cache } from "react";
import type { CategoryKey, Listing } from "./types";
import type { HotelArea } from "./hotels";
import { getLiveListings, snapshotDate } from "./listings";
import { LOW_QUALITY_TAG, TRANSPORT, getTopRated, median, rankScore, similar } from "./listicles";

/**
 * Programmatic /book-now collections: budget pages, cheap-by-category pages,
 * private tours and "things to do near" area pages. Every page is built from
 * real Viator listings plus hand-written guidance, and is only indexed when
 * it has enough distinct experiences to be useful.
 */

export type CollectionKind = "top" | "ideas" | "budget" | "cheap" | "private" | "near";

export interface CollectionConfig {
  slug: string;
  kind: CollectionKind;
  /** H1. */
  h1: string;
  /** <title>, 60 characters or fewer. */
  title: string;
  description: string;
  /** Short name used in breadcrumbs and link lists. */
  label: string;
  /** Plural noun for generated copy, e.g. "airboat and wildlife tours". */
  noun: string;
  match: (l: Listing) => boolean;
  /** Rank with the site-wide top-rated list (one per activity type) instead of the plain score. */
  topRated?: { limit: number };
  /** Keep listings Viator flags for ranking reasons (official tickets carry these flags). */
  includeFlagged?: boolean;
  /** Parent category for breadcrumbs and cross-links. */
  category?: CategoryKey;
  hotelArea: HotelArea;
  intro: string[];
  howToChoose: { heading: string; text: string }[];
  goodToKnow: string[];
  /** Area pages: free and local highlights that no booking site lists. */
  local?: { heading: string; items: { name: string; text: string }[] };
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
}

/** Never "things to do": transport, chauffeurs, discount cards and adult-only revues. */
const NOT_AN_EXPERIENCE =
  /transportation|chauffeur|\bMCO\b|ride in style|discount card|male revue|burlesque|strip club|\bthe villages\b|with transport from orlando and kissimmee|5 day self guided|\bicard\b|\besim\b|cruise friendly/i;

const under = (max: number) => (l: Listing) => (l.priceFrom ?? Infinity) <= max;
const inCat = (key: CategoryKey, max: number) => (l: Listing) => l.categories.includes(key) && under(max)(l);
const title = (re: RegExp) => (l: Listing) => re.test(l.title);
/** Category tags can be broad, so narrow pages also check what the title says it is. */
const both = (a: (l: Listing) => boolean, re: RegExp, not?: RegExp) => (l: Listing) =>
  a(l) && re.test(l.title) && !(not && not.test(l.title));

export const collections: CollectionConfig[] = [
  /* ---------------- Top rated ---------------- */
  {
    slug: "top-tourist-attractions-in-orlando-florida",
    kind: "top",
    h1: "Top Tourist Attractions in Orlando Florida",
    title: "Top Tourist Attractions in Orlando Florida (Top 10)",
    description:
      "The 10 top-rated tourist attractions in Orlando, Florida on Viator, ranked by thousands of traveler reviews: tours, adventures and experiences worth booking.",
    label: "Top tourist attractions",
    noun: "top-rated attractions and tours",
    match: (l) => (l.reviewCount ?? 0) >= 100 && (l.rating ?? 0) >= 4.5,
    topRated: { limit: 10 },
    hotelArea: "international-drive",
    intro: [
      "Everyone knows Orlando's theme parks. What visitors do not always know is which of the city's hundreds of other attractions are actually worth the ticket. This page answers that with real data: the 10 top tourist attractions in Orlando, Florida, ranked by the ratings and reviews of travelers who booked them on Viator.",
      "To keep the list useful, we only rank experiences with at least 100 reviews and an average of 4.5 stars or higher, and we allow one pick per type of activity, so you get the best escape room, the best kayak tour and the best airboat ride instead of ten versions of the same thing. The ranking refreshes every time our data updates, so a newcomer with great reviews can climb the list.",
    ],
    howToChoose: [
      {
        heading: "Pair one big attraction with one local favorite",
        text: "Put Kennedy Space Center or a theme park on the calendar first, then fill the lighter days with smaller top-rated experiences like a clear kayak paddle in Winter Park or a downtown ghost tour.",
      },
      {
        heading: "Match the attraction to the time of day",
        text: "Outdoor adventures like kayaking, airboats and zip lines are best in the morning before the summer heat and storms. Escape rooms and indoor experiences are perfect for afternoons, and ghost tours come alive after dark.",
      },
      {
        heading: "Think about the drive",
        text: "Some of the best-rated experiences are outside the tourist corridor, in Winter Park, Kissimmee or on the Space Coast. Group attractions by area to spend more time doing and less time on I-4.",
      },
    ],
    goodToKnow: [
      "Top-rated experiences sell out first, especially on weekends and holidays. Book a few days ahead.",
      "Most include free cancellation up to 24 hours before the start time.",
      "Prices shown are starting prices per person and change by date and group size.",
      "Tours with hotel pickup usually collect from International Drive, Lake Buena Vista and Kissimmee.",
    ],
    faqs: [
      {
        q: "What is the number one tourist attraction in Orlando?",
        a: "Walt Disney World is the most visited attraction in Orlando. Among bookable tours and experiences on Viator, the top-rated attraction right now is the first pick on this page, based on traveler ratings and review volume.",
      },
      {
        q: "What are the top attractions in Orlando besides theme parks?",
        a: "Kennedy Space Center, airboat rides on Central Florida's lakes, clear kayak tours, the downtown ghost tour, escape rooms on International Drive and zip line parks are consistently among the highest-rated experiences outside the parks.",
      },
      {
        q: "How do you rank the top tourist attractions?",
        a: "We use a weighted score that balances each experience's average rating with how many travelers reviewed it, require at least 100 reviews and a 4.5 average, and allow one pick per activity type so the list stays varied.",
      },
    ],
    related: [
      { label: "Top 10 things to do in Orlando (guide)", href: "/blog/top-10-things-to-do-in-orlando-florida" },
      { label: "Events today in Orlando", href: "/book-now/today" },
      { label: "Things to do under $50", href: "/book-now/things-to-do-in-orlando-under-50" },
      { label: "Best hotels in Orlando", href: "/place-to-stay" },
    ],
  },

  /* ---------------- Ideas ---------------- */
  {
    slug: "cute-date-ideas-orlando-florida",
    kind: "ideas",
    h1: "Cute Date Ideas Orlando Florida",
    title: "Cute Date Ideas in Orlando, Florida: Bookable Dates",
    description:
      "Cute date ideas in Orlando, Florida you can book today: sunset kayaks, glow paddles, sunset airboats, trail rides, helicopter flights and couples massages.",
    label: "Cute date ideas",
    category: "couples",
    noun: "date ideas",
    match: (l) =>
      (l.categories.includes("couples") ||
        /sunset|date night|romantic|couple|champagne|dinner cruise|glow|helicopter|balloon|massage|trail ride|horseback|charcuterie|high-tea|wine/i.test(l.title)) &&
      !/paintball|family pack|theme park loop|water park/i.test(l.title),
    hotelArea: "winter-park",
    intro: [
      "Orlando's best dates happen away from the theme park crowds. Ask anyone who lives here and they will send you out on the water at golden hour, up in the air over the fireworks or down a quiet trail on horseback, then off to dinner on Park Avenue. This page gathers the cutest date ideas in Orlando, Florida that you can actually book, from real experiences with real traveler reviews on Viator.",
      "The list mixes sweet and simple with once-in-a-lifetime: clear kayak paddles through the Winter Park canals at sunset, glowing LED kayaks after dark, sunset airboat rides, horseback trail rides in state parks, river dinner cruises, helicopter flights over the fireworks and couples massages. Every pick is ranked by traveler ratings and review volume, so the most-loved dates rise to the top.",
    ],
    howToChoose: [
      {
        heading: "First dates and new couples",
        text: "Keep it light and active. A sunset clear kayak or a glow paddle gives you something to laugh about, and it is easy to extend into dinner if it is going well.",
      },
      {
        heading: "Anniversaries and proposals",
        text: "Go big with a helicopter flight over the theme parks during the fireworks, a champagne sunset trail ride or a private paddle. Mention the occasion when you book; many small operators love helping with a surprise.",
      },
      {
        heading: "Low-key and relaxing",
        text: "A river cruise out of Sanford or a couples massage is the move when you want to slow down after a few big park days.",
      },
    ],
    goodToKnow: [
      "Sunset tour start times shift with the seasons, so check the time for your date.",
      "Bring bug spray for anything on the water or on trails at dusk.",
      "Evening slots on Fridays and Saturdays sell out first. Weeknights are easier to book and just as pretty.",
      "Summer storms usually pass by early evening, but most operators offer free cancellation or rescheduling for weather.",
    ],
    faqs: [
      {
        q: "What are some cute date ideas in Orlando?",
        a: "Paddle a clear kayak through the Winter Park chain of lakes at sunset, take a glow-in-the-dark kayak tour, ride an airboat at golden hour, go horseback riding on a state park trail, or fly over the fireworks in a helicopter. Finish with dinner on Park Avenue or in Thornton Park.",
      },
      {
        q: "What are free date ideas in Orlando?",
        a: "Walk around Lake Eola at dusk, watch the sunset at Kraft Azalea Garden in Winter Park, stroll Disney Springs, or browse the Winter Park Farmers' Market on a Saturday morning.",
      },
      {
        q: "What is the most romantic thing to do in Orlando?",
        a: "A night helicopter flight over the theme park fireworks is the showstopper. For something quieter, a sunset clear kayak tour through Winter Park's canals is a local favorite.",
      },
    ],
    related: [
      { label: "Cheap date night ideas under $100", href: "/book-now/cheap-date-night-ideas" },
      { label: "Romantic things to do in Orlando", href: "/blog/romantic-things-to-do-in-orlando-for-couples" },
      { label: "Hotels near downtown Winter Park", href: "/place-to-stay/hotels-near-downtown-winter-park" },
      { label: "Luxury resort hotels in Orlando", href: "/place-to-stay/luxury-resort-hotels-in-orlando" },
    ],
  },

  /* ---------------- Budget ---------------- */
  {
    slug: "things-to-do-in-orlando-under-25",
    kind: "budget",
    h1: "Things To Do In Orlando Under $25",
    title: "Things To Do In Orlando Under $25 (Bookable Deals)",
    description:
      "Real, bookable things to do in Orlando for $25 or less per person: lake tours, audio walking tours, rides and attractions, ranked by traveler reviews.",
    label: "Under $25",
    noun: "experiences under $25",
    match: under(25),
    hotelArea: "international-drive",
    intro: [
      "Orlando has a reputation for expensive theme park days, but a surprising number of genuinely fun experiences cost less than a movie ticket and popcorn. This page collects every bookable Orlando experience we track that starts at $25 or less per person, from a narrated pontoon tour of the Winter Haven chain of lakes to self-guided history walks and thrill rides on International Drive.",
      "Use these as the low-cost days in your itinerary, as a quick activity on arrival day, or as an add-on after a morning at the parks. Every listing links to a live booking page, so you can confirm the current price and availability for your date before you pay.",
    ],
    howToChoose: [
      {
        heading: "Check what the price covers",
        text: "Budget listings are often priced for one ride, one entry or a rental period. Read the inclusions so you know whether parking, equipment or a guide is part of the price.",
      },
      {
        heading: "Pair a cheap activity with a free one",
        text: "A self-guided audio tour of downtown pairs naturally with a free stroll around Lake Eola, and a ride on International Drive pairs with walking ICON Park, which is free to enter.",
      },
      {
        heading: "Lean on reviews, not just price",
        text: "At this price point a handful of reviews can swing a rating. We rank by a weighted score that favors experiences with many consistent reviews, so the top of the list is the safest bet.",
      },
    ],
    goodToKnow: [
      "Prices are per person unless the listing says otherwise, and some start prices apply to children or off-peak times.",
      "Self-guided audio tours run on your phone, so bring headphones and a charged battery.",
      "Outdoor activities can pause for summer lightning. Morning slots are the most reliable from June to September.",
      "Free cancellation is common. Book early, then cancel if your plans change.",
    ],
    faqs: [
      {
        q: "What can you do in Orlando for free?",
        a: "Walk around Lake Eola Park and the Sunday farmers market, explore Disney Springs and Universal CityWalk, stroll ICON Park on International Drive, visit Old Town in Kissimmee, and watch a rocket launch from the Space Coast beaches. Pair these with a paid activity from this list for a full, affordable day.",
      },
      {
        q: "Are cheap Orlando tours worth it?",
        a: "The well-reviewed ones are. Short lake tours, walking tours and single attractions can be the highlight of a trip because they show a side of Orlando most theme park visitors miss. Stick to listings with strong ratings from many travelers.",
      },
    ],
    related: [
      { label: "Things to do under $50", href: "/book-now/things-to-do-in-orlando-under-50" },
      { label: "Cheap things to do in Orlando (guide)", href: "/blog/free-and-cheap-things-to-do-in-orlando" },
      { label: "Things to do near Downtown Orlando", href: "/book-now/things-to-do-near-downtown-orlando" },
    ],
  },
  {
    slug: "things-to-do-in-orlando-under-50",
    kind: "budget",
    h1: "Things To Do In Orlando Under $50",
    title: "Things To Do In Orlando Under $50: Top-Rated Deals",
    description:
      "The best things to do in Orlando for $50 or less: airboat rides, kayak tours, escape rooms and attractions, ranked by thousands of traveler reviews.",
    label: "Under $50",
    noun: "experiences under $50",
    match: under(50),
    hotelArea: "international-drive",
    intro: [
      "Fifty dollars goes a long way in Orlando once you look past the theme park gates. This is where the city's best-value experiences live: airboat rides through real Florida wetlands, clear kayak tours on spring-fed rivers, escape rooms on International Drive and attractions like SEA LIFE and Madame Tussauds at ICON Park.",
      "We compare every bookable experience that starts at $50 or less per person and rank them by traveler ratings and review volume. It is the easiest way to fill the non-park days of your trip without blowing the budget.",
    ],
    howToChoose: [
      {
        heading: "Nature for the best value",
        text: "Airboat rides and kayak tours in this price range are some of the highest-rated experiences in all of Orlando. They get you out of the tourist corridor and into the wetlands and springs that make Central Florida special.",
      },
      {
        heading: "Indoor picks for heat and rain",
        text: "Escape rooms, aquariums and museum-style exhibitions are air-conditioned and work any time of day, which makes them ideal for summer afternoons when storms roll in.",
      },
      {
        heading: "Watch the drive time",
        text: "Some of the best-value nature tours are 45 to 90 minutes from the tourist areas. A cheaper tour with a long drive can cost more in time and gas than a slightly pricier one nearby.",
      },
    ],
    goodToKnow: [
      "Many airboat and kayak operators add a fuel or photo charge at check-in. The listing will mention it.",
      "Kids' tickets are often cheaper than the adult start price shown here.",
      "Weekend slots sell out first. Weekday mornings are easiest to book last minute.",
      "Most experiences include free cancellation up to 24 hours ahead.",
    ],
    faqs: [
      {
        q: "What is the best thing to do in Orlando under $50?",
        a: "Airboat rides are the standout: they are affordable, family-friendly and consistently among the highest-rated experiences in Orlando. For something indoors, the escape rooms on International Drive have thousands of five-star reviews.",
      },
      {
        q: "Can a family of four do Orlando on a budget?",
        a: "Yes. Alternate one or two big park days with lower-cost days built from this list and free options like Disney Springs, Lake Eola and Old Town Kissimmee. Staying in Kissimmee or on the south end of International Drive also keeps hotel costs down.",
      },
    ],
    related: [
      { label: "Things to do under $25", href: "/book-now/things-to-do-in-orlando-under-25" },
      { label: "Things to do under $100", href: "/book-now/things-to-do-in-orlando-under-100" },
      { label: "Cheap airboat and wildlife tours", href: "/book-now/cheap-airboat-and-wildlife-tours" },
      { label: "Cheap things to do in Orlando (guide)", href: "/blog/free-and-cheap-things-to-do-in-orlando" },
    ],
  },
  {
    slug: "things-to-do-in-orlando-under-100",
    kind: "budget",
    h1: "Things To Do In Orlando Under $100",
    title: "Things To Do In Orlando Under $100: Best Experiences",
    description:
      "Top-rated things to do in Orlando for $100 or less, from Kennedy Space Center day trips and Everglades airboat tours to LEGOLAND tickets and ghost tours.",
    label: "Under $100",
    noun: "experiences under $100",
    match: under(100),
    hotelArea: "international-drive",
    intro: [
      "Under $100 per person is the sweet spot for Orlando experiences. It covers most of the city's best-loved tours, including Kennedy Space Center day trips with transportation, Everglades airboat rides, glass-bottom kayak tours at Rainbow and Silver Springs, the downtown ghost tour and single-day tickets to parks like LEGOLAND Florida.",
      "This page ranks every bookable experience in that range by traveler ratings and review volume, so you can compare hundreds of options in one place and spend your budget on the ones travelers rave about.",
    ],
    howToChoose: [
      {
        heading: "Decide on a half day or a full day",
        text: "Many experiences here take two to four hours and fit around a park day. Day trips such as Kennedy Space Center or the springs take most of the day, so plan them for a separate day.",
      },
      {
        heading: "Look at what is included",
        text: "Two tours at similar prices can differ a lot: one may include hotel pickup, admission and lunch, while another covers only the activity. The comparison table below shows length and price side by side.",
      },
      {
        heading: "Balance thrills and downtime",
        text: "Mix high-energy picks like airboats and zip lines with slower ones like boat cruises and food tours so the whole group enjoys the trip.",
      },
    ],
    goodToKnow: [
      "Tours with hotel pickup usually collect from International Drive, Lake Buena Vista and Kissimmee hotels. Check the pickup list before you book.",
      "Spring break, summer and holiday weeks sell out fastest.",
      "Tips for guides are not usually included in the price.",
      "Prices can change by date. The booking page always shows the current rate.",
    ],
    faqs: [
      {
        q: "Is Kennedy Space Center worth it from Orlando?",
        a: "For most visitors, yes. It is about an hour from Orlando and you can see the Saturn V rocket and Space Shuttle Atlantis up close. Tours with transportation remove the need to rent a car and are among the best-reviewed experiences in the area.",
      },
      {
        q: "What should I book first for Orlando?",
        a: "Book date-specific experiences first: theme park tickets, dinner shows and popular tours with limited seats. Flexible activities like kayak rentals and attractions can be added later.",
      },
    ],
    related: [
      { label: "Things to do under $50", href: "/book-now/things-to-do-in-orlando-under-50" },
      { label: "Cheap day trips from Orlando", href: "/book-now/cheap-day-trips-from-orlando" },
      { label: "Top 10 things to do in Orlando", href: "/blog/top-10-things-to-do-in-orlando-florida" },
    ],
  },

  /* ---------------- Cheap by category ---------------- */
  {
    slug: "cheap-airboat-and-wildlife-tours",
    kind: "cheap",
    h1: "Cheap Airboat and Wildlife Tours in Orlando Under $50",
    title: "Cheap Airboat Tours in Orlando Under $50",
    description:
      "Affordable airboat rides and wildlife tours near Orlando for $50 or less. Compare gator-spotting airboats, lake tours and springs paddles by rating.",
    label: "Cheap airboat and wildlife tours",
    noun: "airboat and wildlife tours under $50",
    match: both(inCat("wildlife", 50), /airboat|wildlife|gator|eco|nature|kayak|canoe|boat|horse|bird|manatee|safari|springs|swamp|everglades/i, /science center|bike/i),
    category: "wildlife",
    hotelArea: "kissimmee",
    intro: [
      "You do not need a big budget to see alligators in the wild. Central Florida's lakes and marshes are full of gators, wading birds and turtles, and several operators run airboat rides and wildlife tours for $50 or less per person. Some of the most-reviewed wildlife experiences in the Orlando area fall into this price range.",
      "We rank every wildlife tour we track that starts at $50 or under, using traveler ratings weighted by review volume. You will also find calmer options, like narrated lake tours and clear canoe paddles, for travelers who prefer a quieter look at Florida wildlife.",
    ],
    howToChoose: [
      {
        heading: "Shared airboats are the budget pick",
        text: "Shared rides put you on a larger boat with other guests, which keeps the price down. Private airboats cost more but let you set the pace and the stops.",
      },
      {
        heading: "Length changes the experience",
        text: "A 30-minute ride is a thrill; a 60 to 90 minute ride goes deeper into the marsh, where you are more likely to see gators and birds. Compare lengths in the table below.",
      },
      {
        heading: "Consider a combo ticket",
        text: "Some airboat tours bundle admission to a wildlife park, which is often cheaper than paying for both separately.",
      },
    ],
    goodToKnow: [
      "Airboats are loud. Operators provide ear protection, and it is a good idea for small children.",
      "Wildlife is most active early in the morning and late in the afternoon.",
      "Rides can pause for lightning, and operators reschedule or refund when they cancel for weather.",
      "Bring sunglasses, sunscreen and a light layer in winter, since airboats get breezy.",
    ],
    faqs: [
      {
        q: "Will I definitely see alligators on an airboat tour?",
        a: "Sightings are very common on Central Florida lakes but never guaranteed, since these are wild animals. Longer rides and cooler months tend to have the best viewing.",
      },
      {
        q: "Are cheap airboat rides safe for kids?",
        a: "Yes. Licensed operators provide ear protection and seat children away from the edges. Check the listing for minimum ages, which vary by operator.",
      },
    ],
    related: [
      { label: "All airboat and wildlife tours", href: "/book-now/airboat-and-wildlife" },
      { label: "Best airboat tours in Orlando", href: "/blog/best-airboat-tours-in-orlando" },
      { label: "Things to do near Kissimmee", href: "/book-now/things-to-do-near-kissimmee" },
    ],
  },
  {
    slug: "cheap-kayak-and-water-activities",
    kind: "cheap",
    h1: "Cheap Kayak and Water Activities in Orlando Under $50",
    title: "Cheap Kayak Tours and Water Activities Under $50",
    description:
      "Affordable kayak tours, paddleboard rentals and boat rides near Orlando for $50 or less, including clear kayaks on Silver Springs and the Winter Park lakes.",
    label: "Cheap kayak and water activities",
    noun: "water activities under $50",
    match: both(inCat("water", 50), /kayak|paddle|canoe|boat|cruise|snorkel|swim|jet ?ski|tubing|wakeboard|springs|lake|river|pontoon|\bsup\b/i, /magic show|bike|dinner/i),
    category: "water",
    hotelArea: "winter-park",
    intro: [
      "Orlando sits among hundreds of lakes and a short drive from some of Florida's clearest springs, which makes getting on the water one of the best-value things to do here. For $50 or less you can paddle a clear kayak over Silver Springs, rent a paddleboard for a couple of hours, or take a narrated pontoon tour of the Winter Haven chain of lakes near LEGOLAND Florida.",
      "This page ranks every water activity we track that starts at $50 or under by traveler rating and review count, so you can find a great morning on the water without a big spend.",
    ],
    howToChoose: [
      {
        heading: "Rental or guided tour",
        text: "Rentals are the cheapest way on the water and suit confident paddlers. Guided tours cost a little more but include route knowledge, wildlife spotting and help for beginners.",
      },
      {
        heading: "Springs or city lakes",
        text: "Springs like Silver Springs are about 90 minutes from Orlando and offer glass-clear water and wildlife. City lakes in Orlando and Winter Park are much closer and pair well with a meal nearby.",
      },
      {
        heading: "Clear kayaks for the view",
        text: "Clear-bottom kayaks let you see fish, turtles and sometimes manatees below you. They are especially worth it on spring-fed rivers.",
      },
    ],
    goodToKnow: [
      "Spring water stays around 72 degrees all year, so paddling is comfortable even in winter.",
      "Manatees gather in the springs mainly from November to March.",
      "Bring a dry bag, water, sunscreen and shoes that can get wet.",
      "Afternoon thunderstorms are common in summer, so book morning slots.",
    ],
    faqs: [
      {
        q: "Do I need kayaking experience?",
        a: "No for most tours and calm-water rentals. Guides give a short lesson before launching, and the springs and city lakes are sheltered and flat.",
      },
      {
        q: "Can you swim in the springs near Orlando?",
        a: "Some springs allow swimming in designated areas and others do not, including Silver Springs. Check the park rules for the spring you visit.",
      },
    ],
    related: [
      { label: "All water adventures", href: "/book-now/water-adventures" },
      { label: "Best kayaking tours in Orlando", href: "/blog/best-kayaking-tours-in-orlando" },
      { label: "Things to do near Winter Park", href: "/book-now/things-to-do-near-winter-park" },
    ],
  },
  {
    slug: "cheap-attractions-and-sightseeing",
    kind: "cheap",
    h1: "Cheap Attractions and Sightseeing in Orlando Under $50",
    title: "Cheap Orlando Attractions and Sightseeing Under $50",
    description:
      "Affordable Orlando attractions for $50 or less: SEA LIFE, Madame Tussauds, The Wheel, escape rooms and sightseeing tours, ranked by traveler reviews.",
    label: "Cheap attractions and sightseeing",
    noun: "attractions and sightseeing experiences under $50",
    match: both(inCat("sightseeing", 50), /./, /kayak|paddle|canoe|rental/i),
    category: "sightseeing",
    hotelArea: "international-drive",
    intro: [
      "Between the big theme parks, Orlando is packed with smaller attractions that cost a fraction of a park ticket. For $50 or less per person you can ride The Wheel at ICON Park, visit the SEA LIFE aquarium and Madame Tussauds, tackle an escape room, or see the Titanic artifact exhibition on International Drive.",
      "We rank every attraction and sightseeing experience we track that starts at $50 or under, using traveler ratings weighted by review volume. Most are indoors and air-conditioned, which makes them ideal for hot or rainy afternoons.",
    ],
    howToChoose: [
      {
        heading: "Bundle ICON Park attractions",
        text: "The Wheel, SEA LIFE and Madame Tussauds sit side by side at ICON Park. Multi-attraction tickets usually cost less than buying each one separately.",
      },
      {
        heading: "Escape rooms for groups",
        text: "Escape rooms are priced per person but played as a private group, which makes them great for families with teens and friend groups.",
      },
      {
        heading: "Time of day matters",
        text: "The Wheel is most dramatic at sunset and after dark, while aquariums and exhibitions are least crowded on weekday mornings.",
      },
    ],
    goodToKnow: [
      "ICON Park is free to walk around, and parking in its garage is paid.",
      "Escape rooms need your group to arrive 10 to 15 minutes early.",
      "Timed-entry tickets may ask you to pick a slot after booking.",
      "Most attractions here take one to two hours, so you can combine two in an afternoon.",
    ],
    faqs: [
      {
        q: "What is there to do on International Drive for cheap?",
        a: "Walk ICON Park for free, then choose one paid attraction like The Wheel, SEA LIFE or an escape room. The I-Drive area also has mini golf, arcades and free evening people-watching along the strip.",
      },
      {
        q: "What are good rainy day attractions in Orlando?",
        a: "Aquariums, museums, escape rooms and exhibitions like Titanic are all indoors. See our rainy day guide for more ideas.",
      },
    ],
    related: [
      { label: "All sightseeing tours", href: "/book-now/sightseeing" },
      { label: "Things to do near International Drive", href: "/book-now/things-to-do-near-international-drive" },
      { label: "Rainy day things to do in Orlando", href: "/blog/rainy-day-things-to-do-in-orlando" },
    ],
  },
  {
    slug: "cheap-theme-park-tickets",
    kind: "cheap",
    h1: "Cheap Theme Park Tickets and Attractions in Orlando Under $75",
    title: "Cheap Orlando Theme Park Tickets Under $75",
    description:
      "Orlando theme park tickets and park-style attractions for $75 or less, including LEGOLAND Florida, Fun Spot, Disney water parks and multi-attraction passes.",
    label: "Cheap theme park tickets",
    noun: "theme park tickets and attractions under $75",
    match: both(inCat("theme-parks", 75), /ticket|admission|\bpass\b|wonderworks|fun spot|legoland|old town|starflyer|mini golf/i, /bike|walk in/i),
    includeFlagged: true,
    category: "theme-parks",
    hotelArea: "kissimmee",
    intro: [
      "A single day at Disney or Universal can top $150 per person, but Orlando has plenty of park-style fun for much less. For $75 or under you can find tickets to LEGOLAND Florida, Fun Spot's coasters and go-karts, Disney's water parks on select dates, and multi-attraction passes that bundle dozens of smaller experiences.",
      "This page compares every theme park ticket and park-style attraction we track that starts at $75 or less, ranked by traveler ratings and review count, so you can plan a full theme park day on a smaller budget.",
    ],
    howToChoose: [
      {
        heading: "Match the park to your kids' ages",
        text: "LEGOLAND Florida is designed for kids roughly 2 to 12. Fun Spot suits older kids and teens who want coasters and go-karts. Water parks work for every age.",
      },
      {
        heading: "Check the date",
        text: "Many park tickets use date-based pricing. The start price shown is usually the cheapest date, so weekdays outside school holidays get closest to it.",
      },
      {
        heading: "Passes for lots of small attractions",
        text: "Multi-attraction passes make sense if you will visit three or more included attractions. Add up the individual prices before you buy.",
      },
    ],
    goodToKnow: [
      "LEGOLAND Florida is in Winter Haven, about 45 minutes southwest of Orlando.",
      "Water parks can close for refurbishment in cooler months. Check the calendar for your dates.",
      "Parking is usually extra at theme parks.",
      "Official Disney and Universal tickets sold here are the same tickets sold at the gate, with date-based prices.",
    ],
    faqs: [
      {
        q: "What is the cheapest theme park in Orlando?",
        a: "Smaller parks such as Fun Spot and single attractions cost far less than Disney or Universal. Of the major parks, LEGOLAND Florida usually has the lowest day ticket, especially on weekdays.",
      },
      {
        q: "How can I save on Disney and Universal tickets?",
        a: "Buy multi-day tickets, which lower the cost per day, visit midweek outside school holidays, and compare official ticket options on our theme parks page.",
      },
    ],
    related: [
      { label: "All theme park tickets and tours", href: "/book-now/theme-parks" },
      { label: "Best theme parks in Orlando", href: "/blog/best-theme-parks-in-orlando" },
      { label: "Cheap family activities", href: "/book-now/cheap-family-activities" },
      { label: "Hotels near LEGOLAND Florida", href: "/place-to-stay/hotels-near-legoland-florida" },
    ],
  },
  {
    slug: "cheap-family-activities",
    kind: "cheap",
    h1: "Cheap Family Activities in Orlando Under $50",
    title: "Cheap Family Activities in Orlando Under $50",
    description:
      "Family-friendly things to do in Orlando for $50 or less per person: aquariums, science centers, kids' rides, magic shows and more, ranked by reviews.",
    label: "Cheap family activities",
    noun: "family activities under $50",
    match: inCat("family", 50),
    category: "family",
    hotelArea: "kissimmee",
    intro: [
      "Keeping a family of four entertained in Orlando adds up quickly, so every lower-cost day helps. This page collects the family-friendly experiences we track that start at $50 or less per person, including the SEA LIFE aquarium, the Orlando Science Center, kids' rides at ICON Park and family magic shows.",
      "Each one is ranked by traveler ratings and review volume, and each is suitable for children. Use them to break up park days, fill a rainy afternoon or give little legs a rest.",
    ],
    howToChoose: [
      {
        heading: "Match the activity to the youngest child",
        text: "Check height and age limits in the listing. Aquariums and science centers work for all ages, while rides and active experiences may have minimums.",
      },
      {
        heading: "Indoors for the hottest hours",
        text: "Plan outdoor activities for the morning and save indoor picks like aquariums and museums for the afternoon heat and storms.",
      },
      {
        heading: "Watch the per-person math",
        text: "Some listings price children lower than adults. The start price shown here is often the child or lowest ticket price.",
      },
    ],
    goodToKnow: [
      "Many attractions let children under 3 in free.",
      "Bring refillable water bottles; most attractions have water fountains.",
      "Weekday mornings are the quietest time at family attractions.",
      "Look for free cancellation in case someone needs a rest day.",
    ],
    faqs: [
      {
        q: "What is there to do in Orlando with kids besides theme parks?",
        a: "Aquariums, the Orlando Science Center, airboat rides, springs kayaking, Gatorland and dinner shows are all big hits with kids. See our kids guide for a full plan.",
      },
      {
        q: "What free things can families do in Orlando?",
        a: "Lake Eola Park and its playground, Disney Springs, the Winter Park farmers market on Saturdays, and watching a rocket launch from the coast are all free.",
      },
    ],
    related: [
      { label: "All family-friendly tours", href: "/book-now/family-friendly" },
      { label: "Things to do in Orlando with kids", href: "/blog/best-things-to-do-in-orlando-with-kids" },
      { label: "Best family-friendly tours", href: "/blog/best-family-friendly-tours-in-orlando-florida" },
      { label: "Family hotels in Orlando", href: "/place-to-stay/family-hotels-in-orlando" },
    ],
  },
  {
    slug: "cheap-day-trips-from-orlando",
    kind: "cheap",
    h1: "Cheap Day Trips From Orlando Under $100",
    title: "Cheap Day Trips From Orlando Under $100",
    description:
      "Affordable day trips from Orlando for $100 or less: Kennedy Space Center with transport, Everglades airboats, Clearwater Beach and springs tours.",
    label: "Cheap day trips",
    noun: "day trips under $100",
    match: both(inCat("day-trips", 100), /day trip|everglades|clearwater|kennedy|space|springs|beach|augustine|tampa|dolphin|from orlando|airboat|manatee/i),
    category: "day-trips",
    hotelArea: "international-drive",
    intro: [
      "Some of the best days of an Orlando trip happen outside Orlando. For $100 or less per person you can ride to Kennedy Space Center with transportation included, spend a day at Clearwater Beach on the Gulf coast, or head into the Florida wetlands on an airboat.",
      "This page ranks every day trip we track that starts at $100 or under by traveler ratings and review volume. Many include round-trip transport from the main hotel areas, which saves renting a car.",
    ],
    howToChoose: [
      {
        heading: "Transport included or not",
        text: "Tours with pickup cost more than admission alone but save on car rental, gas and parking. For one or two people, an included ride is often the cheaper choice overall.",
      },
      {
        heading: "Time on site",
        text: "Check how many hours you get at the destination. Long drives with short stops are poor value, even at a low price.",
      },
      {
        heading: "Pick by interest",
        text: "Space fans should choose Kennedy Space Center, beach lovers Clearwater, and nature lovers the springs or an airboat tour.",
      },
    ],
    goodToKnow: [
      "Pickup times for day trips are often early, between 6 and 8 a.m.",
      "Kennedy Space Center is about an hour east; Clearwater Beach is about two hours west.",
      "Admission may or may not be included. Read the inclusions list.",
      "Bring snacks, water and sunscreen for the ride.",
    ],
    faqs: [
      {
        q: "What is the best day trip from Orlando?",
        a: "Kennedy Space Center is the most popular and one of the highest-rated. For a beach day, Clearwater Beach on the Gulf coast is a favorite, and the springs north of Orlando are best for nature and manatees.",
      },
      {
        q: "Can you do a day trip from Orlando without a car?",
        a: "Yes. Many tours include pickup from hotels on International Drive, in Lake Buena Vista and in Kissimmee. Check the pickup area before booking.",
      },
    ],
    related: [
      { label: "All day trips from Orlando", href: "/book-now/day-trips" },
      { label: "Kennedy Space Center tours", href: "/book-now/kennedy-space-center" },
      { label: "KSC tickets vs a tour", href: "/blog/kennedy-space-center-tickets-vs-tour-with-transport" },
      { label: "Hotels near Kennedy Space Center", href: "/place-to-stay/hotels-near-kennedy-space-center" },
    ],
  },
  {
    slug: "cheap-food-tours-and-dining",
    kind: "cheap",
    h1: "Cheap Food Tours and Dining Experiences in Orlando Under $100",
    title: "Cheap Orlando Food Tours and Dining Under $100",
    description:
      "Orlando food tours, dining cruises and dinner experiences for $100 or less, from Mills 50 and Ivanhoe Village tastings to pontoon pub crawls.",
    label: "Cheap food tours and dining",
    noun: "food and dining experiences under $100",
    match: inCat("food-and-dining", 100),
    category: "food-and-dining",
    hotelArea: "downtown",
    intro: [
      "Orlando's food scene has grown far beyond theme park snacks. Neighborhoods like Mills 50, Ivanhoe Village and the Milk District are full of independent restaurants, and a guided food tour is the easiest way to taste the best of them in one afternoon.",
      "This page ranks every food tour, dining cruise and dinner experience we track that starts at $100 or less per person, using traveler ratings weighted by review volume. Most food tours include enough tastings to count as a full meal.",
    ],
    howToChoose: [
      {
        heading: "Food tour or dinner experience",
        text: "Walking food tours visit several restaurants and teach you about the neighborhood. Dinner cruises and shows are one sit-down meal with entertainment or a view.",
      },
      {
        heading: "Pick your neighborhood",
        text: "Mills 50 is known for Vietnamese and Asian food, Ivanhoe Village for local bars and eateries, and Winter Park for Park Avenue's cafes and boutiques.",
      },
      {
        heading: "Check drinks and dietary needs",
        text: "Some tours include alcohol and others offer it for an extra charge. Most can adapt for vegetarian diets and allergies with notice.",
      },
    ],
    goodToKnow: [
      "Arrive hungry: most food tours serve five or more tastings.",
      "Walking tours cover one to two miles at a gentle pace.",
      "Tours with alcohol require guests to be 21 or older to drink.",
      "Tell the operator about allergies when you book.",
    ],
    faqs: [
      {
        q: "Are Orlando food tours worth it?",
        a: "Yes, especially for repeat visitors. They show you the local neighborhoods most tourists never see, and the tastings usually add up to a full meal.",
      },
      {
        q: "Where do locals eat in Orlando?",
        a: "Mills 50, the Milk District, Ivanhoe Village, Thornton Park and Winter Park's Park Avenue and Hannibal Square are local favorites.",
      },
    ],
    related: [
      { label: "All food and dining experiences", href: "/book-now/food-and-dining" },
      { label: "Drinks and nightlife", href: "/book-now/drinks-and-nightlife" },
      { label: "Things to do near Downtown Orlando", href: "/book-now/things-to-do-near-downtown-orlando" },
    ],
  },
  {
    slug: "cheap-date-night-ideas",
    kind: "cheap",
    h1: "Cheap Date Night Ideas in Orlando Under $100",
    title: "Cheap Date Night Ideas in Orlando Under $100",
    description:
      "Romantic, affordable date ideas in Orlando for $100 or less per person: sunset kayak tours, sunset airboat rides, glow paddles and river dinner cruises.",
    label: "Cheap date night ideas",
    noun: "date night ideas under $100",
    match: inCat("couples", 100),
    category: "couples",
    hotelArea: "winter-park",
    intro: [
      "Orlando is not only for families. Some of the city's most memorable experiences are made for two, and many cost less than dinner at a theme park restaurant. For $100 or less per person you can paddle a clear kayak through Winter Park at sunset, watch the sky change color from an airboat, or take a glowing LED kayak out after dark.",
      "We rank every couples experience we track that starts at $100 or under by traveler ratings and review count, so you can plan a date that feels special without the splurge.",
    ],
    howToChoose: [
      {
        heading: "Golden hour is the magic",
        text: "Sunset tours are the most romantic time on the water. Book early, since these slots are limited and popular.",
      },
      {
        heading: "Active or relaxed",
        text: "Kayaks and paddleboards are active and intimate; airboats are a thrill; river cruises are the most relaxed and include a meal.",
      },
      {
        heading: "Make a night of it",
        text: "Pair a Winter Park sunset paddle with dinner on Park Avenue, or a downtown activity with cocktails in Thornton Park.",
      },
    ],
    goodToKnow: [
      "Sunset times shift through the year, so tour start times change by season.",
      "Bring bug spray for evening tours on the water.",
      "Glow tours run after dark and are cooler in summer.",
      "Most tours include free cancellation in case of storms.",
    ],
    faqs: [
      {
        q: "What is the most romantic thing to do in Orlando?",
        a: "A sunset clear kayak tour through the Winter Park chain of lakes is a top pick, followed by dinner on Park Avenue. For a bigger splurge, a night helicopter flight over the fireworks is unforgettable.",
      },
      {
        q: "What are good free date ideas in Orlando?",
        a: "Walk Lake Eola at dusk, explore Disney Springs or CityWalk, browse the Winter Park farmers market on Saturday morning, or catch a rocket launch from the coast.",
      },
    ],
    related: [
      { label: "All couples tours and events", href: "/book-now/couples" },
      { label: "Romantic things to do in Orlando", href: "/blog/romantic-things-to-do-in-orlando-for-couples" },
      { label: "Things to do near Winter Park", href: "/book-now/things-to-do-near-winter-park" },
      { label: "Cute date ideas in Orlando", href: "/book-now/cute-date-ideas-orlando-florida" },
    ],
  },

  /* ---------------- Private ---------------- */
  {
    slug: "private-tours-in-orlando",
    kind: "private",
    h1: "Private Tours in Orlando",
    title: "Private Tours in Orlando: Helicopter, Airboat & More",
    description:
      "Private tours in Orlando just for your group: helicopter flights, private airboats, fishing charters and birding trips, ranked by traveler reviews.",
    label: "Private tours",
    noun: "private tours",
    match: title(/\bprivate\b/i),
    hotelArea: "international-drive",
    intro: [
      "A private tour means no strangers, no waiting on other guests and a guide focused entirely on your group. In Orlando that includes private helicopter flights over the theme parks, private airboat rides on Lake Toho, guided fishing charters and small birding trips with an expert.",
      "This page lists every Orlando experience we track that is sold as a private tour, ranked by traveler ratings and review volume. They are ideal for families with young children, special occasions, multigenerational groups and anyone who wants the day on their own schedule.",
    ],
    howToChoose: [
      {
        heading: "Per person or per group",
        text: "Private tours are often priced per group or per boat. A price that looks high can be good value once it is split across four or six people, so check how the price is set.",
      },
      {
        heading: "Special occasions",
        text: "Birthdays, anniversaries and proposals are a great fit for private tours. Mention the occasion when you book so the guide can plan around it.",
      },
      {
        heading: "Accessibility and young kids",
        text: "Private tours are the most flexible option for travelers with mobility needs or small children who need breaks. Message the operator before booking to confirm.",
      },
    ],
    goodToKnow: [
      "Group size limits vary, especially for helicopters and boats. Check the maximum.",
      "Some private tours can pick up at your hotel for an extra fee.",
      "Tipping your guide is customary for private tours.",
      "Private slots are limited, so book early for holidays.",
    ],
    faqs: [
      {
        q: "Are private tours in Orlando worth it?",
        a: "For groups of four or more, special occasions or families with small children, often yes. You get flexible timing, no waiting on others and a guide who tailors the experience to you.",
      },
      {
        q: "How far ahead should I book a private tour?",
        a: "Two to four weeks ahead is safe for most dates, and earlier for holidays, spring break and weekends.",
      },
    ],
    related: [
      { label: "Private fishing charters", href: "/book-now/private-fishing-charters-in-orlando" },
      { label: "Helicopter and balloon rides", href: "/book-now/hot-air-balloons" },
      { label: "Luxury resort hotels in Orlando", href: "/place-to-stay/luxury-resort-hotels-in-orlando" },
      { label: "Airboat and wildlife tours", href: "/book-now/airboat-and-wildlife" },
    ],
  },
  {
    slug: "private-fishing-charters-in-orlando",
    kind: "private",
    h1: "Private Fishing Charters in Orlando",
    title: "Private Fishing Charters in Orlando: Bass Fishing Guides",
    description:
      "Private bass fishing charters near Orlando on Lake Toho, the Butler Chain and more, with licensed guides, gear and boats included. Ranked by reviews.",
    label: "Private fishing charters",
    noun: "private fishing charters",
    // Lakes within about an hour of Orlando; far-off trips (Okeechobee, Sebring, Palatka) are left out.
    match: both(title(/\bprivate\b/i), /fishing|bass/i, /fort pierce|okeechobee|palatka|rodman|sebring|istokpoga|lake placid|lake june/i),
    hotelArea: "kissimmee",
    intro: [
      "Central Florida is one of the best places in the country to catch largemouth bass, and many of the top lakes are within 30 minutes of the theme parks. A private charter gives you a guide, a boat and gear for your group only, which makes it easy for beginners and rewarding for experienced anglers.",
      "This page ranks every private fishing charter we track near Orlando, including trips on Lake Tohopekaliga in Kissimmee, the Butler Chain of Lakes near Windermere and other well-known bass lakes within about an hour of the parks, by traveler ratings and review volume.",
    ],
    howToChoose: [
      {
        heading: "Pick the lake",
        text: "Lake Toho in Kissimmee is famous for trophy bass. The Butler Chain near Windermere is clear and scenic and close to Disney. Lakes in the Winter Haven and Harris chains are a little farther but often less busy.",
      },
      {
        heading: "Half day or full day",
        text: "Half-day trips suit families and first-timers. Full days give serious anglers more time to find bigger fish.",
      },
      {
        heading: "Check group size and gear",
        text: "Most bass boats take two or three anglers. Confirm the maximum and whether rods, bait and tackle are included.",
      },
    ],
    goodToKnow: [
      "Ask whether a Florida freshwater fishing license is needed. Anglers 16 and older generally need one, and some guides can advise how to buy it online.",
      "Most bass trips are catch-and-release.",
      "Early morning starts give the best bite, especially in summer.",
      "Bring sunscreen, polarized sunglasses and a hat.",
    ],
    faqs: [
      {
        q: "Where is the best bass fishing near Orlando?",
        a: "Lake Tohopekaliga in Kissimmee is the best known, along with the Butler Chain of Lakes, the Kissimmee Chain and Lake Kissimmee. Your guide will pick the best spot for the season.",
      },
      {
        q: "Can kids go on a fishing charter?",
        a: "Yes. Private charters are a great way for kids to catch their first fish. Tell the guide the ages so they can plan an easy, action-packed trip.",
      },
    ],
    related: [
      { label: "Private tours in Orlando", href: "/book-now/private-tours-in-orlando" },
      { label: "Water adventures", href: "/book-now/water-adventures" },
      { label: "Things to do near Kissimmee", href: "/book-now/things-to-do-near-kissimmee" },
    ],
  },

  /* ---------------- Near an area ---------------- */
  {
    slug: "things-to-do-near-international-drive",
    kind: "near",
    h1: "Things To Do Near International Drive",
    title: "Things To Do Near International Drive, Orlando",
    description:
      "The best things to do on and near International Drive in Orlando: ICON Park, The Wheel, SEA LIFE, escape rooms and more, plus hotels nearby.",
    label: "Near International Drive",
    noun: "things to do near International Drive",
    match: title(
      /international drive|\bi-?drive\b|icon park|orlando eye|sea life|madame tussauds|starflyer|titanic|wonderworks|museum of illusions|seaworld|aquatica|andretti|pointe orlando/i,
    ),
    hotelArea: "international-drive",
    intro: [
      "International Drive, or I-Drive, is Orlando's main tourist corridor: an 11-mile stretch of hotels, restaurants and attractions between Universal Orlando at the north end and SeaWorld near the south end. If you are staying here, you can fill days without getting in the car.",
      "This page ranks the bookable experiences on and around I-Drive by traveler ratings and review volume, and adds the free and local highlights that booking sites do not list.",
    ],
    local: {
      heading: "Free and local highlights on I-Drive",
      items: [
        { name: "ICON Park", text: "Free to walk, with restaurants, bars and the 400-foot Wheel lit up at night." },
        { name: "Pointe Orlando", text: "An open-air shopping and dining center across from the Orange County Convention Center." },
        { name: "I-RIDE Trolley", text: "A low-cost trolley that runs the length of International Drive, so you can skip parking fees." },
        { name: "Orlando Vineland Premium Outlets", text: "Designer outlet shopping at the south end of I-Drive, near Disney." },
      ],
    },
    howToChoose: [
      {
        heading: "North, central or south I-Drive",
        text: "The north end is closest to Universal and the outlets, central I-Drive has ICON Park and the convention center, and the south end is near SeaWorld and Disney.",
      },
      {
        heading: "Combine ICON Park attractions",
        text: "The Wheel, SEA LIFE and Madame Tussauds are side by side. Multi-attraction tickets save money if you plan to do two or three.",
      },
      {
        heading: "Evenings are the best time",
        text: "I-Drive is at its liveliest after dark, when The Wheel lights up and restaurants fill. Save indoor attractions for hot afternoons.",
      },
    ],
    goodToKnow: [
      "Traffic on I-Drive is heavy in the evening. The trolley or walking is often faster.",
      "Parking at attractions is usually paid; many hotels charge for parking too.",
      "Many tours with hotel pickup collect from I-Drive hotels.",
      "Sidewalks are wide, but crossings are long. Use marked crosswalks.",
    ],
    faqs: [
      {
        q: "Is International Drive a good place to stay in Orlando?",
        a: "Yes, especially for first-time visitors splitting time between Disney, Universal and SeaWorld. It is central, has hotels at every budget and has plenty to do in the evenings.",
      },
      {
        q: "Can you walk International Drive?",
        a: "You can walk the central section between ICON Park and Pointe Orlando easily. For the full length, use the I-RIDE Trolley or a rideshare.",
      },
    ],
    related: [
      { label: "Cheap attractions and sightseeing", href: "/book-now/cheap-attractions-and-sightseeing" },
      { label: "Hotels near the Orange County Convention Center", href: "/place-to-stay/hotels-near-orange-county-convention-center" },
      { label: "Hotels near SeaWorld Orlando", href: "/place-to-stay/hotels-near-seaworld-orlando" },
    ],
  },
  {
    slug: "things-to-do-near-kissimmee",
    kind: "near",
    h1: "Things To Do Near Kissimmee",
    title: "Things To Do Near Kissimmee, Florida",
    description:
      "The best things to do in and near Kissimmee: airboat rides on Lake Toho, Fun Spot, bass fishing, lakefront bike tours and Old Town, plus nearby hotels.",
    label: "Near Kissimmee",
    noun: "things to do near Kissimmee",
    match: title(/kissimmee|lake toho|tohopekaliga|\bst\.? cloud\b|old town|gatorland|boggy creek|island h2o|fun spot/i),
    hotelArea: "kissimmee",
    intro: [
      "Kissimmee sits just south of Walt Disney World and is home to thousands of vacation homes and budget-friendly hotels. It also has its own side of Florida that many visitors miss: airboat rides and bass fishing on Lake Tohopekaliga, lakefront bike trails, Old Town's rides and car shows, and Fun Spot's coasters.",
      "This page ranks the bookable experiences in and around Kissimmee by traveler ratings and review count, and adds local highlights you can enjoy for free.",
    ],
    local: {
      heading: "Free and local highlights in Kissimmee",
      items: [
        { name: "Kissimmee Lakefront Park", text: "A lakefront promenade on Lake Toho with walking paths, a playground and sunset views." },
        { name: "Old Town Kissimmee", text: "Free to enter, with shops, restaurants, rides and classic car cruises on weekend evenings." },
        { name: "Downtown Kissimmee", text: "Broadway Avenue has local restaurants and a laid-back small-town feel." },
        { name: "Shingle Creek Regional Park", text: "Trails and paddling along the headwaters of the Everglades." },
      ],
    },
    howToChoose: [
      {
        heading: "Get on Lake Toho",
        text: "Airboat rides and fishing charters on Lake Tohopekaliga are the signature Kissimmee experiences, with gators, eagles and big bass.",
      },
      {
        heading: "Thrills along US-192",
        text: "Fun Spot and Old Town offer coasters, go-karts and rides that are easy to fit into an evening.",
      },
      {
        heading: "Slow down on two wheels",
        text: "Lakefront e-bike and mountain bike tours are a relaxed way to see the area, and some offer child trailers.",
      },
    ],
    goodToKnow: [
      "You will want a car in Kissimmee; attractions are spread out.",
      "Kissimmee is 10 to 20 minutes from Disney's main gates without traffic.",
      "Vacation homes with pools are the best value for big groups.",
      "Summer storms usually arrive in the afternoon, so book water activities early.",
    ],
    faqs: [
      {
        q: "Is Kissimmee close to Disney World?",
        a: "Yes. Much of Kissimmee is 10 to 20 minutes from Disney's parks, which is why it is so popular with families who want more space for less money.",
      },
      {
        q: "What is Kissimmee known for?",
        a: "Vacation homes, Lake Tohopekaliga's airboats and bass fishing, Old Town and its car shows, and easy access to Disney World.",
      },
    ],
    related: [
      { label: "Cheap airboat and wildlife tours", href: "/book-now/cheap-airboat-and-wildlife-tours" },
      { label: "Private fishing charters", href: "/book-now/private-fishing-charters-in-orlando" },
      { label: "Best hotels in Kissimmee", href: "/place-to-stay#kissimmee" },
    ],
  },
  {
    slug: "things-to-do-near-disney-world",
    kind: "near",
    h1: "Things To Do Near Disney World",
    title: "Things To Do Near Disney World (Besides the Parks)",
    description:
      "Things to do near Walt Disney World besides the parks: Disney water parks, Lake Buena Vista watersports, Disney Springs and more, plus nearby hotels.",
    label: "Near Disney World",
    noun: "things to do near Disney World",
    match: title(/disney|lake buena vista|epcot|magic kingdom|animal kingdom|hollywood studios|typhoon lagoon|blizzard beach/i),
    includeFlagged: true,
    hotelArea: "disney",
    intro: [
      "Staying near Walt Disney World does not mean every day has to be a park day. The Lake Buena Vista area around Disney has jet ski rentals, wakeboarding and kayaking on nearby lakes, Disney's two water parks and Disney Springs, where shopping, dining and entertainment are free to enter.",
      "This page ranks the bookable experiences in and around the Disney area by traveler ratings and review volume, including official tickets, and lists the free highlights that make great rest days.",
    ],
    local: {
      heading: "Free and local highlights near Disney",
      items: [
        { name: "Disney Springs", text: "Free entry and free parking, with shops, restaurants, live music and a waterfront promenade." },
        { name: "Disney resort hopping", text: "You can visit Disney resort hotels for dining and lobby sightseeing, and ride resort transportation between them." },
        { name: "Celebration", text: "Disney's former planned town next door, with a lakeside downtown made for evening strolls." },
        { name: "Fireworks from outside the parks", text: "Some resort beaches and restaurants have views of the nightly fireworks." },
      ],
    },
    howToChoose: [
      {
        heading: "Rest days between park days",
        text: "Plan a water park or watersports morning between big park days to keep everyone fresh.",
      },
      {
        heading: "Stay close to cut commute time",
        text: "Experiences listed from Lake Buena Vista are minutes from Disney hotels, so you can fit them in before or after the parks.",
      },
      {
        heading: "Check water park calendars",
        text: "Typhoon Lagoon and Blizzard Beach take turns closing for refurbishment in cooler months.",
      },
    ],
    goodToKnow: [
      "Theme park parking is paid for day guests, but Disney Springs parking is free.",
      "Disney resort guests get Early Theme Park Entry at every park.",
      "Watersports operators near Disney usually require a valid ID and have age limits for drivers.",
      "Afternoon storms are common in summer, so plan outdoor activities for the morning.",
    ],
    faqs: [
      {
        q: "What can you do at Disney World without a park ticket?",
        a: "Visit Disney Springs, tour the resort hotels, eat at resort restaurants, play mini golf, or book a water park day. None of these need a theme park ticket.",
      },
      {
        q: "Where should I stay near Disney World?",
        a: "On Disney property for early park entry and Disney transport, or in Lake Buena Vista and Bonnet Creek for more choice at lower prices. See our best hotels page for picks.",
      },
    ],
    related: [
      { label: "Cheap theme park tickets", href: "/book-now/cheap-theme-park-tickets" },
      { label: "Hotels near Disney World", href: "/place-to-stay/hotels-near-disney-world" },
      { label: "Best theme parks in Orlando", href: "/blog/best-theme-parks-in-orlando" },
    ],
  },
  {
    slug: "things-to-do-near-downtown-orlando",
    kind: "near",
    h1: "Things To Do Near Downtown Orlando",
    title: "Things To Do Near Downtown Orlando",
    description:
      "The best things to do in and near Downtown Orlando: ghost tours, Mills 50 and Ivanhoe food tours, Lake Eola, night bike tours and more, plus hotels.",
    label: "Near Downtown Orlando",
    noun: "things to do near Downtown Orlando",
    match: title(
      /downtown orlando|lake eola|mills 50|ivanhoe|milk district|thornton park|church street|night bike tour|historical highlights/i,
    ),
    includeFlagged: true,
    hotelArea: "downtown",
    intro: [
      "Downtown Orlando is where locals live, eat and go out. Beyond the theme parks you will find Lake Eola Park and its swan boats, the food halls and Vietnamese restaurants of Mills 50, the bars of Ivanhoe Village and the Milk District, and the arenas where the Orlando Magic and Orlando City play.",
      "This page ranks the bookable experiences in and around downtown by traveler ratings and review volume, from the city's top-rated ghost tour to neighborhood food tours, and adds the best free things to do nearby.",
    ],
    local: {
      heading: "Free and local highlights downtown",
      items: [
        { name: "Lake Eola Park", text: "The heart of downtown, with a walking loop, the fountain, swan boat rentals and a Sunday farmers market." },
        { name: "Thornton Park", text: "Brick streets, cafes and bars just east of Lake Eola." },
        { name: "Church Street", text: "Historic buildings, restaurants and the Church Street SunRail station." },
        { name: "Dr. Phillips Center", text: "Broadway tours, concerts and a free public plaza in the arts district." },
      ],
    },
    howToChoose: [
      {
        heading: "Eat your way through the neighborhoods",
        text: "Food tours in Mills 50, Ivanhoe Village and the Milk District are the fastest way to find the local favorites.",
      },
      {
        heading: "Go after dark",
        text: "The ghost tour and night bike tour show downtown at its liveliest, when the bars and restaurants are busy.",
      },
      {
        heading: "Catch a game or a show",
        text: "Check the schedules for the Orlando Magic, Orlando City SC and the Dr. Phillips Center when you plan your downtown night.",
      },
    ],
    goodToKnow: [
      "Downtown is 20 to 30 minutes from the theme parks without traffic.",
      "Street parking and garages are paid; rideshare is easiest on busy nights.",
      "SunRail connects downtown with Winter Park.",
      "Event nights at the arenas bring heavy traffic, so plan ahead.",
    ],
    faqs: [
      {
        q: "Is Downtown Orlando worth visiting?",
        a: "Yes, especially if you want food, nightlife and a local feel. Lake Eola, the neighborhood food scene and the sports and arts venues make it a great half day or evening.",
      },
      {
        q: "What is there to do in Downtown Orlando at night?",
        a: "Take the ghost tour or a night bike tour, eat in Mills 50 or Thornton Park, catch a Magic game or a show, and finish with cocktails around Lake Eola.",
      },
    ],
    related: [
      { label: "Cheap food tours and dining", href: "/book-now/cheap-food-tours-and-dining" },
      { label: "Drinks and nightlife", href: "/book-now/drinks-and-nightlife" },
      { label: "Best hotels downtown", href: "/place-to-stay#downtown" },
    ],
  },
  {
    slug: "things-to-do-near-winter-park",
    kind: "near",
    h1: "Things To Do Near Winter Park",
    title: "Things To Do Near Winter Park, Florida",
    description:
      "The best things to do in Winter Park, Florida: clear kayak tours on the chain of lakes, Park Avenue food tours, ghost walks and more, plus hotels.",
    label: "Near Winter Park",
    noun: "things to do near Winter Park",
    match: title(/winter park|maitland|rollins/i),
    includeFlagged: true,
    hotelArea: "winter-park",
    intro: [
      "Winter Park, just north of Downtown Orlando, feels like a different world from the theme parks: brick streets, oak-shaded parks, the boutiques and cafes of Park Avenue, and a chain of lakes linked by narrow canals lined with historic homes.",
      "This page ranks the bookable experiences in and around Winter Park by traveler ratings and review volume, led by some of the highest-rated kayak tours in the Orlando area, and adds the town's best free highlights.",
    ],
    local: {
      heading: "Free and local highlights in Winter Park",
      items: [
        { name: "Park Avenue", text: "Boutiques, cafes and restaurants along Central Park, perfect for an afternoon stroll." },
        { name: "Winter Park Farmers' Market", text: "Saturday mornings at the historic train depot." },
        { name: "Kraft Azalea Garden", text: "A lakeside garden on Lake Maitland with huge cypress trees and sunset views." },
        { name: "Hannibal Square", text: "A walkable dining district just west of Park Avenue." },
      ],
    },
    howToChoose: [
      {
        heading: "See the lakes from the water",
        text: "Clear kayak and paddleboard tours glide through the canals and past lakefront estates. The narrated Scenic Boat Tour, running since 1938, is the relaxed alternative.",
      },
      {
        heading: "Taste Park Avenue",
        text: "A walking food tour is a great introduction to the local restaurants before you pick a spot for dinner.",
      },
      {
        heading: "Time it for sunset",
        text: "Sunset and glow-in-the-dark paddles are Winter Park's most romantic experiences and sell out early.",
      },
    ],
    goodToKnow: [
      "Winter Park is 30 to 40 minutes from the major theme parks.",
      "SunRail stops in the middle of town, a short walk from Park Avenue.",
      "Parking on Park Avenue is limited on weekends; arrive early.",
      "The Charles Hosmer Morse Museum, home to a famous Tiffany collection, is on Park Avenue.",
    ],
    faqs: [
      {
        q: "Is Winter Park worth visiting from Orlando?",
        a: "Yes. It is one of the prettiest places in Central Florida, with great food, shopping and some of the best-rated kayak tours in the area. It is an easy half day from anywhere in Orlando.",
      },
      {
        q: "What is Winter Park, Florida known for?",
        a: "Park Avenue, the chain of lakes and its Scenic Boat Tour, Rollins College, the Morse Museum's Tiffany collection and a charming small-town feel.",
      },
    ],
    related: [
      { label: "Cheap kayak and water activities", href: "/book-now/cheap-kayak-and-water-activities" },
      { label: "Cheap date night ideas", href: "/book-now/cheap-date-night-ideas" },
      { label: "Hotels near downtown Winter Park", href: "/place-to-stay/hotels-near-downtown-winter-park" },
    ],
  },
];

export const collectionBySlug = new Map(collections.map((c) => [c.slug, c]));

/** Collections need this many distinct experiences to be indexed and listed. */
export const MIN_ITEMS = 6;

export interface BuiltCollection {
  config: CollectionConfig;
  items: Listing[];
  totalMatches: number;
  updated: string;
  stats: {
    minPrice?: number;
    medianPrice?: number;
    avgRating?: number;
    totalReviews: number;
    medianMinutes?: number;
    freeCancellation: number;
  };
  /** What the collection is made of, by site category. */
  mix: { key: CategoryKey; count: number }[];
  picks: { label: string; listing: Listing }[];
  indexable: boolean;
}

export const getCollection = cache(async (slug: string, limit = 12): Promise<BuiltCollection | null> => {
  const config = collectionBySlug.get(slug);
  if (!config) return null;
  const live = await getLiveListings();
  const matches = live.filter(
    (l) =>
      !TRANSPORT.test(l.title) &&
      !NOT_AN_EXPERIENCE.test(l.title) &&
      (config.includeFlagged || !(l.tags ?? []).some((t) => LOW_QUALITY_TAG.test(t.trim()))) &&
      config.match(l),
  );

  const reviewed = matches.filter((l) => (l.rating ?? 0) >= 4 && (l.reviewCount ?? 0) >= 3);
  const rest = matches.filter((l) => !reviewed.includes(l));
  // Well-reviewed experiences first, then newer listings so small collections still fill out.
  const pool = [...reviewed.sort((a, b) => rankScore(b) - rankScore(a)), ...rest.sort((a, b) => rankScore(b) - rankScore(a))];

  const items: Listing[] = [];
  if (config.topRated) {
    items.push(...(await getTopRated(config.topRated.limit, 100, 2)));
  } else {
    for (const l of pool) {
      if (items.some((i) => similar(i.title, l.title))) continue;
      items.push(l);
      if (items.length >= limit) break;
    }
  }

  const prices = matches.map((l) => l.priceFrom).filter((p): p is number => !!p);
  const rated = matches.filter((l) => l.rating && l.reviewCount);
  const totalReviews = rated.reduce((s, l) => s + (l.reviewCount ?? 0), 0);
  const avgRating = totalReviews
    ? rated.reduce((s, l) => s + (l.rating ?? 0) * (l.reviewCount ?? 0), 0) / totalReviews
    : undefined;

  const mixCount = new Map<CategoryKey, number>();
  for (const l of matches) {
    const key = l.categories[0];
    if (key) mixCount.set(key, (mixCount.get(key) ?? 0) + 1);
  }

  const picks: { label: string; listing: Listing }[] = [];
  const addPick = (label: string, l?: Listing) => {
    if (l && !picks.some((p) => p.listing.slug === l.slug)) picks.push({ label, listing: l });
  };
  const reviewedItems = items.filter((l) => reviewed.includes(l));
  addPick("Best overall", reviewedItems[0] ?? items[0]);
  addPick("Most reviewed", [...reviewedItems].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))[0]);
  addPick("Lowest price", [...items].filter((l) => l.priceFrom).sort((a, b) => a.priceFrom! - b.priceFrom!)[0]);
  addPick("Quickest", [...items].filter((l) => l.durationMinutes).sort((a, b) => a.durationMinutes! - b.durationMinutes!)[0]);

  return {
    config,
    items,
    totalMatches: matches.length,
    updated: (snapshotDate() ?? new Date().toISOString()).slice(0, 10),
    stats: {
      minPrice: prices.length ? Math.min(...prices) : undefined,
      medianPrice: median(prices),
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : undefined,
      totalReviews,
      medianMinutes: median(matches.map((l) => l.durationMinutes).filter((m): m is number => !!m)),
      freeCancellation: matches.filter((l) => l.freeCancellation).length,
    },
    mix: [...mixCount.entries()].sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ key, count })),
    picks: picks.slice(0, 4),
    indexable: items.length >= MIN_ITEMS,
  };
});

/** Collections with enough experiences to list in navigation and the sitemap. */
export const getIndexableCollections = cache(async (): Promise<CollectionConfig[]> => {
  const built = await Promise.all(collections.map((c) => getCollection(c.slug)));
  return built.filter((b): b is BuiltCollection => !!b && b.indexable).map((b) => b.config);
});

export const kindLabel: Record<CollectionKind, string> = {
  top: "Top rated",
  ideas: "Date and trip ideas",
  budget: "Things to do by budget",
  cheap: "Cheap things to do by type",
  private: "Private tours",
  near: "Things to do by area",
};
