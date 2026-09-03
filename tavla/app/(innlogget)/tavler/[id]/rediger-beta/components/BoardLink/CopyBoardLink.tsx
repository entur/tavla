'use client'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'

function CopyBoardLink({ board }: { board: BoardDB }) {
    const { addToast } = useToast()
    const { capture } = usePosthogTracking()

    const boardLink = getBoardLinkClient(board.customUrl ?? board.id)

    const copy = () => {
        navigator.clipboard.writeText(boardLink)
        addToast('Lenken til tavlen ble kopiert!')

        capture('board_copied', {
            location: 'edit_board_page',
        })
    }

    const ariaLabel = board.meta?.title
        ? `Kopier lenken til tavle ${board.meta.title}`
        : 'Kopier lenken til tavla'

    return (
        <Tooltip
            content="Kopier lenken til tavla"
            placement="bottom"
            id="tooltip-copy-link-board-beta"
        >
            <IconButton aria-label={ariaLabel} onClick={copy}>
                <CopyIcon />
            </IconButton>
        </Tooltip>
    )
}

export { CopyBoardLink }
