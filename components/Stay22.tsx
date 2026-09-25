import Script from "next/script";

/** Stay22 Let Me Allez: turns outbound hotel and travel links into affiliate links. */
export default function Stay22() {
  return (
    <Script id="stay22-lma" strategy="afterInteractive">
      {`(function (s, t, a, y, twenty, two) {
  s.Stay22 = s.Stay22 || {};
  s.Stay22.params = { lmaID: '6ab6bb69e763c704484293f1' };
  twenty = t.createElement(a);
  two = t.getElementsByTagName(a)[0];
  twenty.async = 1;
  twenty.src = y;
  two.parentNode.insertBefore(twenty, two);
})(window, document, 'script', 'https://scripts.stay22.com/letmeallez.js');`}
    </Script>
  );
}
