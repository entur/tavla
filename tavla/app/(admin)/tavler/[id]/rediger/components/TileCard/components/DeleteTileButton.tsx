import { FloatingButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

function DeleteTileButton({
    isWideScreen,
    deleteTile,
}: {
    isWideScreen: boolean
    deleteTile: () => void
}) {
    return (
        <>
            <div className={isWideScreen ? 'hidden sm:block' : 'sm:hidden'}>
                <Tooltip
                    placement="bottom"
                    content="Fjern stoppested"
                    id="tooltip-remove-tile"
                >
                    <FloatingButton
                        size="small"
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
