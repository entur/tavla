'use client'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { AdditionalIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { BoardDB } from 'src/types/db-types/boards'
import { duplicateBoardAction } from '../../utils/actions'

function DuplicateBoard({
    board,
    trackingLocation,
}: {
    board: BoardDB
    trackingLocation: EventProps<'board_duplicated'>['location']
}) {
    const { addToast } = useToast()
    const { capture } = usePosthogTracking()

    const ariaLabel = board.meta?.title
        ? `Dupliser tavle ${board.meta.title}`
        : 'Dupliser tavle'

    const handleClick = async () => {
        capture('board_duplicated', { location: trackingLocation })
        await duplicateBoardAction(board)
        addToast('Tavle duplisert!')
    }

    return (
        <Tooltip
            content="Dupliser tavle"
            placement="bottom"
            id="tooltip-duplicate-board"
        >
            <IconButton aria-label={ariaLabel} onClick={handleClick}>
                <AdditionalIcon aria-label="Dupliser-ikon" />
            </IconButton>
        </Tooltip>
    )
}

export { DuplicateBoard }
