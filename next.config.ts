import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vbtxusxqhfoaxmdhuxfw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    // Inline CSS to eliminate render-blocking CSS requests
    // This is ideal for Tailwind CSS (atomic CSS) where the CSS size is O(1)
    // relative to design complexity. Improves FCP and LCP by removing network
    // roundtrips for CSS files.
    inlineCss: true,

    // Optimize CSS chunking strategy
    // 'true' (default) merges CSS files when possible to reduce requests
    cssChunking: true,
  },
};

export default nextConfig;
