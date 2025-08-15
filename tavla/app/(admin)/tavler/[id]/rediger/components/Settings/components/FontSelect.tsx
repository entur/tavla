'use client'
import { TFontSize } from 'types/meta'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'

function FontSelect({
    font = 'medium',
    onChange,
}: {
    font?: TFontSize
    onChange: () => void
}) {
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
            onChange={onChange}
        />
    )
}

export { FontSelect }
