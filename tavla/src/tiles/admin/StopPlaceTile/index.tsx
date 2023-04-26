import React, { useCallback } from 'react'
import { xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { AdminTile } from 'components/AdminTile'
import { Heading3 } from '@entur/typography'
import { ToggleDetailsPanel } from './components/ToggleDetailsPanel'
import { StopPlaceSearch } from './components/StopPlaceSearch'
import { StopPlacePanel } from './components/StopPlacePanel'
import classes from './StopPlaceTile.module.scss'

function StopPlaceTile() {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hiddenModes: xor(settings.hiddenModes, ['kollektiv']),
        })
    }, [settings, setSettings])

    return (
        <AdminTile
            title="Kollektiv"
            onChange={handleChange}
            checked={!settings.hiddenModes.includes('kollektiv')}
        >
            <StopPlaceSearch />
            <StopPlacePanel />
            <div>
                <Heading3 className={classes.DetailsInView}>
                    Detaljer i visningen
                </Heading3>
            </div>
            <ToggleDetailsPanel />
        </AdminTile>
    )
}

export { StopPlaceTile }
