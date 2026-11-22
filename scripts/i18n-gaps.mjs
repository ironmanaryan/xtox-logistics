// Reports visible English strings that neither the component dictionary nor
// the auto-translate table covers. Run: node scripts/i18n-gaps.mjs
import fs from "node:fs";

const known = new Set(JSON.parse(fs.readFileSync("lib/i18n-source.json", "utf8")));
const src = fs.readFileSync("lib/i18n.ts", "utf8");
const block = src.slice(src.indexOf("const en = {"), src.indexOf("} as const;"));
for (const m of block.matchAll(/"[^"]+":\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)) {
  known.add(m[1].replace(/\\"/g, '"').replace(/\s+/g, " ").trim());
}

const routes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/", "/about", "/support", "/drivers", "/packers-movers",
      "/packers-movers/delhi-to-bengaluru", "/services/packers-movers",
      "/services/packers-movers/book", "/services/packers-movers/estimate",
      "/services/packers-movers/express", "/services/import-export",
      "/services/import-export/import", "/services/import-export/export",
      "/services/import-export/documents", "/services/sme-transport",
      "/services/sme-transport/on-demand", "/services/sme-transport/contract",
      "/services/sme-transport/estimate", "/services/agri-export",
      "/services/agri-export/mandi-price", "/services/agri-export/govt-docs",
      "/services/agri-export/export-crop", "/resources/articles",
      "/resources/case-studies", "/resources/faq", "/resources/blog", "/blog",
      "/blog/packers-and-movers-cost-india", "/terms", "/privacy",
      "/refund-policy", "/login", "/signup",
    ];

const decode = (s) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const all = new Map();
for (const route of routes) {
  const res = await fetch("http://localhost:3000" + route);
  const html = await res.text();
  const body = html.split(/<body[^>]*>/i)[1]?.split(/<\/body>/i)[0] ?? "";
  const clean = body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]*>/g, "\u0001");
  for (const raw of clean.split("\u0001")) {
    const text = decode(raw);
    if (!text || !/[A-Za-z]{2}/.test(text) || known.has(text)) continue;
    if (!all.has(text)) all.set(text, new Set());
    all.get(text).add(route);
  }
}

console.log(`unmatched unique: ${all.size}`);
for (const [text, rs] of all) console.log(`--- ${text}   [${[...rs].join(",")}]`);
