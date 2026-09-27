"use client";

import { useState } from "react";
import { PartyPopper } from "lucide-react";

const vehicleTypes = [
  "Tata Ace / Mini truck",
  "LCV (Dost / Bolero pickup)",
  "Eicher 14/17 ft",
  "32 ft SXL / MXL",
  "Trailer / Container",
  "Reefer",
];

export default function DriverForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    vehicle: vehicleTypes[0],
    experience: "",
    rc: "",
    license: "",
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
          <PartyPopper className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-4 text-xl font-extrabold">
          Welcome aboard, {form.name.split(" ")[0] || "Partner"}!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Our onboarding team will verify your details within 24 hours and call
          you with your first load offer.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6">
          Register another vehicle
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="d-name" className="label">Full name</label>
          <input id="d-name" required className="input" value={form.name} onChange={set("name")} placeholder="Mohan Patil" />
        </div>
        <div>
          <label htmlFor="d-phone" className="label">Mobile number</label>
          <input id="d-phone" required type="tel" pattern="[0-9+\\-\\s]{10,15}" className="input" value={form.phone} onChange={set("phone")} placeholder="+91 91234 56789" />
        </div>
        <div>
          <label htmlFor="d-city" className="label">Base city</label>
          <input id="d-city" required className="input" value={form.city} onChange={set("city")} placeholder="Nashik" />
        </div>
        <div>
          <label htmlFor="d-vehicle" className="label">Vehicle type</label>
          <select id="d-vehicle" className="input" value={form.vehicle} onChange={set("vehicle")}>
            {vehicleTypes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="d-exp" className="label">Driving experience (years)</label>
          <input id="d-exp" required type="number" min="0" max="50" className="input" value={form.experience} onChange={set("experience")} placeholder="8" />
        </div>
        <div>
          <label htmlFor="d-rc" className="label">RC number</label>
          <input id="d-rc" required className="input" value={form.rc} onChange={set("rc")} placeholder="MH 15 AB 1234" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="d-license" className="label">Driving licence number</label>
          <input id="d-license" required className="input" value={form.license} onChange={set("license")} placeholder="MH1420210001234" />
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input required type="checkbox" className="mt-0.5 h-4 w-4 accent-[#111111]" />
        I agree to document verification and consent to be contacted on
        WhatsApp for load offers.
      </label>

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
        {loading ? "Submitting…" : "Submit & Start Earning →"}
      </button>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-muted">
        Documents verified within 24 hrs · Zero onboarding fee
      </p>
    </form>
  );
}
