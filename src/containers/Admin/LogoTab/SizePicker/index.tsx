import React, { ChangeEvent } from 'react'

import { RadioGroup, Radio } from '@entur/form'

const SizePicker = ({ value, onChange }: Props): JSX.Element => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        onChange(event.target.value)
    }

    return (
        <RadioGroup
            name="logo-size"
            label="Størrelse på logo"
            onChange={handleChange}
            value={value}
        >
            <Radio value="32px">32px</Radio>
            <Radio value="56px">56px</Radio>
        </RadioGroup>
    )
}

interface Props {
    onChange: (size: string) => void
    value: string
}

export default SizePicker
