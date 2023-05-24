import React from 'react'
import { Radio, RadioGroup } from '@entur/form'
import { TTheme } from 'types/settings'
import { useSettingsDispatch } from '../reducer'

const themes: Record<TTheme, string> = {
    default: 'Entur',
    dark: 'Mørk',
    light: 'Lyst',
}

function ThemeSettings({ theme = 'default' }: { theme?: TTheme }) {
    const dispatch = useSettingsDispatch()
    return (
        <RadioGroup
            name="theme-settings"
            label="Velg farger"
            onChange={(e) =>
                dispatch({
                    type: 'changeTheme',
                    theme: e.target.value as TTheme,
                })
            }
            value={theme}
        >
            {Object.entries(themes).map(([value, label]) => (
                <Radio key={value} value={value}>
                    {label}
                </Radio>
            ))}
        </RadioGroup>
    )
}

export { ThemeSettings }
