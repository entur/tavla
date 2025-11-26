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
        UC_UI: {
            isInitialized: () => boolean
            showFirstLayer: () => void
            showSecondLayer: () => void
        }
    }
}

export function showUC_UI() {
    if (typeof window !== 'undefined' && window.UC_UI) {
        window.UC_UI.showFirstLayer()
    }
}

export function showUC_UI_second() {
    if (typeof window !== 'undefined' && window.UC_UI) {
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

function isPosthogService(name?: string) {
    return !!name && name.toLowerCase().includes('posthog')
}

function isSentryService(name?: string) {
    return !!name && name.toLowerCase().includes('sentry')
}

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
        if (typeof window === 'undefined') return

        async function handleConsentUpdate(
            event: Event & { detail?: ConsentDetails },
        ) {
            if (typeof window === 'undefined') return

            const consents = formatConsentEvent(event)

            // --- PostHog consent ---
            const posthogConsent = consents?.find((consent) =>
                isPosthogService(consent.name),
            )

            if (posthogConsent?.consentGiven) {
                const controllerId = event.detail?.consent.controllerId

                posthog.init(posthogToken, basePostHogOptions)
                posthog.opt_in_capturing()
                if (controllerId) {
                    posthog.identify(controllerId)
                }
            } else {
                disablePostHog(posthogToken)
            }

            // --- Sentry consent ---
            const sentryConsent = consents?.find((consent) =>
                isSentryService(consent.name),
            )

            if (sentryConsent?.consentGiven) {
                initSentry(true)
                await waitFor(
                    () =>
                        typeof window !== 'undefined' &&
                        window.Sentry !== undefined,
                )
                window.Sentry?.setUser({
                    id: event.detail?.consent.controllerId ?? '',
                })
            } else {
                initSentry(false)
            }
        }

        window.addEventListener(
            CONSENT_UPDATED_EVENT,
            handleConsentUpdate as EventListener,
        )

        return () => {
            window.removeEventListener(
                CONSENT_UPDATED_EVENT,
                handleConsentUpdate as EventListener,
            )
        }
    }, [posthogToken])

    return null
}

function disablePostHog(posthogToken: string) {
    // opt-out og reset
    try {
        posthog.opt_out_capturing()
        posthog.reset()
    } catch {
        // Ignore mistakes
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
    if (typeof window !== 'undefined') {
        window.posthog = posthog
    }

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export function EnturToastProvider({ children }: { children: ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>
}
