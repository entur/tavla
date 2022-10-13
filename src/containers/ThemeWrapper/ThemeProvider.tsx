import React, { FC, useMemo, useEffect } from 'react'
import { Theme } from '../../types'
import { useSettings } from '../../settings/SettingsProvider'

type ThemeContextType = {
    themeContext: Theme
}

const ThemeContext = React.createContext<ThemeContextType>({
    themeContext: Theme.DEFAULT,
})

interface ThemeProviderProps {
    children: React.ReactNode
}

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
    const [settings] = useSettings()

    const themeContext = settings?.theme || Theme.DEFAULT

    useEffect(() => {
        const themes = [Theme.DARK, Theme.LIGHT, Theme.GREY, Theme.DEFAULT]
        themes.forEach((theme) => {
            document.body.classList.remove(`${theme}-theme`)
        })

        document.body.classList.add(`${themeContext}-theme`)
    }, [settings, themeContext])

    const contextValue = useMemo(
        (): ThemeContextType => ({ themeContext }),
        [themeContext],
    )

    return <ThemeContext.Provider value={contextValue} {...props} />
}

export { ThemeProvider }
