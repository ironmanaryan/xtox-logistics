"use client";

import { FileText, Upload, X } from "lucide-react";
import { ACCEPT, MAX_BYTES, compressImage, fmtSize, isImageFile, isPdfFile } from "@/lib/compress-image";

export interface PickedDoc {
  id: string;
  name: string;
  originalSize: number;
  finalSize: number;
  compressed: boolean;
  blob: Blob | null;
  error: string | null;
}

interface DocPickerProps {
  id: string;
  files: PickedDoc[];
  onChange: (files: PickedDoc[]) => void;
  maxFiles?: number;
  hint?: string;
}

/** Compact multi-file picker with in-browser image compression. Lift state up via onChange. */
export default function DocPicker({ id, files, onChange, maxFiles = 5, hint }: DocPickerProps) {
  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    const next: PickedDoc[] = [];
    for (const file of Array.from(list)) {
      const docId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const image = isImageFile(file);
      const pdf = isPdfFile(file);
      if (!image && !pdf) {
        next.push({ id: docId, name: file.name, originalSize: file.size, finalSize: file.size, compressed: false, blob: null, error: "Only PDF, JPG or PNG allowed" });
        continue;
      }
      if (pdf && file.size > MAX_BYTES) {
        next.push({ id: docId, name: file.name, originalSize: file.size, finalSize: file.size, compressed: false, blob: null, error: `PDF is ${fmtSize(file.size)} — upload a scan under 2 MB.` });
        continue;
      }
      if (image && file.size > MAX_BYTES) {
        try {
          const blob = await compressImage(file);
          next.push({
            id: docId,
            name: file.name.replace(/\.(png|jpg|jpeg)$/i, ".jpg"),
            originalSize: file.size,
            finalSize: blob.size,
            compressed: true,
            blob,
            error: blob.size > MAX_BYTES ? "Still over 2 MB — try a smaller photo." : null,
          });
        } catch {
          next.push({ id: docId, name: file.name, originalSize: file.size, finalSize: file.size, compressed: false, blob: null, error: "Could not compress this image." });
        }
        continue;
      }
      next.push({ id: docId, name: file.name, originalSize: file.size, finalSize: file.size, compressed: false, blob: file, error: null });
    }
    onChange([...files, ...next].slice(0, maxFiles));
    e.target.value = "";
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-neutral-50 px-4 py-5 text-center transition-colors hover:border-brand-black"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
          <Upload className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-left">
          <span className="block text-sm font-extrabold">Attach files — PDF, JPG, PNG</span>
          <span className="block text-xs text-muted">{hint ?? `Photos auto-compress under 2 MB. Max ${maxFiles} files.`}</span>
        </span>
      </label>
      <input id={id} type="file" multiple accept={ACCEPT} className="hidden" onChange={onPick} />

      {files.length > 0 && (
        <ul className="mt-2.5 space-y-2">
          {files.map((f) => (
            <li key={f.id} className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-sm ${f.error ? "border-red-200 bg-red-50" : "border-line bg-white"}`}>
              <FileText className="h-4 w-4 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">{f.name}</p>
                <p className={`text-[11px] ${f.error ? "font-medium text-red-600" : "text-muted"}`}>
                  {f.error ?? (
                    <>
                      {fmtSize(f.originalSize)}
                      {f.compressed && <span className="font-bold text-green-700"> → {fmtSize(f.finalSize)} ✓</span>}
                      {!f.compressed && " ✓"}
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onChange(files.filter((x) => x.id !== f.id))}
                aria-label={`Remove ${f.name}`}
                className="rounded-lg p-1 hover:bg-neutral-100"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
