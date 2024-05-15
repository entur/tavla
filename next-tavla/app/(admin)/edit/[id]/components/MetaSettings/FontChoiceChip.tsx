import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { useState } from 'react'
import { TFontSize } from 'types/meta'

function FontChoiceChip({ font }: { font: TFontSize }) {
    const [fontSize, setFontSize] = useState<TFontSize>(font)

    return (
        <ChoiceChipGroup
            className="h-full place-content-center mt-2 "
            name="font"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as TFontSize)}
            aria-label="Tekststørrelse"
        >
            <ChoiceChip value="small">Liten</ChoiceChip>
            <ChoiceChip value="medium">Medium</ChoiceChip>
            <ChoiceChip value="large">Stor</ChoiceChip>
        </ChoiceChipGroup>
    )
}

export { FontChoiceChip }
