import { useEffect } from 'react'
import { useSettings } from 'settings/SettingsProvider'

const useUpdateLastActive = () => {
    const [settings, setSettings] = useSettings()

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Updates lastActive if previous value is more than 1 day ago
            if (Date.now() - settings.lastActive > 86400000) {
                setSettings({
                    lastActive: Date.now(),
                })
            }
        }, 3600000) // Runs every hour
        return () => {
            clearInterval(intervalId)
        }
    }, [settings.lastActive, setSettings])
}

export { useUpdateLastActive }
