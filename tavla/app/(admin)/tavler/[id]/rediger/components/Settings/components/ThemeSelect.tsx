'use client'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { BoardTheme } from 'src/types/db-types/boards'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function ThemeSelect({
    theme = 'dark',
    onChange,
}: {
    theme?: BoardTheme
    onChange: () => void
}) {
    const posthog = usePosthogTracking()

    return (
        <ChoiceChipGroupGeneral<BoardTheme>
            label="Fargetema"
            options={[
                { value: 'light', label: 'Lys' },
                { value: 'dark', label: 'Mørk' },
            ]}
            defaultValue={theme}
            onChange={(value) => {
                posthog.capture('board_settings_changed', {
                    setting: 'theme',
                    value: value as 'light' | 'dark',
                })

                onChange()
            }}
            name="theme"
            ariaLabel="Fargetema"
        />
    )
}

export { ThemeSelect }
