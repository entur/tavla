'use client'

import { FeedbackText } from '@entur/form'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState } from 'react'
import { ChoiceChipPicker } from '../ChoiceChipPicker'
import { type FontSizeState, saveFontSize } from './actions'
import type { FontSizeValue } from './validation'

function EditFontSize({
    bid,
    fontSize,
    trackingLocation,
}: {
    bid: string
    fontSize: FontSizeValue
    trackingLocation: EventProps<'board_settings_changed'>['location']
}) {
    const { capture } = usePosthogTracking()

    async function handleSave(_prevState: FontSizeState, value: FontSizeValue) {
        const result = await saveFontSize(bid, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: trackingLocation,
                setting: 'font',
                value: value,
            })
        }

        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    function handleChange(value: FontSizeValue) {
        startTransition(() => {
            action(value)
        })
    }

    return (
        <>
            <ChoiceChipPicker<FontSizeValue>
                label="Tekststørrelse"
                options={[
                    { value: 'small', label: 'Liten' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Stor' },
                ]}
                defaultValue={fontSize}
                name="font"
                ariaLabel="Tekststørrelse"
                onChange={handleChange}
            />
            {error && <FeedbackText variant="negative">{error}</FeedbackText>}
        </>
    )
}

export { EditFontSize }
