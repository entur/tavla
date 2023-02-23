import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { EditTile } from '../EditTile/EditTile'
import { ScooterPanel } from './ScooterPanel/ScooterPanel'

const ScooterTile: React.FC = () => {
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
