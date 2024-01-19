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

import { ReactNode } from 'react'
import { Metadata } from 'next'

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

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="nb">
            <body>{children}</body>
        </html>
    )
}

export default RootLayout
