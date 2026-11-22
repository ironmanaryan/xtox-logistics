// Compiles lib/i18n-source.json + lib/i18n-translations/*.json into one phrase
// table per language. The client loads only the table for the chosen language.
// Run: node scripts/build-auto-i18n.mjs
import fs from "node:fs";
import path from "node:path";

const source = JSON.parse(fs.readFileSync("lib/i18n-source.json", "utf8"));
const dir = "lib/i18n-translations";
fs.mkdirSync(dir, { recursive: true });

// Machine-generated batch first, then hand-written overrides win.
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .sort((a, b) => {
    const generated = (name) => (name.startsWith("9") ? 0 : 1);
    return generated(a) - generated(b) || a.localeCompare(b);
  });
const merged = {};
for (const file of files) {
  const part = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  for (const [id, value] of Object.entries(part)) {
    const index = Number(id);
    if (!Number.isInteger(index) || index < 0 || index >= source.length) continue;
    if (!value?.hi || !value?.kn) continue;
    merged[index] = value;
  }
}

function writeFile(locale) {
  const lines = Object.keys(merged)
    .map(Number)
    .sort((a, b) => a - b)
    .map((id) => `  ${JSON.stringify(source[id])}: ${JSON.stringify(merged[id][locale])},`);
  const out = `// GENERATED FILE — edit lib/i18n-translations/*.json and run
// \`node scripts/build-auto-i18n.mjs\`. Do not edit by hand.
export const phrases: Record<string, string> = {
${lines.join("\n")}
};
`;
  fs.writeFileSync(`lib/auto-phrases-${locale}.ts`, out);
  return lines.length;
}

const hi = writeFile("hi");
const kn = writeFile("kn");
console.error(`translated ${hi} hi / ${kn} kn of ${source.length} phrases`);
