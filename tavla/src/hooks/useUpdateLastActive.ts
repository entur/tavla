import { useCallback, useEffect } from 'react'
import { useSettings } from 'settings/SettingsProvider'

function useUpdateLastActive() {
    const [settings, setSettings] = useSettings()

    const updateLastActive = useCallback(() => {
        // Updates lastActive if previous value is more than 1 day ago
        if (Date.now() - settings.lastActive > 86400000) {
            setSettings({
                lastActive: Date.now(),
            })
        }
    }, [settings.lastActive, setSettings])

    useEffect(() => {
        updateLastActive()
        const intervalId = setInterval(updateLastActive, 3600000) // Runs every hour
        return () => {
            clearInterval(intervalId)
        }
    }, [updateLastActive])
}

export { useUpdateLastActive }
