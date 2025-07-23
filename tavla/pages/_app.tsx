import type { AppProps } from 'next/app'
import Head from 'next/head'
import 'styles/fonts.css'
import 'styles/imports.css'
import 'styles/reset.css'
import '../app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Entur Tavla</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}
