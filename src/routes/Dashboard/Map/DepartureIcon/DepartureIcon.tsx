import React from 'react'
import classes from './DepartureIcon.module.scss'

interface Props {
    icon: JSX.Element | null
    color: string
    routeNumber: string
}

const DepartureIcon: React.FC<Props> = ({
    icon,
    color,
    routeNumber,
}): JSX.Element => (
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

export { DepartureIcon }
