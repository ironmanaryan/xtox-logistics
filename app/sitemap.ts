import type { MetadataRoute } from "next";

const BASE = "https://xtoxlogistics.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/services/packers-movers`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services/packers-movers/book`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/packers-movers/estimate`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/packers-movers/express`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/import-export`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services/import-export/import`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/import-export/export`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/import-export/documents`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/sme-transport`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services/sme-transport/on-demand`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/sme-transport/estimate`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/sme-transport/contract`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services/agri-export`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/drivers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/resources/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/resources/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/resources/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/resources/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  return routes;
}
