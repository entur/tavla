import React from 'react'

import ValidationExclamation from '../../../../assets/icons/ValidationExclamation'
import ValidationError from '../../../../assets/icons/ValidationError'
import { TileSubLabel } from '../../../../types'

import './SubLabelIcon.scss'

function SubLabelIcon({
    subLabel,
}: {
    subLabel: TileSubLabel
}): JSX.Element | null {
    if (subLabel.hasCancellation)
        return (
            <div className="tilerow__sublabel__cancellation">
                <ValidationError />
                &nbsp;&nbsp;&nbsp;&nbsp;
                {subLabel.situation}
            </div>
        )

    if (subLabel.hasSituation)
        return (
            <div className="tilerow__sublabel__situation">
                <ValidationExclamation />
                &nbsp;&nbsp;&nbsp;&nbsp;
                {subLabel.situation}
            </div>
        )

    return null
}

export { SubLabelIcon }
