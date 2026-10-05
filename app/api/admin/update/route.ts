import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validSession, sessionFromRequest } from "@/lib/admin-auth";

const ALLOWED: Record<string, { table: string; statuses: string[] }> = {
  quotes: {
    table: "quote_requests",
    statuses: ["new", "contacted", "quoted", "won", "lost"],
  },
  drivers: {
    table: "driver_applications",
    statuses: ["pending", "verified", "rejected", "onboarded"],
  },
};

export async function POST(req: Request) {
  if (!validSession(sessionFromRequest(req))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { table?: string; id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const config = body.table ? ALLOWED[body.table] : undefined;
  if (!config || !body.id || !config.statuses.includes(body.status ?? "")) {
    return NextResponse.json({ ok: false, error: "Invalid table, id or status" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  const { error } = await supabase.from(config.table).update({ status: body.status }).eq("id", body.id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
