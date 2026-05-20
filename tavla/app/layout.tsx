import { SkipToContent } from '@entur/a11y'
import type { Metadata } from 'next'
import Script from 'next/script'
import { type ReactNode, Suspense } from 'react'
import 'src/styles/fonts.css'
import 'src/styles/imports.css'
import 'src/styles/reset.css'
import ConsentHandler, {
    EnturToastProvider,
    PHProvider,
} from 'app/_components/ConsentHandler'
import { ContactForm } from 'app/_components/ContactForm'
import { FocusManager } from 'app/_components/FocusManager'
import PostHogPageView from 'app/_components/PostHogPageView'
import { Footer } from './(innlogget)/components/Footer'
import { Navbar } from './(innlogget)/components/Navbar'
import { getUserFromSessionCookie } from './(innlogget)/utils/server'
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
                <ConsentHandler
                    posthogToken={process.env.NEXT_PUBLIC_POSTHOG_TOKEN ?? ''}
                />
            </head>
            <PHProvider>
                <body className="min-h-screen">
                    <EnturToastProvider>
                        <SkipToContent>Gå til hovedinnhold</SkipToContent>
                        <FocusManager />
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
