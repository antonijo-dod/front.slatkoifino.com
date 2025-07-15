import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "akispetretzikis.com",
      "r8og4gk0g040kcgow48ooocg.91.99.119.7.sslip.io",
      "localhost",
      "192.168.8.122",
      "",
    ],
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
