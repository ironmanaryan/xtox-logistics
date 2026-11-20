/**
 * Company + feature configuration.
 *
 * Nothing here is invented. Values that the business must supply are left
 * empty so the UI hides them; PLACEHOLDERS.md lists every one.
 */

export const company = {
  brandName: "XtoX Logistics",
  /** Registered legal entity — confirm with your incorporation certificate. */
  legalName: "XtoX Logistics",
  tagline: "Moving India's goods — X to X.",

  phone: "+91 78754 88307",
  phoneE164: "+917875488307",
  whatsapp: "917875488307",
  email: "xtoxlogistics.info@gmail.com",

  address: {
    line1: "BMTC Complex, Outer Ring Road, Old Madiwala",
    line2: "BTM Layout 2nd Stage",
    city: "Bengaluru",
    state: "Karnataka",
    pin: "560068",
    country: "India",
  },

  /** Leave empty until verified — hidden automatically. */
  gstin: "",
  cin: "",
  iec: "",

  social: {
    instagram: "https://instagram.com/xtoxlogisticsindia",
    linkedin: "https://www.linkedin.com/company/xtox-logistics",
  },

  legal: {
    jurisdiction: "Bengaluru, Karnataka",
    governingLaw: "the laws of India",
    /** Used in the Terms liability clause. */
    liabilityLimit:
      "the freight or service charges paid for that specific consignment or engagement",
    /** Days after delivery within which a claim must be reported. */
    claimWindowDays: 7,
    grievanceOfficer: "[REPLACE: grievance officer name & contact]",
  },

  supportHours: "Monday–Sunday, 8 AM – 10 PM IST",
  /** Promised callback window shown on the quote success screen. */
  callbackPromise: "2 business hours",
} as const;

export const registeredAddress = `${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.state} ${company.address.pin}, ${company.address.country}`;

/**
 * Feature flags. Everything defaults OFF so unfinished features are never
 * shown to customers. Flip in Vercel env vars, no rebuild required.
 */
export const features = {
  /** Shipment tracking tab in the hero + /api/track. */
  trackShipment: process.env.NEXT_PUBLIC_FEATURE_TRACK === "true",
  /** Customer login / dashboard links. */
  customerLogin: process.env.NEXT_PUBLIC_FEATURE_LOGIN === "true",
  /** Compliance chips (GST / IEC / APEDA / Insured) in trust sections. */
  complianceBadges: process.env.NEXT_PUBLIC_FEATURE_BADGES === "true",
  /** Instant price estimators. */
  instantEstimates: true,
  /** Customer testimonials block (only renders when proof data exists). */
  testimonials: true,
} as const;

export interface ComplianceBadge {
  key: "gst" | "iec" | "apeda" | "insured";
  label: string;
  /** A badge only appears when this is true AND a reference value is set. */
  enabled: boolean;
  value: string;
}

/**
 * Only publish a compliance claim you can evidence. Empty values keep the
 * badge hidden even if the feature flag is on.
 */
export const complianceBadges: ComplianceBadge[] = [
  { key: "gst", label: "GST Registered", enabled: false, value: "" },
  { key: "iec", label: "IEC Holder", enabled: false, value: "" },
  { key: "apeda", label: "APEDA RCMC", enabled: false, value: "" },
  { key: "insured", label: "Insured Transit", enabled: false, value: "" },
];

export function visibleComplianceBadges(): ComplianceBadge[] {
  if (!features.complianceBadges) return [];
  return complianceBadges.filter((b) => b.enabled && b.value.trim().length > 0);
}
