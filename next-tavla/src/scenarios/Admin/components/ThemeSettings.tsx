import React from 'react'
import { Radio, RadioGroup } from '@entur/form'
import { TTheme } from 'types/settings'

const themes: Record<TTheme, string> = {
    default: 'Entur',
    dark: 'Mørk',
    light: 'Lyst',
}

function ThemeSettings({
    theme = 'default',
    setTheme,
}: {
    theme?: TTheme
    setTheme: (theme: TTheme) => void
}) {
    return (
        <RadioGroup
            name="theme-settings"
            label="Velg farger"
            onChange={(e) => setTheme(e.target.value as TTheme)}
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
