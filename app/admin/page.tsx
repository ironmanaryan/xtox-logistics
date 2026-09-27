"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  FileText,
  Truck,
  LogOut,
  Loader2,
  Send,
  Lock,
  RefreshCw,
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

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<"messages" | "quotes" | "drivers">("messages");
  const [convs, setConvs] = useState<Conv[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
    const iv = setInterval(load, 8000);
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
        <div className="flex gap-2">
          {(
            [
              { key: "messages", label: "Messages", icon: MessageCircle, count: convs.reduce((a, c) => a + (c.admin_unread > 0 ? 1 : 0), 0) },
              { key: "quotes", label: "Quote Requests", icon: FileText, count: quotes.filter((q) => q.status === "new").length },
              { key: "drivers", label: "Driver Applications", icon: Truck, count: drivers.filter((d) => d.status === "pending").length },
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

        {tab === "messages" && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
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

        {tab === "quotes" && (
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-neutral-50 text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold">Service</th>
                  <th className="px-4 py-3 font-bold">Lane</th>
                  <th className="px-4 py-3 font-bold">Cargo</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {quotes.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted">No quote requests yet.</td></tr>
                )}
                {quotes.map((q) => (
                  <tr key={q.id} className="border-b border-line last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(q.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {q.name}
                      {q.company && <span className="block text-xs text-muted">{q.company}</span>}
                    </td>
                    <td className="px-4 py-3">{q.phone}</td>
                    <td className="px-4 py-3">{q.service}</td>
                    <td className="px-4 py-3 text-muted">{q.from_city} → {q.to_city}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted">{q.cargo_details || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-yellow px-2.5 py-1 text-xs font-bold text-brand-black">{q.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "drivers" && (
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-neutral-50 text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
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
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(d.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-semibold">{d.name}</td>
                    <td className="px-4 py-3">{d.phone}</td>
                    <td className="px-4 py-3">{d.city}</td>
                    <td className="px-4 py-3 text-muted">{d.vehicle_type}</td>
                    <td className="px-4 py-3">{d.experience_years} yr</td>
                    <td className="px-4 py-3 text-xs text-muted">{d.rc_number} · {d.license_number}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-yellow px-2.5 py-1 text-xs font-bold text-brand-black">{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
