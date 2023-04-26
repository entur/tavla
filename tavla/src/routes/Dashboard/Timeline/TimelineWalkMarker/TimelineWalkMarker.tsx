import React from 'react'
import classNames from 'classnames'
import { Coordinates } from 'src/types'
import { useWalkTrip } from 'hooks/useWalkTrip'
import { WalkingIcon } from '@entur/icons'
import { competitorPosition } from '../utils'
import classes from './TimelineWalkMarker.module.scss'

function TimelineWalkMarker({
    className,
    coordinates,
}: {
    coordinates: Coordinates
    className?: string
}) {
    const { walkTrip } = useWalkTrip(coordinates)

    if (!walkTrip) return null

    return (
        <div
            className={classNames(classes.TimelineWalkMarker, className)}
            style={{
                right: walkMarkerPosition(walkTrip.duration),
            }}
        >
            <WalkingIcon className={classes.Icon} />
            <div className={classes.Line} />
        </div>
    )
}

function walkMarkerPosition(walkTime: number): number {
    const offset = 30
    const roundedWalkTime = Math.ceil(walkTime / 60) * 60
    return competitorPosition(roundedWalkTime) + offset
}

export { TimelineWalkMarker }
