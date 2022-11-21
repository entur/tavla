import React from 'react'
import { Heading3 } from '@entur/typography'
import { BicycleIcon } from '@entur/icons'
import { StationFragment } from '../../../graphql-generated/mobility-v2'
import { getTranslation } from '../../utils/utils'
import { useWalkTrip } from '../../logic/use-walk-trip/useWalkTrip'
import { WalkTrip } from '../../logic/use-walk-trip/types'
import classes from './BikeTileRow.module.scss'

function formatWalkTrip(walkTrip: WalkTrip) {
    if (walkTrip.duration / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkTrip.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkTrip.duration / 60)} min å gå (${Math.ceil(
            walkTrip.walkDistance,
        )} m)`
    }
}

interface BikeTileRowProps {
    station: StationFragment
    iconColor: string
}

function BikeTileRow({ station, iconColor }: BikeTileRowProps): JSX.Element {
    const { walkTrip } = useWalkTrip({
        latitude: station.lat,
        longitude: station.lon,
    })

    return (
        <div className={classes.BikeTileRow}>
            <div className={classes.Icon}>
                <BicycleIcon color={iconColor} />
            </div>
            <div className={classes.Texts}>
                <Heading3 className={classes.Label}>
                    {getTranslation(station.name) || ''}
                </Heading3>
                {walkTrip && (
                    <div className={classes.WalkingTime}>
                        {formatWalkTrip(walkTrip)}
                    </div>
                )}
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
