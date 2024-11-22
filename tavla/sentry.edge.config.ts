// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
    dsn: 'https://5f539001c534616984cd2b40e794ae39@o4508182734503936.ingest.de.sentry.io/4508336084484176',

    tracesSampleRate: 1,

    enabled: process.env.NODE_ENV !== 'development',
})
