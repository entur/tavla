import React from 'react'
import classNames from 'classnames'
import classes from './NumberDisplay.module.scss'

function NumberDisplay({ numberOfVehicles }: { numberOfVehicles: number }) {
    const isLargeNumber = numberOfVehicles > 99

    return (
        <span
            className={classNames({
                [classes.LongNumber]: isLargeNumber,
            })}
        >
            {isLargeNumber ? '99+' : numberOfVehicles.toString()}
        </span>
    )
}

export { NumberDisplay }
