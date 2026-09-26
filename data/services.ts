export type ServiceKey =
  | "packers-movers"
  | "import-export"
  | "sme-transport"
  | "agri-export";

export interface Service {
  key: ServiceKey;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  points: string[];
}

export const services: Service[] = [
  {
    key: "packers-movers",
    slug: "/services/packers-movers",
    name: "Packers & Movers",
    tagline: "Zero-damage shifting for homes & offices",
    description:
      "End-to-end packing, loading, transit and unpacking with trained crews, graded packing material and insured moves across India.",
    points: [
      "Free pre-move survey",
      "Insured, GPS-tracked vehicles",
      "Office & industrial relocation",
    ],
  },
  {
    key: "import-export",
    slug: "/services/import-export",
    name: "Import / Export",
    tagline: "Customs, docs & freight — sorted",
    description:
      "Complete EXIM assistance: customs clearance, documentation, FCL/LCL freight booking and port-to-door delivery.",
    points: [
      "CHB & freight forwarding tie-ups",
      "FCL / LCL / Air freight",
      "D2D door-to-door delivery",
    ],
  },
  {
    key: "sme-transport",
    slug: "/services/sme-transport",
    name: "SME Transport",
    tagline: "On-demand trucks for growing businesses",
    description:
      "Flexible full-truck and part-load transport for SMEs — on-demand or scheduled fleets with live tracking and POD management.",
    points: [
      "FTL & PTL options",
      "Scheduled route contracts",
      "Digital POD & billing",
    ],
  },
  {
    key: "agri-export",
    slug: "/services/agri-export",
    name: "Farmer Agri-Export",
    tagline: "From farm gate to global markets",
    description:
      "Cold-chain logistics, APEDA registration guidance and inter-state market price intelligence so farmers export directly at better realizations.",
    points: [
      "Reefer & cold-chain fleet",
      "APEDA / phytosanitary support",
      "Mandi price intelligence",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug || s.key === slug);
}
