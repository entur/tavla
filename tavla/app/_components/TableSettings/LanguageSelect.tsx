'use client'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { BoardLanguage } from 'types/db-types/boards'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function LanguageSelect({
    language = 'nb',
    onChange,
}: {
    language?: BoardLanguage
    onChange: () => void
}) {
    const { capture } = usePosthogTracking()

    return (
        <ChoiceChipGroupGeneral<BoardLanguage>
            label="Velg språk"
            options={[
                { value: 'nb', label: 'Norsk' },
                { value: 'en', label: 'Engelsk' },
            ]}
            defaultValue={language}
            onChange={(value) => {
                capture('board_settings_changed', {
                    setting: 'language',
                    value: value as BoardLanguage,
                })

                onChange()
            }}
            name="language"
            ariaLabel="Språk"
        />
    )
}

export { LanguageSelect }
