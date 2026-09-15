'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'
import type { CaptureArgs, TrackingEvent } from './events'

/**
 * Debounce timing used when capturing input that changes rapidly.
 */
export const TRACKING_DEBOUNCE_TIME = 500

/**
 * Single entrypoint for tracking in React components.
 * - Typed event -> typed props (from EventMap)
 * - No-op if PostHog isn't available (e.g. consent not given / not initialized)
 */
export function usePosthogTracking() {
    const posthog = usePostHog()

    const capture = useCallback(
        <E extends TrackingEvent>(event: E, ...args: CaptureArgs<E>) => {
            if (!posthog) {
                return
            }

            const properties = args[0] ?? undefined

            if (posthog.has_opted_in_capturing()) {
                posthog.capture(event, properties)
            }
        },
        [posthog],
    )

    return { capture }
}
