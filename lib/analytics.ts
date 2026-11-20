/**
 * Conversion event helpers. Every call is a no-op until analytics consent is
 * granted and GA4 / Meta Pixel IDs are configured, so this is safe to import
 * from any client component.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type ConversionEvent =
  | "form_submit"
  | "quote_step_complete"
  | "whatsapp_click"
  | "call_click"
  | "estimate_used";

const META_EVENTS: Partial<Record<ConversionEvent, string>> = {
  form_submit: "Lead",
  whatsapp_click: "Contact",
  call_click: "Contact",
};

export function track(event: ConversionEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", event, params);
  } catch {
    /* analytics must never break the UI */
  }

  try {
    const metaEvent = META_EVENTS[event];
    if (metaEvent) window.fbq?.("track", metaEvent, params);
    else window.fbq?.("trackCustom", event, params);
  } catch {
    /* ignore */
  }
}
