import React from 'react'
import classNames from 'classnames'
import { useWalkTrip } from 'hooks/use-walk-trip/useWalkTrip'
import { Coordinates } from 'src/types'
import { formatWalkTrip } from 'utils/formatting'
import classes from './WalkTrip.module.scss'

function WalkTrip({
    className,
    coordinates,
    hideWalkInfo,
}: {
    className?: string
    coordinates: Coordinates
    hideWalkInfo: boolean
}) {
    const { walkTrip } = useWalkTrip(coordinates)

    if (hideWalkInfo || !walkTrip) return null

    return (
        <div className={classNames(classes.WalkTrip, className)}>
            {formatWalkTrip(walkTrip)}
        </div>
    )
}

export { WalkTrip }
