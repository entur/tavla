import React, { useEffect } from 'react'
import { Route, Switch, Router, useLocation } from 'react-router-dom'
import analytics from 'universal-ga'

import { ToastProvider } from '@entur/alert'

import { SettingsContext, useSettings } from '../settings'
import { useFirebaseAuthentication, UserProvider } from '../auth'
import '../firebase-init'

import Compact from '../dashboards/Compact'
import Chrono from '../dashboards/Chrono'
import Timeline from '../dashboards/Timeline'
import MapDashboard from '../dashboards/Map'

import PrivateRoute from '../routers/PrivateRoute'
import Header from '../components/Header'
import BusStop from '../dashboards/BusStop'

import LandingPage from './LandingPage'
import Admin from './Admin'
import Privacy from './Privacy'
import { LockedTavle, PageDoesNotExist } from './Error/ErrorPages'
import ThemeProvider from './ThemeWrapper/ThemeProvider'

import MyBoards from './MyBoards'
import './styles.scss'

analytics.initialize('UA-108877193-6')
analytics.set('anonymizeIp', true)

analytics.set('page', window.location.pathname)
analytics.pageview(window.location.pathname)

function getDashboardComponent(
    dashboardKey?: string | void,
): (props: Props) => JSX.Element | null {
    switch (dashboardKey) {
        case 'Timeline':
            return Timeline
        case 'Chrono':
            return Chrono
        case 'Map':
            return MapDashboard
        case 'BusStop':
            return BusStop
        default:
            return Compact
    }
}

function updateManifest(pathName: string): void {
    const manifest = window.document.getElementById('manifest-placeholder')
    if (manifest) {
        const dynamicManifest = {
            name: 'Tavla - Enturs avgangstavle',
            short_name: 'Tavla',
            start_url: `.${pathName}`,
            scope: `.${pathName}`,
            display: 'standalone',
            background_color: '#181C56',
            theme_color: '#181C56',
            description: 'Lag din egen sanntidstavle.',
            orientation: 'portrait',
            lang: 'no',
            images: [
                {
                    src: 'images/logo/logo-72x72.png',
                    sizes: '72x72',
                    type: 'image/png',
                },
                {
                    src: 'images/logo/logo-96x96.png',
                    sizes: '96x96',
                    type: 'image/png',
                },
                {
                    src: 'images/logo/logo-128x128.png',
                    sizes: '128x128',
                    type: 'image/png',
                },
                {
                    src: 'images/logo/logo-144x144.png',
                    sizes: '144x144',
                    type: 'image/png',
                },
                {
                    src: 'images/logo/logo-152x152.png',
                    sizes: '152x152',
                    type: 'image/png',
                },
                {
                    src: 'images/logo/logo-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'images/logo/logo-384x384.png',
                    sizes: '384x384',
                    type: 'image/png',
                },
                {
                    src: 'images/logo/logo-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        }
        const stringManifest = JSON.stringify(dynamicManifest)
        const blob = new Blob([stringManifest], {
            type: 'application/json',
        })
        const manifestURL = URL.createObjectURL(blob)
        manifest.setAttribute('href', manifestURL)
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

    useEffect(() => {
        updateManifest(location.pathname)
    }, [location.pathname])

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
