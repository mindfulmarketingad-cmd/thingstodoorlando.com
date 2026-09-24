import TextPage from "@/components/TextPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "ThingsToDoOrlando.com helps travelers and locals find the best things to do in Orlando with honest guides and top-rated tours you can book securely.",
  path: "/about",
});

const body = `
## Our mission

ThingsToDoOrlando.com exists to make planning an Orlando trip simple, fun and a little less overwhelming. Orlando has more attractions, tours and events than almost any destination on earth, and sorting through them can take hours. We do that work for you, organizing the best **things to do in Orlando** into clear categories with honest advice on who each experience is best for, how long it takes and how to get the most out of it.

## What we cover

- **Theme parks and attractions**, from Walt Disney World and Universal Orlando Resort to SeaWorld, LEGOLAND and Gatorland.
- **Nature and wildlife**, including airboat rides, manatee encounters and kayak tours on Central Florida's springs.
- **Space Coast adventures**, with Kennedy Space Center visits and rocket launch viewing.
- **Dinner shows and nightlife**, from jousting knights to murder mysteries.
- **Family friendly and couples experiences**, curated for each kind of trip.
- **Day trips** to beaches, historic towns and the Everglades.

## How we choose what to feature

Our editors research each experience using official attraction information, operator details and patterns in verified traveler reviews. We look for experiences that deliver real value, have clear policies and are well reviewed by the people who actually booked them. We write our guides to be useful first, and we update them as attractions, seasons and prices change.

## How we are funded

ThingsToDoOrlando.com is free to use. We are a participant in the Viator affiliate program, which means we may earn a commission when you book through links on our site. This never changes the price you pay. Affiliate relationships do not decide which experiences we recommend. Read our full [disclaimer and affiliate disclosure](/disclaimer) for details.

## Why book through Viator?

Viator is a Tripadvisor company and one of the largest marketplaces for tours and activities in the world. When you book through our links you get secure checkout, real traveler reviews, 24/7 customer support from Viator and, on many experiences, free cancellation up to 24 hours before the start time.

## Get in touch

We love hearing from readers, locals and tour operators. If you have a question, a tip or a correction, please [contact us](/contact). Ready to start planning? Browse every experience on [Book Now](/book-now) or read our latest [Orlando travel guides](/blog).
`;

export default function AboutPage() {
  return (
    <TextPage
      title="About ThingsToDoOrlando.com"
      intro="An independent guide to the best tours, events and attractions in Orlando, Florida."
      path="/about"
      crumb="About"
      body={body}
    />
  );
}
