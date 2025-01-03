const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['swr', 'tailwindcss', 'next', '@sentry/nextjs', '@sentry/browser', '@sentry/react', '@sentry/core', '@sentry/utils', '@sentry-internal'],
    i18n: {
        locales: ['nb'],
        defaultLocale: 'nb',
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
        dangerouslyAllowSVG: true,
	contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
}

module.exports = async (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        nextConfig.images.remotePatterns.push({
            protocol: 'http',
            hostname: 'localhost',
        })
        nextConfig.images.remotePatterns.push({
            protocol: 'http',
            hostname: '127.0.0.1',
        })
    }

    return nextConfig
}

module.exports = withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "entur",
    project: "tavla",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    hideSourceMaps: true,
    disableLogger: true, 
  }
);
