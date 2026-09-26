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
    console.error("track lookup error:", error.message);
    return NextResponse.json({ ok: false, error: "Lookup failed" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ ok: false, error: "Shipment not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, shipment: data });
}
