'use client'
import { TTheme } from 'types/settings'
import { useState } from 'react'
import { Heading4 } from '@entur/typography'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'

function ThemeSelect({ theme = 'dark' }: { theme?: TTheme }) {
    const [selectedTheme, setSelectedTheme] = useState<TTheme>(theme)

    return (
        <div className="flex flex-col gap-1">
            <Heading4 margin="bottom">Fargetema</Heading4>
            <ChoiceChipGroup
                className="h-full mb-2"
                name="theme"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as TTheme)}
                aria-label="Fargetema"
            >
                <ChoiceChip value="light">Lys</ChoiceChip>
                <ChoiceChip value="dark">Mørk</ChoiceChip>
            </ChoiceChipGroup>
        </div>
    )
}

export { ThemeSelect }
