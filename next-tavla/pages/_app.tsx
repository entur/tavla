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
import Head from 'next/head'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <title>Entur Tavla</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}
