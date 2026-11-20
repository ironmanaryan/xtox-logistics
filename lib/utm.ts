"use client";

/** Marketing attribution: first touch is kept for the session. */

const STORAGE_KEY = "xtox-utm";
const FIELDS = ["source", "medium", "campaign", "term", "content"] as const;

export interface Utm {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

const KEY_MAP: Record<string, (typeof FIELDS)[number]> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_term: "term",
  utm_content: "content",
};

export function captureUtm(): Utm {
  if (typeof window === "undefined") return {};

  let stored: Utm = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const found: Utm = {};
  for (const [param, key] of Object.entries(KEY_MAP)) {
    const value = params.get(param);
    if (value) found[key] = value.slice(0, 120);
  }

  if (Object.keys(found).length > 0) {
    const merged = { ...stored, ...found };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      /* ignore */
    }
    return merged;
  }

  // Fall back to the external referrer when no UTM tags are present.
  if (!stored.source && document.referrer) {
    try {
      const ref = new URL(document.referrer);
      if (ref.origin !== window.location.origin) {
        stored = { ...stored, source: ref.hostname.replace(/^www\./, "").slice(0, 120) };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      }
    } catch {
      /* ignore */
    }
  }

  return stored;
}
