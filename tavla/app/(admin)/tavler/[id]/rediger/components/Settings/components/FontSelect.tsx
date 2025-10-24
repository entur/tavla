'use client'
import { BoardFontSize } from 'types/db-types/boards'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function FontSelect({
    font = 'medium',
    onChange,
}: {
    font?: BoardFontSize
    onChange: () => void
}) {
    return (
        <ChoiceChipGroupGeneral<BoardFontSize>
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
