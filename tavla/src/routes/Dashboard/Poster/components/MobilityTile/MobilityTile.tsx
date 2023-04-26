import React from 'react'
import classNames from 'classnames'
import { useSettings } from 'settings/SettingsProvider'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'
import classes from './MobilityTile.module.scss'

type MobilityTileProps = {
    icon: React.ReactNode
    numberOfVehicles: number
    header: string
    description: string
}

function MobilityTile({
    header,
    description,
    numberOfVehicles,
    icon,
}: MobilityTileProps) {
    const [settings] = useSettings()
    const vertical = settings.hiddenModes.includes('kollektiv')

    const mobilityTileClass = classNames(classes.MobilityTile, {
        [classes.MobilityTileList]: vertical,
    })

    return (
        <div className={mobilityTileClass}>
            <div className={classes.MobilityDescription}>
                <h2 className={classes.Heading}>{header}</h2>
                <h3 className={classes.Area}>{description}</h3>
            </div>
            <div className={classes.VehiclesBox}>
                {icon}
                <NumberDisplay numberOfVehicles={numberOfVehicles} />
            </div>
        </div>
    )
}

export { MobilityTile }
