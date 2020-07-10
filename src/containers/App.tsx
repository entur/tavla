import React from 'react'
import { Route, Switch, Router } from 'react-router-dom'
import analytics from 'universal-ga'

import { SettingsContext, useSettings } from '../settings'
import { useFirebaseAuthentication, UserProvider } from '../auth'
import '../firebase-init'

import Compact from '../dashboards/Compact'
import Chrono from '../dashboards/Chrono'
import Timeline from '../dashboards/Timeline'

import LandingPage from './LandingPage'
import Admin from './Admin'
import Privacy from './Privacy'
import { LockedTavle, PageDoesNotExist } from './Error/ErrorPages'
import ThemeProvider from './ThemeWrapper/DarkTheme'

import PrivateRoute from '../routers/PrivateRoute'

import { ToastProvider } from '@entur/alert'

import './styles.scss'

analytics.initialize('UA-108877193-6')
analytics.set('anonymizeIp', true)

analytics.set('page', window.location.pathname)
analytics.pageview(window.location.pathname)

function getDashboardComponent(dashboardKey?: string | void) {
    switch (dashboardKey) {
        case 'Timeline':
            return Timeline
        case 'Chrono':
            return Chrono
        default:
            return Compact
    }
}

const Content = (): JSX.Element => {
    const user = useFirebaseAuthentication()
    const settings = useSettings()

    const Dashboard = settings[0]
        ? getDashboardComponent(settings[0].dashboard)
        : (): null => null

    return (
        <UserProvider value={user}>
            <SettingsContext.Provider value={settings}>
                <ThemeProvider>
                    <div className="themeBackground">
                        <ToastProvider>
                            <Switch>
                                <Route exact path="/" component={LandingPage} />
                                <Route
                                    exact
                                    path="/t/:documentId"
                                    component={Dashboard}
                                />
                                <PrivateRoute
                                    exact
                                    path="/admin/:documentId"
                                    component={settings[0] && Admin}
                                    errorComponent={LockedTavle}
                                />
                                <Route
                                    path="/dashboard"
                                    component={Dashboard}
                                />
                                <Route path="/admin" component={Admin} />
                                <Route path="/privacy" component={Privacy} />
                                <Route path="/" component={PageDoesNotExist} />
                            </Switch>
                        </ToastProvider>
                    </div>
                </ThemeProvider>
            </SettingsContext.Provider>
        </UserProvider>
    )
}

interface Props {
    history: any
}

const App = ({ history }: Props): JSX.Element => {
    return (
        <Router history={history}>
            <Content />
        </Router>
    )
}

export default App
