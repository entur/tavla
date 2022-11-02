import { useEffect } from 'react'
import { useSettings } from '../settings/SettingsProvider'

function useHandleFontScaling() {
    const [settings] = useSettings()

    useEffect(() => {
        document.documentElement.style.fontSize = settings.fontScale * 16 + 'px'
        return () => {
            document.documentElement.style.fontSize = '16px'
        }
    }, [settings.fontScale])
}

export { useHandleFontScaling }
