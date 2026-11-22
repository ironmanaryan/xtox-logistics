"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";
import { useAuthUserId } from "@/lib/use-auth-user";
import FormConsent from "@/components/FormConsent";

type HomeSize = "1BHK" | "2BHK" | "3BHK" | "Villa" | "Office";

const HOME_SIZES: HomeSize[] = ["1BHK", "2BHK", "3BHK", "Villa", "Office"];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Accepts common Indian formats: 9876543210, +91 98765 43210, 098765-43210. */
function validIndianPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "").replace(/^(91|0)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

export default function PackersQuoteForm() {
  const userId = useAuthUserId();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [date, setDate] = useState("");
  const [homeSize, setHomeSize] = useState<HomeSize>("2BHK");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !pickup.trim() || !drop.trim() || !date) {
      setError("Please fill your name, pickup, drop and shifting date.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validIndianPhone(phone)) {
      setPhoneError("Enter a valid 10-digit mobile number (e.g. 98765 43210).");
      return;
    }
    setPhoneError(null);
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
          userId,
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
          Thanks {name.split(" ")[0]}! Your {homeSize} move from {pickup} to {drop} is with our
          move desk. An executive will call <strong className="text-brand-black">{phone}</strong>{" "}
          within 2 business hours for a quick video survey, then share your fixed price.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/services/packers-movers/estimate" className="btn-secondary">
            <ClipboardList className="h-4 w-4" aria-hidden />
            See how pricing works
          </Link>
          <button type="button" onClick={() => setSubmitted(false)} className="btn-primary">
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={step === 1 ? goToStep2 : onSubmit} className="card p-6 sm:p-8" noValidate>
      <div className="flex items-center gap-3">
        {[1, 2].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                step >= n ? "bg-brand-black text-white" : "bg-neutral-100 text-muted"
              }`}
              aria-hidden
            >
              {n}
            </span>
            <span className={`h-1 flex-1 rounded-full ${step >= n ? "bg-brand-black" : "bg-neutral-100"}`} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">
        {step === 1 ? "Step 1 of 2 · Your move" : "Step 2 of 2 · Contact details"}
      </p>

      {step === 1 ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="pq-name" className="label">Full name</label>
              <input id="pq-name" required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravi Sharma" autoComplete="name" />
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

          <div className="mt-5">
            <span className="label">Home / office size</span>
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
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary mt-6 w-full !py-3.5">
            Continue <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Your price is shared after the free survey — no generic starting rates.
          </p>
        </>
      ) : (
        <>
          <div className="mt-4 rounded-2xl border border-line bg-neutral-50 px-4 py-3 text-xs font-semibold text-muted">
            {homeSize} · {pickup} → {drop} · {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>

          <div className="mt-4">
            <label htmlFor="pq-phone" className="label">Phone number</label>
            <input
              id="pq-phone"
              required
              type="tel"
              inputMode="numeric"
              className="input"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setPhoneError(null); }}
              placeholder="+91 98765 43210"
              autoComplete="tel"
            />
            {phoneError && <p className="mt-1 text-xs font-medium text-red-600">{phoneError}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="pq-details" className="label">Anything else? (optional)</label>
            <textarea id="pq-details" rows={3} className="input" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. 2 beds, fridge, washing machine, 5th floor with lift" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
            {loading ? "Sending…" : <>Get my fixed quote <ArrowRight className="h-4 w-4" aria-hidden /></>}
          </button>
          <button type="button" onClick={() => setStep(1)} className="mt-3 w-full text-xs font-bold text-muted hover:text-brand-black">
            ← Edit move details
          </button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            No spam, no OTP. Our team responds within 2 business hours.
          </p>
        </>
      )}

      <FormConsent
        id="pq-consent"
        className="mt-4"
        note="I consent to a free survey call and service updates on call, SMS or WhatsApp."
      />
    </form>
  );
}
