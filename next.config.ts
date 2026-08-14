import type { NextConfig } from "next";
import path from "path";

const isCapacitorBuild = process.env.CAP_BUILD === "1";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  ...(isCapacitorBuild && {
    output: "export",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
