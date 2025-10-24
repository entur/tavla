'use client'
import { BoardThemeDB } from 'types/db-types/boards'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function ThemeSelect({
    theme = 'dark',
    onChange,
}: {
    theme?: BoardThemeDB
    onChange: () => void
}) {
    return (
        <ChoiceChipGroupGeneral<BoardThemeDB>
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
