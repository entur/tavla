import React from 'react'
import { timeUntil } from 'utils/time'
import { TransportModeIcon } from 'components/TransportModeIcon/TransportModeIcon'
import { useCounter } from 'hooks/useCounter'
import { Departure } from 'hooks/use-stop-place-with-estimated-calls/departure'
import { IconColorType } from 'src/types'
import { competitorPosition } from '../utils'
import classes from './TimelineDeparture.module.scss'

interface Props {
    departure: Departure
    iconColorType: IconColorType
}

const TimelineDeparture: React.FC<Props> = ({ departure, iconColorType }) => {
    // useCounter forces the component to rerender every second
    useCounter()
    const waitTime = timeUntil(departure.expectedDepartureTime)
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
