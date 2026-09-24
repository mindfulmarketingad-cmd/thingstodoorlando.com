/**
 * Generates brand assets: logo mark, favicon set, social image and the
 * illustration library used for category tiles, cards and the hero.
 * Run with: npm run assets
 */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const C = {
  navy: "#0B2545",
  deep: "#0B3D91",
  blue: "#1565D8",
  sky: "#5AA9F5",
  pale: "#DCEEFF",
  orange: "#FF6B1A",
  orangeLight: "#FFA45C",
  sun: "#FFC15E",
  sand: "#F7DDB0",
  green: "#1E8A5A",
  greenLight: "#34B37A",
  white: "#FFFFFF",
};

mkdirSync("public/illustrations", { recursive: true });

/* ---------------- Logo mark ---------------- */

const rays = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4 - Math.PI / 2;
  const [x1, y1] = [32 + Math.cos(a) * 17.5, 29 + Math.sin(a) * 17.5];
  const [x2, y2] = [32 + Math.cos(a) * 22, 29 + Math.sin(a) * 22];
  return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`;
}).join("");

const mark = (size = 64) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs><clipPath id="r"><rect width="64" height="64" rx="16"/></clipPath></defs>
  <g clip-path="url(#r)">
    <rect width="64" height="64" fill="${C.blue}"/>
    <g stroke="${C.sun}" stroke-width="3.2" stroke-linecap="round">${rays}</g>
    <circle cx="32" cy="29" r="13" fill="${C.orange}"/>
    <path d="M0 40c6-4.5 10.5-4.5 16 0s10 4.5 16 0 10.5-4.5 16 0 10 4.5 16 0V64H0z" fill="${C.white}"/>
    <path d="M0 50c6-4 10.5-4 16 0s10 4 16 0 10.5-4 16 0 10 4 16 0V64H0z" fill="${C.pale}"/>
  </g>
</svg>`;

writeFileSync("app/icon.svg", mark(64));
writeFileSync("public/logo-mark.svg", mark(64));

async function png(svg, size, out) {
  await sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toFile(out);
}

await png(mark(), 180, "app/apple-icon.png");
await png(mark(), 192, "public/icon-192.png");
await png(mark(), 512, "public/icon-512.png");
await png(mark(), 512, "public/logo.png");

