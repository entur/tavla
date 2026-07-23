import { SecondarySquareButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { DeleteTileButton } from './DeleteTileButton'

function EditRemoveTileButtonGroup({
    setIsTileOpen,
    deleteTile,
    trackingLocation,
}: {
    setIsTileOpen: (isOpen: boolean) => void
    deleteTile: () => void
    trackingLocation: EventProps<'stop_place_edit_cancelled'>['location']
}) {
    const { capture } = usePosthogTracking()

    return (
        <div className="flex gap-4">
            <Tooltip
                placement="bottom"
                content="Rediger stoppested"
                id="tooltip-edit-tile"
                disableFocusListener
            >
                <SecondarySquareButton
                    onClick={() => {
                        capture('stop_place_edit_started', {
                            location: trackingLocation,
                        })
                        setIsTileOpen(true)
                    }}
                    aria-label="Rediger stoppested"
                >
                    <EditIcon />
                </SecondarySquareButton>
            </Tooltip>
            <DeleteTileButton isWideScreen={true} deleteTile={deleteTile} />
        </div>
    )
}

export { EditRemoveTileButtonGroup }
