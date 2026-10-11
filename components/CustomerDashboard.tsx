"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Receipt,
  User,
  LogOut,
  Loader2,
  Phone,
  RotateCcw,
  Printer,
  X,
  CheckCircle2,
} from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface Quote {
  id: string;
  name: string;
  company: string | null;
  service: string;
  phone: string;
  from_city: string;
  to_city: string;
  cargo_details: string | null;
  status: string;
  created_at: string;
}

const STATUS_STEPS = ["new", "contacted", "quoted", "won"];
const STATUS_STYLE: Record<string, string> = {
  new: "bg-red-100 text-red-800",
  contacted: "bg-blue-100 text-blue-800",
  quoted: "bg-brand-yellow text-brand-black",
  won: "bg-green-100 text-green-800",
  lost: "bg-neutral-200 text-neutral-600",
};

function repeatUrl(service: string): string {
  const t = service.toLowerCase();
  if (t.includes("packers")) return "/services/packers-movers/book";
  if (t.includes("sme transport (on-demand)")) return "/services/sme-transport/on-demand";
  if (t.includes("sme transport (contract)")) return "/services/sme-transport/contract";
  if (t.includes("import shipment") || t.includes("inward")) return "/services/import-export/import";
  if (t.includes("export shipment") || t.includes("outward")) return "/services/import-export/export";
  if (t.includes("agri")) return "/services/agri-export/export-crop";
  return "/#cta";
}

