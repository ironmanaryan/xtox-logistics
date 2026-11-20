/**
 * Configurable rate table for the instant estimators.
 *
 * These are internal planning rates, not published tariffs. Update together
 * with the prices quoted by the sales team. Every estimator reads from here.
 */

export const RATES_LAST_UPDATED = "2026-11-20";

export type HomeSize = "1BHK" | "2BHK" | "3BHK" | "Villa" | "Office";

export const packersRates = {
  /** Base handling + packing crew cost by home size (₹, before distance). */
  base: {
    "1BHK": 8000,
    "2BHK": 14000,
    "3BHK": 20000,
    Villa: 32000,
    Office: 26000,
  } satisfies Record<HomeSize, number>,
  /** Share of the base that scales with the move (rest is fixed handling). */
  baseShare: 0.55,
  /** Transport share per km (₹). */
  perKm: 22,
  /** Packing material + labour, as a share of base. */
  packingRate: 0.18,
  /** Transit insurance, as a share of base + transport. */
  insuranceRate: 0.03,
  cityMultiplier: {
    metro: 1.15,
    tier2: 1.0,
    tier3: 0.9,
  },
  gstRate: 0.18,
} as const;

export const smeRates = {
  /** Loading / unloading charges (₹). */
  loading: 800,
  unloading: 800,
  /** Part-load pays a share of the full-truck rate. */
  ptlFactor: 0.6,
  insuranceRate: 0.02,
  gstRate: 0.18,
} as const;

export const estimateDisclaimer =
  "Indicative only, excluding tolls, permits and waiting charges. Final price is confirmed after a free survey.";
