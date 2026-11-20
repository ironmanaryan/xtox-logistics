"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { services } from "@/data/services";
import { company } from "@/data/company";
import { useAuthUserId } from "@/lib/use-auth-user";
import { captureUtm } from "@/lib/utm";
import { track } from "@/lib/analytics";
import FormConsent from "@/components/FormConsent";
import { useI18n } from "./LanguageProvider";

function normalisePhone(raw: string): string {
  return raw.replace(/\D/g, "").replace(/^(91|0)/, "");
}

function validIndianPhone(raw: string): boolean {
  return /^[6-9]\d{9}$/.test(normalisePhone(raw));
}

const initialForm = {
  name: "",
  phone: "",
  service: services[0].name,
  from: "",
  to: "",
  company: "",
  details: "",
  email: "",
};

export default function QuoteForm() {
  const { t } = useI18n();
  const userId = useAuthUserId();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState(initialForm);

  // Hero booking card prefill (same-tab CustomEvent + reload-proof storage).
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

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      setErrors((prev) => ({ ...prev, [k]: "" }));
    };

  const validateStep1 = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!validIndianPhone(form.phone))
      next.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!form.from.trim()) next.from = "Pickup city is required.";
    if (!form.to.trim()) next.to = "Drop city is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToStep2 = () => {
    if (!validateStep1()) return;
    track("quote_step_complete", { step: 1, service: form.service });
    setStep(2);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: normalisePhone(form.phone),
          email: form.email || undefined,
          serviceDetails: { source: "homepage_quote_form" },
          page: typeof window !== "undefined" ? window.location.pathname : "/",
          utm: captureUtm(),
          consent: true,
          userId,
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong");
      track("form_submit", { form: "homepage_quote", service: form.service });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const whatsappHref = useMemo(() => {
    const lines = [
      `Hi XtoX, I just submitted a quote request.`,
      `Name: ${form.name}`,
      `Route: ${form.from} to ${form.to}`,
      `Service: ${form.service}`,
    ];
    return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [form]);

  if (submitted) {
    return (
      <div className="card flex flex-col items-center p-8 text-center sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-4 text-xl font-extrabold">{t("quote.successTitle")}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          {t("quote.successBody")}{" "}
          <strong className="text-brand-black">{company.callbackPromise}</strong>{" "}
          on <strong className="text-brand-black">{form.phone}</strong>.
        </p>
        <p className="mt-2 max-w-sm text-xs text-muted">{t("quote.successHint")}</p>
        <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "quote_success" })}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-extrabold text-white"
          >
            {t("quote.whatsapp")}
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setForm(initialForm);
            }}
            className="btn-secondary flex-1"
          >
            {t("quote.another")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8" noValidate>
      {/* Progress */}
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
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted" aria-live="polite">
        {step === 1 ? t("quote.step1") : t("quote.step2")}
      </p>

      {step === 1 ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="q-name" className="label">{t("quote.name")}</label>
              <input
                id="q-name"
                className="input"
                value={form.name}
                onChange={set("name")}
                placeholder="Ravi Sharma"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "q-name-error" : undefined}
              />
              {errors.name && <p id="q-name-error" className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="q-phone" className="label">{t("quote.phone")}</label>
              <div className="relative">
                <span aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">+91</span>
                <input
                  id="q-phone"
                  type="tel"
                  inputMode="numeric"
                  className="input !pl-12"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="98765 43210"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "q-phone-error" : undefined}
                />
              </div>
              {errors.phone && <p id="q-phone-error" className="mt-1 text-xs font-medium text-red-600">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="q-service" className="label">{t("quote.service")}</label>
              <select id="q-service" className="input" value={form.service} onChange={set("service")}>
                {services.map((s) => (
                  <option key={s.key} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="q-from" className="label">{t("quote.from")}</label>
                <input
                  id="q-from"
                  className="input"
                  value={form.from}
                  onChange={set("from")}
                  placeholder="Bengaluru"
                  aria-invalid={Boolean(errors.from)}
                />
                {errors.from && <p className="mt-1 text-xs font-medium text-red-600">{errors.from}</p>}
              </div>
              <div>
                <label htmlFor="q-to" className="label">{t("quote.to")}</label>
                <input
                  id="q-to"
                  className="input"
                  value={form.to}
                  onChange={set("to")}
                  placeholder="Hyderabad"
                  aria-invalid={Boolean(errors.to)}
                />
                {errors.to && <p className="mt-1 text-xs font-medium text-red-600">{errors.to}</p>}
              </div>
            </div>
          </div>

          {/* Honeypot: hidden from people, filled by bots. */}
          <div className="hidden" aria-hidden>
            <label htmlFor="q-website">Website</label>
            <input
              id="q-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <button type="button" onClick={goToStep2} className="btn-primary mt-6 w-full !py-3.5">
            {t("quote.next")} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="q-company" className="label">
                {t("quote.company")} <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="q-company"
                className="input"
                value={form.company}
                onChange={set("company")}
                placeholder="Sharma Textiles Pvt Ltd"
                autoComplete="organization"
              />
            </div>
            <div>
              <label htmlFor="q-email" className="label">
                Email <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="q-email"
                type="email"
                className="input"
                value={form.email}
                onChange={set("email")}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="q-details" className="label">
                {t("quote.details")} <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea
                id="q-details"
                rows={3}
                className="input"
                value={form.details}
                onChange={set("details")}
                placeholder="e.g. 2BHK, 4th floor with lift, shifting on 12 Dec"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary sm:w-32">
              <ArrowLeft className="h-4 w-4" aria-hidden /> {t("quote.back")}
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 !py-3.5 disabled:opacity-60">
              {loading ? "Sending…" : t("quote.submit")}
            </button>
          </div>
        </>
      )}

      <FormConsent
        id="q-consent"
        className="mt-4"
        note="I consent to being contacted by call, SMS or WhatsApp about this request."
      />
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-black" aria-hidden />
        No spam. Your details are used only for this quote.
      </p>
    </form>
  );
}
