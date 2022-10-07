import React from 'react'

import './DepartureIcon.scss'

const DepartureIcon = ({ icon, color, routeNumber }: Props): JSX.Element => (
    <div
        className="icon-box"
        style={
            routeNumber.length < 3
                ? { backgroundColor: color, minWidth: '3.5rem' }
                : { backgroundColor: color }
        }
    >
        <div className="icon-box__icon">{icon}</div>
        <div className="icon-box__departure">{routeNumber}</div>
    </div>
)

interface Props {
    icon: JSX.Element | null
    color: string
    routeNumber: string
}

export default DepartureIcon
