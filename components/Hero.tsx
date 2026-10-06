"use client";

import { useState } from "react";
import { Truck, Package, Calculator, TruckElectric, Ship, Tractor } from "lucide-react";
import { heroMetrics } from "@/data/metrics";
import { images } from "@/data/images";

type Tab = "track" | "rate";

interface RateResult {
  distance: number;
  weight: number;
  total: number;
}

const BASE_RATE_PER_KM = 42; // ₹/km full truck base
const RATE_PER_KG_PER_KM = 0.35; // ₹/kg/km part-load estimate

export default function Hero() {
  const [tab, setTab] = useState<Tab>("track");

  // Track shipment
  const [trackingId, setTrackingId] = useState("");
  const [trackMsg, setTrackMsg] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);

  // Rate calculator
  const [distance, setDistance] = useState("");
  const [weight, setWeight] = useState("");
  const [rate, setRate] = useState<RateResult | null>(null);

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
        setTrackMsg(data.error === "Shipment not found"
          ? `No shipment found for “${trackingId.toUpperCase()}”. Double-check the LR number.`
          : data.error || "Tracking lookup failed.");
      }
    } catch {
      setTrackMsg("Network error — please try again.");
    } finally {
      setTracking(false);
    }
  };

  const handleRate = (e: React.FormEvent) => {
    e.preventDefault();
    const d = Math.max(0, parseFloat(distance) || 0);
    const w = Math.max(0, parseFloat(weight) || 0);
    if (d <= 0 || w <= 0) return;
    const total = Math.round(
      Math.max(2500, d * BASE_RATE_PER_KM * 0.2 + d * w * RATE_PER_KG_PER_KM)
    );
    setRate({ distance: d, weight: w, total });
  };

  return (
    <section className="dot-grid relative overflow-hidden border-b border-line">
      <div className="section-pad relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        {/* Left: headline + tabbed search bar */}
        <div>
          <span className="chip-yellow animate-fadeUp">
            <Truck className="h-3.5 w-3.5" aria-hidden />
            India&apos;s emerging B2B logistics network
          </span>
          <h1 className="animate-fadeUp mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}>
            Logistics that moves
            <br />
            at the speed of{" "}
            <span className="relative inline-block">
              <span className="relative z-10">business.</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow"
              />
            </span>
          </h1>
          <p className="animate-fadeUp mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg" style={{ "--reveal-delay": "180ms" } as React.CSSProperties}>
            Packers &amp; Movers, Import/Export clearance, SME transport and
            farmer-first agri-export — one partner, one dashboard, door to door.
          </p>

          {/* Multi-tab search / tracking bar */}
          <div className="animate-fadeUp card mt-8 max-w-xl p-2" style={{ "--reveal-delay": "270ms" } as React.CSSProperties}>
            <div className="flex gap-1 rounded-xl bg-neutral-100 p-1" role="tablist">
              <button
                role="tab"
                aria-selected={tab === "track"}
                onClick={() => setTab("track")}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  tab === "track"
                    ? "bg-white text-brand-black shadow-sm"
                    : "text-muted hover:text-brand-black"
                }`}
              >
                <Package className="h-4 w-4" aria-hidden />
                Track Shipment
              </button>
              <button
                role="tab"
                aria-selected={tab === "rate"}
                onClick={() => setTab("rate")}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  tab === "rate"
                    ? "bg-white text-brand-black shadow-sm"
                    : "text-muted hover:text-brand-black"
                }`}
              >
                <Calculator className="h-4 w-4" aria-hidden />
                Freight Rate Calculator
              </button>
            </div>

            <div className="p-3">
              {tab === "track" ? (
                <form onSubmit={handleTrack} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    className="input flex-1"
                    placeholder="Enter LR / Shipment number (e.g. XTX123456)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    aria-label="Shipment number"
                  />
                  <button type="submit" disabled={tracking} className="btn-primary sm:w-36 disabled:opacity-60">
                    {tracking ? "Checking…" : "Track"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRate} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    className="input"
                    type="number"
                    min="1"
                    placeholder="Distance (km)"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    aria-label="Distance in kilometres"
                  />
                  <input
                    className="input"
                    type="number"
                    min="1"
                    placeholder="Weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    aria-label="Weight in kilograms"
                  />
                  <button type="submit" className="btn-primary">
                    Estimate
                  </button>
                </form>
              )}

              {tab === "track" && trackMsg && (
                <p className="mt-3 rounded-xl border border-line bg-neutral-50 px-4 py-3 text-sm font-medium">
                  {trackMsg}
                </p>
              )}
              {tab === "rate" && rate && (
                <p className="mt-3 rounded-xl border border-line bg-neutral-50 px-4 py-3 text-sm font-medium">
                  Estimated freight for {rate.distance} km / {rate.weight} kg:{" "}
                  <span className="font-extrabold text-brand-black">
                    ₹{rate.total.toLocaleString("en-IN")}
                  </span>{" "}
                  <span className="text-muted">(indicative — final quote on call)</span>
                </p>
              )}
            </div>
          </div>

          <div className="animate-fadeUp mt-8 flex flex-wrap items-center gap-4" style={{ "--reveal-delay": "360ms" } as React.CSSProperties}>
            <a href="#cta" className="btn-yellow-lg">
              Get a Free Quote →
            </a>
            <a href="/drivers" className="btn-secondary">
              <Truck className="h-4 w-4" aria-hidden />
              Become a Driver Partner
            </a>
          </div>
        </div>

        {/* Right: video panel + floating metrics cluster */}
        <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[460px]">
          <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden rounded-3xl border border-line shadow-hero lg:inset-x-4 lg:bottom-12 lg:top-2">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={images.truckHighway.src}
              className="h-full w-full object-cover"
              aria-label="XtoX logistics network — road, air, sea and rail cargo"
            >
              <source src="/hero-logistics.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>

          <div className="absolute right-4 top-2 hidden w-64 animate-floatY rounded-2xl border border-line bg-white p-5 shadow-hero sm:right-10 lg:block">
            <p className="eyebrow">Live network</p>
            <p className="mt-2 text-3xl font-extrabold">{heroMetrics[0].value}</p>
            <p className="text-sm text-muted">{heroMetrics[0].label}</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full w-4/5 rounded-full bg-brand-yellow" />
            </div>
          </div>

          <div className="absolute left-2 top-36 hidden w-60 animate-floatYSlow rounded-2xl border border-line bg-white p-5 shadow-hero lg:block">
            <p className="eyebrow">Fleet strength</p>
            <p className="mt-2 text-3xl font-extrabold">{heroMetrics[1].value}</p>
            <p className="text-sm text-muted">{heroMetrics[1].label}</p>
            <div className="mt-3 flex -space-x-2">
              {[TruckElectric, Truck, Tractor, Ship].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-brand-yellow text-brand-black"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-2 right-24 hidden w-64 animate-floatY rounded-2xl border border-line bg-brand-black p-5 text-white shadow-hero [animation-delay:1.2s] lg:block">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow">
              On-time delivery
            </p>
            <p className="mt-2 text-4xl font-extrabold">{heroMetrics[3].value}</p>
            <p className="mt-1 text-sm text-white/60">{heroMetrics[2].value} states covered</p>
          </div>
        </div>
      </div>
    </section>
  );
}
