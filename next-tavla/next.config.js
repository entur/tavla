/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.extensions.push(".graphql");
    config.module.rules.push({
      test: /\.graphql$/,
      type: "asset/source",
    });
    return config;
  },
};

module.exports = nextConfig;
