import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { AdminTile } from 'components/AdminTile'
import { BikePanelSearch } from './components/BikeSearch/BikePanelSearch'
import { BikePanel } from './components/BikePanel/BikePanel'

function BikeTile() {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hiddenModes: xor(settings.hiddenModes, ['bysykkel']),
        })
    }, [settings, setSettings])

    return (
        <AdminTile
            title="Bysykkel"
            onChange={handleChange}
            checked={!settings.hiddenModes.includes('bysykkel')}
        >
            <BikePanelSearch />
            <BikePanel />
        </AdminTile>
    )
}

export { BikeTile }
