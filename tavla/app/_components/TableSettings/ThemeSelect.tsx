'use client'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { BoardTheme } from 'types/db-types/boards'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

export function ThemeSelect({
    theme = 'dark',
    onChange,
}: {
    theme?: BoardTheme
    onChange: () => void
}) {
    const { capture } = usePosthogTracking()

    return (
        <ChoiceChipGroupGeneral<BoardTheme>
            label="Fargetema"
            options={[
                { value: 'light', label: 'Lys' },
                { value: 'dark', label: 'Mørk' },
            ]}
            defaultValue={theme}
            onChange={(value) => {
                capture('board_settings_changed', {
                    setting: 'theme',
                    value,
                })

                onChange()
            }}
            name="theme"
            ariaLabel="Fargetema"
        />
    )
}
