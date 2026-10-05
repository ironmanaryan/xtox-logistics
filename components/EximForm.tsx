"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2, MapPin } from "lucide-react";

type Scope = "international" | "domestic";

const INDIA_PORTS = [
  "JNPT / Nhava Sheva (Mumbai)",
  "Mundra (Gujarat)",
  "Chennai",
  "Kolkata / Haldia",
  "Visakhapatnam",
  "Cochin",
  "ICD Tughlakabad (Delhi NCR)",
  "ICD Ahmedabad (Gujarat)",
  "Air Cargo — Mumbai",
  "Air Cargo — Delhi",
];

const INCOTERMS = ["EXW", "FCA", "FOB", "CFR", "CIF", "DAP", "DPU", "DDP"];
const CONTAINER_MODES = ["FCL 20'", "FCL 40'", "LCL (part container)", "Air Cargo"];
const CURRENCIES = ["INR", "USD", "EUR", "AED"];

export default function EximForm({ mode }: { mode: "import" | "export" }) {
  const isImport = mode === "import";
  const [scope, setScope] = useState<Scope>("international");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goods, setGoods] = useState("");
  const [weight, setWeight] = useState("");
  const [packages, setPackages] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("INR");

  // international
  const [country, setCountry] = useState("");
  const [indiaPort, setIndiaPort] = useState(INDIA_PORTS[0]);
  const [foreignPort, setForeignPort] = useState("");
  const [incoterm, setIncoterm] = useState("FOB");
  const [containerMode, setContainerMode] = useState(CONTAINER_MODES[1]);
  const [iec, setIec] = useState("");
  const [readyDate, setReadyDate] = useState("");

  // domestic
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [gstin, setGstin] = useState("");
  const [ewayNeeded, setEwayNeeded] = useState(true);
  const [truckPref, setTruckPref] = useState("Full truck");

  // extras
  const [adCode, setAdCode] = useState(false);
  const [apeda, setApeda] = useState("Need help");
  const [perishable, setPerishable] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const countryLabel = isImport ? "Origin country" : "Destination country";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const intl = scope === "international";
      const service = intl
        ? isImport
          ? "Import Shipment (International)"
          : "Export Shipment (International)"
        : isImport
          ? "Inward Shipment (Domestic)"
          : "Outward Shipment (Domestic)";

      const from = intl
        ? isImport
          ? country
          : indiaPort
        : fromCity;
      const to = intl ? (isImport ? indiaPort : `${country}${foreignPort ? ` (${foreignPort})` : ""}`) : toCity;

      const bits = [
        `Scope: ${intl ? "International" : "Domestic (India)"}`,
        `Goods: ${goods}`,
        `Weight: ${weight} kg | Packages: ${packages} | Value: ${currency} ${value}`,
        intl
          ? `Incoterms: ${incoterm} | Mode: ${containerMode} | IEC: ${iec || "not yet"} | Cargo ready: ${readyDate || "-"}`
          : `GSTIN: ${gstin || "-"} | E-way bill: ${ewayNeeded ? "needed" : "not needed"} | Vehicle: ${truckPref}`,
        isImport ? `AD code registered: ${adCode ? "yes" : "no"}` : `APEDA: ${apeda} | Cold-chain: ${perishable ? "yes" : "no"}`,
        email ? `Email: ${email}` : "",
      ].filter(Boolean);

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, service, phone, from, to, details: bits.join(" | ") }),
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
        <h3 className="mt-4 text-2xl font-extrabold">Shipment request received!</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          Thanks {name.split(" ")[0]}! Our EXIM desk will call{" "}
          <strong className="text-brand-black">{phone}</strong> within 2 business
          hours with HS classification, duty estimate and freight options.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/services/import-export/documents" className="btn-primary">
            Upload documents <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <button type="button" onClick={() => setSubmitted(false)} className="btn-secondary">
            New shipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      {/* scope toggle */}
      <div>
        <span className="label">Shipment scope</span>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { k: "international", icon: Globe2, t: "International", d: "Customs, ports, IEC" },
              { k: "domestic", icon: MapPin, t: "Domestic (India)", d: "Interstate, GST, e-way bill" },
            ] as const
          ).map(({ k, icon: Icon, t, d }) => (
            <button
              key={k}
              type="button"
              onClick={() => setScope(k)}
              aria-pressed={scope === k}
              className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                scope === k ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${scope === k ? "bg-brand-yellow text-brand-black" : "bg-neutral-100 text-brand-black"}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-extrabold">{t}</span>
                <span className={`block text-xs ${scope === k ? "text-white/70" : "text-muted"}`}>{d}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* contact */}
      <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">Contact details</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`ex-name-${mode}`} className="label">Full name</label>
          <input id={`ex-name-${mode}`} required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravi Sharma" />
        </div>
        <div>
          <label htmlFor={`ex-company-${mode}`} className="label">Company</label>
          <input id={`ex-company-${mode}`} className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Sharma Textiles Pvt Ltd" />
        </div>
        <div>
          <label htmlFor={`ex-phone-${mode}`} className="label">Phone</label>
          <input id={`ex-phone-${mode}`} required type="tel" pattern="[0-9+\-\s]{8,15}" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
        </div>
        <div>
          <label htmlFor={`ex-email-${mode}`} className="label">Email (optional)</label>
          <input id={`ex-email-${mode}`} type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
      </div>

      {/* cargo */}
      <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">Cargo details</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`ex-goods-${mode}`} className="label">Goods description</label>
          <input id={`ex-goods-${mode}`} required className="input" value={goods} onChange={(e) => setGoods(e.target.value)} placeholder={isImport ? "e.g. 500 solar panels, HS 8541" : "e.g. 2 MT basmati rice, bagged"} />
        </div>
        <div>
          <label htmlFor={`ex-weight-${mode}`} className="label">Gross weight (kg)</label>
          <input id={`ex-weight-${mode}`} required type="number" min="1" className="input" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="2000" />
        </div>
        <div>
          <label htmlFor={`ex-pkg-${mode}`} className="label">No. of packages</label>
          <input id={`ex-pkg-${mode}`} required type="number" min="1" className="input" value={packages} onChange={(e) => setPackages(e.target.value)} placeholder="40" />
        </div>
        <div>
          <label htmlFor={`ex-value-${mode}`} className="label">Cargo value</label>
          <input id={`ex-value-${mode}`} required type="number" min="1" className="input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="500000" />
        </div>
        <div>
          <label htmlFor={`ex-cur-${mode}`} className="label">Currency</label>
          <select id={`ex-cur-${mode}`} className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* route: international */}
      {scope === "international" && (
        <>
          <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">Route &amp; freight</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`ex-country-${mode}`} className="label">{countryLabel}</label>
              <input id={`ex-country-${mode}`} required className="input" value={country} onChange={(e) => setCountry(e.target.value)} placeholder={isImport ? "China" : "UAE"} />
            </div>
            <div>
              <label htmlFor={`ex-fport-${mode}`} className="label">{isImport ? "Foreign port of loading" : "Foreign port of discharge"}</label>
              <input id={`ex-fport-${mode}`} className="input" value={foreignPort} onChange={(e) => setForeignPort(e.target.value)} placeholder={isImport ? "Shanghai" : "Jebel Ali"} />
            </div>
            <div>
              <label htmlFor={`ex-iport-${mode}`} className="label">{isImport ? "Destination port (India)" : "Origin port (India)"}</label>
              <select id={`ex-iport-${mode}`} className="input" value={indiaPort} onChange={(e) => setIndiaPort(e.target.value)}>
                {INDIA_PORTS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`ex-ready-${mode}`} className="label">Cargo ready date</label>
              <input id={`ex-ready-${mode}`} type="date" className="input" value={readyDate} onChange={(e) => setReadyDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor={`ex-inco-${mode}`} className="label">Incoterms</label>
              <select id={`ex-inco-${mode}`} className="input" value={incoterm} onChange={(e) => setIncoterm(e.target.value)}>
                {INCOTERMS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`ex-mode-${mode}`} className="label">Container mode</label>
              <select id={`ex-mode-${mode}`} className="input" value={containerMode} onChange={(e) => setContainerMode(e.target.value)}>
                {CONTAINER_MODES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`ex-iec-${mode}`} className="label">IEC code (if you have one)</label>
              <input id={`ex-iec-${mode}`} className="input" value={iec} onChange={(e) => setIec(e.target.value)} placeholder="e.g. 1234567890 — leave blank, we'll help you get one" />
            </div>
          </div>
        </>
      )}

      {/* route: domestic */}
      {scope === "domestic" && (
        <>
          <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">Route (within India)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`ex-from-${mode}`} className="label">Pickup city</label>
              <input id={`ex-from-${mode}`} required className="input" value={fromCity} onChange={(e) => setFromCity(e.target.value)} placeholder="Surat" />
            </div>
            <div>
              <label htmlFor={`ex-to-${mode}`} className="label">Delivery city</label>
              <input id={`ex-to-${mode}`} required className="input" value={toCity} onChange={(e) => setToCity(e.target.value)} placeholder="JNPT, Mumbai" />
            </div>
            <div>
              <label htmlFor={`ex-gst-${mode}`} className="label">GSTIN (optional)</label>
              <input id={`ex-gst-${mode}`} className="input" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="24ABCDE1234F1Z5" />
            </div>
            <div>
              <label htmlFor={`ex-truck-${mode}`} className="label">Vehicle preference</label>
              <select id={`ex-truck-${mode}`} className="input" value={truckPref} onChange={(e) => setTruckPref(e.target.value)}>
                {["Part-load (PTL)", "Full truck (FTL)", "Container"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold sm:col-span-2">
              <input type="checkbox" checked={ewayNeeded} onChange={(e) => setEwayNeeded(e.target.checked)} className="h-4 w-4 accent-[#111111]" />
              I need e-way bill generation support
            </label>
          </div>
        </>
      )}

      {/* compliance extras */}
      <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">Compliance help</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {isImport ? (
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 text-sm">
            <input type="checkbox" checked={adCode} onChange={(e) => setAdCode(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#111111]" />
            <span><strong>AD code registered</strong><br /><span className="text-muted">Tick if your bank AD code is already registered at the port.</span></span>
          </label>
        ) : (
          <>
            <label className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-line p-4 text-sm">
              <strong>APEDA registration</strong>
              <select className="input" value={apeda} onChange={(e) => setApeda(e.target.value)}>
                {["Registered", "Applied", "Need help"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 text-sm">
              <input type="checkbox" checked={perishable} onChange={(e) => setPerishable(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#111111]" />
              <span><strong>Perishable / cold-chain</strong><br /><span className="text-muted">Needs reefer container or cold storage handling.</span></span>
            </label>
          </>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
        {loading ? "Sending…" : <>Request {isImport ? "import" : "export"} quote <ArrowRight className="h-4 w-4" aria-hidden /></>}
      </button>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}
      <p className="mt-3 text-xs text-muted">HS classification + duty estimate included. Response within 2 business hours.</p>
    </form>
  );
}
