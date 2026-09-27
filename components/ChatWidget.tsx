"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface ChatMsg {
  sender: "visitor" | "admin";
  body: string;
  created_at: string;
}

const TOKEN_KEY = "xtox_visitor_token";

function getVisitorToken(): string {
  let t = localStorage.getItem(TOKEN_KEY);
  if (!t) {
    t = crypto.randomUUID() + "-" + Date.now().toString(36);
    localStorage.setItem(TOKEN_KEY, t);
  }
  return t;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"intro" | "chat">("intro");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const lastAtRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const token = getVisitorToken();
    fetch(`/api/chat?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.messages) && d.messages.length > 0) {
          setPhase("chat");
          setMessages(d.messages);
          lastAtRef.current = d.messages[d.messages.length - 1]?.created_at ?? null;
        }
      })
      .catch(() => {});
  }, [open]);

  // Poll for admin replies while chat open
  useEffect(() => {
    if (!open || phase !== "chat") return;
    const iv = setInterval(async () => {
      try {
        const token = getVisitorToken();
        const qs = lastAtRef.current
          ? `&after=${encodeURIComponent(lastAtRef.current)}`
          : "";
        const r = await fetch(`/api/chat?token=${encodeURIComponent(token)}${qs}`);
        const d = await r.json();
        if (d.ok && Array.isArray(d.messages) && d.messages.length > 0) {
          setMessages((m) => [...m, ...d.messages]);
          lastAtRef.current = d.messages[d.messages.length - 1]?.created_at ?? lastAtRef.current;
        }
      } catch {
        /* ignore poll errors */
      }
    }, 4000);
    return () => clearInterval(iv);
  }, [open, phase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const body = text.trim();
      if (!body || sending) return;
      setSending(true);
      setError(null);
      try {
        const token = getVisitorToken();
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorToken: token, name, phone, body }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setConfigured(res.status !== 503);
          throw new Error(data.error || "Could not send");
        }
        setConfigured(true);
        setPhase("chat");
        setMessages(data.messages);
        lastAtRef.current =
          data.messages[data.messages.length - 1]?.created_at ?? lastAtRef.current;
        setText("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send");
      } finally {
        setSending(false);
      }
    },
    [text, name, phone, sending]
  );

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-black text-brand-yellow shadow-hero transition-all duration-300 hover:scale-105 hover:bg-brand-yellow hover:text-brand-black"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-hero animate-fadeUp">
          <div className="flex items-center gap-3 bg-brand-black px-4 py-3.5 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
              <MessageCircle className="h-4.5 w-4.5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold">XtoX Support</p>
              <p className="text-xs text-white/60">Typically replies in minutes</p>
            </div>
          </div>

          {phase === "intro" ? (
            <form
              onSubmit={send}
              className="flex flex-1 flex-col gap-3 p-4"
            >
              <p className="text-sm font-bold">Hi there 👋</p>
              <p className="text-sm leading-relaxed text-muted">
                Message us and our team will reply right here — no app, no phone queue.
              </p>
              <input
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Your name"
              />
              <input
                className="input"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-label="Phone number"
              />
              <textarea
                className="input flex-1 resize-none"
                rows={3}
                placeholder="How can we help?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                aria-label="Your message"
                required
              />
              {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                {sending ? "Sending…" : "Start chat"}
              </button>
            </form>
          ) : (
            <>
              <div className="flex-1 space-y-2.5 overflow-y-auto bg-neutral-50 p-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.sender === "visitor"
                        ? "ml-auto bg-brand-black text-white"
                        : "border border-line bg-white text-brand-black"
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3">
                <input
                  className="input !py-2.5"
                  placeholder="Type a message…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Type a message"
                />
                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-black text-brand-yellow transition-colors hover:bg-brand-yellow hover:text-brand-black disabled:opacity-40"
                  aria-label="Send message"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                </button>
              </form>
            </>
          )}

          {!configured && (
            <p className="border-t border-line bg-neutral-50 px-4 py-2 text-center text-xs text-muted">
              Chat database not connected yet — call us at +91 78754 88307
            </p>
          )}
        </div>
      )}
    </>
  );
}
