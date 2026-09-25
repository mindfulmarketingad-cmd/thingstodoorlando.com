import Script from "next/script";

/** Elfsight Instagram feed of Orlando. The widget script loads lazily after the page is interactive. */
export default function InstagramFeed() {
  return (
    <section className="section instagram-feed" aria-labelledby="insta-title">
      <div className="container">
        <div className="section-head">
          <h2 id="insta-title">Orlando on Instagram</h2>
          <p>The latest from around the City Beautiful.</p>
        </div>
        <div className="elfsight-app-c3ba04a4-fb9f-4bdc-bfb0-d3d5b2b4138d" data-elfsight-app-lazy />
      </div>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
    </section>
  );
}
