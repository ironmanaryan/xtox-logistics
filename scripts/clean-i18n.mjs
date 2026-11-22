// Repairs machine-translated contact details and codes that the translator
// transliterated (emails, URLs, phone numbers, all-caps codes).
import fs from "node:fs";

const source = JSON.parse(fs.readFileSync("lib/i18n-source.json", "utf8"));
const dir = "lib/i18n-translations";
let fixed = 0;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const path = `${dir}/${file}`;
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  for (const [id, value] of Object.entries(data)) {
    const en = source[Number(id)];
    if (!en) continue;
    let changed = false;
    for (const locale of ["hi", "kn"]) {
      let text = value[locale];
      if (!text) continue;
      const before = text;

      // Emails and URLs must stay verbatim.
      const emails = en.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? [];
      for (const email of emails) {
        if (text.includes(email)) continue;
        text = text.replace(/\S*@\S+/, email);
        if (!text.includes(email)) text += ` ${email}`;
      }
      const urls = en.match(/https?:\/\/\S+/g) ?? [];
      for (const url of urls) {
        if (text.includes(url)) continue;
        if (/https?:/.test(text)) text = text.replace(/https?:\/\/\S+/, url);
        else text += ` ${url}`;
      }

      // A string that is only a code or an address should not be "translated".
      if (/^(?:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|[A-Z0-9][A-Z0-9&+.'\/-]{1,}|\d+BHK)$/.test(en)) {
        text = en;
      }

      if (text !== before) {
        value[locale] = text;
        changed = true;
      }
    }
    if (changed) fixed++;
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 1));
}

console.log(`cleaned ${fixed} entries`);
