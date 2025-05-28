'use client'

import { useEffect } from 'react'
import {
    CONSENT_UPDATED_EVENT,
    ConsentDetails,
    Consents,
    formatConsentEvent,
    waitFor,
} from '../../src/Shared/utils/cmpUtils'
import * as Sentry from '@sentry/react'

declare global {
    interface Window {
        posthog?: {
            identify: (id: string) => void
        }
        Sentry?: {
            setUser: (user: { id: string }) => void
        }
    }
}

const POSTHOG_SERVICE_NAME = 'PostHog.com'
const SENTRY_SERVICE_NAME = 'Sentry'

export function initSentry(consent: boolean) {
    Sentry.close().then(() => {
        if (process.env.NODE_ENV === 'production') {
            Sentry.init({
                dsn: 'https://5f539001c534616984cd2b40e794ae39@o4508182734503936.ingest.de.sentry.io/4508336084484176',
                beforeSend(event) {
                    if (!consent) return null
                    return event
                },
            })
        }
    })
}

export default function ConsentHandler() {
    useEffect(() => {
        let previousConsents: Consents | null = null

        async function handleConsentUpdate(
            event: Event & { detail?: ConsentDetails },
        ) {
            if (typeof window === 'undefined') return

            const consents = formatConsentEvent(event)

            // Handle PostHog consent
            const posthogConsent = consents?.find(
                (c) => c.name === POSTHOG_SERVICE_NAME,
            )

            if (posthogConsent?.consentGiven) {
                await waitFor(() => window.posthog !== undefined)
                // @ts-expect-error identify does exist on posthog
                window.posthog?.identify(event.detail?.consent.controllerId)
            }

            // Handle Sentry consent
            const sentryConsent = consents?.find(
                (c) => c.name === SENTRY_SERVICE_NAME,
            )

            if (sentryConsent?.consentGiven) {
                initSentry(true)
                await waitFor(() => window.Sentry !== undefined)
                window.Sentry?.setUser({
                    id: event.detail?.consent.controllerId ?? '',
                })
            } else {
                initSentry(false)
            }

            // Handle previous consents for PostHog and Sentry
            if (previousConsents !== null) {
                // Handle PostHog
                const previousPostHogConsent = previousConsents?.find(
                    (c) => c.name === POSTHOG_SERVICE_NAME,
                )

                const posthogDeclined =
                    previousPostHogConsent?.consentGiven === true &&
                    posthogConsent?.consentGiven === false

                if (posthogDeclined) location.reload()

                // Handle Sentry
                const previousSentryConsent = previousConsents?.find(
                    (c) => c.name === SENTRY_SERVICE_NAME,
                )

                const sentryDeclined =
                    previousSentryConsent?.consentGiven === true &&
                    sentryConsent?.consentGiven === false

                if (sentryDeclined) location.reload()
            }

            previousConsents = consents
        }

        window.addEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate)

        return () =>
            window.removeEventListener(
                CONSENT_UPDATED_EVENT,
                handleConsentUpdate,
            )
    }, [])

    return null
}
