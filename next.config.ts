import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "biletim.simgesoft.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
