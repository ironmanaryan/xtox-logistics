import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validSession, sessionFromRequest } from "@/lib/admin-auth";

export async function GET(req: Request) {
  if (!validSession(sessionFromRequest(req))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
      { status: 503 }
    );
  }

  const [convs, quotes, drivers] = await Promise.all([
    supabase
      .from("chat_conversations")
      .select("id, visitor_token, name, phone, created_at, last_message_at, admin_unread")
      .order("last_message_at", { ascending: false })
      .limit(50),
    supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("driver_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const convIds = (convs.data ?? []).map((c) => c.id);
  const { data: messages } = convIds.length
    ? await supabase
        .from("chat_messages")
        .select("conversation_id, sender, body, created_at")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  return NextResponse.json({
    ok: true,
    conversations: convs.data ?? [],
    messages: messages ?? [],
    quotes: quotes.data ?? [],
    drivers: drivers.data ?? [],
  });
}
