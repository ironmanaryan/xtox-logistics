"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";
import { MAX_BYTES, MAX_DOC_BYTES, compressImage, fmtSize, isAllowedDocFile, isImageFile } from "@/lib/compress-image";
import { uploadDocuments } from "@/lib/doc-upload";

const DOC_TYPES = [
  "Commercial Invoice",
  "Packing List",
  "Bill of Lading / AWB",
  "IEC Certificate",
  "GST Registration",
  "Certificate of Origin",
  "Phytosanitary Certificate",
  "Insurance Policy",
  "Other",
];

interface PickedFile {
  id: string;
  name: string;
  originalSize: number;
  finalSize: number;
  compressed: boolean;
  blob: Blob | null;
  error: string | null;
}

const fmt = fmtSize;

export default function DocumentUploader() {
  const [ref, setRef] = useState("");
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string[] | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    setError(null);
    const next: PickedFile[] = [];
    for (const file of Array.from(list)) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      if (!isAllowedDocFile(file)) {
        next.push({ id, name: file.name, originalSize: file.size, finalSize: file.size, compressed: false, blob: null, error: "Unsupported file — use PDF, Word, Excel, CSV, TXT or an image." });
        continue;
      }
      if (file.size > MAX_DOC_BYTES) {
        next.push({ id, name: file.name, originalSize: file.size, finalSize: file.size, compressed: false, blob: null, error: `${fmt(file.size)} is over the 20 MB limit.` });
        continue;
      }
      if (isImageFile(file) && file.size > MAX_BYTES) {
        try {
          const blob = await compressImage(file);
          next.push({
            id,
            name: file.name.replace(/\.(png|jpg|jpeg|webp)$/i, ".jpg"),
            originalSize: file.size,
            finalSize: blob.size,
            compressed: true,
            blob,
            error: null,
          });
        } catch {
          // Compression is a convenience only — upload the original instead.
          next.push({ id, name: file.name, originalSize: file.size, finalSize: file.size, compressed: false, blob: file, error: null });
        }
        continue;
      }
      next.push({ id, name: file.name, originalSize: file.size, finalSize: file.size, compressed: false, blob: file, error: null });
    }
    setFiles((f) => [...f, ...next].slice(0, 10));
    e.target.value = "";
  };

  const remove = (id: string) => setFiles((f) => f.filter((x) => x.id !== id));

  const uploadable = files.filter((f) => !f.error && f.blob);

  const onUpload = async () => {
    setError(null);
    if (!ref.trim()) {
      setError("Please enter your shipment reference or phone number.");
      return;
    }
    if (uploadable.length === 0) {
      setError("Please choose at least one valid document (PDF, Word, Excel, CSV, TXT or an image up to 20 MB).");
      return;
    }
    if (!agree) {
      setError("Please confirm that you are authorised to share these documents and accept the Terms & Conditions.");
      return;
    }
    setBusy(true);
    try {
      const result = await uploadDocuments({
        ref,
        docType,
        files: uploadable.map((f) => ({ name: f.name, blob: f.blob as Blob })),
      });
      if (!result.ok) throw new Error(result.error || "Upload failed");
      setDone(result.files);
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="card flex flex-col items-center p-8 text-center sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-4 text-2xl font-extrabold">Documents received!</h3>
        <ul className="mt-3 w-full max-w-md space-y-1.5 text-left">
          {done.map((n) => (
            <li key={n} className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2 text-sm font-medium">
              <FileText className="h-4 w-4 shrink-0" aria-hidden /> {n}
            </li>
          ))}
        </ul>
        <p className="mt-3 max-w-md text-sm text-muted">
          Our EXIM desk verifies every file against your shipment within 24 hours.
        </p>
        <button type="button" onClick={() => setDone(null)} className="btn-secondary mt-6">
          Upload more documents
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="doc-ref" className="label">Shipment ref / phone</label>
          <input id="doc-ref" className="input" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. XTX123456 or 98765 43210" />
        </div>
        <div>
          <label htmlFor="doc-type" className="label">Document type</label>
          <select id="doc-type" className="input" value={docType} onChange={(e) => setDocType(e.target.value)}>
            {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <label
        htmlFor="doc-files"
        className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-neutral-50 px-6 py-10 text-center transition-colors hover:border-brand-black"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-black">
          <Upload className="h-6 w-6" aria-hidden />
        </span>
        <span className="text-sm font-extrabold">Click to choose files — PDF, Word, Excel, CSV, images</span>
        <span className="text-xs text-muted">Any document up to 20 MB. Photos over 2 MB are auto-compressed. Max 10 files.</span>
      </label>
      <input
        id="doc-files"
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.csv,.txt,.odt,.rtf"
        className="hidden"
        onChange={onPick}
      />

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f) => (
            <li key={f.id} className={`flex items-center gap-3 rounded-2xl border p-3 text-sm ${f.error ? "border-red-200 bg-red-50" : "border-line bg-white"}`}>
              <FileText className="h-5 w-5 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{f.name}</p>
                <p className={`text-xs ${f.error ? "font-medium text-red-600" : "text-muted"}`}>
                  {f.error ?? (
                    <>
                      {fmt(f.originalSize)}
                      {f.compressed && (
                        <span className="font-bold text-green-700"> → {fmt(f.finalSize)} (compressed ✓)</span>
                      )}
                      {!f.compressed && " ✓"}
                    </>
                  )}
                </p>
              </div>
              <button type="button" onClick={() => remove(f.id)} aria-label={`Remove ${f.name}`} className="rounded-lg p-1.5 hover:bg-neutral-100">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label htmlFor="doc-agree" className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted">
        <input
          id="doc-agree"
          type="checkbox"
          checked={agree}
          onChange={(e) => { setAgree(e.target.checked); setError(null); }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#111111]"
        />
        <span>
          I confirm I am authorised to share these documents, and I accept the{" "}
          <Link href="/terms" className="font-semibold text-brand-black underline underline-offset-2">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-brand-black underline underline-offset-2">
            Privacy Policy
          </Link>
          . Documents are used only to process this shipment.
        </span>
      </label>

      <button type="button" onClick={onUpload} disabled={busy || uploadable.length === 0} className="btn-primary mt-5 w-full disabled:opacity-60">
        {busy ? "Uploading…" : `Upload ${uploadable.length} document${uploadable.length === 1 ? "" : "s"}`}
      </button>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}
    </div>
  );
}
