import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validSession, sessionFromRequest } from "@/lib/admin-auth";

/**
 * Generic admin delete: leads, driver applications, chat conversations
 * (messages cascade), uploaded documents.
 * Body: { target: "quote" | "driver" | "conversation" | "document", id?: string, path?: string }
 */
export async function POST(req: Request) {
  if (!validSession(sessionFromRequest(req))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: { target?: string; id?: string; path?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    if ((body.target === "quote" || body.target === "driver" || body.target === "conversation") && body.id) {
      const table =
        body.target === "quote"
          ? "quote_requests"
          : body.target === "driver"
            ? "driver_applications"
            : "chat_conversations";
      const { error } = await supabase.from(table).delete().eq("id", body.id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    if (body.target === "document" && body.path) {
      const { error } = await supabase.storage.from("exim-documents").remove([body.path]);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
  } catch (e) {
    console.error("admin delete error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: "Delete failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: false, error: "Invalid target" }, { status: 400 });
}
