import React from 'react'
import classNames from 'classnames'
import classes from './Temperature.module.scss'

function Temperature({ temperature }: { temperature?: number }) {
    const isNegative = (temperature || -1) < 0

    return (
        <div
            className={classNames(
                classes.Temperature,
                isNegative ? classes.Blue : classes.Red,
            )}
        >
            {temperature !== undefined ? Math.round(temperature) + '°' : '…'}
        </div>
    )
}

export { Temperature }
