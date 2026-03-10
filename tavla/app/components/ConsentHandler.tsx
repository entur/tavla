'use client'
import { ToastProvider } from '@entur/alert'
import * as Sentry from '@sentry/react'
import posthog, { PostHogConfig } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'
import {
    CMP_INITIALIZE_EVENT,
    CONSENT_UPDATED_EVENT,
    ConsentDetails,
    formatConsentEvent,
    waitFor,
} from '../../src/utils/cmpUtils'

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

const DECLINED_AT_KEY = 'uc_consent_declined_at'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export default function ConsentHandler({
    posthogToken,
}: {
    posthogToken: string
}) {
    useEffect(() => {
        if (typeof window === 'undefined') return

        function handleUCInitialized() {
            const declinedAt = localStorage.getItem(DECLINED_AT_KEY)
            if (!declinedAt) {
                return
            }

            const isMoreThanSevenDaysAgo =
                Date.now() - Number(declinedAt) > SEVEN_DAYS_MS

            if (isMoreThanSevenDaysAgo) {
                localStorage.removeItem(DECLINED_AT_KEY)
                window.UC_UI?.showFirstLayer()
            }
        }

        window.addEventListener(CMP_INITIALIZE_EVENT, handleUCInitialized)

        async function handleConsentUpdate(
            event: Event & { detail?: ConsentDetails },
        ) {
            // eslint-disable-next-line no-console
            console.log('Consent updated:', event.detail, event) // Log the consent details for debugging
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
            if (!posthogConsent?.consentGiven && !sentryConsent?.consentGiven) {
                // If the user has declined all consents, show the consent banner again after 7 days
                localStorage.setItem(DECLINED_AT_KEY, String(Date.now()))
            } else {
                localStorage.removeItem(DECLINED_AT_KEY)
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
            window.removeEventListener(
                CMP_INITIALIZE_EVENT,
                handleUCInitialized,
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
