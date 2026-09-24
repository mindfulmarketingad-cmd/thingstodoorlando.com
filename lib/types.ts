export type CategoryKey =
  | "theme-parks"
  | "space"
  | "wildlife"
  | "dinner-shows"
  | "water"
  | "sky"
  | "family"
  | "couples"
  | "day-trips"
  | "food-and-dining"
  | "drinks-and-nightlife"
  | "relaxation"
  | "sports"
  | "shopping"
  | "sightseeing";

export type IllustrationKey =
  | "theme-parks"
  | "space"
  | "wildlife"
  | "dinner-shows"
  | "water"
  | "sky"
  | "family"
  | "couples"
  | "day-trips"
  | "food-and-city";

export interface ListingImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface Listing {
  slug: string;
  source: "viator" | "guide";
  productCode?: string;
  title: string;
  summary: string;
  description: string;
  image?: ListingImage;
  /** Largest available photo, for wide tiles and heroes (not sent to the browser list API). */
  imageLarge?: ListingImage;
  illustration: IllustrationKey;
  rating?: number;
  reviewCount?: number;
  priceFrom?: number;
  currency: string;
  durationMinutes?: number;
  durationLabel?: string;
  location: string;
  categories: CategoryKey[];
  freeCancellation?: boolean;
  bookingUrl: string;
  highlights?: string[];
  goodToKnow?: string[];
  bestFor?: string;
  /** Viator tag names (activity and quality tags) from the snapshot. */
  tags?: string[];
  /** Search term used to pull related live tours for a guide listing. */
  searchTerm?: string;
}

export interface ListingDetail extends Listing {
  inclusions?: string[];
  exclusions?: string[];
  additionalInfo?: string[];
  cancellationPolicy?: string;
  meetingPoint?: string;
  gallery?: ListingImage[];
}
