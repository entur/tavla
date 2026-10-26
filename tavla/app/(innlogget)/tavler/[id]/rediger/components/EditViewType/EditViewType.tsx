'use client'

import { FeedbackText } from '@entur/form'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState } from 'react'
import { ChoiceChipPicker } from '../ChoiceChipPicker'
import { saveViewType, type ViewTypeState } from './actions'
import type { ViewTypeValue } from './validation'

function EditViewType({
    bid,
    hasCombinedTiles,
    trackingLocation,
}: {
    bid: string
    hasCombinedTiles: boolean
    trackingLocation: EventProps<'board_settings_changed'>['location']
}) {
    const { capture } = usePosthogTracking()

    async function handleSave(_prevState: ViewTypeState, value: ViewTypeValue) {
        const result = await saveViewType(bid, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: trackingLocation,
                setting: 'view_type',
                value: value,
            })
        }

        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    function handleChange(value: ViewTypeValue) {
        startTransition(() => {
            action(value)
        })
    }

    return (
        <>
            <ChoiceChipPicker<ViewTypeValue>
                label="Visningstype"
                options={[
                    { value: 'separate', label: 'En liste per stoppested' },
                    {
                        value: 'combined',
                        label: 'Alle stoppesteder i en liste',
                    },
                ]}
                defaultValue={hasCombinedTiles ? 'combined' : 'separate'}
                name="viewType"
                ariaLabel="Visningstype"
                onChange={handleChange}
            />
            {error && <FeedbackText variant="negative">{error}</FeedbackText>}
        </>
    )
}

export { EditViewType }
