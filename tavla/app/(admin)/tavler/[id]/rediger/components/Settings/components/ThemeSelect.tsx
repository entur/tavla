'use client'
import { TTheme } from 'types/settings'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function ThemeSelect({ theme = 'dark' }: { theme?: TTheme }) {
    return (
        <ChoiceChipGroupGeneral<TTheme>
            label="Fargetema"
            options={[
                { value: 'light', label: 'Lys' },
                { value: 'dark', label: 'Mørk' },
            ]}
            defaultValue={theme}
            name="theme"
            ariaLabel="Fargetema"
        />
    )
}

export { ThemeSelect }
