import React from 'react'
import './NumberDisplay.scss'

const NumberDisplay = ({
    numberOfVehicles,
}: NumberDisplayProps): JSX.Element => {
    if (numberOfVehicles > 99)
        return <span className="poster-number-display">99+</span>

    return <span>{numberOfVehicles}</span>
}

interface NumberDisplayProps {
    numberOfVehicles: number
}

export { NumberDisplay }
