import React from 'react'
import ReactDOM from 'react-dom'

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

ReactDOM.render(<App />, document.getElementById('app'))
