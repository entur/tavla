import { FloatingButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

function DeleteTileButton({
    deleteTile,
}: {
    isWideScreen: boolean
    deleteTile: () => void
}) {
    return (
        <>
            <div className="sm:block">
                <Tooltip
                    placement="bottom"
                    content="Fjern stoppested"
                    id="tooltip-remove-tile"
                >
                    <FloatingButton
                        size="small"
                        className="bg-[#d31b1b] hover:bg-[#ff5959]"
                        onClick={deleteTile}
                        aria-label="Fjern stoppested"
                        type="button"
                    >
                        <DeleteIcon />
                    </FloatingButton>
                </Tooltip>
            </div>
        </>
    )
}

export { DeleteTileButton }
