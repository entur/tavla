import React, { ChangeEvent } from 'react'

import { RadioGroup, Radio } from '@entur/form'

import { useSettingsContext } from '../../../../settings'

import './styles.scss'

const SizePicker = (): JSX.Element => {
    const [{ logoSize }, { setLogoSize }] = useSettingsContext()

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLogoSize(event.target.value)
    }

    return (
        <RadioGroup
            name="logo-size"
            label="Størrelse på logo"
            onChange={handleChange}
            value={logoSize}
            className="eds-label"
        >
            <Radio value="32px">32px</Radio>
            <Radio value="56px">56px</Radio>
        </RadioGroup>
    )
}

export default SizePicker
