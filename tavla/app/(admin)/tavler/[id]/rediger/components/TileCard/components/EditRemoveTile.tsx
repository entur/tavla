import { NegativeButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, DeleteIcon, EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { deleteTile } from '../actions'

function EditRemoveTile({
    bid,
    tile,
    changed,
    isOpen,
    setIsOpen,
    setConfirmOpen,
    removeTileFromDemoBoard,
    addToast,
}: {
    bid: TBoardID
    tile: TTile
    changed: boolean
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    setConfirmOpen: (isOpen: boolean) => void
    removeTileFromDemoBoard: (tile: TTile) => void
    addToast: (message: string) => void
}) {
    return (
        <div className="flex gap-md">
            <Tooltip
                placement="bottom"
                content="Rediger stoppested"
                id="tooltip-edit-tile"
            >
                <SecondarySquareButton
                    onClick={() => {
                        if (changed) return setConfirmOpen(true)
                        setIsOpen(!isOpen)
                    }}
                    aria-label="Rediger stoppested"
                >
                    {isOpen ? <CloseIcon /> : <EditIcon />}
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
                            if (bid === 'demo') {
                                removeTileFromDemoBoard(tile)
                            } else {
                                await deleteTile(bid, tile)
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
