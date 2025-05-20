'use client'
import { useState, ReactNode } from 'react'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { Heading3, SubParagraph } from '@entur/typography'

type ChoiceChipProps<T> = {
    label?: string
    options: { value: T; label: string }[]
    defaultValue: T | T[]
    name: string
    ariaLabel: string
    multiSelect?: boolean
    onChange?: (value: T | T[]) => void
    header?: string | ReactNode
    description?: string | ReactNode
}

export function ChoiceChipGroupGeneral<T extends string>({
    options,
    defaultValue,
    name,
    ariaLabel,
    multiSelect = false,
    onChange,
    header,
    description,
}: ChoiceChipProps<T>) {
    const [selectedValue, setSelectedValue] = useState<T | T[]>(
        multiSelect ? (defaultValue as T[]) : (defaultValue as T),
    )

    const handleChange = (value: T) => {
        if (multiSelect) {
            const newValue = (selectedValue as T[]).includes(value)
                ? (selectedValue as T[]).filter((v) => v !== value)
                : [...(selectedValue as T[]), value]
            setSelectedValue(newValue)
            onChange?.(newValue)
        } else {
            setSelectedValue(value)
            onChange?.(value)
        }
    }

    return (
        <div className="flex flex-col gap-1">
            {header && <Heading3>{header}</Heading3>}
            {description && (
                <SubParagraph className="mb-2">{description}</SubParagraph>
            )}{' '}
            <ChoiceChipGroup
                className="h-full mb-2"
                name={name}
                value={!multiSelect ? (selectedValue as T) : null}
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
