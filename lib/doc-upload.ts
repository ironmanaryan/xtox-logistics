"use client";

/**
 * Upload documents to the private Supabase Storage bucket.
 * Files go straight from the browser to storage with a signed URL issued by
 * /api/documents, so size is not limited by the serverless request body.
 */

export interface UploadFile {
  name: string;
  blob: Blob;
}

export interface UploadResult {
  ok: boolean;
  files: string[];
  error?: string;
}

interface SignResponse {
  ok?: boolean;
  error?: string;
  files?: { name: string; path: string; signedUrl: string }[];
}

async function uploadViaRoute(ref: string, docType: string, files: UploadFile[]): Promise<UploadResult> {
  const fd = new FormData();
  fd.append("ref", ref.trim());
  fd.append("docType", docType);
  for (const f of files) fd.append("files", f.blob, f.name);
  const res = await fetch("/api/documents", { method: "POST", body: fd });
  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; files?: string[] } | null;
  if (!res.ok || !data?.ok) {
    return { ok: false, files: [], error: data?.error ?? "Upload failed." };
  }
  return { ok: true, files: data.files ?? [] };
}

export async function uploadDocuments(opts: {
  ref: string;
  docType: string;
  files: UploadFile[];
}): Promise<UploadResult> {
  const ref = opts.ref.trim();
  const { docType, files } = opts;
  if (!ref || files.length === 0) {
    return { ok: false, files: [], error: "Missing reference or files." };
  }

  let res: Response;
  try {
    res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sign",
        ref,
        docType,
        files: files.map((f) => ({ name: f.name, type: f.blob.type, size: f.blob.size })),
      }),
    });
  } catch {
    return { ok: false, files: [], error: "Network error — check your connection and retry." };
  }

  // Older deployments only know the multipart route.
  if (res.status === 404 || res.status === 405 || res.status === 501) {
    return uploadViaRoute(ref, docType, files);
  }

  const signed = (await res.json().catch(() => null)) as SignResponse | null;
  if (!res.ok || !signed?.ok || !signed.files?.length) {
    return { ok: false, files: [], error: signed?.error ?? "Upload failed." };
  }

  const done: string[] = [];
  for (let i = 0; i < signed.files.length; i++) {
    const target = signed.files[i];
    const file = files[i];
    const put = await fetch(target.signedUrl, {
      method: "PUT",
      headers: { "content-type": file.blob.type || "application/octet-stream" },
      body: file.blob,
    });
    if (!put.ok) {
      return {
        ok: false,
        files: done,
        error: `${file.name}: upload failed (${put.status}). Try again.`,
      };
    }
    done.push(`${docType}: ${file.name}`);
  }

  return { ok: true, files: done };
}
