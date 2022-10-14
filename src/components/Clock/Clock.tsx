import React from 'react'
import classNames from 'classnames'
import { Heading2 } from '@entur/typography'
import { capitalize, useCounter } from '../../utils'
import './Clock.scss'

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
        <div className={classNames('clock', className)}>
            <Heading2
                margin="none"
                className={classNames(
                    'clock__time',
                    !!className && `${className}__time`,
                )}
                as="span"
            >
                {time}
            </Heading2>
            <span
                className={classNames(
                    'clock__date',
                    !!className && `${className}__date`,
                )}
            >
                {capitalize(date)}
            </span>
        </div>
    )
}

export { Clock }
