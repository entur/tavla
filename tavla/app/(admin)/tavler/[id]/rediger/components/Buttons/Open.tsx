'use client'
import { Button, IconButton } from '@entur/button'
import { ExternalIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { BoardDB } from 'types/db-types/boards'
import { getBoardLinkClient } from 'utils/boardLink'

type Props = {
    type?: 'button' | 'icon'
    bid?: string
    board?: BoardDB
    trackingEvent: string
}

function Open({ type, bid, board, trackingEvent }: Props) {
    const posthog = usePostHog()

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
                onClick={() => posthog.capture(trackingEvent)}
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
                onClick={() => posthog.capture(trackingEvent)}
            >
                <ExternalIcon />
            </IconButton>
        </Tooltip>
    )
}

export { Open }
