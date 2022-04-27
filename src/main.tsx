import React from 'react'

import { createRoot } from 'react-dom/client'

import 'react-app-polyfill/stable'

import { init } from '@sentry/react'

import './main.scss'
import App from './containers/App'

if (process.env.SENTRY_DSN) {
    init({
        dsn: process.env.SENTRY_DSN,
        release: process.env.VERSION,
    })
}

const container = document.getElementById('app')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(<App />)
