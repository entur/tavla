import React from 'react'
import { CarIcon } from '@entur/icons'

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

const CarTile = ({ numberOfCars }: CarTileProps) => (
    <div className="available-vehicles-box">
        <CarIcon />
        <NumberSpan numberOfVehicles={numberOfCars} />
    </div>
)

interface NumberSpanProps {
    numberOfVehicles: number
}

interface CarTileProps {
    numberOfCars: number
}

export { CarTile }
