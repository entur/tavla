import 'styles/imports.css'
import 'styles/fonts.css'
import 'styles/reset.css'
import '../app/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Entur Tavla</title>
                <script
                    key="cmp"
                    id="usercentrics-cmp"
                    src="https://web.cmp.usercentrics.eu/ui/loader.js"
                    data-settings-id="4OOPZiVslbVZnE"
                    async
                />
            </Head>
            <Component {...pageProps} />
        </>
    )
}
