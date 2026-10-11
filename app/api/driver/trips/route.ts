import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function cleanPhone(raw: unknown): string {
  const d = String(raw ?? "").replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(d) ? d : "";
}

/** Driver's own trips + open loads board. Body: { phone } */
export async function POST(req: Request) {
  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  const phone = cleanPhone(body.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, error: "Invalid phone" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  const [open, mine] = await Promise.all([
    supabase.from("loads").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(30),
    supabase.from("loads").select("*").eq("driver_phone", phone).neq("status", "open").order("created_at", { ascending: false }).limit(30),
  ]);

  return NextResponse.json({ ok: true, open: open.data ?? [], mine: mine.data ?? [] });
}
