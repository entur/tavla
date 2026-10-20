'use client'

import { FeedbackText } from '@entur/form'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState } from 'react'
import { ChoiceChipPicker } from '../ChoiceChipPicker'
import { saveTheme, type ThemeState } from './actions'
import type { ThemeValue } from './validation'

function EditTheme({
    bid,
    theme,
    trackingLocation,
}: {
    bid: string
    theme: ThemeValue
    trackingLocation: EventProps<'board_settings_changed'>['location']
}) {
    const { capture } = usePosthogTracking()

    async function handleSave(_prevState: ThemeState, value: ThemeValue) {
        const result = await saveTheme(bid, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: trackingLocation,
                setting: 'theme',
                value: value,
            })
        }

        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    function handleChange(value: ThemeValue) {
        startTransition(() => {
            action(value)
        })
    }

    return (
        <>
            <ChoiceChipPicker<ThemeValue>
                label="Fargetema"
                options={[
                    { value: 'dark', label: 'Mørkt' },
                    { value: 'light', label: 'Lyst' },
                ]}
                defaultValue={theme}
                name="theme"
                ariaLabel="Fargetema"
                onChange={handleChange}
            />
            {error && <FeedbackText variant="negative">{error}</FeedbackText>}
        </>
    )
}

export { EditTheme }
