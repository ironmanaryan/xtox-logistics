import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function badToken(token: unknown): token is undefined {
  return typeof token !== "string" || token.length < 8 || token.length > 100;
}

/**
 * POST /api/chat
 * body: { visitorToken, name?, phone?, body }
 * - Ensures a conversation exists for visitorToken (creates with name/phone on first message)
 * - Inserts the visitor message, bumps last_message_at + admin_unread
 * - Returns the full recent thread so the widget can render immediately
 */
export async function POST(req: Request) {
  try {
    const { visitorToken, name, phone, body } = (await req.json()) ?? {};

    if (badToken(visitorToken)) {
      return NextResponse.json({ ok: false, error: "Invalid visitor token" }, { status: 400 });
    }
    const message = typeof body === "string" ? body.trim().slice(0, 2000) : "";
    if (!message) {
      return NextResponse.json({ ok: false, error: "Message required" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Chat not configured yet" }, { status: 503 });
    }

    // Find or create the conversation
    const { data: existing } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("visitor_token", visitorToken)
      .maybeSingle();

    let conversationId = existing?.id as string | undefined;

    if (!conversationId) {
      const { data: created, error } = await supabase
        .from("chat_conversations")
        .insert({
          visitor_token: visitorToken,
          name: typeof name === "string" ? name.slice(0, 120) : null,
          phone: typeof phone === "string" ? phone.slice(0, 20) : null,
        })
        .select("id")
        .single();
      if (error) {
        console.error("chat conv create error:", error.message);
        return NextResponse.json({ ok: false, error: "Could not start chat" }, { status: 500 });
      }
      conversationId = created.id;
    }

    const { error: msgError } = await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender: "visitor",
      body: message,
    });
    if (msgError) {
      console.error("chat msg insert error:", msgError.message);
      return NextResponse.json({ ok: false, error: "Could not send message" }, { status: 500 });
    }

    // Bump conversation: last_message_at + admin_unread (select+update to increment safely)
    const { data: conv } = await supabase
      .from("chat_conversations")
      .select("admin_unread")
      .eq("id", conversationId)
      .single();
    await supabase
      .from("chat_conversations")
      .update({
        last_message_at: new Date().toISOString(),
        admin_unread: ((conv?.admin_unread as number | undefined) ?? 0) + 1,
      })
      .eq("id", conversationId);

    const { data: messages } = await supabase
      .from("chat_messages")
      .select("sender, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(100);

    return NextResponse.json({ ok: true, messages: messages ?? [] });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

/**
 * GET /api/chat?token=...&after=<iso>
 * Long-ish poll for visitor: returns admin replies newer than `after`.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const after = searchParams.get("after");

  if (badToken(token)) {
    return NextResponse.json({ ok: false, error: "Invalid visitor token" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Chat not configured yet" }, { status: 503 });
  }

  const { data: conv } = await supabase
    .from("chat_conversations")
    .select("id, visitor_unread")
    .eq("visitor_token", token)
    .maybeSingle();

  if (!conv) return NextResponse.json({ ok: true, messages: [] });

  let query = supabase
    .from("chat_messages")
    .select("sender, body, created_at")
    .eq("conversation_id", conv.id)
    .order("created_at", { ascending: true })
    .limit(100);

  if (after) query = query.gt("created_at", after);

  const { data: messages } = await query;

  // Reset visitor unread once delivered
  if ((conv.visitor_unread ?? 0) > 0) {
    await supabase.from("chat_conversations").update({ visitor_unread: 0 }).eq("id", conv.id);
  }

  return NextResponse.json({ ok: true, messages: messages ?? [] });
}
