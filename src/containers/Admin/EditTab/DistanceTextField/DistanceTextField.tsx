import React, { SyntheticEvent, useState } from 'react'
import { TextField } from '@entur/form/'
import type { VariantType } from '@entur/form/'

const DistanceTextField = ({
    onChange,
    label,
    max,
    min,
    defaultValue,
    disabled,
}: {
    onChange: (value: number) => void
    label: string
    max: number
    min: number
    defaultValue?: number
    disabled?: boolean
}) => {
    const [variant, setVariant] = useState<VariantType>('info')
    const [feedback, setFeedback] = useState<string | undefined>()

    const handleInput = (e: SyntheticEvent<HTMLInputElement>) => {
        if (e.currentTarget.validity.valid) {
            setVariant('info')
            setFeedback(undefined)
            onChange(Number(e.currentTarget.value))
        } else {
            setVariant('error')
            setFeedback(`Avstand må være et tall mellom ${min} og ${max}`)
            onChange(0)
        }
    }

    return (
        <TextField
            defaultValue={defaultValue}
            disabled={disabled}
            className="distance-text-field"
            type="number"
            label={label}
            variant={variant}
            max={max}
            min={min}
            feedback={feedback}
            onInput={handleInput}
        />
    )
}

export { DistanceTextField }
