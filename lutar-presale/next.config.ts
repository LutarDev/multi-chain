import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d391b93f5f62d9c15f67142e43841acc.ipfscdn.io" },
      { protocol: "https", hostname: "cryptologos.cc" },
    ],
  },
};

export default nextConfig;
