'use client'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'
import { TFontSize } from 'types/meta'

function FontSelect({
    font = 'medium',
    onChange,
}: {
    font?: TFontSize
    onChange?: (value: TFontSize) => void
}) {
    return (
        <ChoiceChipGroupGeneral<TFontSize>
            header="Tekststørrelse"
            options={[
                { value: 'small', label: 'Liten' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Stor' },
            ]}
            defaultValue={font}
            name="font"
            ariaLabel="Tekststørrelse"
            onChange={(value) => {
                if (Array.isArray(value)) return
                onChange?.(value)
            }}
        />
    )
}

export { FontSelect }
