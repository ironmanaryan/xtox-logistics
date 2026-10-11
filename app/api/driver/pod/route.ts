import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["application/pdf", "image/jpeg", "image/png", "image/jpg"]);

function cleanPhone(raw: unknown): string {
  const d = String(raw ?? "").replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(d) ? d : "";
}

/** POD upload by the assigned driver. FormData: phone, loadId, file. */
export async function POST(req: Request) {
  let phone = "";
  let loadId = "";
  let file: File | null = null;
  try {
    const form = await req.formData();
    phone = cleanPhone(form.get("phone"));
    loadId = String(form.get("loadId") ?? "");
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (!phone || !loadId) {
    return NextResponse.json({ ok: false, error: "Missing phone or trip" }, { status: 400 });
  }
  if (!file || !ALLOWED.has(file.type) || file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Only PDF/JPG/PNG under 5 MB allowed" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Storage not configured" }, { status: 503 });
  }

  const { data: load } = await supabase
    .from("loads")
    .select("id")
    .eq("id", loadId)
    .eq("driver_phone", phone)
    .in("status", ["claimed", "picked", "delivered"])
    .single();
  if (!load) {
    return NextResponse.json({ ok: false, error: "Trip not assigned to you" }, { status: 403 });
  }

  const path = `pod/${loadId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80)}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("exim-documents").upload(path, buf, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
  await supabase.from("loads").update({ pod_path: path }).eq("id", loadId);
  return NextResponse.json({ ok: true });
}
