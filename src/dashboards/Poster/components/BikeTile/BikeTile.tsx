import React from 'react'
import { CityBikeIcon } from '@entur/icons'

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

const BikeTile = ({ numberOfBikes }: BikeTileProps) => (
    <div className="poster-available-vehicles-box">
        <CityBikeIcon />
        <NumberSpan numberOfVehicles={numberOfBikes} />
    </div>
)

interface NumberSpanProps {
    numberOfVehicles: number
}

interface BikeTileProps {
    numberOfBikes: number
}

export { BikeTile }
