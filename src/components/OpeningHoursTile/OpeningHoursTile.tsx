import React from 'react'
import { useSettings } from '../../settings/SettingsProvider'
import { Tile } from '../Tile/Tile'
import { TileHeader } from '../TileHeader/TileHeader'
import classes from './OpeningHoursTile.module.scss'

const OpeningHoursTile: React.FC = () => {
    const [settings] = useSettings()

    return (
        <Tile className={classes.OpeningHoursTile}>
            <TileHeader title="Åpningstider" />
            {settings.openingHours.map((element, i) => (
                <p key={i}>
                    <span className={classes.Day}>{element.day} : </span>
                    {element.isClosed ? 'Stengt' : element.openingHours}
                </p>
            ))}
        </Tile>
    )
}

export { OpeningHoursTile }
