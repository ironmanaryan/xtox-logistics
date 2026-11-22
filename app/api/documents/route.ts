import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "exim-documents";
const MAX_FILES = 10;
/** Signed direct-to-storage uploads skip the serverless request body, so they can be larger. */
const MAX_SIGNED_BYTES = 20 * 1024 * 1024;
/** Vercel caps request bodies at 4.5 MB, so the proxied path stays well below that. */
const MAX_INLINE_BYTES = 4 * 1024 * 1024;

const ALLOWED_EXT = new Set([
  "pdf", "jpg", "jpeg", "png", "webp", "heic",
  "doc", "docx", "xls", "xlsx", "csv", "txt", "odt", "rtf",
]);

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg", "image/png", "image/webp", "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv", "text/plain",
  "application/rtf",
  "application/vnd.oasis.opendocument.text",
]);

const RULE = "PDF, Word, Excel, CSV, TXT or image files";

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "document";
}

function extOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function allowed(name: string, type: string): boolean {
  return (type !== "" && ALLOWED_MIME.has(type)) || ALLOWED_EXT.has(extOf(name));
}

function safeRef(ref: string): string {
  return ref.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
}

/** The bucket is provisioned by supabase/storage-schema.sql; create it on the fly if missing. */
async function ensureBucket(supabase: SupabaseClient): Promise<boolean> {
  const { error } = await supabase.storage.getBucket(BUCKET);
  if (!error) return true;

  console.warn("document bucket lookup failed:", error.message);
  const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: false });
  if (createError && !/already|exist|duplicate/i.test(createError.message)) {
    console.error("document bucket create failed:", createError.message);
  }

  // Trust the bucket only once it can actually be read back.
  const { error: recheck } = await supabase.storage.getBucket(BUCKET);
  if (recheck) console.error("document bucket still unavailable:", recheck.message);
  return !recheck;
}

/** Upload directly from the browser to Supabase Storage with a short-lived signed URL. */
async function handleSigned(req: Request, supabase: SupabaseClient) {
  let payload: { ref?: unknown; files?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const ref = typeof payload.ref === "string" ? payload.ref.trim() : "";
  const files = Array.isArray(payload.files) ? payload.files : [];
  if (!ref || files.length === 0 || files.length > MAX_FILES) {
    return NextResponse.json(
      { ok: false, error: `Add a reference and 1–${MAX_FILES} files.` },
      { status: 400 }
    );
  }

  const refDir = safeRef(ref);
  const targets: { name: string; path: string; signedUrl: string }[] = [];

  for (const raw of files) {
    const file = raw as { name?: unknown; type?: unknown; size?: unknown };
    const name = typeof file.name === "string" ? file.name : "";
    const type = typeof file.type === "string" ? file.type : "";
    const size = typeof file.size === "number" ? file.size : 0;

    if (!name || !allowed(name, type) || size <= 0) {
      return NextResponse.json(
        { ok: false, error: `${name || "File"}: ${RULE} only.` },
        { status: 400 }
      );
    }
    if (size > MAX_SIGNED_BYTES) {
      return NextResponse.json(
        { ok: false, error: `${name}: files must be under 20 MB.` },
        { status: 400 }
      );
    }

    const path = `${refDir}/${Date.now()}-${targets.length}-${safeName(name)}`;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      console.error("document sign error:", error?.message);
      return NextResponse.json({ ok: false, error: "Could not prepare the upload." }, { status: 500 });
    }
    targets.push({ name, path, signedUrl: data.signedUrl });
  }

  return NextResponse.json({ ok: true, files: targets });
}

/** Legacy multipart upload — small files proxied through this route. */
async function handleMultipart(req: Request, supabase: SupabaseClient) {
  try {
    const form = await req.formData();
    const ref = String(form.get("ref") ?? "").trim();
    const docType = String(form.get("docType") ?? "Other").trim();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);

    if (!ref || files.length === 0 || files.length > MAX_FILES) {
      return NextResponse.json(
        { ok: false, error: `Add a reference and 1–${MAX_FILES} files.` },
        { status: 400 }
      );
    }

    const uploaded: string[] = [];
    const refDir = safeRef(ref);
    for (const file of files) {
      if (!allowed(file.name, file.type) || file.size <= 0) {
        return NextResponse.json({ ok: false, error: `${file.name}: ${RULE} only.` }, { status: 400 });
      }
      if (file.size > MAX_INLINE_BYTES) {
        return NextResponse.json(
          { ok: false, error: `${file.name}: files over 4 MB go straight to storage — reload the page and retry.` },
          { status: 400 }
        );
      }
      const path = `${refDir}/${Date.now()}-${uploaded.length}-${safeName(file.name)}`;
      const buf = Buffer.from(await file.arrayBuffer());
      const { error } = await supabase.storage.from(BUCKET).upload(path, buf, {
        contentType: file.type || "application/octet-stream",
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

export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Document storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase/storage-schema.sql.",
      },
      { status: 503 }
    );
  }

  if (!(await ensureBucket(supabase))) {
    return NextResponse.json(
      { ok: false, error: "Document storage bucket is unavailable. Run supabase/storage-schema.sql." },
      { status: 503 }
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return handleSigned(req, supabase);
  return handleMultipart(req, supabase);
}
