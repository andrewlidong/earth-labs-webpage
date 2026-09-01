import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/research", destination: "/", permanent: false },
      { source: "/console", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
