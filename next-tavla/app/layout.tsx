import 'styles/themes/default.css'
import 'styles/themes/dark.css'
import 'styles/themes/light.css'
import 'styles/imports.css'
import 'styles/global.css'
import 'styles/reset.css'
import 'styles/fonts.css'
import 'styles/spacing.css'
import 'styles/misc.css'
import 'styles/placement.css'
import 'styles/text.css'
import 'styles/constraints.css'

import { ReactNode } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { PHProvider } from './providers'

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

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="nb">
            <PHProvider>
                <body>
                    <PostHogPageView />
                    {children}
                </body>
            </PHProvider>
        </html>
    )
}

export default RootLayout
