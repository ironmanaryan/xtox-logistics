"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Fragment } from "react";
import {
  MessageCircle,
  FileText,
  Truck,
  FolderDown,
  LogOut,
  Loader2,
  Send,
  Lock,
  RefreshCw,
  Search,
  Phone,
  ChevronDown,
} from "lucide-react";
import Logo from "@/components/Logo";

interface Conv {
  id: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  last_message_at: string;
  admin_unread: number;
}
interface Msg {
  conversation_id: string;
  sender: "visitor" | "admin";
  body: string;
  created_at: string;
}
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
interface Driver {
  id: string;
  name: string;
  phone: string;
  city: string;
  vehicle_type: string;
  experience_years: number;
  rc_number: string;
  license_number: string;
  status: string;
  created_at: string;
}
interface Doc {
  ref: string;
  name: string;
  size: number;
  created: string | null;
  url: string;
}

const QUOTE_STATUSES = ["new", "contacted", "quoted", "won", "lost"];
const DRIVER_STATUSES = ["pending", "verified", "rejected", "onboarded"];

const STATUS_STYLE: Record<string, string> = {
  new: "bg-red-100 text-red-800",
  contacted: "bg-blue-100 text-blue-800",
  quoted: "bg-brand-yellow text-brand-black",
  won: "bg-green-100 text-green-800",
  lost: "bg-neutral-200 text-neutral-600",
  pending: "bg-red-100 text-red-800",
  verified: "bg-blue-100 text-blue-800",
  onboarded: "bg-green-100 text-green-800",
  rejected: "bg-neutral-200 text-neutral-600",
};

/** Map the 12+ form service labels into dashboard groups. */
function serviceGroup(s: string): string {
  const t = s.toLowerCase();
  if (t.includes("packers")) return "Packers & Movers";
  if (t.includes("sme transport (on-demand)")) return "SME On-Demand";
  if (t.includes("sme transport (contract)")) return "SME Contract";
  if (t.includes("sme")) return "SME Transport";
  if (t.includes("export shipment")) return "Export";
  if (t.includes("import shipment")) return "Import";
  if (t.includes("agri export (crop)")) return "Agri Crop";
  if (t.includes("agri export (govt")) return "Agri Docs";
  if (t.includes("agri")) return "Agri-Export";
  if (t.includes("inward") || t.includes("outward")) return "Domestic EXIM";
  return "Other";
}

function digits(phone: string): string {
  const d = phone.replace(/\D/g, "").replace(/^(91|0)/, "");
  return /^[6-9]\d{9}$/.test(d) ? `91${d}` : d;
}

