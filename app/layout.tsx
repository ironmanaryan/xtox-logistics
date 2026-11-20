import type { Metadata, Viewport } from "next";
import { Inclusive_Sans } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import { WhatsAppFloat, MobileCallBar } from "@/components/FloatingActions";
import LanguageProvider from "@/components/LanguageProvider";
import ConsentBanner from "@/components/ConsentBanner";
import Analytics from "@/components/Analytics";
import { SITE_URL, DEFAULT_OG_IMAGE, OG_IMAGE_SIZE } from "@/lib/site";
import "./globals.css";

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-inclusive",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "XtoX Logistics — B2B Logistics, Moving & Agri-Export Partner",
    template: "%s | XtoX Logistics",
  },
  description:
    "XtoX Logistics is a Bengaluru-based logistics partner: Packers & Movers, Import/Export assistance, SME transport and farmer agri-export with cold-chain support.",
  applicationName: "XtoX Logistics",
  alternates: { canonical: "/" },
  openGraph: {
    title: "XtoX Logistics",
    description:
      "One partner for Packers & Movers, Import/Export, SME Transport and Farmer Agri-Export.",
    url: SITE_URL,
    siteName: "XtoX Logistics",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        ...OG_IMAGE_SIZE,
        alt: "XtoX Logistics — moving India's goods X to X",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XtoX Logistics",
    description:
      "Packers & Movers, Import/Export, SME Transport and Agri-Export — door to door.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inclusiveSans.variable}>
      <body className="min-h-screen bg-white text-brand-black antialiased">
        <LanguageProvider>
          {children}
          <ChatWidget />
          <WhatsAppFloat />
          <MobileCallBar />
        </LanguageProvider>
        <div aria-hidden className="h-[60px] sm:hidden" />
        <ConsentBanner />
        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
        />
      </body>
    </html>
  );
}
