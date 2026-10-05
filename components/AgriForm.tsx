"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, IndianRupee } from "lucide-react";
import { CROPS, GOVT_DOCS, DEST_COUNTRIES, inr } from "@/data/agri";
import DocPicker, { type PickedDoc } from "@/components/DocPicker";

export default function AgriForm({ mode }: { mode: "export" | "govt-docs" }) {
  const isExport = mode === "export";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [land, setLand] = useState("");

  // export only
  const [cropKey, setCropKey] = useState(CROPS[6].key);
  const [qty, setQty] = useState("100");
  const [readyMonth, setReadyMonth] = useState("");
  const [dest, setDest] = useState(DEST_COUNTRIES[0]);
  const [coldChain, setColdChain] = useState(true);
  const [packHelp, setPackHelp] = useState(true);
  const [labTest, setLabTest] = useState(false);

  // govt-docs only
  const [needed, setNeeded] = useState<string[]>(["iec", "apeda"]);

  const [docs, setDocs] = useState<PickedDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attached, setAttached] = useState(0);

  const crop = CROPS.find((c) => c.key === cropKey) ?? CROPS[0];

  const realization = useMemo(() => {
    if (!isExport) return null;
    const q = Math.max(0, parseFloat(qty) || 0);
    return { mandi: q * crop.mandiPrice, export: q * crop.exportPrice, uplift: q * (crop.exportPrice - crop.mandiPrice) };
  }, [isExport, qty, crop]);

  const toggleNeeded = (k: string) =>
    setNeeded((n) => (n.includes(k) ? n.filter((x) => x !== k) : [...n, k]));

  const uploadDocs = async (docType: string) => {
    try {
      const valid = docs.filter((d) => !d.error && d.blob);
      if (valid.length === 0) return 0;
      const fd = new FormData();
      fd.append("ref", phone.trim());
      fd.append("docType", docType);
      for (const d of valid) fd.append("files", d.blob as Blob, d.name);
      const up = await fetch("/api/documents", { method: "POST", body: fd });
      const ud = await up.json().catch(() => null);
      if (up.ok && ud?.ok && Array.isArray(ud.files)) return ud.files.length as number;
    } catch {
      /* optional — ignore */
    }
    return 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const service = isExport ? "Agri Export (Crop)" : "Agri Export (Govt. Docs)";
      const details = isExport
        ? `Farm: ${village}, ${district}, ${state} | Land: ${land} acres | Crop: ${crop.name} | Qty: ${qty} ${crop.unit} | Ready: ${readyMonth} | Buyer market: ${dest} | Cold-chain: ${coldChain ? "yes" : "no"} | Pack-house help: ${packHelp ? "yes" : "no"} | Lab test: ${labTest ? "yes" : "no"}${realization ? ` | Indicative export realization: ${inr(realization.export)}` : ""}`
        : `Farm: ${village}, ${district}, ${state} | Land: ${land} acres | Docs needed: ${needed.map((k) => GOVT_DOCS.find((d) => d.key === k)?.name ?? k).join(", ") || "general guidance"}`;

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          service,
          phone,
          from: `${village}, ${district}`,
          to: isExport ? dest : "APEDA / DGFT filing",
          details,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong");

      setAttached(await uploadDocs(isExport ? "Agri Export — Farm & Crop Docs" : "Agri Export — Govt. Doc Support"));
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
          {isExport ? "Export request received!" : "Document help request received!"}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {isExport ? (
            <>
              Dhanyavaad {name.split(" ")[0]}! {realization && <>Aapki {qty} {crop.unit} par indicative export value{" "}
              <strong className="text-brand-black">{inr(realization.export)}</strong> (mandi se{" "}
              <strong className="text-green-700">+{inr(realization.uplift)}</strong> zyada). </>}
              Hamaare agri-expert <strong className="text-brand-black">{phone}</strong> par 2 business hours me call karenge.
            </>
          ) : (
            <>
              Dhanyavaad {name.split(" ")[0]}! Hamaare APEDA mitra{" "}
              <strong className="text-brand-black">{phone}</strong> par call karke{" "}
              {needed.length > 0 ? `${needed.length} document` : "paperwork"} ki poori process samjhayenge — sarkari fees ke alawa koi hidden charge nahi.
            </>
          )}
        </p>
        {attached > 0 && (
          <p className="mt-2 text-sm font-bold text-green-700">{attached} document{attached === 1 ? "" : "s"} attached ✓</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {isExport && (
            <Link href="/services/agri-export/mandi-price" className="btn-primary">
              Compare mandi prices <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          <button type="button" onClick={() => setSubmitted(false)} className="btn-secondary">
            New request
          </button>
        </div>
      </div>
    );
  }

  const idp = (s: string) => `ag-${mode}-${s}`;

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      {/* farmer */}
      <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-muted">Farmer details</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={idp("name")} className="label">Your name</label>
          <input id={idp("name")} required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravi Patil" />
        </div>
        <div>
          <label htmlFor={idp("phone")} className="label">Mobile number</label>
          <input id={idp("phone")} required type="tel" pattern="[0-9+\-\s]{8,15}" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" />
        </div>
        <div>
          <label htmlFor={idp("village")} className="label">Village / Town</label>
          <input id={idp("village")} required className="input" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Lasalgaon" />
        </div>
        <div>
          <label htmlFor={idp("district")} className="label">District</label>
          <input id={idp("district")} required className="input" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Nashik" />
        </div>
        <div>
          <label htmlFor={idp("state")} className="label">State</label>
          <input id={idp("state")} required className="input" value={state} onChange={(e) => setState(e.target.value)} />
        </div>
        <div>
          <label htmlFor={idp("land")} className="label">Land holding (acres)</label>
          <input id={idp("land")} type="number" min="0" step="0.5" className="input" value={land} onChange={(e) => setLand(e.target.value)} placeholder="5" />
        </div>
      </div>

      {isExport ? (
        <>
          <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">Crop &amp; buyer</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={idp("crop")} className="label">Crop</label>
              <select id={idp("crop")} className="input" value={cropKey} onChange={(e) => { setCropKey(e.target.value); const c = CROPS.find((x) => x.key === e.target.value); if (c) setColdChain(c.coldChain); }}>
                {CROPS.map((c) => <option key={c.key} value={c.key}>{c.name} — {c.unit}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={idp("qty")} className="label">Quantity ({crop.unit}s)</label>
              <input id={idp("qty")} required type="number" min="1" className="input" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div>
              <label htmlFor={idp("ready")} className="label">Harvest / ready month</label>
              <input id={idp("ready")} className="input" value={readyMonth} onChange={(e) => setReadyMonth(e.target.value)} placeholder={`e.g. ${crop.season}`} />
            </div>
            <div>
              <label htmlFor={idp("dest")} className="label">Target market</label>
              <select id={idp("dest")} className="input" value={dest} onChange={(e) => setDest(e.target.value)}>
                {DEST_COUNTRIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {realization && (
            <div className="mt-4 grid gap-2 rounded-2xl border border-line bg-neutral-50 p-4 text-sm sm:grid-cols-3">
              <div><p className="text-xs text-muted">Mandi value</p><p className="text-lg font-extrabold">{inr(realization.mandi)}</p></div>
              <div><p className="text-xs text-muted">Export value</p><p className="text-lg font-extrabold">{inr(realization.export)}</p></div>
              <div className="rounded-xl bg-brand-yellow/50 p-2"><p className="flex items-center gap-1 text-xs font-bold"><IndianRupee className="h-3.5 w-3.5" aria-hidden /> Extra you earn</p><p className="text-lg font-extrabold text-green-700">+{inr(realization.uplift)}</p></div>
            </div>
          )}

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { k: "cold", t: "Cold-chain", v: coldChain, set: setColdChain },
              { k: "pack", t: "Pack-house help", v: packHelp, set: setPackHelp },
              { k: "lab", t: "Residue lab test", v: labTest, set: setLabTest },
            ].map(({ k, t, v, set }) => (
              <label key={k} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line p-3 text-sm font-semibold">
                <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} className="h-4 w-4 accent-[#111111]" />
                {t}
              </label>
            ))}
          </div>
          {crop.coldChain && (
            <p className="mt-2 text-xs font-medium text-muted">❄ {crop.name} needs cold-chain — reefer from farm gate is auto-included in your plan.</p>
          )}
        </>
      ) : (
        <>
          <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted">Which government documents do you need?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {GOVT_DOCS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => toggleNeeded(d.key)}
                aria-pressed={needed.includes(d.key)}
                className={`rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                  needed.includes(d.key) ? "border-brand-black bg-brand-yellow/25" : "border-line bg-white hover:border-brand-black"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-extrabold">
                  <CheckCircle2 className={`h-4 w-4 ${needed.includes(d.key) ? "text-green-600" : "text-neutral-300"}`} aria-hidden />
                  {d.name}
                </span>
                <span className="mt-1 block text-xs text-muted">{d.desc}</span>
                <span className="mt-1 block text-[11px] font-bold text-muted">Issued by: {d.who}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mt-5">
        <span className="label">
          {isExport ? "Upload crop / farm photos (optional)" : "Upload Aadhaar, PAN, 7/12 or land papers (optional)"}
        </span>
        <DocPicker
          id={idp("docs")}
          files={docs}
          onChange={setDocs}
          maxFiles={5}
          hint="Photos auto-compress under 2 MB. Speeds up verification."
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
        {loading ? "Sending…" : <>{isExport ? "Start my export" : "Get document help"} <ArrowRight className="h-4 w-4" aria-hidden /></>}
      </button>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}
      <p className="mt-3 text-xs text-muted">Koi advance nahi. Pehli call bilkul free hai.</p>
    </form>
  );
}
