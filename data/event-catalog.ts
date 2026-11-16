import type { OrlandoEvent } from "./event-types";

const VISIT_ORLANDO = {
  name: "Visit Orlando holiday announcement",
  url: "https://www.visitorlando.org/media/press-releases/post/orlando-unwraps-holiday-magic-with-new-experiences-and-returning-favorites-this-season/",
};

const MAGIC_HOME = [
  "2026-11-18",
  "2026-11-24",
  "2026-12-14",
  "2026-12-16",
  "2026-12-21",
  "2026-12-23",
  "2026-12-26",
  "2026-12-27",
  "2027-01-03",
  "2027-01-05",
  "2027-01-07",
  "2027-01-10",
  "2027-01-19",
  "2027-01-22",
  "2027-01-24",
  "2027-01-28",
  "2027-01-31",
  "2027-02-02",
  "2027-02-12",
  "2027-02-13",
  "2027-02-17",
  "2027-02-25",
  "2027-02-28",
  "2027-03-02",
  "2027-03-04",
  "2027-03-05",
  "2027-03-09",
  "2027-03-20",
  "2027-03-22",
  "2027-03-28",
  "2027-03-30",
];

/**
 * Orlando-area events for the 2026 holiday season through March 2027,
 * plus the annual calendar. Dates and prices are copied from organizer
 * pages unless `datesConfirmed` is false.
 */
