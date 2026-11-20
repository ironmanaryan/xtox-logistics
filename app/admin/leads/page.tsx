"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Phone, RefreshCw } from "lucide-react";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];

interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  service: string;
  from_city: string | null;
  to_city: string | null;
  details: string | null;
  source: string | null;
  page_path: string | null;
  status: Status;
  notes: string | null;
}

const statusStyle: Record<Status, string> = {
  new: "bg-brand-yellow text-brand-black",
  contacted: "bg-blue-100 text-blue-800",
  quoted: "bg-purple-100 text-purple-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-neutral-200 text-neutral-600",
};

export default function AdminLeadsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (query.trim()) params.set("q", query.trim());
      const res = await fetch(`/api/admin/leads?${params}`);
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Could not load leads");
        if (res.status === 401) setAuthed(false);
        return;
      }
      setLeads(json.leads as Lead[]);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [filter, query]);

  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
  }, [authed, load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setPassword("");
    } else {
      setError("Wrong password");
    }
  }

  async function setStatus(id: string, status: Status) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      setError("Status update failed — refreshing");
      void load();
    }
  }

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: leads.length };
    leads.forEach((l) => {
      m[l.status] = (m[l.status] ?? 0) + 1;
    });
    return m;
  }, [leads]);

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to content admin
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">Leads</h1>
        <p className="mt-2 text-sm text-muted">
          Password protected. Uses the same ADMIN_PASSWORD as the content admin.
        </p>
        <form onSubmit={login} className="mt-6 space-y-3">
          <label htmlFor="lead-pass" className="label">
            Admin password
          </label>
          <input
            id="lead-pass"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit" className="btn-primary w-full">
            Open leads
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted">
            Newest first. Statuses: new → contacted → quoted → won / lost.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()} className="btn-secondary" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
          <Link href="/admin" className="btn-secondary">
            Content admin
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${
              filter === s ? "border-brand-black bg-brand-black text-white" : "border-line bg-white"
            }`}
          >
            {s} {counts[s] ? `(${counts[s]})` : ""}
          </button>
        ))}
        <input
          className="input ml-auto max-w-xs"
          placeholder="Search name, phone, route"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search leads"
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {leads.length === 0 && !loading && (
          <p className="card p-6 text-sm text-muted">No leads yet.</p>
        )}
        {leads.map((l) => (
          <article key={l.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">
                  {l.name}
                  {l.company ? <span className="font-medium text-muted"> · {l.company}</span> : null}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {new Date(l.created_at).toLocaleString("en-IN")} · {l.service}
                  {l.from_city || l.to_city ? ` · ${l.from_city ?? "?"} → ${l.to_city ?? "?"}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a href={`tel:${l.phone}`} className="btn-secondary">
                  <Phone className="h-4 w-4" aria-hidden /> {l.phone}
                </a>
                <select
                  aria-label={`Status for ${l.name}`}
                  value={l.status}
                  onChange={(e) => void setStatus(l.id, e.target.value as Status)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold capitalize ${statusStyle[l.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {l.details && <p className="mt-3 text-sm leading-relaxed text-muted">{l.details}</p>}
            {l.notes && <p className="mt-2 text-sm italic text-muted">Note: {l.notes}</p>}
            <p className="mt-3 text-xs text-muted">
              Source: {l.source ?? "direct"} · Page: {l.page_path ?? "—"}
              {l.email ? ` · ${l.email}` : ""}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
