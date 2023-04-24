import React from 'react'
import { Theme } from 'src/types'

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
        <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
        >
            {Object.entries(themes).map(([key, value]) => (
                <option key={key} value={key}>
                    {value}
                </option>
            ))}
        </select>
    )
}

export { ThemeSettings }
