import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from '../../../../settings/SettingsProvider'
import { EditTile } from '../EditTile/EditTile'
import { BikePanelSearch } from './BikeSearch/BikePanelSearch'
import { BikePanel } from './BikePanel/BikePanel'

const BikeTile: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hiddenModes: xor(settings.hiddenModes, ['bysykkel']),
        })
    }, [settings, setSettings])

    const addNewStation = useCallback(
        (stationId: string) => {
            if (settings.newStations.includes(stationId)) return
            setSettings({
                newStations: [...settings.newStations, stationId],
            })
        },
        [settings.newStations, setSettings],
    )

    return (
        <EditTile
            title="Bysykkel"
            onChange={handleChange}
            checked={!settings.hiddenModes.includes('bysykkel')}
        >
            <BikePanelSearch
                position={settings.coordinates}
                onSelected={addNewStation}
            />
            <BikePanel />
        </EditTile>
    )
}

export { BikeTile }
