import React, { FC, useState, useMemo, useEffect } from 'react'

import { Theme } from '../../types'
import { useSettingsContext } from '../../settings'

type ThemeContextType = {
    themeContext: Theme
    setThemeContext: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextType>({
    themeContext: undefined,
    setThemeContext: (): void => {
        return
    },
})

const ThemeProvider: FC = (props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [themeContext, setThemeContext] = useState<Theme>(undefined)

    useEffect(() => {
        if (settings?.theme) {
            setThemeContext(settings.theme)
        }
        setThemeContext(Theme.DEFAULT)
    }, [settings])

    useEffect(() => {
        if (settings) {
            // eslint-disable-next-line
            ['dark', 'light', 'grey', 'default'].forEach((theme) => {
                document.body.classList.remove(`${theme}-theme`)
            })

            document.body.classList.add(`${settings.theme}-theme`)
        }
    }, [settings])

    const contextValue = useMemo(
        (): ThemeContextType => ({ themeContext, setThemeContext }),
        [themeContext],
    )

    return <ThemeContext.Provider value={contextValue} {...props} />
}

export const useTheme = (): ThemeContextType => {
    return React.useContext(ThemeContext)
}

export default ThemeProvider
