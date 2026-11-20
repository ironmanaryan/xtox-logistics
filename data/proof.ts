/**
 * Social proof.
 *
 * HARD RULE: no invented numbers, reviews or client names. Every array below
 * is empty until you have real, verifiable data. Components that read these
 * values hide themselves when the data is missing, so the site never shows a
 * fake statistic.
 *
 * To publish real proof, replace the commented examples with actual figures
 * and quotes (with written permission from the customer).
 */

export interface ProofMetric {
  value: string;
  label: string;
  /** Optional footnote, e.g. "as of Mar 2027". */
  note?: string;
}

export interface ProofTestimonial {
  quote: string;
  name: string;
  company: string;
  initials: string;
  /** Link to the original review, if public. */
  sourceUrl?: string;
}

export interface ProofRating {
  score: string;
  count: string;
  platform: string;
  url: string;
}

export const metrics: ProofMetric[] = [
  // { value: "[REPLACE: real shipment count]", label: "Shipments delivered" },
  // { value: "[REPLACE: verified fleet count]", label: "Fleet partners" },
  // { value: "[REPLACE: states served]", label: "States served" },
  // { value: "[REPLACE: on-time %]", label: "On-time delivery" },
];

export const testimonials: ProofTestimonial[] = [
  // {
  //   quote: "[REPLACE: real customer quote, used with permission]",
  //   name: "[REPLACE: customer name]",
  //   company: "[REPLACE: company / city]",
  //   initials: "AB",
  //   sourceUrl: "[REPLACE: link to review]",
  // },
];

export const clients: string[] = [
  // "[REPLACE: client name — only with written permission]",
];

/** Aggregate review score. Empty score/count hides the badge entirely. */
export const rating: ProofRating | null = null;
