import TextPage from "@/components/TextPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Learn what information ThingsToDoOrlando.com collects, how we use analytics and cookies, how affiliate links work and the choices you have.",
  path: "/privacy",
});

const body = `
This Privacy Policy explains how ThingsToDoOrlando.com ("we", "us" or "our") collects, uses and protects information when you visit our website.

## Information we collect

### Information you provide

If you use our contact form, we collect your name, email address, the topic you choose and your message. We use this information only to respond to you and keep a record of the conversation.

### Information collected automatically

We use **Google Analytics 4** to understand how visitors use our site, such as which pages are viewed, how long visits last, the type of device and browser used and the general region a visit comes from. Google Analytics uses cookies and similar technologies to collect this information. We use it in aggregate to improve our content and do not use it to identify you personally.

Our hosting provider may also record standard server logs, including IP address, browser type and the pages requested, for security and reliability purposes.

## Cookies

Cookies are small text files stored on your device. We use analytics cookies set by Google Analytics. When you click a booking link and visit Viator, Viator may set its own cookies to track the referral and your booking. Those cookies are governed by Viator's privacy policy.

You can block or delete cookies through your browser settings, and you can opt out of Google Analytics using the Google Analytics Opt-out Browser Add-on provided by Google.

## Affiliate links and bookings

When you click a booking link, you leave our site and go to Viator. We do not receive your payment details or booking information. Viator may share limited, non-identifying information with us, such as the fact that a booking was made, so that we can receive our commission. Please review Viator's privacy policy before booking.

## How we use information

- To operate, maintain and improve the website
- To respond to messages you send us
- To understand which content is most helpful
- To detect, prevent and respond to fraud, abuse and security issues

We do not sell your personal information.

## Data retention

Contact form messages are kept only as long as needed to respond and for reasonable record keeping. Analytics data is retained according to our Google Analytics settings.

## Security

We protect our website with HTTPS encryption, strict security headers, input validation and spam protection. No method of transmission over the internet is completely secure, but we take reasonable measures to protect your information.

## Your rights

Depending on where you live, including under the California Consumer Privacy Act and the EU and UK General Data Protection Regulation, you may have the right to access, correct or delete personal information we hold about you, or to object to certain processing. To make a request, please [contact us](/contact).

## Children's privacy

Our site is intended for a general audience and is not directed to children under 13. We do not knowingly collect personal information from children under 13.

## Changes to this policy

We may update this Privacy Policy from time to time. The date at the top of this page shows when it was last updated.

## Contact

If you have questions about this Privacy Policy, please [contact us](/contact). See also our [Terms of Use](/terms) and [Disclaimer](/disclaimer).
`;

export default function PrivacyPage() {
  return (
    <TextPage
      title="Privacy Policy"
      intro="What we collect, why we collect it and the choices you have."
      path="/privacy"
      crumb="Privacy"
      body={body}
      updated="2026-09-24"
    />
  );
}
