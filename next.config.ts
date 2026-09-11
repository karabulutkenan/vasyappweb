import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.piri.net",
        pathname: "/resim/**",
      },
    ],
  },
};

export default nextConfig;
