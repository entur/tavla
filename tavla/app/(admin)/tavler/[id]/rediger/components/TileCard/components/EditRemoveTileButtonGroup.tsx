import { FloatingButton } from '@entur/button'
import { CloseIcon, EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { DeleteTileButton } from './DeleteTileButton'

function EditRemoveTileButtonGroup({
    isTileOpen,
    hasTileChanged,
    setIsTileOpen,
    setConfirmOpen,
    deleteTile,
    trackingLocation,
}: {
    isTileOpen: boolean
    hasTileChanged: boolean
    setIsTileOpen: (isOpen: boolean) => void
    setConfirmOpen: (isOpen: boolean) => void
    deleteTile: () => void
    trackingLocation: EventProps<'stop_place_edit_cancelled'>['location']
}) {
    const posthog = usePosthogTracking()

    return (
        <div className="flex gap-md">
            <Tooltip
                placement="bottom"
                content={isTileOpen ? 'Lukk' : 'Rediger stoppested'}
                id="tooltip-edit-tile"
            >
                <FloatingButton
                    size="small"
                    onClick={() => {
                        if (!isTileOpen) {
                            posthog.capture('stop_place_edit_started', {
                                location: trackingLocation,
                            })
                        } else {
                            posthog.capture('stop_place_edit_cancelled', {
                                location: trackingLocation,
                                unsavedChanges: hasTileChanged,
                            })
                        }

                        if (hasTileChanged) return setConfirmOpen(true)
                        setIsTileOpen(!isTileOpen)
                    }}
                    aria-label={isTileOpen ? 'Lukk' : 'Rediger stoppested'}
                >
                    {isTileOpen ? <CloseIcon /> : <EditIcon />}
                </FloatingButton>
            </Tooltip>
            <DeleteTileButton isWideScreen={true} deleteTile={deleteTile} />
        </div>
    )
}

export { EditRemoveTileButtonGroup }
