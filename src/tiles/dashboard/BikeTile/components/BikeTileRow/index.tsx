import React from 'react'
import { getTranslation } from 'utils/utils'
import { WalkTrip } from 'components/WalkTrip'
import { RentalStation } from 'types/structs'
import { Heading3 } from '@entur/typography'
import { BicycleIcon } from '@entur/icons'
import classes from './BikeTileRow.module.scss'

function BikeTileRow({
    station,
    iconColor,
    hideWalkInfo,
}: {
    station: RentalStation
    iconColor: string
    hideWalkInfo: boolean
}): JSX.Element {
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
                    hideWalkInfo={hideWalkInfo}
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
