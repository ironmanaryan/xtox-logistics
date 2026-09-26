import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, city, vehicle, experience, rc, license } = body ?? {};

    if (!name || !phone || !city || !vehicle || !rc || !license) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Database not configured. Set Supabase env vars." },
        { status: 503 }
      );
    }

    const { error } = await supabase.from("driver_applications").insert({
      name,
      phone,
      city,
      vehicle_type: vehicle,
      experience_years: Number(experience) || 0,
      rc_number: rc,
      license_number: license,
    });

    if (error) {
      console.error("driver insert error:", error.message);
      return NextResponse.json({ ok: false, error: "Failed to save application" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
