'use client'
import { Button } from '@entur/button'
import { ForwardIcon } from '@entur/icons'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'

export function NavigateToOversiktButton() {
    const { capture } = usePosthogTracking()
    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="/oversikt"
            onClick={() => {
                capture('admin_page_opened', {
                    location: 'landing_page',
                })
            }}
        >
            Gå til mine tavler
            <ForwardIcon />
        </Button>
    )
}
