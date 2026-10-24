import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  trailingSlash: isGitHubPages,
  images: isGitHubPages
    ? { unoptimized: true }
    : {
        remotePatterns: [
          // Supabase storage (production images)
          {
            protocol: "https",
            hostname: "*.supabase.co",
            pathname: "/storage/v1/object/**",
          },
          // Placeholders used in seed data
          {
            protocol: "https",
            hostname: "placehold.co",
          },
        ],
      },
  basePath: isGitHubPages ? basePath : undefined,
  assetPrefix: isGitHubPages ? basePath : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
