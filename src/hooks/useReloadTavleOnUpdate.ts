import { useEffect, useState } from 'react'
import { useSettings } from 'settings/SettingsProvider'

const useReloadTavleOnUpdate = () => {
    const [settings] = useSettings()
    const [tavleOpenedAt] = useState(new Date().getTime())

    useEffect(() => {
        if (tavleOpenedAt < settings.pageRefreshedAt) {
            window.location.reload()
        }
    }, [settings, tavleOpenedAt])
}

export { useReloadTavleOnUpdate }
