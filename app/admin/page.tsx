"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Fragment } from "react";
import {
  MessageCircle,
  FileText,
  Truck,
  FolderDown,
  Newspaper,
  LogOut,
  Loader2,
  Send,
  Lock,
  RefreshCw,
  Search,
  Phone,
  ChevronDown,
  Trash2,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import DocPicker, { type PickedDoc } from "@/components/DocPicker";

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
  path: string;
  size: number;
  created: string | null;
  url: string;
}
interface ResItem {
  id: string;
  kind: string;
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  extra: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

const CONTENT_KINDS = [
  { key: "article", label: "Articles" },
  { key: "case-study", label: "Case Studies" },
  { key: "faq", label: "FAQs" },
  { key: "blog", label: "Blog" },
];

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

  const [tab, setTab] = useState<"quotes" | "drivers" | "documents" | "content" | "messages">("quotes");
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
  const [resources, setResources] = useState<ResItem[]>([]);
  const [contentKind, setContentKind] = useState("article");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", body: "", tag: "", extra: "", extra2: "", image_url: "", published: true });
  const [coverFiles, setCoverFiles] = useState<PickedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
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
        setResources(d.resources ?? []);
        setAuthed(true);
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Always ask password on every visit/refresh: wipe any old session on mount,
    // and clear it again when the tab closes.
    fetch("/api/admin/auth", { method: "DELETE" })
      .catch(() => {})
      .finally(() => setAuthed(false));
    const bye = () => {
      try {
        fetch("/api/admin/auth", { method: "DELETE", keepalive: true }).catch(() => {});
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", bye);
    return () => window.removeEventListener("beforeunload", bye);
  }, []);

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
    setResources([]);
  };

  const setStatus = async (table: "quotes" | "drivers", id: string, status: string) => {    if (table === "quotes") setQuotes((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));
    else setDrivers((d) => d.map((x) => (x.id === id ? { ...x, status } : x)));
    const r = await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, status }),
    });
    if (!r.ok) load();
  };

  const del = async (target: "quote" | "driver" | "conversation" | "document", id: string, path?: string, label?: string) => {
    if (!window.confirm(`Delete this ${label ?? target}? This cannot be undone.`)) return;
    if (target === "quote") setQuotes((q) => q.filter((x) => x.id !== id));
    if (target === "driver") setDrivers((d) => d.filter((x) => x.id !== id));
    if (target === "conversation") {
      setConvs((c) => c.filter((x) => x.id !== id));
      if (activeConv === id) setActiveConv(null);
    }
    if (target === "document") setDocs((d) => d.filter((x) => x.path !== path));
    const r = await fetch("/api/admin/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, id, path }),
    });
    if (!r.ok) load();
  };

  const startNew = () => {
    setEditingId("new");
    setCoverFiles([]);
    setForm({ title: "", excerpt: "", body: "", tag: "", extra: "", extra2: "", image_url: "", published: true });
  };

  const startEdit = (r: ResItem) => {
    setEditingId(r.id);
    let extra = r.extra;
    let extra2 = "";
    if (r.kind === "case-study") {
      try {
        const o = JSON.parse(r.extra);
        extra = o.result ?? "";
        extra2 = o.client ?? "";
      } catch {
        extra = r.extra;
      }
    }
    setForm({ title: r.title, excerpt: r.excerpt, body: r.body, tag: r.tag, extra, extra2, image_url: r.image_url ?? "", published: r.published });
    setCoverFiles([]);
  };

  const saveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      // Upload new cover first (if picked)
      let image_url = form.image_url;
      const cover = coverFiles.find((f) => !f.error && f.blob);
      if (cover?.blob) {
        setUploading(true);
        const fd = new FormData();
        fd.append("file", cover.blob, cover.name);
        const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const ud = await up.json().catch(() => null);
        if (up.ok && ud?.ok && ud.url) image_url = ud.url as string;
        setUploading(false);
      }
      const payload = { ...form, image_url, extra: contentKind === "case-study" ? JSON.stringify({ client: form.extra2, result: form.extra }) : form.extra };
      const { extra2: _drop, ...item } = payload;
      const r = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId === "new"
            ? { action: "create", item: { ...item, kind: contentKind } }
            : { action: "update", id: editingId, patch: item }
        ),
      });
      const d = await r.json();
      if (d.ok) {
        setEditingId(null);
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (r: ResItem) => {
    setResources((rs) => rs.map((x) => (x.id === r.id ? { ...x, published: !x.published } : x)));
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id: r.id, patch: { published: !r.published } }),
    });
  };

  const delContent = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setResources((rs) => rs.filter((x) => x.id !== id));
    const r = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
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

  // ---------- Derived data (ALL hooks + computations BEFORE the early return —
  // Rules of Hooks: same hook order on every render, logged-in or not) ----------
  const newQuotes = quotes.filter((q) => q.status === "new");
  const pendingDrivers = drivers.filter((d) => d.status === "pending");
  const unread = convs.reduce((a, c) => a + (c.admin_unread > 0 ? 1 : 0), 0);

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
  const activeMsgs = messages.filter((m) => m.conversation_id === activeConv);

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
              { key: "content", label: "Content", icon: Newspaper, count: 0 },
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

        {/* search (leads + documents + content) */}
        {(tab === "quotes" || tab === "documents" || tab === "content") && (
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              className="input !pl-11"
              placeholder={tab === "quotes" ? "Search name, phone, company, city…" : tab === "documents" ? "Search by reference or file name…" : "Search titles…"}
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
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                            className="rounded-lg p-1.5 hover:bg-neutral-100"
                            aria-label="Toggle details"
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${expanded === q.id ? "rotate-180" : ""}`} aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => del("quote", q.id, undefined, `lead of ${q.name}`)}
                            className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete lead of ${q.name}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
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
                  <th className="px-4 py-3 font-bold"><span className="sr-only">Delete</span></th>
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-muted">No driver applications yet.</td></tr>
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
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => del("driver", d.id, undefined, `application of ${d.name}`)}
                        className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete application of ${d.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
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
                      <button
                        type="button"
                        onClick={() => del("document", f.path, f.path, `file ${f.name}`)}
                        className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${f.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ---------- CONTENT CMS ---------- */}
        {tab === "content" && (
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              {CONTENT_KINDS.map((k) => (
                <button
                  key={k.key}
                  type="button"
                  onClick={() => { setContentKind(k.key); setEditingId(null); }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    contentKind === k.key ? "bg-brand-yellow text-brand-black" : "border border-line bg-white text-muted hover:text-brand-black"
                  }`}
                >
                  {k.label}
                  <span className="ml-1.5 opacity-70">{resources.filter((r) => r.kind === k.key).length}</span>
                </button>
              ))}
              <button type="button" onClick={startNew} className="btn-primary ml-auto !px-4 !py-2 !text-xs">
                <Plus className="h-3.5 w-3.5" aria-hidden /> New
              </button>
            </div>

            {editingId && (
              <form onSubmit={saveContent} className="card mt-4 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold">{editingId === "new" ? "New" : "Edit"} {CONTENT_KINDS.find((k) => k.key === contentKind)?.label.slice(0, -1)}</h3>
                  <button type="button" onClick={() => setEditingId(null)} className="rounded-lg p-1.5 hover:bg-neutral-100" aria-label="Close editor">
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="ct-title">{contentKind === "faq" ? "Question" : "Title"}</label>
                    <input id="ct-title" required className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                  </div>
                  {contentKind !== "faq" && (
                    <div className="sm:col-span-2">
                      <span className="label">Cover image (optional)</span>
                      {form.image_url && coverFiles.length === 0 && (
                        <div className="mb-2 flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={form.image_url} alt="Cover preview" className="h-16 w-24 rounded-xl border border-line object-cover" />
                          <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                            className="text-xs font-bold text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <DocPicker
                        id="ct-cover"
                        files={coverFiles}
                        onChange={setCoverFiles}
                        maxFiles={1}
                        hint="JPG/PNG under 5 MB. Replaces the current cover on save."
                      />
                    </div>
                  )}
                  {contentKind !== "faq" && (
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="ct-excerpt">Short summary</label>
                      <textarea id="ct-excerpt" rows={2} className="input" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
                    </div>
                  )}
                  <div className={contentKind === "faq" ? "sm:col-span-2" : ""}>
                    <label className="label" htmlFor="ct-body">{contentKind === "faq" ? "Answer" : "Full text (optional)"}</label>
                    <textarea id="ct-body" rows={contentKind === "faq" ? 4 : 3} className="input" value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
                  </div>
                  {contentKind !== "faq" && (
                    <div>
                      <label className="label" htmlFor="ct-tag">
                        {contentKind === "article" ? "Category" : contentKind === "case-study" ? "Industry" : "Tag"}
                      </label>
                      <input id="ct-tag" className="input" value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} placeholder={contentKind === "article" ? "Guides" : contentKind === "case-study" ? "Textiles" : "Operations"} />
                    </div>
                  )}
                  {contentKind === "faq" && (
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="ct-tag">Category</label>
                      <input id="ct-tag" className="input" value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} placeholder="General" />
                    </div>
                  )}
                  {contentKind === "article" && (
                    <div>
                      <label className="label" htmlFor="ct-extra">Read time</label>
                      <input id="ct-extra" className="input" value={form.extra} onChange={(e) => setForm((f) => ({ ...f, extra: e.target.value }))} placeholder="5 min read" />
                    </div>
                  )}
                  {contentKind === "case-study" && (
                    <>
                      <div>
                        <label className="label" htmlFor="ct-client">Client</label>
                        <input id="ct-client" className="input" value={form.extra2} onChange={(e) => setForm((f) => ({ ...f, extra2: e.target.value }))} placeholder="Client name, city" />
                      </div>
                      <div>
                        <label className="label" htmlFor="ct-result">Result line</label>
                        <input id="ct-result" className="input" value={form.extra} onChange={(e) => setForm((f) => ({ ...f, extra: e.target.value }))} placeholder="60% faster clearance" />
                      </div>
                    </>
                  )}
                </div>
                <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="h-4 w-4 accent-[#111111]" />
                  Published (visible on website)
                </label>
                <button type="submit" disabled={saving} className="btn-primary mt-4 disabled:opacity-60">
                  {uploading ? "Uploading image…" : saving ? "Saving…" : editingId === "new" ? "Publish" : "Save changes"}
                </button>
              </form>
            )}

            <div className="mt-4 space-y-2.5">
              {resources
                .filter((r) => r.kind === contentKind)
                .filter((r) => !search.trim() || r.title.toLowerCase().includes(search.toLowerCase()))
                .map((r) => (
                  <div key={r.id} className={`card flex items-center gap-3 p-4 ${r.published ? "" : "opacity-70"}`}>
                    {r.image_url && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={r.image_url} alt="" className="h-12 w-16 shrink-0 rounded-lg border border-line object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {r.title}
                        {!r.published && <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-[11px] font-bold text-muted">DRAFT</span>}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">{r.tag}{r.excerpt ? ` • ${r.excerpt}` : ""}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePublish(r)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-muted hover:bg-neutral-100 hover:text-brand-black"
                    >
                      {r.published ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" onClick={() => startEdit(r)} className="rounded-lg p-1.5 hover:bg-neutral-100" aria-label={`Edit ${r.title}`}>
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" onClick={() => delContent(r.id, r.title)} className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${r.title}`}>
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                ))}
              {resources.filter((r) => r.kind === contentKind).length === 0 && !editingId && (
                <div className="card p-8 text-center text-sm text-muted">
                  Nothing here yet — press <strong>New</strong> to add your first item.
                </div>
              )}
            </div>
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
                      <span className="flex shrink-0 items-center gap-1">
                        {c.admin_unread > 0 && (
                          <span className="rounded-full bg-brand-yellow px-2 py-0.5 text-xs font-extrabold text-brand-black">
                            {c.admin_unread}
                          </span>
                        )}
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); del("conversation", c.id, undefined, `chat with ${c.name || "visitor"}`); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); del("conversation", c.id, undefined, "this chat"); } }}
                          className="rounded-lg p-1 text-muted hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete chat"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </span>
                      </span>
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
