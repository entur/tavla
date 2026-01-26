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
                // eslint-disable-next-line no-console
                console.log(
                    'Not capturing event, PostHog not initialized:',
                    event,
                    properties,
                )
                return
            }
            const res = posthog.capture(event, properties)
            if (res === undefined) {
                // eslint-disable-next-line no-console
                console.log(
                    'Not capturing event, capture was unsuccesful:',
                    event,
                    properties,
                )
            }
        },
        [posthog],
    )

    const reset = useCallback(() => {
        if (!posthog) return
        posthog.reset()
    }, [posthog])

    return { capture, reset }
}
