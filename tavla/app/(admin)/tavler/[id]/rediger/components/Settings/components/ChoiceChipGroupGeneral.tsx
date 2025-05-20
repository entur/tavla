'use client'
import { useState } from 'react'
import { Heading4 } from '@entur/typography'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'

type ChoiceChipProps<T> = {
    label: string
    options: { value: T; label: string }[]
    defaultValue: T
    name: string
    ariaLabel: string
    onChange?: (value: T) => void
}

function ChoiceChipGroupGeneral<T extends string>({
    label,
    options,
    defaultValue,
    name,
    ariaLabel,
    onChange,
}: ChoiceChipProps<T>) {
    const [selectedValue, setSelectedValue] = useState<T>(defaultValue)

    const handleChange = (value: T) => {
        setSelectedValue(value)
        if (onChange) {
            onChange(value)
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <Heading4 margin="bottom">{label}</Heading4>
            <ChoiceChipGroup
                className="h-full mb-2"
                name={name}
                value={selectedValue}
                onChange={(e) => handleChange(e.target.value as T)}
                aria-label={ariaLabel}
            >
                {options.map((option) => (
                    <ChoiceChip key={option.value} value={option.value}>
                        {option.label}
                    </ChoiceChip>
                ))}
            </ChoiceChipGroup>
        </div>
    )
}

export { ChoiceChipGroupGeneral }
