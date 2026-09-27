export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
}

export const articles: Article[] = [
  {
    slug: "choose-right-vehicle-for-your-cargo",
    title: "How to choose the right vehicle for your cargo",
    excerpt:
      "Tata Ace, Eicher 17-ft or a 32-ft SXL? A practical framework to match vehicle type to load size, weight and lane — and stop overpaying for capacity you don't need.",
    category: "Guides",
    readTime: "6 min read",
    date: "2025-08-12",
  },
  {
    slug: "customs-documents-checklist",
    title: "The importer's customs documents checklist",
    excerpt:
      "Bill of entry, commercial invoice, packing list, certificate of origin — what each document does, who files it, and the 5 mistakes that cause 80% of clearance delays.",
    category: "Import/Export",
    readTime: "8 min read",
    date: "2025-07-28",
  },
  {
    slug: "reduce-damage-house-shifting",
    title: "7 ways to reduce damage during house shifting",
    excerpt:
      "From graded packing layers to insurance fine print — how to make sure your 2BHK reaches the new city exactly the way it left.",
    category: "Packers & Movers",
    readTime: "5 min read",
    date: "2025-07-10",
  },
  {
    slug: "cold-chain-basics-perishables",
    title: "Cold-chain basics every exporter of perishables should know",
    excerpt:
      "Pre-cooling, temperature bands, reefer settings and the break in the chain that ruins most grape and banana consignments before they reach the port.",
    category: "Agri-Export",
    readTime: "7 min read",
    date: "2025-06-22",
  },
];

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  result: string;
  excerpt: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "textile-exporter-surat",
    title: "Cutting customs dwell time by 60% for a Surat textile exporter",
    client: "Mid-size textile exporter, Surat",
    industry: "Textiles",
    result: "60% faster clearance · 18% lower freight cost",
    excerpt:
      "Weekly LCL consignments to Jebel Ali were stuck 4–5 days at customs. Pre-alert documentation and a dedicated CHB desk brought dwell down to under 48 hours.",
  },
  {
    slug: "fmcg-distributor-pune",
    title: "Scheduled fleet contract for a Pune FMCG distributor",
    client: "FMCG distributor, Pune",
    industry: "Retail & FMCG",
    result: "99.4% on-time · locked monthly rates",
    excerpt:
      "6 dedicated Eicher 17-ft vehicles on fixed daily routes replaced ad-hoc market hiring. Peak-season surge pricing eliminated, billing consolidated to one invoice.",
  },
  {
    slug: "fpo-grape-export-nashik",
    title: "Taking a Nashik FPO's grapes to EU shelves",
    client: "Farmer producer organisation, Nashik",
    industry: "Agri-Export",
    result: "Spoilage under 5% · 3.2x farm-gate realization",
    excerpt:
      "Pre-cooling at the collection centre, 0–4°C reefer legs with temperature logging, and APEDA paperwork handled end-to-end opened a direct EU buyer contract.",
  },
  {
    slug: "office-relocation-400-seats",
    title: "Zero-downtime relocation of a 400-seat office",
    client: "IT services company, Bengaluru",
    industry: "Technology",
    result: "Moved over one weekend · zero asset damage",
    excerpt:
      "Phased packing, night moves and a 12-vehicle convoy shifted 400 workstations between campuses with employees back at desks Monday morning.",
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const faqCategories: { name: string; items: FaqItem[] }[] = [
  {
    name: "General",
    items: [
      {
        q: "What does XtoX actually do?",
        a: "We're a single logistics partner for four services: Packers & Movers (home/office shifting), Import/Export assistance (customs + freight), SME Transport (on-demand and scheduled fleets), and Farmer Agri-Export (cold-chain + APEDA support). One account manager, one billing stack, four capabilities.",
      },
      {
        q: "Which cities do you operate in?",
        a: "We serve all 28 states through our verified fleet partner network, with strong lanes around Surat, Nashik, Mumbai, Pune and Bengaluru. International freight runs through major Indian ports and airports.",
      },
      {
        q: "How fast do you respond to a quote request?",
        a: "Our logistics desk responds within 2 business hours with a tailored route, vehicle and price recommendation.",
      },
    ],
  },
  {
    name: "Packers & Movers",
    items: [
      {
        q: "How is my moving cost calculated?",
        a: "Move size (1BHK to office), distance, packing material grade and insurance. The website calculator gives an instant indicative range; the final price is locked after a free survey.",
      },
      {
        q: "Is my goods insured during the move?",
        a: "Every move includes all-risk transit insurance. A named move manager stays reachable on WhatsApp through the entire move.",
      },
      {
        q: "How soon can you pick up?",
        a: "Local city moves: same or next day. Intercity: pickup within 48 hours of confirmation on most lanes.",
      },
    ],
  },
  {
    name: "Import / Export",
    items: [
      {
        q: "Do you handle customs clearance directly?",
        a: "We work with licensed customs house brokers who file bills of entry and shipping bills on your behalf, and we manage the documentation, duty computation and examination coordination end-to-end.",
      },
      {
        q: "Can you ship small quantities?",
        a: "Yes — LCL (less than container load) and shared reefer containers let you export small lots without paying for a full container.",
      },
      {
        q: "What is a typical clearance time?",
        a: "48 hours is typical for pre-alerted, correctly documented consignments at major ports.",
      },
    ],
  },
  {
    name: "Drivers",
    items: [
      {
        q: "How do I become an XtoX driver partner?",
        a: "Fill the form on our Drivers page with your RC and licence details. Verification takes under 24 hours and onboarding is free — you start receiving load offers on WhatsApp.",
      },
      {
        q: "When do I get paid?",
        a: "Within 48 hours of POD clearance — no 30–60 day credit cycles.",
      },
    ],
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "monsoon-shipping-playbook",
    title: "The monsoon shipping playbook: keeping cargo dry and on time",
    excerpt:
      "Waterproof lamination, elevated loading and route planning around flooded corridors — how we keep monsoon consignments moving when highways slow down.",
    tag: "Operations",
    date: "2025-09-05",
  },
  {
    slug: "apeda-registration-2025-updates",
    title: "APEDA registration in 2025: what changed and how to apply faster",
    excerpt:
      "The RCMC process moved further online this year. A walkthrough of the new portal flow, common rejections and realistic timelines for first-time exporter FPOs.",
    tag: "Agri-Export",
    date: "2025-08-20",
  },
  {
    slug: "why-empty-return-trips-cost-india-billions",
    title: "Why empty return trips cost India's truckers billions",
    excerpt:
      "Nearly 40% of trucks run empty on return legs. What two-way load matching is, and how our driver partner network attacks the problem lane by lane.",
    tag: "Industry",
    date: "2025-08-01",
  },
  {
    slug: "gst-on-logistics-explained",
    title: "GST on logistics services, explained without jargon",
    excerpt:
      "Reverse charge, e-way bills and input credit on freight — the three things every SME shipper gets wrong, with worked examples.",
    tag: "Finance",
    date: "2025-07-15",
  },
];
