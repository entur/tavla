import React, { useCallback, useState } from 'react'
import { useSettings } from '../../settings/SettingsProvider'
import { Tile } from '../Tile/Tile'
import classes from './OpeningHoursTile.module.scss'

const OpeningHoursTile: React.FC = () => {
    const [settings, setSettings] = useSettings()
    const [list, setList] = useState([])
    console.log(settings)

    return (
        <Tile className={classes.OpeningHoursTile}>
            <Tile>
                {settings.dayTimeList.map((element) => (
                    <p>
                        {element.day} : {element.openingHours}
                        {element.isClosed ? 'Stengt' : ''}
                    </p>
                ))}
            </Tile>
        </Tile>
    )
}

export { OpeningHoursTile }
