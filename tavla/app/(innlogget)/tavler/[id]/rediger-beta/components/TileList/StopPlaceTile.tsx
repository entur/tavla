'use client'
import { useToast } from '@entur/alert'
import { SecondaryButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { LeadParagraph } from '@entur/typography'
import { useState } from 'react'
import type { BoardTileDB } from 'src/types/db-types/boards'
import { deleteTile } from './actions'
import { DeleteTileButton } from './DeleteTileButton'
import { EditStopPlaceModal } from './EditStopPlaceModal'

export function StopPlaceTile({
    boardId,
    tile,
}: {
    boardId: string
    tile: BoardTileDB
}) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const { addToast } = useToast()

    function handleDelete() {
        deleteTile(boardId, tile).then(() => addToast(`${tile.name} fjernet!`))
    }

    return (
        <div className="flex items-center justify-between rounded bg-tintLight p-6">
            <LeadParagraph margin="none">
                {tile.displayName ?? tile.name}
            </LeadParagraph>
            <div className="flex gap-2">
                <SecondaryButton
                    size="small"
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center gap-2 px-2 py-1"
                >
                    <EditIcon /> Rediger
                </SecondaryButton>
                <DeleteTileButton deleteTile={handleDelete} />
            </div>
            <EditStopPlaceModal
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                tile={tile}
            />
        </div>
    )
}
