import React from 'react'
import { createRoot } from 'react-dom/client'
import 'react-app-polyfill/stable'
import { init } from '@sentry/react'
import splitbee from '@splitbee/web'
import './main.scss'
import { App } from './App'
import { initalizePosthog } from './posthog'

if (process.env.SENTRY_DSN) {
    init({
        dsn: process.env.SENTRY_DSN,
        release: process.env.VERSION,
    })
}

if (process.env.SPLITBEE_TOKEN) {
    splitbee.init({
        token: process.env.SPLITBEE_TOKEN,
        disableCookie: true,
    })
}

initalizePosthog()

const container = document.getElementById('app')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(<App />)
