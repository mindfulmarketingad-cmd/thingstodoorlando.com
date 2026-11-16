import { absoluteUrl, site } from "./site";

export type Crumb = { name: string; href: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/logo.png"),
    sameAs: Object.values(site.social),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone.tel,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    alternateName: site.mainKeyword,
    url: site.url,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function eventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
  officialUrl: string;
  venueName: string;
  locality?: string;
  streetAddress?: string;
  organizer?: string;
  offer?: { low: string; high?: string };
}) {
  const offer = event.offer
    ? event.offer.high
      ? {
          "@type": "AggregateOffer",
          lowPrice: event.offer.low,
          highPrice: event.offer.high,
          priceCurrency: "USD",
          url: event.officialUrl,
          availability: "https://schema.org/InStock",
        }
      : {
          "@type": "Offer",
          price: event.offer.low,
          priceCurrency: "USD",
          url: event.officialUrl,
          availability: "https://schema.org/InStock",
        }
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: event.url,
    location: {
      "@type": "Place",
      name: event.venueName,
      address: {
        "@type": "PostalAddress",
        ...(event.streetAddress ? { streetAddress: event.streetAddress } : {}),
        addressLocality: event.locality || "Orlando",
        addressRegion: "FL",
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer || event.venueName,
      url: event.officialUrl,
    },
    ...(offer ? { offers: offer } : {}),
  };
}

export function itemListSchema(name: string, items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(it.href),
      name: it.name,
    })),
  };
}
