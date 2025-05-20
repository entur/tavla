'use client'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'
import { TTheme } from 'types/settings'

function ThemeSelect({
    theme = 'dark',
    onChange,
}: {
    theme?: TTheme
    onChange?: (value: TTheme) => void
}) {
    return (
        <ChoiceChipGroupGeneral<TTheme>
            header="Fargetema"
            options={[
                { value: 'light', label: 'Lys' },
                { value: 'dark', label: 'Mørk' },
            ]}
            defaultValue={theme}
            name="theme"
            ariaLabel="Fargetema"
            onChange={(value) => {
                if (Array.isArray(value)) {
                } else {
                    onChange?.(value)
                }
            }}
        />
    )
}

export { ThemeSelect }
