import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validSession, sessionFromRequest } from "@/lib/admin-auth";

export async function POST(req: Request) {
  if (!validSession(sessionFromRequest(req))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { conversationId, body } = (await req.json()) ?? {};
    const message = typeof body === "string" ? body.trim().slice(0, 2000) : "";
    if (typeof conversationId !== "string" || !message) {
      return NextResponse.json({ ok: false, error: "conversationId and body required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
        { status: 503 }
      );
    }

    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender: "admin",
      body: message,
    });
    if (error) {
      console.error("admin reply insert error:", error.message);
      return NextResponse.json({ ok: false, error: "Could not send reply" }, { status: 500 });
    }

    await supabase
      .from("chat_conversations")
      .update({
        last_message_at: new Date().toISOString(),
        admin_unread: 0,
        visitor_unread: 1,
      })
      .eq("id", conversationId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
