import { SmallAlertBox } from '@entur/alert'
import { Button } from '@entur/button'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import type { TFormFeedback } from 'app/(innlogget)/utils/forms'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'

function SaveCancelDeleteTileButtonGroup({
    hasTileChanged,
    setIsTileOpen,
    setConfirmOpen,
    validation,
    trackingLocation,
    fieldsChanged,
}: {
    hasTileChanged: boolean
    setIsTileOpen: (isOpen: boolean) => void
    setConfirmOpen: (confirmOpen: boolean) => void
    validation?: TFormFeedback
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    fieldsChanged: {
        name: boolean
        offset: boolean
        offset_walking_dist: boolean
        columns: boolean
        lines: boolean
        transport_mode_filter: boolean
    }
}) {
    const { capture } = usePosthogTracking()

    return (
        <>
            {validation?.feedback && (
                <SmallAlertBox variant="warning" className="mt-8 w-fit">
                    {validation.feedback}
                </SmallAlertBox>
            )}
            <div className="mt-8 flex flex-col justify-start gap-4 md:flex-row">
                <Button
                    variant="secondary"
                    width="fluid"
                    aria-label="avbryt"
                    type="button"
                    onClick={() => {
                        capture('stop_place_edit_cancelled', {
                            location: trackingLocation,
                            unsavedChanges: hasTileChanged,
                        })

                        if (hasTileChanged) return setConfirmOpen(true)
                        return setIsTileOpen(false)
                    }}
                >
                    Avbryt
                </Button>
                <SubmitButton
                    variant="primary"
                    width="fluid"
                    aria-label="lagre valg"
                    onClick={() => {
                        capture('stop_place_edit_saved', {
                            location: trackingLocation,
                            ...fieldsChanged,
                        })
                    }}
                >
                    Bekreft valg
                </SubmitButton>
            </div>
        </>
    )
}

export { SaveCancelDeleteTileButtonGroup }
