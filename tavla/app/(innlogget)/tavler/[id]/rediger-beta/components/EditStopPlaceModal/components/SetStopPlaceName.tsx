import { Heading4, SubParagraph } from '@entur/typography'
import ClientOnlyTextField from 'app/_components/NoSSR/TextField'
import {
    getFormFeedbackForField,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import type { EventProps } from 'app/posthog/events'
import {
    TRACKING_DEBOUNCE_TIME,
    usePosthogTracking,
} from 'app/posthog/usePosthogTracking'
import { useRef, useState } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import { TileContext } from '../context'

function SetStopPlaceName({
    state,
    trackingLocation,
    onFieldChanged,
}: {
    state?: TFormFeedback
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const { capture } = usePosthogTracking()
    const tile = useNonNullContext(TileContext)
    const [displayName, setDisplayName] = useState(tile.displayName ?? '')
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const title = tile.name.split(',')[0]

    return (
        <div className="flex flex-col gap-2">
            <Heading4 margin="bottom" as="h2">
                Vil du kalle stoppestedet for noe annet enn "{title}"?
            </Heading4>
            <ClientOnlyTextField
                label={'Navn på stoppested'}
                className="!w-full md:!w-1/2 lg:!w-1/2"
                name="displayName"
                value={displayName}
                maxLength={50}
                clearable={!!displayName}
                onClear={() => {
                    setDisplayName('')
                }}
                onChange={(e) => {
                    setDisplayName(e.target.value)
                    onFieldChanged('name')

                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current)
                    }

                    debounceTimerRef.current = setTimeout(() => {
                        capture('stop_place_edit_interaction', {
                            location: trackingLocation,
                            field: 'name',
                            action: 'changed',
                            column_value: 'none',
                        })
                    }, TRACKING_DEBOUNCE_TIME)
                }}
                {...getFormFeedbackForField('name', state)}
            />
        </div>
    )
}

export { SetStopPlaceName }
