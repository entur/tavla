import React from 'react'
import classNames from 'classnames'
import { useSettings } from 'settings/SettingsProvider'
import { useWalkTrip } from 'logic/use-walk-trip/useWalkTrip'
import { Coordinates } from 'src/types'
import { WalkTrip as WalkTripType } from 'logic/use-walk-trip/types'
import classes from './WalkTrip.module.scss'

function formatWalkTrip(walkTrip: WalkTripType) {
    if (walkTrip.duration / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkTrip.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkTrip.duration / 60)} min å gå (${Math.ceil(
            walkTrip.walkDistance,
        )} m)`
    }
}

interface Props {
    className?: string
    coordinates: Coordinates
}

const WalkTrip: React.FC<Props> = ({ className, coordinates }) => {
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
