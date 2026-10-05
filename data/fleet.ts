export interface Truck {
  key: string;
  name: string;
  capacity: string;
  use: string;
  base: number;
  perKm: number;
}

export const TRUCKS: Truck[] = [
  { key: "three-wheeler", name: "3-Wheeler Tempo", capacity: "0.5 T", use: "Hyperlocal, small parcels", base: 349, perKm: 18 },
  { key: "tata-ace", name: "Tata Ace", capacity: "0.75 T", use: "City last-mile, light parcels", base: 599, perKm: 24 },
  { key: "bolero-pickup", name: "Bolero Pickup", capacity: "1.5 T", use: "City + nearby towns", base: 899, perKm: 27 },
  { key: "dost-14ft", name: "Dost / Eicher 14-ft", capacity: "4 T", use: "Intercity PTL & FTL", base: 1499, perKm: 32 },
  { key: "canter-19ft", name: "Canter 19-ft", capacity: "8 T", use: "Regional FTL loads", base: 2899, perKm: 42 },
  { key: "eicher-17ft", name: "Eicher 17-ft", capacity: "7 T", use: "Regional distribution", base: 2199, perKm: 38 },
  { key: "sxl-32ft", name: "32-ft SXL", capacity: "15 T", use: "Long-haul full truckload", base: 4999, perKm: 55 },
  { key: "container-40ft", name: "Container 40-ft", capacity: "28 T", use: "Port runs, EXIM legs", base: 8999, perKm: 75 },
  { key: "trailer-odc", name: "Trailer / ODC", capacity: "30 T+", use: "Heavy & over-dimensional cargo", base: 11999, perKm: 95 },
  { key: "reefer", name: "Reefer (Cold-chain)", capacity: "4–16 T", use: "Cold-chain & agri cargo", base: 6499, perKm: 65 },
];

export const GOODS_CATEGORIES = [
  "General Goods",
  "FMCG & Food",
  "Textiles & Garments",
  "Pharma (non-cold)",
  "Auto Parts",
  "Furniture",
  "Perishable / Cold-chain",
  "Industrial & Machinery",
  "E-commerce Parcels",
  "Other",
];
