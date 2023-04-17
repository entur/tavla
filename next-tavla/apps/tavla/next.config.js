/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["shared", "react-map-gl"],
};

module.exports = nextConfig;
