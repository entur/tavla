import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
    DocumentInitialProps,
} from 'next/document'
import { isUnsupportedBrowser } from 'utils/browserDetection'

interface TavlaDocumentProps extends DocumentInitialProps {
    needsRefresh: boolean
}

class TavlaDocument extends Document {
    static async getInitialProps(
        context: DocumentContext,
    ): Promise<TavlaDocumentProps> {
        const initialProps = await Document.getInitialProps(context)
        const ua = context.req?.headers['user-agent'] || ''

        const needsRefresh = isUnsupportedBrowser(ua)
        return {
            ...initialProps,
            needsRefresh,
        }
    }

    render() {
        const { needsRefresh } = this.props as unknown as TavlaDocumentProps

        return (
            <Html>
                <Head>
                    {needsRefresh && <meta httpEquiv="refresh" content="60" />}
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
