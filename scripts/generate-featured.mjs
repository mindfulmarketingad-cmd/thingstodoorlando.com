/**
 * Generates a branded 1200x630 featured image for every blog post and
 * listicle: category illustration, title and brand mark.
 * Output: public/blog/[slug].jpg. Run with: npm run assets
 */
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync("public/blog", { recursive: true });

function extract(source, eyebrow) {
  const out = [];
  const re = /slug: "([^"]+)",\s*title: "([^"]+)",[\s\S]*?illustration: "([^"]+)"/g;
  let m;
  while ((m = re.exec(source))) out.push({ slug: m[1], title: m[2], illustration: m[3], eyebrow });
  return out;
}

const items = [
  ...extract(readFileSync("lib/listicles.ts", "utf8"), "BEST OF ORLANDO"),
  ...readdirSync("content/posts").flatMap((f) => extract(readFileSync(`content/posts/${f}`, "utf8"), "ORLANDO TRAVEL GUIDE")),
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max) {
      lines.push(line.trim());
      line = word;
    } else line += " " + word;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

const mark = readFileSync("public/logo-mark.svg");

for (const it of items) {
  const art = readFileSync(`public/illustrations/${it.illustration}.svg`);
  const lines = wrap(it.title, 24);
  const size = lines.length > 3 ? 56 : 64;
  const lineH = size * 1.15;
  const top = 315 - ((lines.length - 1) * lineH) / 2 + 10;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0B2545" stop-opacity=".94"/>
      <stop offset=".6" stop-color="#0B2545" stop-opacity=".8"/>
      <stop offset="1" stop-color="#0B2545" stop-opacity=".05"/>
    </linearGradient>
  </defs>
  <image href="data:image/svg+xml;base64,${art.toString("base64")}" x="0" y="-135" width="1200" height="900" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <rect x="72" y="${top - size - 58}" width="${it.eyebrow.length * 14.5 + 40}" height="38" rx="19" fill="#FF6B1A"/>
  <text x="92" y="${top - size - 32}" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="#fff">${it.eyebrow}</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="72" y="${top + i * lineH}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${size}" font-weight="700" fill="#fff">${esc(l)}</text>`,
    )
    .join("")}
  <image href="data:image/svg+xml;base64,${mark.toString("base64")}" x="72" y="534" width="48" height="48"/>
  <text x="134" y="566" font-family="DejaVu Sans, Arial, sans-serif" font-size="24" font-weight="700" fill="#fff">ThingsToDo<tspan fill="#FFA45C">Orlando</tspan>.com</text>
</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(`public/blog/${it.slug}.jpg`);
}
console.log(`Generated ${items.length} featured images.`);
