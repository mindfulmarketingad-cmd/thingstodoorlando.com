import type { CategoryKey, IllustrationKey } from "@/lib/types";

/**
 * Hand-written experience guides. Each one becomes a permanent page at
 * /book-now/[slug] with editorial advice plus live Viator tours matched by
 * `searchTerm`. No prices or ratings are stated here; those only ever come
 * from the live API.
 */
export interface GuideSeed {
  title: string;
  summary: string;
  description: string;
  highlights: string[];
  goodToKnow: string[];
  bestFor: string;
  categories: CategoryKey[];
  illustration: IllustrationKey;
  searchTerm: string;
  durationLabel: string;
  durationMinutes: number;
  location: string;
}

export const guides: GuideSeed[] = [
  {
    title: "Kennedy Space Center Day Trip From Orlando",
    summary:
      "Stand beneath a real Saturn V rocket, meet the Space Shuttle Atlantis and tour working launch pads on Florida's Space Coast.",
    description:
      "Kennedy Space Center Visitor Complex sits about an hour east of Orlando on Merritt Island, and it is the single most requested day trip from the city. The complex is home to Space Shuttle Atlantis displayed as if it is still in orbit, the Apollo/Saturn V Center with a fully restored moon rocket, and the Heroes and Legends exhibit honoring the astronaut corps. Guided day trips from Orlando bundle round-trip transportation with admission so you skip the drive and the parking lot, and many include the bus tour that loops past the Vehicle Assembly Building and active launch complexes. If your dates line up with a scheduled launch, some packages add launch viewing, which is one of the most memorable things you can do in Florida.",
    highlights: [
      "See Space Shuttle Atlantis and a full Saturn V moon rocket up close",
      "Bus tour past the Vehicle Assembly Building and launch pads",
      "Round-trip transport from Orlando area hotels on most packages",
      "Optional add-ons such as lunch with an astronaut",
    ],
    goodToKnow: [
      "Plan on a full day: about one hour each way plus five to seven hours on site.",
      "Launch schedules shift often, so treat launch viewing as a bonus rather than a promise.",
      "Florida sun is intense on the outdoor rocket garden; bring sunscreen and water.",
    ],
    bestFor: "Families with kids 6 and up, science fans and first-time Orlando visitors",
    categories: ["space", "family", "day-trips"],
    illustration: "space",
    searchTerm: "Kennedy Space Center",
    durationLabel: "Full day",
    durationMinutes: 600,
    location: "Merritt Island, Florida",
  },
  {
    title: "Rocket Launch Viewing Tours on the Space Coast",
    summary:
      "Watch a real rocket climb into the sky from a prime viewing spot with transportation handled for you.",
    description:
      "Florida's Space Coast now hosts more launches than anywhere else in the country, and seeing one in person is the kind of experience people still talk about years later. Launch viewing tours from Orlando take care of the hardest parts: timing, traffic and finding a legal viewing location with a clear line of sight. Depending on the mission, packages may use the Kennedy Space Center viewing areas or public spots along the Indian River and Cocoa Beach. Night launches are especially dramatic, lighting up the horizon long before the sound reaches you. Because launch dates move with weather and technical checks, look for tours with flexible rebooking or free cancellation.",
    highlights: [
      "Viewing from established launch-watching locations",
      "Transportation that avoids launch-day traffic stress",
      "Night launches visible across the whole coastline",
      "Great pairing with a Kennedy Space Center visit",
    ],
    goodToKnow: [
      "Launches are frequently scrubbed or delayed; book options with free cancellation.",
      "Bring a folding chair and bug spray for evening launches.",
      "The rumble arrives several seconds after liftoff, so keep watching.",
    ],
    bestFor: "Couples, space fans and anyone who wants a once-in-a-lifetime moment",
    categories: ["space", "couples", "day-trips"],
    illustration: "space",
    searchTerm: "rocket launch viewing",
    durationLabel: "4 to 8 hours",
    durationMinutes: 360,
    location: "Space Coast, Florida",
  },
  {
    title: "Walt Disney World Tickets and Guided Park Days",
    summary:
      "Four theme parks, two water parks and a lot of planning. Compare tickets and guided options before you go.",
    description:
      "Walt Disney World covers roughly 25,000 acres southwest of downtown Orlando and includes Magic Kingdom, EPCOT, Hollywood Studios and Animal Kingdom, plus two water parks. It is the reason many families visit Orlando in the first place, and a little planning goes a long way. Ticket prices change by date, so traveling midweek or outside school holidays can save real money. Multi-day tickets usually get cheaper per day the longer you stay, and park hopper options let you move between parks in the afternoon. Several tour operators also offer guided experiences that focus on history, behind-the-scenes stories or ride strategy, which are useful if it is your first visit.",
    highlights: [
      "Magic Kingdom, EPCOT, Hollywood Studios and Animal Kingdom",
      "Date-based pricing rewards flexible travelers",
      "Multi-day tickets lower the cost per day",
      "Guided options for first timers who want a game plan",
    ],
    goodToKnow: [
      "Buy only from authorized sellers; resold or partially used tickets are often invalid.",
      "Park reservations and hours change seasonally, so check the official calendar before you go.",
      "Arrive before opening to ride headliners with shorter waits.",
    ],
    bestFor: "Families, first-time visitors and lifelong Disney fans",
    categories: ["theme-parks", "family"],
    illustration: "theme-parks",
    searchTerm: "Disney World tickets",
    durationLabel: "1 or more days",
    durationMinutes: 720,
    location: "Lake Buena Vista, Florida",
  },
  {
    title: "Universal Orlando Resort Tickets",
    summary:
      "Wizarding worlds, blockbuster coasters and Epic Universe. Here is how to pick the right Universal ticket.",
    description:
      "Universal Orlando Resort is the thrill-seeker's side of town. Universal Studios Florida and Islands of Adventure are connected by the Hogwarts Express, and Epic Universe added a third major park in 2025 with new themed worlds. Volcano Bay rounds things out as a tropical water park. Ticket choices come down to how many days you have, how many parks you want to see and whether you need a park-to-park ticket to ride the train between the two original parks. Express passes can dramatically cut wait times on busy days, which is worth considering during holidays and spring break when lines stretch long.",
    highlights: [
      "Universal Studios Florida, Islands of Adventure and Epic Universe",
      "Park-to-park tickets unlock the Hogwarts Express ride",
      "Volcano Bay water park for hot afternoons",
      "Express options to cut the longest waits",
    ],
    goodToKnow: [
      "Epic Universe may require its own ticket type; read the inclusions closely.",
      "Thrill rides have height requirements, so check them before promising kids a ride.",
      "Lockers are required for loose items on many coasters.",
    ],
    bestFor: "Teens, thrill seekers, movie fans and couples",
    categories: ["theme-parks", "family", "couples"],
    illustration: "theme-parks",
    searchTerm: "Universal Orlando tickets",
    durationLabel: "1 or more days",
    durationMinutes: 720,
    location: "Orlando, Florida",
  },
  {
    title: "SeaWorld Orlando and Aquatica Tickets",
    summary: "Marine life encounters, big coasters and a water park, all on the south end of International Drive.",
    description:
      "SeaWorld Orlando mixes animal habitats and educational presentations with some of the tallest and fastest roller coasters in the state. Families come for the penguins, dolphins and sea turtles, while thrill fans head straight for the coasters. Aquatica, the companion water park across the street, is a strong pick on hot days. Combination tickets that include both parks, or pair SeaWorld with Busch Gardens in Tampa, often cost less per park than buying separately. SeaWorld tends to have shorter lines than the larger resorts, which makes it an easier day with younger kids.",
    highlights: [
      "Marine animal habitats and presentations",
      "Record-setting roller coasters for older kids and adults",
      "Aquatica water park next door",
      "Combo tickets that stretch your budget",
    ],
    goodToKnow: [
      "Bring a change of clothes; several rides and shows include a soak zone.",
      "All-day dining add-ons can pay off for bigger families.",
      "Weekday visits outside holidays are noticeably calmer.",
    ],
    bestFor: "Families with mixed ages and budget-minded theme park fans",
    categories: ["theme-parks", "family"],
    illustration: "theme-parks",
    searchTerm: "SeaWorld Orlando tickets",
    durationLabel: "Full day",
    durationMinutes: 540,
    location: "Orlando, Florida",
  },
  {
    title: "LEGOLAND Florida Day Trip",
    summary: "A theme park built for kids ages 2 to 12, with botanical gardens and a water park about 45 miles from Orlando.",
    description:
      "LEGOLAND Florida Resort in Winter Haven is designed around younger children, which means rides kids can actually go on, shorter lines and a pace that works for little legs. The park sits on the former Cypress Gardens site, and its historic botanical gardens are still there to explore. Miniland USA recreates American cities in LEGO bricks, and the seasonal water park is included with some tickets. It is an easy day trip from Orlando by car, and some packages include transportation. If your kids are under 10, this is often a better value day than the big resorts.",
    highlights: [
      "Rides sized for kids ages 2 to 12",
      "Miniland USA built from millions of LEGO bricks",
      "Historic Cypress Gardens botanical area",
      "Seasonal water park on select tickets",
    ],
    goodToKnow: [
      "The park is about an hour's drive from central Orlando.",
      "Operating days vary by season; confirm the calendar before booking.",
      "Pack swimsuits if your ticket includes the water park.",
    ],
    bestFor: "Families with toddlers and young kids",
    categories: ["theme-parks", "family", "day-trips"],
    illustration: "family",
    searchTerm: "LEGOLAND Florida",
    durationLabel: "Full day",
    durationMinutes: 540,
    location: "Winter Haven, Florida",
  },
  {
    title: "Busch Gardens Tampa Bay Day Trip",
    summary: "African-inspired animal habitats and some of Florida's most intense coasters, about 90 minutes west.",
    description:
      "Busch Gardens Tampa Bay combines a large zoo-style animal park with a lineup of big roller coasters, making it a strong day trip for families with teenagers. The Serengeti Plain lets giraffes, zebras and rhinos roam across an open savanna you can see from the train or a guided safari add-on. Coaster fans usually rank it among the best parks in the Southeast. Some SeaWorld Orlando tickets include Busch Gardens, and shuttles from Orlando can be booked if you do not want to drive Interstate 4.",
    highlights: [
      "Open savanna with giraffes, zebras and rhinos",
      "Multiple top-rated roller coasters",
      "Optional safari and animal encounters",
      "Combo tickets with SeaWorld Orlando",
    ],
    goodToKnow: [
      "Expect 80 to 100 minutes of driving each way depending on I-4 traffic.",
      "Animals are most active in the morning, so tour the habitats early.",
      "Afternoon summer storms can pause coasters temporarily.",
    ],
    bestFor: "Families with teens, animal lovers and coaster fans",
    categories: ["theme-parks", "day-trips", "wildlife"],
    illustration: "day-trips",
    searchTerm: "Busch Gardens Tampa",
    durationLabel: "Full day",
    durationMinutes: 600,
    location: "Tampa, Florida",
  },
  {
    title: "Airboat Rides and Everglades-Style Swamp Tours",
    summary: "Skim across the headwaters of the Everglades and spot alligators, turtles and wading birds in the wild.",
    description:
      "You do not have to drive to South Florida to get the Everglades experience. The lakes and marshes south of Orlando, including Lake Tohopekaliga and the Kissimmee chain, are the headwaters of the Everglades system, and airboat operators run tours there daily. Rides typically last 30 to 90 minutes and move between fast open-water runs and slow stretches through grassy marsh where guides point out alligators, osprey, bald eagles and turtles. It is an easy half-day activity and a welcome break from theme park crowds. Night airboat tours, when offered, are a different experience altogether, with gator eyes glowing in the spotlight.",
    highlights: [
      "Wild alligators in their natural habitat",
      "Bald eagles, herons and other native birds",
      "Fast open-water runs and slow wildlife stretches",
      "Only 30 to 45 minutes from most Orlando hotels",
    ],
    goodToKnow: [
      "Airboats are loud; most operators provide hearing protection.",
      "Morning and late-afternoon tours usually have the best wildlife sightings.",
      "Young children should be comfortable with noise and wind.",
    ],
    bestFor: "Families, nature lovers and first-time Florida visitors",
    categories: ["wildlife", "family", "water"],
    illustration: "wildlife",
    searchTerm: "airboat ride",
    durationLabel: "1 to 2 hours",
    durationMinutes: 90,
    location: "Kissimmee, Florida",
  },
  {
    title: "Gatorland Admission and Wildlife Encounters",
    summary: "Orlando's original roadside attraction, home to thousands of alligators and crocodiles since 1949.",
    description:
      "Gatorland opened in 1949, long before the big theme parks arrived, and it still delivers old-school Florida fun. The park is home to thousands of alligators and crocodiles, plus a breeding marsh with a boardwalk, a free-flight aviary and shows like the Gator Jumparoo. It is compact and walkable, which makes it a relaxed half day with kids. For extra thrills, the park offers a zip line course over the gator pools and hands-on trainer experiences for older kids and adults.",
    highlights: [
      "Thousands of alligators and crocodiles",
      "Live shows and a breeding marsh boardwalk",
      "Zip line over the gator pools",
      "Compact park that works well for half a day",
    ],
    goodToKnow: [
      "Located on South Orange Blossom Trail, about 20 minutes from International Drive.",
      "Zip line and trainer experiences have age and weight limits.",
      "Shows run on a schedule, so check times on arrival.",
    ],
    bestFor: "Families with young kids and wildlife fans",
    categories: ["wildlife", "family"],
    illustration: "wildlife",
    searchTerm: "Gatorland",
    durationLabel: "3 to 5 hours",
    durationMinutes: 240,
    location: "Orlando, Florida",
  },
  {
    title: "Manatee Encounters at Blue Spring and Crystal River",
    summary: "See gentle West Indian manatees gather in warm spring water during Florida's cooler months.",
    description:
      "From roughly November through March, hundreds of West Indian manatees move into Florida's spring-fed rivers, where the water stays near 72 degrees year round. Blue Spring State Park in Orange City, about 45 minutes north of Orlando, is one of the most reliable places to see them from a boardwalk. Crystal River on the Gulf side is the only place in the United States where you can legally swim near wild manatees on guided tours that follow strict passive-observation rules. Day trips from Orlando handle transportation and gear, and the snorkel tours are an unforgettable experience for confident swimmers.",
    highlights: [
      "Manatees gathering in warm spring water",
      "Boardwalk viewing at Blue Spring State Park",
      "Guided in-water tours at Crystal River",
      "Clear springs ideal for photography",
    ],
    goodToKnow: [
      "Peak manatee season is winter; summer sightings are much less predictable.",
      "Touching or chasing manatees is illegal; guides brief you on passive observation.",
      "Crystal River is roughly a 90-minute drive, so start early.",
    ],
    bestFor: "Nature lovers, families with confident swimmers and photographers",
    categories: ["wildlife", "water", "day-trips", "family"],
    illustration: "water",
    searchTerm: "manatee tour",
    durationLabel: "Half day to full day",
    durationMinutes: 480,
    location: "Orange City and Crystal River, Florida",
  },
  {
    title: "Kayak and Paddleboard Tours on Central Florida Springs",
    summary: "Paddle crystal clear spring runs under moss-draped oaks at Wekiwa, Rock Springs and beyond.",
    description:
      "Central Florida sits on top of one of the largest concentrations of freshwater springs in the world, and several are within an easy drive of Orlando. Wekiwa Springs State Park in Apopka and nearby Rock Springs Run offer calm, shaded paddling through clear water where you can spot turtles, fish, herons and occasionally a manatee or otter. Guided kayak and paddleboard tours supply the boats, safety briefing and local knowledge, and some use clear-bottom kayaks so you can see straight down to the spring floor. It is a peaceful counterpoint to a week of rides and crowds.",
    highlights: [
      "Clear spring water in every season",
      "Shaded paddling routes under oak canopies",
      "Turtles, wading birds and native fish",
      "Clear-bottom kayak options on some tours",
    ],
    goodToKnow: [
      "Popular springs can reach capacity on summer weekends; arrive early.",
      "Water shoes and a dry bag make the day more comfortable.",
      "Most tours are suitable for beginners with basic swimming ability.",
    ],
    bestFor: "Active couples, families with older kids and nature lovers",
    categories: ["water", "wildlife", "couples"],
    illustration: "water",
    searchTerm: "kayak tour springs",
    durationLabel: "2 to 3 hours",
    durationMinutes: 150,
    location: "Apopka, Florida",
  },
  {
    title: "Winter Park Scenic Boat Tour and Park Avenue Stroll",
    summary: "Cruise a chain of lakes and narrow canals past historic estates, then browse one of Florida's prettiest streets.",
    description:
      "The Scenic Boat Tour in Winter Park has been running since 1938, and it remains one of the most relaxing things to do in the Orlando area. The hour-long cruise follows three lakes connected by narrow canals, passing Rollins College, lakefront estates and cypress-lined shorelines while the captain shares local history. Afterward, Park Avenue is a short walk away with boutique shops, sidewalk cafes and the Charles Hosmer Morse Museum, which holds a renowned collection of Louis Comfort Tiffany glass. Walking and food tours of Winter Park often combine all three.",
    highlights: [
      "Hour-long pontoon cruise through three lakes and canals",
      "Historic homes and Rollins College views",
      "Boutiques and cafes along Park Avenue",
      "Tiffany glass collection at the Morse Museum",
    ],
    goodToKnow: [
      "Winter Park is about 20 minutes north of downtown Orlando.",
      "Boat tours are first come, first served at busy times.",
      "The Saturday farmers market is a local favorite.",
    ],
    bestFor: "Couples, multigenerational families and slow travelers",
    categories: ["water", "couples", "sightseeing", "family"],
    illustration: "couples",
    searchTerm: "Winter Park tour",
    durationLabel: "2 to 4 hours",
    durationMinutes: 180,
    location: "Winter Park, Florida",
  },
  {
    title: "Sunrise Hot Air Balloon Rides Over Central Florida",
    summary: "Float above lakes, orange groves and theme park skylines as the sun comes up.",
    description:
      "Hot air balloon flights around Orlando launch at dawn, when winds are calm, and drift over lakes, farmland and on clear mornings the distant skylines of the theme parks. Most flights spend about an hour in the air, and the full experience including check-in, inflation and a post-flight toast runs around three to four hours. Many operators finish with a champagne or sparkling cider celebration and a light breakfast. It is a classic special-occasion activity, so it is popular for proposals, anniversaries and birthdays. Flights depend on weather, and reputable operators will reschedule if conditions are not safe.",
    highlights: [
      "About an hour aloft at sunrise",
      "Views of lakes, groves and theme park skylines",
      "Traditional post-flight toast on many tours",
      "Private basket upgrades for proposals",
    ],
    goodToKnow: [
      "Expect a very early start, often before 6 a.m.",
      "Flights are weather dependent and may be rescheduled.",
      "Most operators set minimum ages and weight guidelines.",
    ],
    bestFor: "Couples, special occasions and bucket-list travelers",
    categories: ["sky", "couples"],
    illustration: "sky",
    searchTerm: "hot air balloon",
    durationLabel: "3 to 4 hours",
    durationMinutes: 210,
    location: "Central Florida",
  },
  {
    title: "Helicopter Tours Over Orlando and the Theme Parks",
    summary: "Short, thrilling flights over International Drive, the resorts and, after dark, the fireworks.",
    description:
      "Helicopter tours are one of the fastest ways to understand how big Orlando's resort area really is. Flights depart from pads near International Drive and Kissimmee and range from a quick few-minute hop to longer loops that cover the major parks, downtown and surrounding lakes. Evening flights timed with park fireworks are especially popular with couples. Because flights are short, they fit easily into a free evening, and kids usually love the window seat. Every tour is priced by route length, so compare what each route covers before you book.",
    highlights: [
      "Aerial views of the resort corridor",
      "Night flights timed with fireworks",
      "Routes from a few minutes to half an hour",
      "Easy add-on to an International Drive evening",
    ],
    goodToKnow: [
      "Seat assignments are usually based on weight balance.",
      "Fireworks flights depend on park show schedules.",
      "Sunglasses help on bright afternoon flights.",
    ],
    bestFor: "Couples, photographers and families with kids who love flying",
    categories: ["sky", "couples", "family"],
    illustration: "sky",
    searchTerm: "helicopter tour Orlando",
    durationLabel: "10 to 30 minutes",
    durationMinutes: 20,
    location: "International Drive, Orlando",
  },
  {
    title: "Medieval Knights Dinner Tournament in Kissimmee",
    summary: "Cheer on your knight during jousting and sword fights while you eat a four-course feast with your hands.",
    description:
      "Medieval dinner tournaments are an Orlando-area institution. Guests are seated in color-coded sections of an arena and cheer for their assigned knight as horsemanship, falconry, jousting and choreographed sword fights unfold during the meal. Dinner is served without silverware for the full medieval effect, and kids tend to love every minute of it. Shows run nightly with multiple seatings during busy seasons. Upgrade packages add better seats, souvenirs and cheering banners, but general admission still gives everyone a good view of the arena floor.",
    highlights: [
      "Live jousting and horsemanship",
      "Four-course dinner served medieval style",
      "Color-coded seating to cheer for your knight",
      "Family-friendly two-hour show",
    ],
    goodToKnow: [
      "Arrive 45 to 60 minutes early for check-in and seating.",
      "Vegetarian and allergy-friendly meals are available on request.",
      "Upgrade packages mainly affect seat location.",
    ],
    bestFor: "Families with kids of all ages and groups",
    categories: ["dinner-shows", "family"],
    illustration: "dinner-shows",
    searchTerm: "Medieval Times dinner",
    durationLabel: "2 hours",
    durationMinutes: 120,
    location: "Kissimmee, Florida",
  },
  {
    title: "Pirate Dinner Shows in Orlando",
    summary: "Swashbuckling acrobatics on a full-size ship inside a theater, with dinner served during the adventure.",
    description:
      "Pirate dinner shows turn dinner into an interactive adventure. The action unfolds on and around a replica pirate ship in the middle of an indoor lagoon, with aerial acrobatics, sword fights and plenty of audience participation. Kids are often invited to join the crew, and a pre-show reception keeps everyone entertained before the main event. It is loud, silly and a lot of fun, which is exactly the point. The show is a natural pick for a family night off from the parks on International Drive.",
    highlights: [
      "Full-size replica pirate ship on an indoor lagoon",
      "Acrobatics, cannons and sword fights",
      "Kids invited to join the action",
      "Dinner and drinks served during the show",
    ],
    goodToKnow: [
      "Seating sections affect how close you are to the splash zone.",
      "Allow about two and a half hours including the pre-show.",
      "Adult beverages are available for guests 21 and over.",
    ],
    bestFor: "Families with kids 4 to 12",
    categories: ["dinner-shows", "family"],
    illustration: "dinner-shows",
    searchTerm: "pirate dinner show",
    durationLabel: "2 to 2.5 hours",
    durationMinutes: 150,
    location: "International Drive, Orlando",
  },
  {
    title: "Murder Mystery and Comedy Dinner Shows",
    summary: "Solve a crime or laugh through dinner at Orlando's interactive theater shows for grown-ups and teens.",
    description:
      "If you want a dinner show with more wit than cannons, Orlando's mystery and comedy dinner theaters are a great pick for a date night or a group outing. At a murder mystery show, actors weave a case through the evening while guests question suspects and try to name the culprit before dessert. Comedy and improv dinner shows lean on audience suggestions, so no two nights are alike. The atmosphere is relaxed and small enough to feel personal, and most shows include a multi-course meal with unlimited soft drinks, beer or wine depending on the venue.",
    highlights: [
      "Interactive storylines with audience participation",
      "Intimate theater setting",
      "Multi-course dinner included",
      "Different show every night",
    ],
    goodToKnow: [
      "Content is generally PG to PG-13; check age guidance before booking with kids.",
      "Sitting near the stage increases the chance of being pulled into the act.",
      "Most shows run close to two hours.",
    ],
    bestFor: "Couples, friends and families with teens",
    categories: ["dinner-shows", "couples"],
    illustration: "dinner-shows",
    searchTerm: "mystery dinner show",
    durationLabel: "2 hours",
    durationMinutes: 120,
    location: "International Drive, Orlando",
  },
  {
    title: "ICON Park and The Wheel on International Drive",
    summary: "Ride the 400-foot observation wheel, then eat, shop and play along International Drive.",
    description:
      "ICON Park is the entertainment hub in the middle of International Drive. Its centerpiece is The Wheel, a 400-foot observation wheel with air-conditioned capsules that take about 20 minutes to complete a rotation. On a clear evening you can see the theme park fireworks and far across Central Florida. The complex also includes restaurants, an aquarium, a wax museum and some of the tallest thrill rides in the city. It is walkable, open late and a good plan for your arrival night or any evening you want to stay close to your hotel.",
    highlights: [
      "400-foot observation wheel with climate-controlled capsules",
      "Evening views of theme park fireworks",
      "Aquarium, wax museum and thrill rides nearby",
      "Restaurants and bars open late",
    ],
    goodToKnow: [
      "Combo passes bundle The Wheel with other ICON Park attractions.",
      "Sunset rides are the most popular; book ahead on weekends.",
      "Parking is available on site.",
    ],
    bestFor: "Couples, families and arrival-night plans",
    categories: ["family", "couples", "drinks-and-nightlife", "sky"],
    illustration: "food-and-city",
    searchTerm: "ICON Park Wheel",
    durationLabel: "1 to 3 hours",
    durationMinutes: 120,
    location: "International Drive, Orlando",
  },
  {
    title: "Orlando Food Tours and Downtown Walking Tours",
    summary: "Taste your way through Orlando's neighborhoods with a local guide leading the way.",
    description:
      "Orlando's food scene extends far beyond theme park snacks. Guided food tours in Winter Park, the Mills 50 district and downtown Orlando combine short walks with tastings at independent restaurants, bakeries and bars. Mills 50 is known for Vietnamese and other Asian cuisines, while Winter Park leans toward chef-driven bistros and sweet stops. Walking tours of downtown often cover Lake Eola, historic Church Street and the city's history from a small citrus town to the tourism capital of the world. Tours are a great way to find restaurants to return to later in your trip.",
    highlights: [
      "Tastings at independent local restaurants",
      "Neighborhood history from a local guide",
      "Small groups with time to ask questions",
      "Great first-day orientation to the city",
    ],
    goodToKnow: [
      "Share dietary restrictions when booking; most tours can accommodate.",
      "Wear comfortable shoes and plan for Florida heat.",
      "Tastings typically add up to a full meal.",
    ],
    bestFor: "Couples, foodies and repeat visitors who have done the parks",
    categories: ["food-and-dining", "couples"],
    illustration: "food-and-city",
    searchTerm: "Orlando food tour",
    durationLabel: "2 to 3 hours",
    durationMinutes: 180,
    location: "Downtown Orlando and Winter Park",
  },
  {
    title: "Lake Eola Park and Swan Boats",
    summary: "Pedal a swan boat around downtown's signature lake and stroll past the iconic fountain.",
    description:
      "Lake Eola Park is the heart of downtown Orlando. The lake's lighted fountain has been a city symbol for decades, and the path around the water is just under a mile, which makes it an easy walk with kids or a nice post-dinner loop. Swan-shaped pedal boats are available to rent, and real swans live on the lake year round. On Sundays a farmers market sets up along the shore, and the amphitheater hosts events throughout the year. It is also a starting point for many downtown walking and food tours.",
    highlights: [
      "Swan pedal boats on the lake",
      "Just under one-mile walking loop",
      "Lighted fountain in the evening",
      "Sunday farmers market",
    ],
    goodToKnow: [
      "Walking the park is free; boat rentals are charged by the half hour.",
      "Downtown street parking and nearby garages are paid.",
      "Evenings are cooler and the fountain lights are on.",
    ],
    bestFor: "Families with little kids, couples and budget travelers",
    categories: ["family", "couples", "water", "sightseeing"],
    illustration: "couples",
    searchTerm: "Lake Eola",
    durationLabel: "1 to 2 hours",
    durationMinutes: 90,
    location: "Downtown Orlando",
  },
  {
    title: "Zip Lines and Treetop Adventure Parks Near Orlando",
    summary: "Soar over gator pools and weave through the treetops on courses built for kids and adults.",
    description:
      "For families who want adrenaline without a roller coaster, the zip line and aerial adventure courses around Orlando hit the sweet spot. Some lines cross over alligator habitats, while treetop parks set up obstacle courses with rope bridges, swings and zip lines at different difficulty levels so kids and adults can each find their challenge. Guided zip line tours usually include a safety briefing and staff on every platform. They are a great way to spend a morning outdoors, and most courses take two to three hours to complete.",
    highlights: [
      "Zip lines over alligator habitats",
      "Treetop obstacle courses with multiple difficulty levels",
      "Guides and safety briefings included",
      "Great outdoor alternative to theme parks",
    ],
    goodToKnow: [
      "Minimum age, height and weight rules apply on most courses.",
      "Closed-toe shoes are required.",
      "Courses can pause for lightning, which is common on summer afternoons.",
    ],
    bestFor: "Active families with kids 7 and up and adventurous couples",
    categories: ["family", "wildlife", "sky"],
    illustration: "family",
    searchTerm: "zipline Orlando",
    durationLabel: "2 to 3 hours",
    durationMinutes: 150,
    location: "Orlando and Kissimmee, Florida",
  },
  {
    title: "Clearwater Beach Day Trip From Orlando",
    summary: "Swap the parks for soft white sand and Gulf sunsets on one of Florida's most loved beaches.",
    description:
      "Clearwater Beach on the Gulf Coast consistently ranks among the best beaches in the country, with fine white sand, calm water and famously good sunsets. It is about two hours west of Orlando, and guided day trips handle the drive so you can relax. Pier 60 hosts a nightly sunset celebration with street performers, and Clearwater Marine Aquarium is a short ride away if the kids need a break from the sand. Many trips include free time on the beach, optional dolphin watching cruises and a stop for fresh seafood.",
    highlights: [
      "White sand and calm Gulf water",
      "Sunset celebration at Pier 60",
      "Optional dolphin watching cruises",
      "Clearwater Marine Aquarium nearby",
    ],
    goodToKnow: [
      "Expect around two hours of travel each way.",
      "Bring reef-safe sunscreen, towels and a change of clothes.",
      "Summer afternoons often bring brief thunderstorms.",
    ],
    bestFor: "Families, couples and beach lovers",
    categories: ["day-trips", "family", "couples", "water"],
    illustration: "day-trips",
    searchTerm: "Clearwater Beach day trip",
    durationLabel: "Full day",
    durationMinutes: 660,
    location: "Clearwater, Florida",
  },
  {
    title: "St. Augustine Day Trip From Orlando",
    summary: "Explore the oldest continuously inhabited European-founded city in the United States.",
    description:
      "Founded in 1565, St. Augustine is packed with history about two hours northeast of Orlando. The Castillo de San Marcos, a 17th-century Spanish stone fort, anchors the waterfront, and the pedestrian St. George Street is lined with shops, cafes and historic buildings. Flagler College occupies the former Hotel Ponce de Leon, a spectacular Gilded Age landmark. Guided day trips from Orlando usually include transportation, a trolley or walking tour and free time for lunch. It is a very different side of Florida and a favorite for couples and history buffs.",
    highlights: [
      "Castillo de San Marcos Spanish fort",
      "Historic St. George Street",
      "Flagler College and Gilded Age architecture",
      "Trolley or walking tour of the old city",
    ],
    goodToKnow: [
      "Plan for about two hours of travel each way.",
      "Wear comfortable shoes for brick and cobblestone streets.",
      "Evening ghost tours are popular if you stay late.",
    ],
    bestFor: "Couples, history lovers and families with older kids",
    categories: ["day-trips", "couples", "sightseeing"],
    illustration: "day-trips",
    searchTerm: "St Augustine day trip",
    durationLabel: "Full day",
    durationMinutes: 660,
    location: "St. Augustine, Florida",
  },
  {
    title: "Everglades National Park Day Trip From Orlando",
    summary: "A long but rewarding day to one of the world's great wetlands, with airboat rides and wildlife viewing.",
    description:
      "Everglades National Park protects the largest subtropical wilderness in the United States, and guided day trips from Orlando make the long drive manageable. Tours typically include an airboat ride through sawgrass prairie, wildlife viewing for alligators and wading birds and time at a visitor center or boardwalk trail. Some itineraries continue to Miami for a quick look at South Beach or Little Havana. It is a big day, often 12 hours or more, so it suits travelers who want to see the real Everglades rather than the headwaters closer to Orlando.",
    highlights: [
      "Airboat ride through sawgrass prairie",
      "Alligators, herons and roseate spoonbills",
      "Optional Miami stops on some itineraries",
      "Transport handled door to door",
    ],
    goodToKnow: [
      "This is a long day with 3.5 to 4 hours of driving each way.",
      "Mosquitoes can be intense in summer; pack repellent.",
      "For a shorter option, try an airboat tour near Kissimmee instead.",
    ],
    bestFor: "Nature lovers and travelers with a free day to spare",
    categories: ["day-trips", "wildlife"],
    illustration: "wildlife",
    searchTerm: "Everglades day trip from Orlando",
    durationLabel: "12 to 14 hours",
    durationMinutes: 780,
    location: "Everglades National Park, Florida",
  },
  {
    title: "Lake Toho Fishing Charters and Jet Ski Tours",
    summary: "Fish for trophy largemouth bass or race across open water on one of Florida's famous lakes.",
    description:
      "Lake Tohopekaliga, known locally as Lake Toho, is one of the best-known largemouth bass lakes in the country and sits right next to downtown Kissimmee. Guided fishing charters supply the boat, tackle and local know-how, so beginners and experienced anglers can both have a great morning. If speed is more your style, guided jet ski and pontoon tours explore the lake and nearby marshes, often with sightings of alligators, osprey and bald eagles. Both are easy half-day trips just minutes from the main resort areas.",
    highlights: [
      "Trophy largemouth bass fishing",
      "Guided jet ski and pontoon tours",
      "Eagles, osprey and alligators along the shore",
      "Minutes from Kissimmee resorts",
    ],
    goodToKnow: [
      "A Florida fishing license may be required; many charters include or arrange it.",
      "Early mornings offer the best fishing and calmest water.",
      "Jet ski drivers must meet age requirements.",
    ],
    bestFor: "Anglers, active couples and families with teens",
    categories: ["water", "wildlife", "couples"],
    illustration: "water",
    searchTerm: "Lake Toho fishing",
    durationLabel: "2 to 4 hours",
    durationMinutes: 180,
    location: "Kissimmee, Florida",
  },
  {
    title: "Orlando Brewery and Craft Cocktail Tours",
    summary: "Sample local craft beer and cocktails with transportation handled, so everyone gets to enjoy the night.",
    description:
      "Orlando has a growing craft beverage scene, with breweries clustered around downtown, the Milk District, Winter Park and Sanford. Guided brewery tours visit several taprooms in one trip, include tastings and use a driver so no one in the group has to stay sober. Cocktail tours focus on speakeasy-style bars and inventive local mixologists. It is an easy way to see neighborhoods most visitors miss and a fun night out for couples or friend groups on an adults-only evening.",
    highlights: [
      "Multiple taprooms or bars in one evening",
      "Tastings and behind-the-scenes stories",
      "Transportation with a designated driver",
      "Neighborhoods beyond the tourist corridor",
    ],
    goodToKnow: [
      "Guests must be 21 or older with valid ID.",
      "Eat beforehand unless food is included.",
      "Small groups fill quickly on weekends.",
    ],
    bestFor: "Couples, friend groups and adults-only nights",
    categories: ["drinks-and-nightlife", "couples"],
    illustration: "food-and-city",
    searchTerm: "brewery tour Orlando",
    durationLabel: "3 to 4 hours",
    durationMinutes: 210,
    location: "Orlando, Florida",
  },
];
