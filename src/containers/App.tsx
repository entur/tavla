import React, { useEffect } from 'react'
import { Route, Switch, Router, useLocation } from 'react-router-dom'
import analytics from 'universal-ga'

import { ToastProvider } from '@entur/alert'
import PWAPrompt from 'react-ios-pwa-prompt'
import { ApolloProvider } from '@apollo/client'

import { SettingsContext, useSettings } from '../settings'
import { useFirebaseAuthentication, UserProvider } from '../auth'
import '../firebase-init'

import { client } from '../services/apollo'

import Compact from '../dashboards/Compact'
import Chrono from '../dashboards/Chrono'
import Timeline from '../dashboards/Timeline'
import MapDashboard from '../dashboards/Map'

import PrivateRoute from '../routers/PrivateRoute'
import Header from '../components/Header'
import BusStop from '../dashboards/BusStop'

import { isMobileWeb } from '../utils'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../settings/LocalStorage'

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

const numberOfVisits = getFromLocalStorage<number>('numberOfVisits') || 1

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
            start_url: `${pathName}`,
            scope: `${pathName}`,
            display: 'standalone',
            background_color: '#181C56',
            theme_color: '#181C56',
            description: 'Lag din egen sanntidstavle.',
            orientation: 'portrait',
            lang: 'no',
            icons: [
                {
                    src: '/images/logo/logo-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: '/images/logo/logo-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
            ],
            splash_screen: [
                {
                    src: '/images/splash/startup-image-1284x2778.png',
                    sizes: '1284x2778',
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

const hidePWA = (pathName: string) =>
    pathName === '/' ||
    pathName.includes('admin') ||
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.navigator.standalone ||
    document.referrer.includes('android-app://') ||
    getFromLocalStorage('pwaPromptShown') ||
    numberOfVisits < 3 ||
    ![
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
    ].includes(navigator.platform)

function ProgressiveWebAppPrompt(pathName: string): JSX.Element | null {
    useEffect(() => {
        saveToLocalStorage('numberOfVisits', numberOfVisits + 1)
    }, [])

    if (hidePWA(pathName)) {
        return null
    }

    return (
        <div className="pwa-prompt">
            <PWAPrompt
                debug // forcing prompt to show
                copyTitle="Legg til Tavla på hjemskjermen"
                copyShareButtonLabel="1) I Safari, trykk på 'Del'-knappen på menyen under."
                copyAddHomeButtonLabel="2) Trykk 'Legg til på hjemskjerm'."
                copyClosePrompt="Lukk"
                onClose={() => saveToLocalStorage('pwaPromptShown', true)}
            />
        </div>
    )
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
        updateManifest(window.location.href)
    }, [location.pathname])

    return (
        <ApolloProvider client={client}>
            <UserProvider value={user}>
                {isMobileWeb()
                    ? ProgressiveWebAppPrompt(location.pathname)
                    : null}
                <SettingsContext.Provider
                    value={isOnTavle ? settings : [null, settings[1]]}
                >
                    <ThemeProvider>
                        <div className="themeBackground">
                            <ToastProvider>
                                <Header />
                                <Switch>
                                    <Route
                                        exact
                                        path="/"
                                        component={LandingPage}
                                    />
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
                                    <Route
                                        path="/tavler"
                                        component={MyBoards}
                                    />
                                    <Route
                                        path="/admin"
                                        component={
                                            settings[0]
                                                ? Admin
                                                : (): null => null
                                        }
                                    />
                                    <Route
                                        path="/privacy"
                                        component={Privacy}
                                    />
                                    <Route
                                        path="/"
                                        component={PageDoesNotExist}
                                    />
                                </Switch>
                            </ToastProvider>
                        </div>
                    </ThemeProvider>
                </SettingsContext.Provider>
            </UserProvider>
        </ApolloProvider>
    )
}

interface Props {
    history: any
}

const App = ({ history }: Props): JSX.Element => (
    <Router history={history}>
        <Content />
    </Router>
)

export default App
