import React, { useEffect, useState } from 'react'
import { PulsatingDot } from '../PulsatingDot/PulsatingDot'
import './LastUpdated.scss'

const getTimeString = (): string => {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Oslo',
    }
    const formatter = new Intl.DateTimeFormat(['nb-NO'], options)
    return formatter.format(new Date())
}

const LastUpdated = (): JSX.Element => {
    const [currentTime, setCurrentTime] = useState(getTimeString())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getTimeString())
        }, 30000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    // todo: investigate Contrast wrapper component
    // <Contrast className="heading-wrapper">

    return (
        <div className="poster-last-updated">
            <div>
                <PulsatingDot />
            </div>
            <h3 className="poster-last-updated-heading">
                Sist oppdatert {currentTime}
            </h3>
        </div>
    )
}

export { LastUpdated }
