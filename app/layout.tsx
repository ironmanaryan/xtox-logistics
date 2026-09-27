import type { Metadata } from "next";
import { Inclusive_Sans } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-inclusive",
});

export const metadata: Metadata = {
  title: {
    default: "XtoX Logistics — B2B Logistics, Moving & Agri-Export Partner",
    template: "%s | XtoX Logistics",
  },
  description:
    "XtoX Logistics is a modern B2B logistics partner: Packers & Movers, Import/Export assistance, SME transport, and Farmer Agri-Export with cold-chain and APEDA support.",
  metadataBase: new URL("https://xtoxlogistics.vercel.app"),
  openGraph: {
    title: "XtoX Logistics",
    description:
      "One partner for Packers & Movers, Import/Export, SME Transport and Farmer Agri-Export.",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inclusiveSans.variable}>
      <body className="min-h-screen bg-white text-brand-black antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
