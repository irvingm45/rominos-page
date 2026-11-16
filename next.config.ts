import type { NextConfig } from "next";

// Static export: `pnpm build` writes a plain site to /out that any static host can serve.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Empty for a root domain; "/<repo-name>" on GitHub Pages (set by the deploy workflow).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  // Photos are pre-optimized into AVIF/WebP by scripts/optimize-images.mjs,
  // so the runtime image optimizer (unavailable in static exports) is not needed.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
