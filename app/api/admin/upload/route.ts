import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validSession, sessionFromRequest } from "@/lib/admin-auth";

const BUCKET = "content-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/jpg", "image/webp"]);

/** Admin-only cover image upload → returns public URL. */
export async function POST(req: Request) {
  if (!validSession(sessionFromRequest(req))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (!file || !ALLOWED.has(file.type) || file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Only JPG/PNG/WebP images under 5 MB allowed" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Storage not configured" }, { status: 503 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buf, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error("cover upload error:", error.message);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
