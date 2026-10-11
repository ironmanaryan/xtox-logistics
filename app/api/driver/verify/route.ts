import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function cleanPhone(raw: unknown): string {
  const d = String(raw ?? "").replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(d) ? d : "";
}

/** Driver login: phone must belong to a registered driver application. */
export async function POST(req: Request) {
  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  const phone = cleanPhone(body.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  const { data } = await supabase
    .from("driver_applications")
    .select("name, city, vehicle_type, status")
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Number not registered. Apply first on the Drivers page." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true, driver: data });
}
