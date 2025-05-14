import 'styles/imports.css'
import 'styles/fonts.css'
import 'styles/reset.css'
import './globals.css'
import { ReactNode, Suspense } from 'react'
import { Metadata } from 'next'
import { EnturToastProvider, PHProvider } from './providers'
import { Footer } from './(admin)/components/Footer'
import { TopNavigation } from './(admin)/components/TopNavigation'
import { ContactForm } from './components/ContactForm'
import PostHogPageView from './components/PostHogPageView'
import { getUserFromSessionCookie } from './(admin)/utils/server'

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
                <body>
                    <EnturToastProvider>
                        <TopNavigation loggedIn={loggedIn} />
                        <Suspense>
                            <PostHogPageView />
                        </Suspense>
                        {children}
                        <ContactForm />
                        <Footer loggedIn={loggedIn} />
                    </EnturToastProvider>
                </body>
            </PHProvider>
        </html>
    )
}

export default RootLayout
