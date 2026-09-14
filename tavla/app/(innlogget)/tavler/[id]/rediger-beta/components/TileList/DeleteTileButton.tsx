'use client'
import { useToast } from '@entur/alert'
import { SecondarySquareButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState } from 'react'
import type { BoardTileDB } from 'src/types/db-types/boards'
import { type DeleteTileState, deleteTile } from './actions'

function DeleteTileButton({
    boardId,
    tile,
}: {
    boardId: string
    tile: BoardTileDB
}) {
    const { addToast } = useToast()
    const { capture } = usePosthogTracking()

    async function handleDelete(
        _prevState: DeleteTileState,
    ): Promise<DeleteTileState> {
        const result = await deleteTile(boardId, tile)

        if (result?.status === 'success') {
            capture('stop_place_deleted', { location: 'edit_board_page' })
            addToast(`${tile.name} fjernet!`)
        }

        return result
    }

    const [, action, isPending] = useActionState(handleDelete, null)

    return (
        <Tooltip
            placement="bottom"
            content="Fjern stoppested"
            id="tooltip-remove-tile"
        >
            <SecondarySquareButton
                onClick={() => startTransition(() => action())}
                aria-label="Fjern stoppested"
                type="button"
                size="small"
                loading={isPending}
            >
                <DeleteIcon />
            </SecondarySquareButton>
        </Tooltip>
    )
}

export { DeleteTileButton }
