import React from 'react'
import { TileSubLabel } from 'src/types'
import { ValidationExclamation } from 'assets/icons/ValidationExclamation'
import { ValidationError } from 'assets/icons/ValidationError'
import classes from './SubLabelIcon.module.scss'

function SubLabelIcon({
    subLabel,
    hideSituations,
}: {
    subLabel: TileSubLabel
    hideSituations?: boolean
}) {
    if (!hideSituations && subLabel?.situation)
        return (
            <div className={classes.Situation}>
                <ValidationExclamation className={classes.Icon} />
            </div>
        )

    if (subLabel.hasCancellation)
        return (
            <div className={classes.Cancellation}>
                <ValidationError className={classes.Icon} />
            </div>
        )
    return null
}

export { SubLabelIcon }
