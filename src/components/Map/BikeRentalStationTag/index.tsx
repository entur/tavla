import React from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon, ParkIcon } from '@entur/icons'

import './styles.scss'

const BicycleTag = ({ bikes, spaces }: Props): JSX.Element => (
    <div className="bicycle-tag">
        <div className="bicycle-tag__row">
            <div className="bicycle-tag__row__icon">
                <BicycleIcon key="bike-tile-icon" color={colors.brand.white} />
            </div>
            <div className="bicycle-tag__row__amount">{bikes}</div>
        </div>
        <div className="bicycle-tag__row">
            <div className="bicycle-tag__row__icon">
                <ParkIcon key="space-tile-icon" color={colors.brand.white} />
            </div>
            <div className="bicycle-tag__row__amount">{spaces}</div>
        </div>
    </div>
)

interface Props {
    bikes: number
    spaces: number
}

export default BicycleTag
