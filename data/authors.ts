/**
 * Site authors. To publish under a real person, add their entry here
 * (name, role, bio, photo in /public/authors, social links) and set
 * DEFAULT_AUTHOR to their slug. Posts can also set `author` individually.
 */
export interface Author {
  slug: string;
  name: string;
  /** "Person" for a named writer, "Organization" for the team profile. */
  kind: "Person" | "Organization";
  role: string;
  /** One-sentence summary used in bylines and author boxes. */
  shortBio: string;
  /** Full bio, one paragraph per entry. */
  bio: string[];
  photo: string;
  expertise: string[];
  location?: string;
  social?: { label: string; url: string }[];
}

export const authors: Author[] = [
  {
    slug: "editorial-team",
    name: "ThingsToDoOrlando.com Editorial Team",
    kind: "Organization",
    role: "Orlando travel editors",
    shortBio: "We research Orlando tours, attractions and events so travelers and locals can plan with confidence.",
    bio: [
      "The ThingsToDoOrlando.com editorial team researches and ranks the best things to do in Orlando, Florida, from theme parks and dinner shows to airboat rides, springs and day trips.",
      "Our guides combine official attraction information with verified traveler ratings and live pricing from Viator, and we update our rankings every time we refresh our data. We write for first-time visitors, returning families and locals looking for something new.",
      "Every recommendation is independent. We may earn a commission when you book, but that never changes what we recommend or how we rank it.",
    ],
    photo: "/logo-mark.svg",
    expertise: ["Orlando theme parks", "Tours and attractions", "Family travel", "Day trips from Orlando", "Events and seasonal planning"],
    location: "Orlando, Florida",
  },
];

export const DEFAULT_AUTHOR = "editorial-team";
