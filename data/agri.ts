export interface Crop {
  key: string;
  name: string;
  unit: string;
  /** Indicative Jan-2025 farm-gate / mandi realization */
  mandiPrice: number;
  /** Indicative export realization (same unit) */
  exportPrice: number;
  markets: string;
  season: string;
  coldChain: boolean;
}

export const CROPS: Crop[] = [
  { key: "basmati", name: "Basmati Rice", unit: "quintal", mandiPrice: 3600, exportPrice: 5800, markets: "UAE, Saudi, Iran, EU", season: "Oct – Dec", coldChain: false },
  { key: "wheat", name: "Wheat (Sharbati)", unit: "quintal", mandiPrice: 2800, exportPrice: 3400, markets: "Bangladesh, Vietnam, UAE", season: "Mar – May", coldChain: false },
  { key: "soybean", name: "Soybean", unit: "quintal", mandiPrice: 4600, exportPrice: 5400, markets: "Vietnam, Japan, Thailand", season: "Sep – Nov", coldChain: false },
  { key: "cotton", name: "Cotton (Shankar-6)", unit: "quintal", mandiPrice: 7200, exportPrice: 8100, markets: "Bangladesh, Vietnam, China", season: "Oct – Feb", coldChain: false },
  { key: "onion", name: "Onion (Nashik Red)", unit: "quintal", mandiPrice: 1800, exportPrice: 2900, markets: "UAE, Malaysia, Sri Lanka", season: "Feb – May", coldChain: false },
  { key: "potato", name: "Potato", unit: "quintal", mandiPrice: 1200, exportPrice: 1900, markets: "Nepal, UAE, Oman", season: "Jan – Mar", coldChain: true },
  { key: "grapes", name: "Grapes (Thompson)", unit: "quintal", mandiPrice: 4500, exportPrice: 9500, markets: "Netherlands, UK, UAE", season: "Dec – Apr", coldChain: true },
  { key: "pomegranate", name: "Pomegranate (Kandhari)", unit: "quintal", mandiPrice: 8000, exportPrice: 14000, markets: "UAE, Saudi, Netherlands", season: "Jul – Nov", coldChain: true },
  { key: "mango", name: "Mango (Alphonso)", unit: "quintal", mandiPrice: 12000, exportPrice: 25000, markets: "USA, UK, Japan, UAE", season: "Mar – Jun", coldChain: true },
  { key: "banana", name: "Banana (Grand Naine)", unit: "quintal", mandiPrice: 1100, exportPrice: 2100, markets: "Iran, UAE, Iraq", season: "Year-round", coldChain: true },
  { key: "turmeric", name: "Turmeric (Salem)", unit: "quintal", mandiPrice: 7500, exportPrice: 9800, markets: "USA, EU, Malaysia", season: "Jan – Apr", coldChain: false },
  { key: "chilli", name: "Red Chilli (Guntur)", unit: "quintal", mandiPrice: 14000, exportPrice: 18500, markets: "China, Vietnam, USA", season: "Feb – May", coldChain: false },
];

export interface GovtDoc {
  key: string;
  name: string;
  desc: string;
  who: string;
}

export const GOVT_DOCS: GovtDoc[] = [
  { key: "iec", name: "IEC (Importer Exporter Code)", desc: "DGFT ka 10-digit code — export shuru karne ke liye pehla aur sabse zaroori document.", who: "DGFT" },
  { key: "apeda", name: "APEDA RCMC", desc: "Agri exporters ke liye registration-cum-membership — buyer trust + scheme benefits.", who: "APEDA" },
  { key: "fssai", name: "FSSAI Licence", desc: "Processed / packaged food export ke liye food safety licence.", who: "FSSAI" },
  { key: "phyto", name: "Phytosanitary Certificate", desc: "Fresh produce ke liye plant-health certificate — EU/US buyers mandatory maangte hain.", who: "PQ Dept." },
  { key: "coo", name: "Certificate of Origin", desc: "Buyer country me import duty kam karata hai (FTA benefit).", who: "Chamber / EIC" },
  { key: "lab", name: "Residue Lab Report", desc: "Pesticide-residue test (NABL lab) — grapes, mango, chilli jaise crops ke liye must.", who: "NABL Lab" },
  { key: "gst", name: "GST + LUT", desc: "Export par zero-rated GST ke liye Letter of Undertaking filing.", who: "GST Dept." },
  { key: "health", name: "Health Certificate", desc: "Dairy, meat, honey jaise products ke liye animal-health clearance.", who: "EIC / State" },
];

export const DEST_COUNTRIES = ["UAE", "Saudi Arabia", "Bangladesh", "Vietnam", "Malaysia", "Singapore", "Netherlands (EU)", "United Kingdom", "USA", "Japan", "Iran", "China", "Other"];

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
