import React from 'react'
import ReactDOM from 'react-dom'
import analytics from 'universal-ga'
import createHistory from 'history/createBrowserHistory'
import '@entur/fonts/index.css'
import '@entur/component-library/lib/index.css'
import './main.scss'
import {
    Router,
} from 'react-router-dom'
import { routes } from './routes'

const history = createHistory()
history.listen((location) => {
    const locationAnonymized = location.pathname.substring(0, location.pathname.indexOf('@'))
    analytics.set('page', locationAnonymized)
    analytics.pageview(locationAnonymized)
})

ReactDOM.render(
    <div className="app">
        <Router history={ history }>
            { routes }
        </Router>
    </div>,
    document.getElementById('app')
)
