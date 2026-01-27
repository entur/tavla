'use client'
import { CopyableText, useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'

type Props = {
    type?: 'button' | 'icon'
    bid?: string
    board?: BoardDB
    trackingLocation: EventProps<'board_copied'>['location']
}

function Copy({ type, bid, board, trackingLocation }: Props) {
    const { addToast } = useToast()
    const posthog = usePosthogTracking()

    if (!bid) return null

    const boardLink = getBoardLinkClient(bid)

    const copy = () => {
        navigator.clipboard.writeText(boardLink)
        addToast('Lenken til tavlen ble kopiert!')

        posthog.capture('board_copied', {
            location: trackingLocation,
            board_id: bid,
        })
    }

    const ariaLabel = board?.meta?.title
        ? `Kopier lenken til tavle ${board.meta.title}`
        : 'Kopier lenken til tavlen'

    if (type === 'button') {
        return (
            <CopyableText
                successHeading=""
                successMessage="Lenken til tavlen ble kopiert!"
                aria-label={ariaLabel}
                onClick={copy}
            >
                {boardLink}
            </CopyableText>
        )
    }
    return (
        <Tooltip
            content="Kopier lenken til tavlen"
            placement="bottom"
            id="tooltip-copy-link-board"
        >
            <IconButton aria-label={ariaLabel} onClick={copy}>
                <CopyIcon />
            </IconButton>
        </Tooltip>
    )
}
export { Copy }
