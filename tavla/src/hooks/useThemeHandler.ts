import { useEffect } from 'react'
import { useSettings } from 'settings/SettingsProvider'

function useThemeHandler() {
    const [settings] = useSettings()

    useEffect(() => {
        document.body.classList.add(`${settings.theme}-theme`)

        return () => {
            document.body.classList.remove(`${settings.theme}-theme`)
        }
    }, [settings.theme])
}

export { useThemeHandler }
