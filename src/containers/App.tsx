import React, { useEffect, useState } from 'react'
import {
    BrowserRouter,
    Route,
    Routes,
    useLocation,
    useMatch,
} from 'react-router-dom'
import classNames from 'classnames'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from '../UserProvider'
import '../firebase-init'
import { SettingsProvider, useSettings } from '../settings/SettingsProvider'
import PWAPrompt from '../../vendor/react-ios-pwa-prompt'
import { apolloClient } from '../apollo-client'
import { DashboardResolver } from '../dashboards/DashboardResolver'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../settings/LocalStorage'
import { isMobileWeb } from '../utils/utils'
import { ToastProvider } from '../types'
import { AdminPage } from './Admin/AdminPage'
import { PageDoesNotExist } from './Error/ErrorPages'
import { LandingPage } from './LandingPage/LandingPage'
import { Privacy } from './Privacy/Privacy'
import { ThemeProvider } from './ThemeWrapper/ThemeProvider'
import { MyBoards } from './MyBoards/MyBoards'
import './styles.scss'

const numberOfVisits = getFromLocalStorage<number>('numberOfVisits') || 1

const useUpdateManifest = () => {
    const location = useLocation()

    useEffect(() => {
        const href = window.location.href
        const origin = window.location.origin
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
    }, [location.pathname])
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

const ProgressiveWebAppPrompt: React.FC = () => {
    const location = useLocation()

    useEffect(() => {
        saveToLocalStorage('numberOfVisits', numberOfVisits + 1)
    }, [])

    if (hidePWA(location.pathname) || isMobileWeb()) {
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

const useReloadOnTavleUpdate = () => {
    const [settings] = useSettings()
    const isOnTavle = useMatch('/t/*')
    const [tavleOpenedAt] = useState(new Date().getTime())

    useEffect(() => {
        if (
            isOnTavle &&
            settings?.pageRefreshedAt &&
            tavleOpenedAt < settings?.pageRefreshedAt
        ) {
            window.location.reload()
        }
    }, [settings, isOnTavle, tavleOpenedAt])
}

const Content = (): JSX.Element => {
    useUpdateManifest()
    useReloadOnTavleUpdate()

    return (
        <ApolloProvider client={apolloClient}>
            <ProgressiveWebAppPrompt />
            <ThemeProvider>
                <div className={classNames('themeBackground')}>
                    <ToastProvider>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route element={<SettingsProvider />}>
                                <Route
                                    path="/t/:documentId"
                                    element={<DashboardResolver />}
                                />
                                <Route
                                    path="/admin/:documentId"
                                    element={<AdminPage />}
                                />
                            </Route>
                            <Route path="/tavler" element={<MyBoards />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="*" element={<PageDoesNotExist />} />
                        </Routes>
                    </ToastProvider>
                </div>
            </ThemeProvider>
        </ApolloProvider>
    )
}

const App = (): JSX.Element => (
    <BrowserRouter>
        <UserProvider>
            <Content />
        </UserProvider>
    </BrowserRouter>
)

export { App }
