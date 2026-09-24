import TextPage from "@/components/TextPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Disclaimer & Affiliate Disclosure",
  description:
    "Read the ThingsToDoOrlando.com disclaimer and affiliate disclosure, including how we earn commissions from Viator and the limits of the information on our site.",
  path: "/disclaimer",
});

const body = `
## Affiliate disclosure

ThingsToDoOrlando.com participates in affiliate marketing programs, including the Viator Affiliate Program. When you click a booking link on our site and complete a purchase, we may receive a commission from Viator. **This comes at no additional cost to you**, and the price you pay is the same as booking directly.

In line with the U.S. Federal Trade Commission's guidelines on endorsements, we clearly disclose these relationships. Booking links on our site are marked as sponsored links for search engines. Commissions help us keep our guides free and up to date, but they do not determine which experiences we write about or how we describe them.

## We are not a tour operator or seller

ThingsToDoOrlando.com does not operate tours, sell tickets or process payments. All bookings are completed on Viator's website and are subject to Viator's terms and conditions and privacy policy, as well as the terms of the individual tour operator. Questions about an existing booking, including changes, cancellations and refunds, must be directed to Viator or the operator.

## Accuracy of information

We work hard to keep our content accurate and current. However, prices, availability, schedules, opening hours, inclusions and policies are set by third parties and can change at any time without notice. Prices and ratings displayed on our site are provided by Viator and may be cached for several hours. **Always confirm the final details on the booking page before you pay.**

Our guides are provided for general informational purposes only. They are not professional travel, legal, medical or financial advice. Any reliance you place on the information on this site is at your own risk.

## Trademarks

Names of attractions, theme parks and companies mentioned on this site, including Walt Disney World, Universal Orlando Resort, SeaWorld, LEGOLAND, Kennedy Space Center and Viator, are trademarks of their respective owners. ThingsToDoOrlando.com is an independent website and is not affiliated with, endorsed by or sponsored by any of these companies unless explicitly stated.

## Safety

Many activities involve inherent risks, including water, wildlife, heights and physical exertion. Follow all instructions from operators, respect posted age, height and health requirements, and use your own judgment about what is appropriate for you and your group.

## External links

Our site links to third-party websites that we do not control. We are not responsible for their content, availability or practices.

## Questions

If you have questions about this disclaimer, please [contact us](/contact). See also our [Privacy Policy](/privacy) and [Terms of Use](/terms).
`;

export default function DisclaimerPage() {
  return (
    <TextPage
      title="Disclaimer & Affiliate Disclosure"
      intro="How ThingsToDoOrlando.com is funded and the limits of the information we provide."
      path="/disclaimer"
      crumb="Disclaimer"
      body={body}
      updated="2026-09-24"
    />
  );
}
