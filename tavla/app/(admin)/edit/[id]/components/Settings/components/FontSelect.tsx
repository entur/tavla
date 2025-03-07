'use client'
import { Heading4 } from '@entur/typography'
import { TFontSize } from 'types/meta'
import { useState } from 'react'
import { ChoiceChipGroup, ChoiceChip } from '@entur/chip'

function FontSelect({ font = 'medium' }: { font?: TFontSize }) {
    const [fontSize, setFontSize] = useState<TFontSize>(font)

    return (
        <div>
            <Heading4 margin="bottom">Tekststørrelse </Heading4>
            <ChoiceChipGroup
                className="h-full"
                name="font"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as TFontSize)}
                aria-label="Tekststørrelse"
            >
                <ChoiceChip value="small">Liten</ChoiceChip>
                <ChoiceChip value="medium">Medium</ChoiceChip>
                <ChoiceChip value="large">Stor</ChoiceChip>
            </ChoiceChipGroup>
        </div>
    )
}

export { FontSelect }
