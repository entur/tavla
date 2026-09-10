'use client'

import { FeedbackText } from '@entur/form'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState } from 'react'
import { ChoiceChipPicker } from '../ChoiceChipPicker'
import { type LanguageState, saveLanguage } from './actions'
import type { LanguageValue } from './validation'

function EditLanguage({
    bid,
    language,
}: {
    bid: string
    language: LanguageValue
}) {
    const { capture } = usePosthogTracking()

    async function handleSave(_prevState: LanguageState, value: LanguageValue) {
        const result = await saveLanguage(bid, value)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                location: 'edit_board_page',
                setting: 'language',
                value: value,
            })
        }

        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    function handleChange(value: LanguageValue) {
        startTransition(() => {
            action(value)
        })
    }

    return (
        <>
            <ChoiceChipPicker<LanguageValue>
                label="Velg språk"
                options={[
                    { value: 'nb', label: 'Norsk' },
                    { value: 'en', label: 'Engelsk' },
                ]}
                defaultValue={language}
                name="language"
                ariaLabel="Språk"
                onChange={handleChange}
            />
            {error && <FeedbackText variant="negative">{error}</FeedbackText>}
        </>
    )
}

export { EditLanguage }
