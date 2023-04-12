/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.extensions.push(".graphql");
    config.module.rules.push({
      test: /\.graphql$/,
      type: "asset/source",
    });
    config.module.rules.push({
      test: /\.(svg|png|jpe?g|gif|eot|webp|webm|woff2?)$/,
      type: "asset",
      generator: {
        filename: "assets/[hash][ext][query]",
      },
    });
    return config;
  },
  output: "standalone",
};

module.exports = nextConfig;
