'use client'

import { FeedbackText } from '@entur/form'
import { ChoiceChipGroupGeneral } from 'app/_components/TableSettings/ChoiceChipGroupGeneral'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState } from 'react'
import { ChoiceChipPicker } from '../ChoiceChipPicker'
import { type FontSizeState, saveFontSize } from './actions'
import type { FontSizeValue } from './validation'

function EditFontSize({
    bid,
    fontSize,
}: {
    bid: string
    fontSize: FontSizeValue
}) {
    const { capture } = usePosthogTracking()

    async function handleSave(_prevState: FontSizeState, value: FontSizeValue) {
        const result = await saveFontSize(bid, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: 'edit_board_page',
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
