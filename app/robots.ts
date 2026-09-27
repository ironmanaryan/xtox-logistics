import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/account"],
      },
    ],
    sitemap: "https://xtoxlogistics.vercel.app/sitemap.xml",
  };
}
