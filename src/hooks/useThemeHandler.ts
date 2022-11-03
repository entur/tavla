import { useEffect } from 'react'
import { useSettings } from '../settings/SettingsProvider'
import { Theme } from '../types'

function useThemeHandler() {
    const [settings] = useSettings()

    useEffect(() => {
        Object.values(Theme).forEach((theme) => {
            document.body.classList.remove(`${theme}-theme`)
        })

        document.body.classList.add(`${settings.theme}-theme`)
    }, [settings.theme])
}

export { useThemeHandler }
