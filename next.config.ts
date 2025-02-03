import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'insanelygoodrecipes.com',
      },
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'another-domain.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      }
    ],
  },
};

export default nextConfig;