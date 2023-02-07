import React from 'react'
import classNames from 'classnames'
import { capitalize } from 'lodash'
import { useCounter } from 'hooks/useCounter'
import { Heading2 } from '@entur/typography'
import classes from './Clock.module.scss'

interface ClockProps {
    className?: string
}

function Clock({ className }: ClockProps): JSX.Element {
    // This insures that the Clock-component is updated once every second.
    useCounter()

    const now = new Date()

    const time = new Intl.DateTimeFormat('no-NB', {
        timeStyle: 'short',
    }).format(now)

    const date = new Intl.DateTimeFormat('no-NB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    }).format(now)

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
