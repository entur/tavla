import React from 'react'
import './styles.scss'

const DepartureIcon = ({ icon, color, departure }: Props): JSX.Element => {
    return (
        <div
            className="icon-box"
            style={
                departure.length < 3
                    ? { backgroundColor: color, minWidth: '3.5rem' }
                    : { backgroundColor: color }
            }
        >
            <div className="icon-box__icon">{icon}</div>
            <div className="icon-box__departure">{departure}</div>
        </div>
    )
}

interface Props {
    icon: JSX.Element | null
    color: string
    departure: string
}

export default DepartureIcon
