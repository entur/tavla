import { NegativeButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, DeleteIcon, EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { TileContext } from 'Board/scenarios/Table/contexts'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { deleteTile } from '../actions'

function EditRemoveTile({
    boardId,
    isTileOpen,
    hasTileChanged,
    setIsTileOpen,
    setConfirmOpen,
    removeTileFromDemoBoard,
    addToast,
}: {
    boardId: TBoardID
    isTileOpen: boolean
    hasTileChanged: boolean
    setIsTileOpen: (isOpen: boolean) => void
    setConfirmOpen: (isOpen: boolean) => void
    removeTileFromDemoBoard: (tile: TTile) => void
    addToast: (message: string) => void
}) {
    const tile = useNonNullContext(TileContext)
    return (
        <div className="flex gap-md">
            <Tooltip
                placement="bottom"
                content="Rediger stoppested"
                id="tooltip-edit-tile"
            >
                <SecondarySquareButton
                    onClick={() => {
                        if (hasTileChanged) return setConfirmOpen(true)
                        setIsTileOpen(!isTileOpen)
                    }}
                    aria-label="Rediger stoppested"
                >
                    {isTileOpen ? <CloseIcon /> : <EditIcon />}
                </SecondarySquareButton>
            </Tooltip>
            <div className="hidden sm:block">
                <Tooltip
                    placement="bottom"
                    content="Fjern stoppested"
                    id="tooltip-remove-tile"
                >
                    <NegativeButton
                        onClick={async () => {
                            if (boardId === 'demo') {
                                removeTileFromDemoBoard(tile)
                            } else {
                                await deleteTile(boardId, tile)
                            }
                            addToast(`${tile.name} fjernet!`)
                        }}
                        aria-label="Fjern stoppested"
                        width="fluid"
                        className="!min-w-0"
                    >
                        <DeleteIcon />
                    </NegativeButton>
                </Tooltip>
            </div>
        </div>
    )
}

export { EditRemoveTile }
