import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { EditTile } from 'components/EditTile'
import { ScooterPanel } from './components/ScooterPanel'

function ScooterTile() {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hiddenModes: xor(settings.hiddenModes, ['sparkesykkel']),
        })
    }, [settings, setSettings])

    return (
        <EditTile
            title="Sparkesykkel"
            onChange={handleChange}
            checked={!settings.hiddenModes.includes('sparkesykkel')}
        >
            <ScooterPanel />
        </EditTile>
    )
}

export { ScooterTile }
