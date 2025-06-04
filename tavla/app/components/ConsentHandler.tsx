'use client'
import { ToastProvider } from '@entur/alert'
import posthog, { PostHogConfig } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'
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
        Sentry?: {
            setUser: (user: { id: string }) => void
        }
        firebase?: {
            analytics: () => {
                setUserId: (id: string) => void
            }
        }
    }
}

const basePosthogOptions: Partial<PostHogConfig> = {
    api_host: 'https://eu.posthog.com',
    capture_pageview: false,
    autocapture: false,
    opt_out_capturing_by_default: true,
    // debug: true, // Used to test if posthog turns on only with consent
}

const POSTHOG_SERVICE_NAME = 'PostHog.com'
const SENTRY_SERVICE_NAME = 'Sentry.io'

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
                if (posthog.__loaded) {
                    posthog.identify(event.detail?.consent.controllerId)
                    posthog.opt_in_capturing()
                } else {
                    posthog.init(
                        process.env.NEXT_PUBLIC_POSTHOG_TOKEN ?? '',
                        basePosthogOptions,
                    )
                }
            } else {
                disablePosthog()
            }

            // Handle Sentry consent
            const sentryConsent = consents?.find(
                (c) => c.name === SENTRY_SERVICE_NAME,
            )

            if (sentryConsent?.consentGiven) {
                // console.log(`Sentry consent given`)
                await waitFor(() => window.Sentry !== undefined)
                window.Sentry?.setUser({
                    id: event.detail?.consent.controllerId ?? '',
                })
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

function disablePosthog() {
    if (posthog.__loaded) {
        posthog.opt_out_capturing()
        posthog.reset()
    }

    try {
        const keyPrefix = `ph_${process.env.NEXT_PUBLIC_POSTHOG_TOKEN}_posthog`
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(keyPrefix)) {
                localStorage.removeItem(key)
            }
        })
    } catch {
        // Ignore mistakes
    }
}

export function PHProvider({ children }: { children: ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export function EnturToastProvider({ children }: { children: ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>
}
