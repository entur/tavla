import React, { useEffect, useState } from 'react'
import { PulsatingDot } from '../PulsatingDot/PulsatingDot'
import './LastUpdated.scss'

const LastUpdated = (): JSX.Element => {
    const [rightNow, setRightNow] = useState(new Date().toLocaleTimeString())

    useEffect(() => {
        const timer = setInterval(() => {
            setRightNow(new Date().toLocaleTimeString())
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    // todo: investigate Contrast wrapper component
    // <Contrast className="heading-wrapper">

    return (
        <div className="lead-paragraph">
            <div>
                <PulsatingDot />
            </div>
            <h3 className="poster-last-updated">Sist oppdatert {rightNow}</h3>
        </div>
    )
}

export { LastUpdated }
