import React from 'react'
import {
    Route, Switch, Redirect,
} from 'react-router-dom'
import analytics from 'universal-ga'
import './main.scss'
import DepartureBoard from './containers/departureBoard/DepartureBoard'
import AdminPage from './containers/adminPage/AdminPage'
import Privacy from './containers/privacy/Privacy'
import App from './containers/App'

analytics.initialize('UA-108877193-6')
analytics.set('anonymizeIp', true)

analytics.set('page', window.location.pathname)
analytics.pageview(window.location.pathname)

export const routes = (
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/dashboard" component={DepartureBoard} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/privacy" component={Privacy} />
        <Redirect to="/" />
    </Switch>
)
