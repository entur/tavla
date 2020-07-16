import React from 'react'

import { useCounter } from '../../utils'

import './styles.scss'
import { Heading2, Paragraph } from '@entur/typography'

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

    const date = `${DAYS[now.getDay()]} ${now.getDate()}. ${
        MONTHS[now.getMonth()]
    }`
    const hours = `${now.getHours()}`.padStart(2, '0')
    const minutes = `${now.getMinutes()}`.padStart(2, '0')
    const time = `${hours}:${minutes}`

    return (
        <div className={`clock ${className}`}>
            <Heading2
                margin="none"
                className={`clock__time ${className}_time`}
                as="span"
            >
                {time}
            </Heading2>
            <Paragraph className={`clock__date ${className}__date`}>
                {date}
            </Paragraph>
        </div>
    )
}

interface Props {
    className?: string
}

export default Clock
