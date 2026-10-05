"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type HomeSize = "1BHK" | "2BHK" | "3BHK" | "Villa" | "Office";

const HOME_SIZES: HomeSize[] = ["1BHK", "2BHK", "3BHK", "Villa", "Office"];

const STARTING_AT: Record<HomeSize, string> = {
  "1BHK": "₹7,499",
  "2BHK": "₹11,999",
  "3BHK": "₹16,999",
  Villa: "₹27,999",
  Office: "₹23,999",
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function PackersQuoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [date, setDate] = useState("");
  const [homeSize, setHomeSize] = useState<HomeSize>("2BHK");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      try {
        sessionStorage.setItem("xtox-move-type", homeSize);
      } catch {
        /* ignore */
      }
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          service: "Packers & Movers",
          phone,
          from: pickup,
          to: drop,
          details: `Shifting date: ${date} | Home size: ${homeSize}${details ? ` | Notes: ${details}` : ""}`,
        }),
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
        <h3 className="mt-4 text-2xl font-extrabold">Request received!</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          Thanks {name.split(" ")[0]}! {homeSize} moves start at{" "}
          <strong className="text-brand-black">{STARTING_AT[homeSize]}</strong>. Our
          executive will call <strong className="text-brand-black">{phone}</strong> within
          2 business hours for a quick video survey to lock your exact price.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/services/packers-movers/estimate" className="btn-primary">
            Detailed estimate <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <button type="button" onClick={() => setSubmitted(false)} className="btn-secondary">
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div>
        <span className="label">Home size</span>
        <div className="flex flex-wrap gap-2">
          {HOME_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setHomeSize(s)}
              aria-pressed={homeSize === s}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                homeSize === s
                  ? "border-brand-black bg-brand-black text-white"
                  : "border-line bg-white text-brand-black hover:border-brand-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">
          {homeSize} moves starting at <strong className="text-brand-black">{STARTING_AT[homeSize]}</strong>
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pq-name" className="label">Full name</label>
          <input id="pq-name" required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravi Sharma" />
        </div>
        <div>
          <label htmlFor="pq-phone" className="label">Phone number</label>
          <input id="pq-phone" required type="tel" pattern="[0-9+\-\s]{8,15}" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
        </div>
        <div>
          <label htmlFor="pq-pickup" className="label">Pickup location</label>
          <input id="pq-pickup" required className="input" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="BTM 2nd Stage, Bengaluru" />
        </div>
        <div>
          <label htmlFor="pq-drop" className="label">Drop location</label>
          <input id="pq-drop" required className="input" value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="HSR Layout, Bengaluru" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pq-date" className="label">Shifting date</label>
          <input id="pq-date" required type="date" min={todayISO()} className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="pq-details" className="label">Anything else? (optional)</label>
        <textarea id="pq-details" rows={3} className="input" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. 2 beds, fridge, washing machine, 5th floor with lift" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
        {loading ? "Sending…" : <>Get my fixed quote <ArrowRight className="h-4 w-4" aria-hidden /></>}
      </button>

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-muted">
        No spam, no OTP. Our team responds within 2 business hours.
      </p>
    </form>
  );
}
