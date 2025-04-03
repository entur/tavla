'use client'
import { TTheme } from 'types/settings'
import { useState } from 'react'
import { Heading4 } from '@entur/typography'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'

function ThemeSelect({ theme = 'dark' }: { theme?: TTheme }) {
    const [selectedTheme, setSelectedTheme] = useState<TTheme>(theme)

    return (
        <div className="flex flex-col">
            <Heading4 margin="bottom">Fargetema</Heading4>
            <ChoiceChipGroup
                className="mb-2"
                name="theme"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as TTheme)}
                aria-label="Tekststørrelse"
            >
                <ChoiceChip value="light">Lys</ChoiceChip>
                <ChoiceChip value="dark">Mørk</ChoiceChip>
            </ChoiceChipGroup>
        </div>
    )
}

export { ThemeSelect }
