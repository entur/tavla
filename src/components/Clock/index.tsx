import React from 'react'
import moment from 'moment'

import { useCounter } from '../../utils'

import './styles.scss'

function Clock({ className }: Props): JSX.Element {
    useCounter()

    const now = moment()
    const dayOfTheWeek = now.locale('nb').format('dddd')
    const dayNumber = now.date()
    const monthName = now.locale('nb').format('MMMM')

    const date = dayOfTheWeek.charAt(0).toUpperCase() + dayOfTheWeek.slice(1) + ' ' + dayNumber + '. ' + monthName
    const time = now.format('HH:mm')

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
