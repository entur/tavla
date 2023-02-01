import React from 'react'
import { useSettings } from '../../settings/SettingsProvider'
import { Tile } from '../Tile/Tile'
import { TileHeader } from '../TileHeader/TileHeader'
import classes from './OpeningHoursTile.module.scss'

const OpeningHoursTile: React.FC = () => {
    const [settings] = useSettings()
    const location: string = settings.openingHoursLocation
    const title: string = 'Åpningstider for ' + location

    console.log(settings.openingHoursList)

    return (
        <Tile className={classes.OpeningHoursTile}>
            <TileHeader title={title} />
            {settings.openingHoursList.map((element, i) => (
                <p key={i}>
                    <span className={classes.Day}>{element.day} : </span>
                    {element.isClosed ? 'Stengt' : element.opens}
                </p>
            ))}
        </Tile>
    )
}

export { OpeningHoursTile }
