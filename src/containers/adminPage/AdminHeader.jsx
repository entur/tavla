import React, { useState, useEffect } from 'react'
import moment from 'moment'
import '../../components/header/styles.scss'
import BackButton from '../../components/backButton/BackButton.jsx'
import './styles.scss'

function AdminHeader(props) {
    const [date, setDate] = useState()
    const [time, setTime] = useState(moment().format('HH:mm'))

    const { goBackToDashboard } = props

    useEffect(() => {
        const timerID = setInterval(() => {
            const dateMoment = moment().locale('nb').format('dddd DD. MMMM')
            const newDate = dateMoment.charAt(0).toUpperCase() + dateMoment.slice(1)
            const newTime = moment().format('HH:mm')

            setDate(newDate)
            setTime(newTime)
        }, 1000)
        return () => clearInterval(timerID)
    })

    return (
        <div className="header header-container">
            <div className="admin-header">
                <BackButton className="admin-header--back-button" action={goBackToDashboard} />
                <p>Rediger tavle</p>
            </div>
            <div className="header-container--data-and-clock">
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

export default AdminHeader
