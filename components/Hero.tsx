"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Package, ScrollText, Truck, Warehouse } from "lucide-react";
import { images } from "@/data/images";
import { services } from "@/data/services";
import { features } from "@/data/company";
import { useI18n } from "./LanguageProvider";
import type { TKey } from "@/lib/i18n";

type HeroTab = "price" | "track";

const SERVICE_NAME: Record<string, TKey> = {
  "packers-movers": "svc.pm.name",
  "import-export": "svc.ie.name",
  "sme-transport": "svc.sme.name",
  "agri-export": "svc.agri.name",
};

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
  const { t } = useI18n();
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
      setFormError(t("hero.errCities"));
      return;
    }
    setFormError(null);
    prefillQuote({ from: from.trim(), to: to.trim(), service });
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setTrackMsg(t("hero.errTrack"));
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
          `${s.tracking_code} · ${s.status.replace(/_/g, " ")} · ${s.origin} → ${s.destination}${
            s.current_location ? ` · Now at: ${s.current_location}` : ""
          }${s.eta_date ? ` · ETA: ${s.eta_date}` : ""}`
        );
      } else {
        setTrackMsg(
          data.error === "Shipment not found"
            ? t("hero.trackNotFound").replace("{id}", trackingId.toUpperCase())
            : data.error || t("hero.trackFailed")
        );
      }
    } catch {
      setTrackMsg(t("hero.trackNetwork"));
    } finally {
      setTracking(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <Image
        src={images.heroFleet.src}
        alt={images.heroFleet.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" aria-hidden />

      <div className="section-pad relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_420px] lg:py-24">
        <div>
          <span className="chip-yellow animate-fadeUp whitespace-nowrap text-[10px] sm:text-xs">
            {t("hero.badge")}
          </span>
          <h1
            className="animate-fadeUp mt-5 text-[2.1rem] font-extrabold leading-[1.2] tracking-tight sm:text-5xl sm:leading-[1.1] lg:text-[4rem]"
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          >
            {t("hero.titleLine1")}
            <br />
            <span className="inline-block text-white underline decoration-brand-yellow decoration-[5px] underline-offset-[9px] sm:decoration-[7px] sm:underline-offset-[14px]">
              {t("hero.titleLine2")}
            </span>
          </h1>
          <p
            className="animate-fadeUp mt-5 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-lg"
            style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
          >
            {t("hero.subtitle")}
          </p>
          <div
            className="animate-fadeUp mt-6 flex flex-wrap gap-3"
            style={{ "--reveal-delay": "260ms" } as React.CSSProperties}
          >
            <a href="#cta" className="btn-yellow-lg">
              {t("hero.cta")} <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-brand-yellow hover:text-brand-yellow"
            >
              {t("hero.how")}
            </a>
          </div>
          <ul
            className="animate-fadeUp mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] font-semibold text-white/85"
            style={{ "--reveal-delay": "340ms" } as React.CSSProperties}
          >
            {[
              { icon: Truck, label: t("hero.strip1") },
              { icon: Warehouse, label: t("hero.strip2") },
              { icon: ScrollText, label: t("hero.strip3") },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-brand-yellow" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="animate-fadeUp relative overflow-hidden rounded-3xl bg-white p-2 text-brand-black shadow-hero ring-1 ring-white/25"
          style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand-yellow" />
          {features.trackShipment && (
            <div className="flex gap-1 rounded-2xl bg-neutral-100 p-1" role="tablist" aria-label="Booking or tracking">
              {(
                [
                  { key: "price", label: t("hero.tab.price") },
                  { key: "track", label: t("hero.tab.track") },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  role="tab"
                  aria-selected={tab === item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                    tab === item.key ? "bg-white text-brand-black shadow-sm" : "text-muted hover:text-brand-black"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-4">
            {tab === "price" || !features.trackShipment ? (
              <form onSubmit={onGetPrice} className="grid gap-3">
                <div>
                  <label htmlFor="hero-from" className="label">
                    {t("hero.pickup")}
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                    <input
                      id="hero-from"
                      className="input !bg-neutral-50 !pl-10"
                      placeholder={t("hero.phFrom")}
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="hero-to" className="label">
                    {t("hero.drop")}
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                    <input
                      id="hero-to"
                      className="input !bg-neutral-50 !pl-10"
                      placeholder={t("hero.phTo")}
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="hero-service" className="label">
                    {t("hero.service")}
                  </label>
                  <select
                    id="hero-service"
                    className="input !bg-neutral-50"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    {services.map((s) => (
                      <option key={s.key} value={s.name}>
                        {t(SERVICE_NAME[s.key] ?? "svc.pm.name")}
                      </option>
                    ))}
                  </select>
                </div>
                {formError && <p className="text-xs font-semibold text-red-600">{formError}</p>}
                <button type="submit" className="btn-primary w-full !py-3.5">
                  {t("hero.submit")} <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <p className="text-center text-xs text-muted">{t("hero.footnote")}</p>
              </form>
            ) : (
              <form onSubmit={handleTrack} className="grid gap-3">
                <div>
                  <label htmlFor="hero-track" className="label">
                    {t("hero.trackLabel")}
                  </label>
                  <div className="relative">
                    <Package className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                    <input
                      id="hero-track"
                      className="input !bg-neutral-50 !pl-10"
                      placeholder={t("hero.phTrack")}
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" disabled={tracking} className="btn-primary w-full !py-3.5 disabled:opacity-60">
                  {tracking ? t("hero.checking") : t("hero.trackCta")}
                </button>
                {trackMsg && (
                  <p className="rounded-xl border border-line bg-neutral-50 px-4 py-3 text-sm font-medium">{trackMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Road-lane divider keeps the logistics cue at the fold */}
      <div
        aria-hidden
        className="relative h-2 w-full bg-[repeating-linear-gradient(90deg,#ffde59_0_46px,transparent_46px_92px)] opacity-70"
      />
    </section>
  );
}
