import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import classNames from 'classnames'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from 'src/UserProvider'
import { SettingsProvider } from 'settings/SettingsProvider'
import { ToastProvider } from 'src/types'
import { DashboardResolver } from 'src/routes/Dashboard'
import { LandingPage } from 'src/routes/LandingPage'
import { Privacy } from 'src/routes/Privacy'
import { PageDoesNotExist } from 'src/routes/PageDoesNotExist'
import { Sitemap } from 'src/routes/Sitemap'
import { AdminPage } from 'src/routes/Admin'
import { MyBoards } from 'src/routes/MyBoards'
import '../firebase-init'
import { apolloClient } from '../apollo-client'
import classes from './App.module.scss'

function Content() {
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
