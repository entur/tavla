import React, { useState, useEffect } from 'react'
import moment from 'moment'

import './styles.scss'

function Clock(): JSX.Element {
    const [date, setDate] = useState()
    const [time, setTime] = useState(moment().format('HH:mm'))

    useEffect(() => {
        const timerID = setInterval(() => {
            const now = moment()
            const dayOfTheWeek = now.locale('nb').format('dddd')
            const dayNumber = now.date()
            const monthName = now.locale('nb').format('MMMM')

            setDate(dayOfTheWeek.charAt(0).toUpperCase() + dayOfTheWeek.slice(1) + ' ' + dayNumber + '. ' + monthName)
            setTime(now.format('HH:mm'))
        },
        1000)
        return (): void => clearInterval(timerID)
    }, [])

    return (
        <div className="clock">
            <div className="clock__time">
                {time}
            </div>
            <div className="clock__date">
                {date}
            </div>
        </div>
    )
}

export default Clock
