'use client'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { AddCardIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import type { BoardDB } from 'src/types/db-types/boards'
import { duplicateBoardAction } from '../../utils/actions'

function DuplicateBoard({ board }: { board: BoardDB }) {
    const { addToast } = useToast()

    const ariaLabel = board.meta?.title
        ? `Dupliser tavle ${board.meta.title}`
        : 'Dupliser tavle'

    const handleClick = async () => {
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
                <AddCardIcon aria-label="Dupliser-ikon" />
            </IconButton>
        </Tooltip>
    )
}

export { DuplicateBoard }
