import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    ignoreDuringBuilds: true, // ✅ Let the build succeed even with eslint issues
  },
  /* config options here */
};

export default nextConfig;
