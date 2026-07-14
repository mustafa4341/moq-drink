import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    // Set the root to the current project directory using absolute path
    root: path.resolve("."),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
