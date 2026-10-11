"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { services } from "@/data/services";
import { useAuthUserId } from "@/lib/use-auth-user";

function validIndianPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "").replace(/^(91|0)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

export default function QuoteForm() {
  const userId = useAuthUserId();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    service: services[0].name,
    phone: "",
    from: "",
    to: "",
    details: "",
  });

  // Hero booking card se prefill (same-tab CustomEvent + reload-proof storage)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("xtox-quote-prefill");
      if (saved) {
        const p = JSON.parse(saved);
        setForm((f) => ({
          ...f,
          from: p.from ?? f.from,
          to: p.to ?? f.to,
          service: p.service ?? f.service,
        }));
      }
    } catch {
      /* ignore */
    }
    const onPrefill = (e: Event) => {
      const p = (e as CustomEvent).detail ?? {};
      setForm((f) => ({
        ...f,
        from: p.from ?? f.from,
        to: p.to ?? f.to,
        service: p.service ?? f.service,
      }));
    };
    window.addEventListener("xtox:quote-prefill", onPrefill);
    return () => window.removeEventListener("xtox:quote-prefill", onPrefill);
  }, []);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validIndianPhone(form.phone)) {
      setPhoneError("Sahi 10-digit mobile number likho (e.g. 98765 43210).");
      return;
    }
    setPhoneError(null);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
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
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-4 text-xl font-extrabold">Ho gaya! Request mil gayi 🎉</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          <strong className="text-brand-black">Hum 2 ghante me call karenge</strong> {form.service} ke
          best route, vehicle aur price ke saath. Phone paas rakhna!
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-secondary mt-6"
        >
          Ek aur request bhejo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name" className="label">Full name</label>
          <input id="q-name" required className="input" value={form.name} onChange={set("name")} placeholder="Ravi Sharma" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="q-phone" className="label">Phone</label>
          <div className="relative">
            <span aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">+91</span>
            <input
              id="q-phone"
              required
              type="tel"
              inputMode="numeric"
              className="input !pl-12"
              value={form.phone}
              onChange={(e) => { set("phone")(e); setPhoneError(null); }}
              placeholder="98765 43210"
              autoComplete="tel"
            />
          </div>
          {phoneError && <p className="mt-1 text-xs font-medium text-red-600">{phoneError}</p>}
        </div>
        <div>
          <label htmlFor="q-service" className="label">Service needed</label>
          <select id="q-service" className="input" value={form.service} onChange={set("service")}>
            {services.map((s) => (
              <option key={s.key} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="q-from" className="label">From</label>
            <input id="q-from" required className="input" value={form.from} onChange={set("from")} placeholder="Surat" />
          </div>
          <div>
            <label htmlFor="q-to" className="label">To</label>
            <input id="q-to" required className="input" value={form.to} onChange={set("to")} placeholder="Mumbai" />
          </div>
        </div>
      </div>

      <details className="group mt-4">
        <summary className="cursor-pointer text-sm font-bold text-muted hover:text-brand-black">
          + Company / cargo details <span className="font-normal">(optional)</span>
        </summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="q-company" className="label">Company</label>
            <input id="q-company" className="input" value={form.company} onChange={set("company")} placeholder="Sharma Textiles Pvt Ltd" />
          </div>
          <div>
            <label htmlFor="q-details" className="label">Cargo details</label>
            <input id="q-details" className="input" value={form.details} onChange={set("details")} placeholder="e.g. 8 pallets, 4.2 tonnes" />
          </div>
        </div>
      </details>

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full !py-4 !text-base disabled:opacity-60">
        {loading ? "Sending…" : "Get My Free Quote →"}
      </button>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <p className="mt-3 text-center text-xs text-muted">
        No spam. Hum 2 business hours me call karenge.
      </p>
    </form>
  );
}
