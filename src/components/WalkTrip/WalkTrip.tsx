import React from 'react'
import classNames from 'classnames'
import { useSettings } from 'settings/SettingsProvider'
import { useWalkTrip } from 'hooks/use-walk-trip/useWalkTrip'
import { Coordinates } from 'src/types'
import { formatWalkTrip } from 'utils/formatting'
import classes from './WalkTrip.module.scss'

function WalkTrip({
    className,
    coordinates,
}: {
    className?: string
    coordinates: Coordinates
}) {
    const [settings] = useSettings()
    const { walkTrip } = useWalkTrip(coordinates)

    if (settings.hideWalkInfo || !walkTrip) return null

    return (
        <div className={classNames(classes.WalkTrip, className)}>
            {formatWalkTrip(walkTrip)}
        </div>
    )
}

export { WalkTrip }
