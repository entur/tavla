/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: { outputFileTracingIncludes: { "/": ["../shared"] } },
  transpilePackages: ["shared", "react-map-gl"],
};

module.exports = nextConfig;
