import { Metadata } from 'next'
import { ReactNode, Suspense } from 'react'
import 'styles/fonts.css'
import 'styles/imports.css'
import 'styles/reset.css'
import { getUserFromSessionCookie } from './(admin)/utils/server'
import { CompactModeProvider } from './components/CompactModeProvider'
import { ConditionalFooter } from './components/ConditionalFooter'
import { ConditionalNavbar } from './components/ConditionalNavbar'
import { ContactForm } from './components/ContactForm'
import PostHogPageView from './components/PostHogPageView'
import './globals.css'
import { EnturToastProvider, PHProvider } from './providers'

export const metadata: Metadata = {
    title: 'Entur Tavla',
    manifest: '/site.webmanifest',
    icons: [
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            url: '/apple-touch-icon.png',
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            url: '/favicon-32x32.png',
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            url: '/favicon-16x16.png',
        },
    ],
}

async function RootLayout({ children }: { children: ReactNode }) {
    const loggedIn = (await getUserFromSessionCookie()) !== null
    return (
        <html lang="nb">
            <PHProvider>
                <body className="min-h-screen">
                    <EnturToastProvider>
                        <CompactModeProvider>
                            <ConditionalNavbar loggedIn={loggedIn} />
                            <Suspense>
                                <PostHogPageView />
                            </Suspense>
                            {children}
                            <ContactForm />
                            <ConditionalFooter loggedIn={loggedIn} />
                        </CompactModeProvider>
                    </EnturToastProvider>
                </body>
            </PHProvider>
        </html>
    )
}

export default RootLayout