export const eventCatalog: OrlandoEvent[] = [
  {
    slug: "mickeys-very-merry-christmas-party",
    name: "Mickey's Very Merry Christmas Party",
    months: [11, 12],
    timing: "Select nights November 8–December 22, 2026, 7 p.m.–midnight",
    where: "Magic Kingdom",
    area: "Walt Disney World",
    category: "Holiday",
    tags: ["family", "kids", "holiday", "nightlife", "theme-park"],
    description:
      "A separately ticketed Magic Kingdom night with a Christmas parade, fireworks, character meets and cookies. Party tickets enter as early as 4 p.m. and do not need a daytime park ticket.",
    price: "$189–$229 plus tax; $10 off ages 3–9",
    audience: "Families and anyone who wants Magic Kingdom after dark",
    officialUrl: "https://disneyworld.disney.go.com/events-tours/magic-kingdom/mickeys-very-merry-christmas-party/",
    officialLabel: "Disney's party page",
    sources: [
      {
        name: "Walt Disney World — Mickey's Very Merry Christmas Party",
        url: "https://disneyworld.disney.go.com/events-tours/magic-kingdom/mickeys-very-merry-christmas-party/",
      },
    ],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-11-08",
    endDate: "2026-12-22",
    dates: [
      "2026-11-08",
      "2026-11-09",
      "2026-11-12",
      "2026-11-13",
      "2026-11-15",
      "2026-11-17",
      "2026-11-19",
      "2026-11-20",
      "2026-11-24",
      "2026-11-25",
      "2026-11-27",
      "2026-11-29",
      "2026-12-01",
      "2026-12-03",
      "2026-12-04",
      "2026-12-06",
      "2026-12-08",
      "2026-12-10",
      "2026-12-11",
      "2026-12-13",
      "2026-12-15",
      "2026-12-17",
      "2026-12-18",
      "2026-12-20",
      "2026-12-22",
    ],
    detail: true,
    venueName: "Magic Kingdom Park",
    locality: "Bay Lake",
    organizer: "Walt Disney World",
    offer: { low: "189", high: "229" },
    tourQuery: "mickey's very merry|special event tickets|resort base ticket|park hopper tickets",
    tourPrefer: "mickey's very merry",
    bookHref: "/book-now/theme-parks",
    bookLabel: "Disney tickets on Viator",
    weight: 1,
    seoTitle: "Mickey's Very Merry Christmas Party 2026",
    seoDescription:
      "Mickey's Very Merry Christmas Party runs select nights November 8 to December 22, 2026, at Magic Kingdom. Tickets are $189 to $229 plus tax.",
    tip: "Tonight, November 15, is a party night. December nights are the ones that sell out first.",
    guide: `
Disney lists **25 party nights** from November 8 through December 22, 2026. The event runs **7 p.m. to midnight**. A party ticket admits you to Magic Kingdom as early as **4 p.m.** and does not require a separate daytime theme park ticket or a park reservation.

Published ticket prices are **$189 to $229 plus tax**, varying by night. Children ages 3 to 9 save $10. Annual Passholders and Disney Vacation Club Members save $10 on select nights from November 8 to 20 and from November 29 to December 3.

## Nights still ahead

- **November:** 15, 17, 19, 20, 24, 25, 27 and 29
- **December:** 1, 3, 4, 6, 8, 10, 11, 13, 15, 17, 18, 20 and 22

The party includes a holiday parade, fireworks and treat stations. Booked dining that night is extra and, Disney notes, requires a party ticket for the same night. Specialty snacks and merchandise are not included in the ticket.
`,
    faqs: [
      {
        q: "What nights is Mickey's Very Merry Christmas Party in 2026?",
        a: "Disney lists November 8, 9, 12, 13, 15, 17, 19, 20, 24, 25, 27 and 29, plus December 1, 3, 4, 6, 8, 10, 11, 13, 15, 17, 18, 20 and 22. The party runs 7 p.m. to midnight, with entry from 4 p.m.",
      },
      {
        q: "How much are Mickey's Very Merry Christmas Party tickets?",
        a: "Disney lists 2026 tickets at $189 to $229 plus tax, depending on the night. Children ages 3 to 9 are $10 less. A party ticket does not need a separate Magic Kingdom day ticket.",
      },
      {
        q: "Is Mickey's Very Merry Christmas Party good for kids?",
        a: "Yes. It is a family night, with a parade, characters, fireworks and cookies. It is a different event from Mickey's Not-So-Scary Halloween Party, which has already ended for 2026.",
      },
    ],
  },
  {
    slug: "jollywood-nights",
    name: "Disney Jollywood Nights",
    months: [11, 12, 1],
    timing: "Select nights November 7, 2026–January 5, 2027, 7:30 p.m.–12:30 a.m.",
    where: "Disney's Hollywood Studios",
    area: "Walt Disney World",
    category: "Holiday",
    tags: ["holiday", "nightlife", "theme-park", "family"],
    description:
      "A separately ticketed Hollywood Studios party with characters, nighttime attractions and a holiday show. Entry starts at 5:30 p.m. This is the first year Disney has extended it into January.",
    price: "$169–$199 plus tax; $10 off ages 3–9",
    audience: "Teens, adults and families who like a later night",
    officialUrl: "https://disneyworld.disney.go.com/events-tours/hollywood-studios/jollywood-nights/",
    officialLabel: "Disney's Jollywood Nights page",
    sources: [
      {
        name: "Walt Disney World — Disney Jollywood Nights",
        url: "https://disneyworld.disney.go.com/events-tours/hollywood-studios/jollywood-nights/",
      },
      {
        name: "Disney Parks Blog — Jollywood Nights dates",
        url: "https://disneyparksblog.com/wdw/disney-jollywood-nights-dates-tickets-and-more/",
      },
    ],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-11-07",
    endDate: "2027-01-05",
    dates: [
      "2026-11-07",
      "2026-11-14",
      "2026-11-16",
      "2026-11-21",
      "2026-11-23",
      "2026-11-28",
      "2026-12-05",
      "2026-12-07",
      "2026-12-12",
      "2026-12-14",
      "2026-12-19",
      "2026-12-21",
      "2026-12-23",
      "2027-01-03",
      "2027-01-05",
    ],
    detail: true,
    venueName: "Disney's Hollywood Studios",
    locality: "Bay Lake",
    organizer: "Walt Disney World",
    offer: { low: "169", high: "199" },
    tourQuery: "special event tickets|resort base ticket|park hopper tickets",
    tourPrefer: "special event",
    bookHref: "/book-now/theme-parks",
    bookLabel: "Disney tickets on Viator",
    weight: 2,
    seoTitle: "Disney Jollywood Nights 2026 Dates and Prices",
    seoDescription:
      "Disney Jollywood Nights is at Hollywood Studios on select nights from November 7, 2026 to January 5, 2027. Tickets are $169 to $199 plus tax.",
    tip: "The next party is Monday, November 16. There is no Jollywood Nights on New Year's Eve.",
    guide: `
Disney Jollywood Nights is a **separately ticketed** night at Disney's Hollywood Studios. The 2026–27 season runs on 15 nights from **November 7, 2026 through January 5, 2027**, the first year Disney has carried it into January. Hours are **7:30 p.m. to 12:30 a.m.**, and ticket holders may enter at **5:30 p.m.** A daytime Hollywood Studios ticket is not required.

Disney lists tickets at **$169 to $199 plus tax**. Children ages 3 to 9 save $10. Annual Passholders and Disney Vacation Club Members save $10 on every party night.

## Remaining nights

- **November:** 16, 21, 23 and 28
- **December:** 5, 7, 12, 14, 19, 21 and 23
- **January:** 3 and 5, 2027

Food, drinks and merchandise are extra. Disney includes PhotoPass downloads from the event with the ticket. Tickets are limited. If a November night is gone, December 7 and the January dates were still the ones to check when this page was updated.
`,
    faqs: [
      {
        q: "When is Disney Jollywood Nights in 2026?",
        a: "Select nights from November 7, 2026 through January 5, 2027: November 7, 14, 16, 21, 23 and 28; December 5, 7, 12, 14, 19, 21 and 23; and January 3 and 5. The party runs 7:30 p.m. to 12:30 a.m.",
      },
      {
        q: "How much is Jollywood Nights?",
        a: "Disney lists 2026–27 tickets at $169 to $199 plus tax, depending on the night. Ages 3 to 9 save $10, and Annual Passholders and Disney Vacation Club Members save $10 on every night.",
      },
      {
        q: "Is Jollywood Nights on New Year's Eve?",
        a: "No. The last December party is December 23, 2026. The event returns January 3 and 5, 2027.",
      },
    ],
  },
  {
    slug: "universal-holidays",
    name: "Holidays at Universal Orlando",
    months: [11, 12, 1],
    timing: "November 14, 2026–January 3, 2027",
    where: "Universal Studios Florida, Islands of Adventure and Epic Universe",
    area: "Universal Orlando",
    category: "Holiday",
    tags: ["family", "kids", "holiday", "theme-park"],
    description:
      "Grinchmas, the Macy's holiday parade and Christmas in the Wizarding World, included with park admission. Epic Universe adds holiday décor in Super Nintendo World, Isle of Berk and Celestial Park for the first time.",
    price: "Included with park admission. Holiday Tour from $69.99 plus tax",
    audience: "Families, including young children",
    officialUrl: "https://www.universalorlando.com/web/en/us/things-to-do/events/holidays-at-universal",
    officialLabel: "Universal's holidays page",
    sources: [
      {
        name: "Universal Orlando — Holidays",
        url: "https://www.universalorlando.com/web/en/us/things-to-do/events/holidays-at-universal",
      },
      {
        name: "Universal Orlando press release, August 6, 2026",
        url: "https://media.universalparksusa.com/press-releases/universal-orlando-resort-holidays-2026-080626/",
      },
    ],
    span: "daily",
    datesConfirmed: true,
    startDate: "2026-11-14",
    endDate: "2027-01-03",
    detail: true,
    venueName: "Universal Orlando Resort",
    locality: "Orlando",
    organizer: "Universal Orlando Resort",
    tourQuery: "universal orlando park to park|universal orlando 1 park",
    tourPrefer: "park to park",
    bookHref: "/book-now/theme-parks",
    bookLabel: "Universal tickets on Viator",
    weight: 3,
    seoTitle: "Holidays at Universal Orlando 2026",
    seoDescription:
      "Holidays at Universal Orlando run November 14, 2026 to January 3, 2027, with Grinchmas and the Macy's parade included with park admission.",
    tip: "The optional Holiday Tour, with reserved parade viewing and Grinch meets, is $69.99 plus tax on select dates through January 2.",
    related: { href: "/blog/citywalk-hours", label: "Universal CityWalk hours" },
    guide: `
Universal's holiday season runs **November 14, 2026 through January 3, 2027**. The celebration is **included with theme park admission**. Blockout dates can apply to annual passes, which Universal notes on the event page.

What is on the schedule, from Universal's August 6, 2026 announcement:

- **Grinchmas** in Seuss Landing at Islands of Adventure, including the Grinchmas Who-liday Spectacular.
- **Universal's Holiday Parade featuring Macy's** at Universal Studios Florida, which Universal describes as a nightly parade.
- **Christmas in the Wizarding World of Harry Potter** at Hogsmeade, Diagon Alley and the Ministry of Magic at Epic Universe, including "The Magic of Christmas at Hogwarts Castle" projection show in Hogsmeade.
- **First-time holiday décor at Epic Universe** in Super Nintendo World, How to Train Your Dragon – Isle of Berk, and Celestial Park.

The **Universal Holiday Tour** is a separate daytime add-on on select dates from November 14, 2026 through January 2, 2027, from **$69.99 plus tax**. It includes Grinch and Max meets, reserved seating for the stage show and an optional reserved parade view. Park admission is not included in that price. Passholders save $10.

Universal also said the parks and **CityWalk** will celebrate **New Year's Eve on December 31**. Show times were not posted in the announcement.
`,
    faqs: [
      {
        q: "When do the holidays start at Universal Orlando in 2026?",
        a: "November 14, 2026 through January 3, 2027. Grinchmas, the holiday parade and Wizarding World Christmas overlays are included with park admission.",
      },
      {
        q: "Do I need a separate ticket for Grinchmas?",
        a: "No. Grinchmas and the Macy's holiday parade are included with a Universal park ticket. The guided Holiday Tour is optional and starts at $69.99 plus tax.",
      },
      {
        q: "Is Epic Universe decorated for Christmas in 2026?",
        a: "Yes. Universal said this is the first holiday season with décor in Super Nintendo World and Isle of Berk, plus a returning winter overlay in Celestial Park.",
      },
    ],
  },
  {
    slug: "gaylord-palms-ice",
    name: "ICE! at Gaylord Palms",
    months: [11, 12, 1],
    timing: "November 13, 2026–January 3, 2027",
    where: "Gaylord Palms Resort",
    area: "Kissimmee",
    category: "Holiday",
    tags: ["family", "kids", "holiday"],
    description:
      "A walk-through of The Polar Express carved in ice, kept at 9°F, with ice slides. Tickets are timed and sold online only. Parkas are provided. Christmas at the resort runs the same dates.",
    price: "Timed tickets; ages 3 and under free. Prices vary by slot",
    audience: "Families with kids who can handle the cold",
    officialUrl: "https://tickets.gaylordpalms.com/eventperformances.asp?evt=162",
    officialLabel: "Gaylord Palms ICE! tickets",
    sources: [
      {
        name: "Gaylord Palms — ICE! tickets",
        url: "https://tickets.gaylordpalms.com/eventperformances.asp?evt=162",
      },
      {
        name: "ClickOrlando — resort announcement, July 23, 2026",
        url: "https://www.clickorlando.com/theme-parks/2026/07/23/polar-express-rolls-back-into-gaylord-palms-for-ice-return/",
      },
    ],
    span: "daily",
    datesConfirmed: true,
    startDate: "2026-11-13",
    endDate: "2027-01-03",
    detail: true,
    venueName: "Gaylord Palms Resort",
    locality: "Kissimmee",
    streetAddress: "6000 West Osceola Parkway",
    organizer: "Gaylord Palms",
    tourQuery: "snow, ice & lights|holiday celebrations orlando",
    bookHref: "/book-now/family-friendly",
    bookLabel: "Family tickets on Viator",
    weight: 5,
    seoTitle: "ICE! at Gaylord Palms 2026",
    seoDescription:
      "ICE! featuring The Polar Express at Gaylord Palms in Kissimmee runs November 13, 2026 to January 3, 2027. Tickets are timed and sold online.",
    tip: "Arrive for your exact entry time. Gaylord says late admission is not allowed, and day-guest tickets are nonrefundable.",
    confidenceNote:
      "The season dates were announced by the resort. The public ticket calendar lists performances through January 3, 2027. Slot prices change, so use the ticket page for the night you want.",
    guide: `
**ICE! featuring The Polar Express** is the headliner of Christmas at Gaylord Palms. The resort announced the season as **November 13, 2026 through January 3, 2027**. The ticket page lists the attraction at **6000 West Osceola Parkway, Kissimmee**, and says the exhibit is built from thousands of blocks of ice and kept at **9 degrees**. Parkas are provided. Warm clothes are still a good idea.

Tickets are **timed**, sold **online only**, and **nonrefundable**. Children **3 and under are free**. Guests under 18 need a paid adult with them. Gaylord tells guests to arrive at the scheduled time; early and late entry are not offered. Parking and tax are extra. The resort has posted self-parking around $38 in recent seasons; confirm the current rate when you book.

We are not publishing a single dollar price because the ticket page prices each date and time separately. Use the official calendar for your slot.

The resort also runs other paid activities (ice tubing and a cirque-style show among them) and atrium light shows. Those are separate tickets. This page is about ICE! itself.
`,
    faqs: [
      {
        q: "When is ICE! at Gaylord Palms in 2026?",
        a: "November 13, 2026 through January 3, 2027, at Gaylord Palms in Kissimmee. Tickets are for a specific date and entry time.",
      },
      {
        q: "How cold is ICE! and what should kids wear?",
        a: "Gaylord keeps the exhibit at 9°F and provides parkas. Hats and closed shoes help. Children 3 and under are free, and anyone under 18 must be with a paid adult.",
      },
      {
        q: "Can I buy ICE! tickets at the door?",
        a: "No. Gaylord sells them online only and says there is no on-site box office for this attraction. Day-guest tickets are nonrefundable.",
      },
    ],
  },
  {
    slug: "seaworld-christmas-celebration",
    name: "SeaWorld Christmas Celebration",
    months: [11, 12, 1],
    timing: "Select dates November 6, 2026–January 4, 2027",
    where: "SeaWorld Orlando",
    area: "International Drive",
    category: "Holiday",
    tags: ["family", "kids", "holiday", "theme-park"],
    description:
      "Lights, holiday shows and a fireworks finale included with SeaWorld admission. SeaWorld also lists New Year's Eve on December 31. Not every day in the range is an event day.",
    price: "Included with SeaWorld admission",
    audience: "Families, including young children",
    officialUrl: "https://seaworld.com/orlando/events/christmas-celebration/",
    officialLabel: "SeaWorld Christmas Celebration",
    sources: [
      {
        name: "SeaWorld Orlando — Christmas Celebration",
        url: "https://seaworld.com/orlando/events/christmas-celebration/",
      },
      {
        name: "SeaWorld Orlando events calendar",
        url: "https://seaworld.com/orlando/events/",
      },
    ],
    span: "season",
    datesConfirmed: true,
    startDate: "2026-11-06",
    endDate: "2027-01-04",
    detail: true,
    venueName: "SeaWorld Orlando",
    locality: "Orlando",
    organizer: "SeaWorld Orlando",
    tourQuery: "seaworld",
    bookHref: "/book-now/theme-parks",
    bookLabel: "Theme park tickets on Viator",
    weight: 6,
    seoTitle: "SeaWorld Orlando Christmas Celebration 2026",
    seoDescription:
      "SeaWorld Orlando's Christmas Celebration runs select dates from November 6, 2026 to January 4, 2027, and is included with park admission.",
    tip: "Check SeaWorld's park hours before you go. The park says the schedule varies and the fireworks are at the end of the night.",
    guide: `
SeaWorld Orlando's Christmas Celebration runs on **select dates from November 6, 2026 through January 4, 2027**, and is **included with theme park admission**. SeaWorld describes lights, shows, holiday food and a fireworks finale. It is not a separately ticketed party like Mickey's Very Merry Christmas Party.

SeaWorld's event page also lists:

- **New Year's Eve** on December 31, 2026, with fireworks.
- **Hanukkah, Kwanzaa and Three Kings** observances during the season. Secondary write-ups disagree on the exact nights, so use SeaWorld's calendar rather than a reprinted date list.
- **Winter Wonderland on Ice** on select dates. SeaWorld's FAQ points guests to the show schedule.

Because the park says "select dates," this calendar does not mark every day between November 6 and January 4 as an event day. Open the park's hours page for the day you are visiting.
`,
    faqs: [
      {
        q: "Is SeaWorld's Christmas Celebration included with admission?",
        a: "Yes. SeaWorld says the Christmas Celebration is included with theme park admission and runs on select dates from November 6, 2026 through January 4, 2027.",
      },
      {
        q: "Does SeaWorld Orlando do New Year's Eve?",
        a: "Yes. SeaWorld lists a New Year's Eve celebration on December 31, 2026, with fireworks, on its events calendar.",
      },
      {
        q: "Is SeaWorld's Christmas Celebration every day?",
        a: "No. SeaWorld says select dates, and the daily schedule changes. Check the park hours page for the day you plan to go.",
      },
    ],
  },
  {
    slug: "epcot-festival-of-the-holidays",
    name: "EPCOT International Festival of the Holidays",
    months: [11, 12],
    timing: "November 27–December 30, 2026",
    where: "EPCOT",
    area: "Walt Disney World",
    category: "Holiday",
    tags: ["family", "holiday", "festival", "theme-park"],
    description:
      "Holiday kitchens, storytellers and the Candlelight Processional, included with EPCOT admission. The festival starts the day after Thanksgiving and ends December 30, before New Year's Eve.",
    price: "Included with EPCOT admission; food and dining packages extra",
    audience: "Families and adults who like food festivals",
    officialUrl: "https://disneyworld.disney.go.com/events-tours/epcot/holiday-festival-entertainment/",
    officialLabel: "Disney's festival entertainment page",
    sources: [
      {
        name: "Walt Disney World — Festival of the Holidays entertainment",
        url: "https://disneyworld.disney.go.com/events-tours/epcot/holiday-festival-entertainment/",
      },
      {
        name: "Disney Parks Blog — 2026 festival dates",
        url: "https://disneyparksblog.com/wdw/epcot-festival-of-the-holidays-dates-details/",
      },
    ],
    span: "daily",
    datesConfirmed: true,
    startDate: "2026-11-27",
    endDate: "2026-12-30",
    detail: true,
    venueName: "EPCOT",
    locality: "Bay Lake",
    organizer: "Walt Disney World",
    tourQuery: "resort base ticket|park hopper tickets",
    tourPrefer: "resort base",
    bookHref: "/book-now/theme-parks",
    bookLabel: "Disney tickets on Viator",
    weight: 7,
    seoTitle: "EPCOT Festival of the Holidays 2026",
    seoDescription:
      "The EPCOT International Festival of the Holidays runs November 27 to December 30, 2026, with the Candlelight Processional nightly. Park admission is required.",
    tip: "Candlelight Processional standby seating is included with admission, but it fills up. Dining packages are the guaranteed seat.",
    guide: `
The **EPCOT International Festival of the Holidays**, presented by AdventHealth, runs **November 27 through December 30, 2026**. Disney's parks blog notes that it starts the day after Thanksgiving. It is **included with EPCOT admission**. Food and drinks at the holiday kitchens are extra.

The **Candlelight Processional** is held **nightly** at America Gardens Theatre at **4:45 p.m., 6:30 p.m. and 8 p.m.** A celebrity narrator, choir and orchestra tell the Christmas story. Narrators change every night or two, and Disney says the lineup can change without notice. The current names are on Disney's entertainment page.

Standby seats are included with admission. They are not guaranteed. Candlelight dining packages, booked by calling Disney dining, are how guests reserve a seat. Park admission is still required and is not part of the dining package.

The festival ends **December 30**. It does not run on New Year's Eve.
`,
    faqs: [
      {
        q: "When is the EPCOT Festival of the Holidays in 2026?",
        a: "November 27 through December 30, 2026. It is included with EPCOT admission. Food, drinks and Candlelight dining packages cost extra.",
      },
      {
        q: "What time is the Candlelight Processional?",
        a: "Disney lists three shows a night at America Gardens Theatre: 4:45 p.m., 6:30 p.m. and 8 p.m., from November 27 through December 30, 2026.",
      },
      {
        q: "Does the Festival of the Holidays include New Year's Eve?",
        a: "No. Disney's dates end December 30, 2026. New Year's Eve entertainment is a separate schedule, and Disney had not posted December 31 details when we updated this page.",
      },
    ],
  },
  {
    slug: "dazzling-nights",
    name: "Dazzling Nights at Leu Gardens",
    months: [11, 12, 1],
    timing: "Select nights November 20, 2026–January 3, 2027",
    where: "Harry P. Leu Gardens",
    area: "Orlando — Mills 50 / Lake Ivanhoe",
    category: "Holiday",
    tags: ["family", "kids", "holiday"],
    description:
      "A ticketed nighttime walk through illuminated gardens, with live music and a new dance show. Separate from daytime garden admission. Tickets are online only, for a specific entry time.",
    price: "Adult general admission about $35–$56, fees included",
    audience: "Families and anyone who wants a nighttime light walk",
    officialUrl: "https://www.dazzlingorlando.com/",
    officialLabel: "Dazzling Nights official site",
    sources: [
      { name: "Dazzling Nights", url: "https://www.dazzlingorlando.com/" },
      { name: "Dazzling Nights tickets", url: "https://www.dazzlingorlando.com/tickets" },
      {
        name: "Harry P. Leu Gardens — Holidays",
        url: "https://www.leugardens.org/Events/Calendar-of-Events/Holidays-at-Leu-Gardens",
      },
    ],
    span: "season",
    datesConfirmed: true,
    startDate: "2026-11-20",
    endDate: "2027-01-03",
    detail: true,
    venueName: "Harry P. Leu Gardens",
    locality: "Orlando",
    streetAddress: "1920 North Forest Avenue",
    organizer: "Dazzling Nights at Harry P. Leu Gardens",
    offer: { low: "35", high: "56" },
    bookHref: "/book-now/sightseeing",
    bookLabel: "Sightseeing tours on Viator",
    weight: 8,
    seoTitle: "Dazzling Nights Orlando 2026 at Leu Gardens",
    seoDescription:
      "Dazzling Nights at Harry P. Leu Gardens runs select nights November 20, 2026 to January 3, 2027. Adult tickets start at $35, fees included.",
    tip: "Opens Friday, November 20. Entry is timed, there is no box office, and children 3 and under are free.",
    confidenceNote:
      "The official site says select nights, not every night. Pick a date on the ticket page rather than assuming a given evening is open.",
    guide: `
**Dazzling Nights** returns to Harry P. Leu Gardens for a seventh season, **November 20, 2026 through January 3, 2027**, on **select nights**. It is a timed-entry light walk with live music, a new dance show and food for sale. It is **not** included with daytime garden admission.

The ticket page lists **adult general admission starting at $35**, with prices by entry window:

- Value nights run about **$35 to $44** for adults, depending on how early you enter.
- Popular nights are higher.
- Peak nights list **$56** for the early window.

Those figures **include fees** and can change. Children ages 4 to 12 are a few dollars less. **Ages 3 and under are free.** Tickets are online only. Entry starts at **5:30 p.m.** in 15-minute slots, and the site says entry closes five minutes after your slot.

The gardens are at **1920 N Forest Avenue, Orlando**. Dazzling Nights directs cars to off-site parking at the AdventHealth Innovation Tower garage, 266 E Rollins Street, and says parking gates close at 8:45 p.m.

Leu Gardens' own holiday page lists the same adult range, **$35 to $56**, and **$33 to $53** for children, fees included.
`,
    faqs: [
      {
        q: "When is Dazzling Nights in Orlando in 2026?",
        a: "Select nights from November 20, 2026 through January 3, 2027, at Harry P. Leu Gardens. The first night is Friday, November 20. Check the ticket page for which nights are open.",
      },
      {
        q: "How much is Dazzling Nights?",
        a: "Adult general admission starts at $35, fees included, and the ticket page lists peak early-entry tickets at $56. Children 3 and under are free. Daytime garden admission is a separate ticket.",
      },
      {
        q: "Where do I park for Dazzling Nights?",
        a: "The event site lists off-site parking at AdventHealth Imaging Center Innovation Tower, 266 E Rollins Street, and says parking gates close at 8:45 p.m.",
      },
    ],
  },
  {
    slug: "leu-gardens-holidays",
    name: "Holidays at Leu Gardens",
    months: [11, 12, 1],
    timing: "November 20, 2026–January 3, 2027, daytime",
    where: "Harry P. Leu Gardens",
    area: "Orlando — Mills 50 / Lake Ivanhoe",
    category: "Holiday",
    tags: ["family", "kids", "holiday"],
    description:
      "Daytime poinsettias and holiday displays on the garden's regular ticket. Closed Thanksgiving and Christmas Day. Dazzling Nights in the evening is a separate ticket.",
    price: "$15 adults, $10 children. Free on December 7",
    audience: "Families and garden visitors",
    officialUrl: "https://www.leugardens.org/Events/Calendar-of-Events/Holidays-at-Leu-Gardens",
    officialLabel: "Leu Gardens holiday page",
    sources: [
      {
        name: "Harry P. Leu Gardens — Holidays",
        url: "https://www.leugardens.org/Events/Calendar-of-Events/Holidays-at-Leu-Gardens",
      },
      {
        name: "Harry P. Leu Gardens — admission and hours",
        url: "https://www.leugardens.org/Visit/Admission-Hours",
      },
    ],
    span: "daily",
    datesConfirmed: true,
    startDate: "2026-11-20",
    endDate: "2027-01-03",
    closedDates: ["2026-11-26", "2026-12-25"],
    detail: true,
    venueName: "Harry P. Leu Gardens",
    locality: "Orlando",
    streetAddress: "1920 North Forest Avenue",
    organizer: "Harry P. Leu Gardens",
    offer: { low: "10", high: "15" },
    weight: 20,
    seoTitle: "Holidays at Leu Gardens 2026",
    seoDescription:
      "Daytime holiday displays at Harry P. Leu Gardens run November 20, 2026 to January 3, 2027. Admission is $15 for adults and $10 for children.",
    tip: "From November 18 through January 3 the gardens close at 4 p.m. December 7 is a free day.",
    guide: `
**Holidays at Leu Gardens** is the daytime display: poinsettias, holiday vignettes and a Yeti hunt on the 50-acre garden. Leu Gardens lists it from **November 20, 2026 through January 3, 2027**.

**Daytime admission is $15 for adults and $10 for children.** The admission page also lists **December 7, 2026 as a free day**. The garden is **closed Thanksgiving Day and Christmas Day**. From November 18, 2026 through January 3, 2027, hours are **9 a.m. to 4 p.m.**, with last entry at 3 p.m.

A holiday craft day is listed for **Saturday, December 5, 10 a.m. to 1 p.m.**, included with admission.

**Dazzling Nights** uses the same garden after dark and needs its own ticket. The historic Leu House Museum is temporarily closed.
`,
    faqs: [
      {
        q: "How much is Leu Gardens during the holidays?",
        a: "Leu Gardens lists daytime admission at $15 for adults and $10 for children. December 7, 2026 is a posted free day. Dazzling Nights is a separate evening ticket.",
      },
      {
        q: "Is Leu Gardens open on Christmas?",
        a: "No. The garden's hours page says it is closed Thanksgiving Day and Christmas Day.",
      },
    ],
  },
  {
    slug: "orlando-tree-lighting",
    name: "City of Orlando Tree Lighting",
    months: [12, 1],
    timing: "Lighting December 4, 2026, 5:30–9:30 p.m. Shows nightly through January 6",
    where: "Lake Eola Park",
    area: "Downtown Orlando",
    category: "Holiday",
    tags: ["family", "kids", "free", "holiday"],
    description:
      "The city's tree lighting at Lake Eola, with music, a vendor market and snowfall. After opening night, the tree show runs nightly at 5:45, 6:45, 7:45, 8:45 and 9:45 p.m. through January 6.",
    price: "Free",
    audience: "Families and anyone downtown",
    officialUrl: "https://www.orlando.gov/Events/2026-Tree-Lighting-Celebration",
    officialLabel: "City of Orlando event page",
    sources: [
      {
        name: "City of Orlando — 2026 Tree Lighting",
        url: "https://www.orlando.gov/Events/2026-Tree-Lighting-Celebration",
      },
      {
        name: "Downtown Orlando — Downtown for the Holidays",
        url: "https://www.downtownorlando.com/Fun/Things-to-Do/Downtown-for-the-Holidays",
      },
    ],
    span: "daily",
    datesConfirmed: true,
    startDate: "2026-12-04",
    endDate: "2027-01-06",
    detail: true,
    venueName: "Lake Eola Park",
    locality: "Orlando",
    streetAddress: "195 North Rosalind Avenue",
    organizer: "City of Orlando",
    offer: { low: "0" },
    weight: 9,
    seoTitle: "Orlando Christmas Tree Lighting 2026",
    seoDescription:
      "Orlando lights the Lake Eola Christmas tree on December 4, 2026, from 5:30 to 9:30 p.m. The tree show then runs nightly through January 6. Free.",
    tip: "The lighting party is one night. The light-and-music show continues every evening through January 6.",
    guide: `
The City of Orlando's **2026 Tree Lighting Celebration** is **Friday, December 4, 5:30 to 9:30 p.m.**, at Lake Eola Park's Washington Plaza, **195 North Rosalind Avenue**. The city lists music at the amphitheater from 5:30 p.m., a main-stage show at 7 p.m., food trucks, a Merry Market with local vendors, photos with Santa and snowfall. The city page does not list a ticket.

Downtown Orlando's holiday guide says the six-story tree then runs a synchronized show **every night from December 4 through January 6** at **5:45, 6:45, 7:45, 8:45 and 9:45 p.m.** The tree is at East Washington Street and North Rosalind Avenue.

This is separate from the Sunday farmers market on the other side of the lake.
`,
    faqs: [
      {
        q: "When is the Orlando Christmas tree lighting in 2026?",
        a: "Friday, December 4, 2026, 5:30 to 9:30 p.m. at Lake Eola Park. The city does not list a ticket price.",
      },
      {
        q: "Can I see the Lake Eola tree after opening night?",
        a: "Yes. Downtown Orlando lists the light-and-music show nightly from December 4 through January 6 at 5:45, 6:45, 7:45, 8:45 and 9:45 p.m.",
      },
    ],
  },
  {
    slug: "frontyard-holiday-festival",
    name: "Frontyard Holiday Festival",
    months: [11, 12],
    timing: "November 27–December 31, 2026",
    where: "Dr. Phillips Center",
    area: "Downtown Orlando",
    category: "Holiday",
    tags: ["family", "kids", "free", "holiday"],
    description:
      "A free outdoor holiday setup at Dr. Phillips Center with snowfall, lights, a market and Santa's Story Nook, announced by Visit Orlando for November 27 through December 31.",
    price: "Free",
    audience: "Families",
    officialUrl: VISIT_ORLANDO.url,
    officialLabel: "Visit Orlando announcement",
    sources: [VISIT_ORLANDO],
    span: "season",
    datesConfirmed: true,
    startDate: "2026-11-27",
    endDate: "2026-12-31",
    detail: true,
    venueName: "Dr. Phillips Center for the Performing Arts",
    locality: "Orlando",
    streetAddress: "445 South Magnolia Avenue",
    organizer: "Dr. Phillips Center for the Performing Arts",
    offer: { low: "0" },
    weight: 12,
    confidenceNote:
      "Dates and the free admission come from Visit Orlando's holiday announcement. Confirm the nightly schedule on the Dr. Phillips Center calendar before you go.",
    seoTitle: "Frontyard Holiday Festival at Dr. Phillips Center",
    seoDescription:
      "Visit Orlando lists the free Frontyard Holiday Festival at Dr. Phillips Center for November 27 through December 31, 2026, with snowfall and a holiday market.",
    guide: `
Visit Orlando's holiday announcement describes the **Frontyard Holiday Festival**, supported by AdventHealth, as a **free** setup outside **Dr. Phillips Center** from **November 27 through December 31, 2026**. The release mentions nightly snowfall, light displays, live entertainment, holiday movies, treats, Santa's Story Nook, a market and a transportable carillon.

We did not find a separate event page on the center's site while checking on November 15, 2026, so treat the nightly times as something to confirm at [drphillipscenter.org](https://www.drphillipscenter.org/) closer to Thanksgiving.

The center's indoor holiday show with published dates is **Orlando Ballet's Nutcracker**, December 4–27, which is ticketed.
`,
    faqs: [
      {
        q: "Is the Frontyard Holiday Festival free?",
        a: "Visit Orlando describes it as a free holiday event at Dr. Phillips Center from November 27 through December 31, 2026. Confirm details with the center.",
      },
      {
        q: "Where is the Frontyard Holiday Festival?",
        a: "At the Dr. Phillips Center for the Performing Arts, 445 South Magnolia Avenue, downtown Orlando.",
      },
    ],
  },
  {
    slug: "orlando-ballet-nutcracker",
    name: "Orlando Ballet's The Nutcracker",
    months: [12],
    timing: "Select performances December 4–27, 2026",
    where: "Steinmetz Hall, Dr. Phillips Center",
    area: "Downtown Orlando",
    category: "Holiday",
    tags: ["family", "kids", "holiday"],
    description:
      "Orlando Ballet's Nutcracker in Steinmetz Hall, with matinees and evening shows across December. Some performances are marked as relaxed, family-friendly shows.",
    price: "Ticketed; see Orlando Ballet for current prices",
    audience: "Families and dance audiences",
    officialUrl: "https://orlandoballet.org/performances-events/the-nutcracker/",
    officialLabel: "Orlando Ballet",
    sources: [
      {
        name: "Orlando Ballet — The Nutcracker",
        url: "https://orlandoballet.org/performances-events/the-nutcracker/",
      },
    ],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-12-04",
    endDate: "2026-12-27",
    dates: [
      "2026-12-04",
      "2026-12-05",
      "2026-12-06",
      "2026-12-11",
      "2026-12-12",
      "2026-12-13",
      "2026-12-18",
      "2026-12-19",
      "2026-12-20",
      "2026-12-22",
      "2026-12-23",
      "2026-12-24",
      "2026-12-26",
      "2026-12-27",
    ],
    detail: true,
    venueName: "Steinmetz Hall at Dr. Phillips Center",
    locality: "Orlando",
    streetAddress: "445 South Magnolia Avenue",
    organizer: "Orlando Ballet",
    bookHref: "/book-now/sightseeing",
    bookLabel: "Downtown tours on Viator",
    weight: 14,
    seoTitle: "Orlando Ballet Nutcracker 2026",
    seoDescription:
      "Orlando Ballet's Nutcracker plays Steinmetz Hall at Dr. Phillips Center on select dates from December 4 to 27, 2026. Runtime is 1 hour 57 minutes.",
    tip: "There is a 1 p.m. show on Christmas Eve and no performance on Christmas Day.",
    guide: `
Orlando Ballet lists **The Nutcracker** for **December 4–27, 2026** in **Steinmetz Hall** at Dr. Phillips Center, 445 S Magnolia Avenue. Runtime is **1 hour 57 minutes** with one 20-minute intermission. Choreography is by Jorden Morris, to Tchaikovsky.

Showtimes on the company site:

- December 4 and 5 at 7 p.m., December 6 at 2 p.m.
- December 11 at 7 p.m., December 12 at 2 and 7 p.m., December 13 at 2 p.m.
- December 18 at 7 p.m., December 19 at 2 and 7 p.m., December 20 at 2 and 7 p.m.
- December 22 and 23 at 2 and 7 p.m., December 24 at 1 p.m.
- December 26 at 2 and 7 p.m., December 27 at 2 p.m.

Orlando Ballet did not publish a price range on the performance page we checked. Buy from the company so you see the live price. Several afternoon shows are listed as relaxed performances with pre-show activities for children.
`,
    faqs: [
      {
        q: "When is The Nutcracker in Orlando in 2026?",
        a: "Orlando Ballet performs it at Dr. Phillips Center on select dates from December 4 through December 27, 2026. There is a 1 p.m. show on December 24 and no show on December 25.",
      },
      {
        q: "How long is Orlando Ballet's Nutcracker?",
        a: "The company lists a runtime of 1 hour and 57 minutes, plus one 20-minute intermission.",
      },
    ],
  },
  {
    slug: "florida-classic",
    name: "Florida Blue Florida Classic",
    months: [11],
    timing: "Saturday, November 21, 2026, 3:30 p.m. ET",
    where: "Camping World Stadium",
    area: "Downtown Orlando",
    category: "Sports",
    tags: ["sports", "nightlife"],
    description:
      "Florida A&M vs. Bethune-Cookman at Camping World Stadium. The stadium is in a renovation, so capacity is reduced and suites are unavailable for this game.",
    price: "Ticketed; see Florida Classic for the current price",
    audience: "Football fans, alumni and groups",
    officialUrl: "https://floridacitrussports.com/blog/fcs-announces-2026-27-college-football-schedule-at-camping-world-stadium/",
    officialLabel: "Florida Citrus Sports",
    sources: [
      {
        name: "Florida Citrus Sports — 2026-27 stadium schedule",
        url: "https://floridacitrussports.com/blog/fcs-announces-2026-27-college-football-schedule-at-camping-world-stadium/",
      },
      {
        name: "Florida Classic",
        url: "https://floridaclassic.org/search/2026/",
      },
    ],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-11-21",
    endDate: "2026-11-21",
    dates: ["2026-11-21"],
    detail: true,
    venueName: "Camping World Stadium",
    locality: "Orlando",
    organizer: "Florida Classic Consortium and Florida Citrus Sports",
    tourQuery: "orlando magic",
    tourPrefer: "orlando magic",
    bookHref: "/book-now/sports",
    bookLabel: "Sports experiences on Viator",
    weight: 4,
    seoTitle: "Florida Classic 2026 at Camping World Stadium",
    seoDescription:
      "The Florida Blue Florida Classic, Florida A&M vs. Bethune-Cookman, is Saturday, November 21, 2026, at 3:30 p.m. at Camping World Stadium.",
    tip: "This is the biggest downtown crowd of the week. Plan extra time for parking and the renovation detours.",
    guide: `
The **2026 Florida Blue Florida Classic** is **Saturday, November 21, at 3:30 p.m. ET** at **Camping World Stadium**. It is the Florida A&M vs. Bethune-Cookman game. Florida Citrus Sports confirmed the date on June 3, 2026, along with the Pop-Tarts Bowl and the Citrus Bowl.

The stadium is in the middle of a **$400 million renovation** scheduled to finish in 2027. Florida Citrus Sports says all three games this season play at **reduced capacity**. The Florida Classic site adds that the **suite level is unavailable** on November 21, while club and field seating remain.

We did not find a published single-game price on those pages. The June announcement said public single-game tickets would go on sale later in the summer. Check [floridaclassic.org](https://floridaclassic.org/) for what is on sale now.

Kickoff is the day before the Lake Eola farmers market and the same day as Jollywood Nights, so downtown and Hollywood Studios are both busy.
`,
    faqs: [
      {
        q: "When is the Florida Classic in 2026?",
        a: "Saturday, November 21, 2026, at 3:30 p.m. ET at Camping World Stadium in Orlando. Florida A&M plays Bethune-Cookman.",
      },
      {
        q: "Is Camping World Stadium open during construction?",
        a: "Yes, at reduced capacity. Florida Citrus Sports says the Florida Classic, Pop-Tarts Bowl and Citrus Bowl all stay at the stadium during the renovation. Suites are not available for the Florida Classic.",
      },
    ],
  },
  {
    slug: "pop-tarts-bowl",
    name: "Pop-Tarts Bowl",
    months: [12],
    timing: "Tuesday, December 29, 2026, 5:30 p.m. ET",
    where: "Camping World Stadium",
    area: "Downtown Orlando",
    category: "Sports",
    tags: ["sports", "nightlife"],
    description:
      "The Pop-Tarts Bowl matches an ACC team and a Big 12 team. ESPN carries it at 5:30 p.m. Public single-game tickets go on sale December 6 at noon, after teams are picked.",
    price: "Ticketed; public sale December 6, 2026",
    audience: "College football fans",
    officialUrl: "https://floridacitrussports.com/event/pop-tarts-bowl/",
    officialLabel: "Pop-Tarts Bowl",
    sources: [
      {
        name: "Florida Citrus Sports — Pop-Tarts Bowl",
        url: "https://floridacitrussports.com/event/pop-tarts-bowl/",
      },
      {
        name: "Citrus Bowl — January 2 kickoff announcement",
        url: "https://www.citrusbowlorlando.com/citrus-bowl-set-for-saturday-jan-2-at-noon-et-on-abc/",
      },
    ],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-12-29",
    endDate: "2026-12-29",
    dates: ["2026-12-29"],
    detail: true,
    venueName: "Camping World Stadium",
    locality: "Orlando",
    organizer: "Florida Citrus Sports",
    bookHref: "/book-now/sports",
    bookLabel: "Sports experiences on Viator",
    weight: 15,
    seoTitle: "Pop-Tarts Bowl 2026 in Orlando",
    seoDescription:
      "The 2026 Pop-Tarts Bowl is Tuesday, December 29, at 5:30 p.m. ET at Camping World Stadium in Orlando, on ESPN.",
    tip: "Teams are selected December 6. Stadium Pass members can buy before the public on-sale.",
    guide: `
The **Pop-Tarts Bowl** is **Tuesday, December 29, 2026, at 5:30 p.m. ET** at **Camping World Stadium**, televised on ESPN. Florida Citrus Sports says it pairs the top available ACC team (Notre Dame included) outside the College Football Playoff with the second available Big 12 team outside the playoff.

**Public single-game tickets go on sale Sunday, December 6, at noon**, after the teams are known. Before that, tickets are sold through Florida Citrus Sports membership packages.

The game is at the stadium during the renovation, at reduced capacity, same as the Florida Classic and the Citrus Bowl.
`,
    faqs: [
      {
        q: "When is the Pop-Tarts Bowl in 2026?",
        a: "Tuesday, December 29, 2026, at 5:30 p.m. ET at Camping World Stadium in Orlando. It airs on ESPN.",
      },
      {
        q: "When do Pop-Tarts Bowl tickets go on sale?",
        a: "Florida Citrus Sports says public single-game tickets go on sale Sunday, December 6, 2026, at noon, after the teams are selected.",
      },
    ],
  },
  {
    slug: "citrus-bowl",
    name: "Citrus Bowl",
    months: [1],
    timing: "Saturday, January 2, 2027, noon ET on ABC",
    where: "Camping World Stadium",
    area: "Downtown Orlando",
    category: "Sports",
    tags: ["sports"],
    description:
      "The 81st Citrus Bowl, an SEC vs. Big Ten game, at noon on ABC. It is the first Saturday Citrus Bowl since 2022. Public tickets follow the December 6 team selections.",
    price: "Ticketed; public sale after December 6, 2026",
    audience: "College football fans",
    officialUrl: "https://www.citrusbowlorlando.com/citrus-bowl-set-for-saturday-jan-2-at-noon-et-on-abc/",
    officialLabel: "Citrus Bowl",
    sources: [
      {
        name: "Citrus Bowl — January 2, 2027 announcement",
        url: "https://www.citrusbowlorlando.com/citrus-bowl-set-for-saturday-jan-2-at-noon-et-on-abc/",
      },
      {
        name: "NCAA.com — 2026-27 bowl schedule",
        url: "https://www.ncaa.com/news/football/article/2026-10-31/2026-27-college-football-bowl-game-schedule-scores-tv-channels-times",
      },
    ],
    span: "dates",
    datesConfirmed: true,
    startDate: "2027-01-02",
    endDate: "2027-01-02",
    dates: ["2027-01-02"],
    detail: true,
    venueName: "Camping World Stadium",
    locality: "Orlando",
    organizer: "Florida Citrus Sports",
    bookHref: "/book-now/sports",
    bookLabel: "Sports experiences on Viator",
    weight: 16,
    seoTitle: "Citrus Bowl 2027 in Orlando",
    seoDescription:
      "The 81st Citrus Bowl is Saturday, January 2, 2027, at noon ET at Camping World Stadium in Orlando, on ABC. It features SEC and Big Ten teams.",
    tip: "January 2 is also the weekend before Walt Disney World Marathon Weekend. Book downtown stays early if you want both.",
    guide: `
The **81st Citrus Bowl** is **Saturday, January 2, 2027, at noon ET** at **Camping World Stadium**, on ABC. Florida Citrus Sports says it is an **SEC vs. Big Ten** game and the first Saturday edition since 2022. NCAA.com lists the same kickoff.

Teams are not known until selection Sunday, **December 6, 2026**. Public single-game tickets go on sale after that. Until then, Florida Citrus Sports sells the game through Stadium Pass packages.

The stadium hosts the game at **reduced capacity** during the renovation that is scheduled to finish in 2027. The official announcement does not use a title sponsor on the 2027 game; it is billed as the Citrus Bowl.

The game sits between New Year's Eve and **Walt Disney World Marathon Weekend** (January 6–10), so the first week of January is one of the busiest stretches of the winter.
`,
    faqs: [
      {
        q: "When is the Citrus Bowl in 2027?",
        a: "Saturday, January 2, 2027, at noon ET at Camping World Stadium in Orlando. ABC carries the game.",
      },
      {
        q: "Who plays in the 2027 Citrus Bowl?",
        a: "It is an SEC vs. Big Ten game. The teams are selected on December 6, 2026. They were not known when this page was updated.",
      },
    ],
  },
  {
    slug: "new-years-eve",
    name: "New Year's Eve in Orlando",
    months: [12],
    timing: "Thursday, December 31, 2026",
    where: "SeaWorld, Universal Orlando, CityWalk and the theme parks",
    area: "Orlando and the parks",
    category: "Fireworks",
    tags: ["holiday", "nightlife", "family", "theme-park"],
    description:
      "SeaWorld lists a New Year's Eve fireworks night, and Universal says the parks and CityWalk will celebrate. Disney had not posted December 31 entertainment when we checked.",
    price: "Park tickets for the parks; CityWalk has no entry fee",
    audience: "Adults and families who do not mind crowds",
    officialUrl: "https://seaworld.com/orlando/events/",
    officialLabel: "SeaWorld events calendar",
    sources: [
      { name: "SeaWorld Orlando events calendar", url: "https://seaworld.com/orlando/events/" },
      {
        name: "Universal Orlando press release, August 6, 2026",
        url: "https://media.universalparksusa.com/press-releases/universal-orlando-resort-holidays-2026-080626/",
      },
    ],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-12-31",
    endDate: "2026-12-31",
    dates: ["2026-12-31"],
    detail: true,
    venueName: "Orlando theme parks and CityWalk",
    locality: "Orlando",
    organizer: "SeaWorld Orlando and Universal Orlando Resort",
    tourQuery: "universal orlando park to park|resort base ticket|park hopper tickets",
    tourPrefer: "park to park",
    bookHref: "/book-now/theme-parks",
    bookLabel: "Park tickets on Viator",
    weight: 11,
    seoTitle: "New Year's Eve in Orlando 2026",
    seoDescription:
      "SeaWorld Orlando lists New Year's Eve fireworks on December 31, 2026. Universal says the parks and CityWalk will celebrate. Disney's plan was not posted yet.",
    tip: "EPCOT's Festival of the Holidays ends December 30. Do not assume festival kitchens are open on the 31st.",
    confidenceNote:
      "SeaWorld and Universal have confirmed celebrations. Walt Disney World had not published December 31, 2026 hours or shows on the pages we checked.",
    guide: `
**December 31, 2026** is a Thursday. Here is what organizers had actually posted by November 15:

- **SeaWorld Orlando** lists New Year's Eve on its events calendar, with fireworks, as part of the Christmas Celebration season.
- **Universal Orlando** said guests can ring in the new year with live entertainment at the theme parks and at **Universal CityWalk**. Hours and a lineup were not in that announcement.
- **Walt Disney World** had not posted December 31 hours or a show schedule on the holiday pages we checked. The EPCOT Festival of the Holidays and Candlelight Processional **end December 30**. Jollywood Nights is **not** held on the 31st. Mickey's Very Merry Christmas Party's last night is **December 22**.

We did not find a City of Orlando fireworks listing for Lake Eola on New Year's Eve. The Lake Eola tree show runs through January 6, which is a free evening plan if you are downtown, but it is not a countdown event.

CityWalk does not charge admission. Parking rules are separate; our [CityWalk hours guide](/blog/citywalk-hours) covers the usual after-6 p.m. garage policy, which you should confirm for a holiday.
`,
    faqs: [
      {
        q: "Where can I celebrate New Year's Eve in Orlando in 2026?",
        a: "SeaWorld lists a December 31 fireworks celebration, and Universal says the theme parks and CityWalk will celebrate. Disney had not posted its December 31, 2026 plan when this page was updated.",
      },
      {
        q: "Is there a free New Year's Eve fireworks show at Lake Eola?",
        a: "We did not find a city fireworks listing for Lake Eola on December 31, 2026. The Lake Eola Christmas tree show does run nightly through January 6.",
      },
      {
        q: "Is Mickey's Very Merry Christmas Party on New Year's Eve?",
        a: "No. The last 2026 party is December 22. Jollywood Nights is not held on December 31 either.",
      },
    ],
  },
  {
    slug: "rundisney-marathon-weekend",
    name: "Walt Disney World Marathon Weekend",
    months: [1],
    timing: "January 6–10, 2027",
    where: "Walt Disney World Resort",
    area: "Walt Disney World",
    category: "Sports",
    tags: ["sports", "family"],
    description:
      "runDisney's 2027 Marathon Weekend marks 30 years of the half marathon. The 5K is January 7, the 10K January 8, the half January 9 and the marathon January 10.",
    price: "Race registration; confirm the current fee on runDisney.com",
    audience: "Runners and spectators",
    officialUrl: "https://www.rundisney.com/",
    officialLabel: "runDisney",
    sources: [
      { name: "runDisney", url: "https://www.rundisney.com/" },
      {
        name: "WDW Magazine — runDisney 2026–27 calendar",
        url: "https://www.wdw-magazine.com/rundisney/",
      },
    ],
    span: "daily",
    datesConfirmed: true,
    startDate: "2027-01-06",
    endDate: "2027-01-10",
    detail: true,
    venueName: "Walt Disney World Resort",
    locality: "Bay Lake",
    organizer: "runDisney",
    bookHref: "/book-now/sports",
    bookLabel: "Sports experiences on Viator",
    weight: 17,
    seoTitle: "Walt Disney World Marathon Weekend 2027",
    seoDescription:
      "Walt Disney World Marathon Weekend is January 6–10, 2027. The 5K is January 7, the 10K January 8, the half January 9 and the marathon January 10.",
    tip: "Races start before dawn and close roads inside the resort. Spectators should check the morning road closures.",
    confidenceNote:
      "Weekend dates and the race-by-race schedule were published by runDisney and reported consistently. Confirm registration and the live fee on runDisney.com.",
    guide: `
**2027 Walt Disney World Marathon Weekend** is **January 6–10, 2027**. runDisney is marking the **30th anniversary of the Walt Disney World Half Marathon**, with Donald Duck as the weekend mascot.

The race days, as published with the anniversary announcement:

- **5K:** Thursday, January 7
- **10K:** Friday, January 8
- **Half marathon:** Saturday, January 9
- **Marathon:** Sunday, January 10

Goofy's Race and a Half Challenge is the half plus the marathon. The Dopey Challenge is all four races.

General registration opened March 17, 2026. runDisney's fee table stepped up on September 15, 2026. One widely quoted version of that table listed the marathon at **$265 plus a platform fee** after that date. We are not repeating every race fee here because the live price is the one on **runDisney.com**, and popular races sell out.

Spectators do not need a race entry to be in the parks, but they do need valid park admission for any park the course uses, and early start times mean road closures. The Citrus Bowl is six days earlier, on January 2.
`,
    faqs: [
      {
        q: "When is Walt Disney World Marathon Weekend in 2027?",
        a: "January 6 through 10, 2027. The 5K is January 7, the 10K is January 8, the half marathon is January 9 and the marathon is January 10.",
      },
      {
        q: "Do spectators need a park ticket?",
        a: "You need valid admission for a theme park you enter. Course roads close early. Check runDisney's spectator guide before you pick a spot.",
      },
    ],
  },
  {
    slug: "epcot-festival-of-the-arts",
    name: "EPCOT International Festival of the Arts",
    months: [1, 2, 3],
    timing: "January 15–March 1, 2027",
    where: "EPCOT",
    area: "Walt Disney World",
    category: "Festival",
    tags: ["festival", "family", "theme-park"],
    description:
      "Disney's longest Festival of the Arts yet, presented by Disney Lorcana, with art, Broadway-style concerts and food studios. Included with EPCOT admission.",
    price: "Included with EPCOT admission; food and art extra",
    audience: "Adults and families who like shows and food",
    officialUrl: "https://disneyworld.disney.go.com/events-tours/epcot/epcot-international-festival-of-the-arts/",
    officialLabel: "Disney's Festival of the Arts page",
    sources: [
      {
        name: "Walt Disney World — Festival of the Arts",
        url: "https://disneyworld.disney.go.com/events-tours/epcot/epcot-international-festival-of-the-arts/",
      },
      {
        name: "Disney Parks Blog — spring events",
        url: "https://disneyparksblog.com/wdw/walt-disney-world-spring-offers-and-returning-events/",
      },
    ],
    span: "daily",
    datesConfirmed: true,
    startDate: "2027-01-15",
    endDate: "2027-03-01",
    detail: true,
    venueName: "EPCOT",
    locality: "Bay Lake",
    organizer: "Walt Disney World",
    tourQuery: "resort base ticket|park hopper tickets",
    tourPrefer: "resort base",
    bookHref: "/book-now/theme-parks",
    bookLabel: "Disney tickets on Viator",
    weight: 18,
    seoTitle: "EPCOT Festival of the Arts 2027",
    seoDescription:
      "The 2027 EPCOT International Festival of the Arts runs January 15 through March 1 and is included with EPCOT admission. Food and art cost extra.",
    tip: "It overlaps the end of Marathon Weekend's afterglow and runs through the start of spring break.",
    guide: `
Disney lists the **2027 EPCOT International Festival of the Arts**, presented by the Disney Lorcana Trading Card Game, for **January 15 through March 1, 2027**. The parks blog says the extra week makes this the longest edition. The festival is **included with valid EPCOT admission**. A park reservation may be required depending on the ticket.

Expect galleries, food studios and the **Disney on Broadway** concert series at America Gardens Theatre. Food, art and workshops are extra. Disney had not published the 2027 food booth menu on the page we checked.
`,
    faqs: [
      {
        q: "When is the EPCOT Festival of the Arts in 2027?",
        a: "January 15 through March 1, 2027. It is included with EPCOT admission.",
      },
      {
        q: "Do I need a separate ticket for Festival of the Arts?",
        a: "No. Disney says the festival is included with valid EPCOT admission. Food, drinks and artwork are extra.",
      },
    ],
  },
  {
    slug: "florida-strawberry-festival",
    name: "Florida Strawberry Festival",
    months: [3],
    timing: "March 4–14, 2027",
    where: "Florida Strawberry Festival grounds",
    area: "Plant City (about an hour from Orlando)",
    category: "Festival",
    tags: ["festival", "family", "kids"],
    description:
      "The 92nd festival, themed “A Timeless Tradition,” with concerts, livestock shows and strawberry shortcake. Advance tickets go on sale December 10, 2026.",
    price: "Gate and concert tickets on sale December 10, 2026",
    audience: "Families and concert crowds",
    officialUrl: "https://flstrawberryfestival.com/",
    officialLabel: "Florida Strawberry Festival",
    sources: [
      { name: "Florida Strawberry Festival", url: "https://flstrawberryfestival.com/" },
      {
        name: "Festival press release, November 13, 2026",
        url: "https://flstrawberryfestival.com/wp-content/uploads/2026/11/PRESS-RELEASE-Florida-Strawberry-Festival-announces-headline-entertainment-lineup-for-2027-event.pdf",
      },
    ],
    span: "daily",
    datesConfirmed: true,
    startDate: "2027-03-04",
    endDate: "2027-03-14",
    detail: true,
    venueName: "Florida Strawberry Festival",
    locality: "Plant City",
    organizer: "Florida Strawberry Festival",
    bookHref: "/book-now/day-trips",
    bookLabel: "Day trips from Orlando",
    weight: 19,
    seoTitle: "Florida Strawberry Festival 2027",
    seoDescription:
      "The 92nd Florida Strawberry Festival in Plant City is March 4–14, 2027. Advance gate and concert tickets go on sale December 10, 2026.",
    tip: "Plant City is about an hour southwest of Orlando. Concerts are a separate ticket from the gate.",
    guide: `
The **92nd Florida Strawberry Festival** is **March 4–14, 2027** in **Plant City**, about an hour from Orlando. The theme is **“A Timeless Tradition.”** The festival's November 13, 2026 release lists headline concerts on the Wish Farms Soundstage, including Styx (March 4), Shaboozey (March 6), Charlie Wilson (March 11), Becky G (March 12) and Train (March 14), plus afternoon shows.

**Advance gate and concert tickets go on sale Thursday, December 10, 2026, at 8 a.m.** at the Amscot Main Ticket Office, 2209 W Oak Avenue, Plant City, and at flstrawberryfestival.com or 813-754-1996. The release does not list gate prices. Concert tickets are separate from admission.

This is a day trip, not an Orlando city event. It overlaps the first weekend of March, when EPCOT Festival of the Arts is in its last day on March 1.
`,
    faqs: [
      {
        q: "When is the Florida Strawberry Festival in 2027?",
        a: "March 4 through March 14, 2027, in Plant City, about an hour from Orlando.",
      },
      {
        q: "When do Strawberry Festival tickets go on sale?",
        a: "The festival says advance gate and concert tickets go on sale December 10, 2026, at 8 a.m. Concerts are ticketed separately from the gate.",
      },
    ],
  },
  {
    slug: "daytona-500",
    name: "Daytona 500 and Speedweeks",
    months: [2],
    timing: "Clash February 13, Duels February 18, Daytona 500 February 21, 2027",
    where: "Daytona International Speedway",
    area: "Daytona Beach (about an hour from Orlando)",
    category: "Sports",
    tags: ["sports"],
    description:
      "NASCAR's 2027 Daytona 500 is Sunday, February 21. The Clash is February 13 and the Duels are February 18, all at Daytona International Speedway.",
    price: "Ticketed; the speedway listed the 500 price as not yet posted",
    audience: "Racing fans",
    officialUrl: "https://www.daytonainternationalspeedway.com/",
    officialLabel: "Daytona International Speedway",
    sources: [
      {
        name: "Daytona International Speedway",
        url: "https://www.daytonainternationalspeedway.com/",
      },
      {
        name: "Daytona 500 date announcement",
        url: "https://www.daytonainternationalspeedway.com/2025/10/22/daytona-international-speedway-announces-2027-daytona-500-date/",
      },
      {
        name: "NASCAR — 2027 Cup Series schedule",
        url: "https://www.nascar.com/news-media/2026/08/26/2027-nascar-schedule-confirmed-dates-tracks-for-all-three-national-series/",
      },
    ],
    span: "dates",
    datesConfirmed: true,
    startDate: "2027-02-13",
    endDate: "2027-02-21",
    dates: ["2027-02-13", "2027-02-18", "2027-02-21"],
    detail: true,
    venueName: "Daytona International Speedway",
    locality: "Daytona Beach",
    organizer: "Daytona International Speedway",
    bookHref: "/book-now/day-trips",
    bookLabel: "Day trips from Orlando",
    weight: 21,
    seoTitle: "Daytona 500 2027 Date",
    seoDescription:
      "The 2027 Daytona 500 is Sunday, February 21, in Daytona Beach. The Clash is February 13 and the Duels are February 18.",
    tip: "Daytona is a realistic day trip from Orlando, but race-day traffic is slow. Stay on the coast if you are going to more than one session.",
    guide: `
The **69th Daytona 500** is **Sunday, February 21, 2027**, at Daytona International Speedway. The speedway announced that date on October 22, 2025, specifically so travelers could plan early. The speedway homepage still shows the race as **February 21, 2027**, with the start time not posted when we checked.

NASCAR's 2027 Cup Series schedule adds the rest of Speedweeks at the same track:

- **Saturday, February 13, 2027:** the Clash
- **Thursday, February 18, 2027:** the Duel at Daytona
- **Sunday, February 21, 2027:** the Daytona 500

We are not listing a ticket price. The speedway's homepage showed the 500 without a published price. Daytona Beach is about an hour from downtown Orlando without race traffic.
`,
    faqs: [
      {
        q: "When is the Daytona 500 in 2027?",
        a: "Sunday, February 21, 2027, at Daytona International Speedway. The start time was not posted on the speedway homepage when we checked.",
      },
      {
        q: "What else is on during Speedweeks 2027?",
        a: "NASCAR's 2027 schedule lists the Clash on February 13 and the Duel at Daytona on February 18, both at Daytona International Speedway.",
      },
    ],
  },
  {
    slug: "orlando-magic",
    name: "Orlando Magic home games",
    months: [11, 12, 1, 2, 3, 4],
    timing: "2026–27 home games at Kia Center",
    where: "Kia Center",
    area: "Downtown Orlando",
    category: "Sports",
    tags: ["sports", "nightlife"],
    description:
      "The Magic's 2026–27 home schedule at Kia Center. The next home game is Wednesday, November 18, against the 76ers. Tip-off times are on the team schedule.",
    price: "Ticketed; prices vary by opponent",
    audience: "Basketball fans and downtown night-out groups",
    officialUrl: "https://www.nba.com/magic/schedule",
    officialLabel: "Orlando Magic schedule",
    sources: [{ name: "Orlando Magic schedule", url: "https://www.nba.com/magic/schedule" }],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-11-18",
    endDate: "2027-03-30",
    dates: MAGIC_HOME,
    detail: true,
    venueName: "Kia Center",
    locality: "Orlando",
    organizer: "Orlando Magic",
    tourQuery: "orlando magic",
    bookHref: "/book-now/sports",
    bookLabel: "Magic tickets on Viator",
    weight: 13,
    seoTitle: "Orlando Magic Home Games 2026–27",
    seoDescription:
      "Orlando Magic home games at Kia Center this season start November 18, 2026 against the 76ers. Tip-off times are on the team schedule.",
    tip: "We list home dates only, not tip-off times. The team site is the source for time and TV.",
    confidenceNote:
      "Home dates below are the ones shown on the Magic schedule through March 30, 2027. Later games and any changes belong on nba.com/magic/schedule.",
    guide: `
The **Orlando Magic** play home games at **Kia Center** downtown. On the schedule posted for 2026–27, the next home game is **Wednesday, November 18, against the Philadelphia 76ers**. November 16 is an away game at Boston, so there is no home game tonight.

Home dates we recorded from that schedule, through March 30, 2027:

- **November:** 18 (76ers), 24 (Pistons)
- **December:** 14 (76ers), 16 (Cavaliers), 21 (Kings), 23 (Hornets), 26 (Raptors), 27 (Bucks)
- **January:** 3 (Grizzlies), 5 (Clippers), 7 (Cavaliers), 10 (Thunder), 19 (Warriors), 22 (Trail Blazers), 24 (Rockets), 28 (Bulls), 31 (Nets)
- **February:** 2 (Pelicans), 12 (Heat), 13 (Spurs), 17 (Mavericks), 25 (Hornets), 28 (Hawks)
- **March:** 2 (Lakers), 4 (Pacers), 5 (Jazz), 9 (Suns), 20 (Nuggets), 22 (Pacers), 28 (Knicks), 30 (Knicks)

Tip-off times move with national TV. We are not printing them. Kia Center is a short walk from Church Street restaurants. The season continues after March 30; use the team schedule for April.
`,
    faqs: [
      {
        q: "When is the next Orlando Magic home game?",
        a: "Wednesday, November 18, 2026, against the Philadelphia 76ers at Kia Center. Check the Magic schedule for tip-off time.",
      },
      {
        q: "Where do the Orlando Magic play?",
        a: "Kia Center in downtown Orlando. The arena was formerly the Amway Center.",
      },
    ],
  },
  {
    slug: "idrive-tree-lighting",
    name: "I-Drive Holiday Tree at ICON Park",
    months: [11, 12, 1],
    timing: "November 20, 2026–January 4, 2027, nightly at 6 p.m.",
    where: "ICON Park",
    area: "International Drive",
    category: "Holiday",
    tags: ["family", "kids", "holiday"],
    description:
      "Visit Orlando lists a 50-foot holiday tree lighting at ICON Park, with a nightly ceremony at 6 p.m. from November 20 through January 4.",
    price: "No ticket listed for the lighting",
    audience: "Families on International Drive",
    officialUrl: VISIT_ORLANDO.url,
    officialLabel: "Visit Orlando announcement",
    sources: [VISIT_ORLANDO],
    span: "daily",
    datesConfirmed: true,
    startDate: "2026-11-20",
    endDate: "2027-01-04",
    venueName: "ICON Park",
    locality: "Orlando",
    organizer: "I-Drive District",
    weight: 22,
    confidenceNote: "This lighting is from Visit Orlando's holiday release. Confirm the 6 p.m. ceremony with ICON Park.",
    related: { href: "/book-now/theme-parks", label: "ICON Park tickets" },
  },
  {
    slug: "jingle-eve-ivanhoe",
    name: "Jingle Eve in Ivanhoe Village",
    months: [11],
    timing: "Saturday, November 21, 2026",
    where: "Ivanhoe Village",
    area: "Orlando — Ivanhoe",
    category: "Holiday",
    tags: ["family", "kids", "free", "holiday", "nightlife"],
    description:
      "Visit Orlando lists a free neighborhood party with music, vendors, a kids' area, food trucks and fireworks to open the holidays in Ivanhoe Village.",
    price: "Free",
    audience: "Families and neighborhood crowds",
    officialUrl: VISIT_ORLANDO.url,
    officialLabel: "Visit Orlando announcement",
    sources: [VISIT_ORLANDO],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-11-21",
    endDate: "2026-11-21",
    dates: ["2026-11-21"],
    offer: { low: "0" },
    venueName: "Ivanhoe Village",
    locality: "Orlando",
    weight: 23,
    confidenceNote: "Listed by Visit Orlando. We did not find a separate village page with times while updating this guide.",
  },
  {
    slug: "crayola-colorful-christmas",
    name: "Crayola Experience Colorful Christmas",
    months: [11, 12, 1],
    timing: "November 21, 2026–January 3, 2027",
    where: "Crayola Experience",
    area: "The Florida Mall area",
    category: "Holiday",
    tags: ["family", "kids", "holiday"],
    description:
      "Holiday crafts, a scavenger hunt and character appearances included with Crayola Experience admission, as announced by Visit Orlando.",
    price: "Included with Crayola Experience admission",
    audience: "Young children",
    officialUrl: VISIT_ORLANDO.url,
    officialLabel: "Visit Orlando announcement",
    sources: [VISIT_ORLANDO],
    span: "daily",
    datesConfirmed: true,
    startDate: "2026-11-21",
    endDate: "2027-01-03",
    venueName: "Crayola Experience Orlando",
    locality: "Orlando",
    weight: 28,
    confidenceNote: "Dates come from Visit Orlando. Confirm hours and ticket price with Crayola Experience.",
  },
  {
    slug: "celebration-now-snowing",
    name: "Now Snowing in Celebration",
    months: [11, 12],
    timing: "November 28–December 31, 2026",
    where: "Celebration Town Center",
    area: "Celebration",
    category: "Holiday",
    tags: ["family", "kids", "holiday"],
    description:
      "Visit Orlando lists the 28th Now Snowing as nightly snowfall and carolers in Celebration's town center from November 28 through December 31.",
    price: "Visit Orlando did not list a ticket",
    audience: "Families",
    officialUrl: VISIT_ORLANDO.url,
    officialLabel: "Visit Orlando announcement",
    sources: [VISIT_ORLANDO],
    span: "season",
    datesConfirmed: true,
    startDate: "2026-11-28",
    endDate: "2026-12-31",
    venueName: "Celebration Town Center",
    locality: "Celebration",
    weight: 29,
    confidenceNote: "Announced by Visit Orlando. Confirm whether every night is on before you drive to Celebration.",
  },
  {
    slug: "wekiva-winter-wonderland",
    name: "Wekiva Island Winter Wonderland",
    months: [11, 12],
    timing: "November 29–December 25, 2026",
    where: "Wekiva Island",
    area: "Northwest of Orlando",
    category: "Holiday",
    tags: ["family", "holiday"],
    description:
      "Visit Orlando lists nightly snow flurries, a holiday market and Santa visits at Wekiva Island from November 29 through December 25.",
    price: "Not listed in the announcement",
    audience: "Families and evening crowds",
    officialUrl: VISIT_ORLANDO.url,
    officialLabel: "Visit Orlando announcement",
    sources: [VISIT_ORLANDO],
    span: "season",
    datesConfirmed: true,
    startDate: "2026-11-29",
    endDate: "2026-12-25",
    venueName: "Wekiva Island",
    locality: "Longwood",
    weight: 30,
    confidenceNote: "Dates are from Visit Orlando's release. Confirm the cover charge, if any, with Wekiva Island.",
  },
  {
    slug: "gatorland-holiday",
    name: "Gatorland Holiday Ho-Down",
    months: [12],
    timing: "Select dates December 5–20, 2026",
    where: "Gatorland",
    area: "South Orange Blossom Trail",
    category: "Holiday",
    tags: ["family", "kids", "holiday"],
    description:
      "Visit Orlando lists holiday décor, characters and photos with Gator Claus on select dates from December 5 through December 20.",
    price: "Included with Gatorland admission on event dates",
    audience: "Families with kids",
    officialUrl: VISIT_ORLANDO.url,
    officialLabel: "Visit Orlando announcement",
    sources: [VISIT_ORLANDO],
    span: "season",
    datesConfirmed: true,
    startDate: "2026-12-05",
    endDate: "2026-12-20",
    venueName: "Gatorland",
    locality: "Orlando",
    weight: 31,
    confidenceNote: "Visit Orlando says select dates. Confirm which days on gatorland.com.",
    bookHref: "/book-now/family-friendly",
    bookLabel: "Family tickets on Viator",
  },
  {
    slug: "lindsey-stirling",
    name: "Lindsey Stirling: Snow Waltz Tour",
    months: [11],
    timing: "Saturday, November 21, 2026",
    where: "Dr. Phillips Center",
    area: "Downtown Orlando",
    category: "Arts",
    tags: ["nightlife", "holiday"],
    description:
      "Visit Orlando lists Lindsey Stirling's Snow Waltz Tour at Dr. Phillips Center on November 21 as part of the center's holiday series.",
    price: "Ticketed",
    audience: "Concert audiences",
    officialUrl: VISIT_ORLANDO.url,
    officialLabel: "Visit Orlando announcement",
    sources: [VISIT_ORLANDO],
    span: "dates",
    datesConfirmed: true,
    startDate: "2026-11-21",
    endDate: "2026-11-21",
    dates: ["2026-11-21"],
    venueName: "Dr. Phillips Center for the Performing Arts",
    locality: "Orlando",
    weight: 24,
    confidenceNote: "Listed by Visit Orlando. Confirm the show is still scheduled at drphillipscenter.org.",
  },
  {
    slug: "universal-mardi-gras",
    name: "Universal Mardi Gras",
    months: [2, 3],
    timing: "Reported February 6–March 27, 2027. Not on Universal's public event page yet",
    where: "Universal Studios Florida",
    area: "Universal Orlando",
    category: "Festival",
    tags: ["festival", "nightlife", "theme-park", "family"],
    description:
      "Universal's parade, food booths and concerts usually return in late winter. A September 2026 report said 2027 runs February 6 through March 27 and is included with admission. Confirm before you plan a trip around it.",
    price: "Included with Universal Studios admission if it follows the usual pattern",
    audience: "Adults, teens and families who like parades",
    officialUrl: "https://www.universalorlando.com/web/en/us/things-to-do/events",
    officialLabel: "Universal events",
    sources: [
      {
        name: "Inside Universal, September 24, 2026 (not Universal's site)",
        url: "https://www.insideuniversal.net/2026/09/dates-announced-for-2027-mardi-gras-international-flavors-of-carnaval-at-universal-orlando/",
      },
    ],
    span: "season",
    datesConfirmed: false,
    startDate: "2027-02-06",
    endDate: "2027-03-27",
    weight: 40,
    confidenceNote:
      "These dates are from a fan-site report, not a page we could verify on universalorlando.com. Treat them as unconfirmed.",
    related: { href: "/book-now/theme-parks", label: "Universal tickets" },
  },
  {
    slug: "disney-princess-half-marathon",
    name: "Disney Princess Half Marathon Weekend",
    months: [2, 3],
    timing: "Reported February 25–March 1, 2027",
    where: "Walt Disney World Resort",
    area: "Walt Disney World",
    category: "Sports",
    tags: ["sports", "family"],
    description:
      "runDisney's 2026–27 calendar, as published by race-calendar roundups, lists Princess Half Marathon Weekend for February 25 through March 1, 2027. Confirm on runDisney.com.",
    price: "Race registration on runDisney.com",
    audience: "Runners",
    officialUrl: "https://www.rundisney.com/",
    officialLabel: "runDisney",
    sources: [
      { name: "runDisney", url: "https://www.rundisney.com/" },
      {
        name: "WDW Magazine — runDisney 2026–27 calendar",
        url: "https://www.wdw-magazine.com/rundisney/",
      },
    ],
    span: "season",
    datesConfirmed: false,
    startDate: "2027-02-25",
    endDate: "2027-03-01",
    weight: 41,
    confidenceNote: "We did not open a dedicated 2027 event page on runDisney.com. Confirm the weekend before you register or travel.",
  },
  {
    slug: "epcot-flower-and-garden",
    name: "EPCOT International Flower & Garden Festival",
    months: [3, 4, 5],
    timing: "Reported March 10–May 31, 2027. Confirm on Disney's festival page",
    where: "EPCOT",
    area: "Walt Disney World",
    category: "Festival",
    tags: ["festival", "family", "theme-park"],
    description:
      "Topiaries, gardens and outdoor kitchens. A September 2026 report, quoting a Disney date drop, put 2027 at March 10 through May 31. That range was not on the festival page we use for Arts and Holidays.",
    price: "Included with EPCOT admission if it follows the usual pattern",
    audience: "Families and garden fans",
    officialUrl: "https://disneyworld.disney.go.com/events-tours/epcot/",
    officialLabel: "EPCOT events",
    sources: [
      {
        name: "Disney Parks Blog — spring events (2027 Flower & Garden dates were not on this page)",
        url: "https://disneyparksblog.com/wdw/walt-disney-world-spring-offers-and-returning-events/",
      },
    ],
    span: "season",
    datesConfirmed: false,
    startDate: "2027-03-10",
    endDate: "2027-05-31",
    weight: 42,
    confidenceNote: "Do not book travel around March 10 until Disney's own festival page shows the 2027 dates.",
    related: { href: "/events/epcot-festival-of-the-arts", label: "Festival of the Arts, which is confirmed" },
  },
  {
    slug: "seaworld-seven-seas-food-festival",
    name: "SeaWorld Seven Seas Food Festival",
    months: [2, 3, 4, 5],
    timing: "Usually late winter and spring weekends. 2027 dates were not posted",
    where: "SeaWorld Orlando",
    area: "International Drive",
    category: "Festival",
    tags: ["festival", "theme-park"],
    description:
      "Food booths and weekend concerts. SeaWorld's events page did not list 2027 dates when we checked on November 15, 2026. The Christmas Celebration is the event actually on the calendar now.",
    price: "Included with admission in past years; 2027 not posted",
    audience: "Adults and teens",
    officialUrl: "https://seaworld.com/orlando/events/",
    datesConfirmed: false,
    span: "annual",
    sources: [{ name: "SeaWorld Orlando events", url: "https://seaworld.com/orlando/events/" }],
    weight: 70,
  },
  {
    slug: "winter-park-sidewalk-art-festival",
    name: "Winter Park Sidewalk Art Festival",
    months: [3],
    timing: "A weekend in March. The 2027 dates were not posted",
    where: "Central Park, Winter Park",
    area: "Winter Park",
    category: "Arts",
    tags: ["festival", "family", "free"],
    description:
      "A long-running outdoor art show along Park Avenue and Central Park. The city had not posted the 2027 weekend on the pages we checked. The Saturday farmers market sometimes moves that weekend.",
    price: "Free to walk; art is for sale",
    audience: "Art buyers and Park Avenue browsers",
    officialUrl: "https://cityofwinterpark.org/departments/parks-recreation/farmers-market/",
    officialLabel: "City of Winter Park",
    datesConfirmed: false,
    span: "annual",
    sources: [
      {
        name: "City of Winter Park — farmers market (notes the festival relocation)",
        url: "https://cityofwinterpark.org/departments/parks-recreation/farmers-market/",
      },
    ],
    weight: 71,
    related: { href: "/blog/best-sightseeing-tours-in-orlando", label: "Sightseeing tours" },
  },
  {
    slug: "orlando-city-sc",
    name: "Orlando City SC home matches",
    months: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    timing: "MLS season, typically late February through October. The 2027 schedule was not posted",
    where: "Inter&Co Stadium",
    area: "Downtown Orlando",
    category: "Sports",
    tags: ["sports", "nightlife"],
    description:
      "Orlando's MLS club plays downtown. The 2026 season is over, and the 2027 home schedule was not on the club site when we checked.",
    price: "Ticketed in season",
    audience: "Soccer fans",
    officialUrl: "https://www.orlandocitysc.com/",
    datesConfirmed: false,
    span: "annual",
    sources: [{ name: "Orlando City SC", url: "https://www.orlandocitysc.com/" }],
    weight: 72,
    related: { href: "/book-now/sports", label: "Sports experiences" },
  },
  {
    slug: "epcot-food-and-wine",
    name: "EPCOT International Food & Wine Festival",
    months: [8, 9, 10],
    timing: "Typically late August into November. The 2026 closing date was not on the page we checked",
    where: "EPCOT",
    area: "Walt Disney World",
    category: "Festival",
    tags: ["festival", "theme-park"],
    description:
      "Disney's largest food festival. By mid-November the holiday festival is the one with posted dates. Food & Wine's 2026 finale was not on the festival page we checked, and it is not listed as still running.",
    price: "Included with EPCOT admission; food extra",
    audience: "Adults and teens",
    officialUrl: "https://disneyworld.disney.go.com/events-tours/epcot/",
    datesConfirmed: false,
    span: "annual",
    sources: [{ name: "EPCOT events", url: "https://disneyworld.disney.go.com/events-tours/epcot/" }],
    weight: 73,
    related: { href: "/events/epcot-festival-of-the-holidays", label: "Festival of the Holidays, which is dated" },
  },
  {
    slug: "mickeys-not-so-scary-halloween-party",
    name: "Mickey's Not-So-Scary Halloween Party",
    months: [8, 9, 10],
    timing: "The 2026 season has ended. Next year's nights are not posted",
    where: "Magic Kingdom",
    area: "Walt Disney World",
    category: "Halloween",
    tags: ["family", "kids", "theme-park", "nightlife"],
    description:
      "Disney's family Halloween party, with a parade, fireworks and trick-or-treating. The 2026 season is over. Disney usually announces the next year in late spring or summer.",
    price: "Separately ticketed. 2027 prices are not posted",
    audience: "Families with kids",
    officialUrl: "https://disneyworld.disney.go.com/events-tours/magic-kingdom/mickeys-not-so-scary-halloween-party/",
    datesConfirmed: false,
    ended: true,
    span: "annual",
    sources: [
      {
        name: "Walt Disney World — Not-So-Scary",
        url: "https://disneyworld.disney.go.com/events-tours/magic-kingdom/mickeys-not-so-scary-halloween-party/",
      },
    ],
    weight: 90,
    related: { href: "/events/halloween-in-orlando", label: "Halloween in Orlando" },
  },
  {
    slug: "halloween-horror-nights",
    name: "Halloween Horror Nights",
    months: [8, 9, 10],
    timing: "2026 ran August 28–November 1 and has ended",
    where: "Universal Studios Florida",
    area: "Universal Orlando",
    category: "Halloween",
    tags: ["nightlife", "theme-park"],
    description:
      "Universal's haunted-house event. The resort's 2026 calendar listed select nights from August 28 through November 1. That season is over. 2027 dates are not posted.",
    price: "Separately ticketed. 2027 prices are not posted",
    audience: "Teens and adults. Not for young children",
    officialUrl: "https://www.universalorlando.com/web/en/us/things-to-do/events",
    datesConfirmed: true,
    ended: true,
    span: "annual",
    startDate: "2026-08-28",
    endDate: "2026-11-01",
    sources: [
      {
        name: "Universal Orlando — 2026 event dates",
        url: "https://media.universalparksusa.com/press-releases/universal-orlando-resort-reveals-dates-2026/",
      },
    ],
    weight: 91,
    tip: "Universal has described the event as too intense for young children.",
    related: { href: "/blog/orlando-halloween-events-guide-2026", label: "2026 Halloween guide" },
  },
  {
    slug: "howl-o-scream",
    name: "Howl-O-Scream",
    months: [9, 10],
    timing: "Select nights in September and October. The 2026 season has ended",
    where: "SeaWorld Orlando",
    area: "International Drive",
    category: "Halloween",
    tags: ["nightlife", "theme-park"],
    description:
      "SeaWorld's after-dark Halloween event. The 2026 nights are over, and 2027 dates were not on the events page. SeaWorld's current listed event is the Christmas Celebration.",
    price: "Separately ticketed in a typical year",
    audience: "Teens and adults",
    officialUrl: "https://seaworld.com/orlando/events/",
    datesConfirmed: false,
    ended: true,
    span: "annual",
    sources: [{ name: "SeaWorld Orlando events", url: "https://seaworld.com/orlando/events/" }],
    weight: 92,
    related: { href: "/events/seaworld-christmas-celebration", label: "SeaWorld Christmas Celebration" },
  },
  {
    slug: "come-out-with-pride",
    name: "Come Out With Pride Orlando",
    months: [10],
    timing: "October. The 2027 date is not posted",
    where: "Lake Eola Park",
    area: "Downtown Orlando",
    category: "Festival",
    tags: ["festival", "free"],
    description:
      "Orlando's Pride parade and festival around Lake Eola. The 2026 edition has passed. We did not find a posted 2027 date.",
    price: "The lake event is typically free to attend",
    audience: "Everyone",
    officialUrl: "https://www.comeoutwithpride.org/",
    datesConfirmed: false,
    ended: true,
    span: "annual",
    sources: [{ name: "Come Out With Pride", url: "https://www.comeoutwithpride.org/" }],
    weight: 93,
  },
  {
    slug: "orlando-fringe",
    name: "Orlando International Fringe Theatre Festival",
    months: [5],
    timing: "About two weeks in May. 2027 dates are not posted",
    where: "Loch Haven Park",
    area: "Mills 50 / Loch Haven",
    category: "Arts",
    tags: ["festival", "nightlife"],
    description:
      "An unjuried theatre festival with dozens of short shows and a free outdoor lawn. The 2027 dates were not posted when we checked.",
    price: "A festival button plus per-show tickets, in a typical year",
    audience: "Adults and older teens",
    officialUrl: "https://orlandofringe.org/",
    datesConfirmed: false,
    span: "annual",
    sources: [{ name: "Orlando Fringe", url: "https://orlandofringe.org/" }],
    weight: 74,
  },
  {
    slug: "fireworks-at-the-fountain",
    name: "Fourth of July at Lake Eola",
    months: [7],
    timing: "July 4. The 2027 city program is not posted",
    where: "Lake Eola Park",
    area: "Downtown Orlando",
    category: "Fireworks",
    tags: ["family", "kids", "free"],
    description:
      "Downtown's Independence Day gathering, with fireworks over the lake in a typical year. The City of Orlando had not posted a 2027 program when we checked.",
    price: "Free in past years",
    audience: "Families and downtown crowds",
    officialUrl: "https://www.orlando.gov/Events",
    datesConfirmed: false,
    span: "annual",
    fixedDay: 4,
    sources: [{ name: "City of Orlando events", url: "https://www.orlando.gov/Events" }],
    weight: 75,
    tip: "Confirm the 2027 program before you plan a holiday around it. Summer 2026 is already over.",
  },
  {
    slug: "rocket-launches",
    name: "Rocket launches on the Space Coast",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Several times a month, all year. Times change constantly",
    where: "Kennedy Space Center and Cape Canaveral",
    area: "Space Coast, about an hour east",
    category: "Space",
    tags: ["family", "free"],
    description:
      "Launches from the Space Coast are often visible from Orlando on a clear night, and Kennedy Space Center sells viewing and tours. There is no fixed public schedule months ahead.",
    price: "Watching from a public beach is free. KSC tickets are separate",
    audience: "Families and space fans",
    officialUrl: "https://www.kennedyspacecenter.com/",
    datesConfirmed: false,
    span: "annual",
    sources: [{ name: "Kennedy Space Center", url: "https://www.kennedyspacecenter.com/" }],
    weight: 35,
    tip: "Launch times slip. Book any tour with free cancellation.",
    related: { href: "/book-now/kennedy-space-center", label: "Kennedy Space Center tours" },
    bookHref: "/book-now/kennedy-space-center",
    bookLabel: "Kennedy Space Center tours",
    tourQuery: "kennedy space center",
  },
  {
    slug: "winter-park-farmers-market",
    name: "Winter Park Farmers' Market",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Every Saturday, 8 a.m.–1 p.m.",
    where: "Central Park West Meadow",
    area: "Winter Park",
    category: "Market",
    tags: ["family", "kids", "free"],
    description:
      "Produce, plants, baked goods and coffee at New York Avenue and Morse Boulevard. The city says the market sometimes moves to Seven Oaks Park for big events such as the Sidewalk Art Festival.",
    price: "Free to browse",
    audience: "Everyone",
    officialUrl: "https://cityofwinterpark.org/departments/parks-recreation/farmers-market/",
    officialLabel: "City of Winter Park",
    sources: [
      {
        name: "City of Winter Park — Saturday Farmers' Market",
        url: "https://cityofwinterpark.org/departments/parks-recreation/farmers-market/",
      },
    ],
    span: "recurring",
    datesConfirmed: true,
    weekly: "Saturday",
    venueName: "Central Park West Meadow",
    locality: "Winter Park",
    streetAddress: "150 North New York Avenue",
    offer: { low: "0" },
    weight: 32,
    tip: "Next market: Saturday, November 21. Pair it with Park Avenue.",
    related: { href: "/blog/best-sightseeing-tours-in-orlando", label: "Sightseeing tours" },
  },
  {
    slug: "lake-eola-farmers-market",
    name: "Lake Eola Farmers Market",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Every Sunday, 10 a.m.–3 p.m.",
    where: "Lake Eola Park, Central Boulevard and Eola Drive",
    area: "Downtown Orlando",
    category: "Market",
    tags: ["family", "kids", "free"],
    description:
      "The city's Sunday market at the southeast corner of Lake Eola, running since 1987. The city calendar lists dates through December 27, 2026, from 10 a.m. to 3 p.m.",
    price: "Free",
    audience: "Everyone",
    officialUrl: "https://www.orlando.gov/Events/Orlando-Farmers-Market",
    officialLabel: "City of Orlando",
    sources: [
      {
        name: "City of Orlando — Orlando Farmers Market",
        url: "https://www.orlando.gov/Events/Orlando-Farmers-Market",
      },
    ],
    span: "recurring",
    datesConfirmed: true,
    weekly: "Sunday",
    venueName: "Lake Eola Park",
    locality: "Orlando",
    offer: { low: "0" },
    weight: 33,
    tip: "Today's market, November 15, ran 10 a.m. to 3 p.m. The next one is November 22.",
    confidenceNote: "The city's posted calendar runs through December 27, 2026. Check it again before a 2027 Sunday.",
    related: { href: "/blog/free-and-cheap-things-to-do-in-orlando", label: "Free things to do" },
  },
  {
    slug: "audubon-park-community-market",
    name: "Audubon Park Community Market",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Monday evenings",
    where: "In front of Stardust Video & Coffee",
    area: "Audubon Park",
    category: "Market",
    tags: ["family", "free", "nightlife"],
    description:
      "A neighborhood evening market of farmers and makers in the Audubon Park Garden District. The market's site says Monday nights and does not post hours.",
    price: "Free",
    audience: "Neighbors and anyone who wants a low-key Monday",
    officialUrl: "https://audubonmarket.com/",
    officialLabel: "Audubon Park Community Market",
    sources: [{ name: "Audubon Park Community Market", url: "https://audubonmarket.com/" }],
    span: "recurring",
    datesConfirmed: true,
    weekly: "Monday",
    venueName: "Audubon Park Garden District",
    locality: "Orlando",
    offer: { low: "0" },
    weight: 34,
    confidenceNote: "The next market is tomorrow, Monday, November 16. Hours were not on the market's homepage.",
  },
  {
    slug: "disney-springs",
    name: "Disney Springs",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Any day. No admission charge",
    where: "Disney Springs",
    area: "Walt Disney World",
    category: "District",
    tags: ["family", "free", "nightlife"],
    description:
      "Disney's shopping and dining district. There is no ticket to walk in. Our hours guide covers typical shop times and free parking. Holiday entertainment changes every season, so check Disney's app for tonight's shows.",
    price: "Free to enter",
    audience: "Everyone",
    officialUrl: "https://www.disneysprings.com/",
    officialLabel: "Disney Springs",
    sources: [{ name: "Disney Springs", url: "https://www.disneysprings.com/" }],
    span: "recurring",
    datesConfirmed: true,
    recurring: "daily",
    weight: 36,
    related: { href: "/blog/disney-springs-hours", label: "Disney Springs hours" },
    bookHref: "/book-now/food-and-dining",
    bookLabel: "Food tours on Viator",
  },
  {
    slug: "universal-citywalk",
    name: "Universal CityWalk",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Any evening. No admission charge",
    where: "Universal CityWalk",
    area: "Universal Orlando",
    category: "Nightlife",
    tags: ["free", "nightlife", "family"],
    description:
      "Restaurants, bars and live music between the Universal parks. CityWalk does not charge admission. Parking is a separate fee; our hours guide covers the usual after-6 p.m. policy. Universal has said CityWalk will celebrate New Year's Eve.",
    price: "Free to enter; parking and venues may charge",
    audience: "Adults at night, families earlier",
    officialUrl: "https://www.universalorlando.com/web/en/us/things-to-do/citywalk",
    officialLabel: "Universal CityWalk",
    sources: [
      {
        name: "Universal CityWalk",
        url: "https://www.universalorlando.com/web/en/us/things-to-do/citywalk",
      },
    ],
    span: "recurring",
    datesConfirmed: true,
    recurring: "daily",
    weight: 37,
    related: { href: "/blog/citywalk-hours", label: "CityWalk hours" },
    bookHref: "/book-now/drinks-and-nightlife",
    bookLabel: "Nightlife tours on Viator",
  },
  {
    slug: "icon-park",
    name: "ICON Park",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timing: "Any day. The complex is free to walk",
    where: "ICON Park, International Drive",
    area: "International Drive",
    category: "District",
    tags: ["family", "kids", "free"],
    description:
      "The Wheel, SEA LIFE, Madame Tussauds and restaurants on International Drive. Walking the complex is free. Rides and museums are ticketed. A holiday tree lighting is listed here from November 20.",
    price: "Free to walk; attractions ticketed",
    audience: "Families and International Drive visitors",
    officialUrl: "https://iconparkorlando.com/",
    officialLabel: "ICON Park",
    sources: [{ name: "ICON Park", url: "https://iconparkorlando.com/" }],
    span: "recurring",
    datesConfirmed: true,
    recurring: "daily",
    weight: 38,
    tourQuery: "orlando eye|icon park|sea life orlando",
    bookHref: "/book-now/sightseeing",
    bookLabel: "ICON Park tickets on Viator",
    related: { href: "/events#idrive-tree-lighting", label: "I-Drive tree lighting" },
  },
];
