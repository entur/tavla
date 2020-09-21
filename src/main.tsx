import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import analytics from 'universal-ga'
import { createBrowserHistory } from 'history'

import './main.scss'

import App from './containers/App'

const history = createBrowserHistory()
history.listen((location) => {
    const locationAnonymized = location.pathname.substring(
        0,
        location.pathname.indexOf('@'),
    )
    analytics.set('page', locationAnonymized)
    analytics.pageview(locationAnonymized)
})

ReactDOM.render(<App history={history} />, document.getElementById('app'))
