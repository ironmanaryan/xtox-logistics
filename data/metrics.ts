export interface Metric {
  value: string;
  label: string;
}

export const heroMetrics: Metric[] = [
  { value: "12K+", label: "Shipments delivered" },
  { value: "850+", label: "Verified fleet partners" },
  { value: "28", label: "States served" },
  { value: "99.2%", label: "On-time delivery" },
];
