import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from 'settings/UserProvider'
import { SettingsProvider } from 'settings/SettingsProvider'
import { ToastProvider } from 'src/types'
import { DashboardResolver } from 'src/routes/Dashboard'
import { LandingPage } from 'src/routes/LandingPage'
import { Privacy } from 'src/routes/Privacy'
import { PageDoesNotExist } from 'scenarios/ErrorPages/PageDoesNotExist'
import { Sitemap } from 'src/routes/Sitemap'
import { AdminPage } from 'src/routes/Admin'
import { MyBoards } from 'src/routes/MyBoards'
import 'settings/firebase-init'
import { apolloClient } from 'utils/apollo-client'
import { logPageViews } from 'src/posthog'
import classes from './App.module.scss'

function Content() {
    const location = useLocation()

    useEffect(() => {
        logPageViews()
    }, [location.pathname])
    return (
        <ApolloProvider client={apolloClient}>
            <div className={classNames(classes.ThemeBackground)}>
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
                        <Route path="/nettstedkart" element={<Sitemap />} />
                        <Route path="*" element={<PageDoesNotExist />} />
                    </Routes>
                </ToastProvider>
            </div>
        </ApolloProvider>
    )
}

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <Content />
            </UserProvider>
        </BrowserRouter>
    )
}

export { App }
