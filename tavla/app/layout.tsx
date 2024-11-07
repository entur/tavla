import 'styles/imports.css'
import 'styles/fonts.css'
import 'styles/reset.css'
import './globals.css'

import { ReactNode, Suspense } from 'react'
import { Metadata } from 'next'
import { EnturToastProvider, PHProvider } from './providers'
import { Footer } from './(admin)/components/Footer'
import { TopNavigation } from './(admin)/components/TopNavigation'
import { cookies } from 'next/headers'
import { verifySession } from './(admin)/utils/firebase'
import { ContactForm } from './components/ContactForm'
import PostHogPageView from './components/PostHogPageView'

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
    const session = (await cookies()).get('session')?.value
    const loggedIn = (await verifySession(session)) !== null
    return (
        <html lang="nb">
            <PHProvider>
                <EnturToastProvider>
                    <body>
                        <TopNavigation loggedIn={loggedIn} />
                        <Suspense>
                            <PostHogPageView />
                        </Suspense>
                        {children}
                        <ContactForm />
                        <Footer />
                    </body>
                </EnturToastProvider>
            </PHProvider>
        </html>
    )
}

export default RootLayout
