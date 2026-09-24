import Link from "next/link";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with ThingsToDoOrlando.com for questions about Orlando tours, partnership inquiries or feedback on our guides.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact ThingsToDoOrlando.com"
        intro="Questions, tips or partnership ideas? Send us a note and our team will get back to you."
        crumbs={[{ name: "Contact", href: "/contact" }]}
      />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container two-col">
          <div>
            <h2>Send us a message</h2>
            <ContactForm />
          </div>
          <aside className="info-box">
            <h2>Call us</h2>
            <p>
              For questions about tours or planning your trip, call{" "}
              <a href={`tel:${site.phone.tel}`}>
                <strong>{site.phone.display}</strong>
              </a>{" "}
              ({site.phone.digits}).
            </p>
            <h2>Before you write</h2>
            <p>
              <strong>Existing bookings:</strong> All bookings are made and managed on Viator. For changes, cancellations
              or refunds, please use the contact details in your Viator confirmation email for the fastest help.
            </p>
            <p>
              <strong>Tour operators:</strong> Want your experience featured? Make sure it is listed on Viator, then tell
              us about it using the form.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Looking for ideas?</strong> Try our <Link href="/book-now">Book Now</Link> page or the{" "}
              <Link href="/blog">travel blog</Link>.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
