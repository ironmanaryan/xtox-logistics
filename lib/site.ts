/**
 * Single source of truth for the public URL.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel (and .env.local) to the canonical domain.
 * The fallback matches the live deployment so a missing env var never produces
 * a mismatched og:image / metadataBase again.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://xtox-logistics.vercel.app"
).replace(/\/+$/, "");

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const DEFAULT_OG_IMAGE = "/og-image.png";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/** Shared openGraph/twitter block so every page emits a consistent card. */
export function socialMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = absoluteUrl(path);
  return {
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "XtoX Logistics",
      type: "website" as const,
      locale: "en_IN",
      images: [{ url: DEFAULT_OG_IMAGE, ...OG_IMAGE_SIZE, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
