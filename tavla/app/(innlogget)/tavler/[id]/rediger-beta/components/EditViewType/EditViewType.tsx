'use client'

import { FeedbackText } from '@entur/form'
import { ChoiceChipGroupGeneral } from 'app/_components/TableSettings/ChoiceChipGroupGeneral'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useRef } from 'react'
import { saveViewType, type ViewTypeState } from './actions'
import { type ViewTypeValue, viewTypeSchema } from './validation'

function EditViewType({
    bid,
    hasCombinedTiles,
}: {
    bid: string
    hasCombinedTiles: boolean
}) {
    const { capture } = usePosthogTracking()

    async function handleSave(_prevState: ViewTypeState, value: ViewTypeValue) {
        const result = await saveViewType(bid, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: 'edit_board_page',
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
            <ChoiceChipGroupGeneral<ViewTypeValue>
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
