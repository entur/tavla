import React from 'react'
import { ScooterIcon } from '@entur/icons'
import { ScooterOperatorLogo } from '../../../assets/icons/ScooterOperatorLogo'
import { Operator } from '../../../../graphql-generated/mobility-v2'
import classes from './ScooterMarkerTag.module.scss'

const ScooterMarkerTag = ({ pointCount, operator }: Props): JSX.Element =>
    pointCount ? (
        <div className={classes.ClusterMarker}>
            <ScooterIcon className={classes.ScooterIcon}></ScooterIcon>
            <div className={classes.PointCount}>
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
