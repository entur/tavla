import React from 'react'
import { ScooterIcon } from '@entur/icons'

import { ScooterOperator } from '@entur/sdk'

import ScooterOperatorLogo from '../../../assets/icons/scooterOperatorLogo'

import './styles.scss'

const ScooterMarkerTag = ({ pointCount, operator }: Props): JSX.Element => {
    return pointCount ? (
        <div className="cluster-marker">
            <ScooterIcon className="scooter-icon"></ScooterIcon>
            <div className="point-count">
                {pointCount < 10 ? pointCount : `${pointCount}+`}
            </div>
        </div>
    ) : (
        <ScooterOperatorLogo logo={operator} size={24}></ScooterOperatorLogo>
    )
}

interface Props {
    pointCount: number
    operator: ScooterOperator | null
}

export default ScooterMarkerTag
