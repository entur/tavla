import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { useState } from 'react'
import { TFontSize } from 'types/meta'

function FontChoiceChip({ font }: { font: TFontSize }) {
    const [fontSize, setFontSize] = useState<TFontSize>(font)

    return (
        <ChoiceChipGroup
            name="font"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as TFontSize)}
            aria-label="Tekststørrelse"
        >
            <ChoiceChip value="small" className="choiceChip">
                Liten
            </ChoiceChip>
            <ChoiceChip value="medium" className="choiceChip">
                Medium
            </ChoiceChip>
            <ChoiceChip value="large" className="choiceChip">
                Stor
            </ChoiceChip>
        </ChoiceChipGroup>
    )
}

export { FontChoiceChip }
