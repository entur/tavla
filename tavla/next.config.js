const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const { withSentryConfig } = require("@sentry/nextjs");

const connectSrc = [
    "'self'",
    "https://ws.geonorge.no",
    "https://*.posthog.com",
    "https://api.entur.io",
    "https://*.googleapis.com",
    "https://www.google.com"
];

if (process.env.NODE_ENV == 'development') {
    connectSrc.push("http://*.identitytoolkit.googleapis.com http://127.0.0.1:9099")
}

const cspHeaderCommon = `
    default-src 'self';
    style-src 'self' 'unsafe-inline';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
`

const cspHeaderAdmin = `
    connect-src ${connectSrc.join(' ')};
    frame-ancestors 'none';
    ${cspHeaderCommon}
`

const cspHeaderTavlevisning = `
    connect-src 'self' https://api.entur.io;
    ${cspHeaderCommon}
`

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
    async headers() {
        return [
            {         
                source: '/(.*)?',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeaderAdmin.replace(/\n/g, '')
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                ]
            },
            {         
                source: '/:id(\\w{20})',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeaderTavlevisning.replace(/\n/g, ''),
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                ]
            },
        ]
    }
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
