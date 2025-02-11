'use client'
import { TBoard, TTheme } from 'types/settings'
import { useState } from 'react'
import { Heading4 } from '@entur/typography'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'

function ThemeSelect({ board }: { board: TBoard }) {
    const [selectedTheme, setSelectedTheme] = useState<TTheme>(
        board?.theme ?? 'dark',
    )

    return (
        <div className="flex flex-col gap-2">
            <Heading4 margin="bottom">Fargetema</Heading4>
            <ChoiceChipGroup
                className="h-full"
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
