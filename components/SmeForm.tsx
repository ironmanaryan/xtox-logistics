"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, IndianRupee } from "lucide-react";
import { TRUCKS, GOODS_CATEGORIES } from "@/data/fleet";

const LOADING_HELP = 800;
const INSURANCE_RATE = 0.02;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function SmeForm({ mode }: { mode: "on-demand" | "contract" }) {
  const onDemand = mode === "on-demand";

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goods, setGoods] = useState(GOODS_CATEGORIES[0]);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  // on-demand only
  const [distance, setDistance] = useState("250");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [truckKey, setTruckKey] = useState(TRUCKS[1].key);
  const [loadType, setLoadType] = useState<"FTL" | "PTL">("FTL");
  const [loadingHelp, setLoadingHelp] = useState(false);
  const [insurance, setInsurance] = useState(false);

  // contract only
  const [trips, setTrips] = useState("3–4 trips / week");
  const [months, setMonths] = useState("6 months");
  const [trucksPerTrip, setTrucksPerTrip] = useState("1");
  const [billing, setBilling] = useState("Monthly");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const truck = TRUCKS.find((t) => t.key === truckKey) ?? TRUCKS[0];

  const estimate = useMemo(() => {
    if (!onDemand) return null;
    const km = Math.max(0, parseFloat(distance) || 0);
    const fare = Math.round((truck.base + km * truck.perKm) * (loadType === "PTL" ? 0.6 : 1));
    const help = loadingHelp ? LOADING_HELP : 0;
    const subtotal = fare + help;
    const ins = insurance ? Math.round(subtotal * INSURANCE_RATE) : 0;
    const preGst = subtotal + ins;
    const gst = Math.round(preGst * 0.18);
    return { km, fare, help, ins, gst, total: preGst + gst };
  }, [onDemand, distance, truck, loadType, loadingHelp, insurance]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const service = onDemand ? "SME Transport (On-Demand)" : "SME Transport (Contract)";
      const details = onDemand
        ? `Goods: ${goods} | Weight: ${weight} kg | Distance: ${distance} km | Date: ${date} ${time} | Truck: ${truck.name} | Load: ${loadType} | Loading help: ${loadingHelp ? "yes" : "no"} | Insurance: ${insurance ? "yes" : "no"}${estimate ? ` | Estimate: ${inr(estimate.total)}` : ""}${notes ? ` | Notes: ${notes}` : ""}${email ? ` | Email: ${email}` : ""}`
        : `Goods: ${goods} | Weight/trip: ${weight} kg | Frequency: ${trips} | Duration: ${months} | Trucks/trip: ${trucksPerTrip} | Billing: ${billing}${notes ? ` | Notes: ${notes}` : ""}${email ? ` | Email: ${email}` : ""}`;

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, service, phone, from: fromCity, to: toCity, details }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card flex flex-col items-center p-8 text-center sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-4 text-2xl font-extrabold">
          {onDemand ? "Truck request received!" : "Contract request received!"}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {onDemand ? (
            <>
              Thanks {name.split(" ")[0]}! {estimate && <>Indicative fare <strong className="text-brand-black">{inr(estimate.total)}</strong>. </>}
              Our dispatcher will confirm vehicle &amp; driver on <strong className="text-brand-black">{phone}</strong> within 2 business hours.
            </>
          ) : (
            <>
              Thanks {name.split(" ")[0]}! Your dedicated account manager will call{" "}
              <strong className="text-brand-black">{phone}</strong> within 2 business hours with locked
              route pricing for {trips} over {months}.
            </>
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onDemand && (
            <Link href="/services/sme-transport/estimate" className="btn-primary">
              Fine-tune rate <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          <button type="button" onClick={() => setSubmitted(false)} className="btn-secondary">
            New request
          </button>
        </div>
      </div>
    );
  }

  const idp = (s: string) => `${onDemand ? "od" : "ct"}-${s}`;

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      {/* business */}
      <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-muted">Business details</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={idp("name")} className="label">Your name</label>
          <input id={idp("name")} required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravi Sharma" />
        </div>
        <div>
          <label htmlFor={idp("company")} className="label">Company name</label>
          <input id={idp("company")} required className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Sharma Textiles Pvt Ltd" />
        </div>
        <div>
          <label htmlFor={idp("phone")} className="label">Phone</label>
          <input id={idp("phone")} required type="tel" pattern="[0-9+\-\s]{8,15}" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
        </div>
        <div>
          <label htmlFor={idp("email")} className="label">Work email (for PODs & bills)</label>
          <input id={idp("email")} type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
      </div>

      {/* goods */}
      <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">Goods</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={idp("goods")} className="label">Goods category</label>
          <select id={idp("goods")} className="input" value={goods} onChange={(e) => setGoods(e.target.value)}>
            {GOODS_CATEGORIES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={idp("weight")} className="label">{onDemand ? "Approx weight (kg)" : "Approx weight per trip (kg)"}</label>
          <input id={idp("weight")} required type="number" min="1" className="input" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="3000" />
        </div>
      </div>

      {/* lane */}
      <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">
        {onDemand ? "Trip lane" : "Contract lane"}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={idp("from")} className="label">Pickup city</label>
          <input id={idp("from")} required className="input" value={fromCity} onChange={(e) => setFromCity(e.target.value)} placeholder="Surat" />
        </div>
        <div>
          <label htmlFor={idp("to")} className="label">Delivery city</label>
          <input id={idp("to")} required className="input" value={toCity} onChange={(e) => setToCity(e.target.value)} placeholder="Mumbai" />
        </div>
      </div>

      {onDemand ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor={idp("dist")} className="label">Distance (km)</label>
              <input id={idp("dist")} type="number" min="1" className="input" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div>
              <label htmlFor={idp("date")} className="label">Date</label>
              <input id={idp("date")} required type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor={idp("time")} className="label">Time</label>
              <input id={idp("time")} type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="mt-4">
            <span className="label">Truck size</span>
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
                  <span className={`block text-xs ${truckKey === t.key ? "text-white/70" : "text-muted"}`}>{t.capacity} • {t.use}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                    {l === "FTL" ? "Full truck" : "Part-load (~40% less)"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
                <input type="checkbox" checked={loadingHelp} onChange={(e) => setLoadingHelp(e.target.checked)} className="h-4 w-4 accent-[#111111]" />
                Loading / unloading help (+{inr(LOADING_HELP)})
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
                <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} className="h-4 w-4 accent-[#111111]" />
                Transit insurance (+2%)
              </label>
            </div>
          </div>

          {estimate && (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-neutral-50 p-4">
              <span className="flex items-center gap-2 text-sm font-bold">
                <IndianRupee className="h-4 w-4" aria-hidden />
                Indicative fare incl. GST
              </span>
              <span className="text-2xl font-extrabold">{inr(estimate.total)}</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={idp("trips")} className="label">Frequency</label>
              <select id={idp("trips")} className="input" value={trips} onChange={(e) => setTrips(e.target.value)}>
                {["1–2 trips / week", "3–4 trips / week", "5–6 trips / week", "Daily"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={idp("months")} className="label">Contract duration</label>
              <select id={idp("months")} className="input" value={months} onChange={(e) => setMonths(e.target.value)}>
                {["1 month", "3 months", "6 months", "12 months"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={idp("trucks")} className="label">Trucks per trip</label>
              <input id={idp("trucks")} type="number" min="1" max="50" className="input" value={trucksPerTrip} onChange={(e) => setTrucksPerTrip(e.target.value)} />
            </div>
            <div>
              <label htmlFor={idp("billing")} className="label">Billing cycle</label>
              <select id={idp("billing")} className="input" value={billing} onChange={(e) => setBilling(e.target.value)}>
                {["Weekly", "Monthly"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-line bg-neutral-50 p-4 text-sm">
            <strong>Every contract includes:</strong>
            <span className="text-muted"> locked rates (no surge) • priority peak-season capacity • named account manager + SLA reports • consolidated billing.</span>
          </div>
        </>
      )}

      <div className="mt-4">
        <label htmlFor={idp("notes")} className="label">Anything else? (optional)</label>
        <textarea id={idp("notes")} rows={2} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. fragile cartons, 2nd floor pickup without lift" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
        {loading ? "Sending…" : <>{onDemand ? "Book my truck" : "Get contract pricing"} <ArrowRight className="h-4 w-4" aria-hidden /></>}
      </button>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}
      <p className="mt-3 text-xs text-muted">Response within 2 business hours. Digital POD &amp; GST invoice on every trip.</p>
    </form>
  );
}
