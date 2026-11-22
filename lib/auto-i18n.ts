import type { Locale } from "./i18n";

/**
 * Site-wide phrase lookup.
 *
 * Keys are the exact English text that appears on the page (whitespace
 * normalised, trimmed). Every route — including server-rendered pages such as
 * legal policies, blog posts and city corridors — is translated by the
 * <AutoTranslate> client component using these tables, so the language switch
 * changes the whole site and not just the homepage.
 */
export type PhraseTable = Record<string, string>;

export function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Translate one text node. Returns the original string when the table has no
 * match, so untranslated copy degrades to readable English instead of breaking
 * the layout.
 */
export function translateText(
  text: string,
  table: PhraseTable | null,
  locale: Locale = "en"
): string {
  if (locale === "en" || !table) return text;

  const lead = text.match(/^\s*/)?.[0] ?? "";
  const trail = text.match(/\s*$/)?.[0] ?? "";
  const core = normalize(text);
  if (!core) return text;

  const translated = table[core];
  return translated ? `${lead}${translated}${trail}` : text;
}
