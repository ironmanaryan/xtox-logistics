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
      .limit(100),
    supabase
      .from("driver_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const convIds = (convs.data ?? []).map((c) => c.id);
  const { data: messages } = convIds.length
    ? await supabase
        .from("chat_messages")
        .select("conversation_id, sender, body, created_at")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  // Uploaded EXIM/SME/Agri documents (private bucket → signed URLs valid 1 hr)
  let documents: {
    ref: string;
    name: string;
    path: string;
    size: number;
    created: string | null;
    url: string;
  }[] = [];
  try {
    const { data: folders } = await supabase.storage.from("exim-documents").list("", { limit: 100 });
    const dirs = (folders ?? []).filter((f) => !f.metadata);
    for (const dir of dirs.slice(0, 30)) {
      const { data: files } = await supabase.storage.from("exim-documents").list(dir.name, { limit: 100 });
      for (const f of files ?? []) {
        if (!f.metadata) continue;
        const path = `${dir.name}/${f.name}`;
        const { data: signed } = await supabase.storage.from("exim-documents").createSignedUrl(path, 3600);
        if (signed?.signedUrl) {
          documents.push({
            ref: dir.name,
            name: f.name.replace(/^\d+-/, ""),
            path,
            size: (f.metadata as { size?: number }).size ?? 0,
            created: (f as { created_at?: string }).created_at ?? null,
            url: signed.signedUrl,
          });
        }
      }
    }
    documents.sort((a, b) => (b.created ?? "").localeCompare(a.created ?? ""));
    documents = documents.slice(0, 200);
  } catch {
    documents = [];
  }

  return NextResponse.json({
    ok: true,
    conversations: convs.data ?? [],
    messages: messages ?? [],
    quotes: quotes.data ?? [],
    drivers: drivers.data ?? [],
    documents,
    resources: resources ?? [],
  });
}
