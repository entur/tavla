import React, { useState, useEffect } from 'react'
import moment from 'moment'
import WhiteTavlaLogo from '../../assets/icons/whiteTavlaLogo/whiteTavlaLogo.js'
import './styles.scss'

function Header() {
    const [date, setDate] = useState()
    const [time, setTime] = useState(moment().format('HH:mm'))

    useEffect(() => {
        const timerID = setInterval(
            () => {
                const newDate = moment()
                const dayOfTheWeek = newDate.locale('nb').format('dddd')
                const dayNumber = newDate.date()
                const monthName = newDate.locale('nb').format('MMMM')

                setDate(dayOfTheWeek.charAt(0).toUpperCase() + dayOfTheWeek.slice(1) + ' ' + dayNumber + '. ' + monthName)
                setTime(newDate.format('HH:mm'))
            },
            1000
        )
        return () => clearInterval(timerID)
    })

    return (
        <div className="header">
            <WhiteTavlaLogo height={57} width={287}/>
            <div>
                <div className="header-time">
                    {time}
                </div>
                <div className="header-date">
                    {date}
                </div>
            </div>
        </div>
    )
}

export default Header
