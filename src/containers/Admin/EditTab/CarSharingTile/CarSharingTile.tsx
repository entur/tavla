import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { EditTile } from '../EditTile/EditTile'
import { useSettings } from '../../../../settings/SettingsProvider'

const CarSharingTile = () => {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hiddenModes: xor(settings.hiddenModes, ['delebil']),
        })
    }, [settings, setSettings])

    return (
        <EditTile
            title="Delebil"
            onChange={handleChange}
            checked={!settings.hiddenModes.includes('delebil')}
        />
    )
}

export { CarSharingTile }
