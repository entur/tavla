import React from 'react'
import { ScooterOperatorLogo } from 'assets/icons/ScooterOperatorLogo'
import { Operator } from 'graphql-generated/mobility-v2'
import { ScooterIcon } from '@entur/icons'
import classes from './ScooterMarkerTag.module.scss'

function ScooterMarkerTag({
    pointCount,
    operator,
}: {
    pointCount: number
    operator: Operator | null
}) {
    return pointCount ? (
        <div className={classes.ClusterMarker}>
            <ScooterIcon className={classes.ScooterIcon}></ScooterIcon>
            <div className={classes.PointCount}>
                {pointCount < 10 ? pointCount : `${pointCount}+`}
            </div>
        </div>
    ) : (
        <ScooterOperatorLogo operator={operator} size={24} />
    )
}

export { ScooterMarkerTag }
