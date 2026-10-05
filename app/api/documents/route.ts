import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "exim-documents";
const MAX_BYTES = 2.5 * 1024 * 1024;
const ALLOWED = new Set(["application/pdf", "image/jpeg", "image/png", "image/jpg"]);

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "document";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const ref = String(form.get("ref") ?? "").trim();
    const docType = String(form.get("docType") ?? "Other").trim();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);

    if (!ref || files.length === 0 || files.length > 10) {
      return NextResponse.json({ ok: false, error: "Missing reference or files (max 10)" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Document storage not configured. Run supabase/storage-schema.sql and set env vars." },
        { status: 503 }
      );
    }

    const uploaded: string[] = [];
    const safeRef = ref.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    for (const file of files) {
      if (!ALLOWED.has(file.type) || file.size <= 0 || file.size > MAX_BYTES) {
        return NextResponse.json(
          { ok: false, error: `${file.name}: only PDF/JPG/PNG under 2 MB allowed` },
          { status: 400 }
        );
      }
      const path = `${safeRef}/${Date.now()}-${safeName(file.name)}`;
      const buf = Buffer.from(await file.arrayBuffer());
      const { error } = await supabase.storage.from(BUCKET).upload(path, buf, {
        contentType: file.type,
        upsert: false,
      });
      if (error) {
        console.error("document upload error:", error.message);
        return NextResponse.json({ ok: false, error: `Failed to store ${file.name}` }, { status: 500 });
      }
      uploaded.push(`${docType}: ${file.name}`);
    }

    return NextResponse.json({ ok: true, files: uploaded });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
