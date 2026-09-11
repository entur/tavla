import { SecondarySquareButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

function DeleteTileButton({ deleteTile }: { deleteTile: () => void }) {
    return (
        <Tooltip
            placement="bottom"
            content="Fjern stoppested"
            id="tooltip-remove-tile"
        >
            <SecondarySquareButton
                onClick={deleteTile}
                aria-label="Fjern stoppested"
                type="button"
                size="small"
            >
                <DeleteIcon />
            </SecondarySquareButton>
        </Tooltip>
    )
}

export { DeleteTileButton }
