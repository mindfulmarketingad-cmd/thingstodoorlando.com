import "server-only";
import { cache } from "react";
import type { CategoryKey, IllustrationKey, Listing } from "./types";
import { getLiveListings, snapshotDate } from "./listings";

/**
 * Programmatic "Best X In Orlando" listicles. Editorial copy is written by
 * hand; the ranked list is computed from the Viator snapshot every rebuild,
 * so rankings, prices and review counts stay current.
 */
export interface ListicleConfig {
  slug: string;
  title: string;
  /** Singular noun used in generated copy, e.g. "kayaking tour". */
  noun: string;
  description: string;
  illustration: IllustrationKey;
  category: CategoryKey;
  /** Matches Viator tag names. */
  tags: RegExp;
  /** Matches product titles. */
  title_re: RegExp;
  /** Titles to leave out even if they match. */
  exclude?: RegExp;
  /** Title must also match this (e.g. ticket products only). */
  must?: RegExp;
  /** Also match any listing in this site category. */
  categoryMatch?: CategoryKey;
  /** Keep products Viator flags as low quality (official park tickets carry these flags). */
  includeFlagged?: boolean;
  /** Minimum traveler rating for the ranked pool (default 4). */
  minRating?: number;
  intro: string[];
  howToChoose: { heading: string; text: string }[];
  goodToKnow: string[];
  faqs: { q: string; a: string }[];
}

/** Transfers and transport-only products are never "things to do". */
const TRANSPORT = /transfer|shuttle|private driver|airport|cruise port|port to |to port|limo(usine)? service|car service/i;
/** Viator's own low-quality and inactive flags. */
const LOW_QUALITY_TAG = /^(zombie|zombie slice|agent low quality product)$/i;

