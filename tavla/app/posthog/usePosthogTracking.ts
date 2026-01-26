'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'
import type { EventProps, TrackingEvent } from './events'

/**
 * Single entrypoint for tracking in React components.
 * - Typed event -> typed props (from EventMap)
 * - No-op if PostHog isn't available (e.g. consent not given / not initialized)
 */
export function usePosthogTracking() {
    const posthog = usePostHog()

    const capture = useCallback(
        <E extends TrackingEvent>(event: E, properties: EventProps<E>) => {
            if (!posthog) {
                return
            }

            const isLocalDevelopment =
                window !== undefined && window.location.hostname === 'localhost'

            if (isLocalDevelopment) {
                // eslint-disable-next-line no-console
                console.log('PostHog event:', event, properties)
            }
            posthog.capture(event, properties)
        },
        [posthog],
    )

    return { capture }
}
