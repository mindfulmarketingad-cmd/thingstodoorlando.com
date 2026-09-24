/**
 * Editorial insights for the most-reviewed tours, keyed by Viator product
 * code. Written from each listing's inclusions, traveler ratings and our
 * Orlando planning guidance, never from invented first-hand claims.
 */
export interface TourInsight {
  verdict: string;
  bestFor: string[];
  skipIf: string;
  tips: string[];
}

export const tourInsights: Record<string, TourInsight> = {
  "5467OHEP": {
    verdict:
      "One of the best-value wildlife experiences near Orlando. A single ticket combines an airboat ride on the Everglades headwaters with admission to Wild Florida's gator park and animal demonstrations, and thousands of travelers rate it highly.",
    bestFor: ["Families who want an airboat ride and a gator park in one stop", "First-time Florida visitors", "Budget-conscious travelers"],
    skipIf: "you do not have a car. Wild Florida is about an hour from the main hotel areas, so consider a tour with pickup instead.",
    tips: [
      "Choose the 1-hour airboat option for better odds of seeing alligators and birds.",
      "Add the drive-through safari if you have time; it is right next door.",
      "Morning rides are cooler and wildlife tends to be more active.",
    ],
  },
  "5343ENTRY": {
    verdict:
      "LEGOLAND Florida is built for kids ages 2 to 12, which makes it one of the easiest theme park days in Central Florida for young families. Lines are typically shorter than the big resorts and almost every ride is kid-sized.",
    bestFor: ["Families with toddlers and young kids", "LEGO fans", "Travelers wanting a calmer park day"],
    skipIf: "your kids are teens or you are traveling as adults only; the big resorts will be a better fit.",
    tips: [
      "The park is about 45 minutes from Orlando in Winter Haven, so start early.",
      "Upgrade to include the water park on hot days.",
      "Check the operating calendar, since the park does not open every day in quieter seasons.",
    ],
  },
  "3170P32": {
    verdict:
      "The most-booked way to visit Kennedy Space Center without a car. Round-trip transport from Orlando and Kissimmee plus a guide who explains how to plan your day takes the stress out of a full-day trip to the Space Coast.",
    bestFor: ["Travelers without a rental car", "Solo travelers and couples", "First-time visitors who want a plan"],
    skipIf: "you have a car and a group of four or more; buying admission and driving is often cheaper.",
    tips: [
      "Check whether admission is included in the option you choose.",
      "Head to the bus tour to the Apollo/Saturn V Center early, before lines build.",
      "Ask your guide about launch schedules, which change often.",
    ],
  },
  "42627P1": {
    verdict:
      "A longer, more immersive airboat ride on smaller boats. Ninety minutes on the water with eight to ten passengers means more time exploring the marsh and a better chance of close wildlife sightings than a quick 30-minute ride.",
    bestFor: ["Nature lovers and photographers", "Travelers who want a small-group feel", "Families with school-age kids"],
    skipIf: "you have toddlers who may not enjoy 90 minutes of wind and engine noise.",
    tips: [
      "Bring sunglasses and a hat that will not blow away.",
      "Hearing protection is usually provided, but ask for kid sizes.",
      "Book a morning slot in summer to avoid afternoon storms.",
    ],
  },
  "3021OCDS": {
    verdict:
      "An affordable, family-friendly dinner show that pairs improv comedy and magic with unlimited pizza, salad, dessert and drinks, including beer and wine for adults. It is located inside WonderWorks on International Drive.",
    bestFor: ["Families with kids of all ages", "Budget-friendly nights out", "Groups staying on International Drive"],
    skipIf: "you want a formal sit-down dinner; the food is casual pizza-and-salad fare.",
    tips: [
      "Pair it with WonderWorks the same afternoon since they share a building.",
      "Sit near the stage if your family enjoys audience participation.",
      "Arrive early for the best seats.",
    ],
  },
  "5253P2": {
    verdict:
      "A Cirque du Soleil production created with Disney that brings Disney animation to life through live acrobatics at Disney Springs. It is one of the most polished shows in Orlando and works for all ages.",
    bestFor: ["Families and couples", "Disney fans who want something beyond the parks", "Evening plans at Disney Springs"],
    skipIf: "you are on a tight budget; tickets cost more than most Orlando shows.",
    tips: [
      "Combine it with dinner and shopping at Disney Springs, which has free parking.",
      "Center seats give the best view of the full stage.",
      "The show runs about 90 minutes, perfect for a post-park evening.",
    ],
  },
  "3021WW": {
    verdict:
      "The famous upside-down building on International Drive is packed with more than 100 hands-on exhibits, from a hurricane simulator to a bed of nails. It is one of the best rainy-day or hot-afternoon activities in Orlando.",
    bestFor: ["Families with curious kids", "Rainy or very hot days", "Groups staying on International Drive"],
    skipIf: "you only have a few hours and are not interested in interactive science exhibits.",
    tips: [
      "Plan at least three hours to see everything.",
      "Combine it with the Outta Control Magic Dinner Show in the same building.",
      "Weekday mornings are the least crowded.",
    ],
  },
  "3088_1D_UO": {
    verdict:
      "A customizable Universal Orlando park-to-park ticket that lets you ride the Hogwarts Express between Universal Studios Florida and Islands of Adventure. Ratings for this reseller listing are lower than Universal's own reputation, so read the terms carefully before buying.",
    bestFor: ["Harry Potter fans", "Visitors spending one or more days at Universal", "U.S. and Canadian residents (a requirement of this ticket)"],
    skipIf: "you are not a U.S. or Canadian resident, or you only plan to visit one park.",
    tips: [
      "Compare the price with buying directly from Universal before you book.",
      "Park-to-park access is required to ride the Hogwarts Express.",
      "Check whether your dates include Epic Universe, which may need a separate ticket.",
    ],
  },
  "5467P2": {
    verdict:
      "A drive-through safari where you steer your own car past more than 150 animals, from zebras and wildebeest to bison, plus admission to Wild Florida's gator park. It is a unique Florida experience most visitors never hear about.",
    bestFor: ["Families with young kids", "Animal lovers", "Travelers with a car"],
    skipIf: "you do not have a car; the safari is self-drive.",
    tips: [
      "Combine it with a Wild Florida airboat ride for a full half day.",
      "Drive slowly and keep windows up where signs ask.",
      "Wild Florida is about an hour from the main hotel areas.",
    ],
  },
  "169791P1": {
    verdict:
      "A small-group glass bottom kayak tour through Rainbow Springs, one of Florida's clearest spring runs. The see-through hull turns an easy paddle into a window on the fish, turtles and plants below.",
    bestFor: ["Nature lovers and photographers", "Active couples", "Beginners who want a guided paddle"],
    skipIf: "you want something close to your hotel; Rainbow Springs is well over an hour from Orlando.",
    tips: [
      "Allow 2 to 2.5 hours on the water plus driving time.",
      "Bring a dry bag, sunscreen and water shoes.",
      "Winter trips can include manatee sightings.",
    ],
  },
  "15115P9": {
    verdict:
      "One of the highest-rated experiences in all of Orlando. The Escape Game's themed rooms on International Drive are well designed, family-friendly and a great air-conditioned break from the heat.",
    bestFor: ["Families with kids 8 and up", "Friend groups and team outings", "Rainy or very hot days"],
    skipIf: "you prefer passive entertainment; everyone needs to join in to solve the puzzles.",
    tips: [
      "Book a private room for your group if you do not want to play with strangers.",
      "Arrive 15 minutes early for the briefing.",
      "Grab food nearby at ICON Park before or after.",
    ],
  },
  "5039P5": {
    verdict:
      "An hour-long airboat ride at a scenic 32-acre lakeside park with gator viewing areas, a butterfly garden and gem mining for kids. It is a relaxed, family-friendly way to see Florida wildlife.",
    bestFor: ["Families with young kids", "Travelers who want extras beyond the airboat", "Nature lovers"],
    skipIf: "you only want a quick ride; the 30-minute version may suit you better.",
    tips: [
      "Arrive early to explore the butterfly garden before your ride.",
      "Kids love the gem mining sluice.",
      "Bring a light jacket for the wind on the water.",
    ],
  },
  "53748P4": {
    verdict:
      "An aerial ropes course with nearly 100 treetop challenges, from swinging logs to cargo nets and zip lines. Climbers stay clipped into a continuous safety cable, so it is thrilling without feeling risky.",
    bestFor: ["Active families with older kids", "Teens and adventurous adults", "A break from theme parks"],
    skipIf: "anyone in your group is uncomfortable with heights.",
    tips: [
      "Wear closed-toe shoes and comfortable clothes.",
      "Book a morning slot in summer for cooler temperatures.",
      "Check age and height requirements for younger climbers.",
    ],
  },
  "122676P1": {
    verdict:
      "A two-hour walking ghost tour of historic downtown Orlando led by paranormal investigators, including stops inside buildings with ghostly reputations. It mixes local history with spooky stories and has near-perfect ratings.",
    bestFor: ["Couples and friend groups", "History and paranormal fans", "Evenings downtown"],
    skipIf: "you have young children who scare easily.",
    tips: [
      "Wear comfortable shoes for two hours of walking.",
      "October tours fill up fast, so book early.",
      "Plan dinner downtown before the tour.",
    ],
  },
  "109065P4": {
    verdict:
      "A clear kayak tour of Silver Springs, famous for crystal water, manatees in winter and the wild rhesus monkeys that live along the river. Guides are experienced naturalists, and ratings are consistently excellent.",
    bestFor: ["Nature lovers and photographers", "Families with older kids", "Manatee season visitors"],
    skipIf: "you want a short outing; Silver Springs is about 90 minutes from Orlando.",
    tips: [
      "Visit between November and March for the best manatee odds.",
      "Keep your distance from the monkeys and never feed them.",
      "Bring a waterproof phone pouch for photos.",
    ],
  },
  "290298P1": {
    verdict:
      "A small-group glass bottom kayak tour at Silver Springs with groups of up to ten. The operator promotes it as beginner friendly and all-ages, with manatees, monkeys, turtles and birds common sightings.",
    bestFor: ["Beginners", "Families with kids", "Small-group seekers"],
    skipIf: "you would rather stay close to Orlando; springs closer to the city are an option.",
    tips: [
      "Combine the trip with lunch in nearby Ocala.",
      "Winter is peak manatee season.",
      "Wear clothes that can get wet.",
    ],
  },
  "47668SEALIFE": {
    verdict:
      "A compact aquarium at ICON Park with sharks, rays, sea turtles and a 360-degree ocean tunnel. It is a quick, easy add-on to an evening on International Drive rather than a full-day attraction.",
    bestFor: ["Families with young kids", "Evenings at ICON Park", "Rainy days"],
    skipIf: "you are also visiting SeaWorld; you will see far more there.",
    tips: [
      "Buy a combo ticket with The Wheel and Madame Tussauds to save.",
      "Plan about 60 to 90 minutes.",
      "Go on a weekday for smaller crowds.",
    ],
  },
  "5039AB": {
    verdict:
      "A short, affordable airboat ride that is perfect for younger kids or tight schedules, at a lakeside park with gator viewing, a butterfly garden and a restaurant.",
    bestFor: ["Families with young kids", "Tight schedules", "First-time airboat riders"],
    skipIf: "you want a longer journey deeper into the marsh.",
    tips: [
      "Upgrade to the one-hour ride if wildlife is your priority.",
      "Stay for a lakeside meal after your ride.",
      "Kids should wear hearing protection.",
    ],
  },
  "32935P1": {
    verdict:
      "An immersive museum on International Drive with more than 350 authentic artifacts and full-scale recreations of Titanic's rooms, plus costumed actors portraying real passengers.",
    bestFor: ["History lovers", "Families with older kids", "Rainy days"],
    skipIf: "your kids are very young; it is a quieter, museum-style experience.",
    tips: [
      "Plan about 90 minutes.",
      "Ask the actors questions; they share little-known stories.",
      "Pair it with other I-Drive attractions the same day.",
    ],
  },
  "37386P2": {
    verdict:
      "A charming farm tour where you meet dozens of Gypsy Vanner horses and hear the story of how they came to America. It is gentle, unique and one of the highest-rated animal experiences near Orlando.",
    bestFor: ["Horse lovers", "Families with kids", "Multigenerational groups"],
    skipIf: "you are looking for an adrenaline activity.",
    tips: [
      "Bring a camera; the horses are remarkably photogenic.",
      "Check the tour schedule, since it runs on set days.",
      "Wear closed-toe shoes for the farm.",
    ],
  },
  "37177P6": {
    verdict:
      "An indoor, air-conditioned Polynesian luau with a buffet dinner, live band and hula, Tahitian and Samoan performances, ending with a fire knife dance. It is a festive family night out.",
    bestFor: ["Families with kids", "Groups and celebrations", "Anyone who wants a dinner show with a tropical twist"],
    skipIf: "you prefer a quiet dinner; the show is loud and lively.",
    tips: [
      "Arrive early for check-in and seating.",
      "The fire dance finale is the highlight, so stay until the end.",
      "Share dietary needs when you book.",
    ],
  },
  "340646P2": {
    verdict:
      "An award-winning pontoon boat tour of the Winter Haven Chain of Lakes with a guide who has decades of local knowledge. Expect wildlife, historic canals and old Florida stories at a very reasonable price.",
    bestFor: ["Families and seniors", "History and nature lovers", "A relaxed half day near LEGOLAND"],
    skipIf: "you want something within minutes of Disney; Winter Haven is about an hour away.",
    tips: [
      "Pair it with a LEGOLAND Florida day nearby.",
      "Bring binoculars for bird spotting.",
      "Sunscreen and a hat are a must on the water.",
    ],
  },
  "105290P7": {
    verdict:
      "A guided clear kayak or paddleboard trip at Silver Springs State Park, known for exceptional water clarity, seasonal manatees and wild rhesus monkeys. Choose a board or a kayak depending on your balance and comfort.",
    bestFor: ["Active couples", "Families with teens", "Manatee season visitors"],
    skipIf: "you are not comfortable on the water.",
    tips: [
      "Pick a kayak if you are unsure about paddleboarding.",
      "Manatees are most common in the cooler months.",
      "Bring a change of clothes.",
    ],
  },
  "3170P99": {
    verdict:
      "Straightforward admission to the Kennedy Space Center Visitor Complex, including Space Shuttle Atlantis, the Rocket Garden and the Apollo/Saturn V Center. It is the most flexible option if you have a car.",
    bestFor: ["Families with a rental car", "Groups of four or more", "Travelers who want full flexibility"],
    skipIf: "you do not have a car; a tour with transport is simpler.",
    tips: [
      "Budget for Beachline tolls and the daily parking fee.",
      "Arrive at opening and head to the bus tour first.",
      "Stop at Cocoa Beach on the way home.",
    ],
  },
  "120040P3": {
    verdict:
      "An off-road dune buggy adventure through mud, sand and water, a very different side of the Orlando area. Each buggy seats two, and drivers must meet age requirements.",
    bestFor: ["Adventurous couples and friends", "Teens with a parent", "Anyone tired of theme park lines"],
    skipIf: "you do not want to get muddy; you will.",
    tips: [
      "Wear old clothes and closed-toe shoes.",
      "Bring a change of clothes and a towel for the car.",
      "Drivers must be at least 16, so check the rules for younger riders.",
    ],
  },
  "3088P1": {
    verdict:
      "A flexible one-park-per-day Universal ticket. It suits visitors who plan to spend a full day in each park, but this reseller listing has mixed reviews, so compare the price and terms with Universal's official site.",
    bestFor: ["Visitors spending a full day in each Universal park", "U.S. and Canadian residents"],
    skipIf: "you want to ride the Hogwarts Express between parks, which requires park-to-park access.",
    tips: [
      "Compare with park-to-park tickets if you are a Harry Potter fan.",
      "Check what is required for Epic Universe on your dates.",
      "Read the residency requirements before buying.",
    ],
  },
  "329335P2": {
    verdict:
      "A small-group kayak tour at Blue Spring State Park, one of the most reliable places in Florida to see wild manatees in winter. Expert naturalist guides make it as educational as it is peaceful.",
    bestFor: ["Winter visitors", "Nature lovers and families with older kids", "Small-group seekers"],
    skipIf: "you are visiting in summer and mainly want manatees; sightings are far less reliable.",
    tips: [
      "Visit between November and March for manatees.",
      "Blue Spring is about 45 minutes north of Orlando.",
      "Dress in layers for chilly winter mornings.",
    ],
  },
  "5554070P1": {
    verdict:
      "An indoor tactical adventure where teams take on movie-style scenarios on realistic sets, guided by professional instructors. It has near-perfect ratings and is unlike anything else in Orlando.",
    bestFor: ["Groups of friends", "Families with teens", "Adrenaline seekers"],
    skipIf: "your group is not comfortable with tactical or simulated combat themes.",
    tips: [
      "Start with the Basic Drill if your group is new to it.",
      "Wear comfortable, closed-toe shoes.",
      "Check age requirements when booking with kids.",
    ],
  },
  "42054P1": {
    verdict:
      "A short, private helicopter flight over Kissimmee landmarks including Old Town, Fun Spot and Gaylord Palms. Every seat is a window seat and you will not share the helicopter with other groups.",
    bestFor: ["Couples and families", "First-time flyers", "Travelers with limited time"],
    skipIf: "you want to see the major theme parks from above; choose a longer route.",
    tips: [
      "Fly at sunset for the best light.",
      "Seating may be arranged by weight for balance.",
      "Sunglasses help on bright days.",
    ],
  },
  "216510P1": {
    verdict:
      "A playful, story-driven chocolate factory tour that shows how cacao becomes a chocolate bar, with tastings along the way. At under an hour and a low price, it is an easy win for families.",
    bestFor: ["Families with young kids", "Chocolate lovers", "Rainy or hot afternoons"],
    skipIf: "you want a deep, adult-focused tasting experience.",
    tips: [
      "Make your own chocolate bar as an add-on.",
      "It takes about 45 minutes, so pair it with another nearby activity.",
      "Great for younger kids who like stories.",
    ],
  },
  "5524770P1": {
    verdict:
      "Guided kayak and paddleboard tours at Silver Springs with a focus on wildlife and river history. Guides point out relics along the river as you look for manatees, monkeys, alligators and turtles.",
    bestFor: ["Active travelers", "Families with teens", "History-minded paddlers"],
    skipIf: "you want a very short outing; the tour runs about two and a half hours.",
    tips: [
      "Bring water and snacks.",
      "Choose a kayak if you are new to paddleboarding.",
      "Winter offers the best manatee sightings.",
    ],
  },
  "3170P40": {
    verdict:
      "A full-day trip to Crystal River, one of the few places in the U.S. where you can legally swim near wild manatees, with Homosassa Springs Wildlife State Park, lunch and hotel pickup included.",
    bestFor: ["Confident swimmers", "Bucket-list travelers", "Winter visitors"],
    skipIf: "you are not comfortable in open water or want a short day.",
    tips: [
      "Expect a very early start; bring breakfast snacks.",
      "Follow the passive observation rules; touching manatees is illegal.",
      "Winter offers the best manatee encounters.",
    ],
  },
  "5554070P2": {
    verdict:
      "An introductory indoor tactical experience with instructor-guided missions in lifelike scenarios. It is a shorter, more affordable way to try Decision Tactical.",
    bestFor: ["Beginners", "Families with teens", "Friend groups"],
    skipIf: "you already know you want the full experience; choose the Bill Drill.",
    tips: [
      "Book with your whole group for team scenarios.",
      "Wear comfortable clothing.",
      "Check minimum age requirements.",
    ],
  },
  "317042": {
    verdict:
      "An easy, well-reviewed day trip to St. Augustine, the oldest continuously occupied European-established city in the U.S., with hotel pickup from Orlando and free time to explore.",
    bestFor: ["History lovers", "Couples", "Travelers without a car"],
    skipIf: "you prefer to set your own pace; driving gives more flexibility.",
    tips: [
      "Wear comfortable shoes for brick and cobblestone streets.",
      "Visit the Castillo de San Marcos early.",
      "Plan lunch on or near St. George Street.",
    ],
  },
  "3170P78": {
    verdict:
      "A premium Kennedy Space Center day with a small group, hotel pickup, breakfast on the way and extras for a VIP-style experience. It costs more but removes almost all the planning.",
    bestFor: ["Space enthusiasts", "Special occasions", "Travelers who want a smaller group"],
    skipIf: "you are budget-focused; standard transport tours cover the essentials.",
    tips: [
      "Confirm exactly which extras are included before you book.",
      "Bring sun protection for outdoor exhibits.",
      "Ask about launch schedules on your dates.",
    ],
  },
  "186615P3": {
    verdict:
      "A two-hour clear kayak tour through Winter Park's chain of lakes and Venetian-style canals, past historic homes and wildlife, only 20 minutes from downtown Orlando. Ratings are nearly perfect.",
    bestFor: ["Couples", "Beginners", "Travelers who want nature close to the city"],
    skipIf: "you want wild springs and manatees; this is a scenic urban lake paddle.",
    tips: [
      "Book the sunset version for golden-hour views.",
      "Pair it with lunch on Park Avenue.",
      "Bring sunscreen and a hat.",
    ],
  },
  "31703436": {
    verdict:
      "An airboat ride through the Central Florida Everglades with transportation from select Orlando locations included, ideal if you want a wildlife fix without renting a car.",
    bestFor: ["Travelers without a car", "Families", "First-time airboat riders"],
    skipIf: "you have a car; booking the airboat ride directly is usually cheaper.",
    tips: [
      "Check the pickup locations before you book.",
      "Allow about five hours including transport.",
      "Bring a light layer for the ride.",
    ],
  },
  "3088_2D_UO": {
    verdict:
      "A limited-time Universal package combining park-to-park days with a day at Epic Universe. It can be good value for a three-day Universal trip, but read the restrictions carefully.",
    bestFor: ["Multi-day Universal visitors", "Epic Universe first-timers", "U.S. and Canadian residents"],
    skipIf: "you only have one day for Universal.",
    tips: [
      "Check the booking deadline for the promotion.",
      "Plan Epic Universe on its own day.",
      "Compare with Universal's official offers before buying.",
    ],
  },
  "47668MADAME": {
    verdict:
      "A wax museum at ICON Park with celebrities and superheroes you can pose with. It is a quick, fun stop rather than a major attraction.",
    bestFor: ["Families with kids and teens", "Evenings at ICON Park", "Photo lovers"],
    skipIf: "you are short on time; prioritize The Wheel or SEA LIFE.",
    tips: [
      "Buy a combo ticket with SEA LIFE and The Wheel to save.",
      "Plan about an hour.",
      "Bring your phone charged for photos.",
    ],
  },
  "357987P1": {
    verdict:
      "A small-group bioluminescent paddle near Cocoa Beach, where the water glows as you move through it on summer nights. Groups are kept small for a calmer experience.",
    bestFor: ["Couples", "Adventurous families", "Bucket-list travelers"],
    skipIf: "you are visiting outside the bioluminescence season; ask the operator about current conditions.",
    tips: [
      "Darker nights with little moonlight make the glow easier to see.",
      "Bring bug spray.",
      "The launch is closer to Cocoa Beach than Orlando, so plan the drive.",
    ],
  },
  "3170P79": {
    verdict:
      "A Kennedy Space Center trip where you meet the bus at a final meeting point to save time, then enjoy the Visitor Complex with admission-based extras. A good middle ground between self-drive and a full-service tour.",
    bestFor: ["Travelers who want transport without a long hotel pickup loop", "Space fans", "Couples"],
    skipIf: "you need pickup directly from your hotel.",
    tips: [
      "Check the meeting point location carefully.",
      "Bring a refillable water bottle.",
      "Arrive early at the meeting point.",
    ],
  },
  "317011": {
    verdict:
      "A full-day guided introduction to Orlando beyond the parks, including a Winter Park boat tour, free time on Park Avenue and a look at downtown. Ideal for travelers who want to see the city without planning.",
    bestFor: ["First-time visitors", "Seniors and multigenerational groups", "Travelers without a car"],
    skipIf: "you prefer to explore independently; Winter Park is easy to visit on your own.",
    tips: [
      "Bring cash or a card for lunch on Park Avenue.",
      "Wear comfortable walking shoes.",
      "Great for the day after arriving.",
    ],
  },
  "186615P1": {
    verdict:
      "A sunset clear kayak tour through Winter Park's chain of lakes, timed so you paddle into golden hour past historic homes and wildlife. One of the most romantic outdoor experiences near Orlando.",
    bestFor: ["Couples and date nights", "Photographers", "Beginners"],
    skipIf: "you need a daytime activity; book the daytime version instead.",
    tips: [
      "Bring bug spray for dusk.",
      "Plan dinner on Park Avenue afterward.",
      "Book early in peak season.",
    ],
  },
  "45091P2": {
    verdict:
      "A half-day guided kayak trip on the Wekiva River with a riverside lunch, through some of Central Florida's most scenic wild landscapes. Guides look for alligators, wading birds and occasionally black bears.",
    bestFor: ["Nature lovers", "Active travelers", "Small groups"],
    skipIf: "you want a short or budget activity; it is a longer, premium trip.",
    tips: [
      "Bring water, sunscreen and a dry bag.",
      "Wear clothes that can get wet.",
      "Book ahead; small groups fill quickly.",
    ],
  },
  "367861P2": {
    verdict:
      "An affordable small-group glass bottom kayak tour on the Silver River, with views of springs, fish, turtles and even sunken movie props through the transparent hull, plus free photos.",
    bestFor: ["Budget-minded paddlers", "Families", "Photographers"],
    skipIf: "you want a trip close to Orlando; Silver Springs is about 90 minutes away.",
    tips: [
      "Ask your guide about the river's film history.",
      "Visit in winter for manatees.",
      "Bring a hat and sunscreen.",
    ],
  },
  "3170P103": {
    verdict:
      "North America's longest-running dinner attraction: a four-course feast in a castle-style arena while knights compete in jousting and sword fights. Kids love it, and adults usually do too.",
    bestFor: ["Families with kids", "Groups and birthdays", "First-time Orlando visitors"],
    skipIf: "you want a quiet dinner; it is loud and interactive.",
    tips: [
      "Arrive early for the pre-show and castle displays.",
      "Upgrades mainly affect seating location.",
      "Cheer loudly for your knight; it is part of the fun.",
    ],
  },
  "76357P2": {
    verdict:
      "A huge indoor entertainment center with a multi-level electric go-kart track, an arcade, VR simulators and dining. Reviews are mixed, so it is best for kart fans who want an air-conditioned thrill.",
    bestFor: ["Teens and adults", "Rainy or hot days", "Groups and parties"],
    skipIf: "you are after a premium experience; check recent reviews first.",
    tips: [
      "Check height and age requirements for karting.",
      "Weekday afternoons are usually quieter.",
      "Bundle activities for better value.",
    ],
  },
  "42627P3": {
    verdict:
      "A one-hour airboat tour with stadium-style seating on smaller 8 to 10 passenger boats, so everyone gets a clear view. Captains add educational commentary and ratings are excellent.",
    bestFor: ["Families", "First-time airboat riders", "Photographers"],
    skipIf: "you want more time on the water; the 90-minute option goes deeper.",
    tips: [
      "Morning tours are cooler with active wildlife.",
      "Bring sunglasses and a hat.",
      "Hearing protection is recommended.",
    ],
  },
  "3805P1": {
    verdict:
      "A standard one-park-per-day Walt Disney World ticket. This reseller listing has low traveler ratings, so compare the price and terms with Disney's official site before booking.",
    bestFor: ["Visitors who plan one Disney park per day", "Travelers comparing ticket prices"],
    skipIf: "you want to visit more than one park per day; you will need a Park Hopper ticket.",
    tips: [
      "Prices vary by date, so compare several days.",
      "Check park reservation requirements.",
      "Buy only from authorized sellers.",
    ],
  },
  "105290P1": {
    verdict:
      "A nighttime clear kayak or paddleboard tour on Lake Ivanhoe with LED lights glowing beneath you and the downtown skyline reflecting on the water. It is a memorable, unusual date night.",
    bestFor: ["Couples", "Friend groups", "Travelers looking for something new at night"],
    skipIf: "you are uneasy on the water after dark.",
    tips: [
      "Bring bug spray.",
      "Pair it with dinner in nearby Ivanhoe Village.",
      "Choose a kayak if you are new to paddleboarding.",
    ],
  },
};
