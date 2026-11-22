// Reuses the existing hand-written component dictionary for strings that were
// appended to the auto-translate source, so UI copy stays consistent.
import fs from "node:fs";

const src = JSON.parse(fs.readFileSync("lib/i18n-source.json", "utf8"));

const text = fs.readFileSync("lib/i18n.ts", "utf8").replace(/\r/g, "");
function section(startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start + startMarker.length);
  return text.slice(start, end);
}
function parse(body) {
  const out = {};
  const re = /"([\w.]+)":\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(body))) {
    out[m[1]] = m[2].replace(/\\n/g, "\n").replace(/\\"/g, '"');
  }
  return out;
}

const en = parse(section("const en = {", "} as const;"));
const hi = parse(section("const hi: Record<TKey, string> = {", "};"));
const kn = parse(section("const kn: Record<TKey, string> = {", "};"));

const generatedFile = "lib/i18n-translations/900-generated.json";
const generated = JSON.parse(fs.readFileSync(generatedFile, "utf8"));

const have = new Set();
for (const file of fs.readdirSync("lib/i18n-translations")) {
  if (!file.endsWith(".json") || file === "900-generated.json") continue;
  for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync("lib/i18n-translations/" + file, "utf8")))) {
    if (v.hi && v.kn) have.add(Number(id));
  }
}
for (const [id, v] of Object.entries(generated)) {
  if (v.hi && v.kn) have.add(Number(id));
}

const missing = src.map((_, i) => i).filter((i) => !have.has(i));
let mapped = 0;
for (const id of missing) {
  const key = Object.keys(en).find((k) => en[k] === src[id]);
  if (key && hi[key] && kn[key]) {
    generated[id] = { hi: hi[key], kn: kn[key] };
    mapped++;
  }
}

fs.writeFileSync(generatedFile, JSON.stringify(generated, null, 1));
console.log(`mapped ${mapped} of ${missing.length} missing strings from the component dictionary`);
console.log(`still missing: ${missing.length - mapped}`);
