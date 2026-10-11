import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XtoX Logistics — Dashboard & Driver App",
    short_name: "XtoX",
    description: "Track shipments, manage bookings, find loads and upload PODs.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      { src: "/logo-icon.png", sizes: "any", type: "image/png" },
      { src: "/logo-mark.png", sizes: "any", type: "image/png" },
    ],
  };
}
