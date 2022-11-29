import React from 'react'
import { Heading3 } from '@entur/typography'
import { BicycleIcon } from '@entur/icons'
import { getTranslation } from '../../utils/utils'
import { WalkTrip } from '../WalkTrip/WalkTrip'
import { RentalStation } from '../../logic/use-rental-stations/types'
import classes from './BikeTileRow.module.scss'

interface BikeTileRowProps {
    station: RentalStation
    iconColor: string
}

function BikeTileRow({ station, iconColor }: BikeTileRowProps): JSX.Element {
    return (
        <div className={classes.BikeTileRow}>
            <div className={classes.Icon}>
                <BicycleIcon color={iconColor} />
            </div>
            <div className={classes.Texts}>
                <Heading3 className={classes.Label}>
                    {getTranslation(station.name) || ''}
                </Heading3>
                <WalkTrip
                    className={classes.WalkingTime}
                    coordinates={{
                        latitude: station.lat,
                        longitude: station.lon,
                    }}
                />
                <div className={classes.Sublabels}>
                    <div>
                        {station.numBikesAvailable === 1
                            ? '1 sykkel'
                            : `${station.numBikesAvailable} sykler`}
                    </div>
                    <div>
                        {station.numDocksAvailable === 1
                            ? '1 lås'
                            : `${station.numDocksAvailable} låser`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export { BikeTileRow }
