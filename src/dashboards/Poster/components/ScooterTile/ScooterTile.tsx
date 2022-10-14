import React from 'react'
import { ScooterIcon } from '@entur/icons'

const NumberSpan = ({ numberOfVehicles }: NumberSpanProps): JSX.Element => {
    if (numberOfVehicles > 99)
        return (
            <span className="available-vehicles-box-overflow">
                <span className="available-vehicles-box-overflow-number">
                    99
                </span>
                <span className="available-vehicles-box-overflow-symbol">
                    +
                </span>
            </span>
        )
    return <p>{numberOfVehicles}</p>
}

const ScooterTile = ({ numberOfScooters }: ScooterTileProps): JSX.Element => (
    <div className="available-vehicles-box">
        <ScooterIcon />
        <NumberSpan numberOfVehicles={numberOfScooters} />
    </div>
)

interface NumberSpanProps {
    numberOfVehicles: number
}

interface ScooterTileProps {
    numberOfScooters: number
}

export { ScooterTile }
