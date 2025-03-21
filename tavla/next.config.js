const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const { withSentryConfig } = require('@sentry/nextjs')

const commonConnectSrc = [
    "'self'",
    'https://api.entur.io',
    'https://tavla-api.entur.no',
    'https://tavla-api.dev.entur.no',
]

if (process.env.NODE_ENV == 'development') {
    commonConnectSrc.push(
        'http://*.identitytoolkit.googleapis.com http://127.0.0.1:9099 ws://localhost:3000 http://127.0.0.1:3001',
    )
}

const cspHeaderCommon = `
    default-src 'self' apis.google.com http://127.0.0.1:9099 https://ent-tavla-dev.firebaseapp.com/ https://ent-tavla-prd.firebaseapp.com/;
    style-src 'self' 'unsafe-inline';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://eu-assets.i.posthog.com https://apis.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
`

const cspHeader = `
    connect-src ${commonConnectSrc.join(' ')} https://ws.geonorge.no https://*.posthog.com https://*.googleapis.com https://www.google.com;
    frame-ancestors 'none';
    ${cspHeaderCommon}
`

const cspHeaderTavlevisning = `
    connect-src ${commonConnectSrc.join(' ')};
    ${cspHeaderCommon}
`

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: [
        'swr',
        'tailwindcss',
        'next',
        '@sentry/nextjs',
        '@sentry/browser',
        '@sentry/react',
        '@sentry/core',
        '@sentry/utils',
        '@sentry-internal',
    ],
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
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },
    async headers() {
        return [
            {
                source: '/(.*)?',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, ''),
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin-allow-popups',
                    },
                ],
            },
            {
                source: '/:id(\\w{20})',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeaderTavlevisning.replace(/\n/g, ''),
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ]
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

    org: 'entur',
    project: 'tavla',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    hideSourceMaps: true,
    disableLogger: true,
})
