import React from 'react'
import classes from './DepartureIcon.module.scss'

function DepartureIcon({
    icon,
    color,
    routeNumber,
}: {
    icon: JSX.Element | null
    color: string
    routeNumber: string
}) {
    return (
        <div
            className={classes.DepartureIcon}
            style={
                routeNumber.length < 3
                    ? { backgroundColor: color, minWidth: '3.5rem' }
                    : { backgroundColor: color }
            }
        >
            <div className={classes.Icon}>{icon}</div>
            <div className={classes.Departure}>{routeNumber}</div>
        </div>
    )
}

export { DepartureIcon }
