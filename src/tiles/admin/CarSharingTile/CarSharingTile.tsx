import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { AdminTile } from 'components/AdminTile'

function CarSharingTile() {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hiddenModes: xor(settings.hiddenModes, ['delebil']),
        })
    }, [settings, setSettings])

    return (
        <AdminTile
            title="Delebil"
            onChange={handleChange}
            checked={!settings.hiddenModes.includes('delebil')}
        />
    )
}

export { CarSharingTile }
