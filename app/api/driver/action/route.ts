import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function cleanPhone(raw: unknown): string {
  const d = String(raw ?? "").replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(d) ? d : "";
}

async function verifiedDriver(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>, phone: string) {
  const { data } = await supabase
    .from("driver_applications")
    .select("id, status")
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (!data) return { ok: false as const, error: "Driver not registered" };
  if (!["verified", "onboarded"].includes(data.status)) {
    return { ok: false as const, error: `Application status: ${data.status}. Trips unlock after verification.` };
  }
  return { ok: true as const };
}

/** Claim / pickup / deliver loads. Body: { phone, loadId, action } */
export async function POST(req: Request) {
  let body: { phone?: string; loadId?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  const phone = cleanPhone(body.phone);
  if (!phone || !body.loadId || !["claim", "pickup", "deliver"].includes(body.action ?? "")) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  const v = await verifiedDriver(supabase, phone);
  if (!v.ok) return NextResponse.json({ ok: false, error: v.error }, { status: 403 });

  if (body.action === "claim") {
    const { data, error } = await supabase
      .from("loads")
      .update({ status: "claimed", driver_phone: phone })
      .eq("id", body.loadId)
      .eq("status", "open")
      .select("id");
    if (error || !data || data.length === 0) {
      return NextResponse.json({ ok: false, error: "Load already taken or unavailable" }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  }

  const next = body.action === "pickup" ? "picked" : "delivered";
  const from = body.action === "pickup" ? "claimed" : "picked";
  const { data, error } = await supabase
    .from("loads")
    .update({ status: next })
    .eq("id", body.loadId)
    .eq("driver_phone", phone)
    .eq("status", from)
    .select("id");
  if (error || !data || data.length === 0) {
    return NextResponse.json({ ok: false, error: "Trip not found or wrong state" }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
