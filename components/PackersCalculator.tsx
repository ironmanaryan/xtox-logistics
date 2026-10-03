"use client";

import { useEffect, useMemo, useState } from "react";

type MoveType = "1BHK" | "2BHK" | "3BHK" | "Villa" | "Office";

const MOVE_BASE: Record<MoveType, number> = {
  "1BHK": 8000,
  "2BHK": 14000,
  "3BHK": 20000,
  Villa: 32000,
  Office: 26000,
};

const CITY_MULTIPLIER: Record<string, number> = {
  metro: 1.15,
  tier2: 1.0,
  tier3: 0.9,
};

export default function PackersCalculator() {
  const [moveType, setMoveType] = useState<MoveType>("2BHK");
  const [cityTier, setCityTier] = useState<keyof typeof CITY_MULTIPLIER>("tier2");
  const [distance, setDistance] = useState("450");
  const [packing, setPacking] = useState(true);
  const [insurance, setInsurance] = useState(true);

  // Pick up the home size chosen in the inquiry bar above (same page).
  useEffect(() => {
    const apply = (v: unknown) => {
      if (typeof v === "string" && v in MOVE_BASE) setMoveType(v as MoveType);
    };
    try {
      apply(sessionStorage.getItem("xtox-move-type"));
    } catch {
      /* ignore */
    }
    const onPick = (e: Event) => apply((e as CustomEvent).detail);
    window.addEventListener("xtox:homesize", onPick);
    return () => window.removeEventListener("xtox:homesize", onPick);
  }, []);

  const estimate = useMemo(() => {
    const dist = Math.max(0, parseFloat(distance) || 0);
    const base = MOVE_BASE[moveType];
    const transport = Math.round(dist * 22); // ₹22/km avg truck cost share
    const packingCharge = packing ? Math.round(base * 0.18) : 0;
    const insuranceCharge = insurance ? Math.round((base + transport) * 0.03) : 0;
    const subtotal = Math.round(
      (base * 0.55 + transport + packingCharge + insuranceCharge) *
        CITY_MULTIPLIER[cityTier]
    );
    return { subtotal, gst: Math.round(subtotal * 0.18), total: Math.round(subtotal * 1.18) };
  }, [moveType, cityTier, distance, packing, insurance]);

  return (
    <div className="card p-6 sm:p-8">
      <p className="eyebrow">Instant estimate</p>
      <h3 className="mt-2 text-2xl font-extrabold">Moving cost calculator</h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <span className="label">Moving type</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MOVE_BASE) as MoveType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMoveType(t)}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                  moveType === t
                    ? "border-brand-black bg-brand-black text-white"
                    : "border-line bg-white text-brand-black hover:border-brand-black"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Destination city</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCityTier("metro")}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                cityTier === "metro" ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
              }`}
            >
              Metro
            </button>
            <button
              type="button"
              onClick={() => setCityTier("tier2")}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                cityTier === "tier2" ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
              }`}
            >
              Tier-2
            </button>
            <button
              type="button"
              onClick={() => setCityTier("tier3")}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                cityTier === "tier3" ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
              }`}
            >
              Tier-3
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="pc-dist" className="label">Distance (km)</label>
          <input
            id="pc-dist"
            type="number"
            min="1"
            className="input"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-center gap-2 pt-1">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={packing}
              onChange={(e) => setPacking(e.target.checked)}
              className="h-4 w-4 accent-[#111111]"
            />
            Full packing service
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={insurance}
              onChange={(e) => setInsurance(e.target.checked)}
              className="h-4 w-4 accent-[#111111]"
            />
            Transit insurance
          </label>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-neutral-50 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Estimate (excl. GST)</span>
          <span className="font-bold">₹{estimate.subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-muted">GST @18%</span>
          <span className="font-bold">₹{estimate.gst.toLocaleString("en-IN")}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-sm font-bold uppercase tracking-wide">Total estimate</span>
          <span className="text-2xl font-extrabold">
            ₹{estimate.total.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">
          Indicative only. Final price after free survey.
        </p>
      </div>
    </div>
  );
}
