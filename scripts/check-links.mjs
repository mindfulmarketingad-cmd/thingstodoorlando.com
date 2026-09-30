// Fails the build when source files link to retired /book-now guide slugs.
// Those slugs only survive as redirects to the "closest" live listing, which is
// often the wrong page; link to the real listing, category or collection instead.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const slugify = (s) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const guides = readFileSync("data/guides.ts", "utf8");
const retired = new Set([...guides.matchAll(/^ {4}title: "([^"]+)"/gm)].map((m) => slugify(m[1])));

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
  });

const problems = [];
for (const file of ["app", "components", "content", "lib", "data"].flatMap(walk)) {
  if (file === join("data", "guides.ts")) continue;
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/\/book-now\/([a-z0-9-]+)/g)) {
    if (retired.has(m[1])) problems.push(`${file}: /book-now/${m[1]}`);
  }
  const feat = src.match(/featuredListings: \[([^\]]*)\]/);
  for (const m of feat ? feat[1].matchAll(/"([a-z0-9-]+)"/g) : []) {
    if (retired.has(m[1])) problems.push(`${file}: featuredListings "${m[1]}"`);
  }
}
if (problems.length) {
  console.error("Links to retired /book-now guide slugs:\n" + problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log(`Link check passed (${retired.size} retired guide slugs).`);
