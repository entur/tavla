import { SecondarySquareButton } from '@entur/button'
import { CloseIcon, EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { BoardDB, BoardTileDB } from 'types/db-types/boards'
import { DeleteTileButton } from './DeleteTileButton'

function EditRemoveTileButtonGroup({
    isTileOpen,
    hasTileChanged,
    setIsTileOpen,
    setConfirmOpen,
    deleteTile,
}: {
    isTileOpen: boolean
    hasTileChanged: boolean
    setIsTileOpen: (isOpen: boolean) => void
    setConfirmOpen: (isOpen: boolean) => void
    deleteTile: (
        boardId: string,
        tile: BoardTileDB,
        demoBoard?: BoardDB,
    ) => void
}) {
    return (
        <div className="flex gap-md">
            <Tooltip
                placement="bottom"
                content={isTileOpen ? 'Lukk' : 'Rediger stoppested'}
                id="tooltip-edit-tile"
            >
                <SecondarySquareButton
                    onClick={() => {
                        if (hasTileChanged) return setConfirmOpen(true)
                        setIsTileOpen(!isTileOpen)
                    }}
                    aria-label={isTileOpen ? 'Lukk' : 'Rediger stoppested'}
                >
                    {isTileOpen ? <CloseIcon /> : <EditIcon />}
                </SecondarySquareButton>
            </Tooltip>
            <DeleteTileButton isWideScreen={true} deleteTile={deleteTile} />
        </div>
    )
}

export { EditRemoveTileButtonGroup }
