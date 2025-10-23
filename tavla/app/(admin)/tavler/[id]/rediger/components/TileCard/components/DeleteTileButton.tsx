import { NegativeButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { BoardDB, BoardTileDB } from 'types/db-types/boards'

function DeleteTileButton({
    isWideScreen,
    deleteTile,
}: {
    isWideScreen: boolean
    deleteTile: (
        boardId: string,
        tile: BoardTileDB,
        demoBoard?: BoardDB,
    ) => void
}) {
    const StyledNegativeButton = (
        <NegativeButton
            onClick={deleteTile}
            aria-label="Fjern stoppested"
            type="button"
            width="fluid"
            className={isWideScreen ? '!min-w-0' : ''}
        >
            <DeleteIcon />
            {!isWideScreen && <>Fjern stoppested</>}
        </NegativeButton>
    )

    return (
        <>
            <div className={isWideScreen ? 'hidden sm:block' : 'sm:hidden'}>
                {isWideScreen ? (
                    <Tooltip
                        placement="bottom"
                        content="Fjern stoppested"
                        id="tooltip-remove-tile"
                    >
                        {StyledNegativeButton}
                    </Tooltip>
                ) : (
                    StyledNegativeButton
                )}
            </div>
        </>
    )
}

export { DeleteTileButton }
