'use client'
import { Button } from '@entur/button'
import { ForwardIcon } from '@entur/icons'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'

export function NavigateToOversiktButton() {
    const posthog = usePosthogTracking()
    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="/oversikt"
            onClick={() => {
                posthog.capture('to_oversikt_clicked', {
                    location: 'landing_page',
                })
            }}
        >
            Gå til mine tavler
            <ForwardIcon />
        </Button>
    )
}
