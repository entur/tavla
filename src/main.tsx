import React from 'react'
import ReactDOM from 'react-dom'

import 'react-app-polyfill/stable'

import analytics from 'universal-ga'
import { createBrowserHistory } from 'history'
import { getAnalytics } from 'firebase/analytics'

import './main.scss'

import App from './containers/App'

const analytics = getAnalytics()

const history = createBrowserHistory()
history.listen((location) => {
    const locationAnonymized = location.pathname.substring(
        0,
        location.pathname.indexOf('@'),
    )
    analyticsga.set('page', locationAnonymized)
    analyticsga.pageview(locationAnonymized)
})

ReactDOM.render(<App history={history} />, document.getElementById('app'))
