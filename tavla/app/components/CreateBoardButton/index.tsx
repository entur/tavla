'use client'
import { Button } from '@entur/button'
import { ForwardIcon } from '@entur/icons'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'

function CreateBoardButton() {
    const posthog = usePosthogTracking()
    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="?login=entry"
            onClick={() => {
                posthog.capture('board_create_entry', {
                    location: 'landing_page',
                })
            }}
        >
            Lag en tavle <ForwardIcon aria-hidden />
        </Button>
    )
}

export { CreateBoardButton }
