'use client'
import { Button, IconButton } from '@entur/button'
import { ExternalIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Link from 'next/link'
import { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'

type Props = {
    type?: 'button' | 'icon'
    bid?: string
    board?: BoardDB
    trackingLocation: EventProps<'board_opened'>['location']
}

function Open({ type, bid, board, trackingLocation }: Props) {
    const posthog = usePosthogTracking()

    if (!bid) {
        return null
    }
    const link = getBoardLinkClient(bid)

    const ariaLabel = board?.meta?.title
        ? `Åpne tavle ${board.meta.title}`
        : 'Åpne tavle'
    if (type === 'button') {
        return (
            <Button
                variant="primary"
                as={Link}
                aria-label={ariaLabel}
                href={link ?? '/'}
                target="_blank"
                onClick={() => {
                    posthog.capture('board_opened', {
                        location: trackingLocation,
                    })
                }}
            >
                Åpne tavle
                <ExternalIcon className="!top-[-2px]" />
            </Button>
        )
    }

    return (
        <Tooltip
            content="Åpne tavle"
            placement="bottom"
            id="tooltip-open-board"
        >
            <IconButton
                as={Link}
                aria-label={ariaLabel}
                href={link ?? '/'}
                target="_blank"
                onClick={() =>
                    posthog.capture('board_opened', {
                        location: trackingLocation,
                    })
                }
            >
                <ExternalIcon />
            </IconButton>
        </Tooltip>
    )
}

export { Open }
