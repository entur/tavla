import React, { FC, useState, useMemo, useEffect } from 'react'

import { ThemeType } from '../../types'
import { useSettingsContext } from '../../settings'

type ThemeContextType = {
    themeContext: ThemeType
    setThemeContext: (theme: ThemeType) => void
}

const ThemeContext = React.createContext<ThemeContextType>({
    themeContext: undefined,
    setThemeContext: () => {
        return
    },
})

const ThemeProvider: FC = (props) => {
    const [settings] = useSettingsContext()
    const [themeContext, setThemeContext] = useState<ThemeType>(undefined)

    useEffect(() => {
        if (settings && settings.theme && themeContext == undefined) {
            setThemeContext(settings.theme)
        }
    }, [settings, themeContext])

    const contextValue = useMemo(() => ({ themeContext, setThemeContext }), [
        themeContext,
    ])
    return (
        <div className={`${themeContext}-theme`}>
            <ThemeContext.Provider value={contextValue} {...props} />
        </div>
    )
}

export const useTheme = () => {
    return React.useContext(ThemeContext)
}

export default ThemeProvider
