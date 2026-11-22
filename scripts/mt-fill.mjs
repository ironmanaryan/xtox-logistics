// One-time content pass: fills lib/i18n-translations/900-generated.json with
// Hindi + Kannada for every phrase not already translated by hand.
// Results are committed, so the site never calls the API at runtime.
// Run: node scripts/mt-fill.mjs
import fs from "node:fs";
import path from "node:path";

const source = JSON.parse(fs.readFileSync("lib/i18n-source.json", "utf8"));
const dir = "lib/i18n-translations";
const outFile = path.join(dir, "900-generated.json");

const done = new Set();
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  if (file === "900-generated.json") continue;
  for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")))) {
    if (v?.hi && v?.kn) done.add(Number(id));
  }
}

let generated = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, "utf8")) : {};
for (const id of Object.keys(generated)) done.add(Number(id));

const pending = source.map((_, i) => i).filter((i) => !done.has(i));
console.error(`pending: ${pending.length} (already done ${done.size})`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Keep emails, URLs, uppercase abbreviations and 1BHK-style codes in Latin.
function protect(text) {
  const tokens = [];
  const add = (value) => {
    tokens.push(value);
    return `XTOXX${tokens.length - 1}XX`;
  };
  const guarded = text
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, add)
    .replace(/https?:\/\/\S+/g, add)
    .replace(/\b\d+BHK\b/gi, add)
    .replace(/\b[A-Z][A-Z0-9&+.'-]{1,}\b/g, add)
    .replace(/\b\d+(?:\.\d+)?\s?(?:km|kg|ft|MB|GB|%)\b/gi, add)
    .replace(/₹[\d,]+/g, add);
  return { guarded, tokens };
}

function restore(text, tokens) {
  const out = text.replace(/XTOXX\s*(\d+)\s*XX/gi, (_, n) => tokens[Number(n)] ?? "");
  // If a placeholder was lost, fall back to the original English phrase.
  return tokens.some((_, i) => !out.includes(tokens[i])) ? "" : out;
}

async function translate(text, locale) {
  // Strings that must not change at all (emails, phone numbers, codes).
  if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(text)) return text;
  if (/^[+\d][\d\s()-]{6,}$/.test(text)) return text;
  const { guarded, tokens } = protect(text.slice(0, 1800));
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" +
    locale +
    "&dt=t&q=" +
    encodeURIComponent(guarded);
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = (data?.[0] ?? []).map((seg) => seg?.[0] ?? "").join("");
      const out = restore(raw, tokens);
      if (out) return out;
      throw new Error("placeholder lost");
    } catch (err) {
      if (attempt === 3) {
        console.error(`FAILED ${locale} :: ${text.slice(0, 60)} :: ${err.message}`);
        return "";
      }
      await sleep(800 * (attempt + 1));
    }
  }
  return "";
}

let cursor = 0;
let saved = Object.keys(generated).length;

async function worker() {
  while (cursor < pending.length) {
    const id = pending[cursor++];
    const text = source[id];
    const [hi, kn] = await Promise.all([translate(text, "hi"), translate(text, "kn")]);
    await sleep(250);
    if (hi && kn) {
      generated[id] = { hi, kn };
      saved++;
    }
    if (saved % 50 === 0) {
      fs.writeFileSync(outFile, JSON.stringify(generated, null, 1));
      console.error(`saved ${saved} / ${source.length}`);
    }
  }
}

await Promise.all([worker(), worker()]);
fs.writeFileSync(outFile, JSON.stringify(generated, null, 1));
console.error(`finished: ${Object.keys(generated).length} generated entries`);