export const listicles: ListicleConfig[] = [
  {
    slug: "best-kayaking-tours-in-orlando",
    title: "Best Kayaking Tours In Orlando",
    noun: "kayaking tour",
    description:
      "The best kayaking tours in and near Orlando, ranked by real traveler reviews: clear kayak manatee trips, spring runs and paddleboard tours with prices.",
    illustration: "water",
    category: "water",
    tags: /^(kayaking tours|stand up paddleboarding|canoeing)$/i,
    title_re: /kayak|paddleboard|paddle board|canoe|\bsup\b/i,
    intro: [
      "Central Florida sits on one of the largest concentrations of freshwater springs in the world, and a kayak is the best way to see them. Within about 90 minutes of Orlando you can paddle over water so clear it looks like glass, drift past turtles and wading birds, and in the cooler months share the river with manatees.",
      "We ranked every kayaking and paddleboard tour near Orlando on Viator using traveler ratings and review volume, then added the practical details you need to choose: how long each trip lasts, what it costs and who it suits best.",
    ],
    howToChoose: [
      {
        heading: "Clear kayak or standard kayak",
        text: "Clear-bottom and glass-bottom kayaks let you watch fish, turtles and spring vents beneath you. They cost a little more and are best in spring-fed water. Standard kayaks are lighter and more stable, which suits longer paddles and beginners.",
      },
      {
        heading: "Guided tour or rental",
        text: "Guided tours include a naturalist who spots wildlife and explains the ecosystem, plus a safety briefing. Rentals are cheaper and flexible, but you plan the route yourself and wildlife is easier to miss.",
      },
      {
        heading: "Season matters",
        text: "Manatees gather in warm springs from roughly November through March, so winter trips offer the best sightings. Summer paddles are best booked for the morning, before afternoon thunderstorms roll in.",
      },
      {
        heading: "Distance from Orlando",
        text: "Wekiva-area springs are about 30 minutes from downtown, while Silver Springs, Rainbow Springs and the Crystal River area are 75 to 100 minutes away. Check whether transportation is included before you book.",
      },
    ],
    goodToKnow: [
      "Most tours welcome beginners, but you should be comfortable getting in and out of a kayak.",
      "Bring water shoes, sunscreen and a dry bag for your phone.",
      "Touching or chasing manatees is illegal. Guides will brief you on passive observation.",
      "Popular springs can reach capacity on weekends, so morning tours are the safest bet.",
    ],
    faqs: [
      {
        q: "Where is the best kayaking near Orlando?",
        a: "Wekiwa Springs and Rock Springs Run are the closest clear-water paddles to Orlando. Silver Springs and Rainbow Springs are a longer drive but famous for glass-clear water, and the Crystal River area is the top choice for manatees in winter.",
      },
      {
        q: "Can you see manatees on a kayak tour near Orlando?",
        a: "Yes, especially from November through March when manatees move into warm spring water. Sightings are common on winter tours at Blue Spring, Silver Springs and Crystal River but are never guaranteed.",
      },
      {
        q: "Are kayaking tours in Orlando good for beginners?",
        a: "Most guided spring tours are designed for beginners, with calm, slow-moving water and a guide nearby. Check the listing for minimum ages and any swimming requirements.",
      },
    ],
  },
  {
    slug: "best-nature-and-wildlife-tours-in-orlando",
    title: "Best Nature and Wildlife Tours In Orlando",
    noun: "nature and wildlife tour",
    description:
      "The best nature and wildlife tours in Orlando, ranked by traveler reviews: airboat gator spotting, manatee trips, safaris and eco tours with prices.",
    illustration: "wildlife",
    category: "wildlife",
    tags: /^(nature and wildlife tours|eco tours|wildlife watching|wildlife encounters|zoos & wildlife parks|bird watching|nature walks|dolphin watching|nature parks|natural attractions)$/i,
    title_re: /wildlife|nature|manatee|gator|alligator|eco tour|eco-tour|safari|swamp|everglades|dolphin|bird/i,
    // Kayak trips have their own list; keep this one varied.
    exclude: /kayak|paddle/i,
    intro: [
      "Orlando is surrounded by some of the most accessible wild places in Florida. The Everglades headwaters start just south of the city, spring-fed rivers run to the north, and the Atlantic coast is an hour east. That means alligators, bald eagles, manatees and dolphins are all realistic sightings on a half-day trip.",
      "This list ranks every nature and wildlife tour near Orlando on Viator by traveler rating and review volume. Use it to compare airboat rides, safari parks, manatee encounters and eco tours side by side.",
    ],
    howToChoose: [
      {
        heading: "Pick your animal",
        text: "Airboat tours are the most reliable way to see wild alligators. Spring and river trips are best for manatees and turtles, especially in winter. Coastal boat tours from the Space Coast focus on dolphins and seabirds.",
      },
      {
        heading: "Wild habitat or wildlife park",
        text: "Tours in natural habitat feel more authentic, but sightings are never guaranteed. Wildlife parks and drive-through safaris guarantee close encounters and work well with younger kids.",
      },
      {
        heading: "Timing",
        text: "Animals are most active in the early morning and late afternoon. Morning tours also avoid the summer heat and the afternoon storms that are common from June through September.",
      },
      {
        heading: "Group size",
        text: "Small-group and private tours give you more time with the guide and a better chance at photos. Larger group tours are usually the best value.",
      },
    ],
    goodToKnow: [
      "Bring binoculars, a hat, sunscreen and insect repellent.",
      "Airboats are loud. Most operators provide hearing protection.",
      "Wild animals are unpredictable, so treat any specific sighting as a bonus.",
      "Respect wildlife distances. Feeding or touching wild animals is illegal in Florida.",
    ],
    faqs: [
      {
        q: "Where can I see alligators in the wild near Orlando?",
        a: "Airboat tours on the lakes and marshes around Kissimmee and Lake Tohopekaliga are the easiest way to see wild alligators, usually less than 45 minutes from the main tourist areas.",
      },
      {
        q: "What is the best time of year for wildlife tours in Orlando?",
        a: "Spring and fall offer comfortable temperatures and active wildlife. Winter is best for manatees, while summer tours are still great if you book early in the day.",
      },
      {
        q: "Are wildlife tours in Orlando good for kids?",
        a: "Yes. Airboat rides, wildlife parks and safari-style attractions are very family friendly. For toddlers, choose shorter tours or parks with shaded viewing areas.",
      },
    ],
  },
  {
    slug: "best-theme-parks-in-orlando",
    title: "Best Theme Parks In Orlando",
    noun: "theme park experience",
    description:
      "The best theme parks in Orlando plus the top-rated tickets and park experiences to book, ranked by traveler reviews with current prices.",
    illustration: "theme-parks",
    category: "theme-parks",
    // Viator's generic "Theme Parks" tag also covers unrelated attractions, so match park names only.
    tags: /^(disney® parks|universal theme parks)$/i,
    title_re: /disney world|walt disney|universal orlando|universal studios|islands of adventure|seaworld|legoland|busch gardens|epic universe|magic kingdom|epcot|hollywood studios|animal kingdom|fun spot|peppa pig theme park/i,
    must: /ticket|admission/i,
    exclude: /kennedy|cirque|show\b|dinner|helicopter|flight|special event|attraction pass|explorer pass|orlando pass|transport|water park/i,
    includeFlagged: true,
    minRating: 0,
    intro: [
      "Orlando is the theme park capital of the world. Walt Disney World has four major parks, Universal Orlando Resort has three including Epic Universe, and SeaWorld, LEGOLAND Florida and a handful of water parks round out the list. Deciding which ones to visit is the biggest planning decision most Orlando travelers make.",
      "Below we cover the parks themselves, then rank the best-reviewed theme park tickets and experiences you can book on Viator. Always confirm what each ticket includes, since park reservations, dates and add-ons vary.",
    ],
    howToChoose: [
      {
        heading: "Walt Disney World",
        text: "Magic Kingdom is the classic pick for young kids and first-timers. EPCOT suits food lovers and older kids, Hollywood Studios leans toward Star Wars and thrill rides, and Animal Kingdom combines rides with a real safari.",
      },
      {
        heading: "Universal Orlando Resort",
        text: "Universal Studios Florida and Islands of Adventure are the go-to parks for teens and thrill seekers, and are linked by the Hogwarts Express on park-to-park tickets. Epic Universe, which opened in 2025, adds several new themed worlds.",
      },
      {
        heading: "SeaWorld, LEGOLAND and more",
        text: "SeaWorld Orlando mixes marine life with big coasters. LEGOLAND Florida in Winter Haven is built for kids ages 2 to 12. Busch Gardens Tampa Bay is an easy day trip for coaster fans.",
      },
      {
        heading: "Save money on tickets",
        text: "Most parks use date-based pricing, so weekdays outside school holidays are cheaper. Multi-day tickets lower the cost per day. Only buy from authorized sellers, since resold or partially used tickets are often invalid.",
      },
    ],
    goodToKnow: [
      "Arrive before opening to ride headliners with shorter waits.",
      "Check height requirements before promising kids a ride.",
      "Summer afternoons bring heat and storms. Plan indoor attractions for the afternoon.",
      "Read the inclusions on every ticket, including parking, park reservations and express passes.",
    ],
    faqs: [
      {
        q: "What is the best theme park in Orlando?",
        a: "For families with young kids, Magic Kingdom is the most popular choice. For thrill seekers and teens, Universal's Islands of Adventure and Epic Universe are top picks. The best park depends on ages and interests.",
      },
      {
        q: "How many days do you need for Orlando theme parks?",
        a: "Plan about one day per park. Most families spend four to six park days on a week-long trip, with a rest day or non-park activity in between.",
      },
      {
        q: "What is the cheapest time to visit Orlando theme parks?",
        a: "January after the holidays, early February, late August and September typically have the lowest date-based ticket prices and lighter crowds.",
      },
    ],
  },
  {
    slug: "best-airboat-tours-in-orlando",
    title: "Best Airboat Tours In Orlando",
    noun: "airboat tour",
    description:
      "The best airboat tours in Orlando ranked by real traveler reviews. Compare prices, ride length and gator-spotting odds on the Everglades headwaters.",
    illustration: "wildlife",
    category: "wildlife",
    tags: /^airboat tours$/i,
    title_re: /airboat/i,
    intro: [
      "An airboat ride is one of the most Florida things you can do, and you do not have to drive to the Everglades to take one. The lakes and marshes south of Orlando, around Kissimmee and Lake Tohopekaliga, are the headwaters of the Everglades system, and several operators run daily rides less than an hour from International Drive.",
      "We ranked every airboat tour near Orlando on Viator by traveler rating and number of reviews. Compare ride length, price and what is included, from quick 30-minute rides to combo tickets with wildlife parks.",
    ],
    howToChoose: [
      {
        heading: "Ride length",
        text: "Thirty-minute rides are great for younger kids and tight schedules. Sixty to ninety minute tours cover more ground and give you better odds of seeing alligators, eagles and wading birds.",
      },
      {
        heading: "Group or private",
        text: "Group airboats are the best value. Private boats cost more but let you set the pace and linger for photos.",
      },
      {
        heading: "Day or night",
        text: "Daytime tours are best for birds and scenery. Night tours, when offered, use spotlights to reveal the glowing eyes of alligators and are a thrill for older kids.",
      },
      {
        heading: "Combo tickets",
        text: "Some tours include admission to a wildlife park, lunch or animal encounters. These can be good value if you want a full half-day outing.",
      },
    ],
    goodToKnow: [
      "Airboats are loud, so hearing protection is provided on most tours.",
      "Morning and late-afternoon rides usually have the best wildlife activity.",
      "Bring sunglasses, a hat that will not blow away and a light layer.",
      "Rides can pause for lightning, which is common on summer afternoons.",
    ],
    faqs: [
      {
        q: "How long is an airboat ride in Orlando?",
        a: "Most rides last between 30 and 90 minutes on the water. Allow extra time for check-in and any included attractions.",
      },
      {
        q: "Will I see alligators on an Orlando airboat tour?",
        a: "Alligator sightings are very common, especially on sunny days in spring and fall, but they are wild animals and never guaranteed.",
      },
      {
        q: "How far are airboat tours from Orlando?",
        a: "Most airboat tours operate around Kissimmee and St. Cloud, typically 30 to 50 minutes from International Drive and the Disney area.",
      },
    ],
  },
  {
    slug: "best-bus-tours-in-orlando",
    title: "Best Bus Tours In Orlando",
    noun: "bus tour",
    description:
      "The best bus tours in and from Orlando, ranked by traveler reviews: Kennedy Space Center, St. Augustine, beach and city tours with hotel pickup.",
    illustration: "day-trips",
    category: "day-trips",
    tags: /^(bus tours|hop-on hop-off tours|double-decker bus tours)$/i,
    title_re: /\bbus\b|coach|trolley|hop-on|hop on hop off|with transport|hotel pickup|roundtrip transport|round-trip transport/i,
    intro: [
      "A bus tour is the easiest way to see Florida beyond the theme parks without renting a car or fighting Interstate 4 traffic. Most tours pick you up at your hotel, handle parking and tickets, and bring you back in time for dinner.",
      "We ranked the best-reviewed bus and coach tours from Orlando on Viator, from Kennedy Space Center trips to historic St. Augustine, beach days and city sightseeing. Each entry shows the current starting price, tour length and traveler rating.",
    ],
    howToChoose: [
      {
        heading: "What is included",
        text: "Compare whether admission, lunch and guided commentary are included. A higher price that bundles admission is often cheaper than paying for transport and tickets separately.",
      },
      {
        heading: "Pickup locations",
        text: "Most tours collect guests from International Drive, Lake Buena Vista and Kissimmee hotels. If you are staying outside those areas, check the pickup list before you book.",
      },
      {
        heading: "Group size",
        text: "Large coaches are the best value. Small-group van tours cost more but are quicker to load, more flexible and more personal.",
      },
      {
        heading: "Time on site",
        text: "Long-distance trips can spend three or more hours on the road. Look at how much free time you get at the destination, not just the total tour length.",
      },
    ],
    goodToKnow: [
      "Be ready at your pickup point early. Buses usually cannot wait for late guests.",
      "Bring snacks and water for long drives, even if lunch is included.",
      "Pack a light layer, since coaches are often strongly air conditioned.",
      "Check cancellation terms, especially for trips that depend on weather or launch schedules.",
    ],
    faqs: [
      {
        q: "What is the most popular bus tour from Orlando?",
        a: "Kennedy Space Center tours with round-trip transportation are consistently the most booked bus tours from Orlando, followed by day trips to St. Augustine and the Gulf beaches.",
      },
      {
        q: "Do Orlando bus tours pick up from hotels?",
        a: "Most do. Hotel pickup is common from International Drive, Lake Buena Vista and Kissimmee. The exact pickup list is shown on each booking page.",
      },
      {
        q: "Are bus tours from Orlando worth it?",
        a: "For destinations more than an hour away, yes. You avoid rental car costs, tolls, parking and navigation, and many tours bundle admission at a discount.",
      },
    ],
  },
  {
    slug: "best-day-trips-in-orlando",
    title: "Best Day Trips In Orlando",
    noun: "day trip",
    description:
      "The best day trips from Orlando ranked by traveler reviews: Kennedy Space Center, St. Augustine, manatee springs, beaches and more with prices.",
    illustration: "day-trips",
    category: "day-trips",
    tags: /^(day trips|full-day tours)$/i,
    title_re: /day trip|from orlando|full[- ]day|st\.? augustine|clearwater|miami|tampa|key west|cocoa beach|crystal river|everglades national/i,
    exclude: /fishing|charter|rental|distillery|brewery|tasting/i,
    intro: [
      "Orlando sits right in the middle of the state, which makes it a great base for day trips. Within two hours you can be standing under a Saturn V rocket, walking the oldest city in the United States, swimming with manatees or watching the sun set over the Gulf of Mexico.",
      "We ranked the best-reviewed day trips from Orlando on Viator by traveler rating and review volume. Every entry shows the current starting price and tour length, and many include hotel pickup.",
    ],
    howToChoose: [
      {
        heading: "Space Coast",
        text: "Kennedy Space Center is about an hour east and is the most popular day trip from Orlando. Launch-viewing tours are worth checking if your dates line up with a scheduled launch.",
      },
      {
        heading: "History and culture",
        text: "St. Augustine, founded in 1565, is about two hours northeast, with a Spanish fort, historic streets and plenty of restaurants.",
      },
      {
        heading: "Springs and wildlife",
        text: "Crystal River, Blue Spring and the Silver Springs area are the places to go for manatees and clear-water kayaking, especially in winter.",
      },
      {
        heading: "Beaches",
        text: "Clearwater Beach on the Gulf is about two hours west and famous for its sunsets. Cocoa Beach on the Atlantic is closer and pairs well with a Kennedy Space Center visit.",
      },
    ],
    goodToKnow: [
      "Expect an early start. Many day trips leave Orlando between 6 and 8 a.m.",
      "Check whether admission is included, since it varies by tour.",
      "Bring sunscreen, water and comfortable walking shoes.",
      "Choose free cancellation for weather-dependent trips such as beach and launch tours.",
    ],
    faqs: [
      {
        q: "What is the best day trip from Orlando?",
        a: "Kennedy Space Center is the most popular day trip from Orlando. St. Augustine is the top pick for history lovers, and Crystal River is the favorite for manatee encounters in winter.",
      },
      {
        q: "Can you do a day trip from Orlando without a car?",
        a: "Yes. Most guided day trips include round-trip transportation with pickup from major hotel areas, so you do not need a rental car.",
      },
      {
        q: "How far is the beach from Orlando?",
        a: "Cocoa Beach on the Atlantic coast is about an hour east. Clearwater Beach on the Gulf coast is roughly two hours west, depending on traffic.",
      },
    ],
  },
  {
    slug: "best-sightseeing-tours-in-orlando",
    title: "Best Sightseeing Tours In Orlando",
    noun: "sightseeing tour",
    description:
      "The best sightseeing tours in Orlando ranked by traveler reviews: walking, ghost, history and city tours plus unique local experiences with prices.",
    illustration: "food-and-city",
    category: "sightseeing",
    tags: /^(private sightseeing tours|city tours|walking tours|historical tours|cultural tours|ghost tours|night tours|car tours|segway tours|bike tours|e-bike tours|photography tours|art tours|sightseeing cruises|air tours|helicopter tours)$/i,
    title_re: /sightseeing|city tour|walking tour|segway|trolley|ghost|historic|history|downtown|winter park|scenic|helicopter tour|photo tour/i,
    exclude: /kayak|paddle|fishing|airboat|kennedy/i,
    intro: [
      "There is a lot more to Orlando than the resort corridor. Downtown has a surprising amount of history, Winter Park is one of the prettiest small towns in Florida, and the city looks completely different from a helicopter at night.",
      "We ranked the best-reviewed sightseeing tours in Orlando on Viator by traveler rating and review volume, from ghost walks and history tours to scenic flights and guided city drives. Every entry shows the current price and tour length.",
    ],
    howToChoose: [
      {
        heading: "Walking tours",
        text: "Walking tours of downtown Orlando and Winter Park are the best way to learn local history and find restaurants you would never spot on your own. Evening ghost tours are a fun twist for teens and adults.",
      },
      {
        heading: "Tours on wheels",
        text: "Segway, e-bike, trolley and private car tours cover more ground with less effort, which is helpful in the Florida heat.",
      },
      {
        heading: "From the air or water",
        text: "Helicopter flights over the theme parks and scenic boat tours in Winter Park offer views you cannot get from the street.",
      },
      {
        heading: "Private or group",
        text: "Private tours are ideal for families and special occasions. Group tours are the most affordable and a great way to meet other travelers.",
      },
    ],
    goodToKnow: [
      "Wear comfortable shoes and bring water on walking tours.",
      "Evening tours are cooler in summer and many downtown spots look best after dark.",
      "Arrive 10 to 15 minutes early at the meeting point.",
      "Check age guidance for ghost tours, which can include mature themes.",
    ],
    faqs: [
      {
        q: "What are the best sightseeing tours in Orlando?",
        a: "Highly rated options include downtown ghost and history walks, Winter Park tours, helicopter flights over the theme parks and guided city tours. The ranked list above is updated from current traveler reviews.",
      },
      {
        q: "Is downtown Orlando worth visiting?",
        a: "Yes. Lake Eola Park, historic Church Street and a growing food and cocktail scene make downtown worth an afternoon or evening, and a guided tour is an easy introduction.",
      },
      {
        q: "What can I see in Orlando in one day besides theme parks?",
        a: "Pair a morning walking tour of Winter Park with the Scenic Boat Tour, then spend the evening downtown around Lake Eola or on a ghost tour.",
      },
    ],
  },
  {
    slug: "best-dinner-shows-in-orlando-florida",
    title: "Best Dinner Shows In Orlando Florida",
    noun: "dinner show",
    description:
      "The best dinner shows in Orlando, Florida ranked by traveler reviews: luaus, murder mysteries, magic shows and dinner cruises with current prices.",
    illustration: "dinner-shows",
    category: "dinner-shows",
    tags: /^(dinner and show tickets|luaus|cabaret|comedy shows)$/i,
    title_re: /dinner show|dinner theat|dinner and show|dinner cruise|luau|murder mystery|mystery dinner|medieval|pirate|cabaret|revue|magic show|comedy show/i,
    exclude: /explorer pass|science center|food walk|hard rock|pontoon/i,
    intro: [
      "Dinner shows are an Orlando tradition. After a long day at the parks, a show that serves dinner while the entertainment unfolds solves two problems at once, and the city has more variety than almost anywhere: Polynesian fire dancers, interactive murder mysteries, magic, comedy and relaxed dinner cruises on the St. Johns River.",
      "The ranked list below includes every dinner show and evening entertainment experience near Orlando you can book on Viator, sorted by traveler rating and review volume. Further down, we also cover the long-running dinner theaters that sell tickets directly, so you can compare every option.",
    ],
    howToChoose: [
      {
        heading: "For families with kids",
        text: "Luaus, magic shows and the big themed dinner theaters are the safest picks for kids. They are loud, colorful and interactive, and menus usually include kid-friendly options.",
      },
      {
        heading: "For couples and adults",
        text: "Murder mystery shows, comedy clubs and cabaret-style revues lean toward grown-up humor, and dinner cruises are a quieter, more romantic evening. Check age guidance before booking with teens.",
      },
      {
        heading: "Long-running dinner theaters",
        text: "Orlando is also home to well-known dinner theaters that sell tickets directly rather than through Viator, including Medieval Times in Kissimmee, Pirates Dinner Adventure and Sleuths Mystery Dinner Shows near International Drive. Check their official websites for showtimes and prices.",
      },
      {
        heading: "What the ticket includes",
        text: "Most dinner show tickets include a set menu and non-alcoholic drinks. Alcohol, upgraded seating, tax and gratuity are often extra, so read the inclusions before you compare prices.",
      },
    ],
    goodToKnow: [
      "Arrive 30 to 60 minutes early for check-in and seating.",
      "Tell the venue about dietary restrictions when you book.",
      "Seats closer to the stage often mean more audience participation.",
      "Most shows run about two hours including dinner.",
    ],
    faqs: [
      {
        q: "What is the best dinner show in Orlando for families?",
        a: "Families usually love luaus with fire dancers, magic shows and the large themed dinner theaters like Medieval Times and Pirates Dinner Adventure, which are built around audience participation.",
      },
      {
        q: "How much does a dinner show in Orlando cost?",
        a: "Prices vary by show, seating and season. The starting prices for bookable shows are listed above, and most include dinner and soft drinks, with alcohol and upgrades extra.",
      },
      {
        q: "Are Orlando dinner shows worth it?",
        a: "For most visitors, yes. You get dinner and a full evening of entertainment in one ticket, and it is an easy plan after a long theme park day.",
      },
    ],
  },
  {
    slug: "best-family-friendly-tours-in-orlando-florida",
    title: "Best Family-Friendly Tours In Orlando Florida",
    noun: "family-friendly tour",
    description:
      "The best family-friendly tours in Orlando, Florida ranked by traveler reviews: gator parks, airboats, space trips, shows and kid-approved adventures.",
    illustration: "family",
    category: "family",
    tags: /^(family-friendly shows|kid-friendly|zoos & wildlife parks|aquariums|theme parks|water parks)$/i,
    title_re: /famil|kids?\b|children|legoland|gator|airboat|kennedy space|manatee|luau|magic show|science center|aquarium|safari/i,
    categoryMatch: "family",
    exclude: /massage|spa\b|wine|brewery|distillery|bar crawl|pub crawl|nightlife|adults|cabaret|revue|shooting|gun range|fishing|ghost|murder|speakeasy|cocktail|mixology/i,
    intro: [
      "Orlando is built for families, but the best trips mix theme park days with something different: a first look at a wild alligator, standing under a moon rocket, or watching fire dancers at a luau. These experiences are easier on the budget than another park day and give everyone a break from the crowds.",
      "We ranked the best-reviewed family-friendly tours and activities near Orlando on Viator by traveler rating and review volume. Every entry shows the current starting price and how long it takes, so you can fit it around nap times and park days.",
    ],
    howToChoose: [
      {
        heading: "Match the activity to ages",
        text: "Toddlers do best with short, shaded activities like wildlife parks and boat rides. School-age kids love airboats, Kennedy Space Center and hands-on shows. Teens usually want speed, height or something they can post about.",
      },
      {
        heading: "Watch the clock",
        text: "Tours under three hours are easiest with younger kids. Save full-day trips for when everyone is rested, and book morning slots in summer to avoid the heat and afternoon storms.",
      },
      {
        heading: "Check age and height rules",
        text: "Zip lines, airboats and water activities often have minimum ages, heights or swimming requirements. They are listed on each booking page, so check before you promise anything.",
      },
      {
        heading: "Look for pickup and flexibility",
        text: "Hotel pickup saves a lot of stress with kids in tow, and free cancellation protects you if someone gets sick or the weather turns.",
      },
    ],
    goodToKnow: [
      "Pack snacks, water, sunscreen and a change of clothes for water activities.",
      "Many tours offer child pricing. Select the correct ages when you book.",
      "Strollers are not practical on most boats and tours. Ask about storage.",
      "Alternate big park days with lighter tours to keep everyone happy.",
    ],
    faqs: [
      {
        q: "What are the best things to do in Orlando with kids besides theme parks?",
        a: "Airboat rides, Kennedy Space Center, wildlife parks, manatee trips in winter, luaus and magic shows are all highly rated by families. See the ranked list above for current prices.",
      },
      {
        q: "What is a good Orlando activity for toddlers?",
        a: "Short boat rides, wildlife parks and shows with shaded seating work best for toddlers. Look for tours under two hours with flexible cancellation.",
      },
      {
        q: "Are Orlando tours cheaper for kids?",
        a: "Many are. Operators often offer child or infant pricing, and some let very young children join free. The booking page shows the price for each age group.",
      },
    ],
  },
  {
    slug: "best-water-parks-in-orlando-florida",
    title: "Best Water Parks In Orlando Florida",
    noun: "water park ticket",
    description:
      "The best water parks in Orlando, Florida: Volcano Bay, Aquatica, Typhoon Lagoon, Blizzard Beach and Island H2O, plus bookable tickets with prices.",
    illustration: "water",
    category: "theme-parks",
    tags: /^water parks$/i,
    title_re: /water ?park|volcano bay|aquatica|typhoon lagoon|blizzard beach|island h2o/i,
    must: /ticket|admission/i,
    exclude: /attraction pass|explorer pass|orlando pass|legoland florida theme park/i,
    includeFlagged: true,
    minRating: 0,
    intro: [
      "Orlando summers are hot, and a water park day is the best way to beat the heat. The city has some of the most elaborate water parks in the world, from Universal's volcano-themed Volcano Bay to Disney's two themed parks and SeaWorld's Aquatica.",
      "Below we cover each major water park, then list the water park tickets you can book on Viator right now with current prices and traveler ratings. Not every park sells through Viator, so we note where to buy the rest.",
    ],
    howToChoose: [
      {
        heading: "Universal's Volcano Bay",
        text: "A Polynesian-themed park built around a towering volcano, with thrill slides, a wave pool and a virtual queue system that reduces time spent waiting in line. Best for teens and thrill seekers.",
      },
      {
        heading: "Disney's Typhoon Lagoon and Blizzard Beach",
        text: "Typhoon Lagoon is known for its huge wave pool and relaxed lazy river. Blizzard Beach has a ski-resort theme and some of the tallest, fastest slides in the area. Both are great for mixed-age families.",
      },
      {
        heading: "Aquatica Orlando",
        text: "SeaWorld's water park across from the main park, with slides that pass through animal habitats, a lazy river and plenty for younger kids.",
      },
      {
        heading: "Island H2O and smaller parks",
        text: "Island H2O in Kissimmee is a smaller, more affordable option near the Disney area, and several resorts have their own water play areas for younger children.",
      },
    ],
    goodToKnow: [
      "Water parks may close seasonally or for refurbishment in winter. Check the operating calendar.",
      "Lightning pauses slides and pools, which is common on summer afternoons. Arrive at opening.",
      "Bring reef-safe sunscreen, water shoes and a waterproof phone pouch.",
      "Lockers and cabanas cost extra and sell out on busy days.",
    ],
    faqs: [
      {
        q: "What is the best water park in Orlando?",
        a: "Volcano Bay is the most popular with teens and thrill seekers. Typhoon Lagoon is a favorite for families thanks to its wave pool, and Aquatica is a strong pick for younger kids.",
      },
      {
        q: "Are Orlando water parks open all year?",
        a: "Most operate year round but reduce hours or close for refurbishment during cooler months. Always check the park calendar for your dates.",
      },
      {
        q: "Where can I buy Orlando water park tickets?",
        a: "Some tickets are bookable through the links on this page. Others, including Volcano Bay and Aquatica, are sold directly by Universal and SeaWorld on their official websites.",
      },
    ],
  },
];

