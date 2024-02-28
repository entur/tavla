import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { ChangeEvent } from 'react'
import { TFontSize } from 'types/meta'

function FontChoiceChip({
    onChange,
    fontSize,
}: {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    fontSize: TFontSize
}) {
    return (
        <ChoiceChipGroup
            className="flexRow"
            name="font"
            value={fontSize}
            onChange={onChange}
        >
            <ChoiceChip value="small">Liten</ChoiceChip>
            <ChoiceChip value="medium">Medium</ChoiceChip>
            <ChoiceChip value="large">Stor</ChoiceChip>
        </ChoiceChipGroup>
    )
}

export { FontChoiceChip }
