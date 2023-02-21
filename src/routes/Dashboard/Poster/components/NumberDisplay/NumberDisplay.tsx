import React from 'react'
import classNames from 'classnames'
import classes from './NumberDisplay.module.scss'

const NumberDisplay = ({
    numberOfVehicles,
}: NumberDisplayProps): JSX.Element => {
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

interface NumberDisplayProps {
    numberOfVehicles: number
}

export { NumberDisplay }
