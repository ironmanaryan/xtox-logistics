/** Shared client-side file helpers: images auto-compress to ~1–2 MB. */

export const MAX_BYTES = 2 * 1024 * 1024; // 2 MB hard limit
export const TARGET_BYTES = 1.9 * 1024 * 1024; // compress target
export const ACCEPT = ".pdf,.jpg,.jpeg,.png";

export function fmtSize(n: number): string {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${Math.round(n / 1024)} KB`;
}

export function isImageFile(file: File): boolean {
  return /^image\/(jpeg|png|jpg)$/i.test(file.type);
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

/** Compress an image file with canvas until it fits under TARGET_BYTES. */
export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      const tryDims = [1600, 1200, 900];
      const qualities = [0.85, 0.7, 0.55, 0.4];
      let di = 0;
      let qi = 0;
      const attempt = () => {
        const maxDim = tryDims[di];
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            if (blob.size <= TARGET_BYTES || (di === tryDims.length - 1 && qi === qualities.length - 1)) {
              resolve(blob);
            } else if (qi < qualities.length - 1) {
              qi++;
              attempt();
            } else {
              qi = 0;
              di++;
              attempt();
            }
          },
          "image/jpeg",
          qualities[qi]
        );
      };
      attempt();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}
