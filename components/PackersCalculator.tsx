"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { cities, corridorDistance } from "@/data/cities";
import { packersRates, estimateDisclaimer } from "@/data/rates";

type MoveType = keyof typeof packersRates.base;
type Tier = keyof typeof packersRates.cityMultiplier;

const MOVE_BASE = packersRates.base;
const METRO_CITIES = new Set(["bengaluru", "hyderabad", "chennai", "mumbai", "delhi"]);
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function PackersCalculator() {
  const [step, setStep] = useState<1 | 2>(1);
  const [from, setFrom] = useState("bengaluru");
  const [to, setTo] = useState("hyderabad");
  const [moveType, setMoveType] = useState<MoveType>("2BHK");
  const [date, setDate] = useState("");
  const [packing, setPacking] = useState(true);
  const [insurance, setInsurance] = useState(true);
  const [shown, setShown] = useState(false);

  const fromCity = cities.find((c) => c.slug === from) ?? cities[0];
  const toCity = cities.find((c) => c.slug === to) ?? cities[1];

  const km = useMemo(
    () => (fromCity.slug === toCity.slug ? 0 : corridorDistance(fromCity, toCity)),
    [fromCity, toCity]
  );

  const tier: Tier =
    METRO_CITIES.has(fromCity.slug) || METRO_CITIES.has(toCity.slug) ? "metro" : "tier2";

  const estimate = useMemo(() => {
    const base = MOVE_BASE[moveType];
    const transport = Math.round(km * packersRates.perKm);
    const packingCharge = packing ? Math.round(base * packersRates.packingRate) : 0;
    const insuranceCharge = insurance
      ? Math.round((base + transport) * packersRates.insuranceRate)
      : 0;
    const subtotal = Math.round(
      (base * packersRates.baseShare + transport + packingCharge + insuranceCharge) *
        packersRates.cityMultiplier[tier]
    );
    return {
      subtotal,
      gst: Math.round(subtotal * packersRates.gstRate),
      total: Math.round(subtotal * (1 + packersRates.gstRate)),
    };
  }, [moveType, km, packing, insurance, tier]);

  const reset = () => {
    setShown(false);
    setStep(1);
  };

  return (
    <div className="card p-6 sm:p-8">
      <p className="eyebrow">
        {shown ? "Your estimate" : step === 1 ? "Step 1 of 2 · Your move" : "Step 2 of 2 · Your requirements"}
      </p>
      <h3 className="mt-2 text-2xl font-extrabold">
        {shown ? "Indicative moving cost" : "Tell us what you are moving"}
      </h3>

      {!shown && step === 1 && (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Pick your route and home size. The price appears only after your requirement is
            clear — never a generic number.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="pc-from" className="label">Moving from</label>
              <select
                id="pc-from"
                className="input"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pc-to" className="label">Moving to</label>
              <select
                id="pc-to"
                className="input"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <span className="label">Home / office size</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(MOVE_BASE) as MoveType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMoveType(t)}
                  aria-pressed={moveType === t}
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

          <div className="mt-5">
            <label htmlFor="pc-date" className="label">Shifting date</label>
            <div className="relative">
              <CalendarDays
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                id="pc-date"
                type="date"
                min={todayISO()}
                className="input !pl-11"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!date}
            className="btn-primary mt-6 w-full disabled:opacity-50"
          >
            Continue <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className="mt-2 text-center text-xs text-muted">
            Choose a shifting date to continue.
          </p>
        </>
      )}

      {!shown && step === 2 && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {fromCity.name} → {toCity.name}
              {km > 0 ? ` · ~${km.toLocaleString("en-IN")} km` : " · within city"}
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1.5">{moveType}</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1.5">
              {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            Add the services you need for this move. Your estimate uses this route and home
            size.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={packing}
                onChange={(e) => setPacking(e.target.checked)}
                className="h-4 w-4 accent-[#111111]"
              />
              Full packing &amp; unpacking service
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={insurance}
                onChange={(e) => setInsurance(e.target.checked)}
                className="h-4 w-4 accent-[#111111]"
              />
              Transit insurance at declared value
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={reset} className="btn-secondary sm:w-32">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back
            </button>
            <button type="button" onClick={() => setShown(true)} className="btn-primary flex-1">
              Show my estimate <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </>
      )}

      {shown && (
        <>
          <div className="mt-4 rounded-2xl border border-line bg-neutral-50 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Estimate (excl. GST)</span>
              <span className="font-bold">{inr(estimate.subtotal)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="text-muted">GST @18%</span>
              <span className="font-bold">{inr(estimate.gst)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="text-sm font-bold uppercase tracking-wide">Total estimate</span>
              <span className="text-2xl font-extrabold">{inr(estimate.total)}</span>
            </div>
            <p className="mt-2 text-xs text-muted">{estimateDisclaimer}</p>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={reset} className="btn-secondary sm:w-32">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Edit
            </button>
            <Link href="/services/packers-movers/book" className="btn-primary flex-1">
              Get my fixed quote <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
