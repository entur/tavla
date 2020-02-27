import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import analytics from 'universal-ga'
import createHistory from 'history/createBrowserHistory'

import '@entur/fonts/index.css'
import '@entur/component-library/lib/index.css'

import App from './containers/App'

import './main.scss'

const history = createHistory()
history.listen((location) => {
    const locationAnonymized = location.pathname.substring(0, location.pathname.indexOf('@'))
    analytics.set('page', locationAnonymized)
    analytics.pageview(locationAnonymized)
})

ReactDOM.render(
    <App history={history} />,
    document.getElementById('app')
)
