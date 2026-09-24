/**
 * Recurring Orlando events. Exact dates change every year, so each event
 * carries its typical timing and the months it usually runs; pages tell
 * readers to confirm dates with the organizer before planning.
 */
export type EventCategory = "Festival" | "Holiday" | "Halloween" | "Sports" | "Arts" | "Market" | "Fireworks" | "Space";

export interface OrlandoEvent {
  slug: string;
  name: string;
  /** Months (1-12) the event usually runs. */
  months: number[];
  timing: string;
  where: string;
  category: EventCategory;
  description: string;
  tip?: string;
  /** Weekly events show on every weekend page. */
  weekly?: "Saturday" | "Sunday" | "Monday";
  /** Related page on this site. */
  related?: { href: string; label: string };
}

export const events: OrlandoEvent[] = [
  {
    slug: "citrus-bowl",
    name: "Citrus Bowl",
    months: [1, 12],
    timing: "Around New Year's Day",
    where: "Camping World Stadium, Downtown Orlando",
    category: "Sports",
    description: "One of college football's longest-running bowl games, played in Orlando every holiday season with a parade and fan events around town.",
    tip: "Book hotels early, since bowl week coincides with peak holiday crowds.",
  },
  {
    slug: "rundisney-marathon-weekend",
    name: "Walt Disney World Marathon Weekend",
    months: [1],
    timing: "Early to mid January",
    where: "Walt Disney World Resort",
    category: "Sports",
    description: "A multi-day runDisney event with races from a 5K to a full marathon that wind through the Disney theme parks.",
    tip: "Race registration sells out months ahead. Spectators should expect early road closures.",
  },
  {
    slug: "epcot-festival-of-the-arts",
    name: "EPCOT International Festival of the Arts",
    months: [1, 2],
    timing: "Typically mid January through late February",
    where: "EPCOT, Walt Disney World",
    category: "Festival",
    description: "Food studios, live performances, art workshops and gallery displays spread across World Showcase.",
    tip: "Included with EPCOT park admission. Food and art purchases are extra.",
    related: { href: "/blog/best-theme-parks-in-orlando", label: "Best theme parks in Orlando" },
  },
  {
    slug: "gaylord-palms-ice",
    name: "Christmas at Gaylord Palms and ICE!",
    months: [11, 12, 1],
    timing: "Mid November through early January",
    where: "Gaylord Palms Resort, Kissimmee",
    category: "Holiday",
    description: "A holiday tradition with a walk-through exhibit of hand-carved ice sculptures kept at chilly temperatures, plus ice tubing and holiday activities.",
    tip: "Parkas are provided for the ice exhibit. Timed tickets sell out on weekends.",
  },
  {
    slug: "universal-mardi-gras",
    name: "Universal Mardi Gras",
    months: [2, 3, 4],
    timing: "Select dates from February into April",
    where: "Universal Studios Florida",
    category: "Festival",
    description: "New Orleans-style parades with bead tosses, Cajun and Creole food and concerts on select nights.",
    tip: "Parades and concerts are included with Universal Studios admission on event nights.",
    related: { href: "/search/universal-orlando", label: "Universal Orlando tickets" },
  },
  {
    slug: "seaworld-seven-seas-food-festival",
    name: "SeaWorld Seven Seas Food Festival",
    months: [2, 3, 4, 5],
    timing: "Weekends in late winter and spring",
    where: "SeaWorld Orlando",
    category: "Festival",
    description: "Global food and drink booths across the park, paired with weekend concerts.",
    tip: "Sampling lanyards can save money if you plan to try several dishes.",
  },
  {
    slug: "epcot-flower-and-garden",
    name: "EPCOT International Flower & Garden Festival",
    months: [3, 4, 5, 6],
    timing: "Typically early March through late May or early June",
    where: "EPCOT, Walt Disney World",
    category: "Festival",
    description: "Character topiaries, themed gardens and outdoor kitchens fill the park during Orlando's most pleasant season.",
    tip: "Weekday mornings are the quietest time to see the gardens.",
  },
  {
    slug: "winter-park-sidewalk-art-festival",
    name: "Winter Park Sidewalk Art Festival",
    months: [3],
    timing: "A weekend in March",
    where: "Central Park, Winter Park",
    category: "Arts",
    description: "One of the country's best-known outdoor art shows, with hundreds of artists lining Park Avenue and Central Park.",
    tip: "Arrive early and use the SunRail train to skip the parking scramble.",
    related: { href: "/blog/best-sightseeing-tours-in-orlando", label: "Best sightseeing tours in Orlando" },
  },
  {
    slug: "orlando-fringe",
    name: "Orlando International Fringe Theatre Festival",
    months: [5],
    timing: "About two weeks in May",
    where: "Loch Haven Park",
    category: "Arts",
    description: "A long-running, unjuried theatre festival with dozens of original shows, from comedy to drama, plus a free outdoor lawn with food and entertainment.",
    tip: "Buy a festival button first, since it is required for show tickets.",
  },
  {
    slug: "fireworks-at-the-fountain",
    name: "Fourth of July Fireworks at Lake Eola",
    months: [7],
    timing: "July 4",
    where: "Lake Eola Park, Downtown Orlando",
    category: "Fireworks",
    description: "Downtown's big Independence Day celebration with live music, food vendors and fireworks over the lake.",
    tip: "Claim a spot around the lake by late afternoon and plan for road closures.",
  },
  {
    slug: "orlando-city-sc",
    name: "Orlando City SC home matches",
    months: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    timing: "Major League Soccer season, roughly late February through October",
    where: "Inter&Co Stadium, Downtown Orlando",
    category: "Sports",
    description: "Orlando's MLS club plays in a soccer-specific downtown stadium known for a loud, purple-clad supporters section.",
    tip: "Evening kickoffs are common in summer to avoid the heat.",
    related: { href: "/book-now/sports", label: "Sports experiences in Orlando" },
  },
  {
    slug: "orlando-magic",
    name: "Orlando Magic home games",
    months: [10, 11, 12, 1, 2, 3, 4],
    timing: "NBA regular season, roughly late October through mid April",
    where: "Kia Center, Downtown Orlando",
    category: "Sports",
    description: "Catch an NBA game downtown, an easy night out with restaurants and bars within walking distance.",
    related: { href: "/book-now/sports", label: "Sports experiences in Orlando" },
  },
  {
    slug: "epcot-food-and-wine",
    name: "EPCOT International Food & Wine Festival",
    months: [8, 9, 10, 11],
    timing: "Typically late August through mid November",
    where: "EPCOT, Walt Disney World",
    category: "Festival",
    description: "Disney's biggest festival, with dozens of global food and drink booths, cooking demonstrations and concerts around World Showcase.",
    tip: "Weekends get very crowded. Visit on a weekday and start early.",
    related: { href: "/book-now/food-and-dining", label: "Food and dining experiences" },
  },
  {
    slug: "mickeys-not-so-scary-halloween-party",
    name: "Mickey's Not-So-Scary Halloween Party",
    months: [8, 9, 10],
    timing: "Select nights from mid August through October 31",
    where: "Magic Kingdom, Walt Disney World",
    category: "Halloween",
    description: "A separately ticketed evening event with a Halloween parade, fireworks, trick-or-treating and costumed guests of all ages.",
    tip: "October nights sell out first. Earlier dates are cheaper and less crowded.",
    related: { href: "/events/halloween-in-orlando", label: "Halloween in Orlando guide" },
  },
  {
    slug: "halloween-horror-nights",
    name: "Halloween Horror Nights",
    months: [8, 9, 10, 11],
    timing: "Select nights from late August or September into early November",
    where: "Universal Studios Florida",
    category: "Halloween",
    description: "One of the most famous Halloween events in the world, with walk-through haunted houses, scare zones and live shows. Best for teens and adults.",
    tip: "Go early in the season or on a weeknight, or add an express pass on busy nights.",
    related: { href: "/events/halloween-in-orlando", label: "Halloween in Orlando guide" },
  },
  {
    slug: "howl-o-scream",
    name: "Howl-O-Scream",
    months: [9, 10],
    timing: "Select nights in September and October",
    where: "SeaWorld Orlando",
    category: "Halloween",
    description: "SeaWorld's after-dark Halloween event with haunted houses, scare zones and coasters in the dark.",
    tip: "Families with younger kids should look at SeaWorld's daytime Halloween weekends instead.",
    related: { href: "/events/halloween-in-orlando", label: "Halloween in Orlando guide" },
  },
  {
    slug: "come-out-with-pride",
    name: "Come Out With Pride Orlando",
    months: [10],
    timing: "October",
    where: "Lake Eola Park and Downtown Orlando",
    category: "Festival",
    description: "One of the largest Pride celebrations in the Southeast, with a parade, live entertainment and vendors around Lake Eola.",
  },
  {
    slug: "florida-classic",
    name: "Florida Classic",
    months: [11],
    timing: "A weekend in November",
    where: "Camping World Stadium, Downtown Orlando",
    category: "Sports",
    description: "A major HBCU football rivalry weekend with a big game, battle of the bands and festivities across the city.",
  },
  {
    slug: "mickeys-very-merry-christmas-party",
    name: "Mickey's Very Merry Christmas Party",
    months: [11, 12],
    timing: "Select nights in November and December",
    where: "Magic Kingdom, Walt Disney World",
    category: "Holiday",
    description: "A separately ticketed holiday night with a Christmas parade, holiday fireworks, snowfall on Main Street and treats.",
    tip: "December dates sell out quickly. November nights are usually easier to get.",
    related: { href: "/events/christmas-in-orlando", label: "Christmas in Orlando guide" },
  },
  {
    slug: "epcot-festival-of-the-holidays",
    name: "EPCOT International Festival of the Holidays",
    months: [11, 12],
    timing: "Late November through late December",
    where: "EPCOT, Walt Disney World",
    category: "Holiday",
    description: "Holiday kitchens and storytellers representing traditions from around the world, plus the Candlelight Processional.",
    related: { href: "/events/christmas-in-orlando", label: "Christmas in Orlando guide" },
  },
  {
    slug: "universal-holidays",
    name: "Universal Holidays",
    months: [11, 12, 1],
    timing: "Mid November through early January",
    where: "Universal Studios Florida and Islands of Adventure",
    category: "Holiday",
    description: "Holiday parades, Grinch-themed entertainment and a festive Wizarding World of Harry Potter.",
    related: { href: "/events/christmas-in-orlando", label: "Christmas in Orlando guide" },
  },
  {
    slug: "seaworld-christmas-celebration",
    name: "SeaWorld Christmas Celebration",
    months: [11, 12, 1],
    timing: "Select nights from mid November into early January",
    where: "SeaWorld Orlando",
    category: "Holiday",
    description: "Millions of lights, holiday shows and a giant Christmas tree display after dark.",
    related: { href: "/events/christmas-in-orlando", label: "Christmas in Orlando guide" },
  },
  {
    slug: "pop-tarts-bowl",
    name: "Pop-Tarts Bowl",
    months: [12],
    timing: "Late December",
    where: "Camping World Stadium, Downtown Orlando",
    category: "Sports",
    description: "A college football bowl game that has become famous for its playful, food-themed traditions.",
  },
  {
    slug: "new-years-eve",
    name: "New Year's Eve celebrations",
    months: [12],
    timing: "December 31",
    where: "Theme parks, Disney Springs, CityWalk and Downtown Orlando",
    category: "Fireworks",
    description: "Extended park hours, fireworks and parties across Orlando. Theme parks often reach capacity, so plan ahead.",
  },
  {
    slug: "rocket-launches",
    name: "Rocket launches on the Space Coast",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Year round, several times a month",
    where: "Kennedy Space Center and Cape Canaveral",
    category: "Space",
    description: "Florida's Space Coast now hosts frequent launches, and many are visible from Orlando on clear days and nights.",
    tip: "Launch times move often. Book tours with free cancellation.",
    related: { href: "/book-now/kennedy-space-center", label: "Kennedy Space Center tours" },
  },
  {
    slug: "winter-park-farmers-market",
    name: "Winter Park Farmers' Market",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Every Saturday morning",
    where: "Historic train depot, Winter Park",
    category: "Market",
    weekly: "Saturday",
    description: "A beloved local market with produce, baked goods, flowers and coffee a block from Park Avenue.",
    tip: "Pair it with the Winter Park Scenic Boat Tour nearby.",
    related: { href: "/blog/best-sightseeing-tours-in-orlando", label: "Best sightseeing tours" },
  },
  {
    slug: "lake-eola-farmers-market",
    name: "Lake Eola Farmers Market",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Every Sunday",
    where: "Lake Eola Park, Downtown Orlando",
    category: "Market",
    weekly: "Sunday",
    description: "Local vendors, food stalls and live music along the lake. Rent a swan boat while you are there.",
    related: { href: "/blog/free-and-cheap-things-to-do-in-orlando", label: "Free things to do in Orlando" },
  },
  {
    slug: "audubon-park-community-market",
    name: "Audubon Park Community Market",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Monday evenings",
    where: "Audubon Park Garden District, Orlando",
    category: "Market",
    weekly: "Monday",
    description: "An evening market with local farmers, food trucks and makers in one of Orlando's most walkable neighborhoods.",
  },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Month notes for /events/[month]: typical weather and crowds. */
export const monthNotes: Record<number, { weather: string; crowds: string; tip: string }> = {
  1: {
    weather: "Mild and dry, with average highs in the low 70s °F and cool mornings.",
    crowds: "Busy through New Year's, then some of the quietest weeks of the year.",
    tip: "Great month for outdoor tours, springs and manatee viewing.",
  },
  2: {
    weather: "Pleasant, with average highs in the mid 70s °F.",
    crowds: "Moderate, with a spike around Presidents' Day weekend.",
    tip: "Manatee season is still in full swing at the springs.",
  },
  3: {
    weather: "Warm and sunny, with average highs near 80 °F.",
    crowds: "Very busy with spring break.",
    tip: "Book theme park tickets and popular tours well ahead.",
  },
  4: {
    weather: "Warm and mostly dry, with average highs in the low 80s °F.",
    crowds: "Busy around Easter, calmer later in the month.",
    tip: "One of the best months for airboat rides and outdoor adventures.",
  },
  5: {
    weather: "Hot, with average highs in the upper 80s °F before the rainy season starts.",
    crowds: "Often quieter before summer vacation begins.",
    tip: "Schedule outdoor activities for the morning.",
  },
  6: {
    weather: "Hot and humid, with near-daily afternoon thunderstorms.",
    crowds: "Busy once schools let out.",
    tip: "Plan water parks in the morning and indoor attractions for stormy afternoons.",
  },
  7: {
    weather: "Hot and humid, with average highs in the low 90s °F and afternoon storms.",
    crowds: "Peak summer crowds.",
    tip: "Water parks, springs and dinner shows help beat the heat.",
  },
  8: {
    weather: "Hot and stormy, with average highs in the low 90s °F.",
    crowds: "Busy early in the month, quieter as schools return.",
    tip: "Late August is one of the best-value times to visit.",
  },
  9: {
    weather: "Still hot, with afternoon storms and peak hurricane season.",
    crowds: "Among the quietest months of the year.",
    tip: "Book refundable tours and consider travel insurance.",
  },
  10: {
    weather: "Warm, with average highs in the mid 80s °F and less rain.",
    crowds: "Moderate, busier around Halloween weekends.",
    tip: "Halloween events and fall festivals are in full swing.",
  },
  11: {
    weather: "Comfortable, with average highs near 80 °F.",
    crowds: "Moderate, very busy Thanksgiving week.",
    tip: "Holiday events start, with great weather for outdoor tours.",
  },
  12: {
    weather: "Mild, with average highs in the mid 70s °F.",
    crowds: "Quiet early in the month, extremely busy from mid December.",
    tip: "Visit holiday events in early December for the best experience.",
  },
};

export const monthSlug = (m: number) => MONTHS[m - 1].toLowerCase();

export function eventsInMonth(m: number, { includeWeekly = false } = {}) {
  return events.filter((e) => e.months.includes(m) && (includeWeekly || !e.weekly));
}

export const weeklyEvents = events.filter((e) => e.weekly);
