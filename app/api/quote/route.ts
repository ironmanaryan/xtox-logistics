import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, service, phone, from, to, details } = body ?? {};

    if (!name || !service || !phone || !from || !to) {
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

    const { error } = await supabase.from("quote_requests").insert({
      name,
      company: company || null,
      service,
      phone,
      from_city: from,
      to_city: to,
      cargo_details: details || null,
    });

    if (error) {
      console.error("quote insert error:", error.message);
      return NextResponse.json({ ok: false, error: "Failed to save request" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
