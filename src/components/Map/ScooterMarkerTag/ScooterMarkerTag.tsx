import React from 'react'
import { ScooterIcon } from '@entur/icons'
import { ScooterOperatorLogo } from '../../../assets/icons/ScooterOperatorLogo'
import { Operator } from '../../../../graphql-generated/mobility-v2'
import './ScooterMarkerTag.scss'

const ScooterMarkerTag = ({ pointCount, operator }: Props): JSX.Element =>
    pointCount ? (
        <div className="cluster-marker">
            <ScooterIcon className="scooter-icon"></ScooterIcon>
            <div className="point-count">
                {pointCount < 10 ? pointCount : `${pointCount}+`}
            </div>
        </div>
    ) : (
        <ScooterOperatorLogo operator={operator} size={24} />
    )

interface Props {
    pointCount: number
    operator: Operator | null
}

export { ScooterMarkerTag }