export const listicleBySlug = new Map(listicles.map((l) => [l.slug, l]));

/* ---------------- Ranking ---------------- */

const tokens = (t: string) => new Set(t.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2));
function similar(a: string, b: string): boolean {
  const A = tokens(a);
  const B = tokens(b);
  const inter = [...A].filter((w) => B.has(w)).length;
  return inter / Math.min(A.size, B.size) >= 0.75;
}

/** Bayesian average so a 5.0 with 3 reviews does not outrank a 4.8 with 2,000. */
function rankScore(l: Listing): number {
  const v = l.reviewCount ?? 0;
  const R = l.rating ?? 0;
  const m = 25;
  const C = 4.4;
  return (v / (v + m)) * R + (m / (v + m)) * C + Math.log10(v + 1) * 0.02;
}

export function matchesListicle(cfg: ListicleConfig, l: Listing): boolean {
  if (TRANSPORT.test(l.title) || (cfg.exclude && cfg.exclude.test(l.title))) return false;
  if (cfg.must && !cfg.must.test(l.title)) return false;
  if (!cfg.includeFlagged && (l.tags ?? []).some((t) => LOW_QUALITY_TAG.test(t.trim()))) return false;
  return (
    cfg.title_re.test(l.title) ||
    (l.tags ?? []).some((t) => cfg.tags.test(t.trim())) ||
    (!!cfg.categoryMatch && l.categories.includes(cfg.categoryMatch))
  );
}

