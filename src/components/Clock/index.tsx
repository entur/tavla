import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { capitalize } from 'lodash'
import { Heading2 } from '@entur/typography'
import classes from './Clock.module.scss'

function Clock({ className }: { className?: string }) {
    const [currentTime, setCurrentTime] = useState(Date.now())

    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000)

        return () => clearInterval(intervalId)
    }, [])

    const time = new Intl.DateTimeFormat('no-NB', {
        timeStyle: 'short',
    }).format(currentTime)

    const date = new Intl.DateTimeFormat('no-NB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    }).format(currentTime)

    return (
        <div className={classNames(classes.Clock, className)}>
            <Heading2 margin="none" className={classes.Time} as="span">
                {time}
            </Heading2>
            <span className={classes.Date}>{capitalize(date)}</span>
        </div>
    )
}

export { Clock }
