'use client'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { Heading4 } from '@entur/typography'
import { useState } from 'react'

type ChoiceChipProps<T> = {
    label: string
    options: { value: T; label: string }[]
    defaultValue: T
    name: string
    ariaLabel: string
    onChange: () => void
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
        onChange()
    }

    return (
        <div className="flex flex-col gap-1">
            <Heading4 margin="bottom">{label}</Heading4>
            <ChoiceChipGroup
                className="mb-2 h-full"
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
