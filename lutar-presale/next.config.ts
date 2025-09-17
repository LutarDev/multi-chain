import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d391b93f5f62d9c15f67142e43841acc.ipfscdn.io" },
    ],
  },
};

export default nextConfig;
