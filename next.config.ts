import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // '/**' allows any image path from the Unsplash domain
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;