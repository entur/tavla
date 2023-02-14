import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { DashboardTypes } from 'src/types'
import { Heading3 } from '@entur/typography'
import { EditTile } from '../EditTile/EditTile'
import { ToggleDetailsPanel } from './ToggleDetailsPanel/ToggleDetailsPanel'
import { StopPlaceSearch } from './StopPlaceSearch/StopPlaceSearch'
import { StopPlacePanel } from './StopPlacePanel/StopPlacePanel'
import classes from './StopPlaceTile.module.scss'

const StopPlaceTile: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hiddenModes: xor(settings.hiddenModes, ['kollektiv']),
        })
    }, [settings, setSettings])

    return (
        <EditTile
            title="Kollektiv"
            onChange={handleChange}
            checked={!settings.hiddenModes.includes('kollektiv')}
        >
            {settings.dashboard !== DashboardTypes.SimpleBusStop && (
                <StopPlaceSearch />
            )}
            <StopPlacePanel />
            <div>
                <Heading3 className={classes.DetailsInView}>
                    Detaljer i visningen
                </Heading3>
            </div>
            <ToggleDetailsPanel />
        </EditTile>
    )
}

export { StopPlaceTile }
