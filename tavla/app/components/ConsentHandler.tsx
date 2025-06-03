'use client'

import { useEffect } from 'react'
import {
    CONSENT_UPDATED_EVENT,
    ConsentDetails,
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
                dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_URL,
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
        async function handleConsentUpdate(
            event: Event & { detail?: ConsentDetails },
        ) {
            if (typeof window === 'undefined') return

            const consents = formatConsentEvent(event)

            // Handle PostHog consent
            const posthogConsent = consents?.find(
                (consent) => consent.name === POSTHOG_SERVICE_NAME,
            )

            if (posthogConsent?.consentGiven) {
                await waitFor(() => window.posthog !== undefined)
                window.posthog?.identify(
                    event.detail?.consent.controllerId ?? '',
                )
            }

            // Handle Sentry consent
            const sentryConsent = consents?.find(
                (consent) => consent.name === SENTRY_SERVICE_NAME,
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
