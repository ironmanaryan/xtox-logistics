"use client";

import { useState } from "react";
import { services } from "@/data/services";

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    service: services[0].name,
    from: "",
    to: "",
    details: "",
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quote", {
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
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-2xl">
          ✅
        </span>
        <h3 className="mt-4 text-xl font-extrabold">Request received!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Our logistics desk will call you within 2 business hours with a
          tailored quote for {form.service}.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-secondary mt-6"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name" className="label">Full name</label>
          <input id="q-name" required className="input" value={form.name} onChange={set("name")} placeholder="Ravi Sharma" />
        </div>
        <div>
          <label htmlFor="q-company" className="label">Company</label>
          <input id="q-company" className="input" value={form.company} onChange={set("company")} placeholder="Sharma Textiles Pvt Ltd" />
        </div>
        <div>
          <label htmlFor="q-service" className="label">Service needed</label>
          <select id="q-service" className="input" value={form.service} onChange={set("service")}>
            {services.map((s) => (
              <option key={s.key} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="q-phone" className="label">Phone</label>
          <input id="q-phone" required type="tel" pattern="[0-9+\\-\\s]{8,15}" className="input" placeholder="+91 98765 43210" />
        </div>
        <div>
          <label htmlFor="q-from" className="label">From (city)</label>
          <input id="q-from" required className="input" value={form.from} onChange={set("from")} placeholder="Surat" />
        </div>
        <div>
          <label htmlFor="q-to" className="label">To (city / port)</label>
          <input id="q-to" required className="input" value={form.to} onChange={set("to")} placeholder="JNPT Port, Mumbai" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="q-details" className="label">Cargo details</label>
        <textarea id="q-details" rows={3} className="input" value={form.details} onChange={set("details")} placeholder="e.g. 8 pallets, 4.2 tonnes, needs tail-lift" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60 sm:w-auto">
        {loading ? "Sending…" : "Request Quote →"}
      </button>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-muted">
        No spam. Our team responds within 2 business hours.
      </p>
    </form>
  );
}
