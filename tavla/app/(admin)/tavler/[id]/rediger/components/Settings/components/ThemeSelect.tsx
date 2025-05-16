'use client'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'
import { TTheme } from 'types/settings'

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
