'use client'
import { Button } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/useTracking'
import Link from 'next/link'

function DemoButton() {
    const posthog = usePosthogTracking()
    return (
        <Button
            variant="secondary"
            size="medium"
            as={Link}
            href="demo"
            onClick={() => {
                posthog.capture('demo_started', {
                    location: 'landing_page',
                })
            }}
        >
            Test ut Tavla
        </Button>
    )
}
export { DemoButton }
