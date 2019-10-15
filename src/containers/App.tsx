import React from 'react'
import {
    Route, Switch, Redirect, Router,
} from 'react-router-dom'
import analytics from 'universal-ga'

import { SettingsContext, useSettings } from '../settings'

import Entur from '../dashboards/Entur'

import LandingPage from './LandingPage'
import Admin from './Admin'
import Privacy from './privacy/Privacy'

analytics.initialize('UA-108877193-6')
analytics.set('anonymizeIp', true)

analytics.set('page', window.location.pathname)
analytics.pageview(window.location.pathname)

const App = ({ history }: Props): JSX.Element => {
    const settings = useSettings()
    return (
        <SettingsContext.Provider value={settings}>
            <Router history={ history }>
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/dashboard" component={Entur} />
                    <Route path="/admin" component={Admin} />
                    <Route path="/privacy" component={Privacy} />
                    <Redirect to="/" />
                </Switch>
            </Router>
        </SettingsContext.Provider>
    )
}

interface Props {
    history: any,
}

export default App
