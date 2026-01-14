'use client'
import { CopyableText, useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { useLink } from 'hooks/useLink'
import { usePostHog } from 'posthog-js/react'
import { BoardDB } from 'types/db-types/boards'

type Props = {
    type?: 'button' | 'icon'
    bid?: string
    board?: BoardDB
    trackingEvent: string
}

function Copy({ type, bid, board, trackingEvent }: Props) {
    const { addToast } = useToast()
    const link = useLink(bid)
    const posthog = usePostHog()

    if (!link) return null

    const copy = () => {
        navigator.clipboard.writeText(link)
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
                {link}
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
