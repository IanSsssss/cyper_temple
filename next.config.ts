import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/IanSsssss/cyper_temple/blob/main/public/**',
      },
    ],
  },
};

export default nextConfig;
