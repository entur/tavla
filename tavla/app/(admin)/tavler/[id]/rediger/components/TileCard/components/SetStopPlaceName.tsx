import { Heading4, SubParagraph } from '@entur/typography'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useRef, useState } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'

function SetStopPlaceName({
    state,
    trackingLocation,
    board_id,
}: {
    state?: TFormFeedback
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    board_id: string
}) {
    const posthog = usePosthogTracking()
    const tile = useNonNullContext(TileContext)
    const [displayName, setDisplayName] = useState(tile.displayName ?? '')
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    return (
        <div className="flex flex-col gap-2">
            <Heading4 margin="bottom">Navn på stoppested</Heading4>
            <div>
                <SubParagraph margin="none">
                    Dette navnet vil vises i tavlen.
                </SubParagraph>
                <SubParagraph>
                    Det originale navnet til stoppestedet:{' '}
                    {tile.name.split(',')[0]}
                </SubParagraph>
            </div>
            <ClientOnlyTextField
                label="Navn på stoppested"
                className="!w-full md:!w-1/2 lg:!w-1/4"
                name="displayName"
                value={displayName}
                maxLength={50}
                clearable={!!displayName}
                onClear={() => {
                    setDisplayName('')
                }}
                onChange={(e) => {
                    setDisplayName(e.target.value)

                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current)
                    }

                    debounceTimerRef.current = setTimeout(() => {
                        posthog.capture('stop_place_edit_interaction', {
                            location: trackingLocation,
                            board_id: board_id,
                            field: 'name',
                            action: 'changed',
                            column_value: 'none',
                        })
                    }, 500)
                }}
                {...getFormFeedbackForField('name', state)}
            />
        </div>
    )
}

export { SetStopPlaceName }
