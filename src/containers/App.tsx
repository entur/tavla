import React, { useEffect, useState } from 'react'
import {
    BrowserRouter,
    Route,
    Switch,
    useLocation,
    useRouteMatch,
} from 'react-router-dom'

import { ApolloProvider } from '@apollo/client'

import { ToastProvider } from '@entur/alert'

import { useFirebaseAuthentication, UserProvider } from '../auth'
import '../firebase-init'
import { SettingsContext, useSettings } from '../settings'

import PWAPrompt from '../../vendor/react-ios-pwa-prompt'

import { realtimeVehiclesClient } from '../services/realtimeVehicles/realtimeVehiclesService'

import Chrono from '../dashboards/Chrono'
import Compact from '../dashboards/Compact'
import MapDashboard from '../dashboards/Map'
import Timeline from '../dashboards/Timeline'

import Header from '../components/Header'
import BusStop from '../dashboards/BusStop'
import PrivateRoute from '../routers/PrivateRoute'

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../settings/LocalStorage'
import { isMobileWeb } from '../utils'

import { Direction } from '../types'

import Admin from './Admin'
import { LockedTavle, PageDoesNotExist } from './Error/ErrorPages'
import LandingPage from './LandingPage'
import Privacy from './Privacy'
import ThemeProvider from './ThemeWrapper/ThemeProvider'

import MyBoards from './MyBoards'

import './styles.scss'

const numberOfVisits = getFromLocalStorage<number>('numberOfVisits') || 1

function getDashboardComponent(
    dashboardKey?: string | void,
): () => JSX.Element | null {
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

function updateManifest(href: string, origin: string): void {
    const manifest = window.document.getElementById('manifest-placeholder')
    if (manifest) {
        const dynamicManifest = {
            name: 'Tavla - Enturs avgangstavle',
            short_name: 'Tavla',
            start_url: `${href}`,
            scope: `${href}`,
            display: 'standalone',
            background_color: '#181C56',
            theme_color: '#181C56',
            description: 'Lag din egen sanntidstavle.',
            orientation: 'portrait',
            lang: 'no',
            icons: [
                {
                    src: `${origin}/images/logo/logo-72x72.png`,
                    sizes: '72x72',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: `${origin}/images/logo/logo-96x96.png`,
                    sizes: '96x96',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: `${origin}/images/logo/logo-128x128.png`,
                    sizes: '128x128',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: `${origin}/images/logo/logo-144x144.png`,
                    sizes: '144x144',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: `${origin}/images/logo/logo-152x152.png`,
                    sizes: '152x152',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: `${origin}/images/logo/logo-192x192.png`,
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: `${origin}/images/logo/logo-384x384.png`,
                    sizes: '384x384',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: `${origin}/images/logo/logo-512x512.png`,
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
            ],
            splash_screen: [
                {
                    src: `${origin}/images/splash/startup-image-1284x2778.png`,
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

    const includeSettings = !['/privacy', '/tavler'].includes(location.pathname)

    const isOnTavle = useRouteMatch('/t/')

    const Dashboard = settings[0]
        ? getDashboardComponent(settings[0].dashboard)
        : (): null => null

    const [isRotated, setIsRotated] = useState(false)

    useEffect(() => {
        updateManifest(window.location.href, window.location.origin)
        if (isOnTavle) {
            const direction = settings[0]?.direction || Direction.STANDARD
            const fontSizeScale = settings[0]?.fontScale || 1
            document.documentElement.style.fontSize = fontSizeScale * 16 + 'px'
            setIsRotated(direction === Direction.ROTATED)
        } else {
            document.documentElement.style.fontSize = '16px'
            setIsRotated(false)
        }
    }, [location.pathname, isOnTavle, settings])

    return (
        <ApolloProvider client={realtimeVehiclesClient}>
            <UserProvider value={user}>
                {isMobileWeb()
                    ? ProgressiveWebAppPrompt(location.pathname)
                    : null}
                <SettingsContext.Provider
                    value={includeSettings ? settings : [null, settings[1]]}
                >
                    <ThemeProvider>
                        <div
                            className="themeBackground"
                            style={
                                isRotated
                                    ? {
                                          transform:
                                              'rotate(-90deg) translate(-100vh)',
                                          transformOrigin: 'top left',
                                          width: '100vh',
                                          height: '100vh',
                                      }
                                    : {}
                            }
                        >
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

const App = (): JSX.Element => (
    <BrowserRouter>
        <Content />
    </BrowserRouter>
)

export default App
