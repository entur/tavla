import React from 'react'
import { Route, Switch, Router, useLocation } from 'react-router-dom'
import analytics from 'universal-ga'

import { SettingsContext, useSettings } from '../settings'
import { useFirebaseAuthentication, UserProvider } from '../auth'
import '../firebase-init'

import Compact from '../dashboards/Compact'
import Chrono from '../dashboards/Chrono'
import Timeline from '../dashboards/Timeline'
import StationView from '../dashboards/Stationview'

import LandingPage from './LandingPage'
import Admin from './Admin'
import Privacy from './Privacy'
import { LockedTavle, PageDoesNotExist } from './Error/ErrorPages'
import ThemeProvider from './ThemeWrapper/ThemeProvider'

import PrivateRoute from '../routers/PrivateRoute'

import { ToastProvider } from '@entur/alert'
import Header from '../components/Header'

import './styles.scss'
import MyBoards from './MyBoards'

analytics.initialize('UA-108877193-6')
analytics.set('anonymizeIp', true)

analytics.set('page', window.location.pathname)
analytics.pageview(window.location.pathname)

function getDashboardComponent(
    dashboardKey?: string | void,
): (props: Props) => JSX.Element {
    switch (dashboardKey) {
        case 'Timeline':
            return Timeline
        case 'Chrono':
            return Chrono
        case 'Stationview':
            return StationView
        default:
            return Compact
    }
}

const Content = (): JSX.Element => {
    const user = useFirebaseAuthentication()
    const settings = useSettings()
    const location = useLocation()

    const isOnTavle = !['/privacy', '/tavler'].includes(location.pathname)

    const Dashboard = settings[0]
        ? getDashboardComponent(settings[0].dashboard)
        : (): null => null

    return (
        <UserProvider value={user}>
            <SettingsContext.Provider
                value={isOnTavle ? settings : [null, settings[1]]}
            >
                <ThemeProvider>
                    <div className="themeBackground">
                        <ToastProvider>
                            <Header />
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
                                <Route path="/tavler" component={MyBoards} />
                                <Route
                                    path="/admin"
                                    component={
                                        settings[0] ? Admin : (): null => null
                                    }
                                />
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
