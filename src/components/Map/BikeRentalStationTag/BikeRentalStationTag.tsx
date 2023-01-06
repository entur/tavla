import React from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon, ParkIcon } from '@entur/icons'
import classes from './BikeRentalStationTag.module.scss'

interface Props {
    bikes: number
    spaces: number
}

const BikeRentalStationTag: React.FC<Props> = ({
    bikes,
    spaces,
}): JSX.Element => (
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

export { BikeRentalStationTag }
