import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      // The mortgage page moved; keep old links and any indexed URL working.
      { source: "/mortgage-calculator", destination: "/mortgage-loan-calculator", permanent: true },
    ];
  },
};

export default nextConfig;
