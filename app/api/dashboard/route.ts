import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Customer dashboard data. Client sends its Supabase access token;
 * we validate it server-side and return only that user's bookings.
 * Body: { token: string, phone?: string } (phone saves/updates profile)
 */
export async function POST(req: Request) {
  let body: { token?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (!body.token) {
    return NextResponse.json({ ok: false, error: "Login required" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser(body.token);
  const user = userData?.user;
  if (userErr || !user) {
    return NextResponse.json({ ok: false, error: "Session expired — please log in again" }, { status: 401 });
  }

  const cleanPhone = (body.phone ?? "").replace(/\D/g, "").slice(-10);

  let profilePhone = "";
  const { data: profile } = await supabase.from("profiles").select("phone, full_name").eq("id", user.id).single();
  if (profile?.phone) profilePhone = profile.phone;
  if (cleanPhone.length === 10) {
    await supabase.from("profiles").upsert({ id: user.id, phone: cleanPhone }, { onConflict: "id" });
    profilePhone = cleanPhone;
  }

  let query = supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(50);
  if (profilePhone) {
    query = query.or(`user_id.eq.${user.id},phone.eq.${profilePhone}`);
  } else {
    query = query.eq("user_id", user.id);
  }
  const { data: quotes } = await query;

  return NextResponse.json({
    ok: true,
    email: user.email ?? "",
    phone: profilePhone,
    quotes: quotes ?? [],
  });
}
