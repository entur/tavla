import { Metadata } from 'next'
import Script from 'next/script'
import { ReactNode, Suspense } from 'react'
import 'styles/fonts.css'
import 'styles/imports.css'
import 'styles/reset.css'
import { Footer } from './(admin)/components/Footer'
import { Navbar } from './(admin)/components/Navbar'
import { getUserFromSessionCookie } from './(admin)/utils/server'
import ConsentHandler, {
    EnturToastProvider,
    PHProvider,
} from './components/ConsentHandler'
import { ContactForm } from './components/ContactForm'
import PostHogPageView from './components/PostHogPageView'
import './globals.css'

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
            <head>
                <Script
                    strategy="beforeInteractive"
                    id="usercentrics-cmp"
                    src="https://web.cmp.usercentrics.eu/ui/loader.js"
                    // data-draft="true" // used for testing draft version of banner
                    data-settings-id={process.env.USERCENTRICS_DATA_SETTINGS_ID}
                    async
                />
                <ConsentHandler />
            </head>
            <PHProvider>
                <body className="min-h-screen">
                    <EnturToastProvider>
                        <Navbar loggedIn={loggedIn} />
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
