'use client'
import { BoardTheme } from 'types/db-types/boards'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function ThemeSelect({
    theme = 'dark',
    onChange,
}: {
    theme?: BoardTheme
    onChange: () => void
}) {
    return (
        <ChoiceChipGroupGeneral<BoardTheme>
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