export interface RankedListicle {
  config: ListicleConfig;
  items: Listing[];
  totalMatches: number;
  updated: string;
  stats: {
    minPrice?: number;
    medianPrice?: number;
    avgRating?: number;
    totalReviews: number;
    medianMinutes?: number;
  };
  picks: { label: string; listing: Listing }[];
}

const median = (xs: number[]) => {
  if (!xs.length) return undefined;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

export const getRankedListicle = cache(async (slug: string, limit = 10): Promise<RankedListicle | null> => {
  const config = listicleBySlug.get(slug);
  if (!config) return null;
  const live = await getLiveListings();
  const matches = live.filter((l) => matchesListicle(config, l));
  const minRating = config.minRating ?? 4;
  const reviewed = matches.filter((l) => (l.rating ?? 0) >= minRating && (l.reviewCount ?? 0) >= 3);
  const pool = (reviewed.length >= 3 ? reviewed : matches).sort((a, b) => rankScore(b) - rankScore(a));

  const items: Listing[] = [];
  for (const l of pool) {
    if (items.some((i) => similar(i.title, l.title))) continue;
    items.push(l);
    if (items.length >= limit) break;
  }

  const prices = matches.map((l) => l.priceFrom).filter((p): p is number => !!p);
  const rated = matches.filter((l) => l.rating && l.reviewCount);
  const totalReviews = rated.reduce((s, l) => s + (l.reviewCount ?? 0), 0);
  const avgRating = totalReviews
    ? rated.reduce((s, l) => s + (l.rating ?? 0) * (l.reviewCount ?? 0), 0) / totalReviews
    : undefined;

  const picks: { label: string; listing: Listing }[] = [];
  const addPick = (label: string, l?: Listing) => {
    if (l && !picks.some((p) => p.listing.slug === l.slug)) picks.push({ label, listing: l });
  };
  addPick("Best overall", items[0]);
  addPick("Most reviewed", [...items].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))[0]);
  addPick("Best value", [...items].filter((l) => l.priceFrom).sort((a, b) => a.priceFrom! - b.priceFrom!)[0]);
  addPick(
    "Shortest",
    [...items].filter((l) => l.durationMinutes).sort((a, b) => a.durationMinutes! - b.durationMinutes!)[0],
  );

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
    },
    picks: picks.slice(0, 4),
  };
});