function parseAmount(details: string | null): number | null {
  if (!details) return null;
  const m = details.match(/₹([\d,]+)/);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [tab, setTab] = useState<"bookings" | "invoices" | "profile">("bookings");
  const [phoneInput, setPhoneInput] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [invoiceFor, setInvoiceFor] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (savePhone?: string) => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setError("Login service not configured.");
      setLoading(false);
      return;
    }
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const r = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savePhone ? { token, phone: savePhone } : { token }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "Failed to load dashboard");
      setEmail(d.email);
      setPhone(d.phone);
      setQuotes(d.quotes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await getSupabaseBrowser()?.auth.signOut();
    window.location.href = "/";
  };

  const savePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.replace(/\D/g, "").length < 10) return;
    setSavingPhone(true);
    await load(phoneInput);
    setSavingPhone(false);
    setPhoneInput("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" aria-hidden />
      </div>
    );
  }

  if (!email && quotes.length === 0 && !error) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <User className="mx-auto h-8 w-8 text-muted" aria-hidden />
        <h1 className="mt-4 text-xl font-extrabold">Log in to open your dashboard</h1>
        <p className="mt-2 text-sm text-muted">Bookings, invoices and tracking live here.</p>
        <Link href="/login" className="btn-primary mt-6 w-full">Go to login</Link>
      </div>
    );
  }

  const active = quotes.filter((q) => !["won", "lost"].includes(q.status));

  return (
    <div>
      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { t: "Active bookings", v: active.length },
          { t: "Total orders", v: quotes.length },
          { t: "Delivered", v: quotes.filter((q) => q.status === "won").length },
        ].map((s) => (
          <div key={s.t} className="card p-4 text-center sm:p-5">
            <p className="text-2xl font-extrabold sm:text-3xl">{s.v}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted sm:text-xs">{s.t}</p>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div className="mt-5 flex gap-2">
        {(
          [
            { key: "bookings", label: "My Bookings", icon: Package },
            { key: "invoices", label: "Invoices", icon: Receipt },
            { key: "profile", label: "Profile", icon: User },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
              tab === t.key ? "bg-brand-black text-white" : "border border-line bg-white text-muted hover:text-brand-black"
            }`}
          >
            <t.icon className="h-4 w-4" aria-hidden /> {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}

      {/* BOOKINGS */}
      {tab === "bookings" && (
        <div className="mt-4 space-y-3">
          {!phone && (
            <form onSubmit={savePhone} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm"><strong>Add your mobile number</strong> <span className="text-muted">to pull past bookings made as guest.</span></p>
              <div className="flex gap-2">
                <input className="input sm:w-44" inputMode="numeric" placeholder="98765 43210" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />
                <button type="submit" disabled={savingPhone} className="btn-primary shrink-0 !px-4 disabled:opacity-60">
                  {savingPhone ? "…" : "Link"}
                </button>
              </div>
            </form>
          )}
          {quotes.length === 0 && (
            <div className="card p-8 text-center text-sm text-muted">
              No bookings yet. Your quotes and orders will appear here.
              <div><Link href="/#cta" className="btn-primary mt-4">Get your first quote</Link></div>
            </div>
          )}
          {quotes.map((q) => (
            <div key={q.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-extrabold">{q.service}</p>
                  <p className="mt-0.5 text-sm text-muted">{q.from_city} → {q.to_city}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[q.status] ?? "bg-neutral-100"}`}>
                  {q.status}
                </span>
              </div>
              {/* progress */}
              {q.status !== "lost" && (
                <div className="mt-3 flex items-center gap-1">
                  {STATUS_STEPS.map((s, i) => {
                    const done = STATUS_STEPS.indexOf(q.status) >= i;
                    return (
                      <div key={s} className="flex flex-1 items-center gap-1 last:flex-none">
                        <span className={`h-2 flex-1 rounded-full ${done ? "bg-brand-yellow" : "bg-neutral-200"}`} />
                        {i < STATUS_STEPS.length - 1 && <span className="hidden" />}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span>{new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                {parseAmount(q.cargo_details) && <span className="font-bold text-brand-black">{inr(parseAmount(q.cargo_details)!)}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setInvoiceFor(q)} className="btn-secondary !px-3.5 !py-2 !text-xs">
                  <Receipt className="h-3.5 w-3.5" aria-hidden /> Invoice
                </button>
                <Link href={repeatUrl(q.service)} className="btn-secondary !px-3.5 !py-2 !text-xs">
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Book again
                </Link>
                <a href={`tel:${q.phone}`} className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-bold text-muted hover:text-brand-black">
                  <Phone className="h-3.5 w-3.5" aria-hidden /> Call desk
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INVOICES */}
      {tab === "invoices" && (
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-neutral-50 text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3 font-bold">Invoice</th>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Service</th>
                <th className="px-4 py-3 font-bold">Amount</th>
                <th className="px-4 py-3 font-bold"><span className="sr-only">View</span></th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">Invoices appear here once you book.</td></tr>
              )}
              {quotes.map((q) => {
                const amt = parseAmount(q.cargo_details);
                return (
                  <tr key={q.id} className="border-b border-line last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3 font-bold">INV-{new Date(q.created_at).getFullYear()}-{q.id.slice(0, 6).toUpperCase()}</td>
                    <td className="px-4 py-3 text-muted">{new Date(q.created_at).toLocaleDateString("en-IN")}</td>
                    <td className="max-w-[220px] truncate px-4 py-3">{q.service}</td>
                    <td className="px-4 py-3 font-bold">{amt ? inr(amt) : <span className="font-normal text-muted">On delivery</span>}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setInvoiceFor(q)} className="text-xs font-bold hover:underline">View →</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PROFILE */}
      {tab === "profile" && (
        <div className="card mx-auto mt-4 max-w-md p-6 sm:p-8">
          <p className="label">Email</p>
          <p className="font-bold">{email || "—"}</p>
          <p className="label mt-4">Mobile (links your bookings)</p>
          <p className="font-bold">{phone || "Not linked"}</p>
          {!phone && (
            <form onSubmit={savePhone} className="mt-3 flex gap-2">
              <input className="input" inputMode="numeric" placeholder="98765 43210" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />
              <button type="submit" disabled={savingPhone} className="btn-primary shrink-0 !px-4 disabled:opacity-60">
                {savingPhone ? "…" : "Save"}
              </button>
            </form>
          )}
          <button type="button" onClick={logout} className="btn-secondary mt-6 w-full">
            <LogOut className="h-4 w-4" aria-hidden /> Log out
          </button>
        </div>
      )}

      {/* INVOICE MODAL */}
      {invoiceFor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => setInvoiceFor(null)}>
          <div className="card max-h-[85vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-extrabold">XtoX Logistics</p>
                <p className="text-xs text-muted">Tax Invoice (indicative)</p>
              </div>
              <button type="button" onClick={() => setInvoiceFor(null)} className="rounded-lg p-1.5 hover:bg-neutral-100" aria-label="Close invoice">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="label">Invoice no</p><p className="font-bold">INV-{new Date(invoiceFor.created_at).getFullYear()}-{invoiceFor.id.slice(0, 6).toUpperCase()}</p></div>
              <div><p className="label">Date</p><p className="font-bold">{new Date(invoiceFor.created_at).toLocaleDateString("en-IN")}</p></div>
              <div className="col-span-2"><p className="label">Billed to</p><p className="font-bold">{invoiceFor.name}{invoiceFor.company ? ` · ${invoiceFor.company}` : ""}</p></div>
              <div className="col-span-2"><p className="label">Service</p><p className="font-bold">{invoiceFor.service}</p></div>
              <div><p className="label">From</p><p className="font-bold">{invoiceFor.from_city}</p></div>
              <div><p className="label">To</p><p className="font-bold">{invoiceFor.to_city}</p></div>
            </div>
            <div className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Status</span><span className="font-bold capitalize">{invoiceFor.status}</span></div>
              <div className="mt-1.5 flex justify-between border-t border-line pt-2.5">
                <span className="font-extrabold">Amount {parseAmount(invoiceFor.cargo_details) ? "(incl. GST)" : ""}</span>
                <span className="text-xl font-extrabold">
                  {parseAmount(invoiceFor.cargo_details) ? inr(parseAmount(invoiceFor.cargo_details)!) : "On delivery"}
                </span>
              </div>
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Final GST invoice is emailed after delivery. For corrections, call the logistics desk.
            </p>
            <button type="button" onClick={() => window.print()} className="btn-primary mt-4 w-full">
              <Printer className="h-4 w-4" aria-hidden /> Print / Save PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
