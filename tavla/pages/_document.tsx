import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

class TavlaDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <Script
                        strategy="beforeInteractive"
                        src="global-this.js"
                    ></Script>
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
                    <link rel="manifest" href="/tavlevisning.webmanifest" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default TavlaDocument
