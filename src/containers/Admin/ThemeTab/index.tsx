import React, { useState, useEffect } from 'react'
import { RadioGroup, Radio } from '@entur/form'
import { useSettingsContext } from '../../../settings'
import { ThemeType } from '../../../types'

const ThemeTab = (): JSX.Element => {
    const [radioValue, setRadioValue] = useState(null)
    const [settings, { setTheme }] = useSettingsContext()

    const markCorrectRadioBox = (): void => {
        switch (settings.theme) {
            case 'dark':
                setRadioValue('dark')
                return
            case 'light':
                setRadioValue('light')
                return
            case 'grey':
                setRadioValue('grey')
                return
            default:
                setRadioValue('default')
                return
        }
    }

    useEffect(() => {
        if (settings.theme) {
            markCorrectRadioBox()
        }
    })

    return (
        <div>
            <RadioGroup
                name="theme"
                value={radioValue}
                onChange={(e) => setRadioValue(e.target.value)}
            >
                <Radio value="default">Entur (standard)</Radio>
                <Radio value="dark">Dark theme</Radio>
                <Radio value="light">Light theme</Radio>
                <Radio value="grey">Grey theme</Radio>
            </RadioGroup>
        </div>
    )
}

export default ThemeTab