// favicon.ico containing 16, 32 and 48px PNGs.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(
  icoSizes.map((s) => sharp(Buffer.from(mark()), { density: 384 }).resize(s, s).png().toBuffer()),
);
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((buf, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(buf.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += buf.length;
});
writeFileSync("app/favicon.ico", Buffer.concat([header, ...pngs]));

/* ---------------- Illustration helpers ---------------- */

const palm = (x, y, s = 1, flip = false) => {
  const f = flip ? -1 : 1;
  return `<g transform="translate(${x} ${y}) scale(${s * f} ${s})">
    <path d="M0 0c4-60 2-120 14-170" stroke="#7A4E2A" stroke-width="9" fill="none" stroke-linecap="round"/>
    <g fill="${C.green}">
      <path d="M14-170c-30-8-60 4-78 26 26-10 52-12 78-26z"/>
      <path d="M14-170c28-14 60-10 82 8-28-4-56-2-82-8z"/>
      <path d="M14-170c-10-26-36-42-62-44 22 12 40 26 62 44z"/>
      <path d="M14-170c16-24 44-34 70-30-24 6-46 16-70 30z"/>
    </g>
    <g fill="${C.greenLight}">
      <path d="M14-170c-18 10-30 30-34 54 12-20 22-38 34-54z"/>
      <path d="M14-170c20 8 36 26 42 50-14-18-26-36-42-50z"/>
    </g>
  </g>`;
};

const cloud = (x, y, s = 1, o = 0.9) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${C.white}" opacity="${o}"><ellipse cx="0" cy="0" rx="46" ry="18"/><ellipse cx="-22" cy="-10" rx="24" ry="18"/><ellipse cx="16" cy="-16" rx="28" ry="22"/></g>`;

const skyGrad = (id, top, bottom) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`;

const burst = (x, y, r, color) => {
  const lines = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return `<line x1="${x + Math.cos(a) * r * 0.35}" y1="${y + Math.sin(a) * r * 0.35}" x2="${x + Math.cos(a) * r}" y2="${y + Math.sin(a) * r}"/>`;
  }).join("");
  return `<g stroke="${color}" stroke-width="4" stroke-linecap="round">${lines}</g><circle cx="${x}" cy="${y}" r="${r * 0.12}" fill="${color}"/>`;
};

const svg = (w, h, body, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>`;

const W = 800;
const H = 600;

const scenes = {
  space: svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    ${[...Array(28)].map((_, i) => `<circle cx="${(i * 137) % 800}" cy="${(i * 61) % 260}" r="${1 + (i % 3)}" fill="#fff" opacity="${0.4 + (i % 4) * 0.15}"/>`).join("")}
    <circle cx="640" cy="120" r="38" fill="${C.sun}" opacity=".9"/>
    <path d="M0 470 C200 440 600 450 800 470 V600 H0z" fill="${C.deep}"/>
    <rect x="470" y="210" width="18" height="260" fill="#9FB3CF"/>
    <g stroke="#9FB3CF" stroke-width="4">${[240, 290, 340, 390, 440].map((y) => `<line x1="488" y1="${y}" x2="520" y2="${y - 20}"/>`).join("")}</g>
    <g transform="translate(380 150)">
      <path d="M20 0c18 22 26 60 26 110v140H-6V110C-6 60 2 22 20 0z" fill="${C.white}"/>
      <path d="M20 0c10 12 16 28 20 46H0C4 28 10 12 20 0z" fill="${C.orange}"/>
      <rect x="-6" y="150" width="52" height="14" fill="${C.blue}"/>
      <path d="M-6 200l-26 50h26z M46 200l26 50H46z" fill="${C.orange}"/>
      <path d="M0 250h40l-8 70c-6 30-18 30-24 0z" fill="${C.sun}"/>
      <path d="M8 250h24l-6 44c-4 16-8 16-12 0z" fill="${C.white}"/>
    </g>
    <g fill="#fff" opacity=".9"><ellipse cx="330" cy="480" rx="90" ry="40"/><ellipse cx="460" cy="490" rx="110" ry="44"/><ellipse cx="400" cy="460" rx="70" ry="40"/></g>
    <path d="M0 540 C220 520 560 530 800 545 V600 H0z" fill="${C.navy}"/>`,
    skyGrad("g", "#0B2545", "#FF8A3D"),
  ),

  wildlife: svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    <circle cx="610" cy="140" r="54" fill="${C.sun}"/>
    ${cloud(180, 110, 1.2)}${cloud(470, 80, 0.8, 0.7)}
    <path d="M0 330 C180 300 360 320 520 305 S760 300 800 310 V360 H0z" fill="${C.green}"/>
    <rect y="350" width="800" height="250" fill="#3E8FD6"/>
    <g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"><path d="M60 420h90M300 470h130M560 430h110M180 540h90M600 540h120"/></g>
    <g fill="${C.greenLight}">${[40, 120, 700, 760].map((x) => `<path d="M${x} 360 l-14 -80 l18 70 l6 -90 l6 90 l18 -70 l-14 80z"/>`).join("")}</g>
    <g transform="translate(140 390)">
      <path d="M0 40 h230 l-20 26 H14z" fill="${C.white}"/>
      <rect x="10" y="30" width="210" height="12" fill="${C.orange}"/>
      <rect x="60" y="0" width="70" height="30" rx="4" fill="${C.deep}"/>
      <circle cx="210" cy="-10" r="44" fill="none" stroke="${C.navy}" stroke-width="6"/>
      <path d="M210 -54v88M166 -10h88" stroke="${C.navy}" stroke-width="3"/>
      <rect x="200" y="20" width="10" height="20" fill="${C.navy}"/>
    </g>
    <g transform="translate(470 470)">
      <path d="M0 10 C40 -12 150 -16 230 -2 C200 10 120 14 0 16z" fill="#2F6B3A"/>
      <path d="M0 10 C30 0 60 -6 90 -6 v8 C60 6 30 10 0 16z" fill="#244F2C"/>
      <circle cx="150" cy="-10" r="9" fill="#2F6B3A"/><circle cx="178" cy="-8" r="9" fill="#2F6B3A"/>
      <circle cx="151" cy="-12" r="3.5" fill="${C.sun}"/><circle cx="179" cy="-10" r="3.5" fill="${C.sun}"/>
      ${[20, 50, 80, 110].map((x) => `<path d="M${x} -2 l6 -10 l6 10z" fill="#244F2C"/>`).join("")}
    </g>
    <g transform="translate(640 250)" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"><path d="M0 0 q20 -14 40 0 q20 -14 40 0"/></g>`,
    skyGrad("g", "#8CC8FF", "#EAF5FF"),
  ),

  "theme-parks": svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    ${burst(160, 130, 70, C.sun)}${burst(640, 110, 60, C.orangeLight)}${burst(520, 200, 40, "#fff")}
    <path d="M40 470 C120 180 260 180 330 470" fill="none" stroke="${C.orange}" stroke-width="10"/>
    <path d="M40 470 C120 180 260 180 330 470" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 14"/>
    <circle cx="185" cy="330" r="80" fill="none" stroke="${C.orange}" stroke-width="10"/>
    <g fill="${C.white}">
      <rect x="430" y="300" width="220" height="200"/>
      <rect x="410" y="250" width="50" height="250"/><rect x="620" y="250" width="50" height="250"/>
      <rect x="505" y="200" width="70" height="300"/>
    </g>
    <g fill="${C.blue}">
      <path d="M405 250l30-60 30 60z"/><path d="M615 250l30-60 30 60z"/><path d="M500 200l40-90 40 90z"/>
    </g>
    <path d="M515 500v-70a25 25 0 0 1 50 0v70z" fill="${C.deep}"/>
    ${[450, 590, 470, 630].map((x, i) => `<rect x="${x}" y="${330 + (i % 2) * 60}" width="18" height="26" rx="9" fill="${C.sky}"/>`).join("")}
    <path d="M0 500 H800 V600 H0z" fill="${C.deep}"/>
    ${palm(730, 520, 0.9, true)}`,
    skyGrad("g", "#1B3F8F", "#FF9A52"),
  ),

  "dinner-shows": svg(
    W,
    H,
    `<rect width="800" height="600" fill="${C.navy}"/>
    <path d="M230 0 L330 480 H470 L570 0z" fill="#fff" opacity=".08"/>
    <path d="M60 0 L260 480 H340 L180 0z" fill="#fff" opacity=".05"/>
    <path d="M620 0 L460 480 H540 L740 0z" fill="#fff" opacity=".05"/>
    <rect y="470" width="800" height="130" fill="#12346B"/>
    <rect y="460" width="800" height="16" fill="${C.orange}"/>
    <g transform="translate(250 250)">
      <path d="M0 150 h300 l-40 60 H40z" fill="#7A4E2A"/>
      <rect x="145" y="-30" width="10" height="185" fill="#5A381D"/>
      <path d="M155 -20 C230 20 230 110 155 140z" fill="${C.white}"/>
      <path d="M145 0 C90 30 90 100 145 130z" fill="#EAF2FF"/>
      <path d="M155 -30 h50 l-10 12 l10 12 h-50z" fill="${C.orange}"/>
    </g>
    <path d="M0 0 H150 C130 150 120 330 150 470 H0z" fill="${C.orange}"/>
    <path d="M800 0 H650 C670 150 680 330 650 470 H800z" fill="${C.orange}"/>
    <path d="M0 0 H800 V50 C600 80 200 80 0 50z" fill="#E4580E"/>
    <g stroke="#E4580E" stroke-width="3" opacity=".7"><path d="M40 60 C30 200 40 350 50 470M90 60 C80 200 90 350 100 470M760 60 C770 200 760 350 750 470M710 60 C720 200 710 350 700 470"/></g>
    <g transform="translate(330 520)" fill="#fff"><ellipse cx="70" cy="30" rx="120" ry="14" opacity=".9"/><circle cx="20" cy="18" r="14" fill="${C.sun}"/><circle cx="120" cy="18" r="14" fill="${C.sun}"/></g>
    ${[[120, 90], [690, 120], [400, 70]].map(([x, y]) => `<path d="M${x} ${y - 12} l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1z" fill="${C.sun}"/>`).join("")}`,
  ),

  water: svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    ${cloud(620, 90, 1)}
    <path d="M0 260 C140 230 300 250 420 238 S700 230 800 245 V300 H0z" fill="${C.green}"/>
    <rect y="290" width="800" height="310" fill="url(#w)"/>
    <g fill="#2B7A4B">
      <path d="M-20 300 C0 120 120 80 200 110 C260 60 330 90 330 150 C360 170 340 230 300 240 C260 300 60 300 -20 300z"/>
      <path d="M600 300 C610 170 690 130 760 150 C820 140 860 200 820 300z"/>
    </g>
    <g stroke="#B8C9A8" stroke-width="3" opacity=".8"><path d="M90 150v60M130 130v80M170 140v50M250 150v50M700 180v60M740 170v70"/></g>
    <g transform="translate(300 400)">
      <path d="M0 20 C60 40 220 40 280 20 C220 0 60 0 0 20z" fill="${C.orange}"/>
      <circle cx="140" cy="-6" r="14" fill="${C.navy}"/>
      <path d="M126 20 v-18 h28 v18z" fill="${C.blue}"/>
      <path d="M40 -40 L240 60" stroke="${C.navy}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="40" cy="-40" rx="8" ry="18" transform="rotate(-60 40 -40)" fill="${C.sun}"/>
      <ellipse cx="240" cy="60" rx="8" ry="18" transform="rotate(-60 240 60)" fill="${C.sun}"/>
    </g>
    <g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"><path d="M80 360h90M540 380h120M120 520h140M560 530h110"/></g>
    <g transform="translate(610 470)"><rect x="-10" y="6" width="130" height="16" rx="8" fill="#7A4E2A"/><ellipse cx="40" cy="4" rx="24" ry="14" fill="#2F6B3A"/><circle cx="68" cy="2" r="7" fill="#2F6B3A"/></g>`,
    skyGrad("g", "#8CC8FF", "#EAF5FF") + skyGrad("w", "#5BC0EB", "#1565D8"),
  ),

  sky: svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    <circle cx="400" cy="470" r="110" fill="${C.sun}" opacity=".9"/>
    ${cloud(150, 150, 1)}${cloud(650, 200, 0.8, 0.8)}
    <path d="M0 440 C160 400 300 430 420 410 S680 400 800 420 V600 H0z" fill="${C.green}"/>
    <path d="M0 500 C200 480 500 500 800 485 V600 H0z" fill="#3E8FD6"/>
    ${[[250, 170, 1.2, C.orange, C.white], [520, 120, 0.9, C.blue, C.sun], [640, 300, 0.6, C.orangeLight, C.deep]]
      .map(
        ([x, y, s, a, b]) => `<g transform="translate(${x} ${y}) scale(${s})">
        <path d="M0 -90 C60 -90 90 -40 80 10 C70 50 30 80 14 100 H-14 C-30 80 -70 50 -80 10 C-90 -40 -60 -90 0 -90z" fill="${a}"/>
        <path d="M0 -90 C24 -90 36 -40 32 10 C28 50 12 80 6 100 H-6 C-12 80 -28 50 -32 10 C-36 -40 -24 -90 0 -90z" fill="${b}"/>
        <path d="M-14 100 L-12 124 M14 100 L12 124" stroke="${C.navy}" stroke-width="3"/>
        <rect x="-16" y="124" width="32" height="24" rx="4" fill="#7A4E2A"/></g>`,
      )
      .join("")}`,
    skyGrad("g", "#6FB6FF", "#FFD9B0"),
  ),

  family: svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    <circle cx="130" cy="110" r="50" fill="${C.sun}"/>
    ${cloud(420, 90, 1)}${cloud(700, 140, 0.7, 0.8)}
    <g transform="translate(520 290)">
      <circle r="170" fill="none" stroke="${C.white}" stroke-width="12"/>
      <circle r="150" fill="none" stroke="${C.blue}" stroke-width="3"/>
      ${[...Array(12)].map((_, i) => {
        const a = (i * Math.PI) / 6;
        return `<line x1="0" y1="0" x2="${Math.cos(a) * 170}" y2="${Math.sin(a) * 170}" stroke="${C.white}" stroke-width="4"/><rect x="${Math.cos(a) * 170 - 16}" y="${Math.sin(a) * 170 - 4}" width="32" height="26" rx="6" fill="${i % 2 ? C.orange : C.blue}"/>`;
      }).join("")}
      <circle r="18" fill="${C.orange}"/>
      <path d="M-10 0 L-80 300 M10 0 L80 300" stroke="${C.white}" stroke-width="10"/>
    </g>
    <path d="M0 470 C200 440 500 460 800 450 V600 H0z" fill="${C.greenLight}"/>
    <path d="M0 520 C220 505 560 520 800 510 V600 H0z" fill="${C.green}"/>
    ${palm(90, 500, 1.1)}${palm(210, 520, 0.8, true)}
    <g transform="translate(300 180)"><path d="M0 0 c-24 0 -30 36 0 56 c30 -20 24 -56 0 -56z" fill="${C.orange}"/><path d="M0 56 q-6 40 6 90" stroke="${C.navy}" stroke-width="2" fill="none"/></g>
    <g transform="translate(340 220)"><path d="M0 0 c-20 0 -26 30 0 46 c26 -16 20 -46 0 -46z" fill="${C.blue}"/><path d="M0 46 q6 40 -4 80" stroke="${C.navy}" stroke-width="2" fill="none"/></g>`,
    skyGrad("g", "#7CC0FF", "#E7F4FF"),
  ),

  couples: svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    <circle cx="400" cy="330" r="120" fill="${C.sun}"/>
    <rect y="330" width="800" height="270" fill="url(#w)"/>
    <g fill="${C.sun}" opacity=".7">${[360, 390, 420, 450, 480].map((y, i) => `<rect x="${330 + i * 8}" y="${y}" width="${140 - i * 16}" height="6" rx="3"/>`).join("")}</g>
    ${palm(80, 360, 1.3)}${palm(720, 360, 1.1, true)}
    <path d="M0 330 C120 320 200 326 280 330 H0z M520 330 C600 322 700 322 800 330z" fill="${C.navy}" opacity=".6"/>
    <g transform="translate(300 440)">
      <path d="M0 20 C40 50 200 50 240 20 z" fill="${C.white}"/>
      <rect x="20" y="4" width="200" height="16" fill="${C.deep}"/>
      <rect x="60" y="-50" width="120" height="8" fill="${C.deep}"/>
      <path d="M66 -42v46M174 -42v46" stroke="${C.deep}" stroke-width="4"/>
      <circle cx="104" cy="-14" r="12" fill="${C.navy}"/><rect x="94" y="-2" width="20" height="10" fill="${C.navy}"/>
      <circle cx="136" cy="-14" r="12" fill="${C.navy}"/><rect x="126" y="-2" width="20" height="10" fill="${C.navy}"/>
    </g>
    <g stroke="${C.white}" stroke-width="3" fill="none" opacity=".8"><path d="M560 120 q14 -10 28 0 q14 -10 28 0"/><path d="M620 90 q10 -8 20 0 q10 -8 20 0"/></g>`,
    skyGrad("g", "#2D3F8F", "#FF8A3D") + skyGrad("w", "#E56B2E", "#12346B"),
  ),

  "day-trips": svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    <circle cx="660" cy="120" r="48" fill="${C.sun}"/>
    ${cloud(220, 100, 1)}
    <rect y="300" width="800" height="120" fill="#2E9BDB"/>
    <g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"><path d="M60 330h80M300 350h120M560 330h90M200 390h100M620 390h110"/></g>
    <path d="M0 400 C200 380 600 390 800 400 V600 H0z" fill="${C.sand}"/>
    <path d="M0 400 C200 380 600 390 800 400 V412 C600 404 200 396 0 414z" fill="#fff" opacity=".8"/>
    <g transform="translate(560 220)">
      <path d="M0 0 h36 l10 200 h-56z" fill="${C.white}"/>
      <rect x="-6" y="40" width="48" height="22" fill="${C.orange}"/><rect x="-10" y="110" width="56" height="22" fill="${C.orange}"/>
      <rect x="4" y="-26" width="28" height="26" fill="${C.deep}"/><path d="M0 -26 l18 -22 l18 22z" fill="${C.orange}"/>
      <rect x="12" y="-20" width="12" height="14" fill="${C.sun}"/>
    </g>
    <g transform="translate(260 470)">
      <path d="M0 -110 L0 40" stroke="${C.navy}" stroke-width="5"/>
      <path d="M-110 -80 C-80 -150 80 -150 110 -80z" fill="${C.orange}"/>
      <path d="M-40 -80 C-30 -150 30 -150 40 -80z" fill="${C.white}"/>
      <rect x="40" y="10" width="110" height="18" rx="6" fill="${C.blue}"/>
    </g>
    ${palm(90, 520, 1.1)}`,
    skyGrad("g", "#6FB6FF", "#E7F4FF"),
  ),

  "food-and-city": svg(
    W,
    H,
    `<rect width="800" height="600" fill="url(#g)"/>
    <circle cx="140" cy="120" r="40" fill="${C.sun}" opacity=".9"/>
    <g fill="${C.deep}">
      <rect x="120" y="210" width="80" height="200"/><rect x="210" y="150" width="70" height="260"/>
      <rect x="290" y="100" width="90" height="310"/><path d="M290 100 l45 -50 l45 50z"/>
      <rect x="390" y="180" width="70" height="230"/><rect x="470" y="130" width="100" height="280"/>
      <rect x="580" y="220" width="80" height="190"/><rect x="670" y="260" width="70" height="150"/>
    </g>
    <g fill="${C.sun}" opacity=".85">${[...Array(40)].map((_, i) => {
      const cols = [140, 230, 310, 350, 410, 490, 530, 600, 690];
      const x = cols[i % cols.length];
      const y = 160 + ((i * 47) % 220);
      return y > 120 + (i % 3) * 30 ? `<rect x="${x}" y="${y}" width="12" height="16" rx="2"/>` : "";
    }).join("")}</g>
    <rect y="400" width="800" height="200" fill="url(#w)"/>
    <g transform="translate(400 470)">
      <path d="M-60 20 h120 l-20 26 h-80z" fill="${C.white}"/>
      <path d="M-40 20 C-40 -10 40 -10 40 20z" fill="${C.orange}"/>
      <path d="M-28 -6 h56" stroke="${C.white}" stroke-width="4"/>
      <path d="M0 -10 C-10 -60 -40 -80 -70 -90 M0 -10 C10 -60 40 -80 70 -90 M0 -10 V-110" stroke="#BEE3FF" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>
    <g fill="${C.white}"><path d="M130 520 c10 -14 30 -14 34 0 c-6 10 -24 12 -34 0z"/><path d="M160 514 c0 -18 14 -24 18 -16 c-4 6 -10 10 -18 16z"/></g>
    <g fill="${C.white}"><path d="M620 540 c10 -14 30 -14 34 0 c-6 10 -24 12 -34 0z"/><path d="M650 534 c0 -18 14 -24 18 -16 c-4 6 -10 10 -18 16z"/></g>`,
    skyGrad("g", "#1B3F8F", "#FF9A52") + skyGrad("w", "#2E6FC2", "#0B2545"),
  ),
};

