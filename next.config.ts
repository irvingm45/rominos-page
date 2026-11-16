import type { NextConfig } from "next";

// Static export: `npm run build` writes a plain site to /out that any static host can serve.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Photos are pre-optimized into AVIF/WebP by scripts/optimize-images.mjs,
  // so the runtime image optimizer (unavailable in static exports) is not needed.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
