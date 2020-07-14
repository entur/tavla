import React, { useState, useEffect } from 'react'
import { RadioGroup, Radio } from '@entur/form'
import { Heading2 } from '@entur/typography'

import { useSettingsContext } from '../../../settings'
import { ThemeType } from '../../../types'
import { useTheme } from '../../ThemeWrapper/ThemeProvider'
import RadioCard from '../../../components/RadioCard'
import Grey from '../../../assets/previews/Grey-theme.svg'
import Dark from '../../../assets/previews/Dark-theme.svg'
import Light from '../../../assets/previews/Light-theme.svg'
import Entur from '../../../assets/previews/Entur-theme.svg'

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
        <div>
            <Heading2 className="heading">Velg farger</Heading2>
            <div className="theme-tab">
                <RadioCard
                    title="Entur (standard)"
                    cardValue="default"
                    preview={Entur}
                    selected={radioValue === 'default'}
                    callback={(val): void => switchTheme(val as ThemeType)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Dark theme"
                    cardValue="dark"
                    preview={Dark}
                    selected={radioValue === 'dark'}
                    callback={(val): void => switchTheme(val as ThemeType)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Light theme"
                    cardValue="light"
                    preview={Light}
                    selected={radioValue === 'light'}
                    callback={(val): void => switchTheme(val as ThemeType)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Grey theme"
                    cardValue="grey"
                    preview={Grey}
                    selected={radioValue === 'grey'}
                    callback={(val): void => switchTheme(val as ThemeType)}
                    className="theme-tab__theme-card"
                />
            </div>
        </div>
    )
}

export default ThemeTab
