import React, { ChangeEvent } from 'react'
import { RadioGroup, Radio } from '@entur/form'
import { useSettingsContext } from '../../../../settings'
import './SizePicker.scss'

const SizePicker = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()

    const { logoSize = '32px' } = settings || {}

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setSettings({
            logoSize: event.target.value,
        })
    }

    return (
        <RadioGroup
            name="logo-size"
            label="Størrelse på logo"
            onChange={handleChange}
            value={logoSize}
            className="eds-label"
        >
            <Radio value="32px">
                <span className="eds-label__eds-paragraph">32px</span>
            </Radio>
            <Radio value="56px">
                <span className="eds-label__eds-paragraph">56px</span>
            </Radio>
        </RadioGroup>
    )
}

export { SizePicker }
