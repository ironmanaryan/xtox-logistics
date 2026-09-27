interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  name: "XtoX Logistics",
  description:
    "B2B logistics partner for Packers & Movers, Import/Export assistance, SME transport and Farmer Agri-Export with cold-chain and APEDA support.",
  url: "https://xtoxlogistics.vercel.app",
  telephone: "+91-78754-88307",
  email: "xtoxlogistics.info@gmail.com",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  sameAs: [
    "https://instagram.com/xtoxlogisticsindia",
    "https://www.linkedin.com/company/xtox-logistics",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-78754-88307",
    contactType: "sales",
    availableLanguage: ["en", "hi", "mr"],
  },
};