for (const [name, content] of Object.entries(scenes)) {
  writeFileSync(`public/illustrations/${name}.svg`, content);
}

/* ---------------- Hero banner ---------------- */

const hero = svg(
  1600,
  720,
  `<rect width="1600" height="720" fill="url(#g)"/>
  ${[...Array(30)].map((_, i) => `<circle cx="${(i * 211) % 1600}" cy="${(i * 53) % 200}" r="${1 + (i % 3)}" fill="#fff" opacity="${0.3 + (i % 4) * 0.12}"/>`).join("")}
  ${burst(260, 150, 80, C.sun)}${burst(1380, 130, 70, C.orangeLight)}${burst(1180, 220, 44, "#fff")}${burst(420, 250, 40, C.orangeLight)}
  <circle cx="800" cy="470" r="150" fill="${C.sun}" opacity=".95"/>
  <g transform="translate(300 180) scale(.8)">
    <path d="M0 -90 C60 -90 90 -40 80 10 C70 50 30 80 14 100 H-14 C-30 80 -70 50 -80 10 C-90 -40 -60 -90 0 -90z" fill="${C.orange}"/>
    <path d="M0 -90 C24 -90 36 -40 32 10 C28 50 12 80 6 100 H-6 C-12 80 -28 50 -32 10 C-36 -40 -24 -90 0 -90z" fill="#fff"/>
    <path d="M-14 100 L-12 124 M14 100 L12 124" stroke="${C.navy}" stroke-width="3"/><rect x="-16" y="124" width="32" height="24" rx="4" fill="#7A4E2A"/>
  </g>
  <g fill="#12346B">
    <rect x="520" y="340" width="70" height="200"/><rect x="600" y="290" width="60" height="250"/>
    <rect x="670" y="250" width="80" height="290"/><path d="M670 250 l40 -46 l40 46z"/>
    <rect x="860" y="300" width="70" height="240"/><rect x="940" y="270" width="90" height="270"/>
    <rect x="1040" y="350" width="70" height="190"/>
  </g>
  <g fill="${C.sun}" opacity=".8">${[...Array(36)].map((_, i) => {
    const cols = [536, 560, 614, 690, 720, 878, 900, 960, 996, 1060];
    return `<rect x="${cols[i % cols.length]}" y="${300 + ((i * 37) % 200)}" width="10" height="14" rx="2"/>`;
  }).join("")}</g>
  <g transform="translate(1250 400)">
    <circle r="130" fill="none" stroke="#fff" stroke-width="9"/>
    ${[...Array(12)].map((_, i) => {
      const a = (i * Math.PI) / 6;
      return `<line x1="0" y1="0" x2="${Math.cos(a) * 130}" y2="${Math.sin(a) * 130}" stroke="#fff" stroke-width="3" opacity=".8"/><rect x="${Math.cos(a) * 130 - 12}" y="${Math.sin(a) * 130 - 3}" width="24" height="20" rx="5" fill="${i % 2 ? C.orange : C.sky}"/>`;
    }).join("")}
    <path d="M-8 0 L-60 180 M8 0 L60 180" stroke="#fff" stroke-width="8"/>
  </g>
  <rect y="540" width="1600" height="180" fill="url(#w)"/>
  <g fill="${C.sun}" opacity=".55">${[560, 590, 620, 650].map((y, i) => `<rect x="${700 + i * 16}" y="${y}" width="${200 - i * 32}" height="6" rx="3"/>`).join("")}</g>
  <g transform="translate(800 610)">
    <path d="M-80 20 h160 l-26 30 h-108z" fill="#fff" opacity=".9"/>
    <path d="M0 10 C-14 -60 -50 -90 -90 -100 M0 10 C14 -60 50 -90 90 -100 M0 10 V-130" stroke="#BEE3FF" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"/>
  </g>
  <path d="M0 540 C150 520 300 530 420 540 z M1180 540 C1300 530 1460 528 1600 540 z" fill="#0B2545"/>
  ${palm(90, 720, 1.6)}${palm(260, 740, 1.2, true)}${palm(1500, 720, 1.5, true)}${palm(1380, 740, 1.1)}`,
  skyGrad("g", "#0E2A66", "#FF8A3D") + skyGrad("w", "#E0702F", "#0B2545"),
);
writeFileSync("public/hero.svg", hero);

