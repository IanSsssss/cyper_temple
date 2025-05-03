import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
