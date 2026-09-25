import type { Post } from "@/lib/blog-types";

/**
 * Programmatic "[Park] Calendar & Best Days to Go" posts. Facts only:
 * opening dates, lands, recurring events and policies that are well
 * established. Exact hours and event dates change every year, so the copy
 * always sends readers to the official calendar for those.
 */

type Crowd = "Low" | "Low to moderate" | "Moderate" | "Moderate to high" | "High" | "Very high";

interface ParkCalendar {
  slug: string;
  title: string;
  illustration: "theme-parks" | "water";
  park: string;
  /** "Disney" | "Universal" | ... used for shared patterns. */
  group: "disney" | "universal" | "seaworld" | "legoland" | "water";
  opened: string;
  where: string;
  summary: string;
  intro: string;
  heroProduct?: string;
  tickets?: string[];
  /** Park-specific notes per month (1-12). */
  months: Partial<Record<number, string>>;
  timeOfDay: string[];
  events: { name: string; when: string; note: string }[];
  tips: string[];
  faqs: { q: string; a: string }[];
  hotels: string;
  links: { label: string; href: string }[];
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Orlando-wide seasonal pattern that every park follows to some degree. */
const BASE: { crowd: Crowd; note: string }[] = [
  { crowd: "Low to moderate", note: "Very busy New Year's week, then one of the quietest stretches of the year" },
  { crowd: "Moderate", note: "Presidents' Day week is busy; the rest of the month is comfortable" },
  { crowd: "High", note: "Spring break weeks bring big crowds" },
  { crowd: "High", note: "Easter and spring break early in the month, calmer late April" },
  { crowd: "Low to moderate", note: "A sweet spot until Memorial Day weekend" },
  { crowd: "High", note: "Summer break starts; hot, with afternoon storms" },
  { crowd: "High", note: "Peak summer; the week of July 4 is among the busiest of the year" },
  { crowd: "Moderate", note: "Crowds drop once Florida schools go back in mid-August" },
  { crowd: "Low", note: "Usually the quietest month; peak of hurricane season" },
  { crowd: "Moderate", note: "Fall breaks and Halloween events; pleasant weather returns" },
  { crowd: "Moderate", note: "Thanksgiving week is very busy; early November is calmer" },
  { crowd: "Moderate", note: "Early December is manageable; about December 20 to New Year's is peak" },
];

const DAYS: Record<ParkCalendar["group"], { day: string; crowd: Crowd; note: string }[]> = {
  disney: [
    { day: "Monday", crowd: "Moderate", note: "Busier after long weekends" },
    { day: "Tuesday", crowd: "Low to moderate", note: "Often one of the calmer days" },
    { day: "Wednesday", crowd: "Low to moderate", note: "Often one of the calmer days" },
    { day: "Thursday", crowd: "Moderate", note: "Weekend arrivals start" },
    { day: "Friday", crowd: "Moderate to high", note: "Long-weekend visitors arrive" },
    { day: "Saturday", crowd: "High", note: "Florida residents and passholders join the crowds" },
    { day: "Sunday", crowd: "Moderate to high", note: "Busy morning, often easing by evening" },
  ],
  universal: [
    { day: "Monday", crowd: "Moderate", note: "Busier on holiday weekends" },
    { day: "Tuesday", crowd: "Low to moderate", note: "Usually among the quietest days" },
    { day: "Wednesday", crowd: "Low to moderate", note: "Usually among the quietest days" },
    { day: "Thursday", crowd: "Moderate", note: "Crowds build for the weekend" },
    { day: "Friday", crowd: "Moderate to high", note: "Weekend visitors and locals" },
    { day: "Saturday", crowd: "High", note: "The busiest day of the week" },
    { day: "Sunday", crowd: "Moderate to high", note: "Busy, easing by late afternoon" },
  ],
  seaworld: [
    { day: "Monday", crowd: "Low to moderate", note: "Quieter outside holidays" },
    { day: "Tuesday", crowd: "Low", note: "Among the quietest days" },
    { day: "Wednesday", crowd: "Low", note: "Among the quietest days" },
    { day: "Thursday", crowd: "Low to moderate", note: "Comfortable" },
    { day: "Friday", crowd: "Moderate", note: "Busier during event seasons" },
    { day: "Saturday", crowd: "High", note: "Locals and passholders; event weekends are busiest" },
    { day: "Sunday", crowd: "Moderate to high", note: "Busy through the afternoon" },
  ],
  legoland: [
    { day: "Monday", crowd: "Low to moderate", note: "Check the calendar; not every weekday is an operating day" },
    { day: "Tuesday", crowd: "Low", note: "Often closed outside busy seasons" },
    { day: "Wednesday", crowd: "Low", note: "Often closed outside busy seasons" },
    { day: "Thursday", crowd: "Low to moderate", note: "Quiet when open" },
    { day: "Friday", crowd: "Moderate", note: "Busier during school breaks" },
    { day: "Saturday", crowd: "High", note: "The busiest day, especially during events" },
    { day: "Sunday", crowd: "Moderate to high", note: "Busy, easing later in the day" },
  ],
  water: [
    { day: "Monday", crowd: "Moderate", note: "Busier in summer" },
    { day: "Tuesday", crowd: "Low to moderate", note: "Good weekday pick" },
    { day: "Wednesday", crowd: "Low to moderate", note: "Good weekday pick" },
    { day: "Thursday", crowd: "Moderate", note: "Comfortable" },
    { day: "Friday", crowd: "Moderate to high", note: "Busier on hot summer days" },
    { day: "Saturday", crowd: "High", note: "Locals and visitors, especially on hot days" },
    { day: "Sunday", crowd: "High", note: "Busy on hot days" },
  ],
};

const DISNEY_TICKETS = ["3805P1", "3805P2", "3805P4"];
const UNIVERSAL_TICKETS = ["3088P1", "3088_1D_UO"];

export const parkCalendars: ParkCalendar[] = [
  {
    slug: "magic-kingdom-calendar-best-days",
    title: "Magic Kingdom Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "Magic Kingdom",
    group: "disney",
    opened: "October 1, 1971",
    where: "Walt Disney World, reached from the Transportation and Ticket Center by monorail or ferry",
    summary:
      "The best times to visit Magic Kingdom are mid-week in January after New Year's week, late April through mid-May, and September. Avoid Christmas week, spring break and the week of July 4. On a normal day, arrive for opening and save the evening for the fireworks.",
    intro:
      "Magic Kingdom is the park that started Walt Disney World, and it is regularly the most visited theme park on the planet. Six lands, Main Street, U.S.A., Adventureland, Frontierland, Liberty Square, Fantasyland and Tomorrowland, sit around Cinderella Castle, and it is the park most families put first on the list. That popularity is exactly why the calendar matters here more than anywhere else in Orlando.",
    heroProduct: "3805P1",
    tickets: [...DISNEY_TICKETS, "3805P5"],
    months: {
      1: "Walt Disney World Marathon Weekend runs through the parks",
      8: "Mickey's Not-So-Scary Halloween Party nights begin",
      9: "Halloween party nights continue; the park closes early to day guests on party nights",
      10: "Halloween party nights run through October 31",
      11: "Christmas decorations go up; Mickey's Very Merry Christmas Party nights begin",
      12: "Christmas party nights until mid-December; New Year's Eve fireworks",
      7: "Fourth of July fireworks",
    },
    timeOfDay: [
      "**Opening:** the first hour is the calmest of the day. Disney resort guests and guests at select partner hotels get Early Theme Park Entry 30 minutes before everyone else.",
      "**Midday:** the park is at its busiest from late morning through the afternoon. This is a good time for a break at the hotel or indoor shows.",
      "**Afternoon parade:** the daytime parade pulls crowds to the parade route, which can shorten waits elsewhere.",
      "**Evening:** the nightly fireworks over Cinderella Castle are the finale. Main Street, the monorail and the ferry are packed right after, so linger in a shop or head out before the show ends.",
    ],
    events: [
      { name: "Mickey's Not-So-Scary Halloween Party", when: "Select nights, mid-August to October 31", note: "Separately ticketed. Magic Kingdom closes early to regular day guests on party nights." },
      { name: "Mickey's Very Merry Christmas Party", when: "Select nights, November to mid-December", note: "Separately ticketed, with its own parade and fireworks. The park closes early to day guests on party nights." },
      { name: "Walt Disney World Marathon Weekend", when: "January", note: "Races run through the parks early in the morning; resort hotels fill up." },
      { name: "Fourth of July and New Year's Eve", when: "July 4 and December 31", note: "Special fireworks and some of the biggest crowds of the year." },
    ],
    tips: [
      "Check the party calendar before you pick your Magic Kingdom day. On Halloween and Christmas party nights, the park closes early for regular tickets.",
      "Driving? You park at the Transportation and Ticket Center, then take the monorail or ferry across the lagoon. Allow extra time at opening.",
      "The monorail resorts, the Grand Floridian, Polynesian and Contemporary, make midday breaks easy.",
      "Summer afternoon storms usually pass within an hour. Indoor rides and shows keep running.",
    ],
    faqs: [
      { q: "What is the least crowded day at Magic Kingdom?", a: "Mid-week days, Tuesday through Thursday, outside school holidays tend to be calmer than weekends. Check the party calendar too, since early closing on party nights changes how the day flows." },
      { q: "What is the worst time to visit Magic Kingdom?", a: "The week between Christmas and New Year's, spring break weeks in March and April, and the week of July 4 are the most crowded times of the year." },
      { q: "Does Magic Kingdom close early for parties?", a: "Yes. On Mickey's Not-So-Scary Halloween Party and Mickey's Very Merry Christmas Party nights, the park closes early to guests without a party ticket." },
    ],
    hotels: "Disney World",
    links: [
      { label: "Hotels near Disney World", href: "/place-to-stay/hotels-near-disney-world" },
      { label: "Things to do near Disney World", href: "/book-now/things-to-do-near-disney-world" },
      { label: "Orlando Halloween events guide 2026", href: "/blog/orlando-halloween-events-guide-2026" },
    ],
  },
  {
    slug: "epcot-calendar-best-days",
    title: "EPCOT Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "EPCOT",
    group: "disney",
    opened: "October 1, 1982",
    where: "Walt Disney World, with a main entrance and an International Gateway entrance by the BoardWalk and the Skyliner",
    summary:
      "EPCOT has a festival running for most of the year, so the best days are weekdays during a festival you enjoy. Weekday evenings are great for World Showcase; festival weekends and holiday weeks are the busiest.",
    intro:
      "EPCOT is two parks in one: the front half, now called World Celebration, World Discovery and World Nature, and World Showcase, a lagoon ringed by 11 country pavilions. It is the park locals visit most, because it rarely goes without a festival, and it is the easiest Disney park to enjoy in the evening with a drink and dinner around the world.",
    heroProduct: "3805P2",
    tickets: DISNEY_TICKETS,
    months: {
      1: "EPCOT International Festival of the Arts begins",
      2: "Festival of the Arts continues",
      3: "EPCOT International Flower & Garden Festival begins",
      4: "Flower & Garden Festival",
      5: "Flower & Garden Festival",
      8: "EPCOT International Food & Wine Festival begins",
      9: "Food & Wine Festival; quieter weekdays",
      10: "Food & Wine Festival; weekends are busy",
      11: "Food & Wine wraps up; Festival of the Holidays begins late in the month",
      12: "Festival of the Holidays and the Candlelight Processional",
    },
    timeOfDay: [
      "**Opening:** head to the most popular rides first. World Showcase usually opens later in the morning than the front of the park.",
      "**Midday:** festival booths and the front of the park are busiest; indoor pavilions are a good escape from the heat.",
      "**Evening:** World Showcase is at its best after sunset, and the nighttime show over the lagoon ends the day.",
      "**Skip the main gate:** guests at the BoardWalk, Beach Club, Yacht Club and Skyliner resorts can use the International Gateway entrance between France and the United Kingdom.",
    ],
    events: [
      { name: "EPCOT International Festival of the Arts", when: "Winter, usually January to February", note: "Food studios, live performances and art around World Showcase." },
      { name: "EPCOT International Flower & Garden Festival", when: "Spring into early summer", note: "Character topiaries, gardens and outdoor kitchens." },
      { name: "EPCOT International Food & Wine Festival", when: "Late summer through November", note: "The biggest festival of the year, with dozens of global food and drink booths." },
      { name: "EPCOT International Festival of the Holidays", when: "Late November through December", note: "Holiday kitchens, storytellers and the Candlelight Processional." },
    ],
    tips: [
      "Festival weekends draw a lot of locals. For food booths without the crowds, go on a weekday afternoon.",
      "The Skyliner connects EPCOT with Hollywood Studios and several resorts, which makes it easy to split a day between the two parks.",
      "World Showcase is a big loop, about 1.2 miles around the lagoon. Wear good shoes.",
      "Check the festival calendar before you book; each festival sets its own dates each year.",
    ],
    faqs: [
      { q: "What is the best time of year to visit EPCOT?", a: "It depends on the festival you want. Spring is great for Flower & Garden, fall for Food & Wine, and September weekdays are usually the quietest time to enjoy it." },
      { q: "When is the EPCOT Food & Wine Festival?", a: "It usually runs from late summer through November. Disney announces exact dates each year." },
      { q: "What is the busiest day at EPCOT?", a: "Saturdays, especially during festivals, and holiday weeks such as Christmas to New Year's." },
    ],
    hotels: "Disney World",
    links: [
      { label: "Hotels near Disney World", href: "/place-to-stay/hotels-near-disney-world" },
      { label: "Disney Springs hours and best days", href: "/blog/hours-best-days-disney-springs" },
    ],
  },
  {
    slug: "hollywood-studios-calendar-best-days",
    title: "Hollywood Studios Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "Disney's Hollywood Studios",
    group: "disney",
    opened: "May 1, 1989, as Disney-MGM Studios",
    where: "Walt Disney World, connected to EPCOT and several resorts by the Skyliner and by boat",
    summary:
      "Hollywood Studios is compact and ride-heavy, so crowds feel bigger here. Go on a weekday, arrive for opening to ride Star Wars and Toy Story Land favorites first, and avoid holiday weeks.",
    intro:
      "Hollywood Studios packs some of Disney's most popular rides into a smaller footprint: Star Wars: Galaxy's Edge, Toy Story Land, the Twilight Zone Tower of Terror and more. Because there is less space to spread out, timing your visit matters, and a good morning plan makes the whole day easier.",
    heroProduct: "3805P1",
    tickets: DISNEY_TICKETS,
    months: {
      11: "Holiday season begins; Jollywood Nights after-hours event on select nights",
      12: "Holiday decorations and Jollywood Nights on select nights",
    },
    timeOfDay: [
      "**Opening:** the biggest rides build long lines quickly, so rope drop is the most valuable hour of the day here.",
      "**Midday:** shows such as those in the Animation Courtyard and on Sunset Boulevard are a good break from the heat.",
      "**Evening:** the nighttime shows, including Fantasmic! on scheduled nights, draw big crowds; ride lines often ease while they run.",
    ],
    events: [
      { name: "Disney Jollywood Nights", when: "Select nights, November and December", note: "A separately ticketed holiday after-hours event." },
      { name: "Fantasmic!", when: "Scheduled nights year round", note: "Disney's nighttime spectacular. Check the schedule, it does not run every night." },
    ],
    tips: [
      "Stay at a Skyliner resort, Pop Century, Art of Animation, Caribbean Beach or Riviera, for an easy ride to the gate.",
      "Galaxy's Edge and Toy Story Land are at opposite ends of the park. Pick one for rope drop and head there first.",
      "It is a popular half day for park hoppers, which can make afternoons busier. Mornings are the best time to be here.",
    ],
    faqs: [
      { q: "What is the best day to visit Hollywood Studios?", a: "A weekday outside school holidays, arriving for opening. Tuesday through Thursday are usually calmer than weekends." },
      { q: "Can you do Hollywood Studios in half a day?", a: "Many people do, but the most popular rides have long waits. A full day or a well-planned morning gives you the best chance to ride everything." },
      { q: "What is Jollywood Nights?", a: "A separately ticketed holiday evening event at Hollywood Studios on select nights in November and December." },
    ],
    hotels: "Disney World",
    links: [
      { label: "Hotels near Disney World", href: "/place-to-stay/hotels-near-disney-world" },
      { label: "EPCOT calendar and best days", href: "/blog/epcot-calendar-best-days" },
    ],
  },
  {
    slug: "animal-kingdom-calendar-best-days",
    title: "Animal Kingdom Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "Disney's Animal Kingdom",
    group: "disney",
    opened: "April 22, 1998 (Earth Day)",
    where: "Walt Disney World, on the west side of the property near Blizzard Beach",
    summary:
      "Animal Kingdom rewards early risers: the animals are most active in the cool morning and the park often closes earlier than the other Disney parks. Visit on a weekday, arrive at opening and ride Flight of Passage and the safari first.",
    intro:
      "Animal Kingdom is part zoo, part theme park, with Pandora: The World of Avatar, the Kilimanjaro Safaris, Expedition Everest and the Tree of Life at its center. It is the Disney park locals call best in the morning, because the animals are out and moving before the Florida heat sets in.",
    heroProduct: "3805P1",
    tickets: DISNEY_TICKETS,
    months: {
      4: "The park's anniversary falls on Earth Day, April 22",
      11: "Holiday decorations arrive on Discovery Island",
      12: "Holiday decorations and seasonal entertainment",
    },
    timeOfDay: [
      "**Opening:** the best time for the safari, when animals are most active, and for Avatar Flight of Passage before the line grows.",
      "**Midday:** the hottest part of the day. Shows and shaded walking trails are the move.",
      "**Evening:** the park usually closes earlier than Magic Kingdom and EPCOT. Pandora glows after dark, so stay for sunset if the park is open late.",
    ],
    events: [
      { name: "Holiday season", when: "November and December", note: "Seasonal decorations and entertainment around Discovery Island." },
    ],
    tips: [
      "Check closing time before you plan dinner. Animal Kingdom often closes earlier than the other parks.",
      "Parts of DinoLand U.S.A. are being reimagined. Check the park map for what is open during your visit.",
      "Bring a light rain jacket in summer; many areas are outdoors with limited cover.",
    ],
    faqs: [
      { q: "What time of day is best at Animal Kingdom?", a: "Morning. Animals are most active when it is cooler, and the most popular rides are easiest right after opening." },
      { q: "Is Animal Kingdom a full day?", a: "Many visitors do it in a long morning to mid-afternoon, since the park often closes earlier than the others. Staying for Pandora at night is worth it when the park is open late." },
      { q: "When is Animal Kingdom least crowded?", a: "Weekdays in September, January after New Year's week and late April to mid-May are usually the calmest." },
    ],
    hotels: "Disney World",
    links: [
      { label: "Hotels near Disney World", href: "/place-to-stay/hotels-near-disney-world" },
      { label: "Blizzard Beach calendar and best days", href: "/blog/blizzard-beach-calendar-best-days" },
    ],
  },
  {
    slug: "universal-studios-florida-calendar-best-days",
    title: "Universal Studios Florida Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "Universal Studios Florida",
    group: "universal",
    opened: "June 7, 1990",
    where: "Universal Orlando Resort, a short walk through CityWalk from the parking garages",
    summary:
      "Tuesday to Thursday outside school holidays is the sweet spot at Universal Studios Florida. Check the Halloween Horror Nights calendar in the fall, because the park closes early to day guests on event nights.",
    intro:
      "Universal Studios Florida is the original Universal park, built like a working backlot with New York, San Francisco and London streets. It is home to Diagon Alley and Escape from Gringotts, Revenge of the Mummy and DreamWorks Land, and to Universal's two biggest events of the year, Mardi Gras and Halloween Horror Nights.",
    heroProduct: "3088_1D_UO",
    tickets: UNIVERSAL_TICKETS,
    months: {
      2: "Universal Mardi Gras with parades and concerts on select dates",
      3: "Mardi Gras continues on select dates",
      4: "Mardi Gras season wraps up",
      9: "Halloween Horror Nights begins on select nights",
      10: "Halloween Horror Nights on select nights; the park closes early to day guests",
      11: "Horror Nights ends early in the month; holiday season begins",
      12: "Holidays at Universal with the Macy's holiday parade",
    },
    timeOfDay: [
      "**Opening:** head for Escape from Gringotts or Revenge of the Mummy first. Universal hotel guests get Early Park Admission to select attractions.",
      "**Midday:** indoor rides like Men in Black, Transformers and Minion Mayhem are the best shelter from heat and storms.",
      "**Evening:** lines often ease late in the day, and CityWalk is right outside for dinner.",
    ],
    events: [
      { name: "Universal Mardi Gras", when: "Select dates, late winter into spring", note: "A nightly parade, Louisiana food and concerts on select nights." },
      { name: "Halloween Horror Nights", when: "Select nights, September to early November", note: "Separately ticketed. The park closes early to regular guests on event nights." },
      { name: "Holidays at Universal Orlando", when: "Mid-November to December", note: "Macy's holiday parade and holiday decorations." },
    ],
    tips: [
      "On Halloween Horror Nights dates, the park closes early for day guests. Plan Islands of Adventure for those evenings.",
      "A park-to-park ticket lets you ride the Hogwarts Express from King's Cross to Hogsmeade.",
      "Parking is paid during the day and free after 6 p.m. at CityWalk. See our CityWalk hours guide.",
    ],
    faqs: [
      { q: "What is the best day to go to Universal Studios Florida?", a: "Tuesday, Wednesday or Thursday outside school holidays. Saturdays are the busiest." },
      { q: "Does Universal Studios close early for Halloween Horror Nights?", a: "Yes. On event nights the park closes early to day guests so it can be set up for Horror Nights, which needs a separate ticket." },
      { q: "When is Mardi Gras at Universal?", a: "On select dates from late winter into spring. Universal announces the dates and concert lineup each year." },
    ],
    hotels: "Universal Orlando",
    links: [
      { label: "Universal Studios Orlando attractions list", href: "/blog/universal-studios-orlando-attractions-list" },
      { label: "Universal CityWalk hours and best days", href: "/blog/hours-best-days-universal-citywalk" },
      { label: "Orlando Halloween events guide 2026", href: "/blog/orlando-halloween-events-guide-2026" },
    ],
  },
  {
    slug: "islands-of-adventure-calendar-best-days",
    title: "Islands of Adventure Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "Universal's Islands of Adventure",
    group: "universal",
    opened: "May 28, 1999",
    where: "Universal Orlando Resort, next to CityWalk and Universal Studios Florida",
    summary:
      "Islands of Adventure is the thrill park, so go mid-week and ride Hagrid's and VelociCoaster at opening. In summer, ride the big outdoor coasters early before afternoon storms roll in.",
    intro:
      "Islands of Adventure is Universal's thrill-ride park: Jurassic World VelociCoaster, Hagrid's Magical Creatures Motorbike Adventure, the Incredible Hulk Coaster and the water rides of Toon Lagoon, plus Hogsmeade and Seuss Landing for the whole family. The rides that make it great are mostly outdoors, which makes timing and weather part of the plan.",
    heroProduct: "3088_1D_UO",
    tickets: UNIVERSAL_TICKETS,
    months: {
      6: "Water rides are a relief; outdoor coasters pause for afternoon lightning",
      7: "Peak summer crowds and heat",
      11: "Holiday season begins in Seuss Landing and Hogsmeade",
      12: "Grinchmas in Seuss Landing and the holiday show at Hogwarts Castle",
    },
    timeOfDay: [
      "**Opening:** Hagrid's and VelociCoaster build the longest lines. Pick one for rope drop.",
      "**Midday:** ride the water rides in the heat of the day, then let the sun dry you off.",
      "**Afternoon:** summer storms can shut outdoor coasters. Head to Forbidden Journey or Spider-Man, which are indoors.",
    ],
    events: [
      { name: "Grinchmas", when: "Mid-November to December", note: "Holiday shows and the Grinch in Seuss Landing." },
      { name: "Christmas in the Wizarding World", when: "Mid-November to December", note: "Holiday decorations in Hogsmeade and a nighttime show on Hogwarts Castle." },
    ],
    tips: [
      "Bring quick-dry clothes for Toon Lagoon; the Bilge-Rat Barges will soak you.",
      "VelociCoaster, the Hulk and Hagrid's do not allow loose items. Free lockers sit at each ride entrance.",
      "Use a park-to-park ticket to ride the Hogwarts Express to Diagon Alley.",
    ],
    faqs: [
      { q: "What is the least crowded day at Islands of Adventure?", a: "Tuesday through Thursday outside school holidays are usually the calmest." },
      { q: "Do rides at Islands of Adventure close for rain?", a: "Outdoor coasters and water rides pause for lightning, which is common on summer afternoons. Indoor rides keep running." },
      { q: "What is Grinchmas?", a: "Universal's holiday celebration in Seuss Landing, with shows and the Grinch, from mid-November through December." },
    ],
    hotels: "Universal Orlando",
    links: [
      { label: "Universal Studios Orlando attractions list", href: "/blog/universal-studios-orlando-attractions-list" },
      { label: "Universal Studios Florida calendar", href: "/blog/universal-studios-florida-calendar-best-days" },
    ],
  },
  {
    slug: "epic-universe-calendar-best-days",
    title: "Epic Universe Calendar & Best Days to Go",
    heroProduct: "3088_2D_UO",
    illustration: "theme-parks",
    park: "Universal Epic Universe",
    group: "universal",
    opened: "May 22, 2025",
    where: "A few miles south of the original Universal resort, with its own entrance and parking",
    summary:
      "Epic Universe is Universal's newest and most in-demand park, so every day is busy. Your best odds are a mid-week day in the quieter months, arriving before opening.",
    intro:
      "Epic Universe opened in May 2025 as Universal Orlando's third theme park, with five worlds: Celestial Park, Super Nintendo World, How to Train Your Dragon: Isle of Berk, Dark Universe and the Wizarding World of Harry Potter: Ministry of Magic. As the newest park in Orlando, demand is high, and it needs its own ticket.",
    tickets: UNIVERSAL_TICKETS,
    months: {},
    timeOfDay: [
      "**Opening:** most guests head to the Ministry of Magic or Super Nintendo World. Consider starting somewhere else and working back.",
      "**Midday:** Celestial Park's gardens and splash pad are a good break, and the Isle of Berk has shows.",
      "**Evening:** lines on the headliners can ease late in the day.",
    ],
    events: [],
    tips: [
      "Epic Universe is a separate park with its own entrance. Check that your ticket includes it.",
      "It is a few miles from the original resort, so plan transportation before you go.",
      "As a new park, hours, events and attractions are still evolving. Check the official calendar close to your date.",
    ],
    faqs: [
      { q: "When did Epic Universe open?", a: "Epic Universe opened on May 22, 2025." },
      { q: "Is Epic Universe included in a regular Universal ticket?", a: "Not automatically. You need a ticket that specifically includes Epic Universe." },
      { q: "What is the best day to visit Epic Universe?", a: "A mid-week day in a quieter month, such as September or late January, arriving before opening." },
    ],
    hotels: "Universal Orlando",
    links: [
      { label: "Epic Universe map and layout", href: "/blog/epic-universe-map-layout" },
      { label: "Universal Studios Orlando attractions list", href: "/blog/universal-studios-orlando-attractions-list" },
      { label: "Islands of Adventure calendar", href: "/blog/islands-of-adventure-calendar-best-days" },
    ],
  },
  {
    slug: "volcano-bay-calendar-best-days",
    title: "Volcano Bay Calendar & Best Days to Go",
    heroProduct: "3088P1",
    illustration: "water",
    park: "Universal's Volcano Bay",
    group: "water",
    opened: "May 25, 2017",
    where: "Universal Orlando Resort, reached by shuttle from the main resort area",
    summary:
      "Go on a hot weekday morning in late spring, summer or early fall and arrive before opening. Volcano Bay has closed for part of the cooler months in recent years, so check the calendar before you plan a winter visit.",
    intro:
      "Volcano Bay is Universal's water theme park, built around the 200-foot Krakatau volcano. Three villages ring the volcano, and the whole park can be walked end to end in under 10 minutes. TapuTapu virtual lines have been retired, so you now wait in each slide's queue.",
    months: {
      1: "Check the calendar; the park has closed for part of the cooler months in recent years",
      2: "Check the calendar for seasonal operation",
      6: "Summer heat and crowds; afternoon lightning can pause slides",
      7: "Peak season",
      8: "Busy until Florida schools return",
      12: "Check the calendar for seasonal operation",
    },
    timeOfDay: [
      "**Opening:** waits are shortest in the first hour. Head straight to Krakatau Aqua Coaster or the Rainforest Village slides.",
      "**Midday:** slide queues peak, so it is a good time for the lazy river, the wave pool and lunch.",
      "**Afternoon:** summer storms can pause slides and pools for lightning.",
    ],
    events: [],
    tips: [
      "Download the park map before you go and rent a locker first thing.",
      "Bring water shoes; the paths get hot.",
      "Arrive early on summer weekends; the park can reach capacity.",
    ],
    faqs: [
      { q: "Is Volcano Bay open all year?", a: "In recent years Volcano Bay has closed for part of the cooler months. Check Universal's calendar for your dates." },
      { q: "How do lines work at Volcano Bay?", a: "TapuTapu virtual lines have been retired. You walk to each slide and wait in its queue, and the Universal Orlando app shows live wait times." },
      { q: "What is the best time to visit Volcano Bay?", a: "A hot weekday morning in late spring, summer or early fall, arriving before opening." },
    ],
    hotels: "Universal Orlando",
    links: [
      { label: "Volcano Bay map and layout (PDF map)", href: "/blog/volcano-bay-map-layout" },
      { label: "Best water parks in Orlando", href: "/blog/best-water-parks-in-orlando-florida" },
      { label: "Universal CityWalk hours and best days", href: "/blog/hours-best-days-universal-citywalk" },
    ],
  },
  {
    slug: "typhoon-lagoon-calendar-best-days",
    title: "Typhoon Lagoon Calendar & Best Days to Go",
    heroProduct: "3805P7",
    illustration: "water",
    park: "Disney's Typhoon Lagoon",
    group: "water",
    opened: "June 1, 1989",
    where: "Walt Disney World, near Disney Springs",
    summary:
      "Visit on a hot weekday from late spring to early fall and arrive at opening. In the cooler months, Disney usually operates only one of its two water parks while the other is refurbished, so check which is open.",
    intro:
      "Typhoon Lagoon is Disney's shipwrecked-island water park, with Miss Tilly, the shrimp boat stuck on top of Mount Mayday, and one of the largest wave pools in North America. It is a family favorite because the wave pool and lazy river work for every age.",
    tickets: ["3805P7", "3805P4"],
    months: {
      1: "Check the calendar; Disney usually runs one water park at a time in winter",
      2: "Check the calendar for seasonal operation",
      6: "Peak water park season; afternoon lightning can pause attractions",
      7: "Peak season",
      12: "Check the calendar for seasonal operation",
    },
    timeOfDay: [
      "**Opening:** grab a shaded spot early and ride the most popular slides before lines build.",
      "**Midday:** the wave pool and lazy river are busiest; take a break in the shade.",
      "**Afternoon:** summer storms can pause everything for lightning, usually for under an hour.",
    ],
    events: [
      { name: "H2O Glow After Hours", when: "Select summer nights", note: "A separately ticketed after-hours event in recent summers." },
    ],
    tips: [
      "Some Disney tickets include water park visits. Check the Water Park and Sports option.",
      "Disney Springs is next door for dinner after a water park day.",
    ],
    faqs: [
      { q: "Is Typhoon Lagoon open year round?", a: "Disney usually keeps one of its two water parks closed for refurbishment in the cooler months. Check which park is open for your dates." },
      { q: "What is the best time to go to Typhoon Lagoon?", a: "A hot weekday morning from late spring to early fall." },
      { q: "Can I visit Typhoon Lagoon with my Disney ticket?", a: "Only if your ticket includes water park visits, such as the Water Park and Sports option, or you buy a separate water park ticket." },
    ],
    hotels: "Disney World",
    links: [
      { label: "Best water parks in Orlando", href: "/blog/best-water-parks-in-orlando-florida" },
      { label: "Blizzard Beach calendar", href: "/blog/blizzard-beach-calendar-best-days" },
    ],
  },
  {
    slug: "blizzard-beach-calendar-best-days",
    title: "Blizzard Beach Calendar & Best Days to Go",
    heroProduct: "3805P7",
    illustration: "water",
    park: "Disney's Blizzard Beach",
    group: "water",
    opened: "April 1, 1995",
    where: "Walt Disney World, near Animal Kingdom",
    summary:
      "Go on a hot weekday from late spring to early fall, arriving at opening. Disney usually runs only one water park in the cooler months, so confirm Blizzard Beach is open before you go.",
    intro:
      "Blizzard Beach is Disney's ski-resort water park, with a chairlift up Mount Gushmore and Summit Plummet, one of the tallest and fastest water slides in the world. It is the thrill-seeker's pick of Disney's two water parks.",
    tickets: ["3805P7", "3805P4"],
    months: {
      1: "Check the calendar; Disney usually runs one water park at a time in winter",
      2: "Check the calendar for seasonal operation",
      6: "Peak season; afternoon lightning can pause slides",
      7: "Peak season",
      12: "Check the calendar for seasonal operation",
    },
    timeOfDay: [
      "**Opening:** ride the chairlift and big slides before the lines build.",
      "**Midday:** the lazy river loops the whole park and is the best way to cool off.",
      "**Afternoon:** summer storms can pause slides for lightning.",
    ],
    events: [],
    tips: [
      "Some Disney tickets include water park visits. Check the Water Park and Sports option.",
      "Pair it with an Animal Kingdom morning; the parks are close together.",
    ],
    faqs: [
      { q: "Is Blizzard Beach open in winter?", a: "Disney usually operates one of its two water parks at a time in the cooler months. Check which one is open for your dates." },
      { q: "What is Summit Plummet?", a: "Blizzard Beach's signature speed slide, a near-vertical drop from the top of Mount Gushmore." },
      { q: "What is the best day to visit Blizzard Beach?", a: "A hot weekday outside school holidays, arriving at opening." },
    ],
    hotels: "Disney World",
    links: [
      { label: "Best water parks in Orlando", href: "/blog/best-water-parks-in-orlando-florida" },
      { label: "Typhoon Lagoon calendar", href: "/blog/typhoon-lagoon-calendar-best-days" },
    ],
  },
  {
    slug: "seaworld-orlando-calendar-best-days",
    title: "SeaWorld Orlando Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "SeaWorld Orlando",
    group: "seaworld",
    opened: "December 15, 1973",
    where: "The south end of International Drive, next to Aquatica and Discovery Cove",
    summary:
      "Weekdays outside school holidays are the easiest days at SeaWorld Orlando. Event weekends, like the spring food festival and fall Howl-O-Scream nights, bring the biggest local crowds.",
    intro:
      "SeaWorld Orlando mixes marine life with some of the best coasters in Florida: Mako, Kraken, Manta, Ice Breaker, Pipeline and Penguin Trek, plus Sesame Street Land for younger kids. It has a busy events calendar year round, which is worth knowing before you pick your day.",
    months: {
      3: "Seven Seas Food Festival on select dates",
      4: "Seven Seas Food Festival on select dates",
      5: "Seven Seas Food Festival wraps up",
      6: "Summer nights with Electric Ocean",
      7: "Electric Ocean summer nights",
      9: "Howl-O-Scream on select nights; Sesame Street Halloween weekends for kids",
      10: "Howl-O-Scream and Halloween weekends",
      11: "Christmas Celebration begins",
      12: "Christmas Celebration",
    },
    timeOfDay: [
      "**Opening:** ride the big coasters first; lines grow by late morning.",
      "**Midday:** animal habitats and shows are the best way through the heat.",
      "**Evening:** seasonal nighttime events fill the park on scheduled nights.",
    ],
    events: [
      { name: "Seven Seas Food Festival", when: "Spring, select dates", note: "International food and drink booths and concerts." },
      { name: "Electric Ocean", when: "Summer nights", note: "Evening entertainment and light shows." },
      { name: "Howl-O-Scream", when: "Select nights, September and October", note: "Separately ticketed Halloween nights; not for young kids." },
      { name: "SeaWorld's Christmas Celebration", when: "Late November and December", note: "Holiday lights and shows." },
    ],
    tips: [
      "Aquatica is across the road and Discovery Cove is next door; hotels near one are near all three.",
      "Parking is paid; hotels on International Drive are close.",
      "Coasters pause for lightning on summer afternoons.",
    ],
    faqs: [
      { q: "What is the best day to visit SeaWorld Orlando?", a: "Tuesday through Thursday outside holidays are usually quietest. Weekends during events are busiest." },
      { q: "When is Howl-O-Scream at SeaWorld Orlando?", a: "On select nights in September and October. SeaWorld announces dates each year." },
      { q: "Is SeaWorld Orlando open all year?", a: "Yes. SeaWorld Orlando is open year round, with hours that change by season." },
    ],
    hotels: "International Drive",
    links: [
      { label: "Hotels near SeaWorld Orlando", href: "/place-to-stay/hotels-near-seaworld-orlando" },
      { label: "Is Discovery Cove worth it?", href: "/blog/is-discovery-cove-worth-it" },
      { label: "Orlando Halloween events guide 2026", href: "/blog/orlando-halloween-events-guide-2026" },
    ],
  },
  {
    slug: "aquatica-orlando-calendar-best-days",
    title: "Aquatica Orlando Calendar & Best Days to Go",
    illustration: "water",
    park: "Aquatica Orlando",
    group: "water",
    opened: "2008",
    where: "International Drive, across the road from SeaWorld Orlando",
    summary:
      "A hot weekday from late spring to early fall is ideal. Aquatica runs a reduced schedule in the cooler months, so check the calendar before you plan a winter visit.",
    intro:
      "Aquatica is SeaWorld's water park, with slides that pass through animal habitats, including Dolphin Plunge through the Commerson's dolphin habitat, two side-by-side wave pools and a lazy river. It is a strong pick for younger kids as well as thrill seekers.",
    months: {
      1: "Reduced schedule in cooler months; check the calendar",
      2: "Reduced schedule; check the calendar",
      6: "Peak season; afternoon lightning can pause slides",
      7: "Peak season",
      12: "Reduced schedule; check the calendar",
    },
    timeOfDay: [
      "**Opening:** head to the biggest slides first.",
      "**Midday:** wave pools and the lazy river are the busiest; find shade.",
      "**Afternoon:** lightning can pause slides in summer.",
    ],
    events: [],
    tips: [
      "Combine it with SeaWorld on a multi-park ticket if you plan to do both.",
      "Cabanas and lockers cost extra and sell out on busy days.",
    ],
    faqs: [
      { q: "Is Aquatica Orlando open all year?", a: "It runs a reduced schedule in the cooler months. Check the calendar for your dates." },
      { q: "What is the best time to visit Aquatica?", a: "A hot weekday morning from late spring to early fall." },
      { q: "Is Aquatica good for young kids?", a: "Yes. It has shallow play areas and gentle slides for younger children alongside bigger thrill slides." },
    ],
    hotels: "International Drive",
    links: [
      { label: "Aquatica Orlando map and layout", href: "/blog/aquatica-orlando-map-layout" },
      { label: "Hotels near SeaWorld Orlando", href: "/place-to-stay/hotels-near-seaworld-orlando" },
      { label: "Best water parks in Orlando", href: "/blog/best-water-parks-in-orlando-florida" },
    ],
  },
  {
    slug: "discovery-cove-calendar-best-days",
    title: "Discovery Cove Calendar & Best Days to Go",
    illustration: "water",
    park: "Discovery Cove",
    group: "seaworld",
    opened: "2000",
    where: "Next to SeaWorld Orlando, off International Drive",
    summary:
      "Discovery Cove limits how many guests it admits each day, so it never feels like a crowded park. The best days are warm, sunny ones from spring to fall; book ahead, since reservations sell out.",
    intro:
      "Discovery Cove is Orlando's day-resort park: snorkeling with tropical fish and rays, a lazy river, an aviary and optional dolphin swims, with meals and snacks included. Because attendance is capped and reservations are required, the calendar question is less about crowds and more about weather and availability.",
    months: {
      1: "Cooler water and air; bring a wetsuit or plan a sunny day",
      2: "Cooler days; pick a sunny afternoon",
      6: "Warm water; afternoon storms are common",
      7: "Warm water; book early for summer",
      12: "Cooler days; holiday weeks book up",
    },
    timeOfDay: [
      "**Arrival:** check in early to get the most from your day and a good lounge spot.",
      "**Midday:** lunch is included; the reef is quieter while others eat.",
      "**Afternoon:** summer storms can pause water activities briefly.",
    ],
    events: [],
    tips: [
      "Reservations are required and limited. Book as soon as you know your dates.",
      "Check what your package includes, such as the dolphin swim and SeaWorld or Aquatica admission.",
      "Sunscreen must be reef safe; Discovery Cove provides it.",
    ],
    faqs: [
      { q: "Is Discovery Cove crowded?", a: "No. It limits daily attendance and requires reservations, so it feels calm compared with the big parks." },
      { q: "What is the best time of year for Discovery Cove?", a: "Warm, sunny days from spring to fall, when the water is most comfortable." },
      { q: "Is Discovery Cove worth it?", a: "See our full guide for what is included and who it suits best." },
    ],
    hotels: "International Drive",
    links: [
      { label: "Is Discovery Cove worth it?", href: "/blog/is-discovery-cove-worth-it" },
      { label: "Hotels near SeaWorld Orlando", href: "/place-to-stay/hotels-near-seaworld-orlando" },
    ],
  },
  {
    slug: "legoland-florida-calendar-best-days",
    title: "LEGOLAND Florida Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "LEGOLAND Florida Resort",
    group: "legoland",
    opened: "October 15, 2011",
    where: "Winter Haven, about 45 minutes southwest of the Disney area, on the site of the historic Cypress Gardens",
    summary:
      "LEGOLAND Florida does not open every day outside busy seasons, so check the operating calendar first. When it is open, weekdays are the calmest; event weekends in October and December are the busiest.",
    intro:
      "LEGOLAND Florida is built for kids roughly 2 to 12, with more than 50 rides, shows and attractions, a water park and the botanical gardens that survive from Cypress Gardens, Florida's first theme park. It sits in Winter Haven rather than Orlando, and it runs a more limited calendar than the big parks.",
    heroProduct: "5343ENTRY",
    tickets: ["5343ENTRY", "5343P4"],
    months: {
      10: "Brick-or-Treat Halloween celebration on select dates",
      12: "Holidays at LEGOLAND on select dates",
      6: "Water park season",
      7: "Water park season",
    },
    timeOfDay: [
      "**Opening:** the most popular kids' rides are easiest first thing.",
      "**Midday:** the water park is the best place in the heat, when it is open.",
      "**Afternoon:** the gardens are shaded and quiet.",
    ],
    events: [
      { name: "Brick-or-Treat", when: "Select dates in October", note: "LEGOLAND's family Halloween celebration." },
      { name: "Holidays at LEGOLAND", when: "Select dates in December", note: "Holiday decorations and entertainment." },
    ],
    tips: [
      "Check the LEGOLAND calendar before you plan; some weekdays are closed outside busy seasons.",
      "Peppa Pig Theme Park is next door on a separate ticket, for younger kids.",
      "Allow about 45 minutes from the Disney area on I-4.",
    ],
    faqs: [
      { q: "Is LEGOLAND Florida open every day?", a: "Not always. Outside busy seasons, some weekdays are closed. Check the operating calendar for your dates." },
      { q: "What age is LEGOLAND Florida best for?", a: "It is designed for kids roughly 2 to 12." },
      { q: "How far is LEGOLAND from Orlando?", a: "About 45 minutes from the Disney area, in Winter Haven." },
    ],
    hotels: "",
    links: [
      { label: "Hotels near LEGOLAND Florida", href: "/place-to-stay/hotels-near-legoland-florida" },
      { label: "Peppa Pig Theme Park calendar", href: "/blog/peppa-pig-theme-park-calendar-best-days" },
    ],
  },
  {
    slug: "peppa-pig-theme-park-calendar-best-days",
    title: "Peppa Pig Theme Park Calendar & Best Days to Go",
    illustration: "theme-parks",
    park: "Peppa Pig Theme Park Florida",
    group: "legoland",
    opened: "February 24, 2022",
    where: "Winter Haven, next to LEGOLAND Florida",
    summary:
      "Peppa Pig Theme Park runs on a limited calendar outside busy seasons, so check operating days first. Weekday mornings when it is open are the calmest, and it pairs easily with LEGOLAND next door.",
    intro:
      "Peppa Pig Theme Park Florida opened in 2022 next to LEGOLAND and is made for toddlers and preschoolers, with gentle rides, play areas and muddy-puddle splash zones. It is a short, easy day, which makes it a good add-on to a LEGOLAND trip.",
    heroProduct: "5343P4",
    tickets: ["5343P4", "5343ENTRY"],
    months: {},
    timeOfDay: [
      "**Opening:** little ones have the most energy in the morning.",
      "**Midday:** splash areas cool kids off; bring a change of clothes.",
      "**Afternoon:** many families finish by early afternoon for naps.",
    ],
    events: [],
    tips: [
      "Check the calendar; not every day is an operating day outside busy seasons.",
      "It is a separate ticket from LEGOLAND; combo tickets can save money.",
    ],
    faqs: [
      { q: "What age is Peppa Pig Theme Park for?", a: "It is designed for toddlers and preschoolers." },
      { q: "Is Peppa Pig Theme Park next to LEGOLAND?", a: "Yes. It sits beside LEGOLAND Florida in Winter Haven, with a separate ticket." },
      { q: "How long do you need at Peppa Pig Theme Park?", a: "Most families spend a morning or half day." },
    ],
    hotels: "",
    links: [
      { label: "LEGOLAND Florida calendar", href: "/blog/legoland-florida-calendar-best-days" },
      { label: "Hotels near LEGOLAND Florida", href: "/place-to-stay/hotels-near-legoland-florida" },
    ],
  },
];

function buildBody(p: ParkCalendar, siblings: ParkCalendar[]): string {
  const monthRows = BASE.map((b, i) => {
    const extra = p.months[i + 1];
    return `| ${MONTHS[i]} | ${b.crowd} | ${b.note}${extra ? `. ${extra}` : ""} |`;
  }).join("\n");
  const dayRows = DAYS[p.group].map((d) => `| ${d.day} | ${d.crowd} | ${d.note} |`).join("\n");
  const events = p.events.length
    ? `## ${p.park} seasonal events\n\n${p.events.map((e) => `- **${e.name}** (${e.when}): ${e.note}`).join("\n")}\n\nEvent dates are announced by the park each year, so confirm them on the official calendar before you book.\n`
    : "";
  const tickets = p.tickets?.length ? `## ${p.park} tickets\n\nCompare tickets with live prices and traveler reviews below.\n\n[[products:${p.tickets.join(",")}]]\n` : "";
  const hotels = p.hotels ? `[[hotels:${p.hotels}]]` : "[[hotels]]";
  const more = siblings
    .filter((s) => s.slug !== p.slug && s.group === p.group)
    .slice(0, 4)
    .map((s) => `- [${s.title}](/blog/${s.slug})`)
    .join("\n");

  return `
${p.summary}

${p.intro}

## ${p.park} at a glance

- **Opened:** ${p.opened}
- **Where:** ${p.where}
- **Hours:** vary by day and season. Always check the official park calendar for your date.

## ${p.park} calendar: month by month

| Month | Crowds | What to expect |
|---|---|---|
${monthRows}

> Crowd levels are the typical pattern. Holidays, school breaks and special events can shift them, so check the official calendar for your dates.

## The best days of the week to go

| Day | Crowds | Why |
|---|---|---|
${dayRows}

## The best time of day

${p.timeOfDay.map((t) => `- ${t}`).join("\n")}

${events}
## Weather to plan around

- **Summer (June to September):** hot and humid, with short afternoon thunderstorms most days. Outdoor rides pause for lightning, usually for under an hour.
- **Hurricane season:** June 1 to November 30. Most days are unaffected, but watch the forecast and consider travel insurance.
- **Winter (December to February):** mild and dry, with the occasional cold snap. Great for walking, chilly for water rides.
- **Spring and fall:** warm, comfortable and usually drier.

See our guide to the [best time to visit Orlando](/blog/best-time-to-visit-orlando) for more.

## Local tips

${p.tips.map((t) => `- ${t}`).join("\n")}

${tickets}
${hotels}

## Frequently asked questions

${p.faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Keep planning

${p.links.map((l) => `- [${l.label}](${l.href})`).join("\n")}
- [Best theme parks in Orlando](/blog/best-theme-parks-in-orlando)
- [Orlando events calendar](/events)
${more}
`;
}

export const parkCalendarPosts: Post[] = parkCalendars.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: `${p.park} calendar with monthly crowds, the best days of the week and time of day to go, seasonal events and local tips for planning your visit.`.slice(0, 160),
  excerpt: p.summary,
  published: "2026-09-25",
  updated: "2026-09-25",
  category: "Theme Parks",
  illustration: p.illustration,
  heroProduct: p.heroProduct,
  featuredListings: [],
  body: buildBody(p, parkCalendars),
}));