/** Short, clean summary: the first two sentences of the Viator description. */
export function itemSummary(l: Listing): string {
  const text = l.description || l.summary;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const out = sentences.slice(0, 2).join(" ").trim();
  return out.length > 320 ? `${out.slice(0, 317).replace(/\s+\S*$/, "")}...` : out;
}

/** Data-backed reasons an item made the list. */
export function itemReasons(l: Listing): string[] {
  const reasons: string[] = [];
  if (l.rating && l.reviewCount) {
    reasons.push(`Rated ${l.rating.toFixed(1)} out of 5 by ${l.reviewCount.toLocaleString("en-US")} travelers`);
  }
  if (l.freeCancellation) reasons.push("Free cancellation available");
  const tags = (l.tags ?? []).map((t) => t.trim().toLowerCase());
  if (tags.includes("likely to sell out")) reasons.push("Popular: often sells out, so book ahead");
  if (tags.includes("small group")) reasons.push("Small group experience");
  if (tags.includes("excellent quality") || tags.includes("top product")) reasons.push("Flagged by Viator for excellent quality");
  if (tags.includes("private and luxury")) reasons.push("Private option for your group only");
  if (l.durationLabel) reasons.push(`Takes about ${l.durationLabel}`);
  return reasons.slice(0, 4);
}

