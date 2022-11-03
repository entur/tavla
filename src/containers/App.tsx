import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from '../UserProvider'
import '../firebase-init'
import { SettingsProvider } from '../settings/SettingsProvider'
import PWAPrompt from '../../vendor/react-ios-pwa-prompt'
import { apolloClient } from '../apollo-client'
import { DashboardResolver } from '../dashboards/DashboardResolver'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../settings/LocalStorage'
import { isMobileWeb } from '../utils/utils'
import { ToastProvider } from '../types'
import { useUpdateManifest } from '../hooks/useUpdateManifest'
import { AdminPage } from './Admin/AdminPage'
import { PageDoesNotExist } from './Error/ErrorPages'
import { LandingPage } from './LandingPage/LandingPage'
import { Privacy } from './Privacy/Privacy'
import { ThemeProvider } from './ThemeWrapper/ThemeProvider'
import { MyBoards } from './MyBoards/MyBoards'
import './styles.scss'

const numberOfVisits = getFromLocalStorage<number>('numberOfVisits') || 1

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

const Content = (): JSX.Element => {
    useUpdateManifest()

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
