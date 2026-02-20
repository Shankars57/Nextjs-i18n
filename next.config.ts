import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:locale/docs/:version/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=60, stale-while-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
