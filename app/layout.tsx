import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "XtoX Logistics — B2B Logistics, Moving & Agri-Export Partner",
    template: "%s | XtoX Logistics",
  },
  description:
    "XtoX Logistics is a modern B2B logistics partner: Packers & Movers, Import/Export assistance, SME transport, and Farmer Agri-Export with cold-chain and APEDA support.",
  metadataBase: new URL("https://xtoxlogistics.com"),
  openGraph: {
    title: "XtoX Logistics",
    description:
      "One partner for Packers & Movers, Import/Export, SME Transport and Farmer Agri-Export.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-brand-black antialiased">
        {children}
      </body>
    </html>
  );
}
