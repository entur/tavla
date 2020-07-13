import React, { useState, useEffect } from 'react'
import { RadioGroup, Radio } from '@entur/form'
import { useSettingsContext } from '../../../settings'
import { ThemeType } from '../../../types'
import { useTheme } from '../../ThemeWrapper/ThemeProvider'

import './styles.scss'

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
        <div className="theme-tab">
            <RadioGroup
                name="theme"
                value={radioValue}
                onChange={(e): void => switchTheme(e.target.value as ThemeType)}
            >
                <Radio
                    value="default"
                    className="theme_tab__color theme_tab__eds-paragraph"
                >
                    Entur (standard)
                </Radio>
                <Radio value="dark">Dark theme</Radio>
                <Radio value="light">Light theme</Radio>
                <Radio value="grey">Grey theme</Radio>
            </RadioGroup>
        </div>
    )
}

export default ThemeTab
