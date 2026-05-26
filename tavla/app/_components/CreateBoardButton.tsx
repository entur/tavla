'use client'
import { Button } from '@entur/button'
import { ForwardIcon } from '@entur/icons'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'

function CreateBoardButton({
    section,
}: {
    section: EventProps<'board_create_entry'>['section']
}) {
    const { capture } = usePosthogTracking()

    return (
        <Button
            variant="primary"
            size="medium"
            as={Link}
            href="?login=entry"
            onClick={() =>
                capture('board_create_entry', {
                    location: 'landing_page',
                    section,
                })
            }
        >
            Lag en tavle <ForwardIcon aria-hidden />
        </Button>
    )
}

export { CreateBoardButton }
