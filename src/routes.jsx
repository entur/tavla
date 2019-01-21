import React from 'react'
import {
    Route, Switch, Redirect,
} from 'react-router-dom'
import analytics from 'universal-ga'
import './main.scss'
import DepartureBoard from './containers/departureBoard/DepartureBoard'
import AdminPage from './containers/adminPage/AdminPage'
import App from './containers/App'

analytics.initialize('UA-108877193-6')
analytics.set('anonymizeIp', true)

analytics.set('page', window.location.pathname)
analytics.pageview(window.location.pathname)

const Layout = ({ children }) => (
    <div className="main-container">
        {children}
    </div>
)

export const routes = (
    <div className="App">
        <Switch>
            <Route exact path="/" component={App} />
            <Layout>
                <Route path="/dashboard" component={DepartureBoard} />
                <Route path="/admin" component={AdminPage} />
            </Layout>
            <Redirect to="/" />
        </Switch>
    </div>
)