/** What the activity actually is, so category tagging quirks cannot defeat the variety cap. */
const ACTIVITIES: [string, RegExp][] = [
  ["kayak", /kayak|paddle|canoe/i],
  ["airboat", /airboat/i],
  ["air", /helicopter|flight|balloon|skydiv/i],
  ["tactical", /tactical|drill|shooting|gun|laser tag/i],
  ["escape", /escape (room|game)/i],
  ["ghost", /ghost|haunted|paranormal/i],
  ["space", /kennedy|space center|rocket|launch/i],
  ["food", /food|tasting|brewery|distillery|culinary/i],
  ["zipline", /zip ?line|tree ?trek|ropes course|adventure park/i],
];
function activityKey(l: Listing): string {
  return ACTIVITIES.find(([, re]) => re.test(l.title))?.[0] ?? l.categories[0];
}

/**
 * Highest-rated Orlando experiences overall. Requires a solid review base and
 * caps each activity type so the list is not ten versions of one tour.
 */
export const getTopRated = cache(async (limit = 10, minReviews = 100, perCategory = 2): Promise<Listing[]> => {
  const live = await getLiveListings();
  const pool = live
    .filter(
      (l) =>
        !TRANSPORT.test(l.title) &&
        !(l.tags ?? []).some((t) => LOW_QUALITY_TAG.test(t.trim())) &&
        (l.reviewCount ?? 0) >= minReviews &&
        (l.rating ?? 0) >= 4.5,
    )
    .sort((a, b) => rankScore(b) - rankScore(a));
  const perCat = new Map<string, number>();
  const out: Listing[] = [];
  for (const l of pool) {
    const cat = activityKey(l);
    // One per named activity (kayak, airboat...), up to `perCategory` for broad categories.
    const cap = ACTIVITIES.some(([k]) => k === cat) ? 1 : perCategory;
    if ((perCat.get(cat) ?? 0) >= cap) continue;
    if (out.some((o) => similar(o.title, l.title))) continue;
    out.push(l);
    perCat.set(cat, (perCat.get(cat) ?? 0) + 1);
    if (out.length >= limit) break;
  }
  return out;
});