/* ---------------- Social share image ---------------- */

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <image href="data:image/svg+xml;base64,${Buffer.from(hero).toString("base64")}" x="-200" y="-45" width="1600" height="720"/>
  <rect width="1200" height="630" fill="#0B2545" opacity=".45"/>
  <image href="data:image/svg+xml;base64,${Buffer.from(mark()).toString("base64")}" x="80" y="80" width="110" height="110"/>
  <text x="80" y="330" font-family="DejaVu Sans, Arial, sans-serif" font-size="78" font-weight="700" fill="#fff">Things To Do In Orlando</text>
  <text x="80" y="400" font-family="DejaVu Sans, Arial, sans-serif" font-size="36" fill="#FFE2C4">Tours, Events &amp; More</text>
  <rect x="80" y="460" width="440" height="64" rx="32" fill="${C.orange}"/>
  <text x="300" y="503" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="28" font-weight="700" fill="#fff">ThingsToDoOrlando.com</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile("app/opengraph-image.png");
await sharp(Buffer.from(og)).png().toFile("app/twitter-image.png");
writeFileSync("app/opengraph-image.alt.txt", "Things To Do In Orlando - Tours, Events and More at ThingsToDoOrlando.com");
writeFileSync("app/twitter-image.alt.txt", "Things To Do In Orlando - Tours, Events and More at ThingsToDoOrlando.com");

console.log("Assets generated.");
