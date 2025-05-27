'use client'

import { useEffect } from 'react'
import {
    CONSENT_UPDATED_EVENT,
    ConsentDetails,
    Consents,
    formatConsentEvent,
    waitFor,
} from '../../src/Shared/utils/cmpUtils'

declare global {
    interface Window {
        posthog?: {
            identify: (id: string) => void
        }
    }
}

const POSTHOG_SERVICE_NAME = 'PostHog.com'

export default function ConsentHandler() {
    useEffect(() => {
        let previousConsents: Consents | null = null

        async function handleConsentUpdate(
            event: Event & { detail?: ConsentDetails },
        ) {
            if (typeof window === 'undefined') return

            const consents = formatConsentEvent(event)
            const posthogConsent = consents?.find(
                (c) => c.name === POSTHOG_SERVICE_NAME,
            )

            if (posthogConsent?.consentGiven) {
                await waitFor(() => window.posthog !== undefined)
                // @ts-expect-error identify does exist on posthog
                window.posthog?.identify(event.detail?.consent.controllerId)
            }

            if (previousConsents !== null) {
                const previousPostHogConsent = previousConsents?.find(
                    (c) => c.name === POSTHOG_SERVICE_NAME,
                )

                const posthogDeclined =
                    previousPostHogConsent?.consentGiven === true &&
                    posthogConsent?.consentGiven === false

                if (posthogDeclined) location.reload()
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
