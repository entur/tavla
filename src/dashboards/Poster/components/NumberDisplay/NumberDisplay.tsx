import React from 'react'
import classNames from 'classnames'
import './NumberDisplay.scss'

const NumberDisplay = ({
    numberOfVehicles,
}: NumberDisplayProps): JSX.Element => {
    const isLargeNumber = numberOfVehicles > 99

    return (
        <span
            className={classNames({
                'poster-number-long': isLargeNumber,
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
