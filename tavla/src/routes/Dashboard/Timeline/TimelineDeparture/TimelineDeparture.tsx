import React, { useEffect, useState } from 'react'
import { timeUntil } from 'utils/time'
import { TransportModeIcon } from 'assets/icons/TransportModeIcon'
import { Departure, IconColorType } from 'src/types'
import { competitorPosition } from '../utils'
import classes from './TimelineDeparture.module.scss'

function TimelineDeparture({
    departure,
    iconColorType,
}: {
    departure: Departure
    iconColorType: IconColorType
}) {
    const [waitTime, setWaitTime] = useState(
        timeUntil(departure.expectedDepartureTime),
    )

    useEffect(() => {
        const intervalId = setInterval(
            () => setWaitTime(timeUntil(departure.expectedDepartureTime)),
            1000,
        )

        return () => clearInterval(intervalId)
    }, [departure.expectedDepartureTime])

    return (
        <div
            className={classes.Departure}
            style={{
                right: competitorPosition(waitTime),
            }}
        >
            <div className={classes.Label}>{departure.route}</div>
            <TransportModeIcon
                // Need to add a extra space ' ' because @entur/icons concatenates className
                className={` ${classes.DepartureIcon}`}
                transportMode={departure.transportMode}
                iconColorType={iconColorType}
            />
        </div>
    )
}

export { TimelineDeparture }
