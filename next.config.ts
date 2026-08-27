import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Removed to allow API routes and Serverless functions
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
