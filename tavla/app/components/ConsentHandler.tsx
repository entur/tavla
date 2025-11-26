'use client'
import { ToastProvider } from '@entur/alert'
import * as Sentry from '@sentry/react'
import posthog, { PostHogConfig } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'
import {
    CONSENT_UPDATED_EVENT,
    ConsentDetails,
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
    }
}

export function showUC_UI() {
    if (typeof window !== 'undefined') {
        window.UC_UI.showFirstLayer()
    }
}

export function showUC_UI_second() {
    if (typeof window !== 'undefined') {
        window.UC_UI.showSecondLayer()
    }
}

const basePostHogOptions: Partial<PostHogConfig> = {
    api_host: 'https://eu.i.posthog.com',
    capture_pageview: false,
    autocapture: false,
    opt_out_capturing_by_default: true,
    // debug: true, // Used to test if PostHog turns on only with consent
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

export default function ConsentHandler({
    posthogToken,
}: {
    posthogToken: string
}) {
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
                if (posthog.__loaded) {
                    posthog.identify(event.detail?.consent.controllerId)
                    posthog.opt_in_capturing()
                } else {
                    posthog.init(posthogToken, basePostHogOptions)
                }
            } else {
                disablePostHog(posthogToken)
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
            }
        }

        window.addEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate)

        return () =>
            window.removeEventListener(
                CONSENT_UPDATED_EVENT,
                handleConsentUpdate,
            )
    }, [posthogToken])

    return null
}

function disablePostHog(posthogToken: string) {
    if (posthog.__loaded) {
        posthog.opt_out_capturing()
        posthog.reset()
    }

    try {
        const keyPrefix = `ph_${posthogToken}_posthog`
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
