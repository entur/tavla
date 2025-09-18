'use client'
import { ToastProvider } from '@entur/alert'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode } from 'react'

if (typeof window !== 'undefined') {
    posthog.init('phc_Iu3qLYA1btPuImlxyuQajuvQUoxp6ShId7wwvaMZGJb', {
        api_host: 'https://eu.posthog.com',
        capture_pageview: false, // This will be done manually
        autocapture: false, // We will capture manually
        opt_out_capturing_by_default: true,
    })
}

export function PHProvider({ children }: { children: ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export function EnturToastProvider({ children }: { children: ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>
}
