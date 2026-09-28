import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ ok: false, error: "Tracking code required" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Database not configured. Set Supabase env vars." },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("shipments")
    .select("tracking_code, origin, destination, status, current_location, eta_date, updated_at")
    .eq("tracking_code", code)
    .maybeSingle();

  if (error) {
    // Table doesn't exist yet (DB schema not run) — degrade gracefully instead of a hard 500
    const pgCode = (error as { code?: string }).code ?? "";
    if (
      pgCode === "PGRST205" ||
      pgCode === "42P01" ||
      /does not exist|schema cache/i.test(error.message)
    ) {
      return NextResponse.json(
        { ok: false, error: "Tracking not available yet. Database is being set up." },
        { status: 503 }
      );
    }
    console.error("track lookup error:", error.message);
    return NextResponse.json({ ok: false, error: "Lookup failed" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ ok: false, error: "Shipment not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, shipment: data });
}
