import { TTheme } from 'types/settings'
import { useState } from 'react'
import { Heading4 } from '@entur/typography'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'

function ThemeSelect({ theme }: { theme: TTheme }) {
    const [newTheme, setNewTheme] = useState<TTheme>(theme)
    return (
        <div className="box flex flex-col gap-2">
            <Heading4 margin="bottom">Fargetema</Heading4>
            <ChoiceChipGroup
                name="theme"
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value as TTheme)}
                aria-label="Fargetekst"
            >
                <ChoiceChip value="light" className="choiceChip">
                    Lys
                </ChoiceChip>
                <ChoiceChip value="dark" className="choiceChip">
                    Mørk
                </ChoiceChip>
            </ChoiceChipGroup>
        </div>
    )
}

export { ThemeSelect }
