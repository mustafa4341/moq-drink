import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Set the root to the current project directory using absolute path
    root: path.resolve("."),
  },
};

export default nextConfig;
