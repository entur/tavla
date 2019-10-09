import React, { useState, useEffect } from 'react'
import moment from 'moment'
import WhiteTavlaLogo from '../../assets/icons/whiteTavlaLogo/whiteTavlaLogo'
import './styles.scss'

function Header(): JSX.Element {
    const [date, setDate] = useState()
    const [time, setTime] = useState(moment().format('HH:mm'))

    useEffect(() => {
        const timerID = setInterval(
            () => {
                const now = moment()
                const dayOfTheWeek = now.locale('nb').format('dddd')
                const dayNumber = now.date()
                const monthName = now.locale('nb').format('MMMM')

                setDate(dayOfTheWeek.charAt(0).toUpperCase() + dayOfTheWeek.slice(1) + ' ' + dayNumber + '. ' + monthName)
                setTime(now.format('HH:mm'))
            },
            1000
        )
        return () => clearInterval(timerID)
    }, [])

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
