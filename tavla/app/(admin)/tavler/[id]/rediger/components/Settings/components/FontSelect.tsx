'use client'
import { BoardFontSizeDB } from 'types/db-types/boards'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function FontSelect({
    font = 'medium',
    onChange,
}: {
    font?: BoardFontSizeDB
    onChange: () => void
}) {
    return (
        <ChoiceChipGroupGeneral<BoardFontSizeDB>
            label="Tekststørrelse"
            options={[
                { value: 'small', label: 'Liten' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Stor' },
            ]}
            defaultValue={font}
            name="font"
            ariaLabel="Tekststørrelse"
            onChange={onChange}
        />
    )
}

export { FontSelect }
