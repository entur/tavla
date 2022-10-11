import React, { useEffect, useState } from 'react'
import { Contrast } from '@entur/layout'
import { PulsatingDot } from '../../components/PulsatingDot/PulsatingDot'
import './Heading.scss'

const Heading = (): JSX.Element | null => {
    const [rightNow, setRightNow] = useState(new Date().toLocaleTimeString())

    useEffect(() => {
        const timer = setInterval(() => {
            setRightNow(new Date().toLocaleTimeString())
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    return (
        <Contrast className="heading-wrapper">
            <h1 className="JCD-heading">I nærheten</h1>
            <div className="lead-paragraph">
                <div>
                    <PulsatingDot />
                </div>
                <h3 className="JCD-last-updated">Sist oppdatert {rightNow}</h3>
            </div>
        </Contrast>
    )
}

export { Heading }
