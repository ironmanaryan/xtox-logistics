// Appends any visible string not yet in lib/i18n-source.json (including strings
// that happen to match a component-dictionary value, because some pages render
// those literally). Existing ids stay stable.
import fs from "node:fs";

const source = JSON.parse(fs.readFileSync("lib/i18n-source.json", "utf8"));
const known = new Set(source);

const routes = [
  "/", "/about", "/support", "/drivers", "/packers-movers", "/services/packers-movers",
  "/services/packers-movers/book", "/services/packers-movers/estimate",
  "/services/packers-movers/express", "/services/import-export",
  "/services/import-export/import", "/services/import-export/export",
  "/services/import-export/documents", "/services/sme-transport",
  "/services/sme-transport/on-demand", "/services/sme-transport/contract",
  "/services/sme-transport/estimate", "/services/agri-export",
  "/services/agri-export/mandi-price", "/services/agri-export/govt-docs",
  "/services/agri-export/export-crop", "/resources/articles",
  "/resources/case-studies", "/resources/faq", "/resources/blog", "/blog",
  "/blog/packers-and-movers-cost-india", "/terms", "/privacy", "/refund-policy",
  "/login", "/signup", "/account", "/dashboard", "/driver", "/drivers",
];

const cities = ["bengaluru", "hyderabad", "chennai", "mumbai", "pune", "delhi", "kochi", "coimbatore"];
for (const from of cities) {
  for (const to of cities) {
    if (from !== to) routes.push(`/packers-movers/${from}-to-${to}`);
  }
}

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/")
    .replace(/&mdash;/g, "—")
    .replace(/\s+/g, " ")
    .trim();

const skip = new Set(["EN", "HI", "KN", "XtoX", "FTL", "PTL", "FCL", "LCL", "APEDA", "FSSAI", "IEC", "GST", "POD", "EXIM", "GPS", "OTP", "PDF", "LR", "SMS"]);

const added = [];
for (const route of routes) {
  const res = await fetch("http://localhost:3000" + route);
  if (!res.ok) continue;
  const html = await res.text();
  const body = html.split(/<body[^>]*>/i)[1]?.split(/<\/body>/i)[0] ?? "";
  const clean = body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]*>/g, "\u0001");
  for (const raw of clean.split("\u0001")) {
    const text = decode(raw);
    if (!text || !/[A-Za-z]{2}/.test(text) || known.has(text) || skip.has(text)) continue;
    known.add(text);
    added.push(text);
  }
}

source.push(...added);
fs.writeFileSync("lib/i18n-source.json", JSON.stringify(source));
console.log(`added ${added.length} strings, source now ${source.length}`);
for (let i = 0; i < Math.min(added.length, 40); i++) console.log("+ " + added[i].slice(0, 110));
