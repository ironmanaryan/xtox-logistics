import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sessionFromRequest, validSession } from "@/lib/admin-auth";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];

function authorised(req: Request): boolean {
  return validSession(sessionFromRequest(req));
}

export async function GET(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorised" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
      { status: 503 }
    );
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const search = (url.searchParams.get("q") ?? "").trim();

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  if (status && STATUSES.includes(status as Status)) query = query.eq("status", status);
  if (search) {
    const safe = search.replace(/[%,()]/g, "");
    query = query.or(
      `name.ilike.%${safe}%,phone.ilike.%${safe}%,service.ilike.%${safe}%,from_city.ilike.%${safe}%,to_city.ilike.%${safe}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("leads list error:", error.message);
    const missing = error.code === "PGRST205" || /schema cache/i.test(error.message ?? "");
    return NextResponse.json(
      {
        ok: false,
        error: missing
          ? "Leads table missing — run supabase/leads-schema.sql in Supabase."
          : "Could not load leads",
      },
      { status: missing ? 503 : 500 }
    );
  }

  return NextResponse.json({ ok: true, leads: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorised" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
      { status: 503 }
    );
  }

  let body: { id?: string; status?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ ok: false, error: "Missing lead id" }, { status: 400 });
  }
  if (body.status && !STATUSES.includes(body.status as Status)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (body.status) patch.status = body.status;
  if (typeof body.notes === "string") patch.notes = body.notes.slice(0, 2000);

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabase.from("leads").update(patch).eq("id", body.id);
  if (error) {
    console.error("lead update error:", error.message);
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
