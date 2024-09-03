'use client'
import { Button } from '@entur/button'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'

function DemoButton() {
    const posthog = usePostHog()
    return (
        <Button
            variant="secondary"
            size="medium"
            as={Link}
            href="demo"
            onClick={() => {
                posthog.capture('DEMO_BTN_FROM_LANDING')
            }}
        >
            Test ut Tavla
        </Button>
    )
}
export { DemoButton }
