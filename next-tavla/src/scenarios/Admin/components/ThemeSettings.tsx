import React from 'react'
import { Theme } from 'src/types'
import { Radio, RadioGroup } from '@entur/form'

const themes: Record<Theme, string> = {
    default: 'Entur',
    dark: 'Mørk',
    light: 'Lyst',
    grey: 'Grå',
}

function ThemeSettings({
    theme = 'default',
    setTheme,
}: {
    theme?: Theme
    setTheme: (theme: Theme) => void
}) {
    return (
        <RadioGroup
            name="theme-settings"
            label="Velg farger"
            onChange={(e) => setTheme(e.target.value as Theme)}
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
