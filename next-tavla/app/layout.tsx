import 'styles/imports.css'
import 'styles/fonts.css'
import 'styles/reset.css'
import './globals.css'

import { ReactNode } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { EnturToastProvider, PHProvider } from './providers'
import { Footer } from './(admin)/components/Footer'
import { FloatingContact } from './components/FloatingContact'
import { TopNavigation } from './(admin)/components/TopNavigation'
import { cookies } from 'next/headers'
import { verifySession } from './(admin)/utils/firebase'

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

const PostHogPageView = dynamic(() => import('./components/PostHogPageView'), {
    ssr: false,
})

async function RootLayout({ children }: { children: ReactNode }) {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null
    return (
        <html lang="nb">
            <PHProvider>
                <EnturToastProvider>
                    <body>
                        <TopNavigation loggedIn={loggedIn} />
                        <PostHogPageView />
                        {children}
                        <FloatingContact />
                        <Footer loggedIn={loggedIn} />
                    </body>
                </EnturToastProvider>
            </PHProvider>
        </html>
    )
}

export default RootLayout
