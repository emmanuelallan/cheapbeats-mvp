import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-1ba02992df39417f92785bf312c35b95.r2.dev",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: 100 * 1024 * 1024, // 100MB
    },
  },
};

export default nextConfig;
