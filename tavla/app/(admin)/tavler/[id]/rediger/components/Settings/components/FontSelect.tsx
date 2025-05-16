'use client'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'
import { TFontSize } from 'types/meta'

function FontSelect({ font = 'medium' }: { font?: TFontSize }) {
    return (
        <ChoiceChipGroupGeneral<TFontSize>
            label="Tekststørrelse"
            options={[
                { value: 'small', label: 'Liten' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Stor' },
            ]}
            defaultValue={font}
            name="font"
            ariaLabel="Tekststørrelse"
        />
    )
}

export { FontSelect }
