const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
  transpilePackages: ['swr', "tailwindcss"],
    i18n: {
      locales: ["nb"],
      defaultLocale: "nb"
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
        ],
    },
}

module.exports = async (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        nextConfig.images.remotePatterns.push({
            protocol: 'http',
            hostname: 'localhost'
        })
        nextConfig.images.remotePatterns.push({
            protocol: 'http',
            hostname: '127.0.0.1'
        })
    }

    return nextConfig
}

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    org: "entur",
    project: "tavla",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  }
);
