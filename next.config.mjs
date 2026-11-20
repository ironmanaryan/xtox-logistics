/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // All hero/service photography is served locally from /public/images.
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Old camelCase deployment domain → canonical domain, keeping links alive.
      {
        source: "/:path*",
        has: [{ type: "host", value: "xtoxlogistics.vercel.app" }],
        destination: "https://xtox-logistics.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
