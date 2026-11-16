import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      // The mortgage page moved; keep old links and any indexed URL working.
      { source: "/mortgage-calculator", destination: "/mortgage-loan-calculator", permanent: true },
      // The header calls this section "Blog"; send /blog URLs to it.
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/blog/:slug", destination: "/guides/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
