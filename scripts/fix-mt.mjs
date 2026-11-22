// Re-translates generated entries that contain protected tokens (emails,
// acronyms, 1BHK, units) or came back unchanged, this time keeping those
// tokens in Latin.
import fs from "node:fs";

const source = JSON.parse(fs.readFileSync("lib/i18n-source.json", "utf8"));
const file = "lib/i18n-translations/900-generated.json";
const generated = JSON.parse(fs.readFileSync(file, "utf8"));

const TOKEN =
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\b\d+BHK\b|\b[A-Z][A-Z0-9&+.'-]{1,}\b|\b\d+(?:\.\d+)?\s?(?:km|kg|ft|MB|GB|%)\b|₹/;

const candidates = Object.keys(generated)
  .map(Number)
  .filter(
    (id) =>
      TOKEN.test(source[id]) ||
      generated[id].hi.trim() === source[id].trim() ||
      generated[id].kn.trim() === source[id].trim()
  );

console.error(`retranslating ${candidates.length}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
  return tokens.some((token) => !out.includes(token)) ? "" : out;
}

async function translate(text, locale) {
  if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(text)) return text;
  if (/^[+\d][\d\s()-]{6,}$/.test(text)) return text;
  const { guarded, tokens } = protect(text.slice(0, 1800));
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" +
    locale +
    "&dt=t&q=" +
    encodeURIComponent(guarded);
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = (data?.[0] ?? []).map((seg) => seg?.[0] ?? "").join("");
      const out = restore(raw, tokens);
      if (out) return out;
      throw new Error("placeholder lost");
    } catch (err) {
      if (attempt === 4) {
        console.error(`FAILED ${locale} :: ${text.slice(0, 50)} :: ${err.message}`);
        return generated[candidates[0]]?.[locale] ?? "";
      }
      await sleep(1000 * (attempt + 1));
    }
  }
  return "";
}

let cursor = 0;
async function worker() {
  while (cursor < candidates.length) {
    const id = candidates[cursor++];
    const text = source[id];
    const [hi, kn] = await Promise.all([translate(text, "hi"), translate(text, "kn")]);
    if (hi && kn) generated[id] = { hi, kn };
    if (cursor % 40 === 0) {
      fs.writeFileSync(file, JSON.stringify(generated, null, 1));
      console.error(`progress ${cursor}/${candidates.length}`);
    }
  }
}

await Promise.all([worker(), worker(), worker()]);
fs.writeFileSync(file, JSON.stringify(generated, null, 1));
console.error("done");
