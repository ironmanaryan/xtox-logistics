import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { corridors } from "@/data/cities";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" | "yearly"
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const routes: MetadataRoute.Sitemap = [
    page("", 1, "weekly"),
    page("/services/packers-movers", 0.9, "monthly"),
    page("/services/packers-movers/book", 0.8, "monthly"),
    page("/services/packers-movers/estimate", 0.8, "monthly"),
    page("/services/packers-movers/express", 0.8, "monthly"),
    page("/packers-movers", 0.85, "monthly"),
    page("/services/import-export", 0.9, "monthly"),
    page("/services/import-export/import", 0.8, "monthly"),
    page("/services/import-export/export", 0.8, "monthly"),
    page("/services/import-export/documents", 0.8, "monthly"),
    page("/services/sme-transport", 0.9, "monthly"),
    page("/services/sme-transport/on-demand", 0.8, "monthly"),
    page("/services/sme-transport/estimate", 0.8, "monthly"),
    page("/services/sme-transport/contract", 0.8, "monthly"),
    page("/services/agri-export", 0.9, "monthly"),
    page("/services/agri-export/export-crop", 0.8, "monthly"),
    page("/services/agri-export/govt-docs", 0.8, "monthly"),
    page("/services/agri-export/mandi-price", 0.8, "monthly"),
    page("/drivers", 0.8, "monthly"),
    page("/support", 0.8, "monthly"),
    page("/about", 0.7, "monthly"),
    page("/blog", 0.75, "weekly"),
    page("/resources/articles", 0.7, "weekly"),
    page("/resources/case-studies", 0.7, "monthly"),
    page("/resources/faq", 0.6, "monthly"),
    page("/resources/blog", 0.7, "weekly"),
    page("/terms", 0.4, "yearly"),
    page("/privacy", 0.4, "yearly"),
    page("/refund-policy", 0.4, "yearly"),
    page("/login", 0.3, "yearly"),
    page("/signup", 0.3, "yearly"),
    page("/dashboard", 0.5, "weekly"),
    page("/driver", 0.5, "weekly"),
    ...corridors.map((c) => page(`/packers-movers/${c.slug}`, 0.65, "monthly")),
    ...getAllPosts().map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return routes;
}
