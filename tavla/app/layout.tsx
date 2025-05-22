import { Metadata } from 'next'
import Script from 'next/script'
import { ReactNode, Suspense } from 'react' //TODO: add "useEffect"
import 'styles/fonts.css'
import 'styles/imports.css'
import 'styles/reset.css'
import { Footer } from './(admin)/components/Footer'
import { Navbar } from './(admin)/components/Navbar'
import { getUserFromSessionCookie } from './(admin)/utils/server'
import { ContactForm } from './components/ContactForm'
import PostHogPageView from './components/PostHogPageView'
import './globals.css'
import { EnturToastProvider, PHProvider } from './providers'
// import {
//     CONSENT_UPDATED_EVENT,
//     ConsentDetails,
//     Consents,
//     formatConsentEvent,
//     waitFor,
// } from '../src/Shared/utils/cmpUtils'

declare global {
    interface Window {
        posthog?: {
            identify: (id: string) => void
        }
    }
}

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
    // useEffect(() => {
    //     let previousConsents: Consents | null = null
    //     const POSTHOG_SERVICE_NAME = 'PostHog.com'

    //     //TODO: Sentry (evt andre) også inn her?

    //     async function handleConsentUpdate(
    //         event: Event & { detail?: ConsentDetails },
    //     ) {
    //         if (typeof window === 'undefined') return

    //         const consents = formatConsentEvent(event)
    //         const posthogConsent = consents?.find(
    //             (c) => c.name === POSTHOG_SERVICE_NAME,
    //         )

    //         if (posthogConsent?.consentGiven) {
    //             await waitFor(() => window.posthog !== undefined)
    //             // @ts-expect-error identify does exist on posthog
    //             window.posthog?.identify(event.detail?.consent.controllerId)
    //         }

    //         if (previousConsents !== null) {
    //             const previousPostHogConsent = previousConsents?.find(
    //                 (c) => c.name === POSTHOG_SERVICE_NAME,
    //             )

    //             const posthogDeclined =
    //                 previousPostHogConsent?.consentGiven === true &&
    //                 posthogConsent?.consentGiven === false

    //             if (posthogDeclined) location.reload()
    //         }

    //         previousConsents = consents
    //     }

    //     window.addEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate)

    //     return () =>
    //         window.removeEventListener(
    //             CONSENT_UPDATED_EVENT,
    //             handleConsentUpdate,
    //         )
    // }, [])
    return (
        <html lang="nb">
            <PHProvider>
                <body className="min-h-screen">
                    <Script
                        strategy="beforeInteractive"
                        id="usercentrics-cmp"
                        src="https://web.cmp.usercentrics.eu/ui/loader.js"
                        data-draft="true"
                        data-settings-id="4OOPZiVslbVZnE"
                        async
                    />
                    <EnturToastProvider>
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
