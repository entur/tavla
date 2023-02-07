import React from 'react'
import { TileSubLabel } from 'src/types'
import { ValidationExclamation } from 'assets/icons/ValidationExclamation'
import { ValidationError } from 'assets/icons/ValidationError'
import { isMobileWeb } from 'utils/utils'
import { SituationModal } from '../SituationModal/SituationModal'
import classes from './SubLabelIcon.module.scss'

const isMobile = isMobileWeb()

interface SubLabelIconProps {
    subLabel: TileSubLabel
    hideSituations?: boolean
}

function SubLabelIcon({
    subLabel,
    hideSituations,
}: SubLabelIconProps): JSX.Element | null {
    if (!hideSituations && subLabel?.situation)
        if (isMobile)
            return (
                <div className={classes.Situation}>
                    <SituationModal situationMessage={subLabel.situation} />
                </div>
            )
        else
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
