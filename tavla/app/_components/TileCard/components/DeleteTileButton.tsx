import { NegativeButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

function DeleteTileButton({
    deleteTile,
}: {
    isWideScreen: boolean
    deleteTile: () => void
}) {
    const StyledNegativeButton = (
        <NegativeButton
            onClick={deleteTile}
            aria-label="Fjern stoppested"
            type="button"
            size="medium"
            className="!min-w-0"
        >
            <DeleteIcon />
        </NegativeButton>
    )

    return (
        <div>
            <Tooltip
                placement="bottom"
                content="Fjern stoppested"
                id="tooltip-remove-tile"
            >
                {StyledNegativeButton}
            </Tooltip>
        </div>
    )
}

export { DeleteTileButton }
