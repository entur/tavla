import React from 'react'
import { ScooterIcon } from '@entur/icons'

import { Operator } from '@entur/sdk/lib/mobility/types'

import ScooterOperatorLogo from '../../../assets/icons/scooterOperatorLogo'

import './styles.scss'

const ScooterMarkerTag = ({ pointCount, operator }: Props): JSX.Element =>
    pointCount ? (
        <div className="cluster-marker">
            <ScooterIcon className="scooter-icon"></ScooterIcon>
            <div className="point-count">
                {pointCount < 10 ? pointCount : `${pointCount}+`}
            </div>
        </div>
    ) : (
        <ScooterOperatorLogo
            operator={operator}
            size={24}
        ></ScooterOperatorLogo>
    )

interface Props {
    pointCount: number
    operator: Operator | null
}

export default ScooterMarkerTag
