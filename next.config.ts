import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.faire.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
