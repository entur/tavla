'use client'
import { CopyableText, useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { usePostHog } from 'posthog-js/react'
import { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'

type Props = {
    type?: 'button' | 'icon'
    bid?: string
    board?: BoardDB
    trackingEvent: string
}

function Copy({ type, bid, board, trackingEvent }: Props) {
    const { addToast } = useToast()
    const posthog = usePostHog()

    if (!bid) return null

    const boardLink = getBoardLinkClient(bid)

    const copy = () => {
        navigator.clipboard.writeText(boardLink)
        addToast('Lenken til tavlen ble kopiert!')
        posthog.capture(trackingEvent)
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