function fmtSize(n: number): string {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${Math.round(n / 1024)} KB`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<"quotes" | "drivers" | "documents" | "messages">("quotes");
  const [convs, setConvs] = useState<Conv[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [groupFilter, setGroupFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await fetch("/api/admin/data");
      if (r.status === 401) {
        setAuthed(false);
        return;
      }
      const d = await r.json();
      if (d.ok) {
        setConvs(d.conversations);
        setMessages(d.messages);
        setQuotes(d.quotes);
        setDrivers(d.drivers);
        setDocs(d.documents ?? []);
        setAuthed(true);
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) load();
        else setAuthed(false);
      })
      .catch(() => setAuthed(false));
  }, [load]);

  useEffect(() => {
    if (!authed) return;
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, [authed, load]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages, activeConv]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "Login failed");
      setPassword("");
      load();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
    setConvs([]);
    setQuotes([]);
    setDrivers([]);
    setDocs([]);
  };

  const setStatus = async (table: "quotes" | "drivers", id: string, status: string) => {
    if (table === "quotes") setQuotes((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));
    else setDrivers((d) => d.map((x) => (x.id === id ? { ...x, status } : x)));
    const r = await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, status }),
    });
    if (!r.ok) load();
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !reply.trim() || sending) return;
    setSending(true);
    try {
      const r = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConv, body: reply.trim() }),
      });
      const d = await r.json();
      if (d.ok) {
        setReply("");
        load();
      }
    } finally {
      setSending(false);
    }
  };

  // ---------- Login gate ----------
  if (authed === null || authed === false) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
        <form onSubmit={login} className="card w-full max-w-sm p-8">
          <div className="flex flex-col items-center text-center">
            <Logo variant="full" className="h-14 w-auto" href={null} />
            <h1 className="mt-4 text-xl font-extrabold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted">Sign in to manage leads and chats</p>
          </div>
          <label htmlFor="admin-pass" className="label mt-6">Admin password</label>
          <input
            id="admin-pass"
            type="password"
            required
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {loginError && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
              {loginError}
            </p>
          )}
          <button type="submit" disabled={loggingIn} className="btn-primary mt-4 w-full disabled:opacity-60">
            {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
            {loggingIn ? "Checking…" : "Sign in"}
          </button>
          {authed === false && (
            <p className="mt-4 text-center text-xs text-muted">
              Set <code>ADMIN_PASSWORD</code> env var on the server to enable.
            </p>
          )}
        </form>
      </main>
    );
  }

  // ---------- Dashboard ----------
  const newQuotes = quotes.filter((q) => q.status === "new");
  const pendingDrivers = drivers.filter((d) => d.status === "pending");
  const unread = convs.reduce((a, c) => a + (c.admin_unread > 0 ? 1 : 0), 0);
  const activeMsgs = messages.filter((m) => m.conversation_id === activeConv);

  const groups = useMemo(() => ["All", ...Array.from(new Set(quotes.map((q) => serviceGroup(q.service))))], [quotes]);

  const filteredQuotes = quotes.filter((q) => {
    if (groupFilter !== "All" && serviceGroup(q.service) !== groupFilter) return false;
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return [q.name, q.company ?? "", q.phone, q.from_city, q.to_city, q.service].some((f) => f.toLowerCase().includes(s));
  });

  const filteredDocs = docs.filter((d) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return d.ref.toLowerCase().includes(s) || d.name.toLowerCase().includes(s);
  });

  const docGroups = useMemo(() => {
    const m = new Map<string, Doc[]>();
    for (const d of filteredDocs) {
      if (!m.has(d.ref)) m.set(d.ref, []);
      m.get(d.ref)!.push(d);
    }
    return Array.from(m.entries());
  }, [filteredDocs]);

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b border-line bg-white">
        <div className="section-pad flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="full" className="h-9 w-auto" />
            <p className="text-sm font-extrabold">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:text-brand-black"
              aria-label="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-brand-black hover:bg-brand-black hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="section-pad py-6">
        {/* stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            { t: "New leads", v: newQuotes.length, hot: newQuotes.length > 0 },
            { t: "Total quotes", v: quotes.length, hot: false },
            { t: "Pending drivers", v: pendingDrivers.length, hot: pendingDrivers.length > 0 },
            { t: "Unread chats", v: unread, hot: unread > 0 },
            { t: "Documents", v: docs.length, hot: false },
          ].map((s) => (
            <div key={s.t} className="card flex items-center justify-between p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">{s.t}</p>
              <p className={`text-2xl font-extrabold ${s.hot ? "text-red-600" : ""}`}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {(
            [
              { key: "quotes", label: "Leads", icon: FileText, count: newQuotes.length },
              { key: "drivers", label: "Drivers", icon: Truck, count: pendingDrivers.length },
              { key: "documents", label: "Documents", icon: FolderDown, count: 0 },
              { key: "messages", label: "Chats", icon: MessageCircle, count: unread },
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
              <t.icon className="h-4 w-4" aria-hidden />
              {t.label}
              {t.count > 0 && (
                <span className="rounded-full bg-brand-yellow px-2 py-0.5 text-xs text-brand-black">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* search (leads + documents) */}
        {(tab === "quotes" || tab === "documents") && (
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              className="input !pl-11"
              placeholder={tab === "quotes" ? "Search name, phone, company, city…" : "Search by reference or file name…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* service group filter */}
        {tab === "quotes" && groups.length > 2 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroupFilter(g)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  groupFilter === g ? "bg-brand-yellow text-brand-black" : "border border-line bg-white text-muted hover:text-brand-black"
                }`}
              >
                {g}
                <span className="ml-1.5 opacity-70">
                  {g === "All" ? quotes.length : quotes.filter((q) => serviceGroup(q.service) === g).length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ---------- LEADS ---------- */}
        {tab === "quotes" && (
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-neutral-50 text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Customer</th>
                  <th className="px-4 py-3 font-bold">Call</th>
                  <th className="px-4 py-3 font-bold">Service</th>
                  <th className="px-4 py-3 font-bold">Lane</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold"><span className="sr-only">Details</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted">No leads match. Try another filter.</td></tr>
                )}
                {filteredQuotes.map((q) => (
                  <Fragment key={q.id}>
                    <tr className="border-b border-line last:border-0 hover:bg-neutral-50">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                        {new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {q.name}
                        {q.company && <span className="block text-xs font-normal text-muted">{q.company}</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <a href={`tel:${q.phone}`} className="mr-2 inline-flex items-center gap-1 font-semibold hover:underline">
                          <Phone className="h-3.5 w-3.5" aria-hidden /> {q.phone}
                        </a>
                        <a
                          href={`https://wa.me/${digits(q.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-green-700 hover:underline"
                        >
                          WhatsApp
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold">
                          {serviceGroup(q.service)}
                        </span>
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-muted">{q.from_city} → {q.to_city}</td>
                      <td className="px-4 py-3">
                        <select
                          aria-label={`Status for ${q.name}`}
                          value={q.status}
                          onChange={(e) => setStatus("quotes", q.id, e.target.value)}
                          className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold outline-none ${STATUS_STYLE[q.status] ?? "bg-neutral-100"}`}
                        >
                          {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                          className="rounded-lg p-1.5 hover:bg-neutral-100"
                          aria-label="Toggle details"
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${expanded === q.id ? "rotate-180" : ""}`} aria-hidden />
                        </button>
                      </td>
                    </tr>
                    {expanded === q.id && (
                      <tr className="bg-neutral-50">
                        <td colSpan={7} className="px-4 py-3 text-xs leading-relaxed">
                          <p><strong>Full service:</strong> {q.service}</p>
                          <p className="mt-1"><strong>Details:</strong> {q.cargo_details || "—"}</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- DRIVERS ---------- */}
        {tab === "drivers" && (
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-neutral-50 text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Call</th>
                  <th className="px-4 py-3 font-bold">City</th>
                  <th className="px-4 py-3 font-bold">Vehicle</th>
                  <th className="px-4 py-3 font-bold">Exp</th>
                  <th className="px-4 py-3 font-bold">RC / Licence</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-muted">No driver applications yet.</td></tr>
                )}
                {drivers.map((d) => (
                  <tr key={d.id} className="border-b border-line last:border-0 hover:bg-neutral-50">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                      {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3 font-semibold">{d.name}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a href={`tel:${d.phone}`} className="mr-2 inline-flex items-center gap-1 font-semibold hover:underline">
                        <Phone className="h-3.5 w-3.5" aria-hidden /> {d.phone}
                      </a>
                      <a href={`https://wa.me/${digits(d.phone)}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-green-700 hover:underline">
                        WhatsApp
                      </a>
                    </td>
                    <td className="px-4 py-3">{d.city}</td>
                    <td className="px-4 py-3 text-muted">{d.vehicle_type}</td>
                    <td className="px-4 py-3">{d.experience_years} yr</td>
                    <td className="px-4 py-3 text-xs text-muted">{d.rc_number} · {d.license_number}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Status for ${d.name}`}
                        value={d.status}
                        onChange={(e) => setStatus("drivers", d.id, e.target.value)}
                        className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold outline-none ${STATUS_STYLE[d.status] ?? "bg-neutral-100"}`}
                      >
                        {DRIVER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- DOCUMENTS ---------- */}
        {tab === "documents" && (
          <div className="mt-4 space-y-4">
            {docGroups.length === 0 && (
              <div className="card p-8 text-center text-sm text-muted">
                No documents uploaded yet. Customer uploads from the Import/Export documents page appear here.
              </div>
            )}
            {docGroups.map(([ref, files]) => (
              <div key={ref} className="card p-5">
                <p className="font-extrabold">
                  Ref: {ref}
                  <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-bold text-muted">{files.length} files</span>
                </p>
                <ul className="mt-3 space-y-2">
                  {files.map((f) => (
                    <li key={f.url} className="flex flex-wrap items-center gap-2 rounded-xl bg-neutral-50 px-3.5 py-2.5 text-sm">
                      <span className="min-w-0 flex-1 truncate font-medium">{f.name}</span>
                      <span className="text-xs text-muted">{fmtSize(f.size)}</span>
                      {f.created && (
                        <span className="text-xs text-muted">
                          {new Date(f.created).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                      <a href={f.url} target="_blank" rel="noreferrer" className="btn-secondary !px-3 !py-1.5 !text-xs">
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ---------- CHATS ---------- */}
        {tab === "messages" && (
          <div className="mt-4 grid gap-4 lg:grid-cols-[320px_1fr]">
            <div className="card max-h-[70vh] overflow-y-auto p-2">
              {convs.length === 0 && (
                <p className="p-6 text-center text-sm text-muted">No conversations yet.</p>
              )}
              {convs.map((c) => {
                const last = messages.filter((m) => m.conversation_id === c.id).slice(-1)[0];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveConv(c.id)}
                    className={`w-full rounded-xl p-3 text-left transition-colors ${
                      activeConv === c.id ? "bg-neutral-100" : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold">{c.name || "Anonymous visitor"}</p>
                      {c.admin_unread > 0 && (
                        <span className="shrink-0 rounded-full bg-brand-yellow px-2 py-0.5 text-xs font-extrabold text-brand-black">
                          {c.admin_unread}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {last ? last.body : c.phone || "No messages"}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      {new Date(c.last_message_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="card flex max-h-[70vh] flex-col">
              {!activeConv ? (
                <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted">
                  Select a conversation to read and reply.
                </div>
              ) : (
                <>
                  <div ref={threadRef} className="flex-1 space-y-2.5 overflow-y-auto bg-neutral-50 p-4">
                    {activeMsgs.map((m, i) => (
                      <div
                        key={i}
                        className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          m.sender === "admin"
                            ? "ml-auto bg-brand-black text-white"
                            : "border border-line bg-white"
                        }`}
                      >
                        {m.body}
                        <span className="mt-1 block text-[10px] opacity-60">
                          {new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendReply} className="flex items-center gap-2 border-t border-line p-3">
                    <input
                      className="input !py-2.5"
                      placeholder="Reply to customer…"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={sending || !reply.trim()}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-black text-brand-yellow hover:bg-brand-yellow hover:text-brand-black disabled:opacity-40"
                      aria-label="Send reply"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
