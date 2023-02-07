import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import classNames from 'classnames'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from 'src/UserProvider'
import { SettingsProvider } from 'settings/SettingsProvider'
import { DashboardResolver } from 'dashboards/DashboardResolver'
import { ToastProvider } from 'src/types'
import '../firebase-init'
import { apolloClient } from '../apollo-client'
import { AdminPage } from './Admin/AdminPage'
import { PageDoesNotExist } from './Error/ErrorPages'
import { LandingPage } from './LandingPage/LandingPage'
import { Privacy } from './Privacy/Privacy'
import { MyBoards } from './MyBoards/MyBoards'
import { Sitemap } from './Sitemap/Sitemap'
import classes from './App.module.scss'

const Content = (): JSX.Element => (
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

const App = (): JSX.Element => (
    <BrowserRouter>
        <UserProvider>
            <Content />
        </UserProvider>
    </BrowserRouter>
)

export { App }
