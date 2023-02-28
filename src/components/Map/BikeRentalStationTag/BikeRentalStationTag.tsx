import React from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon, ParkIcon } from '@entur/icons'
import classes from './BikeRentalStationTag.module.scss'

function BikeRentalStationTag({
    bikes,
    spaces,
}: {
    bikes: number
    spaces: number
}): JSX.Element {
    return (
        <div className={classes.BicycleTag}>
            <div className={classes.Row}>
                <div className={classes.Icon}>
                    <BicycleIcon color={colors.brand.white} />
                </div>
                <div className={classes.Amount}>{bikes}</div>
            </div>
            <div className={classes.Row}>
                <div className={classes.Icon}>
                    <ParkIcon color={colors.brand.white} />
                </div>
                <div className={classes.Amount}>{spaces}</div>
            </div>
        </div>
    )
}

export { BikeRentalStationTag }
