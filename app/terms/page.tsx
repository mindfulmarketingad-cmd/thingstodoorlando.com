import TextPage from "@/components/TextPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that govern your use of ThingsToDoOrlando.com, including content, third-party bookings, acceptable use and limitation of liability.",
  path: "/terms",
});

const body = `
Welcome to ThingsToDoOrlando.com. By accessing or using this website, you agree to these Terms of Use. If you do not agree, please do not use the site.

## Use of the site

You may use this website for personal, non-commercial purposes to research and plan activities in the Orlando area. You agree not to:

- Copy, scrape, republish or redistribute our content without written permission
- Use automated systems to access the site in a way that sends more requests than a human could reasonably produce
- Attempt to gain unauthorized access to the site, its servers or related systems
- Interfere with the security or proper working of the site, including introducing malware
- Use the site for any unlawful purpose

## Bookings with third parties

ThingsToDoOrlando.com is an information and referral service. We are not a travel agent, tour operator or ticket seller. When you book an experience, your contract is with Viator and the tour operator, and your booking is governed by their terms, cancellation policies and privacy policies. We are not responsible for the performance, safety, quality or cancellation of any tour, activity or event.

## Content and accuracy

Content on this site is provided for general information only. Prices, ratings, availability and other details are supplied by third parties, may be cached and can change without notice. We do not guarantee that any information is complete, accurate or current. Always verify details on the booking page before purchasing.

## Intellectual property

The design, text, graphics, logo and original content on this website are owned by ThingsToDoOrlando.com and protected by copyright and trademark laws. Images and descriptions of tours provided by Viator remain the property of their respective owners. Third-party trademarks are the property of their owners.

## Affiliate relationships

We earn commissions from some links on this site. See our [Disclaimer & Affiliate Disclosure](/disclaimer) for details.

## Disclaimer of warranties

This website is provided "as is" and "as available" without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement.

## Limitation of liability

To the fullest extent permitted by law, ThingsToDoOrlando.com and its owners will not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss arising from your use of the site or any booking made with a third party.

## Indemnification

You agree to indemnify and hold harmless ThingsToDoOrlando.com from any claims arising from your misuse of the site or violation of these terms.

## Governing law

These terms are governed by the laws of the State of Florida, United States, without regard to its conflict of law provisions.

## Changes to these terms

We may update these Terms of Use at any time. Continued use of the site after changes are posted means you accept the updated terms.

## Contact

Questions about these terms? Please [contact us](/contact).
`;

export default function TermsPage() {
  return (
    <TextPage
      title="Terms of Use"
      intro="The rules for using ThingsToDoOrlando.com."
      path="/terms"
      crumb="Terms"
      body={body}
      updated="2026-09-24"
      hotelLinks={false}
    />
  );
}
