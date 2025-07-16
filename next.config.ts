import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "akispetretzikis.com",
      "r8og4gk0g040kcgow48ooocg.91.99.119.7.sslip.io",
      "localhost",
      "192.168.8.122",
      "res.cloudinary.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/slatko-i-fino/image/upload/**", // Your specific Cloudinary path
      },
      {
        protocol: "http", // Or 'https' if your Strapi instance uses it
        hostname: "r8og4gk0g040kcgow48ooocg.91.99.119.7.sslip.io", // The domain from your API_URL
        port: "1337", // If your URL has a port
        pathname: "/uploads/**",
      },
    ],
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
