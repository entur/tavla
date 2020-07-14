import React, { useState, useEffect } from 'react'
import { RadioGroup, Radio } from '@entur/form'

import { useSettingsContext } from '../../../settings'
import { ThemeType } from '../../../types'
import { useTheme } from '../../ThemeWrapper/ThemeProvider'
import RadioCard from '../../../components/RadioCard'
import CompactSVG from '../../../assets/previews/Kompakt.svg'

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
            <RadioCard
                title="Entur (standard)"
                cardValue="default"
                preview={CompactSVG}
                selected={radioValue === 'default'}
                callback={(val): void => switchTheme(val as ThemeType)}
            />
            <RadioCard
                title="Dark theme"
                cardValue="dark"
                preview={CompactSVG}
                selected={radioValue === 'dark'}
                callback={(val): void => switchTheme(val as ThemeType)}
            />
            <RadioCard
                title="Light theme"
                cardValue="light"
                preview={CompactSVG}
                selected={radioValue === 'light'}
                callback={(val): void => switchTheme(val as ThemeType)}
            />
            <RadioCard
                title="Grey theme"
                cardValue="grey"
                preview={CompactSVG}
                selected={radioValue === 'grey'}
                callback={(val): void => switchTheme(val as ThemeType)}
            />
        </div>
    )
}

export default ThemeTab
