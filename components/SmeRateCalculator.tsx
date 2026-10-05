"use client";

import { useMemo, useState } from "react";
import { TRUCKS } from "@/data/fleet";

const LOADING = 800;
const UNLOADING = 800;
const INSURANCE_RATE = 0.02;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function SmeRateCalculator() {
  const [truckKey, setTruckKey] = useState(TRUCKS[3].key);
  const [distance, setDistance] = useState("600");
  const [loadType, setLoadType] = useState<"FTL" | "PTL">("FTL");
  const [loading, setLoading] = useState(false);
  const [unloading, setUnloading] = useState(false);
  const [insurance, setInsurance] = useState(true);

  const truck = TRUCKS.find((t) => t.key === truckKey) ?? TRUCKS[0];

  const r = useMemo(() => {
    const km = Math.max(0, parseFloat(distance) || 0);
    const freight = Math.round((truck.base + km * truck.perKm) * (loadType === "PTL" ? 0.6 : 1));
    const handling = (loading ? LOADING : 0) + (unloading ? UNLOADING : 0);
    const subtotal = freight + handling;
    const ins = insurance ? Math.round(subtotal * INSURANCE_RATE) : 0;
    const preGst = subtotal + ins;
    const gst = Math.round(preGst * 0.18);
    return { km, freight, handling, ins, gst, total: preGst + gst, perKm: km > 0 ? Math.round((preGst + gst) / km) : 0 };
  }, [truck, distance, loadType, loading, unloading, insurance]);

  return (
    <div className="card p-6 sm:p-8">
      <p className="eyebrow">Instant rates</p>
      <h3 className="mt-2 text-2xl font-extrabold">Freight rate calculator</h3>

      <div className="mt-5">
        <span className="label">Truck</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {TRUCKS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTruckKey(t.key)}
              aria-pressed={truckKey === t.key}
              className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
                truckKey === t.key ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
              }`}
            >
              <span className="block text-sm font-extrabold">{t.name}</span>
              <span className={`block text-xs ${truckKey === t.key ? "text-white/70" : "text-muted"}`}>{t.capacity}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sme-dist" className="label">Distance (km, one side)</label>
          <input id="sme-dist" type="number" min="1" className="input" value={distance} onChange={(e) => setDistance(e.target.value)} />
        </div>
        <div>
          <span className="label">Load type</span>
          <div className="grid grid-cols-2 gap-2">
            {(["FTL", "PTL"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLoadType(l)}
                aria-pressed={loadType === l}
                className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                  loadType === l ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
                }`}
              >
                {l === "FTL" ? "Full truck" : "Part-load"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} className="h-4 w-4 accent-[#111111]" />
          Loading (+{inr(LOADING)})
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <input type="checkbox" checked={unloading} onChange={(e) => setUnloading(e.target.checked)} className="h-4 w-4 accent-[#111111]" />
          Unloading (+{inr(UNLOADING)})
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} className="h-4 w-4 accent-[#111111]" />
          Transit insurance (+2%)
        </label>
      </div>

      <div className="mt-6 space-y-2 rounded-2xl border border-line bg-neutral-50 p-5 text-sm">
        <div className="flex justify-between"><span className="text-muted">Freight ({truck.name}, {r.km} km, {loadType})</span><span className="font-bold">{inr(r.freight)}</span></div>
        {r.handling > 0 && <div className="flex justify-between"><span className="text-muted">Handling</span><span className="font-bold">{inr(r.handling)}</span></div>}
        {r.ins > 0 && <div className="flex justify-between"><span className="text-muted">Insurance</span><span className="font-bold">{inr(r.ins)}</span></div>}
        <div className="flex justify-between"><span className="text-muted">GST @18%</span><span className="font-bold">{inr(r.gst)}</span></div>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="text-sm font-bold uppercase tracking-wide">Total estimate</span>
          <span className="text-2xl font-extrabold">{inr(r.total)}</span>
        </div>
        <p className="text-xs text-muted">≈ {inr(r.perKm)}/km all-in. Contract lanes get locked rates below this.</p>
      </div>
    </div>
  );
}
