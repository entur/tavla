import React from 'react'

import { useCounter } from '../../utils'

import './styles.scss'

const DAYS = [
    'Søndag',
    'Mandag',
    'Tirsdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lørdag',
]

const MONTHS = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
]

function Clock({ className }: Props): JSX.Element {
    useCounter()

    const now = new Date()

    const date = `${DAYS[now.getDay()]} ${now.getDate()}. ${MONTHS[now.getMonth()]}`
    const hours = `${now.getHours()}`.padStart(2, '0')
    const minutes = `${now.getMinutes()}`.padStart(2, '0')
    const time = `${hours}:${minutes}`

    return (
        <div className={`clock ${className}`}>
            <div className="clock__time">
                {time}
            </div>
            <div className="clock__date">
                {date}
            </div>
        </div>
    )
}

interface Props {
    className?: string,
}

export default Clock
