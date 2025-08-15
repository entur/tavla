'use client'
import { TTheme } from 'types/settings'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function ThemeSelect({
    theme = 'dark',
    onChange,
}: {
    theme?: TTheme
    onChange: () => void
}) {
    return (
        <ChoiceChipGroupGeneral<TTheme>
            label="Fargetema"
            options={[
                { value: 'light', label: 'Lys' },
                { value: 'dark', label: 'Mørk' },
            ]}
            defaultValue={theme}
            onChange={onChange}
            name="theme"
            ariaLabel="Fargetema"
        />
    )
}

export { ThemeSelect }
