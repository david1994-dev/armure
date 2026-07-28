import path from "node:path";
import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (process.env.R2_PUBLIC_URL) {
  const { hostname } = new URL(process.env.R2_PUBLIC_URL);
  remotePatterns.push({ protocol: "https", hostname });
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
