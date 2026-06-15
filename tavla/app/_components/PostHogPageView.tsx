'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export default function PostHogPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const posthog = usePostHog()

    useEffect(() => {
        if (pathname && posthog) {
            const url = window.origin + pathname
            const params = searchParams?.toString()
                ? '?' + searchParams.toString()
                : ''
            posthog.capture('$pageview', { $current_url: url + params })
        }
    }, [pathname, searchParams, posthog])
    return null
}
