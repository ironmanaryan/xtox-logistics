"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Snowflake, TrendingUp } from "lucide-react";
import { CROPS, inr } from "@/data/agri";

export default function MandiPriceWidget() {
  const [cropKey, setCropKey] = useState(CROPS[6].key);
  const crop = CROPS.find((c) => c.key === cropKey) ?? CROPS[0];
  const upliftPct = Math.round(((crop.exportPrice - crop.mandiPrice) / crop.mandiPrice) * 100);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line bg-neutral-50/70 p-5 sm:p-6">
        <p className="eyebrow">Mandi vs export</p>
        <h3 className="mt-2 text-xl font-extrabold sm:text-2xl">Where does your crop earn more?</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {CROPS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCropKey(c.key)}
              aria-pressed={cropKey === c.key}
              className={`rounded-xl border px-3.5 py-2 text-sm font-bold transition-all duration-200 ${
                cropKey === c.key ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-2xl font-extrabold">{crop.name}</h4>
          {crop.coldChain && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-black px-2.5 py-1 text-[11px] font-bold text-white">
              <Snowflake className="h-3 w-3 text-brand-yellow" aria-hidden /> Cold-chain crop
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-extrabold text-green-800">
            <TrendingUp className="h-3 w-3" aria-hidden /> +{upliftPct}% on export
          </span>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-brand-black text-xs uppercase tracking-wider text-white">
                <th className="px-5 py-3.5 font-bold">Channel</th>
                <th className="px-5 py-3.5 font-bold">Price / {crop.unit}</th>
                <th className="hidden px-5 py-3.5 font-bold sm:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="px-5 py-3.5 font-semibold">Local mandi</td>
                <td className="px-5 py-3.5 font-extrabold">{inr(crop.mandiPrice)}</td>
                <td className="hidden px-5 py-3.5 text-muted sm:table-cell">After commission &amp; 3–4 middlemen</td>
              </tr>
              <tr className="bg-brand-yellow/20">
                <td className="px-5 py-3.5 font-extrabold">Direct export ✦</td>
                <td className="px-5 py-3.5 font-extrabold">{inr(crop.exportPrice)}</td>
                <td className="hidden px-5 py-3.5 text-muted sm:table-cell">Farm-gate pickup, XtoX handles freight + docs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Top buyer markets</p>
            <p className="mt-1 font-bold">{crop.markets}</p>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Export season</p>
            <p className="mt-1 font-bold">{crop.season}</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted">Indicative Jan-2025 prices. Exact realization depends on grade, season and buyer — confirmed free on call.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/services/agri-export/export-crop" className="btn-primary">
            Export {crop.name} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/services/agri-export/govt-docs" className="btn-secondary">
            APEDA papers help
          </Link>
        </div>
      </div>
    </div>
  );
}
