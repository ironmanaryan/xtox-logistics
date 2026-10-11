"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Package } from "lucide-react";
import { images } from "@/data/images";
import { services } from "@/data/services";

type HeroTab = "price" | "track";

export function prefillQuote(data: { from: string; to: string; service: string }) {
  try {
    sessionStorage.setItem("xtox-quote-prefill", JSON.stringify(data));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("xtox:quote-prefill", { detail: data }));
  document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const [tab, setTab] = useState<HeroTab>("price");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [service, setService] = useState(services[0].name);
  const [formError, setFormError] = useState<string | null>(null);

  const [trackingId, setTrackingId] = useState("");
  const [trackMsg, setTrackMsg] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);

  const onGetPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      setFormError("Pickup aur drop city likho taaki sahi price mile.");
      return;
    }
    setFormError(null);
    prefillQuote({ from: from.trim(), to: to.trim(), service });
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setTrackMsg("Please enter a shipment / LR number.");
      return;
    }
    setTracking(true);
    setTrackMsg(null);
    try {
      const res = await fetch(`/api/track?code=${encodeURIComponent(trackingId.trim())}`);
      const data = await res.json();
      if (res.ok && data.ok) {
        const s = data.shipment;
        setTrackMsg(
          `${s.tracking_code} · ${s.status.replace(/_/g, " ")} · ${s.origin} → ${s.destination}${s.current_location ? ` · Now at: ${s.current_location}` : ""}${s.eta_date ? ` · ETA: ${s.eta_date}` : ""}`
        );
      } else {
        setTrackMsg(
          data.error === "Shipment not found"
            ? `No shipment found for “${trackingId.toUpperCase()}”. Double-check the LR number.`
            : data.error || "Tracking lookup failed."
        );
      }
    } catch {
      setTrackMsg("Network error — please try again.");
    } finally {
      setTracking(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      {/* Clean photo background (fast on mobile) */}
      <Image
        src={images.truckHighway.src}
        alt={images.truckHighway.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" aria-hidden />

      <div className="section-pad relative grid items-center gap-10 py-16 lg:grid-cols-[1fr_420px] lg:py-24">
        {/* Left: short powerful heading */}
        <div>
          <span className="chip-yellow animate-fadeUp">Road · Air · Sea · Rail</span>
          <h1
            className="animate-fadeUp mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          >
            Kuch bhi bhejo.
            <br />
            <span className="relative inline-block text-white">
              X se X tak.
              <span aria-hidden className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-brand-yellow" />
            </span>
          </h1>
          <p
            className="animate-fadeUp mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg"
            style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
          >
            Packers, EXIM, SME trucks aur agri-export — one partner, door to door.
          </p>
          <div className="animate-fadeUp mt-6 flex flex-wrap gap-3" style={{ "--reveal-delay": "260ms" } as React.CSSProperties}>
            <a href="#cta" className="btn-yellow-lg">
              Get Quote <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-brand-yellow hover:text-brand-yellow"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Right: booking card */}
        <div className="animate-fadeUp rounded-3xl bg-white p-2 text-brand-black shadow-hero" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
          <div className="flex gap-1 rounded-2xl bg-neutral-100 p-1" role="tablist" aria-label="Booking or tracking">
            {(
              [
                { key: "price", label: "Get Price" },
                { key: "track", label: "Track" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  tab === t.key ? "bg-white text-brand-black shadow-sm" : "text-muted hover:text-brand-black"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tab === "price" ? (
              <form onSubmit={onGetPrice} className="grid gap-3">
                <div>
                  <label htmlFor="hero-from" className="label">Pickup city</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                    <input id="hero-from" className="input !pl-10" placeholder="e.g. Surat" value={from} onChange={(e) => setFrom(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label htmlFor="hero-to" className="label">Drop city</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                    <input id="hero-to" className="input !pl-10" placeholder="e.g. Mumbai" value={to} onChange={(e) => setTo(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label htmlFor="hero-service" className="label">Service / Vehicle</label>
                  <select id="hero-service" className="input" value={service} onChange={(e) => setService(e.target.value)}>
                    {services.map((s) => (
                      <option key={s.key} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                {formError && <p className="text-xs font-semibold text-red-600">{formError}</p>}
                <button type="submit" className="btn-primary w-full !py-3.5">
                  Get Price <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <p className="text-center text-xs text-muted">Free quote · 2 ghante me callback</p>
              </form>
            ) : (
              <form onSubmit={handleTrack} className="grid gap-3">
                <div>
                  <label htmlFor="hero-track" className="label">LR / Shipment number</label>
                  <div className="relative">
                    <Package className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                    <input id="hero-track" className="input !pl-10" placeholder="e.g. XTX123456" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
                  </div>
                </div>
                <button type="submit" disabled={tracking} className="btn-primary w-full !py-3.5 disabled:opacity-60">
                  {tracking ? "Checking…" : "Track Shipment"}
                </button>
                {trackMsg && (
                  <p className="rounded-xl border border-line bg-neutral-50 px-4 py-3 text-sm font-medium">{trackMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
