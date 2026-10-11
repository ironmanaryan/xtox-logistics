"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PackageSearch,
  Truck,
  Wallet,
  User,
  Loader2,
  Phone,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Camera,
  LogOut,
} from "lucide-react";

interface Driver {
  name: string;
  city: string;
  vehicle_type: string;
  status: string;
}

interface Load {
  id: string;
  origin: string;
  destination: string;
  goods: string;
  weight_kg: number;
  fare: number;
  status: string;
  driver_phone: string;
  pod_path: string;
  created_at: string;
}

const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function DriverApp() {
  const [phone, setPhone] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [driver, setDriver] = useState<Driver | null>(null);
  const [tab, setTab] = useState<"loads" | "trips" | "earnings">("loads");
  const [open, setOpen] = useState<Load[]>([]);
  const [mine, setMine] = useState<Load[]>([]);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [podId, setPodId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("xtox_driver_phone");
      if (saved) {
        setPhone(saved);
        verify(saved);
      }
    } catch {
      /* ignore */
    }
    setBooting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verify = async (p: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/driver/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: p }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "Verification failed");
      setDriver(d.driver);
      setPhone(p);
      try {
        localStorage.setItem("xtox_driver_phone", p);
      } catch {
        /* ignore */
      }
      await refresh(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async (p: string = phone ?? "") => {
    if (!p) return;
    try {
      const r = await fetch("/api/driver/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: p }),
      });
      const d = await r.json();
      if (d.ok) {
        setOpen(d.open);
        setMine(d.mine);
      }
    } catch {
      /* ignore */
    }
  };

  const act = async (loadId: string, action: "claim" | "pickup" | "deliver") => {
    if (!phone) return;
    setBusyId(loadId);
    setError(null);
    try {
      const r = await fetch("/api/driver/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, loadId, action }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "Action failed");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const uploadPod = async (loadId: string, file: File | undefined) => {
    if (!phone || !file) return;
    setBusyId(loadId);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("phone", phone);
      fd.append("loadId", loadId);
      fd.append("file", file);
      const r = await fetch("/api/driver/pod", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "POD upload failed");
      setPodId(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "POD upload failed");
    } finally {
      setBusyId(null);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("xtox_driver_phone");
    } catch {
      /* ignore */
    }
    setPhone(null);
    setDriver(null);
    setOpen([]);
    setMine([]);
  };

  const loginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.replace(/\D/g, "").length >= 10) verify(phoneInput);
  };

  if (booting) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" aria-hidden />
      </div>
    );
  }

  // ---------- LOGIN ----------
  if (!phone || !driver) {
    return (
      <div className="mx-auto w-full max-w-md">
        <form onSubmit={loginSubmit} className="card p-6 sm:p-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-black">
            <Truck className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="mt-4 text-center text-xl font-extrabold">Driver App</h1>
          <p className="mt-1 text-center text-sm text-muted">
            Enter your registered mobile number to see loads.
          </p>
          <label htmlFor="drv-phone" className="label mt-5">Mobile number</label>
          <input
            id="drv-phone"
            inputMode="numeric"
            required
            className="input"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="98765 43210"
          />
          {error && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn-primary mt-4 w-full disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Open my loads"}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            New driver? <a href="/drivers" className="font-bold text-brand-black hover:underline">Apply here</a> — trips unlock after verification.
          </p>
        </form>
      </div>
    );
  }

  const canDrive = ["verified", "onboarded"].includes(driver.status);
  const earned = mine.filter((l) => l.status === "delivered").reduce((a, l) => a + Number(l.fare), 0);

  return (
    <div className="mx-auto w-full max-w-2xl pb-24">
      {/* header */}
      <div className="card flex items-center gap-3 p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
          <User className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold">{driver.name}</p>
          <p className="truncate text-xs text-muted">{driver.vehicle_type} • {driver.city} • {phone}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${canDrive ? "bg-green-100 text-green-800" : "bg-brand-yellow text-brand-black"}`}>
          {driver.status}
        </span>
      </div>

      {!canDrive && (
        <p className="mt-3 rounded-2xl border border-line bg-brand-yellow/20 p-4 text-sm font-medium">
          Your application is <strong>{driver.status}</strong>. You can browse loads — accept unlocks after verification (under 24 hrs).
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>
      )}

      {/* LOADS */}
      {tab === "loads" && (
        <div className="mt-4 space-y-3">
          {open.length === 0 && (
            <div className="card p-8 text-center text-sm text-muted">No open loads right now. Pull down to refresh — new loads appear here first.</div>
          )}
          {open.map((l) => (
            <div key={l.id} className="card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-start gap-1.5 font-extrabold">
                  <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                  <span>{l.origin} → {l.destination}</span>
                </p>
                <p className="flex shrink-0 items-center gap-1 text-lg font-extrabold">
                  <IndianRupee className="h-4 w-4" aria-hidden />{Number(l.fare).toLocaleString("en-IN")}
                </p>
              </div>
              <p className="mt-1.5 text-sm text-muted">{l.goods} • {Number(l.weight_kg).toLocaleString("en-IN")} kg</p>
              <button
                type="button"
                disabled={!canDrive || busyId === l.id}
                onClick={() => act(l.id, "claim")}
                className="btn-primary mt-3 w-full disabled:opacity-50"
              >
                {busyId === l.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Accept load"}
              </button>
            </div>
          ))}
          <button type="button" onClick={() => refresh()} className="btn-secondary w-full">Refresh loads</button>
        </div>
      )}

      {/* TRIPS */}
      {tab === "trips" && (
        <div className="mt-4 space-y-3">
          {mine.length === 0 && (
            <div className="card p-8 text-center text-sm text-muted">No trips yet. Accept a load to start your first trip.</div>
          )}
          {mine.map((l) => (
            <div key={l.id} className="card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-extrabold">{l.origin} → {l.destination}</p>
                <span className="shrink-0 rounded-full bg-brand-yellow px-2.5 py-1 text-xs font-bold text-brand-black">{l.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{l.goods} • {inr(l.fare)}</p>
              <div className="mt-3 grid gap-2">
                {l.status === "claimed" && (
                  <button type="button" disabled={busyId === l.id} onClick={() => act(l.id, "pickup")} className="btn-primary w-full disabled:opacity-50">
                    {busyId === l.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Confirm pickup"}
                  </button>
                )}
                {l.status === "picked" && (
                  <button type="button" disabled={busyId === l.id} onClick={() => act(l.id, "deliver")} className="btn-primary w-full disabled:opacity-50">
                    {busyId === l.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Mark delivered"}
                  </button>
                )}
                {(l.status === "picked" || l.status === "delivered") && !l.pod_path && (
                  podId === l.id ? (
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line p-3 text-sm font-bold hover:border-brand-black">
                      <Camera className="h-4 w-4" aria-hidden /> Choose POD photo / LR
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => uploadPod(l.id, e.target.files?.[0])}
                      />
                    </label>
                  ) : (
                    <button type="button" disabled={busyId === l.id} onClick={() => setPodId(l.id)} className="btn-secondary w-full">
                      <Camera className="h-4 w-4" aria-hidden /> Upload POD
                    </button>
                  )
                )}
                {l.pod_path && (
                  <p className="flex items-center gap-1.5 text-sm font-bold text-green-700">
                    <CheckCircle2 className="h-4 w-4" aria-hidden /> POD uploaded ✓
                  </p>
                )}
                <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-muted">
                  <Phone className="h-3.5 w-3.5" aria-hidden /> Call dispatch
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EARNINGS */}
      {tab === "earnings" && (
        <div className="mt-4">
          <div className="rounded-3xl bg-brand-black p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow">Total earned</p>
            <p className="mt-2 flex items-center text-4xl font-extrabold">
              <IndianRupee className="h-8 w-8" aria-hidden />{earned.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {mine.filter((l) => l.status === "delivered").length} delivered • {mine.filter((l) => l.status !== "delivered").length} in progress
            </p>
          </div>
          <div className="card mt-3 divide-y divide-neutral-100">
            {mine.length === 0 && <p className="p-6 text-center text-sm text-muted">Payment history appears here after your first delivery.</p>}
            {mine.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-bold">{l.origin} → {l.destination}</p>
                  <p className="text-xs text-muted">{new Date(l.created_at).toLocaleDateString("en-IN")} • {l.status}</p>
                </div>
                <p className={`shrink-0 font-extrabold ${l.status === "delivered" ? "text-green-700" : "text-muted"}`}>
                  {l.status === "delivered" ? "+" : ""}{inr(l.fare)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted">Paid within 48 hrs of POD clearance. No credit games.</p>
          <button type="button" onClick={logout} className="btn-secondary mt-4 w-full">
            <LogOut className="h-4 w-4" aria-hidden /> Log out
          </button>
        </div>
      )}

      {/* bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-3">
          {(
            [
              { key: "loads", label: "Loads", icon: PackageSearch, badge: open.length },
              { key: "trips", label: "My Trips", icon: Truck, badge: mine.filter((l) => l.status !== "delivered").length },
              { key: "earnings", label: "Earnings", icon: Wallet, badge: 0 },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => { setTab(t.key); refresh(); }}
              className={`relative flex flex-col items-center gap-1 py-3 text-xs font-bold ${tab === t.key ? "text-brand-black" : "text-muted"}`}
            >
              <t.icon className="h-5 w-5" aria-hidden />
              {t.label}
              {t.badge > 0 && (
                <span className="absolute right-1/2 top-1.5 translate-x-6 rounded-full bg-brand-yellow px-1.5 text-[10px] font-extrabold text-brand-black">
                  {t.badge}
                </span>
              )}
              {tab === t.key && <span className="absolute inset-x-8 bottom-1 h-1 rounded-full bg-brand-yellow" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
