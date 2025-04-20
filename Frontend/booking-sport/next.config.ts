import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/**',
      },
    ],
  },
  /*images: {
    domains: ['source.unsplash.com'],  // Thêm Unsplash vào đây
  },
  */
};

export default nextConfig;
