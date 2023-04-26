import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { AdminTile } from 'components/AdminTile'
import { ScooterPanel } from './components/ScooterPanel'

function ScooterTile() {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hiddenModes: xor(settings.hiddenModes, ['sparkesykkel']),
        })
    }, [settings, setSettings])

    return (
        <AdminTile
            title="Sparkesykkel"
            onChange={handleChange}
            checked={!settings.hiddenModes.includes('sparkesykkel')}
        >
            <ScooterPanel />
        </AdminTile>
    )
}

export { ScooterTile }
