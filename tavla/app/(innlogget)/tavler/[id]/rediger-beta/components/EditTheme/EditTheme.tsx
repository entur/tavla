'use client'

import { FeedbackText } from '@entur/form'
import { ChoiceChipGroupGeneral } from 'app/_components/TableSettings/ChoiceChipGroupGeneral'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState } from 'react'
import { saveTheme, type ThemeState } from './actions'
import type { ThemeValue } from './validation'

function EditTheme({ bid, theme }: { bid: string; theme: ThemeValue }) {
    const { capture } = usePosthogTracking()

    async function handleSave(_prevState: ThemeState, value: ThemeValue) {
        const result = await saveTheme(bid, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: 'edit_board_page',
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
            <ChoiceChipGroupGeneral<ThemeValue>
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
