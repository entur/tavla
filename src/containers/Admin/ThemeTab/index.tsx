import React, { useState, useEffect } from 'react'
import { RadioGroup, Radio } from '@entur/form'
import { useSettingsContext } from '../../../settings'
import { ThemeType } from '../../../types'
import { useTheme } from '../../ThemeWrapper/DarkTheme'

const ThemeTab = (): JSX.Element => {
    const [radioValue, setRadioValue] = useState<ThemeType>(null)
    const [settings, { setTheme }] = useSettingsContext()
    const { themeContext, setThemeContext } = useTheme()

    useEffect(() => {
        if (settings && settings.theme && radioValue == null) {
            console.log(settings)
            setRadioValue(settings.theme)
        }
    }, [settings, radioValue, settings.theme])

    const switchTheme = (value: ThemeType): void => {
        setRadioValue(value)
        setTheme(value)
        setThemeContext(value)
    }

    return (
        <div>
            <RadioGroup
                name="theme"
                value={radioValue}
                onChange={(e): void => switchTheme(e.target.value as ThemeType)}
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
